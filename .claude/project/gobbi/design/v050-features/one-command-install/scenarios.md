# one-command-install — Scenarios

Behavior specifications for the one-command-install feature. This file covers the session-level flow where `/gobbi` detects the gobbi CLI, installs or updates it when absent, and then proceeds to session setup. It covers happy-path install/detect/update flows, error paths (install failure, missing prerequisites, partial install), edge cases (stale session config, concurrent sessions, orphaned worktrees), and cross-cutting concerns (idempotent hook invocation, session resume, mid-install interruption).

This file does NOT cover: the four setup questions themselves (`gobbi` skill `SKILL.md §FIFTH`), hook semantics beyond invocation (`deterministic-orchestration`), the CLI surface itself (`cli-as-runtime-api`), memory directory layout (`gobbi-memory`), or plugin publishing mechanics. Every scenario below has a stable ID in the `O-CI-{H|E|X}-NN` format so `checklist.md` and `review.md` can trace items back to a specific scenario (`rg 'O-CI-' .claude/project/gobbi/design/v050-features/one-command-install/` surfaces every reference). Scenarios tagged `(ASPIRATIONAL)` in their Evidence line describe behavior the `README.md` narrative implies but the current code does not yet implement — those exist deliberately to route the next pass's `review.md` toward `DRIFT` or `GAP` findings.

See `README.md` for the prose description of the feature and the navigation table that connects this spec to `checklist.md` and `review.md`.

---

## Happy path

### O-CI-H-01: Fresh workspace, CLI missing from PATH

Given a Claude Code project with the gobbi plugin configured in `settings.json`
And `plugins/gobbi/hooks/hooks.json` registers `SessionStart[startup|resume|compact]` → `gobbi workflow init`
And `@gobbitools/cli` is NOT installed globally (running `gobbi --version` exits non-zero with "command not found")
And Bun >= 1.2.0 is installed and on PATH
And no `.gobbi/sessions/{id}/` directory exists for the incoming session id

When the user opens a Claude Code session
And invokes `/gobbi`
And the session agent reaches step THIRD of `gobbi/SKILL.md` and runs `gobbi --version`

Then `gobbi --version` exits non-zero
And the session agent loads `cli-setup.md`
And the session agent runs `npm install -g @gobbitools/cli` per `cli-setup.md §Installation` Option 1
And after install, `gobbi --version` returns a non-empty version string and exits 0
And the session agent proceeds to step FOURTH of `gobbi/SKILL.md` (session-config detection) before any `gobbi workflow *` command runs

State trace:
  - before: no `@gobbitools/cli` binary on PATH; no `.gobbi/sessions/{id}/` directory; no `gobbi.db`
  - after install: `gobbi` on PATH; `gobbi --version` exits 0; no `.gobbi/sessions/{id}/` yet (init runs only from the SessionStart hook, not from the install step itself)
  - after subsequent SessionStart hook: `.gobbi/sessions/{id}/` created; `metadata.json` at `schemaVersion: 2`; `gobbi.db` opened in WAL mode; `workflow.start` appended at seq=1 and `workflow.eval.decide` appended at seq=2 in a single `store.transaction`
  - after init: `state.json` reflects `currentStep: ideation` with `completedSteps: []` and `feedbackRound: 0`
  - negative: no `workflow.start` event is emitted during the install step itself
  - negative: no write to `.claude/rules/`, `.claude/skills/`, or `.claude/agents/` from the install step (those paths are owned by the gobbi repo checkout / plugin symlinks, not by the CLI install)

Anti-outcome:
  - session does NOT proceed to the FIFTH setup questions before `gobbi --version` succeeds
  - session agent does NOT hand-write rules, skills, or agents into `.claude/` — those ship with the gobbi repo / plugin, not with the CLI install
  - session agent does NOT attempt `gobbi workflow init` before `gobbi --version` exits 0 (would fail silently via the hook path and corrupt state)

