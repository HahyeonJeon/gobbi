/**
 * gobbi workflow capture-subagent — SubagentStop hook handler.
 *
 * Reads a Claude Code SubagentStop JSON payload on stdin, resolves the active
 * session, extracts the subagent's final output from its JSONL transcript,
 * writes an artifact file to the session's `artifacts/` directory, and
 * appends either a `delegation.complete` or `delegation.fail` event to the
 * event store. Every SubagentStop payload produces exactly one event — no
 * silent drops. The three failure cases defined by `v050-hooks.md:96–105`
 * are:
 *
 *   1. Transcript present and parseable → artifact + `delegation.complete`.
 *   2. Transcript present but unparseable → marker artifact +
 *      `delegation.fail` (with `transcriptPath` on the event data).
 *   3. Transcript absent → marker artifact + `delegation.fail` (with reason
 *      `"transcript not found at …"`).
 *
 * ## Hook contract
 *
 * > **Observational hook — no permissionDecision, always exit 0.**
 *
 * SubagentStop is a PostToolUse-class hook; it observes, it does not gate.
 * The hook response carries no `permissionDecision` field. The canonical
 * outcome of the capture is the `delegation.complete` / `delegation.fail`
 * event — stdout is intentionally minimal.
 *
 * ## Failure discipline
 *
 * Like `guard`, this command must exit 0 on every path. Missing session,
 * missing store, invalid stdin — all silent exits. The one thing we never
 * do is silently drop a SubagentStop with a valid session — that would
 * violate the "every input produces exactly one event" rule.
 *
 * ## Parent linkage
 *
 * `parent_seq` is best-effort. On each invocation we scan the most recent
 * `delegation.spawn` event and link to it when `data.subagentId ===
 * payload.agent_id`. When no match, we omit `parent_seq`. PR F will supply
 * `tool_call_id`-based precise linkage.
 *
 * ## Cost fields (PR E)
 *
 * If the stdin carries `tokensUsed` / `cacheHitRatio`, we pass them through
 * onto `delegation.complete` data. PR C does NOT extract these from the
 * transcript nor invent their schema — that is PR E's scope.
 *
 * @see `.claude/project/gobbi/design/v050-hooks.md` §SubagentStop
 * @see `.claude/project/gobbi/reference/subagent-transcripts.md`
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { readStdinJson } from '../../lib/stdin.js';
import {
  extractMessageContent,
  readLastLine,
} from '../../lib/jsonl.js';
import { isRecord, isString, isNumber } from '../../lib/guards.js';
import { EventStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import {
  createDelegationComplete,
  createDelegationFail,
} from '../../workflow/events/delegation.js';
import { createArtifactWrite } from '../../workflow/events/artifact.js';
import type { WorkflowState } from '../../workflow/state.js';
import { resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Hook payload shape
// ---------------------------------------------------------------------------

/**
 * Subset of the Claude Code SubagentStop JSON payload this command reads.
 * Fields are optional because a malformed payload must still exit 0
 * silently. Source: `v050-hooks.md:83–91`.
 */
interface SubagentStopPayload {
  readonly agent_id?: string;
  readonly agent_type?: string;
  readonly agent_transcript_path?: string;
  readonly last_assistant_message?: string;
  readonly stop_hook_active?: boolean;
  readonly session_id?: string;
  readonly tool_call_id?: string;
  /** Optional cost passthrough — schema owned by PR E. */
  readonly tokensUsed?: number;
  readonly cacheHitRatio?: number;
}

function asPayload(value: unknown): SubagentStopPayload {
  if (!isRecord(value)) return {};
  const payload: Record<string, unknown> = { ...value };
  const keys: readonly (keyof SubagentStopPayload)[] = [
    'agent_id',
    'agent_type',
    'agent_transcript_path',
    'last_assistant_message',
    'session_id',
    'tool_call_id',
  ];
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const v = payload[key];
    if (isString(v)) out[key] = v;
  }
  if (payload['stop_hook_active'] === true) out['stop_hook_active'] = true;
  const tokens = payload['tokensUsed'];
  if (isNumber(tokens)) out['tokensUsed'] = tokens;
  const cache = payload['cacheHitRatio'];
  if (isNumber(cache)) out['cacheHitRatio'] = cache;
  return out as SubagentStopPayload;
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export interface CaptureSubagentOverrides {
  /** Override the resolved session directory (tests-only). */
  readonly sessionDir?: string;
  /** Seed the payload directly (tests-only). */
  readonly payload?: unknown;
}

