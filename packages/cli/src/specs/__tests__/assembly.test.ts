/**
 * Unit tests for `specs/assembly.ts` — `compile()` entry point, block→section
 * mapping, content-linter behaviour, static-prefix hash stability, and
 * `BudgetAllocator` integration.
 *
 * Property-based tests live in `./properties.test.ts`; this file covers the
 * specific acceptance scenarios from the A.4 briefing.
 */

import { describe, test, expect } from 'bun:test';

import {
  compile,
  compileWithIssues,
  renderSpec,
  lintSectionContent,
  lintStaticContent,
  STATIC_LINT_RULES,
  NOOP_ALLOCATOR,
  ContentLintError,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
  type KindedSection,
} from '../assembly.js';
import { makeStatic, makeSession, makeDynamic } from '../sections.js';
import type { StepSpec } from '../types.js';
import type {
  BudgetAllocator,
  AllocationResult,
  CompiledSectionLike,
} from '../types.js';
import { initialState } from '../../workflow/state-derivation.js';
import type { WorkflowState } from '../../workflow/state-derivation.js';

// ===========================================================================
// Fixture helpers — a minimal but non-trivial `StepSpec`
// ===========================================================================

function baseSpec(): StepSpec {
  return {
    $schema: 'https://gobbi.dev/schemas/step-spec/v1',
    version: 1,
    meta: {
      description: 'Test ideation step',
      allowedAgentTypes: ['__pi'],
      maxParallelAgents: 2,
      requiredSkills: ['_gotcha'],
      optionalSkills: [],
      expectedArtifacts: ['innovative.md', 'best.md'],
      completionSignal: 'SubagentStop',
    },
    transitions: [
      { to: 'plan', condition: 'evalEnabled.ideation' },
    ],
    delegation: {
      agents: [
        {
          role: 'innovative',
          stance: 'innovative',
          modelTier: 'opus',
          effort: 'max',
          skills: ['_ideation'],
          artifactTarget: 'innovative.md',
          blockRef: 'pi.innovative',
        },
        {
          role: 'best-practice',
          stance: 'best-practice',
          modelTier: 'opus',
          effort: 'max',
          skills: ['_ideation'],
          artifactTarget: 'best.md',
          blockRef: 'pi.best',
        },
      ],
    },
    tokenBudget: {
      staticPrefix: 0.4,
      session: 0.1,
      instructions: 0.2,
      artifacts: 0.2,
      materials: 0.1,
    },
    blocks: {
      static: [
        { id: 'role', content: 'You are the orchestrator. Coordinate ideation.' },
        { id: 'principles', content: 'Ideate broadly. Discuss with user. Synthesize.' },
      ],
      conditional: [
        {
          id: 'feedback-context',
          content: 'This is a feedback round. Previous evaluation flagged gaps.',
          when: 'feedbackActive',
        },
        {
          id: 'first-entry',
          content: 'First time in this step. Start fresh.',
          when: 'firstEntry',
        },
      ],
      delegation: {
        'pi.innovative': {
          id: 'pi.innovative',
          content: 'Innovative stance: depth-first, divergent, challenge constraints.',
        },
        'pi.best': {
          id: 'pi.best',
          content: 'Best-practice stance: proven patterns, reliability, established conventions.',
        },
      },
      synthesis: [
        { id: 'synth', content: 'Synthesize innovative + best-practice findings into one direction.' },
      ],
      completion: {
        instruction: 'Emit completion signal once both PI agents have produced artifacts.',
        criteria: ['both PI agents completed', 'synthesis written'],
      },
      footer: 'Step completion protocol — run gobbi workflow transition COMPLETE.',
    },
  };
}

function baseState(): WorkflowState {
  return initialState('test-session-unit');
}

function baseDynamic(): DynamicContext {
  return {
    timestamp: '2026-04-16T11:00:00Z',
    activeSubagentCount: 0,
    artifacts: [],
  };
}

const EMPTY_REGISTRY: CompilePredicateRegistry = {};

function baseInput(overrides: Partial<CompileInput> = {}): CompileInput {
  return {
    spec: baseSpec(),
    state: baseState(),
    dynamic: baseDynamic(),
    predicates: EMPTY_REGISTRY,
    activeAgent: null,
    ...overrides,
  };
}