Evidence: `.claude/skills/gobbi/SKILL.md` §THIRD; `.claude/skills/gobbi/cli-setup.md` §Detection; `.claude/skills/gobbi/cli-setup.md` §Installation Option 1; `packages/cli/package.json` `"bin"` entry (maps `gobbi` → `./bin/gobbi.js`); `packages/cli/bin/gobbi.js` (`#!/usr/bin/env bun` shebang); `plugins/gobbi/hooks/hooks.json` SessionStart matcher `startup|resume|compact`; `packages/cli/src/commands/workflow/init.ts` header docblock (`workflow.start` + `workflow.eval.decide` emitted atomically in one transaction at `schemaVersion: 2`)

---

### O-CI-H-02: CLI already installed — skip install, proceed to setup

Given `@gobbitools/cli 0.5.0` is installed globally
And `gobbi --version` exits 0 and prints a semver string
And the session has no saved settings in `gobbi.json` for the current `CLAUDE_SESSION_ID`

When the user invokes `/gobbi` in a fresh Claude Code session
And step THIRD of `gobbi/SKILL.md` runs `gobbi --version`

Then the version check exits 0 on the first try
And the session agent does NOT load `cli-setup.md`
And the session agent does NOT run `npm install -g @gobbitools/cli`
And the session agent proceeds to step FOURTH (`gobbi config get $CLAUDE_SESSION_ID`)
And step FOURTH finds no existing settings, so the agent proceeds to step FIFTH (four setup questions)

State trace:
  - before: `gobbi` on PATH; `gobbi --version` exits 0; no `gobbi.json` entry for this session id
  - after version check: no filesystem change; no events emitted; no `.gobbi/sessions/{id}/` yet (the version check is read-only)
  - after SessionStart hook (separate from `/gobbi` skill execution): `.gobbi/sessions/{id}/` created with `schemaVersion: 2` metadata; `gobbi.db` opened; seq=1 `workflow.start` + seq=2 `workflow.eval.decide` appended in one transaction
  - negative: no re-install attempt; no `npm` invocation; no write under `.claude/`
  - negative: no AskUserQuestion prompt about installation — the install branch is skipped entirely

Evidence: `.claude/skills/gobbi/SKILL.md` §THIRD and §FOURTH; `.claude/skills/gobbi/cli-setup.md` §Detection first row ("Version prints ... Proceed to setup questions"); `packages/cli/src/commands/workflow/init.ts` §Idempotency docblock

---

### O-CI-H-03: Plugin refresh — skills/agents/rules update atomically with plugin

Given the gobbi plugin is already installed in Claude Code
And `.claude/rules/_gobbi-rule.md` is a symlink into `.claude/skills/_gobbi-rule-container/_gobbi-rule.md`
And `plugins/gobbi/skills/` and `plugins/gobbi/agents/` contain symlinks into `.claude/skills/` and `.claude/agents/` respectively
And the plugin publishes a new version that changes one or more files under `.claude/`

When the user (or the Claude Code plugin system) updates the gobbi plugin
And opens a new Claude Code session after the update

Then the updated skills, agents, and behavioral rules are loaded by the new session without any manual `.claude/` edit
And step SECOND of `gobbi/SKILL.md` finds `.claude/rules/_gobbi-rule.md` already present (symlink resolves post-update) and does not re-create it
And the refreshed `_gobbi-rule.md` content is the one the plugin ships

State trace:
  - before update: `_gobbi-rule.md` symlink resolves to the old container file
  - after update: the same symlink resolves to the new container file; no stale copies under `.claude/rules/`
  - negative: no duplicate `_gobbi-rule.md` created alongside the symlink; no orphaned skill directories left over from the previous version

Anti-outcome:
  - session agent does NOT ask the user to hand-merge any `.claude/` file after a plugin update
  - no non-symlink copy of `_gobbi-rule.md` is created that would shadow future updates