export async function runCaptureSubagent(args: string[]): Promise<void> {
  await runCaptureSubagentWithOptions(args);
}

/**
 * Testable entry point — same behaviour as {@link runCaptureSubagent} but
 * accepts overrides for the session directory and stdin payload.
 */
export async function runCaptureSubagentWithOptions(
  args: string[],
  overrides: CaptureSubagentOverrides = {},
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Acquire payload ------------------------------------------------
  const rawPayload =
    overrides.payload !== undefined
      ? overrides.payload
      : await readStdinJson<unknown>();
  const payload = asPayload(rawPayload);

  // --- 2. Reentrance guard ----------------------------------------------
  // `stop_hook_active === true` means this SubagentStop was triggered from
  // within another Stop-class hook. Processing would cascade; per
  // `v050-hooks.md:93` we exit 0 silently.
  if (payload.stop_hook_active === true) {
    return;
  }

  // --- 3. Resolve session ------------------------------------------------
  const sessionDir =
    overrides.sessionDir ?? resolveSessionDir(payload.session_id);
  if (sessionDir === null) {
    return; // silent fail — no active session
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    return;
  }

  // --- 4. Open store + read state ---------------------------------------
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

    const agentId = payload.agent_id ?? '';
    const agentType = payload.agent_type ?? 'subagent';
    const transcriptPath = payload.agent_transcript_path ?? '';
    const round = state.feedbackRound + 1;
    const artifactsDir = join(sessionDir, 'artifacts');
    const successFilename = `${agentType}-r${round}.md`;
    const failureFilename = `delegation-fail-r${round}.md`;

    // --- 5. Parent-seq best-effort lookup -----------------------------
    const parentSeq = findParentSpawnSeq(store, agentId);

    // --- 6. Three-case extraction + emission -------------------------
    if (transcriptPath === '' || !existsSync(transcriptPath)) {
      // Case 3 — transcript absent.
      const reason =
        transcriptPath === ''
          ? 'transcript path not supplied'
          : `transcript not found at ${transcriptPath}`;
      const artifactContent =
        `# Delegation failure (${agentType}, round ${round})\n\n${reason}\n`;
      writeArtifact(artifactsDir, failureFilename, artifactContent);
      emitDelegationFail(
        store,
        sessionDir,
        state,
        sessionId,
        agentId,
        reason,
        transcriptPath === '' ? undefined : transcriptPath,
        payload.tool_call_id,
        parentSeq,
      );
      emitArtifactWriteAfter(
        store,
        sessionDir,
        state,
        sessionId,
        'delegation-fail',
        failureFilename,
        payload.tool_call_id,
      );
      return;
    }

    // Transcript present — try to extract.
    const extracted = await extractLastAssistantText(transcriptPath);
    if (extracted === null || extracted === '') {
      // Case 2 — transcript unparseable or empty assistant text.
      const explanation =
        extracted === null
          ? `Transcript at ${transcriptPath} could not be parsed`
          : `Transcript at ${transcriptPath} yielded no assistant text`;
      const artifactContent =
        `# Delegation failure (${agentType}, round ${round})\n\n${explanation}\n`;
      writeArtifact(artifactsDir, failureFilename, artifactContent);
      emitDelegationFail(
        store,
        sessionDir,
        state,
        sessionId,
        agentId,
        explanation,
        transcriptPath,
        payload.tool_call_id,
        parentSeq,
      );
      emitArtifactWriteAfter(
        store,
        sessionDir,
        state,
        sessionId,
        'delegation-fail',
        failureFilename,
        payload.tool_call_id,
      );
      return;
    }

    // Case 1 — transcript present and parseable.
    writeArtifact(artifactsDir, successFilename, extracted);
    const artifactPath = join(artifactsDir, successFilename);
    emitDelegationComplete(
      store,
      sessionDir,
      state,
      sessionId,
      agentId,
      artifactPath,
      payload.tokensUsed,
      payload.cacheHitRatio,
      payload.tool_call_id,
      parentSeq,
    );
    emitArtifactWriteAfter(
      store,
      sessionDir,
      state,
      sessionId,
      'delegation',
      successFilename,
      payload.tool_call_id,
    );
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Transcript extraction
// ---------------------------------------------------------------------------

/**
 * Extract the last assistant text from a JSONL transcript.
 *
 * Mirrors the extraction pattern used by `commands/note.ts::runNoteCollect`
 * — the last line's `.message.content` drives `extractMessageContent`,
 * which resolves string or content-array shapes into a single text string.
 *
 * Returns `null` when the file can't be opened, parsed, or is empty.
 * Returns `''` when the last line exists but carries no extractable
 * assistant text (e.g., a tool_use-terminated tail). The caller treats
 * both as the "unparseable" case per `v050-hooks.md:96–105`.
 */
async function extractLastAssistantText(
  transcriptPath: string,
): Promise<string | null> {
  let last: unknown;
  try {
    last = await readLastLine(transcriptPath);
  } catch {
    return null;
  }
  if (last === null) return null;
  if (!isRecord(last)) return null;

  const message = last['message'];
  if (!isRecord(message)) return null;

  return extractMessageContent(message['content']);
}

// ---------------------------------------------------------------------------
// Parent linkage
// ---------------------------------------------------------------------------

/**
 * Find the `seq` of the most recent `delegation.spawn` event whose data
 * carries `subagentId === agentId`. Returns `null` when no match — the
 * caller then emits the event without parent linkage.
 *
 * Best-effort by design. PR F will supply `tool_call_id`-scoped precise
 * linkage.
 */
function findParentSpawnSeq(
  store: EventStore,
  agentId: string,
): number | null {
  if (agentId === '') return null;
  const row = store.last('delegation.spawn');
  if (row === null) return null;
  try {
    const data = JSON.parse(row.data) as unknown;
    if (!isRecord(data)) return null;
    if (data['subagentId'] !== agentId) return null;
    return row.seq;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Artifact IO
// ---------------------------------------------------------------------------

function writeArtifact(dir: string, filename: string, content: string): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), content, 'utf8');
}