// ===========================================================================
// Basic compile — produces a non-empty CompiledPrompt with correct ordering
// ===========================================================================

describe('compile — basic behaviour', () => {
  test('returns a non-empty CompiledPrompt for a minimal non-trivial StepSpec', () => {
    const prompt = compile(baseInput());

    expect(prompt.text.length).toBeGreaterThan(0);
    expect(prompt.sections.length).toBeGreaterThan(0);
    // sha256 hashes are 64 hex chars.
    expect(prompt.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(prompt.staticPrefixHash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('assembles sections in Static* → Session* → Dynamic* order', () => {
    const prompt = compile(baseInput());
    // Walk section summaries; once we see a session, no further static; once
    // we see a dynamic, no further static or session.
    let phase = 0;
    for (const s of prompt.sections) {
      const want = s.kind === 'static' ? 0 : s.kind === 'session' ? 1 : 2;
      expect(want).toBeGreaterThanOrEqual(phase);
      phase = want;
    }
  });

  test('every section summary carries a 64-char sha256 contentHash', () => {
    const prompt = compile(baseInput());
    for (const s of prompt.sections) {
      expect(s.contentHash).toMatch(/^[0-9a-f]{64}$/);
      expect(s.byteLength).toBeGreaterThanOrEqual(0);
      expect(['static', 'session', 'dynamic']).toContain(s.kind);
    }
  });

  test('compile is deterministic — same inputs produce identical output', () => {
    const a = compile(baseInput());
    const b = compile(baseInput());
    expect(a.text).toBe(b.text);
    expect(a.contentHash).toBe(b.contentHash);
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    expect(a.sections.map((s) => s.contentHash)).toEqual(
      b.sections.map((s) => s.contentHash),
    );
  });

  test('concatenated section bytes match the prompt.text', () => {
    const prompt = compile(baseInput());
    // Sum byteLengths plus separators should approximate text byte length.
    const sepBytes = Buffer.byteLength('\n\n', 'utf8');
    const sumSectionBytes = prompt.sections.reduce(
      (acc, s) => acc + s.byteLength,
      0,
    );
    const expectedBytes =
      sumSectionBytes +
      (prompt.sections.length > 0 ? sepBytes * (prompt.sections.length - 1) : 0);
    expect(Buffer.byteLength(prompt.text, 'utf8')).toBe(expectedBytes);
  });
});

// ===========================================================================
// Block → Section mapping
// ===========================================================================

describe('block → section mapping', () => {
  test('blocks.static is concatenated into one StaticSection', () => {
    const prompt = compile(baseInput());
    const staticSec = prompt.sections.find((s) => s.id === 'blocks.static');
    expect(staticSec).toBeDefined();
    expect(staticSec?.kind).toBe('static');
  });

  test('conditional block fires when predicate returns true', () => {
    const predicates: CompilePredicateRegistry = {
      feedbackActive: () => true,
      firstEntry: () => false,
    };
    const prompt = compile(baseInput({ predicates }));
    const fired = prompt.sections.find(
      (s) => s.id === 'blocks.conditional.feedback-context',
    );
    const excluded = prompt.sections.find(
      (s) => s.id === 'blocks.conditional.first-entry',
    );
    expect(fired).toBeDefined();
    expect(fired?.kind).toBe('static');
    expect(excluded).toBeUndefined();
  });

  test('conditional block does not fire when predicate returns false', () => {
    const predicates: CompilePredicateRegistry = {
      feedbackActive: () => false,
      firstEntry: () => false,
    };
    const prompt = compile(baseInput({ predicates }));
    const fired = prompt.sections.find((s) =>
      s.id.startsWith('blocks.conditional.'),
    );
    expect(fired).toBeUndefined();
  });

  test('unknown predicate name evaluates to false (no throw)', () => {
    // Spec references `feedbackActive` and `firstEntry`; neither is in the
    // registry. Compile must not throw — validate-before-compile is the
    // predicate-existence check's home.
    expect(() => compile(baseInput({ predicates: {} }))).not.toThrow();
    const prompt = compile(baseInput({ predicates: {} }));
    const any = prompt.sections.find((s) =>
      s.id.startsWith('blocks.conditional.'),
    );
    expect(any).toBeUndefined();
  });

  test('delegation block for active agent is included', () => {
    const prompt = compile(baseInput({ activeAgent: 'pi.innovative' }));
    const del = prompt.sections.find(
      (s) => s.id === 'blocks.delegation.pi.innovative',
    );
    expect(del).toBeDefined();
    expect(del?.kind).toBe('static');
    // The OTHER delegation block must not appear.
    const other = prompt.sections.find(
      (s) => s.id === 'blocks.delegation.pi.best',
    );
    expect(other).toBeUndefined();
  });

  test('no delegation block when activeAgent is null', () => {
    const prompt = compile(baseInput({ activeAgent: null }));
    const any = prompt.sections.find((s) =>
      s.id.startsWith('blocks.delegation.'),
    );
    expect(any).toBeUndefined();
  });

  test('synthesis, completion, session, and dynamic sections all appear', () => {
    const prompt = compile(baseInput());
    expect(prompt.sections.find((s) => s.id === 'blocks.synthesis')).toBeDefined();
    expect(prompt.sections.find((s) => s.id === 'blocks.completion')).toBeDefined();
    expect(prompt.sections.find((s) => s.id === 'session.state')).toBeDefined();
    expect(prompt.sections.find((s) => s.id === 'dynamic.context')).toBeDefined();
  });
});

// ===========================================================================
// Content linter — rejects blacklisted patterns in StaticSection content
// ===========================================================================

describe('content linter', () => {
  test('rejects ISO 8601 timestamp in a static block', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          { id: 'poisoned', content: 'Compiled at 2026-04-16T11:00:00Z.' },
        ],
      },
    };
    expect(() => compile(baseInput({ spec: poisonedSpec }))).toThrow(
      ContentLintError,
    );
  });

  test('rejects UUID v4 in a static block', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          {
            id: 'poisoned',
            content: 'Session is 6ba7b810-9dad-41d1-a456-00c04fd430c8.',
          },
        ],
      },
    };
    expect(() => compile(baseInput({ spec: poisonedSpec }))).toThrow(
      ContentLintError,
    );
  });

  test('rejects absolute path containing /home in a static block', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [{ id: 'poisoned', content: 'See /home/alice/notes.md.' }],
      },
    };
    expect(() => compile(baseInput({ spec: poisonedSpec }))).toThrow(
      ContentLintError,
    );
  });

  test('rejects $CLAUDE_PROJECT_DIR literal in a static block', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [{ id: 'poisoned', content: 'Working at $CLAUDE_PROJECT_DIR' }],
      },
    };
    expect(() => compile(baseInput({ spec: poisonedSpec }))).toThrow(
      ContentLintError,
    );
  });

  test('rejects PID reference in a static block', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [{ id: 'poisoned', content: 'Watcher pid=12345 started.' }],
      },
    };
    expect(() => compile(baseInput({ spec: poisonedSpec }))).toThrow(
      ContentLintError,
    );
  });

  test('ContentLintError carries the issue list on its .issues field', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          {
            id: 'poisoned',
            content: 'At 2026-04-16T11:00:00Z with uuid 6ba7b810-9dad-41d1-a456-00c04fd430c8.',
          },
        ],
      },
    };
    try {
      compile(baseInput({ spec: poisonedSpec }));
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(ContentLintError);
      if (err instanceof ContentLintError) {
        const ruleIds = err.issues.map((i) => i.ruleId);
        expect(ruleIds).toContain('iso8601');
        expect(ruleIds).toContain('uuidV4');
        for (const issue of err.issues) {
          expect(['error', 'warn']).toContain(issue.severity);
          expect(issue.sectionId).toBe('blocks.static');
        }
      }
    }
  });

  test('linter does NOT scan session or dynamic sections', () => {
    // Session section contains the UUID in state.sessionId naturally; the
    // linter must NOT flag that. Dynamic section contains the timestamp; also
    // must not flag.
    const state: WorkflowState = {
      ...baseState(),
      sessionId: '6ba7b810-9dad-41d1-a456-00c04fd430c8',
    };
    const input = baseInput({ state });
    expect(() => compile(input)).not.toThrow();
  });

  test('lintMode: "collect" returns issues without throwing', () => {
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          { id: 'poisoned', content: 'At 2026-04-16T11:00:00Z.' },
        ],
      },
    };
    const outcome = compileWithIssues(baseInput({ spec: poisonedSpec }));
    expect(outcome.lintIssues.length).toBeGreaterThan(0);
    // `prompt` still exists — collect mode does not abort.
    expect(outcome.prompt.text.length).toBeGreaterThan(0);
  });

  test('custom lintRules override the default list', () => {
    // Use an empty rule set — the default ISO 8601 pattern should no
    // longer flag this content.
    const spec = baseSpec();
    const poisonedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          { id: 'has.iso', content: 'Timestamp: 2026-04-16T11:00:00Z.' },
        ],
      },
    };
    expect(() =>
      compile(baseInput({ spec: poisonedSpec }), { lintRules: [] }),
    ).not.toThrow();
  });

  test('lintSectionContent surfaces each match independently', () => {
    const content = 'Two uuids: 6ba7b810-9dad-41d1-a456-00c04fd430c8 and 11111111-2222-4333-8444-555555555555.';
    const issues = lintSectionContent('any', content, STATIC_LINT_RULES);
    const uuidIssues = issues.filter((i) => i.ruleId === 'uuidV4');
    expect(uuidIssues.length).toBe(2);
  });
});

