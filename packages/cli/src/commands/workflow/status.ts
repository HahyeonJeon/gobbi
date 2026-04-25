/**
 * gobbi workflow status — read-only workflow state projection.
 *
 * Resolves the active session's state via `resolveWorkflowState` and renders
 * a human-readable summary. `--json` returns a structured snapshot for
 * machine consumers.
 *
 * `--cost` rolls up cumulative dollar cost from `delegation.complete`
 * events — token-derived via `lib/cost-rates.ts` when `tokensUsed` is
 * present, with `sizeProxyBytes` fallback when it is not. Per lock L1
 * this is the single cost path; `cost_usd` branches are reserved-inert
 * and never consumed. Per lock L11 an empty-session invocation
 * (`delegation.complete` count == 0) emits a `no v0.5.0 sessions found`
 * marker rather than `$0.00` so operators see the gap explicitly.
 *
 * Violation counts are grouped by DiagnosticCode family prefix
 * (`E`/`W`/`X`/`V`), dogfooding C.8-a's letter-prefix scheme. Records without
 * a `code` field (pre-v2 `guard.violation` entries on disk) are bucketed as
 * the `untagged` family so operators still see them.
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { derivedCost, proxyCost } from '../../lib/cost-rates.js';
import { isNumber, isRecord, isString } from '../../lib/guards.js';
import { EventStore } from '../../workflow/store.js';
import type { CostAggregateRow, ReadStore } from '../../workflow/store.js';
import { resolveWorkflowState } from '../../workflow/engine.js';
import type { GuardViolationRecord, WorkflowState } from '../../workflow/state.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow status [options]

Render a read-only snapshot of the current session's workflow state.

Options:
  --session-id <id>   Override the active session id (defaults to
                      CLAUDE_SESSION_ID or the single session under
                      .gobbi/sessions/ if only one exists)
  --json              Emit a structured JSON snapshot
  --cost              Include a cumulative dollar-cost rollup aggregated
                      from delegation.complete events. Combines with
                      --json to emit the rollup in the structured
                      snapshot; without --json it appends a prose
                      'Cost:' section to the human renderer. An empty
                      session (no delegation.complete events) emits
                      'no v0.5.0 sessions found' rather than '$0.00'.
  --help, -h          Show this help message`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  json: { type: 'boolean', default: false },
  cost: { type: 'boolean', default: false },
} as const;

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

/**
 * Structured status snapshot — the wire format for `--json` and the
 * building block of the human renderer. Stable across PR C; extending is
 * additive.
 */
export interface StatusSnapshot {
  readonly sessionId: string;
  readonly schemaVersion: number;
  readonly currentStep: string;
  readonly currentSubstate: string | null;
  readonly completedSteps: readonly string[];
  readonly activeSubagents: readonly { readonly subagentId: string; readonly agentType: string; readonly step: string }[];
  readonly evalConfig: { readonly ideation: boolean; readonly planning: boolean; readonly execution?: boolean } | null;
  readonly feedbackRound: number;
  readonly maxFeedbackRounds: number;
  readonly lastVerdictOutcome: 'pass' | 'revise' | null;
  /** Violation counts grouped by DiagnosticCode family prefix. */
  readonly violationsByFamily: Readonly<Record<string, number>>;
  readonly violationsTotal: number;
  /**
   * Cost rollup; present only when `--cost` is passed. Omitted otherwise
   * so the existing snapshot wire format stays byte-identical for
   * pre-`--cost` consumers.
   */
  readonly cost?: CostRollup;
}

/**
 * Per-step cost bucket — one entry per workflow step that has at least
 * one `delegation.complete` event. Fields mirror the prose renderer's
 * per-step line so the JSON and human forms report the same numbers.
 */
export interface CostStepBucket {
  readonly usd: number;
  readonly delegations: number;
  readonly tokenSource: number;
  readonly proxySource: number;
}

/**
 * Cost rollup attached to a `StatusSnapshot` when `--cost` is active.
 *
 * `message` is populated (with "no v0.5.0 sessions found") when the
 * session has zero `delegation.complete` events — per L11, we emit the
 * marker rather than fabricating `$0.00`. When `message` is present all
 * numeric fields are zero and `perStep` is an empty object.
 */