Evidence: `.claude/skills/gobbi/SKILL.md` §SECOND; `.claude/skills/_gobbi-rule-container/_gobbi-rule.md` (the source target of the symlink); `plugins/gobbi/skills/` contents (symlinks into `.claude/skills/`); `plugins/gobbi/agents/` contents (symlinks into `.claude/agents/`); `plugins/gobbi/.claude-plugin/plugin.json` (`skills` key + `agents` array) — note: the `"plugin install refreshes CLI binary"` claim in `README.md` paragraph 2 is `(ASPIRATIONAL)` — the plugin ships skills/agents via symlinks but does NOT ship the CLI binary (`packages/cli/bin/gobbi.js` is installed separately via `npm install -g @gobbitools/cli`)

---

### O-CI-H-04: `/gobbi` on a session with existing saved settings — reuse path

Given `@gobbitools/cli` is installed (`gobbi --version` exits 0)
And a prior `/gobbi` run for this `CLAUDE_SESSION_ID` wrote session settings via `gobbi config set $CLAUDE_SESSION_ID ...`
And `.claude/gobbi.json` contains an entry keyed by the current session id with `trivialRange`, `evaluationMode`, `gitWorkflow`, and `notify.*` keys populated

When the user invokes `/gobbi` (e.g., after Claude Code compaction) in the same logical session
And step THIRD of `gobbi/SKILL.md` confirms `gobbi --version` exits 0
And step FOURTH runs `gobbi config get $CLAUDE_SESSION_ID`

Then `gobbi config get` returns the saved settings
And the session agent presents the saved settings to the user
And the user chooses to reuse (per step FOURTH reuse-or-reconfigure branch)
And the session agent SKIPS the four setup questions (step FIFTH) and proceeds to `gobbi workflow init`

State trace:
  - before: `.claude/gobbi.json` contains settings for this session id; `.gobbi/sessions/{id}/` may or may not exist depending on whether this is a compact-resume or a fresh compact re-invoke
  - after reuse: no new entries written to `gobbi.json`; no duplicate setup question events emitted
  - after SessionStart hook idempotency (see O-CI-X-04): `gobbi workflow init` is a silent no-op if `metadata.json` already exists at `schemaVersion: 2`

Evidence: `.claude/skills/gobbi/SKILL.md` §FOURTH ("reuse them or reconfigure"); `.claude/skills/gobbi/SKILL.md` persistence block ("`gobbi.json` ... is managed exclusively through `gobbi config`"); `packages/cli/src/commands/workflow/init.ts` §Idempotency docblock

---

## Error paths

### O-CI-E-01: `npm install -g` fails — agent surfaces the error and pauses

Given `gobbi --version` exits non-zero (CLI missing)
And `npm` is installed and on PATH
And the user's environment causes `npm install -g @gobbitools/cli` to fail (e.g., `EACCES` on the npm prefix, network failure, registry 5xx, corporate proxy blocks)

When the session agent runs `npm install -g @gobbitools/cli` per `cli-setup.md §Installation` Option 1
And the install command exits non-zero

Then the session agent surfaces the install error to the user with the exit code and the npm stderr summary
And the session agent does NOT silently retry the install
And the session agent does NOT proceed to step FOURTH or invoke any `gobbi workflow *` command

State trace:
  - before: `gobbi --version` exits non-zero; no `.gobbi/sessions/{id}/`; no entry in `.claude/gobbi.json` for this session id
  - after install failure: still no `gobbi` on PATH; still no `.gobbi/sessions/{id}/`; no `workflow.start` event; still no `.claude/gobbi.json` entry (setup questions were not asked because step THIRD did not pass)
  - negative: no `workflow.start` event emitted; no second automatic `npm install` attempt; no fallback to Option 3 local execution (would not help — the hooks use bare `gobbi`)