// ===========================================================================
// Static-prefix hash stability
// ===========================================================================

describe('staticPrefixHash stability', () => {
  test('stable across two calls with identical static but different dynamic', () => {
    const a = compile(
      baseInput({
        dynamic: {
          timestamp: '2026-04-16T11:00:00Z',
          activeSubagentCount: 0,
          artifacts: [],
        },
      }),
    );
    const b = compile(
      baseInput({
        dynamic: {
          timestamp: '2026-04-16T23:59:59Z',
          activeSubagentCount: 42,
          artifacts: [{ name: 'innovative.md', content: 'body' }],
        },
      }),
    );

    // staticPrefixHash IS stable — only static-section hashes contribute.
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    // The top-level contentHash is DIFFERENT — it covers the full text.
    expect(a.contentHash).not.toBe(b.contentHash);
  });

  test('stable when session state changes but static blocks stay the same', () => {
    const a = compile(baseInput());
    const stateB: WorkflowState = {
      ...baseState(),
      currentStep: 'ideation',
      completedSteps: ['idle'],
      feedbackRound: 2,
    };
    const b = compile(baseInput({ state: stateB }));

    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    expect(a.contentHash).not.toBe(b.contentHash);
  });

  test('changes when a static block changes by one byte', () => {
    const a = compile(baseInput());
    const spec = baseSpec();
    const mutatedSpec: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          { id: 'role', content: 'You are the orchestrator. Coordinate ideation!' },
          { id: 'principles', content: 'Ideate broadly. Discuss with user. Synthesize.' },
        ],
      },
    };
    const b = compile(baseInput({ spec: mutatedSpec }));
    expect(a.staticPrefixHash).not.toBe(b.staticPrefixHash);
  });

  test('changes when conditional block fires in one call but not the other', () => {
    const a = compile(
      baseInput({
        predicates: { feedbackActive: () => false, firstEntry: () => false },
      }),
    );
    const b = compile(
      baseInput({
        predicates: { feedbackActive: () => true, firstEntry: () => false },
      }),
    );
    expect(a.staticPrefixHash).not.toBe(b.staticPrefixHash);
  });
});

