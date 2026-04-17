/**
 * gobbi workflow status — read-only workflow state projection.
 *
 * Resolves the active session's state via `resolveWorkflowState` and renders
 * a human-readable summary. `--json` returns a structured snapshot for
 * machine consumers.
 *
 * Cost accounting is intentionally omitted from this command — PR E adds
 * it when verification runs land.
 *
 * Violation counts are grouped by DiagnosticCode family prefix
 * (`E`/`W`/`X`/`V`), dogfooding C.8-a's letter-prefix scheme. Records without
 * a `code` field (pre-v2 `guard.violation` entries on disk) are bucketed as
 * the `untagged` family so operators still see them.
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from '../../workflow/store.js';
import { resolveWorkflowState } from '../../workflow/engine.js';
import type { GuardViolationRecord, WorkflowState } from '../../workflow/state.js';
import { resolveSessionDir } from '../session.js';

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
  --help, -h          Show this help message`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  json: { type: 'boolean', default: false },
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
  readonly evalConfig: { readonly ideation: boolean; readonly plan: boolean } | null;
  readonly feedbackRound: number;
  readonly maxFeedbackRounds: number;
  readonly lastVerdictOutcome: 'pass' | 'revise' | null;
  /** Violation counts grouped by DiagnosticCode family prefix. */
  readonly violationsByFamily: Readonly<Record<string, number>>;
  readonly violationsTotal: number;
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
  const store = new EventStore(dbPath);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);
    const snapshot = buildSnapshot(state);
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
 * unit tests — pure with respect to its input.
 */
export function buildSnapshot(state: WorkflowState): StatusSnapshot {
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
      `Eval: ideation=${snapshot.evalConfig.ideation ? 'on' : 'off'}, plan=${snapshot.evalConfig.plan ? 'on' : 'off'}`,
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
  lines.push('');
  return lines.join('\n');
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
