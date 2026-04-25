# Gotcha: System

Environment, process management, hooks, and infrastructure mistakes that damage the user's setup.

---

### Blind-killing processes on ports
---
priority: critical
enforcement: hook
event: bash
pattern: "kill\\s+|pkill\\s+|killall\\s+"
---

**Priority:** Critical

**What happened:** Agent needed to free a port (4040) and ran `kill` on the process occupying it without first identifying what the process was. The process turned out to be critical for the user's remote/network connection. The user lost connectivity and had to reconnect.

**User feedback:** "Never kill processes on ports without identifying them first."

**Correct approach:** Always `lsof -i :PORT` first to identify what's running. Show the user what the process is. Only kill after confirmation, or if it's obviously the intended target (e.g., a node process running Storybook). Never assume a process on a port is safe to kill.

---

### Stop hook has no duration field
---
priority: medium
---

**Priority:** Medium

**What happened:** Agent tried to implement a task-done Slack notification in the Stop hook by reading `duration_ms` from the hook payload. The Stop hook payload does not contain any duration field — it only has `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`, `stop_hook_active`, and `last_assistant_message`. The notification never fired because the duration always defaulted to 0.

**User feedback:** Confirmed the fix works after implementing a two-hook approach.

**Correct approach:** Track timing with a two-hook approach. `UserPromptSubmit` hook records `date +%s` to `/tmp/claude-start-{session_id}`. `Stop` hook reads it and calculates elapsed time. Use `session_id` in filenames to avoid collisions between concurrent sessions.

---

### Plugin hooks in settings.json are silently ignored
---
priority: high
---

**Priority:** High

**What happened:** Gobbi's plugin distribution put all hook configuration (SessionStart, Stop, Notification, etc.) in `plugins/gobbi/settings.json`. Plugin users reported hooks not firing — the SessionStart hook script showed its usage message instead of executing automatically. Investigation revealed that Claude Code's plugin system only supports **agent settings** in plugin `settings.json`. Hooks, permissions, and other config in `settings.json` are silently ignored.

**User feedback:** Confirmed via the official Claude Code plugin reference at `https://code.claude.com/docs/en/plugins-reference`.

**Correct approach:** Plugin hooks must be in `hooks/hooks.json` at the plugin root. Claude Code auto-loads this standard location unconditionally — declaring `skills` or `agents` in `plugin.json` does NOT disable hook auto-discovery. Do NOT add `"hooks": "./hooks/hooks.json"` to `plugin.json`: the `hooks` field is for additional hook files only, and pointing it at the standard path triggers a duplicate-detection warning recorded against the plugin. Plugin `settings.json` is only for agent settings — do not put hooks or permissions there.

**Empirical verification:** See `.claude/project/gobbi/reference/plugin-hook-registration-v050.md` for the 4-cell matrix and evidence from Claude Code 2.1.87–2.1.110.

---

### Session-scoped state in hooks
---
priority: low
---

**Priority:** Low

**What happened:** Agent stored runtime state in a global variable within a hook script, expecting it to persist across hook invocations. The state was lost because each hook invocation runs in a fresh shell process. A related pattern: agent wrote hook state to `/tmp/claude-state.json` (a fixed filename) expecting it to persist within the session, but a second concurrent Claude session overwrote the file mid-run, corrupting the first session's state.

**User feedback:** Hook state must be persisted to disk with session-scoped filenames. In-memory state and shared filenames both fail under real usage conditions.

**Correct approach:** When a hook needs to persist state across invocations within the same session (e.g., tracking start time, accumulating counts, caching decisions), write it to disk using the naming convention `~/.claude/{purpose}_state_{session_id}.json` or `/tmp/claude-{purpose}-{session_id}`. The `session_id` is available in every hook payload's stdin JSON — read it with `jq .session_id`. Implement cleanup: either a TTL-based probabilistic approach (each invocation has a small chance of deleting files older than N hours) or a dedicated cleanup in the Stop hook. Never use a single shared filename like `/tmp/claude-state.json` — it breaks under concurrent sessions.

---

### Claude Code `hookSpecificOutput` requires `hookEventName`
---
priority: critical
---

**Priority:** Critical

**What happened:** `gobbi workflow guard` emitted `hookSpecificOutput` with only `permissionDecision` (and optionally `permissionDecisionReason` / `additionalContext`). Claude Code rejected every PreToolUse response with the error: `Hook JSON output validation failed — hookSpecificOutput is missing required field hookEventName`. The decision was discarded and tools ran with default permission, defeating the entire guard subsystem live in the user's session.

**User feedback:** Live debugging during the v0.5.0 phase-2 integration session — every Read/Write tool call surfaced the validation error.