// ===========================================================================
// BudgetAllocator integration — no-op default + custom allocator
// ===========================================================================

describe('BudgetAllocator integration', () => {
  test('default allocator (defaultBudgetAllocator) keeps every section when content fits in the default window', () => {
    // With no allocator/contextWindowTokens overrides, compile() now uses
    // `defaultBudgetAllocator` + `DEFAULT_CONTEXT_WINDOW_TOKENS` (200k).
    // The baseSpec content is tiny, so every section fits and nothing is
    // dropped — the observable outcome matches the pre-MINOR-1 NOOP default.
    const outcome = compileWithIssues(baseInput());
    expect(outcome.dropped).toHaveLength(0);
  });

  test('NOOP_ALLOCATOR can still be opted into explicitly and keeps every section', () => {
    const outcome = compileWithIssues(baseInput(), {
      allocator: NOOP_ALLOCATOR,
    });
    expect(outcome.dropped).toHaveLength(0);
  });

  test('a custom allocator can drop sections — they vanish from the prompt', () => {
    const dropDynamic: BudgetAllocator = {
      allocate(sections): AllocationResult {
        const included = sections.filter((s) => !s.id.startsWith('dynamic.'));
        const dropped = sections.filter((s) => s.id.startsWith('dynamic.'));
        return { included, dropped };
      },
    };

    const outcome = compileWithIssues(baseInput(), { allocator: dropDynamic });
    expect(outcome.dropped.length).toBeGreaterThan(0);
    const hasDynamic = outcome.prompt.sections.some((s) => s.kind === 'dynamic');
    expect(hasDynamic).toBe(false);
  });

  test('allocator receives the step spec tokenBudget and contextWindowTokens', () => {
    let receivedProportions: unknown = null;
    let receivedWindow: unknown = null;

    const spy: BudgetAllocator = {
      allocate(sections, contextWindowTokens, proportions): AllocationResult {
        receivedWindow = contextWindowTokens;
        receivedProportions = proportions;
        return { included: sections, dropped: [] };
      },
    };

    compile(baseInput(), { allocator: spy, contextWindowTokens: 100_000 });

    expect(receivedWindow).toBe(100_000);
    expect(receivedProportions).toEqual(baseSpec().tokenBudget);
  });

  test('compile preserves original order when allocator returns a reordered list', () => {
    const reverse: BudgetAllocator = {
      allocate(sections): AllocationResult {
        return { included: [...sections].reverse(), dropped: [] };
      },
    };
    const prompt = compile(baseInput(), { allocator: reverse });
    // The compile layer walks the original order and keeps only included
    // sections — so cache ordering is preserved regardless of allocator.
    let phase = 0;
    for (const s of prompt.sections) {
      const want = s.kind === 'static' ? 0 : s.kind === 'session' ? 1 : 2;
      expect(want).toBeGreaterThanOrEqual(phase);
      phase = want;
    }
  });
});

