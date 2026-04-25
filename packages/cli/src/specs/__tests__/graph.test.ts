/**
 * Unit tests for `specs/graph.ts` — loader contract, lookup helpers,
 * static analysis kernel, and determinism.
 *
 * The committed `packages/cli/src/specs/index.json` is the primary
 * fixture. Scenario-specific graphs (malformed JSON, invalid shape,
 * injected cycle, isolated step) are written to a per-test temp
 * directory so the real canonical graph remains the reference for most
 * assertions.
 */

import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  loadGraph,
  getStepById,
  getTransitions,
  getIncomingTransitions,
  analyzeGraph,
  DEFAULT_GRAPH_PATH,
  type WorkflowGraph,
  type GraphTransition,
  type StepDefinition,
} from '../graph.js';

// ---------------------------------------------------------------------------
// Silence the console.warn emitted during loadGraph for missing spec files —
// these warnings are expected during Phase 2 rollout and cluttering test
// output obscures real failures. Tests that assert on warn behaviour swap in
// an inspection spy.
// ---------------------------------------------------------------------------

let warnSpy: ReturnType<typeof mock>;

beforeEach(() => {
  warnSpy = mock(() => {});
  console.warn = warnSpy as unknown as typeof console.warn;
});

// ---------------------------------------------------------------------------
// Test scratch helpers — per-test tmpdir, JSON write helper
// ---------------------------------------------------------------------------

async function scratchDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'gobbi-graph-test-'));
}

async function writeGraph(
  dir: string,
  name: string,
  body: unknown,
): Promise<string> {
  const path = join(dir, name);
  await writeFile(path, JSON.stringify(body, null, 2), 'utf8');
  return path;
}

// ===========================================================================
// Loader — happy path
// ===========================================================================

describe('loadGraph — canonical index.json', () => {
  test('reads and parses the committed graph file', async () => {
    const graph = await loadGraph();
    expect(graph.version).toBe(1);
    expect(graph.entry).toBe('ideation');
    expect(graph.terminal).toContain('memorization');
    expect(graph.steps.length).toBeGreaterThanOrEqual(6);
    expect(graph.transitions.length).toBeGreaterThan(0);
  });

  test('all canonical step IDs from v050-state-machine.md appear in steps[]', async () => {
    const graph = await loadGraph();
    const ids = graph.steps.map((s) => s.id);
    // The design-doc active steps (minus idle/done/error lifecycle states)
    // must all be represented as graph nodes.
    const expected = [
      'ideation',
      'ideation_eval',
      'planning',
      'planning_eval',
      'execution',
      'execution_eval',
      'memorization',
    ];
    for (const id of expected) {
      expect(ids).toContain(id);
    }
  });

  test('ideation carries the discussing/researching substates', async () => {
    const graph = await loadGraph();
    const ideation = graph.steps.find((s) => s.id === 'ideation');
    expect(ideation).toBeDefined();
    expect(ideation?.substates).toEqual(['discussing', 'researching']);
  });

  test('loadGraph accepts an explicit path argument', async () => {
    const graph = await loadGraph(DEFAULT_GRAPH_PATH);
    expect(graph.entry).toBe('ideation');
  });

  test('determinism — two loads produce structurally identical graphs', async () => {
    const a = await loadGraph();
    const b = await loadGraph();
    // Stringify both; order of keys in JSON is preserved in `JSON.stringify`
    // for own-enumerable properties. Any drift between calls would surface as
    // a string diff.
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });
});

// ===========================================================================
// Loader — graceful missing spec files
// ===========================================================================