Anti-outcome:
  - agent does NOT swallow the npm stderr and pretend the install succeeded
  - agent does NOT invoke any `gobbi workflow *` command while `gobbi --version` is still failing (which would silently break the hooks described in `plugins/gobbi/hooks/hooks.json`)

Evidence: `.claude/skills/gobbi/cli-setup.md` §Installation Option 1; `.claude/skills/gobbi/cli-setup.md` §Troubleshooting first row (`gobbi: command not found` → `npm install -g @gobbitools/cli`); `plugins/gobbi/hooks/hooks.json` (bare `gobbi` hook commands would fail without global install) — note: "auto-retry install once on transient failure" is not described anywhere in `cli-setup.md` and should NOT be implemented without a deliberate design pass `(ASPIRATIONAL)` for any retry policy

---

### O-CI-E-02: Bun runtime missing — prerequisite failure before or during install

Given `@gobbitools/cli` is NOT installed (`gobbi --version` exits non-zero)
And Bun is NOT installed (`bun --version` exits non-zero)

When the session agent runs `npm install -g @gobbitools/cli`
And the install either fails because npm cannot run the `postinstall` / `engines.bun` check, or succeeds but the subsequent `gobbi --version` fails because the binary's `#!/usr/bin/env bun` shebang cannot locate `bun`

Then the session agent recognises the failure mode as a missing Bun runtime (not an npm problem)
And the agent points the user at `bun.sh` per `cli-setup.md §Prerequisites`
And the agent pauses the session and does not proceed to setup questions

State trace:
  - before: no `gobbi` on PATH; no `bun` on PATH; no `.gobbi/sessions/{id}/`
  - after failure surfaced: still no `gobbi` on PATH; still no `bun`; no retry; no `.gobbi/sessions/{id}/`; no `.claude/gobbi.json` entry for this session id
  - negative: no `workflow.start` event emitted; no `gobbi workflow init` invocation; no attempt to install Bun automatically via `curl | sh` or a package manager

Anti-outcome:
  - agent does NOT instruct the user to run `gobbi workflow *` commands via the local execution path (`bun packages/cli/bin/gobbi.js`) — that path would still require Bun and is documented as working only from the gobbi project root
  - agent does NOT attempt to install Bun automatically

Evidence: `.claude/skills/gobbi/cli-setup.md` §Prerequisites; `packages/cli/package.json` `engines.bun: ">=1.2.0"`; `packages/cli/bin/gobbi.js` line 1 (`#!/usr/bin/env bun`); `.claude/skills/gobbi/cli-setup.md` §Troubleshooting row `bun: command not found` → install from `bun.sh`

---

### O-CI-E-03: Partial install — npm exit 0, but `gobbi` not on PATH

Given the user has a non-standard npm global prefix not on their shell PATH (e.g., `~/.npm-global/bin` without matching PATH entry, common on macOS + nvm and corporate-managed environments)
And the install step per O-CI-H-01 ran and `npm install -g @gobbitools/cli` exited 0

When the session agent re-runs `gobbi --version` after install
And the second version check still exits non-zero with "command not found"

Then the session agent branches on the "install exit 0 AND version check still failing" condition
And loads `cli-setup.md §Troubleshooting` row matching `gobbi: command not found`
And surfaces the PATH diagnosis to the user, naming `npm config get prefix` as the check and `$PREFIX/bin` as the fix
And pauses the session before any `gobbi workflow init` invocation

State trace:
  - before: `npm install -g` exited 0; `gobbi` binary is on disk at `$(npm config get prefix)/bin/gobbi` but not on shell PATH; no entry in `.claude/gobbi.json` for this session id
  - after re-check: second `gobbi --version` still exits non-zero
  - after pause: session paused before step FOURTH; no `workflow.start` event; no `gobbi.db` created; no `.gobbi/sessions/{id}/` directory
  - negative: no second `npm install -g` attempt; no `gobbi workflow *` invocation while version check is failing; no write under `.claude/gobbi.json`

