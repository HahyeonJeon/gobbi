/**
 * Workflow graph loader + static-analysis kernel.
 *
 * Reads `packages/cli/src/specs/index.json` — the canonical workflow graph
 * file — into an immutable `WorkflowGraph` value. Exposes lookup helpers
 * (`getStepById`, `getTransitions`, `getIncomingTransitions`) and a
 * lightweight analyzer (`analyzeGraph`) that returns dead steps, cycles,
 * and unreachable steps.
 *
 * Authoritative spec: `v050-prompts.md` §Workflow Graph and
 * `v050-state-machine.md` §Transition Table. The transitions in
 * `index.json` are a flattened view of every row in the design-doc
 * transition table, tagged with a `feedback` flag for intended cycles
 * (evaluation loop-backs, user skip) so the analyzer can distinguish
 * them from structural defects.
 *
 * Loader contract:
 *
 * - Async (matches `loadSkills` + `selectPriorArtifacts` conventions).
 * - Tolerant of missing `spec.json` files referenced from `steps[]` —
 *   emits a `console.warn` per missing file and leaves the step in the
 *   graph. B.1 populates the missing spec files in a later PR; B.4
 *   (`gobbi workflow validate`) will later upgrade the warning to a hard
 *   error where appropriate.
 * - Throws `SyntaxError` when the JSON file itself is malformed — there
 *   is no recovery from an unparseable graph.
 * - Throws a clear diagnostic `Error` when the parsed shape fails the
 *   structural type guard — callers must not proceed with an invalid
 *   graph.
 *
 * Static analysis kernel (`analyzeGraph`):
 *
 * - `deadSteps`    — steps in `steps[]` that have NO outgoing transitions
 *                    and are not declared `terminal`. These are structural
 *                    dead ends that would wedge the workflow.
 * - `cycles`       — strongly-connected components with more than one
 *                    step, OR a self-loop. Each entry is the cycle in
 *                    discovery order. Transitions marked `feedback: true`
 *                    are excluded from cycle discovery — they are the
 *                    INTENDED loops and must not register as defects.
 * - `unreachableSteps` — steps in `steps[]` that cannot be reached from
 *                    `entry` via a directed walk over transitions. The
 *                    entry step itself is always reachable.
 *
 * B.4's `gobbi workflow validate` command consumes this analysis, adds
 * predicate-reference validation (B.3), and formats the output for
 * human/JSON consumption. A.10 ships the kernel only — the command wiring
 * is out of scope.
 *
 * Design note: transitions can target steps outside `steps[]` — namely the
 * CLI lifecycle states `done`, `error`, `idle`. Those targets are NOT graph
 * nodes and do not participate in cycle detection or reachability analysis;
 * they are lifecycle sinks that terminate a traversal.
 */

import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';

import { isRecord, isString, isNumber, isBoolean, isArray } from '../lib/guards.js';
import { getGraphPath } from './paths.js';

// ---------------------------------------------------------------------------
// Public types
//
// Kept colocated with the loader rather than in `types.ts` because the graph
// is a specs-level concept (one file per package) with no reuse outside
// this module. `types.ts` is reserved for per-step `spec.json` shapes.
// ---------------------------------------------------------------------------

/**
 * One step entry in the workflow graph.
 *
 * `spec` is a relative path from `index.json`'s directory (e.g.
 * `./ideation/spec.json`). Evaluation steps (`ideation_eval`, `planning_eval`,
 * `execution_eval`) share a single `./evaluation/spec.json` and carry an
 * `evalFor` discriminator identifying the step they evaluate.
 *
 * `substates` lists valid substate identifiers for steps that track an
 * internal substate in `state.currentSubstate`. Ideation has
 * `['discussing', 'researching']`; other steps omit the field.
 */
export interface StepDefinition {
  readonly id: string;
  readonly spec: string;
  readonly substates?: readonly string[];
  /** For evaluation steps: the step ID this eval step evaluates. */
  readonly evalFor?: string;
}

/**
 * One edge in the workflow graph. `from` and `to` are step IDs (or CLI
 * lifecycle sinks `done`/`error`/`idle` in the `to` position).
 *
 * `condition` names a predicate from the CLI's predicate registry. B.3's
 * codegen will later narrow this to a branded `PredicateName` type.
 *
 * `trigger` names the event type that drives the transition — mirrors the
 * Trigger column of `v050-state-machine.md` §Transition Table.
 *
 * `feedback` marks INTENDED loops (evaluation revise loop-backs, user
 * skip). The analyzer excludes feedback edges from cycle detection.
 *
 * `label` is optional human-readable text for debug output.
 */
