/**
 * Verification-block compiler — renders a `CompiledPrompt` summarising the
 * `verification.result` events recorded for a single active subagent during
 * the current step.
 *
 * Consumed by `gobbi workflow next` AFTER {@link runVerification} has written
 * `verification.result` events through `appendEventAndUpdateState` and the
 * resulting `state.verificationResults` has been refreshed via a second
 * `resolveWorkflowState` call. The compiler renders nothing but the subset of
 * `verificationResults` entries whose composite key starts with
 * `${subagentId}:` — one block per active subagent is the `next.ts` wiring
 * contract (see the E.8 section of `commands/workflow/next.ts`).
 *
 * ## Contract anchors
 *
 * - **Composite-key lookup** (L3): entries live at
 *   `state.verificationResults[`${subagentId}:${commandKind}`]`. The compiler
 *   iterates keys with the matching `${subagentId}:` prefix and classifies
 *   each entry as pass / fail / timeout.
 * - **Digest-only rendering** (plan §E.8 scope): `stdoutDigest` / `stderrDigest`
 *   are shown as the leading 8 hex characters on failure rows. Full stream
 *   content lives out-of-band via the runner's capture policy — never inline
 *   in the compiled prompt.
 * - **Gate-vs-inform differentiation**: the per-event recorded
 *   `VerificationPolicy` is rendered as `[gate]` or `[inform]` adjacent to
 *   the command kind so the orchestrator can distinguish advisory from
 *   gating outcomes visually.
 * - **Deterministic ordering**: entries sort by the canonical
 *   `VerificationCommandKind` enum order (`lint`, `typecheck`, `test`,
 *   `build`, `format`, `custom`), NOT by insertion order. Two invocations
 *   with the same state produce byte-identical rendered text.
 *
 * ## Direct-allocate pattern
 *
 * Reuses `buildErrorCompiledPrompt` from `./errors.sections.js` — the PR D
 * primitive that assembles a `CompiledPrompt` from already-built
 * `KindedSection[]` + explicit slot tags, bypassing the spec-driven
 * `specs/assembly.ts::compile()` pipeline. The verification block is NOT
 * spec-driven (it reads state, not a `StepSpec.blocks` entry), so the
 * direct-allocate entry point is the correct seam (research:
 * `research/results/e8-verification-block-direct-allocate.md`).
 *
 * ## Cache-prefix stability
 *
 * The `StaticSection` content is the module-level {@link STATIC_VERIFICATION_HEADER}
 * constant — byte-stable across every invocation. The `SessionSection` carries
 * the subagent id and the entry count; the `DynamicSection`s carry the
 * rendered rows and (optionally) the failure details. Consumers that rely on
 * Anthropic prompt caching for the prefix observe a stable `staticPrefixHash`
 * across invocations with different result payloads — verified by the
 * `cache-prefix stability` test in `__tests__/verification-block.test.ts`.
 */

import {
  makeStatic,
  makeSession,
  makeDynamic,
  buildErrorCompiledPrompt,
  type BuildErrorCompiledPromptInput,
} from './errors.sections.js';
import type { CompiledPrompt } from './types.js';
import type { WorkflowState } from '../workflow/state.js';
import type {
  VerificationCommandKind,
  VerificationResultData,
} from '../workflow/events/verification.js';

// ---------------------------------------------------------------------------
// Section IDs — referenced by the slot-override map and by cache-stability
// assertions (the static-section id is stable; hashing is over content only).
// ---------------------------------------------------------------------------

const ID_VERIFICATION_HEADER = 'verification.header';
const ID_VERIFICATION_SESSION = 'verification.session';
const ID_VERIFICATION_RESULTS = 'verification.results';
const ID_VERIFICATION_FAILURES = 'verification.failures';

// ---------------------------------------------------------------------------
// Static prefix content — cache-stable header text. No timestamps, UUIDs,
// paths, or per-invocation counters (STATIC_LINT_RULES gate these elsewhere
// for spec-driven statics; this constant stays in the same discipline).
// ---------------------------------------------------------------------------

/**
 * Module-level static prefix for every verification-block prompt. Byte-stable
 * across every invocation so its `contentHash` anchors a shared Anthropic
 * prefix-cache bucket for all verification-block compiles in a session.
 */
