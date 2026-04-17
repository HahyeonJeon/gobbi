/**
 * gobbi workflow capture-plan — PostToolUse(ExitPlanMode) hook handler.
 *
 * Reads a Claude Code PostToolUse JSON payload on stdin (fired for the
 * `ExitPlanMode` tool), writes the plan text to
 * `.gobbi/sessions/<id>/plan/plan.md`, and appends an `artifact.write`
 * event to the store. Plan revisions overwrite the same `plan.md` — the
 * JSONL transcript preserves revision history; the artifact file is
 * always the latest snapshot.
 *
 * ## Hook contract
 *
 * > **Observational hook — no permissionDecision, always exit 0.**
 *
 * PostToolUse cannot block the tool call. This command intentionally
 * carries no `permissionDecision` field on its response and exits 0 on
 * every path, including missing session and unparseable stdin. The
 * canonical outcome is the `artifact.write` event — stdout is
 * intentionally minimal.
 *
 * @see `.claude/project/gobbi/design/v050-hooks.md` §PostToolUse
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { readStdin } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { EventStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import { createArtifactWrite } from '../../workflow/events/artifact.js';
import type { WorkflowState } from '../../workflow/state.js';
import { resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Hook payload shape
// ---------------------------------------------------------------------------

/**
 * Subset of the PostToolUse JSON payload this command reads. We require
 * `tool_input.plan` to be present — any other shape is a silent no-op
 * because PostToolUse cannot block the tool call and there is no graceful
 * recovery for missing plan content.
 *
 * Source: `v050-hooks.md:124–131`.
 */
interface PostToolUsePayload {
  readonly tool_name?: string;
  readonly session_id?: string;
  readonly tool_call_id?: string;
  readonly tool_input?: {
    readonly plan?: string;
    readonly planFilePath?: string;
  };
}

function asPayload(value: unknown): PostToolUsePayload {
  if (!isRecord(value)) return {};
  const out: Record<string, unknown> = {};
  if (isString(value['tool_name'])) out['tool_name'] = value['tool_name'];
  if (isString(value['session_id'])) out['session_id'] = value['session_id'];
  if (isString(value['tool_call_id'])) {
    out['tool_call_id'] = value['tool_call_id'];
  }
  const toolInput = value['tool_input'];
  if (isRecord(toolInput)) {
    const ti: Record<string, unknown> = {};
    if (isString(toolInput['plan'])) ti['plan'] = toolInput['plan'];
    if (isString(toolInput['planFilePath'])) {
      ti['planFilePath'] = toolInput['planFilePath'];
    }
    out['tool_input'] = ti;
  }
  return out as PostToolUsePayload;
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export interface CapturePlanOverrides {
  /** Override the resolved session directory (tests-only). */
  readonly sessionDir?: string;
  /** Seed the payload directly (tests-only). */
  readonly payload?: unknown;
}

export async function runCapturePlan(args: string[]): Promise<void> {
  await runCapturePlanWithOptions(args);
}

/**
 * Testable entry point — same behaviour as {@link runCapturePlan} but
 * accepts overrides for session directory and stdin payload.
 */
export async function runCapturePlanWithOptions(
  args: string[],
  overrides: CapturePlanOverrides = {},
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Acquire payload ------------------------------------------------
  const rawPayload =
    overrides.payload !== undefined ? overrides.payload : await readJsonStdin();
  const payload = asPayload(rawPayload);

  const plan = payload.tool_input?.plan;
  if (plan === undefined || plan === '') {
    // No plan content to persist — exit silently.
    return;
  }

  // --- 2. Resolve session ------------------------------------------------
  const sessionDir =
    overrides.sessionDir ?? resolveSessionDir(payload.session_id);
  if (sessionDir === null) {
    return;
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    return;
  }

  // --- 3. Open store + read state ----------------------------------------
  const sessionId = payload.session_id ?? sessionDirName(sessionDir);
  let store: EventStore;
  try {
    store = new EventStore(dbPath);
  } catch {
    return;
  }

  try {
    let state: WorkflowState;
    try {
      state = resolveWorkflowState(sessionDir, store, sessionId);
    } catch {
      return;
    }

    // --- 4. Write plan artifact -----------------------------------------
    const planDir = join(sessionDir, 'plan');
    const filename = 'plan.md';
    mkdirSync(planDir, { recursive: true });
    writeFileSync(join(planDir, filename), plan, 'utf8');

    // --- 5. Emit artifact.write -----------------------------------------
    const event = createArtifactWrite({
      step: state.currentStep,
      filename,
      artifactType: 'plan',
    });
    const { kind, toolCallId } = idempotencyFor(payload.tool_call_id);
    try {
      appendEventAndUpdateState(
        store,
        sessionDir,
        state,
        event,
        'hook',
        sessionId,
        kind,
        toolCallId,
      );
    } catch {
      // Best-effort — the artifact file is already on disk.
    }
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface IdempotencyChoice {
  readonly kind: 'tool-call' | 'system';
  readonly toolCallId: string | undefined;
}

function idempotencyFor(toolCallId: string | undefined): IdempotencyChoice {
  if (typeof toolCallId === 'string' && toolCallId !== '') {
    return { kind: 'tool-call', toolCallId };
  }
  return { kind: 'system', toolCallId: undefined };
}

async function readJsonStdin(): Promise<unknown> {
  const raw = await readStdin();
  if (raw === null || raw.trim() === '') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow capture-plan

PostToolUse hook handler for the ExitPlanMode tool. Reads the Claude Code
hook payload on stdin, writes tool_input.plan to
.gobbi/sessions/<id>/plan/plan.md (overwriting any previous plan), and
appends one artifact.write event to the store.

Observational hook — writes no permissionDecision and always exits 0.`;

export { USAGE as CAPTURE_PLAN_USAGE };