Anti-outcome:
  - agent does NOT auto-retry the install (which would exit 0 again and not fix PATH)
  - agent does NOT offer Option 3 (`bun packages/cli/bin/gobbi.js`) as the remedy — the hooks in `plugins/gobbi/hooks/hooks.json` use bare `gobbi` and would still fail

Evidence: `.claude/skills/gobbi/cli-setup.md` §Troubleshooting row 1 (`gobbi: command not found` → `npm install -g @gobbitools/cli`) and row 4 (`Hooks fail silently` → "Ensure global install — hooks run in a shell that may not have local `node_modules/.bin` in PATH"); `plugins/gobbi/hooks/hooks.json` (bare `gobbi` commands, not `bun path/to/gobbi.js`); `.claude/skills/gobbi/cli-setup.md` §Installation Option 3 note

---

### O-CI-E-04: `_gobbi-rule.md` symlink missing and cannot be recreated

Given `@gobbitools/cli` is installed (`gobbi --version` exits 0)
And `.claude/rules/_gobbi-rule.md` does NOT exist at the worktree root
And the symlink target `.claude/skills/_gobbi-rule-container/_gobbi-rule.md` is present
And the filesystem or policy blocks symlink creation (e.g., Windows without developer mode, restricted FS, read-only `.claude/rules/`)

When the session agent reaches step SECOND of `gobbi/SKILL.md`
And attempts to create the symlink from `.claude/rules/_gobbi-rule.md` to `_gobbi-rule-container/_gobbi-rule.md`
And the creation fails

Then the session agent surfaces the failure to the user with the underlying error (e.g., `EPERM`, `EACCES`, "symbolic link not supported")
And does NOT fall back to copying the rule body inline into `.claude/rules/_gobbi-rule.md` (a copy would be an un-updatable snapshot that defeats the plugin-refresh guarantee of O-CI-H-03)
And does NOT proceed to step THIRD (CLI availability check) until the user resolves the platform constraint

State trace:
  - before: `.claude/rules/_gobbi-rule.md` missing; target container file present
  - after failure: still no symlink; no copy created; setup paused at step SECOND
  - negative: no regular (non-symlink) file at `.claude/rules/_gobbi-rule.md` that would shadow future plugin refreshes

Evidence: `.claude/skills/gobbi/SKILL.md` §SECOND ("create a symlink from `.claude/rules/` pointing to `_gobbi-rule.md` in the `_gobbi-rule-container` skill directory. This symlink makes the core behavioral rules always-active and auto-updates when the gobbi plugin is updated"); `.claude/skills/_gobbi-rule-container/_gobbi-rule.md` (symlink target) — note: "agent surfaces the failure rather than silently copying" is the correct behavior per the SECOND step's auto-update contract, but the skill does not explicitly describe the failure branch — mark the explicit "pause + surface, no copy fallback" clause `(ASPIRATIONAL)` for the first review pass

---

## Edge cases

### O-CI-X-01: Stale `gobbi.json` entry for this session id — offer reuse or clear

Given `@gobbitools/cli` is installed (`gobbi --version` exits 0)
And `.claude/gobbi.json` contains an entry keyed by the current `CLAUDE_SESSION_ID`
And the stored settings are inconsistent (e.g., `gitWorkflow: worktree-pr` but no `baseBranch` set — a partial write from a prior failed init, or schema drift across gobbi versions)

When the user invokes `/gobbi`
And step FOURTH runs `gobbi config get $CLAUDE_SESSION_ID`
And the agent reads the saved settings

Then the session agent detects the inconsistency (missing required field for the selected `gitWorkflow` value)
And uses AskUserQuestion to offer the user "Reuse as-is and patch the missing field" (with a recommended sub-option) vs "Clear and reconfigure" vs "Abort"
And proceeds only after the user chooses