export const STATIC_VERIFICATION_HEADER = `Verification outcomes for the current subagent. Each row names a verification command, its policy (gate or inform), and the pass/fail/timeout result. Gate-policy failures block the workflow's advance; inform-policy failures are advisory only. Stderr and stdout digests are the leading 8 hex characters of the runner's sha256 capture — use them to diff run-to-run without loading the full streams.`;

// ---------------------------------------------------------------------------
// Canonical command-kind ordering — deterministic render order so two
// invocations with the same state produce byte-identical text. The order
// mirrors the `VerificationCommandKind` union declaration sequence in
// `workflow/events/verification.ts`.
// ---------------------------------------------------------------------------

const COMMAND_KIND_ORDER: readonly VerificationCommandKind[] = [
  'lint',
  'typecheck',
  'test',
  'build',
  'format',
  'custom',
];

// ---------------------------------------------------------------------------
// Row rendering — pass / fail / timeout with digest-only failure detail.
// Column widths keep the rendered output readable but NOT byte-tight — extra
// spacing is tolerated because the consumer is a model, not a terminal.
// ---------------------------------------------------------------------------

/** Short digest — first 8 hex characters of the sha256 stream digest. */
function shortDigest(digest: string): string {
  return digest.slice(0, 8);
}

/**
 * Render one row per verification result. The `commandKind` column is
 * left-aligned to a fixed width so the pass/fail column aligns across rows.
 * Policy tag (`[gate]` / `[inform]`) precedes the result literal.
 */
function renderRow(entry: VerificationResultData): string {
  const kindLabel = entry.commandKind.padEnd(10, ' ');
  const policyLabel = entry.policy === 'gate' ? '[gate]  ' : '[inform]';

  if (entry.timedOut) {
    return `  ${kindLabel} ${policyLabel} timed out after ${entry.durationMs}ms`;
  }
  if (entry.exitCode === 0) {
    return `  ${kindLabel} ${policyLabel} pass (${entry.durationMs}ms)`;
  }
  return `  ${kindLabel} ${policyLabel} fail (exitCode ${entry.exitCode}, ${entry.durationMs}ms)    stderr digest: ${shortDigest(entry.stderrDigest)}`;
}

/**
 * Render a detailed failure-details block — shown only when at least one
 * entry is a failure or a timeout. Mirrors the research-suggested shape
 * (stdout/stderr digest + timed-out flag + policy). Digest-only per the
 * plan §E.8 "no stdout/stderr content" rule.
 */