export interface CostRollup {
  readonly cumulativeUsd: number;
  readonly sources: { readonly tokens: number; readonly proxy: number };
  readonly perStep: Readonly<Record<string, CostStepBucket>>;
  readonly message?: string;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runStatusWithOptions}. Exposed for tests
 * only; the CLI entry point {@link runStatus} never passes overrides.
 */
export interface StatusOverrides {
  /** Override the session directory; when set, --session-id and CLAUDE_SESSION_ID are ignored. */
  readonly sessionDir?: string;
}

export async function runStatus(args: string[]): Promise<void> {
  await runStatusWithOptions(args);
}

export async function runStatusWithOptions(
  args: string[],
  overrides: StatusOverrides = {},
): Promise<void> {
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
    process.stderr.write(`gobbi workflow status: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const sessionDir =
    overrides.sessionDir ??
    resolveSessionDir(
      typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
    );
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi workflow status: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi workflow status: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const sessionId = sessionDirName(sessionDir);
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, partitionKeys);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);
    const cost = values.cost === true ? aggregateCost(store) : undefined;
    const snapshot = buildSnapshot(state, cost);
    if (values.json === true) {
      process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
    } else {
      process.stdout.write(renderHuman(snapshot));
    }
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Snapshot assembly
// ---------------------------------------------------------------------------

/**
 * Build a {@link StatusSnapshot} from a {@link WorkflowState}. Exported for
 * unit tests — pure with respect to its input. The optional `cost`
 * argument is attached verbatim when provided — the aggregator runs
 * outside this function so the snapshot builder stays pure.
 */
export function buildSnapshot(
  state: WorkflowState,
  cost?: CostRollup,
): StatusSnapshot {
  const violationsByFamily = countViolationsByFamily(state.violations);
  return {
    sessionId: state.sessionId,
    schemaVersion: state.schemaVersion,
    currentStep: state.currentStep,
    currentSubstate: state.currentSubstate,
    completedSteps: state.completedSteps,
    activeSubagents: state.activeSubagents.map((a) => ({
      subagentId: a.subagentId,
      agentType: a.agentType,
      step: a.step,
    })),
    evalConfig: state.evalConfig,
    feedbackRound: state.feedbackRound,
    maxFeedbackRounds: state.maxFeedbackRounds,
    lastVerdictOutcome: state.lastVerdictOutcome,
    violationsByFamily,
    violationsTotal: state.violations.length,
    ...(cost !== undefined ? { cost } : {}),
  };
}

/**
 * Group violation records by the DiagnosticCode family letter. The code
 * field is present on v2+ records but absent on v1 (pre-C.8) on-disk rows;
 * the absent case is bucketed as `untagged` so operators still see the
 * count. Result keys are sorted alphabetically for stable output.
 */
export function countViolationsByFamily(
  violations: readonly GuardViolationRecord[],
): Readonly<Record<string, number>> {
  const counts = new Map<string, number>();
  for (const v of violations) {
    const code = readOptionalCode(v);
    const family = code === undefined ? 'untagged' : familyOf(code);
    counts.set(family, (counts.get(family) ?? 0) + 1);
  }
  const sorted: Record<string, number> = {};
  for (const key of [...counts.keys()].sort()) {
    sorted[key] = counts.get(key) ?? 0;
  }
  return sorted;
}

/**
 * Extract the family letter (E/W/X/V/etc.) from a DiagnosticCode string.
 * Returns `other` for codes that don't start with one of the reserved
 * letters — forward-compatible with future additions.
 */
function familyOf(code: string): string {
  const head = code.charAt(0);
  switch (head) {
    case 'E':
      return 'E';
    case 'W':
      return 'W';
    case 'X':
      return 'X';
    case 'V':
      return 'V';
    default:
      return 'other';
  }
}

/**
 * Violations recorded on state do not yet carry a `code` field in the type
 * signature — C.8 kept the schema surgical. The reducer's `guard.warn` case
 * can attach one in future, so read defensively.
 */
function readOptionalCode(v: GuardViolationRecord): string | undefined {
  const bag = v as unknown as { code?: unknown };
  return typeof bag.code === 'string' ? bag.code : undefined;
}

// ---------------------------------------------------------------------------
// Cost aggregation
// ---------------------------------------------------------------------------

/**
 * Marker emitted when a session carries zero `delegation.complete`
 * events — per L11. Exported for tests.
 */
export const COST_EMPTY_SESSION_MESSAGE = 'no v0.5.0 sessions found';

/**
 * Query the event store and fold all `delegation.complete` rows into a
 * {@link CostRollup}. Exported for unit tests — `store` is the only
 * input, the result is deterministic given the store's contents.
 *
 * Token-derived cost is primary (via {@link derivedCost}); the
 * `sizeProxyBytes` fallback kicks in only when `tokensJson` is NULL.
 * Rows with neither contribute 0 and do not increment either source
 * counter (they still count as a delegation for the per-step total).
 */
export function aggregateCost(store: ReadStore): CostRollup {
  const rawRows = store.aggregateDelegationCosts();
  if (rawRows.length === 0) {
    return emptySessionRollup();
  }

  let cumulativeUsd = 0;
  let tokenSource = 0;
  let proxySource = 0;
  const perStep = new Map<string, {
    usd: number;
    delegations: number;
    tokenSource: number;
    proxySource: number;
  }>();

  for (const row of rawRows) {
    const step = isString(row.step) && row.step.length > 0 ? row.step : 'untagged';
    const bucket = perStep.get(step) ?? {
      usd: 0,
      delegations: 0,
      tokenSource: 0,
      proxySource: 0,
    };
    bucket.delegations += 1;

    if (row.tokensJson !== null) {
      const cost = derivedCost(row.tokensJson, row.model);
      cumulativeUsd += cost;
      tokenSource += 1;
      bucket.usd += cost;
      bucket.tokenSource += 1;
    } else if (isNumber(row.bytes) && row.bytes > 0) {
      const cost = proxyCost(row.bytes);
      cumulativeUsd += cost;
      proxySource += 1;
      bucket.usd += cost;
      bucket.proxySource += 1;
    }
    // else: contributes 0, but still counted as a delegation.

    perStep.set(step, bucket);
  }

  const perStepOut: Record<string, CostStepBucket> = {};
  for (const [step, b] of [...perStep.entries()].sort(([a], [c]) => a.localeCompare(c))) {
    perStepOut[step] = {
      usd: roundUsd(b.usd),
      delegations: b.delegations,
      tokenSource: b.tokenSource,
      proxySource: b.proxySource,
    };
  }

  return {
    cumulativeUsd: roundUsd(cumulativeUsd),
    sources: { tokens: tokenSource, proxy: proxySource },
    perStep: perStepOut,
  };
}

function emptySessionRollup(): CostRollup {
  return {
    cumulativeUsd: 0,
    sources: { tokens: 0, proxy: 0 },
    perStep: {},
    message: COST_EMPTY_SESSION_MESSAGE,
  };
}

/**
 * Round a dollar amount to 4 decimal places — tight enough to preserve
 * cache-read precision on small delegations, loose enough to suppress
 * IEEE-754 add-order drift.
 */
function roundUsd(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

/**
 * Read-guard narrowing: rows come back from `bun:sqlite` typed via
 * {@link EventStore.aggregateDelegationCosts}' declared return shape,
 * but the typing is a convenience hint — the runtime values are still
 * whatever SQLite's `json_extract` produced. Explicit guard helpers are
 * applied at consumption sites (`row.step`, `row.tokensJson`, etc.)
 * above; this helper centralises the "is this a cost-row shape" check
 * for tests that want to exercise the aggregator against hand-crafted
 * row fixtures.
 *
 * Exported for tests only — production code reads store rows directly.
 */
export function isCostAggregateRow(value: unknown): value is CostAggregateRow {
  if (!isRecord(value)) return false;
  const step = value['step'];
  const subagentId = value['subagentId'];
  const tokensJson = value['tokensJson'];
  const model = value['model'];
  const bytes = value['bytes'];
  return (
    (step === null || isString(step)) &&
    (subagentId === null || isString(subagentId)) &&
    (tokensJson === null || isString(tokensJson)) &&
    (model === null || isString(model)) &&
    (bytes === null || isNumber(bytes))
  );
}

// ---------------------------------------------------------------------------
// Human rendering
// ---------------------------------------------------------------------------

function renderHuman(snapshot: StatusSnapshot): string {
  const lines: string[] = [];
  lines.push(`Session: ${snapshot.sessionId}`);
  lines.push(`Schema: v${snapshot.schemaVersion}`);
  const substate = snapshot.currentSubstate === null ? '-' : snapshot.currentSubstate;
  lines.push(`Step: ${snapshot.currentStep} (substate: ${substate})`);
  lines.push(
    `Completed: ${snapshot.completedSteps.length === 0 ? '-' : snapshot.completedSteps.join(', ')}`,
  );
  if (snapshot.activeSubagents.length === 0) {
    lines.push(`Active subagents: -`);
  } else {
    lines.push(`Active subagents:`);
    for (const a of snapshot.activeSubagents) {
      lines.push(`  - ${a.subagentId} (${a.agentType}) @ ${a.step}`);
    }
  }
  if (snapshot.evalConfig === null) {
    lines.push(`Eval: unset`);
  } else {
    lines.push(
      `Eval: ideation=${snapshot.evalConfig.ideation ? 'on' : 'off'}, planning=${snapshot.evalConfig.planning ? 'on' : 'off'}`,
    );
  }
  lines.push(
    `Feedback round: ${snapshot.feedbackRound}/${snapshot.maxFeedbackRounds}`,
  );
  lines.push(
    `Last verdict: ${snapshot.lastVerdictOutcome === null ? '-' : snapshot.lastVerdictOutcome}`,
  );
  if (snapshot.violationsTotal === 0) {
    lines.push(`Violations: none`);
  } else {
    const parts = Object.entries(snapshot.violationsByFamily)
      .map(([family, n]) => `${family}=${n}`)
      .join(', ');
    lines.push(`Violations: ${snapshot.violationsTotal} (${parts})`);
  }
  if (snapshot.cost !== undefined) {
    renderCostSection(lines, snapshot.cost);
  }
  lines.push('');
  return lines.join('\n');
}

/**
 * Append the `--cost` prose block to {@link renderHuman}'s output. When
 * the rollup carries the empty-session marker, emit a single-line
 * advisory and skip the numeric breakdown entirely — per L11 we must
 * never render `$0.00` when no `delegation.complete` events exist.
 */
function renderCostSection(lines: string[], cost: CostRollup): void {
  if (cost.message !== undefined) {
    lines.push(`Cost: ${cost.message}`);
    return;
  }
  lines.push(`Cumulative cost:    ${formatUsd(cost.cumulativeUsd)}`);
  lines.push(
    `  Source: ${cost.sources.tokens} estimated from tokens / ${cost.sources.proxy} estimated from size proxy`,
  );
  const stepEntries = Object.entries(cost.perStep);
  if (stepEntries.length === 0) return;
  lines.push(`  Per-step:`);
  for (const [step, bucket] of stepEntries) {
    const usd = formatUsd(bucket.usd);
    lines.push(`    ${step}: ${usd}  ${formatDelegationsSuffix(bucket)}`);
  }
}

function formatUsd(n: number): string {
  // Two-decimal prose rendering is sufficient at the CLI surface —
  // full 4-decimal precision lives in the JSON form (`cumulativeUsd`).
  const fixed = n.toFixed(2);
  return `$${fixed}`;
}

function formatDelegationsSuffix(bucket: CostStepBucket): string {
  const { delegations, tokenSource, proxySource } = bucket;
  if (delegations === 1) return `(1 delegation)`;
  if (tokenSource > 0 && proxySource > 0) {
    return `(${delegations} delegations: ${tokenSource} tokens-derived / ${proxySource} proxy)`;
  }
  return `(${delegations} delegations)`;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  // The session directory is `.gobbi/sessions/<id>` — the directory name is
  // the session id. We don't use path.basename from the path module here to
  // keep the import surface minimal; a manual split is enough.
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}
