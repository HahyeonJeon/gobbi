/**
 * gobbi workflow validate — spec library + overlay + graph + predicate linter.
 *
 * Runs the full static-validation matrix over a step-spec directory and emits
 * `Diagnostic[]` for every violation. Default output is JSON (one object per
 * invocation, with `diagnostics` and `summary` fields) for machine consumers;
 * `--human` produces a grouped, color-respecting report for interactive use.
 *
 * ## Exit semantics
 *
 * - `0` — no `error`-severity diagnostics (warnings alone do not fail).
 * - `1` — at least one `error`-severity diagnostic.
 * - `2` — catastrophic invocation error (unreadable graph, malformed args).
 *
 * ## Stable error codes
 *
 * Ten codes are stable across versions — their meanings are documented in
 * `.claude/project/gobbi/reference/validate-codes.md`. Changing a code's
 * meaning is a breaking change.
 *
 *   E001_INVALID_SCHEMA        — spec or overlay fails ajv (v1 schema)
 *   E002_UNKNOWN_PREDICATE     — reference to a predicate not in the registry
 *   E003_INVALID_GRAPH         — cycle, unreachable node, or unresolved target
 *   E004_MISSING_SPEC          — graph names a step whose spec file is missing
 *   E005_INVALID_OVERLAY       — overlay produces a spec that fails schema
 *   E006_UNKNOWN_SUBSTATE      — overlay keyed to a substate the spec does not declare
 *   E007_ORPHAN_SUBSTATE       — spec declares a substate with no overlay file (warning)
 *   E008_DUPLICATE_REGISTRATION — registry exports a predicate name twice
 *   E009_DEAD_PREDICATE        — registered predicate never referenced in any spec/overlay/graph (warning)
 *   E010_VERDICT_PREDICATE_AS_CONDITION — verdictPass/verdictRevise used as a step-transition condition (warning)
 *
 * @see `.claude/project/gobbi/reference/validate-codes.md`
 * @see `specs/assembly.ts` — validateSpecPredicateReferences, validateGraphPredicateReferences
 * @see `specs/graph.ts`    — loadGraph, analyzeGraph
 * @see `specs/overlay.ts`  — validateOverlay, applyOverlay
 * @see `workflow/predicates.ts` — defaultPredicates, PREDICATE_NAMES
 */

import { parseArgs } from 'node:util';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateStepSpec } from '../../specs/_schema/v1.js';
import {
  validateSpecPredicateReferences,
  validateGraphPredicateReferences,
} from '../../specs/assembly.js';
import {
  analyzeGraph,
  loadGraph,
  type GraphAnalysis,
  type WorkflowGraph,
} from '../../specs/graph.js';
import {
  applyOverlay,
  OverlayError,
  validateOverlay,
} from '../../specs/overlay.js';
import type { StepSpec } from '../../specs/types.js';
import {
  ADVISORY_PREDICATE_NAMES,
  NON_SPEC_PREDICATE_NAMES,
  defaultPredicates,
  PREDICATE_NAMES,
} from '../../workflow/predicates.js';
import {
  CODE_SEVERITY,
  type Diagnostic,
  type DiagnosticCode,
  type DiagnosticLocation,
  type DiagnosticSeverity,
} from '../../workflow/diagnostics.js';
import { bold, dim, red, yellow } from '../../lib/style.js';

// ---------------------------------------------------------------------------
// Public diagnostic shape
//
// Emitted as JSON and consumed by tooling. Every field is stable across
// versions; adding a field is backwards-compatible, renaming or removing a
// field is a breaking change.
//
// The canonical shapes live in `workflow/diagnostics.ts` — this module
// re-exports them plus the back-compat `ValidateCode` alias that pre-C.8
// consumers import.
// ---------------------------------------------------------------------------

export { CODE_SEVERITY };
export type { Diagnostic, DiagnosticLocation, DiagnosticSeverity };

/**
 * Back-compat alias for the validate-only subset of `DiagnosticCode`. Kept
 * so pre-C.8 importers (tests, downstream consumers) continue to type-check.
 * All validate codes are `E###`-prefixed today and the alias re-exports the
 * full `DiagnosticCode` union — runtime `W###` / reserved `X###` / `V###`
 * members are structurally compatible but never produced by validate.
 */