export interface GraphTransition {
  readonly from: string;
  readonly to: string;
  readonly condition: string;
  readonly trigger?: string;
  readonly feedback?: boolean;
  readonly label?: string;
}

/**
 * The parsed shape of `specs/index.json`.
 *
 * `entry` is the step the workflow begins at after `workflow.start`
 * (typically `'ideation'`). `terminal` lists productive steps whose
 * completion ends the workflow (after `memorization` the CLI writes
 * `workflow.finish` and moves to the lifecycle `done` state).
 */
export interface WorkflowGraph {
  readonly $schema?: string;
  readonly version: number;
  readonly entry: string;
  readonly terminal: readonly string[];
  readonly steps: readonly StepDefinition[];
  readonly transitions: readonly GraphTransition[];
}

/**
 * Result of `analyzeGraph`. Every field is a sorted array for deterministic
 * comparison across runs. `cycles` entries are sorted alphabetically within
 * each cycle (the cycle-member set is what matters for defect reporting,
 * not the traversal order).
 */
export interface GraphAnalysis {
  readonly deadSteps: readonly string[];
  readonly cycles: readonly (readonly string[])[];
  readonly unreachableSteps: readonly string[];
}

// ---------------------------------------------------------------------------
// Default path resolution
//
// The canonical `index.json` lives next to `paths.ts` in `src/specs/` at
// author time and next to the bundled `cli.js` at `dist/specs/index.json`
// after `build:safe`. `paths.ts` owns the runtime fallback chain — see
// its module JSDoc for the resolution policy. Tests override this via the
// `path` argument to `loadGraph`.
// ---------------------------------------------------------------------------

/** Absolute path to the committed `index.json`. */
export const DEFAULT_GRAPH_PATH: string = getGraphPath();

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

/**
 * Load and parse the workflow graph from disk.
 *
 * @param path Absolute or relative path to the graph JSON. Defaults to
 *   the committed `specs/index.json`.
 * @throws SyntaxError   when the file contents are not valid JSON.
 * @throws Error         when the parsed value does not satisfy the
 *                       `WorkflowGraph` shape contract.
 *
 * Missing `spec.json` files referenced from `steps[]` DO NOT throw — the
 * loader emits a `console.warn` per missing file. B.4's validate command
 * will later choose whether to surface those as errors.
 */
export async function loadGraph(path?: string): Promise<WorkflowGraph> {
  const graphPath = resolveGraphPath(path);
  const raw = await readFile(graphPath, 'utf8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new SyntaxError(
      `[graph] failed to parse ${graphPath}: ${message}`,
    );
  }

  if (!isWorkflowGraph(parsed)) {
    throw new Error(
      `[graph] ${graphPath} does not match the WorkflowGraph shape — ` +
        `expected { version, entry, terminal[], steps[], transitions[] }`,
    );
  }

  // Best-effort check that each step's spec file exists. Missing files are
  // expected during Phase 2 (A.7 creates one spec, B.1 creates the rest).
  // Warn only — never throw from here.
  await warnOnMissingSpecFiles(parsed, graphPath);

  return parsed;
}

function resolveGraphPath(path: string | undefined): string {
  if (path === undefined) return DEFAULT_GRAPH_PATH;
  if (isAbsolute(path)) return path;
  return resolve(process.cwd(), path);
}

