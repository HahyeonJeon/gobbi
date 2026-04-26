/**
 * Footer snapshot + contract tests (B.1.2 of issue #153).
 *
 * Pins the data-driven `blocks.footer` payload that B.1.1 lifted from prose
 * into a first-class `StepBlocks` field. The footer carries the exact
 * `gobbi workflow transition <VERB>` invocation each agent must run as its
 * terminal action — productive steps name `COMPLETE`; the shared evaluation
 * spec names `PASS` / `REVISE` / `ESCALATE`. Operator-only verbs (SKIP,
 * TIMEOUT, FINISH, ABORT, RESUME) must never appear paired with the
 * `gobbi workflow transition` token, so the verb-partition assertions key on
 * the *token sequence*, not the bare verb. (The eval footer's prose body
 * legitimately contains the bare word "COMPLETE" in the sentence "COMPLETE is
 * not valid for evaluation steps" — the token-sequence test does not flag
 * that.)
 *
 * Test groups:
 *
 *   a. footer — renders for productive specs
 *      For each of `ideation`, `planning`, `execution`, `memorization`,
 *      `handoff`: load the spec, compile with a deterministic input, and
 *      assert
 *        (i)   the footer section sits between `blocks.completion` and
 *              `session.state` in the section list,
 *        (ii)  the footer section's `kind` is `'static'`,
 *        (iii) `prompt.text` contains the COMPLETE-verb sequence and none of
 *              the verdict / operator-only verb sequences,
 *        (iv)  `prompt.text` matches the on-disk snapshot.
 *
 *   b. footer — renders for evaluation spec
 *      Same triple-assert for the shared evaluation spec, with verdict-variant
 *      verb-sequence assertions: PASS / REVISE / ESCALATE present, COMPLETE
 *      and operator-only verbs absent.
 *
 *   c. footer — cache stability
 *      Same input compiled twice → identical `staticPrefixHash` + `prompt.text`.
 *      One-byte mutation to `blocks.footer` → `staticPrefixHash` differs.
 *
 *   d. footer — schema enforcement
 *      Spec with `blocks.footer` removed or set to `''` fails
 *      `validateStepSpec` with the error pointing at `/blocks/footer`.
 *
 * Snapshots land in `./__snapshots__/footer.snap.test.ts.snap` and are
 * committed — they ARE the assertion. Re-generate intentional changes with
 * `bun test --update-snapshots`.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  compile,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../assembly.js';
import { defaultBudgetAllocator } from '../budget.js';
import { validateStepSpec } from '../_schema/v1.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowState, WorkflowStep } from '../../workflow/state.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import type { StepSpec } from '../types.js';

// ---------------------------------------------------------------------------
// Spec loading — read each spec.json the same way per-step `snapshot.test.ts`
// suites do, so the footer assertions exercise the production pipeline.
// ---------------------------------------------------------------------------

const HERE = dirname(fileURLToPath(import.meta.url));

function loadSpecAt(specRelDir: string): StepSpec {
  const specPath = resolve(HERE, '..', specRelDir, 'spec.json');
  const raw: unknown = JSON.parse(readFileSync(specPath, 'utf8'));
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(
      `${specRelDir}/spec.json failed validation: ` +
        `${JSON.stringify(result.errors, null, 2)}`,
    );
  }
  return result.value;
}

// ---------------------------------------------------------------------------
// Mutable clone helper — `structuredClone` of the validated spec strips the
// `readonly` modifiers so the schema-enforcement tests can corrupt the shape
// without `as` casts at every mutation site. Mirrors `schema.test.ts`.
// ---------------------------------------------------------------------------

type Mutable<T> = T extends readonly (infer U)[]
  ? Mutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T;

const clone = <T>(value: T): Mutable<T> => structuredClone(value) as Mutable<T>;

// ---------------------------------------------------------------------------
// Compile fixture — deterministic CompileInput per spec. Timestamps are
// pinned and `currentStep` matches each spec so the session summary renders
// the same step-name in every snapshot run.
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-16T12:00:00.000Z';
const GENEROUS_WINDOW = 200_000;

const predicates: CompilePredicateRegistry = defaultPredicates;

function compileInput(spec: StepSpec, currentStep: WorkflowStep): CompileInput {
  const state: WorkflowState = {
    ...initialState(`session-footer-${currentStep}`),
    currentStep,
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [],
  };
  return { spec, state, dynamic, predicates, activeAgent: null };
}

function compileGenerous(input: CompileInput): ReturnType<typeof compile> {
  return compile(input, {
    allocator: defaultBudgetAllocator,
    contextWindowTokens: GENEROUS_WINDOW,
  });
}

// ---------------------------------------------------------------------------
// Verb partitions — token-sequence assertions, NOT bare-verb assertions.
//
// The eval footer's prose body says "COMPLETE is not valid for evaluation
// steps" as flavor text. That bare word must NOT cause a partition violation
// because the partition is over `gobbi workflow transition <VERB>` invocations,
// not over the verb word in isolation.
// ---------------------------------------------------------------------------

const TXN = 'gobbi workflow transition';

const PRODUCTIVE_POSITIVE_SEQUENCES = [`${TXN} COMPLETE`] as const;

// All verbs that must NOT pair with `gobbi workflow transition` in a
// productive footer — every verdict verb plus every operator-only verb.
const PRODUCTIVE_NEGATIVE_SEQUENCES = [
  `${TXN} PASS`,
  `${TXN} REVISE`,
  `${TXN} ESCALATE`,
  `${TXN} SKIP`,
  `${TXN} TIMEOUT`,
  `${TXN} FINISH`,
  `${TXN} ABORT`,
  `${TXN} RESUME`,
] as const;

const EVALUATION_POSITIVE_SEQUENCES = [
  `${TXN} PASS`,
  `${TXN} REVISE`,
  `${TXN} ESCALATE`,
] as const;

// Eval footer must not pair `gobbi workflow transition` with COMPLETE or any
// operator-only verb. (The bare word "COMPLETE" appears legitimately in the
// prose; only the token sequence is forbidden.)
const EVALUATION_NEGATIVE_SEQUENCES = [
  `${TXN} COMPLETE`,
  `${TXN} SKIP`,
  `${TXN} TIMEOUT`,
  `${TXN} FINISH`,
  `${TXN} ABORT`,
  `${TXN} RESUME`,
] as const;

// ---------------------------------------------------------------------------
// Productive-spec matrix — each entry pairs a spec directory with the
// `currentStep` value that drives `compile()`. The shared evaluation spec is
// covered separately in its own describe block.
// ---------------------------------------------------------------------------

const PRODUCTIVE_SPECS: ReadonlyArray<{
  readonly dir: string;
  readonly step: WorkflowStep;
}> = [
  { dir: 'ideation', step: 'ideation' },
  { dir: 'planning', step: 'planning' },
  { dir: 'execution', step: 'execution' },
  { dir: 'memorization', step: 'memorization' },
  { dir: 'handoff', step: 'handoff' },
];

// ===========================================================================
// (a) footer — renders for productive specs
// ===========================================================================

describe('footer — renders for productive specs', () => {
  for (const { dir, step } of PRODUCTIVE_SPECS) {
    test(`${dir} — position, kind, verb partition, snapshot`, () => {
      const spec = loadSpecAt(dir);
      const prompt = compileGenerous(compileInput(spec, step));

      // (i) — section position: footer between completion and session.state.
      const ids = prompt.sections.map((s) => s.id);
      const completionIdx = ids.indexOf('blocks.completion');
      const footerIdx = ids.indexOf('blocks.footer');
      const sessionIdx = ids.indexOf('session.state');
      expect(completionIdx).toBeGreaterThanOrEqual(0);
      expect(footerIdx).toBeGreaterThan(completionIdx);
      expect(sessionIdx).toBeGreaterThan(footerIdx);

      // (ii) — footer section is static-kind so its bytes contribute to
      //         `staticPrefixHash` and the cache prefix.
      const footerSummary = prompt.sections[footerIdx];
      expect(footerSummary).toBeDefined();
      expect(footerSummary?.kind).toBe('static');

      // (iii) — verb-partition: the COMPLETE invocation is present; no other
      //          `gobbi workflow transition <VERB>` sequence is.
      for (const seq of PRODUCTIVE_POSITIVE_SEQUENCES) {
        expect(prompt.text).toContain(seq);
      }
      for (const seq of PRODUCTIVE_NEGATIVE_SEQUENCES) {
        expect(prompt.text).not.toContain(seq);
      }

      // (iv) — full prompt-text snapshot.
      expect(prompt.text).toMatchSnapshot();
    });
  }
});

// ===========================================================================
// (b) footer — renders for evaluation spec
// ===========================================================================

describe('footer — renders for evaluation spec', () => {
  test('evaluation — position, kind, verb partition, snapshot', () => {
    const spec = loadSpecAt('evaluation');
    // Use `ideation_eval` as the evaluation step variant — the footer is
    // step-name-agnostic; only the session summary changes between
    // ideation_eval / planning_eval / execution_eval.
    const prompt = compileGenerous(compileInput(spec, 'ideation_eval'));

    // (i) — section position.
    const ids = prompt.sections.map((s) => s.id);
    const completionIdx = ids.indexOf('blocks.completion');
    const footerIdx = ids.indexOf('blocks.footer');
    const sessionIdx = ids.indexOf('session.state');
    expect(completionIdx).toBeGreaterThanOrEqual(0);
    expect(footerIdx).toBeGreaterThan(completionIdx);
    expect(sessionIdx).toBeGreaterThan(footerIdx);

    // (ii) — static kind.
    const footerSummary = prompt.sections[footerIdx];
    expect(footerSummary).toBeDefined();
    expect(footerSummary?.kind).toBe('static');

    // (iii) — verb-partition: PASS / REVISE / ESCALATE present;
    //          `gobbi workflow transition COMPLETE` plus operator-only verb
    //          sequences absent. The bare word "COMPLETE" appears in the eval
    //          prose body ("COMPLETE is not valid for evaluation steps") and
    //          is intentionally allowed — only the verb-sequence token is
    //          tested.
    for (const seq of EVALUATION_POSITIVE_SEQUENCES) {
      expect(prompt.text).toContain(seq);
    }
    for (const seq of EVALUATION_NEGATIVE_SEQUENCES) {
      expect(prompt.text).not.toContain(seq);
    }

    // (iv) — full prompt-text snapshot.
    expect(prompt.text).toMatchSnapshot();
  });
});

// ===========================================================================
// (c) footer — cache stability
// ===========================================================================

describe('footer — cache stability', () => {
  test('same spec compiled twice → identical staticPrefixHash + text', () => {
    const spec = loadSpecAt('ideation');
    const a = compileGenerous(compileInput(spec, 'ideation'));
    const b = compileGenerous(compileInput(spec, 'ideation'));
    expect(a.staticPrefixHash).toBe(b.staticPrefixHash);
    expect(a.text).toBe(b.text);
  });

  test('one-byte mutation to blocks.footer → staticPrefixHash differs', () => {
    const baseSpec = loadSpecAt('ideation');
    // Append a single trailing space to the footer body. The footer section
    // is static-kind so its bytes feed `staticPrefixHash`; any mutation must
    // invalidate the cache prefix.
    const mutated = clone(baseSpec) as Mutable<StepSpec>;
    mutated.blocks.footer = `${baseSpec.blocks.footer} `;

    const a = compileGenerous(compileInput(baseSpec, 'ideation'));
    const b = compileGenerous(compileInput(mutated as StepSpec, 'ideation'));
    expect(a.staticPrefixHash).not.toBe(b.staticPrefixHash);
  });
});

// ===========================================================================
// (d) footer — schema enforcement
// ===========================================================================

describe('footer — schema enforcement', () => {
  test('spec missing blocks.footer fails validateStepSpec at /blocks/footer', () => {
    const spec = loadSpecAt('ideation');
    const stripped = clone(spec);
    // `Mutable<StepSpec>.blocks.footer` is required (`string`, not `string?`),
    // so the literal `delete` operator's `optional`-property check rejects
    // the form. Cast `blocks` through a record view to model "the field is
    // gone at runtime"; the validator still receives the structurally
    // mutated object and should reject it via the `required` keyword.
    delete (stripped.blocks as unknown as Record<string, unknown>).footer;

    const result = validateStepSpec(stripped);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const missing = result.errors.find(
        (e) =>
          e.keyword === 'required' &&
          (e.params as { missingProperty?: string }).missingProperty ===
            'footer',
      );
      expect(missing).toBeDefined();
      // AJV reports a missing-required error with `instancePath` set to the
      // parent object (`/blocks`) and `params.missingProperty === 'footer'`.
      // The combination pins the violation at `/blocks/footer` without
      // depending on the schemaPath rendering, which AJV expresses as
      // `#/properties/blocks/required` (the rule, not the field).
      expect(missing?.instancePath).toBe('/blocks');
      expect(
        (missing?.params as { missingProperty?: string }).missingProperty,
      ).toBe('footer');
    }
  });

  test('spec with blocks.footer === "" fails minLength: 1', () => {
    const spec = loadSpecAt('ideation');
    const empty = clone(spec) as Mutable<StepSpec>;
    empty.blocks.footer = '';

    const result = validateStepSpec(empty as StepSpec);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const minLen = result.errors.find(
        (e) => e.keyword === 'minLength' && e.instancePath === '/blocks/footer',
      );
      expect(minLen).toBeDefined();
    }
  });
});