export type ValidateCode = DiagnosticCode;

export interface ValidateSummary {
  readonly errorCount: number;
  readonly warningCount: number;
}

export interface ValidateReport {
  readonly diagnostics: readonly Diagnostic[];
  readonly summary: ValidateSummary;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface ValidateOptions {
  /**
   * Root directory to scan for specs/overlays. The graph file at `<dir>/index.json`
   * is the entry point. Defaults to the module-relative `packages/cli/src/specs/`
   * (matching `DEFAULT_GRAPH_PATH` from `specs/graph.ts`).
   */
  readonly dir?: string;

  /** Human-readable output instead of JSON. */
  readonly human?: boolean;
}

// ---------------------------------------------------------------------------
// Default spec directory — module-relative for cwd independence (mirrors the
// `DEFAULT_GRAPH_PATH` convention established in B.3 M4).
// ---------------------------------------------------------------------------

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the committed `packages/cli/src/specs/` directory. */
export const DEFAULT_SPECS_DIR: string = resolve(
  THIS_DIR,
  '..',
  '..',
  'specs',
);

// ---------------------------------------------------------------------------
// Entry point — called from the workflow dispatcher with the argv slice that
// follows the `validate` token.
// ---------------------------------------------------------------------------

/**
 * CLI entry point. Parses flags, runs the validator, and writes output.
 * Always calls `process.exit` with the appropriate code; never returns via
 * the normal promise-resolved path when a validation error is present.
 */
export async function runValidate(args: string[]): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow validate: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const options: ValidateOptions = {
    human: values.human === true,
    ...(typeof values.dir === 'string' ? { dir: values.dir } : {}),
  };

  const report = await validate(options);

  if (options.human === true) {
    process.stdout.write(renderHuman(report));
  } else {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }

  process.exit(report.summary.errorCount > 0 ? 1 : 0);
}

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  human: { type: 'boolean', default: false },
  dir: { type: 'string' },
} as const;

const USAGE = `Usage: gobbi workflow validate [options]

Runs the full static-validation matrix over the step-spec library,
producing JSON diagnostics by default.

Options:
  --dir <path>   Root directory to scan for specs (defaults to the committed
                 packages/cli/src/specs/)
  --human        Human-readable output instead of JSON
  --help, -h     Show this help message

Exit codes:
  0  no error-severity diagnostics (warnings alone do not fail)
  1  at least one error-severity diagnostic
  2  invocation error (unreadable graph, malformed args)

Stable error codes are documented in
.claude/project/gobbi/reference/validate-codes.md`;

// ---------------------------------------------------------------------------
// Library entry point — pure, returns a structured report. `runValidate`
// wraps this for CLI use; tests consume `validate()` directly.
// ---------------------------------------------------------------------------

/**
 * Run every validator and return the aggregated report. Pure with respect to
 * the filesystem at the point of call — re-running against the same tree
 * produces the same diagnostics unless the tree changed.
 */