State trace:
  - before: `.claude/gobbi.json` contains the partial entry
  - after "Clear and reconfigure": entry removed (or overwritten) via `gobbi config`, setup questions re-asked, fresh entry persisted
  - after "Reuse and patch": missing field set via `gobbi config set`, existing fields preserved
  - negative: agent does NOT silently assume defaults for missing fields without user confirmation

Evidence: `.claude/skills/gobbi/SKILL.md` §FOURTH ("present the saved settings to the user and ask whether to reuse them or reconfigure"); `.claude/skills/gobbi/SKILL.md` §FIFTH persistence block (per-key `gobbi config set` calls) — note: the "detect partial entry + three-way prompt" branch is not explicitly described in `SKILL.md §FOURTH` (which only has a binary reuse-or-reconfigure branch); mark the partial-detection logic `(ASPIRATIONAL)` pending a review pass on this edge case

---

### O-CI-X-02: Concurrent `/gobbi` invocations in two Claude Code sessions

Given `@gobbitools/cli` is installed
And Session A and Session B are two distinct Claude Code sessions running concurrently on the same project root
And Session A and Session B have distinct `CLAUDE_SESSION_ID` values

When the user invokes `/gobbi` in Session A
And (independently) invokes `/gobbi` in Session B
And both sessions reach step FIFTH and persist settings via `gobbi config set $CLAUDE_SESSION_ID ...`
And later, the SessionStart hook in each session runs `gobbi workflow init`

Then each session writes its own entry under the shared `.claude/gobbi.json` keyed by its own `CLAUDE_SESSION_ID`
And each SessionStart hook creates a distinct `.gobbi/sessions/{sessionId}/` directory
And neither session overwrites the other's `metadata.json`, `gobbi.db`, or `state.json`
And both sessions independently emit seq=1 `workflow.start` + seq=2 `workflow.eval.decide` inside their own `gobbi.db`

State trace:
  - before: `.claude/gobbi.json` may be empty or contain unrelated session entries
  - after both: `.claude/gobbi.json` contains two independent entries (A and B) keyed by distinct session ids
  - after hooks run: two distinct `.gobbi/sessions/{A}/` and `.gobbi/sessions/{B}/` directories; each contains its own `gobbi.db` with its own seq=1/seq=2 events
  - negative: no cross-session events in either `gobbi.db`; no shared writes under `.gobbi/sessions/`

Anti-outcome:
  - Session A's settings are NOT overwritten by Session B's setup questions, and vice versa
  - neither session produces events attributed to the other's session id

Evidence: `packages/cli/src/commands/workflow/init.ts` §Session id resolution (session id comes from `--session-id` flag → `CLAUDE_SESSION_ID` env var → fresh UUID fallback); `.claude/skills/gobbi/SKILL.md` persistence block (per-session keying via `$CLAUDE_SESSION_ID`) — note: concurrent writers to `.claude/gobbi.json` require atomic write semantics in `gobbi config set`; mark "no lost-update race between concurrent `gobbi config set` calls" `(ASPIRATIONAL)` pending a code check of the config writer's locking behavior

---

### O-CI-X-03: `/gobbi` invoked inside an active peer worktree — must not auto-cleanup

Given the user invokes `/gobbi` inside a Claude Code session whose cwd is a worktree (e.g., `.claude/worktrees/feat/NNN-some-feature/`)
And another worktree exists under `.claude/worktrees/` belonging to a different concurrent session
And `@gobbitools/cli` is installed

When the session agent runs `/gobbi` and step THIRD confirms `gobbi --version` exits 0
And the agent proceeds to step FIFTH question 3 (git workflow) or to any detection that surfaces the peer worktree

Then the session agent does NOT recommend "Clean up" as the default option for the peer worktree
And if it surfaces the peer worktree at all, it does so via AskUserQuestion with "Leave it" recommended per the `_git` gotcha on orphaned-worktree defaults
And the session agent's install / setup flow is unaffected by the presence of the peer worktree