function renderFailureDetails(
  entries: readonly VerificationResultData[],
): string {
  const failures = entries.filter(
    (e) => e.timedOut || e.exitCode !== 0,
  );
  if (failures.length === 0) return '';
  const lines: string[] = ['Failure details:'];
  for (const e of failures) {
    lines.push(`  ${e.commandKind}:`);
    lines.push(`    stderr digest: ${shortDigest(e.stderrDigest)}`);
    lines.push(`    stdout digest: ${shortDigest(e.stdoutDigest)}`);
    lines.push(`    timed out: ${e.timedOut ? 'yes' : 'no'}`);
    lines.push(`    policy: ${e.policy}`);
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Filter + sort — pull entries for a single subagent in canonical order.
// ---------------------------------------------------------------------------

function isVerificationCommandKind(
  value: string,
): value is VerificationCommandKind {
  return (COMMAND_KIND_ORDER as readonly string[]).includes(value);
}

/**
 * Collect the `VerificationResultData` entries whose composite key begins
 * with `${subagentId}:` and sort them by canonical command-kind order. Keys
 * whose suffix is not a recognised `VerificationCommandKind` are dropped
 * defensively — the reducer should never record such entries, but the
 * compiler does not panic on a malformed on-disk state.
 */
function collectEntriesForSubagent(
  verificationResults: Readonly<Record<string, VerificationResultData>>,
  subagentId: string,
): readonly VerificationResultData[] {
  const prefix = `${subagentId}:`;
  const collected: VerificationResultData[] = [];
  for (const [key, entry] of Object.entries(verificationResults)) {
    if (!key.startsWith(prefix)) continue;
    const suffix = key.slice(prefix.length);
    if (!isVerificationCommandKind(suffix)) continue;
    collected.push(entry);
  }
  collected.sort((a, b) => {
    const ai = COMMAND_KIND_ORDER.indexOf(a.commandKind);
    const bi = COMMAND_KIND_ORDER.indexOf(b.commandKind);
    return ai - bi;
  });
  return collected;
}

// ---------------------------------------------------------------------------
// Results body — the "Verification results for subagent X:" + one row per
// command. Separate from the failure-details block so callers can reason
// about the row-count independently of the failure surface.
// ---------------------------------------------------------------------------

function renderResultsBody(
  subagentId: string,
  entries: readonly VerificationResultData[],
): string {
  if (entries.length === 0) {
    return `Verification results for subagent ${subagentId}:\n  no verification results`;
  }
  const rows = entries.map(renderRow);
  return [
    `Verification results for subagent ${subagentId}:`,
    ...rows,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

/**
 * Compile a verification-block `CompiledPrompt` for one subagent.
 *
 * Output section layout (cache-prefix order):
 *
 *   [static]  {@link STATIC_VERIFICATION_HEADER}             — byte-stable prefix
 *   [session] "Subagent: ${subagentId} (${n} results)"       — session bucket
 *   [dynamic] "Verification results for subagent X:\n  ..."  — per-row rendering
 *   [dynamic] "Failure details:\n  ..."                      — only when ≥1 failure
 *
 * The dynamic-block content varies per invocation (per-entry policy tag,
 * pass/fail label, duration, digest). The static-prefix content is fixed,
 * anchoring a stable `staticPrefixHash` across invocations with different
 * verification payloads for the same subagent.
 *
 * When `state.verificationResults` has ZERO entries matching the subagent,
 * the rendered results body reads `"no verification results"` — the prompt
 * is still emitted so the orchestrator observes an explicit "no outcomes"
 * signal rather than a silent omission.
 *
 * @param state A fully-resolved `WorkflowState` whose `verificationResults`
 *   reflects POST-`runVerification` writes. The `next.ts` wiring calls
 *   `resolveWorkflowState` after `runVerification` so the state this function
 *   reads is the one that carries the just-written events.
 * @param subagentId The composite-key prefix to filter by. Must be a member
 *   of `state.activeSubagents[*].subagentId` in a well-formed invocation.
 */
export function compileVerificationBlock(
  state: WorkflowState,
  subagentId: string,
): CompiledPrompt {
  const entries = collectEntriesForSubagent(
    state.verificationResults,
    subagentId,
  );

  const resultsBody = renderResultsBody(subagentId, entries);
  const failuresBody = renderFailureDetails(entries);

  const dynamicBlocks = failuresBody.length > 0
    ? [
        makeDynamic({ id: ID_VERIFICATION_RESULTS, content: resultsBody }),
        makeDynamic({ id: ID_VERIFICATION_FAILURES, content: failuresBody }),
      ]
    : [
        makeDynamic({ id: ID_VERIFICATION_RESULTS, content: resultsBody }),
      ];

  const input: BuildErrorCompiledPromptInput = {
    staticBlocks: [
      makeStatic({
        id: ID_VERIFICATION_HEADER,
        content: STATIC_VERIFICATION_HEADER,
      }),
    ],
    sessionBlock: makeSession({
      id: ID_VERIFICATION_SESSION,
      content: `Subagent: ${subagentId} (${entries.length} ${entries.length === 1 ? 'result' : 'results'})`,
    }),
    dynamicBlocks,
    slotOverrides: {
      [ID_VERIFICATION_HEADER]: 'staticPrefix',
      [ID_VERIFICATION_SESSION]: 'session',
      [ID_VERIFICATION_RESULTS]: 'artifacts',
      [ID_VERIFICATION_FAILURES]: 'materials',
    },
  };

  return buildErrorCompiledPrompt(input);
}

/**
 * Predicate: does `state.verificationResults` carry at least one entry whose
 * composite key starts with `${subagentId}:`? Used by `next.ts` to decide
 * whether to invoke the compiler at all (the empty-case render is still
 * valid, but cheap to skip when the subagent produced no verification
 * output — e.g. the project-config has no `verification.runAfterSubagentStop`
 * declared).
 */
export function hasVerificationResultsFor(
  state: WorkflowState,
  subagentId: string,
): boolean {
  const prefix = `${subagentId}:`;
  for (const key of Object.keys(state.verificationResults)) {
    if (key.startsWith(prefix)) return true;
  }
  return false;
}