export async function validate(
  options: ValidateOptions = {},
): Promise<ValidateReport> {
  const specsDir = resolveSpecsDir(options.dir);
  const diagnostics: Diagnostic[] = [];

  // (E009) Accumulates every predicate name referenced by any spec, overlay
  // (base+overlay merged result), or graph edge. Computed globally across
  // all steps so a predicate used in any one step is never flagged as dead.
  // Filled by the per-step loop below; consumed after the loop.
  const referencedPredicateNames = new Set<string>();

  // (E008) Defensive check — registry duplication. The `satisfies`
  // clause in workflow/predicates.ts should catch this at compile time,
  // but the runtime check is a safety net for hand-crafted registries.
  const dupes = findDuplicatePredicates(PREDICATE_NAMES);
  for (const name of dupes) {
    diagnostics.push({
      code: 'E008_DUPLICATE_REGISTRATION',
      severity: CODE_SEVERITY.E008_DUPLICATE_REGISTRATION,
      message: `predicate name "${name}" is registered more than once`,
      location: { file: predicatesGeneratedPath(), pointer: null },
    });
  }

  // Load graph — fatal if malformed. Capture warnings-as-noise from the
  // graph loader and swallow them; the validator itself emits E004 for
  // missing specs, so we don't need the loader's advisory.
  let graph: WorkflowGraph;
  const graphPath = join(specsDir, 'index.json');
  const origWarn = console.warn;
  try {
    console.warn = (): void => {};
    graph = await loadGraph(graphPath);
  } catch (err) {
    console.warn = origWarn;
    const message = err instanceof Error ? err.message : String(err);
    diagnostics.push({
      code: 'E003_INVALID_GRAPH',
      severity: CODE_SEVERITY.E003_INVALID_GRAPH,
      message: `failed to load workflow graph: ${message}`,
      location: { file: graphPath, pointer: null },
    });
    return toReport(diagnostics);
  } finally {
    console.warn = origWarn;
  }

  // (E009) Collect predicate references from graph transitions. The graph
  // is the authoritative edge list for the workflow state machine; every
  // edge condition is a "use" for dead-predicate detection.
  collectPredicateReferencesInValue(graph.transitions, referencedPredicateNames);

  // Validate graph against predicate registry (E002).
  {
    const errs = validateGraphPredicateReferences(
      graph,
      defaultPredicates,
      graphPath,
    );
    for (const msg of errs) {
      diagnostics.push({
        code: 'E002_UNKNOWN_PREDICATE',
        severity: CODE_SEVERITY.E002_UNKNOWN_PREDICATE,
        message: stripLabelPrefix(msg, graphPath),
        location: {
          file: graphPath,
          pointer: pointerForGraphEdge(graph, msg),
        },
      });
    }
  }

  // Graph topology (E003) — cycles, unreachable nodes, and unresolved targets.
  {
    const analysis: GraphAnalysis = analyzeGraph(graph);
    for (const stepId of analysis.deadSteps) {
      diagnostics.push({
        code: 'E003_INVALID_GRAPH',
        severity: CODE_SEVERITY.E003_INVALID_GRAPH,
        message: `step "${stepId}" has no outgoing transitions and is not listed as terminal`,
        location: { file: graphPath, pointer: pointerForStep(graph, stepId) },
      });
    }
    for (const stepId of analysis.unreachableSteps) {
      diagnostics.push({
        code: 'E003_INVALID_GRAPH',
        severity: CODE_SEVERITY.E003_INVALID_GRAPH,
        message: `step "${stepId}" is unreachable from entry "${graph.entry}"`,
        location: { file: graphPath, pointer: pointerForStep(graph, stepId) },
      });
    }
    for (const cycle of analysis.cycles) {
      diagnostics.push({
        code: 'E003_INVALID_GRAPH',
        severity: CODE_SEVERITY.E003_INVALID_GRAPH,
        message: `cycle detected among non-feedback transitions: ${cycle.join(' → ')}${cycle.length === 1 ? ' (self-loop)' : ''}`,
        location: { file: graphPath, pointer: null },
      });
    }

    // Duplicate step IDs — not covered by `analyzeGraph`; a structural
    // defect that would make `getStepById` unreliable.
    const seenIds = new Set<string>();
    for (const step of graph.steps) {
      if (seenIds.has(step.id)) {
        diagnostics.push({
          code: 'E003_INVALID_GRAPH',
          severity: CODE_SEVERITY.E003_INVALID_GRAPH,
          message: `duplicate step id "${step.id}" in graph.steps[]`,
          location: {
            file: graphPath,
            pointer: pointerForStep(graph, step.id),
          },
        });
      }
      seenIds.add(step.id);
    }

    // Transitions whose `to` targets a step not in `steps[]` and not a
    // known lifecycle sink (done, error, idle).
    const stepIds = new Set(graph.steps.map((s) => s.id));
    const LIFECYCLE_SINKS = new Set<string>(['done', 'error', 'idle']);
    graph.transitions.forEach((edge, index) => {
      if (!stepIds.has(edge.to) && !LIFECYCLE_SINKS.has(edge.to)) {
        diagnostics.push({
          code: 'E003_INVALID_GRAPH',
          severity: CODE_SEVERITY.E003_INVALID_GRAPH,
          message: `transition ${edge.from} → ${edge.to} targets an unknown step (not in steps[] and not a lifecycle sink)`,
          location: { file: graphPath, pointer: `/transitions/${index}/to` },
        });
      }
      if (!stepIds.has(edge.from) && !LIFECYCLE_SINKS.has(edge.from)) {
        diagnostics.push({
          code: 'E003_INVALID_GRAPH',
          severity: CODE_SEVERITY.E003_INVALID_GRAPH,
          message: `transition ${edge.from} → ${edge.to} originates from an unknown step`,
          location: { file: graphPath, pointer: `/transitions/${index}/from` },
        });
      }
    });
  }

  // Per-step validation — specs, overlays, cross-cutting checks.
  const specCache = new Map<string, StepSpec>();
  for (const step of graph.steps) {
    const specPath = resolveSpecPath(graphPath, step.spec);

    // Path containment — reject spec paths that escape the specs directory.
    // A crafted index.json at a user-supplied --dir could otherwise point to
    // arbitrary filesystem paths via absolute or parent-traversal values.
    if (specPath !== specsDir && !specPath.startsWith(specsDir + sep)) {
      diagnostics.push({
        code: 'E003_INVALID_GRAPH',
        severity: CODE_SEVERITY.E003_INVALID_GRAPH,
        message: `graph step "${step.id}" spec path "${step.spec}" resolves outside the specs directory`,
        location: { file: graphPath, pointer: pointerForStep(graph, step.id) },
      });
      continue;
    }

    const relLabel = relative(specsDir, specPath);

    // (E004) Missing spec file.
    let raw: string;
    try {
      raw = await readFile(specPath, 'utf8');
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        diagnostics.push({
          code: 'E004_MISSING_SPEC',
          severity: CODE_SEVERITY.E004_MISSING_SPEC,
          message: `graph step "${step.id}" references missing spec file ${relLabel}`,
          location: { file: specPath, pointer: null },
        });
      } else {
        const message = err instanceof Error ? err.message : String(err);
        diagnostics.push({
          code: 'E004_MISSING_SPEC',
          severity: CODE_SEVERITY.E004_MISSING_SPEC,
          message: `graph step "${step.id}" spec file ${relLabel} could not be read: ${message}`,
          location: { file: specPath, pointer: null },
        });
      }
      continue;
    }

    // If already cached (evaluation/spec.json is shared by 3 eval nodes),
    // skip re-validating the schema and predicate references — but still
    // run the cross-cutting per-step checks below.
    let spec = specCache.get(specPath);
    if (spec === undefined) {
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(raw);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        diagnostics.push({
          code: 'E001_INVALID_SCHEMA',
          severity: CODE_SEVERITY.E001_INVALID_SCHEMA,
          message: `spec file is not valid JSON: ${message}`,
          location: { file: specPath, pointer: null },
        });
        continue;
      }

      // (E001) Schema + cross-ref validation.
      const result = validateStepSpec(parsedJson);
      if (!result.ok) {
        for (const errObj of result.errors) {
          diagnostics.push({
            code: 'E001_INVALID_SCHEMA',
            severity: CODE_SEVERITY.E001_INVALID_SCHEMA,
            message: `${errObj.instancePath || '<root>'}: ${errObj.message ?? 'invalid'}`,
            location: {
              file: specPath,
              pointer: errObj.instancePath.length > 0 ? errObj.instancePath : null,
            },
          });
        }
        continue;
      }
      spec = result.value;
      specCache.set(specPath, spec);

      // (E002) Predicate references in the spec.
      const errs = validateSpecPredicateReferences(
        spec,
        defaultPredicates,
        specPath,
      );
      for (const msg of errs) {
        diagnostics.push({
          code: 'E002_UNKNOWN_PREDICATE',
          severity: CODE_SEVERITY.E002_UNKNOWN_PREDICATE,
          message: stripLabelPrefix(msg, specPath),
          location: {
            file: specPath,
            pointer: pointerForSpecPredicate(spec, msg),
          },
        });
      }

      // (E009 collection) Walk the base spec to harvest every referenced
      // predicate name. Overlay-introduced references are collected further
      // down after applyOverlay succeeds. Scoped to the cache-miss branch so
      // the shared evaluation spec contributes refs exactly once.
      collectPredicateReferencesInValue(spec, referencedPredicateNames);

      // (E010) Verdict predicate used as a step-transition condition. Walks
      // the BASE spec's transitions[] — the dynamic-spec safety net for the
      // `Exclude<PredicateName, VerdictPredicateName>` tsc gate on
      // `TransitionRule.condition`. Verdict routing belongs in the `verdict`
      // slot matched against EvalVerdictData payload, not in the condition
      // predicate. Warning-severity: authoring signal, not exit-code failure.
      // Scoped to the cache-miss branch to dedupe across the 3 `*_eval`
      // graph steps that share `evaluation/spec.json`.
      spec.transitions.forEach((transition, index) => {
        if (VERDICT_PREDICATE_NAMES.has(transition.condition)) {
          diagnostics.push({
            code: 'E010_VERDICT_PREDICATE_AS_CONDITION',
            severity: CODE_SEVERITY.E010_VERDICT_PREDICATE_AS_CONDITION,
            message: `transition -> ${transition.to} uses verdict predicate "${transition.condition}" as a condition; verdict predicates must route via the verdict slot, not the condition field`,
            location: {
              file: specPath,
              pointer: `/transitions/${index}/condition`,
            },
          });
        }
      });
    }

    // Overlays — only look when the spec declares substates. Two cross-cutting
    // rules live here:
    //   (E006) overlay substate must appear in spec.meta.substates
    //   (E007) spec.meta.substates entry without a matching overlay (warning)
    //   (E005) overlay merge produces a spec that still fails validation
    const declaredSubstates = spec.meta.substates ?? [];
    const specDir = dirname(specPath);
    let overlayFiles: readonly string[];
    try {
      const entries = await readdir(specDir);
      overlayFiles = entries.filter((name) => name.endsWith('.overlay.json'));
    } catch {
      overlayFiles = [];
    }

    const overlaySubstates = new Set<string>();

    for (const filename of overlayFiles) {
      const overlayPath = join(specDir, filename);
      const substate = filename.replace(/\.overlay\.json$/, '');

      let overlayRaw: string;
      try {
        overlayRaw = await readFile(overlayPath, 'utf8');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        diagnostics.push({
          code: 'E005_INVALID_OVERLAY',
          severity: CODE_SEVERITY.E005_INVALID_OVERLAY,
          message: `overlay file could not be read: ${message}`,
          location: { file: overlayPath, pointer: null },
        });
        continue;
      }

      let parsedOverlay: unknown;
      try {
        parsedOverlay = JSON.parse(overlayRaw);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        diagnostics.push({
          code: 'E005_INVALID_OVERLAY',
          severity: CODE_SEVERITY.E005_INVALID_OVERLAY,
          message: `overlay file is not valid JSON: ${message}`,
          location: { file: overlayPath, pointer: null },
        });
        continue;
      }

      const guarded = validateOverlay(parsedOverlay);
      if (!guarded.ok) {
        for (const msg of guarded.errors) {
          diagnostics.push({
            code: 'E005_INVALID_OVERLAY',
            severity: CODE_SEVERITY.E005_INVALID_OVERLAY,
            message: msg,
            location: { file: overlayPath, pointer: null },
          });
        }
        continue;
      }

      // (E006) substate name must be declared by the spec.
      if (!declaredSubstates.includes(substate)) {
        diagnostics.push({
          code: 'E006_UNKNOWN_SUBSTATE',
          severity: CODE_SEVERITY.E006_UNKNOWN_SUBSTATE,
          message: `overlay filename "${filename}" implies substate "${substate}" which is not listed in spec.meta.substates (declared: ${declaredSubstates.length > 0 ? declaredSubstates.join(', ') : '<none>'})`,
          location: { file: overlayPath, pointer: null },
        });
        // Do NOT continue — still run the apply check so authors see both
        // problems at once, not one-at-a-time.
      }

      overlaySubstates.add(substate);

      // (E005) apply the overlay and re-validate the merged spec.
      // (E002) Predicate refs that the overlay might introduce — reuse the
      // merged result from the E005 check to avoid a redundant applyOverlay call.
      let merged: StepSpec | undefined;
      try {
        merged = applyOverlay(spec, guarded.value);
      } catch (err) {
        if (err instanceof OverlayError) {
          for (const issue of err.issues) {
            diagnostics.push({
              code: 'E005_INVALID_OVERLAY',
              severity: CODE_SEVERITY.E005_INVALID_OVERLAY,
              message: `${err.message.split(':')[0] ?? 'overlay apply failed'}: ${issue}`,
              location: { file: overlayPath, pointer: null },
            });
          }
        } else {
          const message = err instanceof Error ? err.message : String(err);
          diagnostics.push({
            code: 'E005_INVALID_OVERLAY',
            severity: CODE_SEVERITY.E005_INVALID_OVERLAY,
            message: `overlay apply threw: ${message}`,
            location: { file: overlayPath, pointer: null },
          });
        }
      }

      // E002 via overlay — check predicate references in the merged spec.
      // Skipped when the merge itself failed (merged is undefined).
      if (merged !== undefined) {
        const errs = validateSpecPredicateReferences(
          merged,
          defaultPredicates,
          overlayPath,
        );
        for (const msg of errs) {
          diagnostics.push({
            code: 'E002_UNKNOWN_PREDICATE',
            severity: CODE_SEVERITY.E002_UNKNOWN_PREDICATE,
            message: stripLabelPrefix(msg, overlayPath),
            location: { file: overlayPath, pointer: null },
          });
        }

        // (E009 collection) Overlay-introduced references — walk the merged
        // spec so predicates newly named by `$ops` / deep-merge land in the
        // referenced set. Without this pass, a predicate used ONLY in an
        // overlay would be flagged as dead.
        collectPredicateReferencesInValue(merged, referencedPredicateNames);
      }
    }

    // (E007) Declared substate with no overlay file.
    for (const substate of declaredSubstates) {
      if (!overlaySubstates.has(substate)) {
        diagnostics.push({
          code: 'E007_ORPHAN_SUBSTATE',
          severity: CODE_SEVERITY.E007_ORPHAN_SUBSTATE,
          message: `spec.meta.substates lists "${substate}" but no matching overlay file "${substate}.overlay.json" exists`,
          location: {
            file: specPath,
            pointer: pointerForSubstate(spec, substate),
          },
        });
      }
    }
  }

  // (E009) Dead-predicate detection — computed GLOBALLY across every step.
  // A predicate referenced in any spec, overlay-merge result, or graph edge
  // is considered live. The diff against the default registry surfaces
  // predicates that are registered but never used anywhere, minus advisory
  // names that opt out via `ADVISORY_PREDICATE_NAMES` and non-spec names
  // in `NON_SPEC_PREDICATE_NAMES` (predicates registered outside the
  // codegen-derived `PredicateName` union — see Wave C.2). Emitted after the
  // per-step loop so `referencedPredicateNames` has absorbed every source.
  const excluded = new Set<string>([
    ...ADVISORY_PREDICATE_NAMES,
    ...NON_SPEC_PREDICATE_NAMES,
  ]);
  const deadPredicates = computeDeadPredicates(
    Object.keys(defaultPredicates),
    referencedPredicateNames,
    excluded,
  );
  for (const name of deadPredicates) {
    diagnostics.push({
      code: 'E009_DEAD_PREDICATE',
      severity: CODE_SEVERITY.E009_DEAD_PREDICATE,
      message: `predicate "${name}" is registered in defaultPredicates but is never referenced by any spec, overlay, or graph edge`,
      location: {
        file: predicatesSourcePath(),
        pointer: `/predicates/${name}`,
      },
    });
  }

  return toReport(diagnostics);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveSpecsDir(dir: string | undefined): string {
  if (dir === undefined) return DEFAULT_SPECS_DIR;
  if (isAbsolute(dir)) return dir;
  return resolve(process.cwd(), dir);
}