// ===========================================================================
// renderSpec — the lower-level rendering primitive
// ===========================================================================

describe('renderSpec', () => {
  test('produces a tuple satisfying Static* → Session* → Dynamic*', () => {
    const kinded = renderSpec(baseInput());
    let phase = 0;
    for (const k of kinded) {
      const want = k.kind === 'static' ? 0 : k.kind === 'session' ? 1 : 2;
      expect(want).toBeGreaterThanOrEqual(phase);
      phase = want;
    }
  });

  test('empty static/conditional/synthesis still produces session + dynamic + completion', () => {
    const spec = baseSpec();
    const thinSpec: StepSpec = {
      ...spec,
      blocks: {
        static: [],
        conditional: [],
        delegation: {},
        synthesis: [],
        completion: spec.blocks.completion,
        footer: spec.blocks.footer,
      },
    };
    const kinded = renderSpec(baseInput({ spec: thinSpec }));
    const ids = kinded.map((k) => k.section.id);
    expect(ids).toContain('blocks.completion');
    expect(ids).toContain('session.state');
    expect(ids).toContain('dynamic.context');
    expect(ids).not.toContain('blocks.static');
    expect(ids).not.toContain('blocks.synthesis');
  });
});

// ===========================================================================
// Smoke test — sanity check on an artifact-bearing compile
// ===========================================================================

describe('compile — end-to-end smoke', () => {
  test('artifact contents appear in the dynamic section', () => {
    const prompt = compile(
      baseInput({
        dynamic: {
          timestamp: '2026-04-16T11:00:00Z',
          activeSubagentCount: 1,
          artifacts: [
            { name: 'innovative.md', content: 'Innovative take body.' },
          ],
        },
      }),
    );
    expect(prompt.text).toContain('Innovative take body.');
    expect(prompt.text).toContain('dynamic.activeSubagentCount=1');
  });

  test('session state appears in the session section', () => {
    const prompt = compile(baseInput());
    expect(prompt.text).toContain('session.currentStep=idle');
  });
});

// ===========================================================================
// lintStaticContent — KindedSection-aware linter (post-C1 refactor)
//
// After removing the module-global `kindMap`, the linter reads kind directly
// from the KindedSection tuple the caller passes in. These tests exercise
// that path explicitly — independent of the compile pipeline — to confirm
// the linter catches blacklisted patterns in static sections and leaves
// session/dynamic sections alone, with no hidden state between calls.
// ===========================================================================