State trace:
  - before: peer worktree present under `.claude/worktrees/`; peer worktree's branch is checked out and possibly in use by a concurrent session; no state change in this session yet
  - after: this session's `/gobbi` completes setup; peer worktree directory is untouched; peer worktree's `.gobbi/sessions/{peerId}/` (if any) is untouched; peer worktree's `.git/worktrees/` entry is intact
  - negative: no `git worktree remove`, `rm -rf`, or similar command is run against the peer worktree by this session's `/gobbi`
  - negative: no AskUserQuestion defaults to a destructive option (per `_git/gotchas.md` — "Clean up" must never be the default recommendation for orphaned-looking worktrees)

Anti-outcome:
  - the peer worktree's `.git/worktrees/` entry is NOT pruned
  - the peer worktree's branch is NOT deleted
  - the peer session's events in its own `gobbi.db` are NOT overwritten or removed

Evidence: `.claude/skills/_git/gotchas.md` "Recommending cleanup of worktrees that may belong to concurrent sessions" (default must be "Leave it"); `.claude/skills/gobbi/SKILL.md` §FIFTH question 3 (git workflow selection)

---

## Others (concurrency, idempotency, interruption)

### O-CI-X-04: Idempotent SessionStart hook — second `gobbi workflow init` is a silent no-op

Given `@gobbitools/cli 0.5.0` is installed (`gobbi --version` exits 0)
And `plugins/gobbi/hooks/hooks.json` registers `SessionStart[startup|resume|compact]` → `gobbi workflow init`
And `CLAUDE_SESSION_ID` is set in the hook environment
And `.gobbi/sessions/{CLAUDE_SESSION_ID}/metadata.json` already exists at `schemaVersion: 2` from an earlier invocation

When Claude Code fires a second SessionStart event with trigger `startup`, `resume`, or `compact` for the same `CLAUDE_SESSION_ID`
And the hook runner executes `gobbi workflow init` a second time

Then the second `gobbi workflow init` detects the existing `metadata.json` and validates it
And exits 0 silently — no new event is appended to `gobbi.db`
And seq count in `gobbi.db` remains at 2 (no seq=3 added)
And `state.json` is not overwritten
And the session continues without visible interruption

State trace:
  - before: `.gobbi/sessions/{id}/` exists; `gobbi.db` contains seq=1 `workflow.start` + seq=2 `workflow.eval.decide`; `state.json` reflects `currentStep: ideation`, `completedSteps: []`, `feedbackRound: 0`
  - after second init: identical state — `gobbi.db` still has exactly 2 events; `state.json` unchanged; `metadata.json` unchanged; exit code 0
  - negative: no seq=3 event of any kind appended; no `metadata.json` overwrite; no error to stderr on valid metadata
  - negative: no duplicate `.gobbi/sessions/{id}/` directory created (same session id → same directory)

Anti-outcome:
  - a corrupt `metadata.json` is NOT transparently rewritten — per `init.ts` §Idempotency docblock, a corrupt file is reported on stderr with non-zero exit so the operator sees the drift
  - no duplicate `workflow.start` event at seq=3

Evidence: `packages/cli/src/commands/workflow/init.ts` §Idempotency docblock ("a fresh invocation against an existing directory is a no-op: the metadata is re-validated, no events are emitted, and the command exits 0 silently"); `plugins/gobbi/hooks/hooks.json` SessionStart matcher; `.claude/skills/gobbi/cli-setup.md` §What the CLI Provides (`gobbi workflow init` purpose row)

---

### O-CI-X-05: `SessionStart[compact]` after context compaction — resume, do not re-create

Given a Claude Code session was previously initialized with `@gobbitools/cli`
And `.gobbi/sessions/{CLAUDE_SESSION_ID}/` exists with `gobbi.db`, `metadata.json` (`schemaVersion: 2`), and `state.json`
And the session's conversation context is compacted by Claude Code
And `CLAUDE.md` instructs the agent to reload the `gobbi` skill after compaction ("MUST reload skills `/gobbi`")