// ---------------------------------------------------------------------------
// Event emission helpers
// ---------------------------------------------------------------------------

function emitDelegationComplete(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  agentId: string,
  artifactPath: string,
  tokensUsed: number | undefined,
  cacheHitRatio: number | undefined,
  toolCallId: string | undefined,
  parentSeq: number | null,
): void {
  const event = createDelegationComplete({
    subagentId: agentId,
    artifactPath,
    ...(tokensUsed !== undefined ? { tokensUsed } : {}),
    ...(cacheHitRatio !== undefined ? { cacheHitRatio } : {}),
  });
  const { kind, toolCallId: tcid } = idempotencyFor(toolCallId);
  try {
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      sessionId,
      kind,
      tcid,
      parentSeq,
    );
  } catch {
    // Best-effort — stdout is not the canonical outcome; the event is.
  }
}

function emitDelegationFail(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  agentId: string,
  reason: string,
  transcriptPath: string | undefined,
  toolCallId: string | undefined,
  parentSeq: number | null,
): void {
  const event = createDelegationFail({
    subagentId: agentId,
    reason,
    ...(transcriptPath !== undefined ? { transcriptPath } : {}),
  });
  const { kind, toolCallId: tcid } = idempotencyFor(toolCallId);
  try {
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      sessionId,
      kind,
      tcid,
      parentSeq,
    );
  } catch {
    // Best-effort.
  }
}

/**
 * Emit `artifact.write` after a delegation.complete / delegation.fail has
 * landed. The artifact event is informational and uses a distinct
 * idempotency derivation (tool-call + artifact.write vs tool-call +
 * delegation.*) — so retries with the same `tool_call_id` still dedupe
 * per-event-type at the store boundary.
 *
 * State reads for this call intentionally use the caller-provided `state`
 * (pre-complete). The reducer's artifact-write branch only mutates
 * `state.artifacts[step]` — that slice is independent of the
 * delegation.complete mutation (which touches `activeSubagents`), so
 * reading a slightly stale `state` is safe for this single append.
 */
function emitArtifactWriteAfter(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  sessionId: string,
  artifactType: string,
  filename: string,
  toolCallId: string | undefined,
): void {
  const event = createArtifactWrite({
    step: state.currentStep,
    filename,
    artifactType,
  });
  const { kind, toolCallId: tcid } = idempotencyFor(toolCallId);
  try {
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      sessionId,
      kind,
      tcid,
    );
  } catch {
    // Best-effort.
  }
}

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

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow capture-subagent

SubagentStop hook handler. Reads the Claude Code SubagentStop payload on
stdin, extracts the subagent's final output from its JSONL transcript,
writes an artifact file under .gobbi/sessions/<id>/artifacts/, and appends
exactly one delegation.complete or delegation.fail event to the store.

Observational hook — writes no permissionDecision and always exits 0.`;

export { USAGE as CAPTURE_SUBAGENT_USAGE };