describe('lintStaticContent — KindedSection input', () => {
  test('flags a blacklisted pattern in a static section', () => {
    const kinded: readonly KindedSection[] = [
      {
        kind: 'static',
        section: makeStatic({
          id: 'poisoned-static',
          content: 'Compiled at 2026-04-16T11:00:00Z.',
        }),
      },
    ];
    const issues = lintStaticContent(kinded);
    const iso = issues.find((i) => i.ruleId === 'iso8601');
    expect(iso).toBeDefined();
    expect(iso?.sectionId).toBe('poisoned-static');
  });

  test('does NOT flag the same pattern when wrapped in a session or dynamic section', () => {
    const kinded: readonly KindedSection[] = [
      {
        kind: 'session',
        section: makeSession({
          id: 'session.with.timestamp',
          content: 'session.lastUpdated=2026-04-16T11:00:00Z',
        }),
      },
      {
        kind: 'dynamic',
        section: makeDynamic({
          id: 'dynamic.with.timestamp',
          content: 'dynamic.timestamp=2026-04-16T11:00:00Z',
        }),
      },
    ];
    const issues = lintStaticContent(kinded);
    expect(issues).toHaveLength(0);
  });

  test('pure across repeated calls — no cross-invocation state', () => {
    // Two independent sections with the same id would have confounded a
    // WeakMap-based lookup if a prior call's mapping survived. Each call is
    // self-contained and reads kind from the passed-in tuple only.
    const mkStatic = (content: string): KindedSection => ({
      kind: 'static',
      section: makeStatic({ id: 'reused-id', content }),
    });
    const issuesA = lintStaticContent([mkStatic('2026-04-16T11:00:00Z')]);
    const issuesB = lintStaticContent([mkStatic('no timestamps here')]);
    const issuesC = lintStaticContent([mkStatic('2026-04-16T11:00:00Z')]);
    expect(issuesA.some((i) => i.ruleId === 'iso8601')).toBe(true);
    expect(issuesB).toHaveLength(0);
    expect(issuesC.some((i) => i.ruleId === 'iso8601')).toBe(true);
  });
});

// ===========================================================================
// CompileInput.skillSections — M1 skill-injection seam
//
// Skill sections are caller-supplied StaticSection values that sit at the
// FRONT of the static prefix, before the spec's block-derived sections.
// They go through the content linter like any other static content and
// participate in allocation. `compile()` without `skillSections` is
// byte-identical to the pre-M1 behaviour.
// ===========================================================================

describe('compile — skillSections injection', () => {
  test('prepends skill sections to the compiled text before block-derived content', () => {
    const skillSection = makeStatic({
      id: 'skills._gotcha',
      content: 'GOTCHA SKILL BODY — marker one two three.',
    });
    const prompt = compile(baseInput({ skillSections: [skillSection] }));
    // Skill content must appear, and must appear before the role block.
    const skillIndex = prompt.text.indexOf('GOTCHA SKILL BODY');
    const roleIndex = prompt.text.indexOf('You are the orchestrator');
    expect(skillIndex).toBeGreaterThanOrEqual(0);
    expect(roleIndex).toBeGreaterThan(skillIndex);
  });

  test('skill sections appear in the section list as static-kind summaries', () => {
    const skillSection = makeStatic({
      id: 'skills._gotcha',
      content: 'Gotcha skill body.',
    });
    const prompt = compile(baseInput({ skillSections: [skillSection] }));
    const skill = prompt.sections.find((s) => s.id === 'skills._gotcha');
    expect(skill).toBeDefined();
    expect(skill?.kind).toBe('static');
  });

  test('multiple skill sections preserve caller-provided order', () => {
    const first = makeStatic({ id: 'skills._gotcha', content: 'FIRST.' });
    const second = makeStatic({ id: 'skills._claude', content: 'SECOND.' });
    const prompt = compile(
      baseInput({ skillSections: [first, second] }),
    );
    const firstIdx = prompt.text.indexOf('FIRST.');
    const secondIdx = prompt.text.indexOf('SECOND.');
    expect(firstIdx).toBeGreaterThanOrEqual(0);
    expect(secondIdx).toBeGreaterThan(firstIdx);
  });

  test('omitting skillSections is backwards-compatible — identical to pre-M1 output', () => {
    // No `skillSections` field at all — the most common caller shape, and
    // the one that must stay byte-identical to the pre-M1 pipeline.
    const a = compile(baseInput());
    // Empty array — explicit opt-in with nothing to inject. Must also yield
    // byte-identical output to the omitted case.
    const c = compile(baseInput({ skillSections: [] }));
    expect(a.text).toBe(c.text);
    expect(a.contentHash).toBe(c.contentHash);
    expect(a.staticPrefixHash).toBe(c.staticPrefixHash);
  });

  test('skill sections are linted — a poisoned skill is caught', () => {
    const poisoned = makeStatic({
      id: 'skills._gotcha',
      content: 'See /home/alice/skills.md for details.',
    });
    expect(() =>
      compile(baseInput({ skillSections: [poisoned] })),
    ).toThrow(ContentLintError);
  });

  test('skill sections contribute to staticPrefixHash', () => {
    const a = compile(baseInput());
    const skill = makeStatic({
      id: 'skills._gotcha',
      content: 'Gotcha skill body.',
    });
    const b = compile(baseInput({ skillSections: [skill] }));
    expect(a.staticPrefixHash).not.toBe(b.staticPrefixHash);
  });

  test('skill section appears first in the rendered kinded tuple', () => {
    const skill = makeStatic({
      id: 'skills._gotcha',
      content: 'Gotcha body.',
    });
    const kinded = renderSpec(baseInput({ skillSections: [skill] }));
    expect(kinded[0]?.section.id).toBe('skills._gotcha');
    expect(kinded[0]?.kind).toBe('static');
  });
});