function resolveSpecPath(graphPath: string, stepSpec: string): string {
  if (isAbsolute(stepSpec)) return stepSpec;
  return resolve(dirname(graphPath), stepSpec);
}

function toReport(diagnostics: readonly Diagnostic[]): ValidateReport {
  let errorCount = 0;
  let warningCount = 0;
  for (const d of diagnostics) {
    if (d.severity === 'error') errorCount += 1;
    else warningCount += 1;
  }
  return { diagnostics, summary: { errorCount, warningCount } };
}

/** @internal Exported for test access — not part of the public API. */
export function findDuplicatePredicates(names: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const n of names) {
    if (seen.has(n)) dupes.add(n);
    seen.add(n);
  }
  return [...dupes];
}

/**
 * Compute dead predicates for E009 — `registered` minus `referenced` minus
 * `advisory`. Pure set-difference over string names; extracted for direct
 * test coverage of the advisory-exclusion semantics since
 * `ADVISORY_PREDICATE_NAMES` starts empty and cannot be exercised end-to-end
 * by the integration surface alone.
 *
 * @internal Exported for test access — not part of the public API.
 */
export function computeDeadPredicates(
  registered: readonly string[],
  referenced: ReadonlySet<string>,
  advisory: ReadonlySet<string>,
): readonly string[] {
  const dead: string[] = [];
  for (const name of registered) {
    if (referenced.has(name)) continue;
    if (advisory.has(name)) continue;
    dead.push(name);
  }
  return dead;
}

