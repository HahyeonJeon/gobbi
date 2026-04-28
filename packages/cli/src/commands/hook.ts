/**
 * gobbi hook — subcommand dispatcher for Claude Code hook events.
 *
 * One subcommand per Claude Code hook event (28 total). Each subcommand
 * is the canonical entrypoint Claude Code's hook system invokes; the body
 * either does the event-specific workflow work (5 non-trivial bodies —
 * `session-start`, `pre-tool-use`, `post-tool-use`, `subagent-stop`,
 * `stop`) or runs the shared generic-stub body (the remaining 23) which
 * reads stdin, exits 0, and reserves the slot for PR-FIN-1d's notify
 * dispatch wiring.
 *
 * Mirrors `commands/maintenance.ts` and `commands/project.ts` exactly: a
 * `readonly HookCommand[]` registry, help derived from the registry, and
 * a separate registry-parameterised dispatch exported for tests. Each
 * sub-handler is dynamic-`import()`-ed so unrelated hook events pay no
 * cold-start cost when Claude Code only fires one event per turn.
 *
 * ## Scope (PR-FIN-1b)
 *
 * Ships all 28 events with `gobbi hook <event>` registered in the plugin
 * manifest (and `.claude/settings.json`). The five events that already
 * had non-trivial workflow bodies (SessionStart / PreToolUse /
 * PostToolUse-ExitPlanMode / SubagentStop / Stop) are wired to the
 * existing `gobbi workflow init/guard/capture-planning/capture-subagent/
 * stop` commands via in-process direct imports — the parsed stdin
 * payload threads through as a parameter so sub-steps don't re-read a
 * drained stdin. The remaining 23 events register a stub body that
 * drains stdin best-effort and exits 0, reserving the slot for PR-FIN-1d.
 *
 * ## Sub-step invocation pattern
 *
 * In-process direct imports (not subprocess spawn). Rationale:
 *
 *   - Latency. Hooks block the user's turn; spawning a child Bun process
 *     adds 100–300ms per event on cold start.
 *   - Stdin discipline. The hook entrypoint reads stdin once via
 *     `readStdinJson`. Sub-steps receive the parsed payload as an
 *     overrides parameter (`runGuardWithOptions({ payload })`,
 *     `runConfigEnv([], payload)`, etc.) so they don't double-read.
 *   - Error containment. A sub-step exception still surfaces — the hook
 *     entrypoint wraps the chain in a try/catch and exits 0 on any
 *     failure (hooks must never block Claude Code).
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes (every hook handler
 *     exits 0 — the Claude Code hook contract requires it).
 *
 * @see `commands/hook/session-start.ts`     (SessionStart — chains config env + workflow init)
 * @see `commands/hook/pre-tool-use.ts`      (PreToolUse — chains workflow guard)
 * @see `commands/hook/post-tool-use.ts`     (PostToolUse — chains capture-planning on ExitPlanMode)
 * @see `commands/hook/subagent-stop.ts`     (SubagentStop — chains capture-subagent)
 * @see `commands/hook/stop.ts`              (Stop — chains workflow stop)
 * @see `commands/hook/_stub.ts`             (shared generic body for the 23 stub events)
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `hook` subcommand registry. `run` receives the argv
 * slice AFTER the subcommand name (typically empty for hook commands;
 * Claude Code does not pass argv). The handler owns its own flag parsing
 * and is expected to exit 0 on every path per the hook contract.
 *
 * Mirrors `MaintenanceCommand` in `commands/maintenance.ts` — same
 * `{ name, summary, run }` shape, same dispatch semantics.
 */
export interface HookCommand {
  readonly name: string;
  readonly summary: string;
  readonly run: (args: string[]) => Promise<void>;
}

/**
 * Canonical list of registered hook subcommands. Names are kebab-case
 * mappings of the Claude Code event names (e.g., `SessionStart` →
 * `session-start`). All 28 events are registered so the plugin manifest
 * + per-repo `.claude/settings.json` can point every event at a real
 * command — Claude Code requires the command resolve at hook-fire time.
 *
 * The five "non-trivial" events have dedicated handler files. The
 * remaining 23 share the `_stub.ts` helper via thin caller files. Every
 * event has its own caller file so hook-specific notify dispatch (PR-FIN-1d)
 * can land per-event without a large dispatcher rewrite.
 *
 * Ordering follows the rough lifecycle: session lifecycle → user-prompt
 * → tool use → permissions → notification → subagent → tasks → idle →
 * compaction → worktree → file/cwd → instructions/config → elicitation.
 */