When Claude Code fires `SessionStart` with trigger `compact`
And the hook runs `gobbi workflow init` (per the SessionStart matcher `startup|resume|compact`)
And the session agent also re-invokes `/gobbi` per `CLAUDE.md`

Then `gobbi workflow init` is a silent no-op (same as O-CI-X-04) — existing session state is preserved
And the `/gobbi` skill step FOURTH detects existing settings in `.claude/gobbi.json` and offers reuse (per O-CI-H-04)
And no new `.gobbi/sessions/{id}/` directory is created
And no duplicate session entries appear in `.claude/gobbi.json`

State trace:
  - before compact: `.gobbi/sessions/{id}/` populated; `gobbi.db` has accumulated events beyond seq=2
  - after compact + reload: identical on-disk state; no seq rollback; no new session directory; no new `gobbi.json` entry
  - negative: no second `.gobbi/sessions/{differentId}/` directory spawned by the compact trigger; no loss of event history

Anti-outcome:
  - the event store is NOT truncated by the compact trigger
  - the session id is NOT regenerated — the same `CLAUDE_SESSION_ID` survives compaction

Evidence: `plugins/gobbi/hooks/hooks.json` SessionStart matcher (`startup|resume|compact`); `packages/cli/src/commands/workflow/init.ts` §Session id resolution and §Idempotency; `.claude/CLAUDE.md` ("MUST load this at session start, resume, and compaction. MUST reload skills `/gobbi`")

---

### O-CI-X-06: Session interruption mid-install — next `/gobbi` detects partial state

Given the user invoked `/gobbi` in an earlier session
And the install step (`npm install -g @gobbitools/cli`) was interrupted mid-run (user Ctrl-C, Claude Code crash, terminal closed)
And the npm cache / global prefix is left in an indeterminate state — `gobbi --version` may exit 0 (partial binary present) or non-zero (install aborted before the `bin` stub was linked)

When the user opens a new Claude Code session and invokes `/gobbi`
And step THIRD runs `gobbi --version`

Then if `gobbi --version` exits 0, the agent proceeds per O-CI-H-02 (no re-install needed — npm's global install is effectively idempotent for the binary shim)
And if `gobbi --version` exits non-zero, the agent proceeds per O-CI-H-01 (re-run `npm install -g @gobbitools/cli`, which npm handles as idempotent at the package level)
And the agent does NOT attempt bespoke recovery logic that inspects npm cache state

State trace:
  - case A (gobbi on PATH after interruption): first version check exits 0; no `npm install` invocation; session proceeds normally
  - case B (gobbi missing after interruption): first version check exits non-zero; install re-runs per O-CI-H-01; same success/failure branches apply
  - negative: no half-written `.gobbi/sessions/{id}/` from the interrupted session leaks into this session's state (session ids differ by Claude Code definition)

Anti-outcome:
  - agent does NOT clean up the user's npm cache or global prefix by hand
  - agent does NOT assume the install succeeded without re-running `gobbi --version`

Evidence: `.claude/skills/gobbi/SKILL.md` §THIRD (unconditional `gobbi --version` gate); `.claude/skills/gobbi/cli-setup.md` §Installation Option 1 (idempotent `npm install -g`); `packages/cli/src/commands/workflow/init.ts` §Session id resolution (fresh session id per invocation — no cross-session leakage) — note: the "idempotent re-run per O-CI-H-01 path" is the documented recovery; bespoke mid-install detection logic is `(ASPIRATIONAL)` and should not be introduced without a design pass

---

See `README.md` for the prose overview of this feature. The companion `checklist.md` turns each scenario ID above into 3–7 verifiable items grouped by that ID; `review.md` reports what this pass's verification actually found, with `DRIFT`/`GAP`/`NAMING` tags that cite scenarios by ID.