/**
 * Absolute path to the generated predicates file. Used for E008 diagnostics
 * so the location points at the source of truth.
 */
function predicatesGeneratedPath(): string {
  return resolve(THIS_DIR, '..', '..', 'workflow', 'predicates.generated.ts');
}

/**
 * Absolute path to the hand-authored `workflow/predicates.ts` source. E009
 * diagnostics point here — the dead predicate lives in the `defaultPredicates`
 * object declared in that file. The JSON pointer `/predicates/<name>` in the
 * diagnostic is a stable logical reference into the registry; there is no
 * literal `/predicates` path in the TS source, but tooling uses it to
 * identify the offending predicate name deterministically.
 */
function predicatesSourcePath(): string {
  return resolve(THIS_DIR, '..', '..', 'workflow', 'predicates.ts');
}

/**
 * Verdict predicates — the only two names the transition routing layer
 * treats as authoritative via `rule.verdict` (against `EvalVerdictData`) and
 * therefore must NOT appear in a `transitions[].condition` slot. E010
 * mirrors the `Exclude<PredicateName, VerdictPredicateName>` compile-time
 * gate at `workflow/transitions.ts::TransitionRule.condition` for JSON
 * specs the TypeScript type system never sees.
 */
const VERDICT_PREDICATE_NAMES: ReadonlySet<string> = new Set([
  'verdictPass',
  'verdictRevise',
]);