**Correct approach:** Every per-event JSON envelope Claude Code accepts MUST include `hookSpecificOutput.hookEventName` matching the event under which the hook is registered (e.g., `'PreToolUse'`, `'PostToolUse'`). Pin the field with a TypeScript literal type — `readonly hookEventName: 'PreToolUse'` — so future emitters cannot omit or mistype it. The contract test at `packages/cli/src/__tests__/hooks-contract.test.ts` enumerates every hook in `.claude/settings.json` and locks the emit shape against the per-event schema. Reach for a literal-typed field over an optional one whenever a payload contract mandates the value.

---

### `.claude/settings.json` hook command names MUST exist in the CLI registry
---
priority: critical
---

**Priority:** Critical

**What happened:** `.claude/settings.json` registered `"command": "gobbi workflow capture-plan"` for `PostToolUse(ExitPlanMode)`. The CLI command was renamed to `capture-planning` during Pass 3 but the hook wiring was missed. Every plan-mode exit silently command-not-founded — Claude Code surfaced no error, the artifact was never written, and the workflow drifted from the spec.

**User feedback:** Discovered during the same v0.5.0 phase-2 integration session as the `hookEventName` bug; both hook bugs were fixed in one atomic Wave 0 commit.

**Correct approach:** After ANY rename of a `gobbi workflow <subcommand>`, run `gobbi workflow --help` and grep `.claude/settings.json` (and `plugins/*/hooks/hooks.json` for plugin distributions) to confirm every registered command resolves to a registered subcommand. The hooks-contract test at `packages/cli/src/__tests__/hooks-contract.test.ts` enumerates every hook command in `.claude/settings.json` and asserts it parses to a name in `WORKFLOW_COMMANDS` — a future rename without updating the wiring fails the test instead of failing silently in production. Mismatched command strings produce no diagnostic from Claude Code; the hook just runs `command-not-found` and continues, so this class of bug is invisible without the contract test.

---

### `bun build --outdir ./dist` overwrites `dist/cli.js` in-place during hook firing
---
priority: high
---

**Priority:** High

**What happened:** The default `bun build ./src/cli.ts --outdir ./dist` (in `packages/cli/package.json:build`) writes `dist/cli.js` in place. The installed `gobbi` binary's shim (`bin/gobbi.js`) imports from `../dist/cli.js` directly. During a Claude Code session, hooks (`PreToolUse`, `PostToolUse`, `SubagentStop`, `Stop`) fire several times per second and each one re-execs `gobbi`. A 2–4 second `bun build` window during an active session means a hook can read a half-written `dist/cli.js` and crash with `SyntaxError: Unexpected end of input` or similar parse errors. The hook fails open and the workflow continues, but the audit log records corruption.

**User feedback:** Surfaced during the Wave 0 fix session — a rebuild during an active session produced sporadic hook failures with no obvious cause.

**Correct approach:** Use `bun run build:safe` from `packages/cli/package.json` whenever hooks may fire concurrently with the build. The `build:safe` script writes to `./dist.new`, then atomically renames `dist.new/cli.js` over `dist/cli.js`. POSIX `rename(2)` is atomic on the same filesystem, so any hook that opens `dist/cli.js` either gets the old complete file or the new complete file — never a partial. The default `build` script remains for non-hook contexts (CI, `prepack`, fresh worktrees) where no concurrent reader exists.

---

### Bash tool executes the literal `git stash` regardless of intent comments
---
priority: high
enforcement: hook
event: bash
pattern: "git\\s+stash"
---

**Priority:** High

**What happened:** A subagent briefing said "NEVER `git stash` — sandbox denies the command." The subagent reproduced the literal command in a Bash tool call, intending to demonstrate the rule. The Bash tool ran the command anyway — comments and surrounding prose explaining "do not run" do not stop the runtime from executing the command. The stash silently captured working-tree changes; recovery required `git stash pop`.

**User feedback:** Surfaced as a self-reported violation during the Wave 4 execution of v0.5.0 Phase 2 integration. Existing gotcha #6 already says "never `git stash`" but did not explain that the Bash tool ignores intent comments around the literal.

**Correct approach:** Never type the literal `git stash` (or `git stash push`, `git stash pop`, `git stash list`) inside a Bash tool call, EVEN INSIDE quoted strings, comments, or example commands. If you need to demonstrate the rule in documentation, write it inside a Markdown file (Edit/Write tools), not inside a Bash command's text body. If the underlying need is to suspend uncommitted work, commit it on a temporary branch instead — `git checkout -b wip-<context> && git commit -am "wip: <context>"` and `git checkout - && git branch -D wip-<context>` after restoring. The same principle applies to other dangerous literals (e.g. `rm -rf /`, `kill -9 <pid>`) — do not let "I'm not actually running this" appear in a Bash command's command field, because the field is the command, not the explanation.