// ===========================================================================
// BlockContent.refs — deferred to PR B (MAJOR-3)
//
// `BlockContent.refs` declares an ordered list of `_shared/` block IDs whose
// content should be inlined before the block's own `content`. PR A does NOT
// resolve these references — the `_shared/` directory and resolver both land
// in PR B. These tests pin the current behaviour explicitly so a future
// implementor sees that refs are accepted at the type/schema level but are a
// no-op at compile time. When PR B wires the resolver, these tests must be
// updated to assert that resolved shared-block content appears in the output.
// ===========================================================================

describe('renderBlockContent — BlockContent.refs (deferred to PR B)', () => {
  test('a static block declaring refs compiles without throwing; referenced content is NOT inlined', () => {
    const spec = baseSpec();
    const specWithRefs: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        static: [
          {
            id: 'role-with-ref',
            content: 'Role block body — this IS expected in the output.',
            refs: ['nonexistent-shared-block-id'],
          },
        ],
      },
    };
    // No throw — refs are silently a no-op in PR A.
    const prompt = compile(baseInput({ spec: specWithRefs }));
    // The own content DOES appear.
    expect(prompt.text).toContain('Role block body');
    // The referenced shared block does NOT get resolved/inlined in PR A:
    // there is no `_shared/nonexistent-shared-block-id` body to surface, and
    // no error is raised. If PR B wires the resolver and this test still
    // passes, either the resolver is missing or the test needs to be
    // updated to cover the wired behaviour.
    expect(prompt.text).not.toContain('nonexistent-shared-block-id');
  });

  test('a conditional block declaring refs also does not inline them in PR A', () => {
    const spec = baseSpec();
    const specWithRefs: StepSpec = {
      ...spec,
      blocks: {
        ...spec.blocks,
        conditional: [
          {
            id: 'feedback-context',
            content: 'Feedback conditional body — this IS expected.',
            when: 'feedbackActive',
            refs: ['nonexistent-shared-block-id'],
          },
          {
            id: 'first-entry',
            content: 'First-entry body.',
            when: 'firstEntry',
          },
        ],
      },
    };
    const predicates: CompilePredicateRegistry = {
      feedbackActive: () => true,
      firstEntry: () => false,
    };
    const prompt = compile(baseInput({ spec: specWithRefs, predicates }));
    expect(prompt.text).toContain('Feedback conditional body');
    expect(prompt.text).not.toContain('nonexistent-shared-block-id');
  });
});

// Keep the CompiledSectionLike import alive for type-level guards (the
// allocator spy tests exercise it).
const _typeGuard: CompiledSectionLike | null = null;
void _typeGuard;

// NOOP_ALLOCATOR should be usable explicitly too.
const _noop = NOOP_ALLOCATOR;
void _noop;