async function warnOnMissingSpecFiles(
  graph: WorkflowGraph,
  graphPath: string,
): Promise<void> {
  const graphDir = dirname(graphPath);
  // Steps frequently share the same spec file (all three eval steps point
  // at `./evaluation/spec.json`). Deduplicate so the warning fires once.
  const seen = new Set<string>();
  for (const step of graph.steps) {
    const abs = resolve(graphDir, step.spec);
    if (seen.has(abs)) continue;
    seen.add(abs);
    try {
      // Read one byte is cheaper than stat on Bun and handles ENOENT + EACCES
      // uniformly. The contents are not consumed.
      await readFile(abs);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        console.warn(
          `[graph] spec file referenced by step(s) is missing: ${abs} — ` +
            `this is expected during Phase 2 rollout; B.1 creates step spec files`,
        );
      } else {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[graph] could not access ${abs}: ${message}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Shape validation
//
// Plain-object guard — mirrors the pattern in `state-derivation.ts::isValidState`.
// No third-party schema library is pulled in here; ajv lands in A.6 for
// per-step `spec.json` files. The graph shape is small enough to validate
// in-place.
// ---------------------------------------------------------------------------

function isWorkflowGraph(value: unknown): value is WorkflowGraph {
  if (!isRecord(value)) return false;

  if (!isNumber(value['version'])) return false;
  if (!isString(value['entry'])) return false;

  if (!isArray(value['terminal'])) return false;
  for (const t of value['terminal']) {
    if (!isString(t)) return false;
  }

  if (!isArray(value['steps'])) return false;
  for (const step of value['steps']) {
    if (!isStepDefinition(step)) return false;
  }

  if (!isArray(value['transitions'])) return false;
  for (const tr of value['transitions']) {
    if (!isGraphTransition(tr)) return false;
  }

  // $schema is optional.
  const schemaField = value['$schema'];
  if (schemaField !== undefined && !isString(schemaField)) return false;

  return true;
}

function isStepDefinition(value: unknown): value is StepDefinition {
  if (!isRecord(value)) return false;
  if (!isString(value['id'])) return false;
  if (!isString(value['spec'])) return false;

  const substates = value['substates'];
  if (substates !== undefined) {
    if (!isArray(substates)) return false;
    for (const s of substates) {
      if (!isString(s)) return false;
    }
  }

  const evalFor = value['evalFor'];
  if (evalFor !== undefined && !isString(evalFor)) return false;

  return true;
}

function isGraphTransition(value: unknown): value is GraphTransition {
  if (!isRecord(value)) return false;
  if (!isString(value['from'])) return false;
  if (!isString(value['to'])) return false;
  if (!isString(value['condition'])) return false;

  const trigger = value['trigger'];
  if (trigger !== undefined && !isString(trigger)) return false;

  const feedback = value['feedback'];
  if (feedback !== undefined && !isBoolean(feedback)) return false;

  const label = value['label'];
  if (label !== undefined && !isString(label)) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Return the step definition with the given ID, or `undefined` when no
 * matching step exists. Intentionally returns `undefined` (not null) to
 * match TypeScript's `Array.prototype.find` idiom used at call sites.
 */
export function getStepById(
  graph: WorkflowGraph,
  stepId: string,
): StepDefinition | undefined {
  return graph.steps.find((step) => step.id === stepId);
}

/**
 * Return the outgoing transitions from the given step ID. Includes every
 * edge regardless of its `feedback` flag — callers filter as needed.
 * Ordering matches the `transitions[]` array in `index.json`.
 */
export function getTransitions(
  graph: WorkflowGraph,
  fromStep: string,
): readonly GraphTransition[] {
  return graph.transitions.filter((tr) => tr.from === fromStep);
}

/**
 * Return the incoming transitions to the given step ID. Symmetric
 * counterpart to `getTransitions`.
 */
export function getIncomingTransitions(
  graph: WorkflowGraph,
  toStep: string,
): readonly GraphTransition[] {
  return graph.transitions.filter((tr) => tr.to === toStep);
}

// ---------------------------------------------------------------------------
// Static analysis
//
// Three lightweight checks forming the kernel of `gobbi workflow validate`:
//
//   1. Dead steps — nodes in `steps[]` with no outgoing transitions AND not
//      declared `terminal`.
//   2. Cycles     — strongly-connected components discovered via Tarjan's
//      algorithm, EXCLUDING transitions flagged `feedback: true`. The
//      intended evaluation-loop and skip edges are marked feedback so the
//      analyzer does not report them as defects.
//   3. Unreachable — nodes in `steps[]` not reachable from `entry` via a
//      directed walk over ALL transitions (including feedback — they are
//      legitimate edges for reachability, just not for cycle classification).
//
// B.4 extends this with predicate-reference checks (via B.3's registry)
// and JSON-Schema validation (via A.6's `JSONSchemaType<StepSpec>`).
// ---------------------------------------------------------------------------

/**
 * Run static graph analysis. Returns dead steps, cycles (excluding
 * intended feedback loops), and unreachable steps. Pure — no disk or
 * network I/O, safe to call repeatedly.
 */
export function analyzeGraph(graph: WorkflowGraph): GraphAnalysis {
  const stepIds = new Set(graph.steps.map((s) => s.id));
  const terminalSet = new Set(graph.terminal);

  return {
    deadSteps: findDeadSteps(graph, stepIds, terminalSet),
    cycles: findCycles(graph, stepIds),
    unreachableSteps: findUnreachableSteps(graph, stepIds),
  };
}

function findDeadSteps(
  graph: WorkflowGraph,
  stepIds: ReadonlySet<string>,
  terminalSet: ReadonlySet<string>,
): readonly string[] {
  const dead: string[] = [];
  for (const step of graph.steps) {
    if (terminalSet.has(step.id)) continue;
    const outgoing = graph.transitions.filter((tr) => tr.from === step.id);
    if (outgoing.length === 0) {
      dead.push(step.id);
      continue;
    }
    // A step with outgoing transitions that ALL target sinks outside
    // `steps[]` still counts as productive (its completion drains to a
    // lifecycle sink like `done`/`error`). No further classification.
    void stepIds;
  }
  return dead.slice().sort();
}

/**
 * Tarjan's SCC with feedback-edge filtering. Returns each non-trivial SCC
 * (size > 1 OR a self-loop) in the graph formed by non-feedback edges
 * whose endpoints are both in `steps[]`.
 */
function findCycles(
  graph: WorkflowGraph,
  stepIds: ReadonlySet<string>,
): readonly (readonly string[])[] {
  // Build adjacency for non-feedback intra-steps edges.
  const adjacency = new Map<string, string[]>();
  for (const step of graph.steps) {
    adjacency.set(step.id, []);
  }
  for (const tr of graph.transitions) {
    if (tr.feedback === true) continue;
    if (!stepIds.has(tr.from) || !stepIds.has(tr.to)) continue;
    const neighbours = adjacency.get(tr.from);
    if (neighbours !== undefined) neighbours.push(tr.to);
  }

  // Tarjan's algorithm.
  const indices = new Map<string, number>();
  const lowlinks = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  let index = 0;
  const sccs: string[][] = [];

  function strongconnect(v: string): void {
    indices.set(v, index);
    lowlinks.set(v, index);
    index += 1;
    stack.push(v);
    onStack.add(v);

    const successors = adjacency.get(v) ?? [];
    for (const w of successors) {
      if (!indices.has(w)) {
        strongconnect(w);
        const lowV = lowlinks.get(v) ?? index;
        const lowW = lowlinks.get(w) ?? index;
        lowlinks.set(v, Math.min(lowV, lowW));
      } else if (onStack.has(w)) {
        const lowV = lowlinks.get(v) ?? index;
        const idxW = indices.get(w) ?? index;
        lowlinks.set(v, Math.min(lowV, idxW));
      }
    }

    if ((lowlinks.get(v) ?? -1) === (indices.get(v) ?? -2)) {
      const component: string[] = [];
      // Drain the stack down to v.
      for (;;) {
        const w = stack.pop();
        if (w === undefined) break;
        onStack.delete(w);
        component.push(w);
        if (w === v) break;
      }
      sccs.push(component);
    }
  }

  for (const stepId of adjacency.keys()) {
    if (!indices.has(stepId)) {
      strongconnect(stepId);
    }
  }

  // Filter to non-trivial SCCs. A size-1 SCC counts only if it has a
  // self-loop in the non-feedback adjacency.
  const cycles: string[][] = [];
  for (const component of sccs) {
    if (component.length > 1) {
      cycles.push(component.slice().sort());
      continue;
    }
    // Size 1 — check for self-loop.
    const only = component[0];
    if (only === undefined) continue;
    const successors = adjacency.get(only) ?? [];
    if (successors.includes(only)) {
      cycles.push([only]);
    }
  }

  // Sort cycles for deterministic ordering.
  cycles.sort((a, b) => {
    const aKey = a.join(',');
    const bKey = b.join(',');
    return aKey.localeCompare(bKey);
  });

  return cycles;
}

function findUnreachableSteps(
  graph: WorkflowGraph,
  stepIds: ReadonlySet<string>,
): readonly string[] {
  const adjacency = new Map<string, string[]>();
  for (const step of graph.steps) {
    adjacency.set(step.id, []);
  }
  // Include ALL transitions (feedback included) — reachability treats any
  // edge as a legitimate way to reach a step. A step only reachable via a
  // feedback loop is still reachable.
  for (const tr of graph.transitions) {
    if (!stepIds.has(tr.from) || !stepIds.has(tr.to)) continue;
    const neighbours = adjacency.get(tr.from);
    if (neighbours !== undefined) neighbours.push(tr.to);
  }

  const reachable = new Set<string>();
  // The entry step is always reachable by definition. If it is absent
  // from `steps[]` every step is unreachable — a structural defect the
  // analyzer surfaces without a separate "no entry" field.
  if (stepIds.has(graph.entry)) {
    const frontier: string[] = [graph.entry];
    while (frontier.length > 0) {
      const current = frontier.pop();
      if (current === undefined) break;
      if (reachable.has(current)) continue;
      reachable.add(current);
      const successors = adjacency.get(current) ?? [];
      for (const next of successors) {
        if (!reachable.has(next)) frontier.push(next);
      }
    }
  }

  const unreachable: string[] = [];
  for (const step of graph.steps) {
    if (!reachable.has(step.id)) unreachable.push(step.id);
  }
  return unreachable.slice().sort();
}