/**
 * Walk `value` recursively and collect the string contents of every
 * `condition` and `when` property. Mirrors
 * `scripts/gen-predicate-names.ts:collectPredicateReferences` — the
 * codegen's extractor — so E009 dead-predicate analysis uses the same
 * reference surface that PredicateName discovery does.
 *
 * Key discovery happens at any nesting depth. Keys are schema-agnostic; if
 * a future spec introduces a new `condition`/`when` field this walker
 * picks it up without edits. The `guards.warn[].condition` slot (when it
 * lands) is covered by the same logic because the field name matches.
 */
function collectPredicateReferencesInValue(
  value: unknown,
  sink: Set<string>,
): void {
  if (value === null || value === undefined) return;
  if (typeof value !== 'object') return;

  if (Array.isArray(value)) {
    for (const element of value) {
      collectPredicateReferencesInValue(element, sink);
    }
    return;
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if ((key === 'condition' || key === 'when') && typeof child === 'string') {
      if (child.length > 0) sink.add(child);
      continue;
    }
    collectPredicateReferencesInValue(child, sink);
  }
}

/**
 * The predicate-reference validators prefix their messages with a label
 * (the file path). Strip that prefix so the diagnostic's own `location.file`
 * carries the attribution without duplication.
 */
function stripLabelPrefix(message: string, label: string): string {
  const prefix = `${label}: `;
  if (message.startsWith(prefix)) {
    return message.slice(prefix.length);
  }
  return message;
}