describe('loadGraph — missing spec files', () => {
  test('emits console.warn per missing spec file, does not throw', async () => {
    // Build a synthetic graph that points at a spec file that does NOT
    // exist on disk. The loader must warn (not throw) for each missing
    // reference. Post-B.1 the canonical graph has every spec present, so
    // the warn path is exercised here against a synthetic fixture rather
    // than against the real index.json.
    const dir = await scratchDir();
    try {
      const graphPath = await writeGraph(dir, 'index.json', {
        $schema: 'https://example/schema.json',
        version: 1,
        entry: 'only',
        terminal: ['only'],
        steps: [{ id: 'only', spec: './does-not-exist.json' }],
        transitions: [],
      });
      await loadGraph(graphPath);
      // At least one warning emitted — warn-but-succeed contract.
      expect(warnSpy.mock.calls.length).toBeGreaterThan(0);
      const joined = warnSpy.mock.calls.map((c) => String(c[0])).join('\n');
      expect(joined).toContain('[graph]');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('canonical graph emits no warnings — every referenced spec is present post-B.1', async () => {
    // Post-B.1 every spec referenced by the canonical index.json is on
    // disk (ideation in PR A; plan/execution/evaluation/memorization in
    // PR B.1). Loading the real graph MUST NOT warn — if it does, a spec
    // file is missing or misreferenced.
    await loadGraph();
    expect(warnSpy.mock.calls.length).toBe(0);
  });

  test('custom graph with present spec file emits no warning', async () => {
    const dir = await scratchDir();
    try {
      // Create a real spec file.
      const specPath = join(dir, 'present-spec.json');
      await writeFile(specPath, '{"version":1}', 'utf8');

      const graphPath = await writeGraph(dir, 'index.json', {
        $schema: 'https://example/schema.json',
        version: 1,
        entry: 'only',
        terminal: ['only'],
        steps: [{ id: 'only', spec: './present-spec.json' }],
        transitions: [],
      });

      await loadGraph(graphPath);
      expect(warnSpy.mock.calls.length).toBe(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ===========================================================================
// Loader — malformed JSON and shape violations
// ===========================================================================

describe('loadGraph — parse and shape errors', () => {
  test('throws SyntaxError on malformed JSON', async () => {
    const dir = await scratchDir();
    try {
      const path = join(dir, 'bad.json');
      await writeFile(path, '{ this is not valid', 'utf8');
      await expect(loadGraph(path)).rejects.toThrow(SyntaxError);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('throws a shape error when version field is missing', async () => {
    const dir = await scratchDir();
    try {
      const path = await writeGraph(dir, 'bad.json', {
        entry: 'ideation',
        terminal: [],
        steps: [],
        transitions: [],
      });
      await expect(loadGraph(path)).rejects.toThrow(/WorkflowGraph shape/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('throws when a step has a non-string id', async () => {
    const dir = await scratchDir();
    try {
      const path = await writeGraph(dir, 'bad.json', {
        version: 1,
        entry: 'x',
        terminal: [],
        steps: [{ id: 42, spec: './x.json' }],
        transitions: [],
      });
      await expect(loadGraph(path)).rejects.toThrow(/WorkflowGraph shape/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ===========================================================================
// Lookup helpers
// ===========================================================================

describe('getStepById', () => {
  test('returns the matching step', async () => {
    const graph = await loadGraph();
    const plan = getStepById(graph, 'planning');
    expect(plan).toBeDefined();
    expect(plan?.id).toBe('planning');
    expect(plan?.spec).toBe('./planning/spec.json');
  });

  test('returns undefined for an unknown ID', async () => {
    const graph = await loadGraph();
    expect(getStepById(graph, 'not_a_step')).toBeUndefined();
  });
});

describe('getTransitions', () => {
  test('ideation has both the direct and eval-branch transitions', async () => {
    const graph = await loadGraph();
    const outgoing = getTransitions(graph, 'ideation');
    const targets = outgoing.map((t) => t.to).sort();
    // Direct to planning, eval branch to ideation_eval, plus the timeout and
    // (possibly) skip edges. At minimum the two primary exits must exist.
    expect(targets).toContain('planning');
    expect(targets).toContain('ideation_eval');
  });

  test('returns empty list for a step with no outgoing transitions', async () => {
    const dir = await scratchDir();
    try {
      // Write a graph where step `lonely` has no outgoing edges.
      const specPath = join(dir, 'lonely-spec.json');
      await writeFile(specPath, '{}', 'utf8');
      const path = await writeGraph(dir, 'index.json', {
        version: 1,
        entry: 'lonely',
        terminal: ['lonely'],
        steps: [{ id: 'lonely', spec: './lonely-spec.json' }],
        transitions: [],
      });
      const graph = await loadGraph(path);
      expect(getTransitions(graph, 'lonely')).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('getIncomingTransitions', () => {
  test('memorization has an incoming transition from execution_eval', async () => {
    const graph = await loadGraph();
    const incoming = getIncomingTransitions(graph, 'memorization');
    const fromSteps = incoming.map((t) => t.from);
    expect(fromSteps).toContain('execution_eval');
  });

  test('ideation has incoming transitions from ideation_eval (feedback) and execution_eval', async () => {
    const graph = await loadGraph();
    const incoming = getIncomingTransitions(graph, 'ideation');
    const fromSteps = new Set(incoming.map((t) => t.from));
    expect(fromSteps.has('ideation_eval')).toBe(true);
    expect(fromSteps.has('execution_eval')).toBe(true);
  });
});

// ===========================================================================
// Static analysis — dead steps, cycles, unreachable
// ===========================================================================

describe('analyzeGraph — committed graph', () => {
  test('reports zero dead steps', async () => {
    const graph = await loadGraph();
    const analysis = analyzeGraph(graph);
    expect(analysis.deadSteps).toEqual([]);
  });

  test('reports zero unreachable steps', async () => {
    const graph = await loadGraph();
    const analysis = analyzeGraph(graph);
    expect(analysis.unreachableSteps).toEqual([]);
  });

  test('reports no cycles — feedback-flagged loops are excluded', async () => {
    // All intra-step loops in the committed graph (ideation_eval → ideation,
    // plan_eval → plan, execution_eval → {ideation, plan, execution},
    // skip edges) are marked `feedback: true` and must be treated as
    // intended by the analyzer.
    const graph = await loadGraph();
    const analysis = analyzeGraph(graph);
    expect(analysis.cycles).toEqual([]);
  });
});

describe('analyzeGraph — detects the intended feedback cycles when flags are dropped', () => {
  test('stripping feedback:true flags surfaces the evaluation-loop cycle', async () => {
    const graph = await loadGraph();
    // Clone the graph with `feedback` flags stripped — the analyzer should
    // now report the cycles that were previously suppressed.
    const stripped: WorkflowGraph = {
      ...graph,
      transitions: graph.transitions.map((tr) => {
        const copy: { -readonly [K in keyof GraphTransition]?: GraphTransition[K] } = { ...tr };
        delete copy.feedback;
        return copy as GraphTransition;
      }),
    };
    const analysis = analyzeGraph(stripped);
    // At least one cycle must surface — the execution-eval loopbacks form
    // SCCs with ideation/plan/execution.
    expect(analysis.cycles.length).toBeGreaterThan(0);
    // The SCC containing `execution` and `execution_eval` is the most
    // load-bearing feedback loop; verify it appears in one of the cycles.
    const executionCycle = analysis.cycles.find(
      (c) => c.includes('execution') && c.includes('execution_eval'),
    );
    expect(executionCycle).toBeDefined();
  });
});

describe('analyzeGraph — synthetic defect cases', () => {
  test('detects a dead step (no outgoing, not terminal)', async () => {
    const dir = await scratchDir();
    try {
      await writeFile(join(dir, 's.json'), '{}', 'utf8');
      const path = await writeGraph(dir, 'index.json', {
        version: 1,
        entry: 'a',
        terminal: ['a'],
        steps: [
          { id: 'a', spec: './s.json' },
          { id: 'b', spec: './s.json' },
        ],
        transitions: [{ from: 'a', to: 'b', condition: 'always' }],
      });
      const graph = await loadGraph(path);
      const analysis = analyzeGraph(graph);
      // `b` has no outgoing edges and is not terminal — dead.
      expect(analysis.deadSteps).toEqual(['b']);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('detects a structural cycle (non-feedback self-loop)', async () => {
    const dir = await scratchDir();
    try {
      await writeFile(join(dir, 's.json'), '{}', 'utf8');
      const path = await writeGraph(dir, 'index.json', {
        version: 1,
        entry: 'a',
        terminal: ['a'],
        steps: [{ id: 'a', spec: './s.json' }],
        transitions: [{ from: 'a', to: 'a', condition: 'always' }],
      });
      const graph = await loadGraph(path);
      const analysis = analyzeGraph(graph);
      expect(analysis.cycles.length).toBe(1);
      expect(analysis.cycles[0]).toEqual(['a']);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('detects unreachable steps', async () => {
    const dir = await scratchDir();
    try {
      await writeFile(join(dir, 's.json'), '{}', 'utf8');
      const path = await writeGraph(dir, 'index.json', {
        version: 1,
        entry: 'a',
        terminal: ['a', 'island'],
        steps: [
          { id: 'a', spec: './s.json' },
          { id: 'island', spec: './s.json' },
        ],
        transitions: [],
      });
      const graph = await loadGraph(path);
      const analysis = analyzeGraph(graph);
      expect(analysis.unreachableSteps).toEqual(['island']);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test('terminal step with no outgoing edges is NOT dead', async () => {
    const dir = await scratchDir();
    try {
      await writeFile(join(dir, 's.json'), '{}', 'utf8');
      const path = await writeGraph(dir, 'index.json', {
        version: 1,
        entry: 'a',
        terminal: ['done_node'],
        steps: [
          { id: 'a', spec: './s.json' },
          { id: 'done_node', spec: './s.json' },
        ],
        transitions: [{ from: 'a', to: 'done_node', condition: 'always' }],
      });
      const graph = await loadGraph(path);
      const analysis = analyzeGraph(graph);
      expect(analysis.deadSteps).toEqual([]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ===========================================================================
// Sanity check — every transition references a known source/target
// ===========================================================================

describe('structural invariants of the committed graph', () => {
  test('every transition.from exists in steps[] OR is a lifecycle source', async () => {
    const graph = await loadGraph();
    const stepIds = new Set(graph.steps.map((s) => s.id));
    // Transitions originate from either a graph step or the `error`
    // lifecycle state (workflow.resume/workflow.abort). `idle` never
    // originates a transition in the committed graph.
    const lifecycleSources = new Set(['error']);
    for (const tr of graph.transitions) {
      const knownSource = stepIds.has(tr.from) || lifecycleSources.has(tr.from);
      expect(knownSource).toBe(true);
    }
  });

  test('every transition.to exists in steps[] OR is a known lifecycle sink', async () => {
    const graph = await loadGraph();
    const stepIds = new Set(graph.steps.map((s) => s.id));
    const lifecycleSinks = new Set(['done', 'error', 'idle']);
    for (const tr of graph.transitions) {
      const knownTarget = stepIds.has(tr.to) || lifecycleSinks.has(tr.to);
      expect(knownTarget).toBe(true);
    }
  });

  test('all three eval steps share the same spec file', async () => {
    const graph = await loadGraph();
    const evalSteps: readonly StepDefinition[] = graph.steps.filter((s) =>
      s.id.endsWith('_eval'),
    );
    expect(evalSteps.length).toBe(3);
    const specs = new Set(evalSteps.map((s) => s.spec));
    expect(specs.size).toBe(1);
  });
});