export const HOOK_COMMANDS: readonly HookCommand[] = [
  // --- Session lifecycle ---------------------------------------------------
  {
    name: 'session-start',
    summary: 'SessionStart — persist CLAUDE_* env + initialise workflow session',
    run: async (args: string[]): Promise<void> => {
      const { runHookSessionStart } = await import('./hook/session-start.js');
      await runHookSessionStart(args);
    },
  },
  {
    name: 'session-end',
    summary: 'SessionEnd — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookSessionEnd } = await import('./hook/session-end.js');
      await runHookSessionEnd(args);
    },
  },
  // --- Stop ---------------------------------------------------------------
  {
    name: 'stop',
    summary: 'Stop — write session.heartbeat + timeout detection',
    run: async (args: string[]): Promise<void> => {
      const { runHookStop } = await import('./hook/stop.js');
      await runHookStop(args);
    },
  },
  {
    name: 'stop-failure',
    summary: 'StopFailure — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookStopFailure } = await import('./hook/stop-failure.js');
      await runHookStopFailure(args);
    },
  },
  // --- User prompt --------------------------------------------------------
  {
    name: 'user-prompt-submit',
    summary: 'UserPromptSubmit — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookUserPromptSubmit } = await import('./hook/user-prompt-submit.js');
      await runHookUserPromptSubmit(args);
    },
  },
  {
    name: 'user-prompt-expansion',
    summary: 'UserPromptExpansion — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookUserPromptExpansion } = await import('./hook/user-prompt-expansion.js');
      await runHookUserPromptExpansion(args);
    },
  },
  // --- Tool use -----------------------------------------------------------
  {
    name: 'pre-tool-use',
    summary: 'PreToolUse — guard evaluation + permissionDecision',
    run: async (args: string[]): Promise<void> => {
      const { runHookPreToolUse } = await import('./hook/pre-tool-use.js');
      await runHookPreToolUse(args);
    },
  },
  {
    name: 'post-tool-use',
    summary: 'PostToolUse — capture planning on ExitPlanMode',
    run: async (args: string[]): Promise<void> => {
      const { runHookPostToolUse } = await import('./hook/post-tool-use.js');
      await runHookPostToolUse(args);
    },
  },
  {
    name: 'post-tool-use-failure',
    summary: 'PostToolUseFailure — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPostToolUseFailure } = await import('./hook/post-tool-use-failure.js');
      await runHookPostToolUseFailure(args);
    },
  },
  {
    name: 'post-tool-batch',
    summary: 'PostToolBatch — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPostToolBatch } = await import('./hook/post-tool-batch.js');
      await runHookPostToolBatch(args);
    },
  },
  // --- Permissions --------------------------------------------------------
  {
    name: 'permission-request',
    summary: 'PermissionRequest — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPermissionRequest } = await import('./hook/permission-request.js');
      await runHookPermissionRequest(args);
    },
  },
  {
    name: 'permission-denied',
    summary: 'PermissionDenied — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPermissionDenied } = await import('./hook/permission-denied.js');
      await runHookPermissionDenied(args);
    },
  },
  // --- Notification -------------------------------------------------------
  {
    name: 'notification',
    summary: 'Notification — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookNotification } = await import('./hook/notification.js');
      await runHookNotification(args);
    },
  },
  // --- Subagent -----------------------------------------------------------
  {
    name: 'subagent-start',
    summary: 'SubagentStart — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookSubagentStart } = await import('./hook/subagent-start.js');
      await runHookSubagentStart(args);
    },
  },
  {
    name: 'subagent-stop',
    summary: 'SubagentStop — capture-subagent (writes delegation.complete/fail)',
    run: async (args: string[]): Promise<void> => {
      const { runHookSubagentStop } = await import('./hook/subagent-stop.js');
      await runHookSubagentStop(args);
    },
  },
  // --- Tasks --------------------------------------------------------------
  {
    name: 'task-created',
    summary: 'TaskCreated — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookTaskCreated } = await import('./hook/task-created.js');
      await runHookTaskCreated(args);
    },
  },
  {
    name: 'task-completed',
    summary: 'TaskCompleted — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookTaskCompleted } = await import('./hook/task-completed.js');
      await runHookTaskCompleted(args);
    },
  },
  // --- Idle ---------------------------------------------------------------
  {
    name: 'teammate-idle',
    summary: 'TeammateIdle — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookTeammateIdle } = await import('./hook/teammate-idle.js');
      await runHookTeammateIdle(args);
    },
  },
  // --- Compaction ---------------------------------------------------------
  {
    name: 'pre-compact',
    summary: 'PreCompact — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPreCompact } = await import('./hook/pre-compact.js');
      await runHookPreCompact(args);
    },
  },
  {
    name: 'post-compact',
    summary: 'PostCompact — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookPostCompact } = await import('./hook/post-compact.js');
      await runHookPostCompact(args);
    },
  },
  // --- Worktree -----------------------------------------------------------
  {
    name: 'worktree-create',
    summary: 'WorktreeCreate — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookWorktreeCreate } = await import('./hook/worktree-create.js');
      await runHookWorktreeCreate(args);
    },
  },
  {
    name: 'worktree-remove',
    summary: 'WorktreeRemove — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookWorktreeRemove } = await import('./hook/worktree-remove.js');
      await runHookWorktreeRemove(args);
    },
  },
  // --- File/cwd -----------------------------------------------------------
  {
    name: 'file-changed',
    summary: 'FileChanged — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookFileChanged } = await import('./hook/file-changed.js');
      await runHookFileChanged(args);
    },
  },
  {
    name: 'cwd-changed',
    summary: 'CwdChanged — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookCwdChanged } = await import('./hook/cwd-changed.js');
      await runHookCwdChanged(args);
    },
  },
  // --- Instructions/config ------------------------------------------------
  {
    name: 'instructions-loaded',
    summary: 'InstructionsLoaded — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookInstructionsLoaded } = await import('./hook/instructions-loaded.js');
      await runHookInstructionsLoaded(args);
    },
  },
  {
    name: 'config-change',
    summary: 'ConfigChange — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookConfigChange } = await import('./hook/config-change.js');
      await runHookConfigChange(args);
    },
  },
  // --- Elicitation --------------------------------------------------------
  {
    name: 'elicitation',
    summary: 'Elicitation — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookElicitation } = await import('./hook/elicitation.js');
      await runHookElicitation(args);
    },
  },
  {
    name: 'elicitation-result',
    summary: 'ElicitationResult — notify dispatch (PR-FIN-1d)',
    run: async (args: string[]): Promise<void> => {
      const { runHookElicitationResult } = await import('./hook/elicitation-result.js');
      await runHookElicitationResult(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly HookCommand[]): string {
  const header = `Usage: gobbi hook <event> [options]`;
  // Longest subcommand name drives column width so future entries do not
  // break alignment.
  const pad =
    commands.reduce((w, c) => Math.max(w, c.name.length), 0) + 2;
  const commandsSection =
    commands.length === 0
      ? '  (no events registered)'
      : commands
          .map((cmd) => `  ${cmd.name.padEnd(pad)}${cmd.summary}`)
          .join('\n');
  const optionsSection = `Options:\n  --help    Show this help message`;
  return `${header}\n\nEvents:\n${commandsSection}\n\n${optionsSection}\n\nThis namespace is meant to be invoked by Claude Code (via the plugin\nmanifest or .claude/settings.json hooks block), not by humans directly.`;
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export async function runHook(args: string[]): Promise<void> {
  return runHookWithRegistry(args, HOOK_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering).
 */
export async function runHookWithRegistry(
  args: string[],
  commands: readonly HookCommand[],
): Promise<void> {
  const subcommand = args[0];

  if (
    subcommand === undefined ||
    subcommand === '--help' ||
    subcommand === '-h'
  ) {
    console.log(renderHelp(commands));
    return;
  }

  const match = commands.find((cmd) => cmd.name === subcommand);
  if (match === undefined) {
    process.stderr.write(`Unknown subcommand: ${subcommand}\n`);
    process.stderr.write(renderHelp(commands));
    process.stderr.write('\n');
    process.exit(1);
  }

  await match.run(args.slice(1));
}