function pointerForGraphEdge(
  graph: WorkflowGraph,
  message: string,
): string | null {
  // Messages from `validateGraphPredicateReferences` have the shape:
  //   `<label>: edge <from> -> <to> references unknown predicate "<name>"`
  const match = /edge (\S+) -> (\S+) references unknown predicate/.exec(message);
  if (match === null) return null;
  const [, from, to] = match;
  if (from === undefined || to === undefined) return null;
  const index = graph.transitions.findIndex(
    (t) => t.from === from && t.to === to,
  );
  if (index === -1) return null;
  return `/transitions/${index}/condition`;
}

function pointerForStep(
  graph: WorkflowGraph,
  stepId: string,
): string | null {
  const index = graph.steps.findIndex((s) => s.id === stepId);
  if (index === -1) return null;
  return `/steps/${index}`;
}

function pointerForSpecPredicate(
  spec: StepSpec,
  message: string,
): string | null {
  // `validateSpecPredicateReferences` emits either:
  //   `<label>: transition -> <to> references unknown predicate "<name>"`
  //   `<label>: conditional block "<id>" references unknown predicate "<name>"`
  const tMatch = /transition -> (\S+) references unknown predicate/.exec(
    message,
  );
  if (tMatch !== null) {
    const to = tMatch[1];
    const index = spec.transitions.findIndex((t) => t.to === to);
    if (index === -1) return null;
    return `/transitions/${index}/condition`;
  }
  const cMatch = /conditional block "([^"]+)" references unknown predicate/.exec(
    message,
  );
  if (cMatch !== null) {
    const id = cMatch[1];
    const index = spec.blocks.conditional.findIndex((c) => c.id === id);
    if (index === -1) return null;
    return `/blocks/conditional/${index}/when`;
  }
  return null;
}

function pointerForSubstate(
  spec: StepSpec,
  substate: string,
): string | null {
  const substates = spec.meta.substates;
  if (substates === undefined) return null;
  const index = substates.indexOf(substate);
  if (index === -1) return null;
  return `/meta/substates/${index}`;
}

// ---------------------------------------------------------------------------
// Human-readable rendering
// ---------------------------------------------------------------------------

/**
 * Render a diagnostic report for human consumption. Respects NO_COLOR via
 * `lib/style.ts` helpers. Groups diagnostics by file, then by code, so a
 * single bad file's issues land together.
 */
export function renderHuman(report: ValidateReport): string {
  const lines: string[] = [];
  if (report.diagnostics.length === 0) {
    lines.push(bold(`gobbi workflow validate`));
    lines.push(`  OK — 0 errors, 0 warnings`);
    lines.push('');
    return lines.join('\n');
  }

  // Group by file, preserving first-seen ordering.
  const byFile = new Map<string, Diagnostic[]>();
  for (const d of report.diagnostics) {
    const bucket = byFile.get(d.location.file);
    if (bucket === undefined) {
      byFile.set(d.location.file, [d]);
    } else {
      bucket.push(d);
    }
  }

  lines.push(bold(`gobbi workflow validate`));
  for (const [file, diags] of byFile) {
    lines.push('');
    lines.push(bold(file));
    // Group by code within each file.
    const byCode = new Map<ValidateCode, Diagnostic[]>();
    for (const d of diags) {
      const bucket = byCode.get(d.code);
      if (bucket === undefined) byCode.set(d.code, [d]);
      else bucket.push(d);
    }
    for (const [code, entries] of byCode) {
      const label = entries[0]?.severity === 'warning' ? yellow(code) : red(code);
      lines.push(`  ${label}`);
      for (const entry of entries) {
        const pointer =
          entry.location.pointer === null
            ? ''
            : ` ${dim(`(${entry.location.pointer})`)}`;
        lines.push(`    ${entry.message}${pointer}`);
      }
    }
  }

  lines.push('');
  const summary = `${report.summary.errorCount} error(s), ${report.summary.warningCount} warning(s)`;
  lines.push(
    report.summary.errorCount > 0 ? red(bold(summary)) : yellow(summary),
  );
  lines.push('');
  return lines.join('\n');
}
