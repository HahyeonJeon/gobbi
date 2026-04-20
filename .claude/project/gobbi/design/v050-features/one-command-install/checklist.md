# one-command-install — Verification Checklist

This checklist is the verification harness for the 15 scenarios in `scenarios.md`. Items are grouped by scenario ID (e.g., `O-CI-H-01`) so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag — `[EP]`, `[BVA]`, `[DT]`, `[ST]` — or a `[GAP]` tag for doc-reality checks on ASPIRATIONAL scenario claims, or `[MANUAL]` for items that require external reproduction. During P5 verification, the executor ticks boxes against the live codebase and surfaces any unchecked or failing items as findings in `review.md`.

---

## Scenario Coverage

| Scenario ID  | Title (short)                                             | Item count |
|--------------|-----------------------------------------------------------|------------|
| O-CI-H-01    | Fresh workspace, CLI missing from PATH                    | 5          |
| O-CI-H-02    | CLI already installed — skip install, proceed to setup    | 4          |
| O-CI-H-03    | Plugin refresh — skills/agents/rules update atomically    | 5          |
| O-CI-H-04    | `/gobbi` on session with existing saved settings          | 4          |
| O-CI-H-05    | Installed CLI version is stale — agent updates before setup | 4        |
| O-CI-E-01    | `npm install -g` fails — agent surfaces the error         | 5          |
| O-CI-E-02    | Bun runtime missing — prerequisite failure                | 5          |
| O-CI-E-03    | Partial install — npm exit 0, but `gobbi` not on PATH     | 5          |
| O-CI-E-04    | `_gobbi-rule.md` symlink missing and cannot be recreated  | 4          |
| O-CI-X-01    | Stale `gobbi.json` entry — offer reuse or clear           | 4          |
| O-CI-X-02    | Concurrent `/gobbi` invocations in two sessions           | 5          |
| O-CI-X-03    | `/gobbi` inside active peer worktree — no auto-cleanup    | 4          |
| O-CI-X-04    | Idempotent SessionStart hook — second init is a no-op     | 5          |
| O-CI-X-05    | `SessionStart[compact]` after compaction — resume         | 4          |
| O-CI-X-06    | Session interruption mid-install — next `/gobbi` recovers | 4          |

**Total: 67 items**

---

## O-CI-H-01: Fresh workspace, CLI missing from PATH

- [ ] [EP] `.claude/skills/gobbi/SKILL.md` §THIRD explicitly runs `gobbi --version` and branches to `cli-setup.md` on failure — the install branch activates when and only when the version check exits non-zero. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD.)
- [ ] [DT] `cli-setup.md §Installation` Option 1 is `npm install -g @gobbitools/cli` and is labelled "Recommended". (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Installation.)
- [ ] [ST] Step THIRD (version check) appears before step FOURTH (config detection) in `SKILL.md` — the ordering prevents any `gobbi workflow *` call while the binary is absent. (Hint: Trace — `rg '^\*\*THIRD\|\*\*FOURTH\|\*\*FIFTH\|\*\*SIXTH' .claude/skills/gobbi/SKILL.md`.)
- [ ] [BVA] `packages/cli/package.json` `"bin"` entry maps `gobbi` → `./bin/gobbi.js` — this is the shim `npm install -g` links onto PATH. (Hint: Codebase — `packages/cli/package.json` `"bin"` key.)
- [ ] [EP] `packages/cli/bin/gobbi.js` line 1 is `#!/usr/bin/env bun` — the global shim executes correctly only when Bun is on PATH. (Hint: Run — `head -n1 packages/cli/bin/gobbi.js`.)

---

## O-CI-H-02: CLI already installed — skip install, proceed to setup

- [ ] [EP] `cli-setup.md §Detection` first-row outcome ("Version prints … Proceed to setup questions") confirms the fast path — no `cli-setup.md §Installation` is loaded when `gobbi --version` exits 0. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Detection table, row 1.)
- [ ] [ST] `SKILL.md §THIRD` contains no install branch when the version check succeeds — the skill advances directly to §FOURTH without any `npm install` step. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD, confirm absence of npm/install text on the success path.)
- [ ] [DT] `SKILL.md §FOURTH` runs `gobbi config get $CLAUDE_SESSION_ID` — the config-detection step is the first action after a successful version check, not an npm command. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH first line.)
- [ ] [ST] `packages/cli/src/commands/workflow/init.ts` §Idempotency docblock confirms `gobbi workflow init` creates session state — this is invoked by the hook, not by the install step. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 1–30 docblock.)

---

## O-CI-H-03: Plugin refresh — skills/agents/rules update atomically with plugin

- [ ] [EP] `plugins/gobbi/.claude-plugin/plugin.json` `"skills"` key points to `./skills/` — the plugin ships skills via this directory reference, not by embedding them. (Hint: Codebase — `plugins/gobbi/.claude-plugin/plugin.json`.)
- [ ] [EP] `plugins/gobbi/skills/` directory exists and contains skill directories matching those under `.claude/skills/` — confirming the symlink relationship. (Hint: Run — `ls plugins/gobbi/skills/ | head -10`.)
- [ ] [DT] `plugins/gobbi/agents/` directory exists and lists agent files — agents are also shipped via the plugin directory, not the CLI package. (Hint: Run — `ls plugins/gobbi/agents/`.)
- [ ] [ST] `SKILL.md §SECOND` describes creating a symlink from `.claude/rules/_gobbi-rule.md` to `_gobbi-rule-container/_gobbi-rule.md` — the symlink model is the auto-update mechanism. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §SECOND.)
- [ ] [GAP] Verify no CLI binary delivery path exists in `plugins/gobbi/` — the plugin ships skills/agents/hooks but NOT the `@gobbitools/cli` npm package. The claim "plugin install refreshes CLI binary" in `README.md` paragraph 2 is aspirational. (Hint: Run — `ls plugins/gobbi/` confirms absence of `bin/`, `dist/`, or `package.json` at the plugin root.)

---

## O-CI-H-04: `/gobbi` on a session with existing saved settings — reuse path

- [ ] [EP] `SKILL.md §FOURTH` describes the `gobbi config get $CLAUDE_SESSION_ID` call and a binary branch: reuse the existing settings or reconfigure — confirming the settings-detection step exists. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH.)
- [ ] [ST] `SKILL.md §FOURTH` states "skip the setup questions and proceed directly to `gobbi workflow init`" on the reuse branch — FIFTH is bypassed when settings exist. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH, "If the user chooses to reuse" sentence.)
- [ ] [ST] `packages/cli/src/commands/workflow/init.ts` idempotency fast-path (lines ~171–181) exits 0 silently when `metadata.json` already exists — a reused-settings `/gobbi` run followed by the hook re-invoking init does not duplicate state. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 168–181.)
- [ ] [DT] `SKILL.md` persistence block names `gobbi config set $CLAUDE_SESSION_ID` as the write path for all four setup answers — confirming `.claude/gobbi.json` is keyed by session id. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FIFTH persistence block.)

---

## O-CI-H-05: Installed CLI version is stale — agent updates before setup

- [ ] [GAP] Verify `SKILL.md §THIRD` contains only an availability check (`gobbi --version` exits 0/non-zero) and no semver comparison logic — the version-currency update branch described in `README.md` paragraph 3 is aspirational. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD, confirm absence of `semver`, `compare`, `outdated`, or `@latest` text.)
- [ ] [GAP] Verify no version-comparison code path exists in `packages/cli/src/` — the CLI does not implement a "check-for-newer-release" command. (Hint: Run — `rg 'semver|compareVersion|isOutdated|version.*compare' packages/cli/src/ | head`.)
- [ ] [GAP] Verify `cli-setup.md §Troubleshooting` row for `gobbi workflow init fails` cites "CLI version mismatch" as a cause but does not provide an automated update trigger — the update-if-stale behavior is not yet wired. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Troubleshooting row 3.)
- [ ] [ST] `README.md` paragraph 3 claims "the session agent checks whether `gobbi-cli` is installed and whether its version is current" — this sentence describes aspirational behavior; the actual THIRD step only checks presence, not currency. (Hint: Codebase — `one-command-install/README.md` paragraph 3 vs `SKILL.md §THIRD` wording.)

---

## O-CI-E-01: `npm install -g` fails — agent surfaces the error and pauses

- [ ] [EP] `cli-setup.md §Installation` Option 1 is the sole install step the skill describes for the missing-CLI case — there is no automatic fallback to Option 2 or Option 3 on failure. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Installation, confirm no "on failure, try…" text under Option 1.)
- [ ] [DT] `cli-setup.md §Troubleshooting` row 1 maps `gobbi: command not found` → `npm install -g @gobbitools/cli` — confirming the only documented remediation is the global install, not a local run. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Troubleshooting.)
- [ ] [ST] `SKILL.md §THIRD` gates progression to §FOURTH on `gobbi --version` exiting 0 — if install fails, the version check still exits non-zero and §FOURTH/§FIFTH are not reached. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD, confirm no branch that allows advancing past version check on failure.)
- [ ] [EP] `plugins/gobbi/hooks/hooks.json` uses the bare `gobbi` command — hooks will fail silently if `gobbi` is not on PATH, so there is no hook-level fallback to `bun packages/cli/bin/gobbi.js`. (Hint: Codebase — `plugins/gobbi/hooks/hooks.json` all hook `"command"` values.)
- [ ] [GAP] Verify `cli-setup.md §Installation` or `§Troubleshooting` has no "retry once on transient failure" clause — auto-retry-on-failure behavior is aspirational. (Hint: Trace — `rg 'retry\|transient\|again' .claude/skills/gobbi/cli-setup.md`.)

---

## O-CI-E-02: Bun runtime missing — prerequisite failure before or during install

- [ ] [EP] `cli-setup.md §Prerequisites` lists "Bun >= 1.2.0" as required and points to `bun.sh` — the Bun prerequisite is documented and the fix is a user action, not an auto-install. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Prerequisites.)
- [ ] [BVA] `packages/cli/package.json` `engines.bun` is `">=1.2.0"` — the lower bound matches the prerequisite stated in `cli-setup.md`. (Hint: Codebase — `packages/cli/package.json` `"engines"` key.)
- [ ] [EP] `packages/cli/bin/gobbi.js` line 1 is `#!/usr/bin/env bun` — the installed binary fails at execution time (not install time) when Bun is absent, meaning `npm install -g` may exit 0 even without Bun. (Hint: Run — `head -n1 packages/cli/bin/gobbi.js`.)
- [ ] [DT] `cli-setup.md §Troubleshooting` row 2 maps `bun: command not found` → "Install from `bun.sh`" — confirming the Bun-missing branch is documented. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Troubleshooting row 2.)
- [ ] [GAP] Verify `SKILL.md §THIRD` or `cli-setup.md` contains no instruction to auto-install Bun via `curl | sh` or a package manager — auto-installing Bun is aspirational and must not be added without a deliberate design pass. (Hint: Trace — `rg 'curl.*bun\|brew install bun\|apt.*bun' .claude/skills/gobbi/`.)

---

## O-CI-E-03: Partial install — npm exit 0, but `gobbi` not on PATH

- [ ] [EP] `plugins/gobbi/hooks/hooks.json` hook commands use bare `gobbi` (not `bun packages/cli/bin/gobbi.js`) — confirming that offering Option 3 as the PATH-miss remedy would not fix hook invocations. (Hint: Codebase — `plugins/gobbi/hooks/hooks.json` all `"command"` values.)
- [ ] [DT] `cli-setup.md §Troubleshooting` row 4 ("Hooks fail silently") cites "Ensure global install — hooks run in a shell that may not have local `node_modules/.bin` in PATH" — the partial-install/PATH-miss case is covered. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Troubleshooting row 4.)
- [ ] [ST] `SKILL.md §THIRD` gates on `gobbi --version` exit code, not on `npm install` exit code — a second version check after a silent-success install still must pass before §FOURTH is reached. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD.)
- [ ] [GAP] Verify `cli-setup.md §Troubleshooting` has no entry specifically naming `npm config get prefix` as the PATH diagnosis step — the specific `$PREFIX/bin` fix guidance is aspirational. (Hint: Trace — `rg 'npm config get prefix\|npm_prefix' .claude/skills/gobbi/cli-setup.md`.)
- [ ] [GAP] Verify no "install exit 0 AND version check still failing" explicit branch exists in `SKILL.md §THIRD` — the distinct three-case detection (missing / partial / present) is aspirational. (Hint: Trace — `rg 'exit 0\|partial\|PATH' .claude/skills/gobbi/SKILL.md | head`.)

---

## O-CI-E-04: `_gobbi-rule.md` symlink missing and cannot be recreated

- [ ] [EP] `SKILL.md §SECOND` contains the symlink-creation instruction — confirming the skill drives this step before any CLI or workflow command. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §SECOND.)
- [ ] [EP] `.claude/skills/_gobbi-rule-container/_gobbi-rule.md` exists and is the intended symlink target — the container file is the source of truth for the behavioral rule. (Hint: Run — `ls .claude/skills/_gobbi-rule-container/`.)
- [ ] [GAP] Verify `SKILL.md §SECOND` contains no explicit "surface failure + pause, do NOT copy" fallback branch — the instruction to pause rather than copy is aspirational; the skill only describes the success path. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §SECOND, confirm absence of failure-branch text.)
- [ ] [ST] `SKILL.md §SECOND` precedes §THIRD — symlink setup runs before the CLI availability check, so a symlink failure blocks the session at the correct step. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §SECOND and §THIRD ordering.)

---

## O-CI-X-01: Stale `gobbi.json` entry for this session id — offer reuse or clear

- [ ] [EP] `SKILL.md §FOURTH` presents a binary choice (reuse or reconfigure) when `gobbi config get` returns an existing entry — confirming settings-detection is active on every `/gobbi` invocation. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH.)
- [ ] [ST] `SKILL.md §FIFTH` persistence block lists per-key `gobbi config set $CLAUDE_SESSION_ID` calls — overwriting individual keys is the documented mechanism for patching an existing entry. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FIFTH persistence block.)
- [ ] [GAP] Verify `SKILL.md §FOURTH` has no three-way branch for partial/inconsistent entries (reuse-as-is vs patch-missing vs clear) — the detect-and-three-way-prompt logic is aspirational; only a binary branch is documented. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH, confirm only two options described.)
- [ ] [DT] `SKILL.md` documents that `.claude/gobbi.json` is "managed exclusively through `gobbi config`" — confirming no direct JSON write path bypasses the config command and could introduce a partial write. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` persistence block, "managed exclusively" clause.)

---

## O-CI-X-02: Concurrent `/gobbi` invocations in two Claude Code sessions

- [ ] [EP] `packages/cli/src/commands/workflow/init.ts` §Session id resolution (lines 154–156) uses `CLAUDE_SESSION_ID` env var — each Claude Code session has a distinct env value, so session directories are independent. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 154–158.)
- [ ] [EP] `SKILL.md §FIFTH` persistence block keys all `gobbi config set` calls with `$CLAUDE_SESSION_ID` — each session writes under its own key, preventing cross-session overwrite in `gobbi.json`. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FIFTH persistence block Q1–Q4 commands.)
- [ ] [DT] `packages/cli/src/commands/workflow/init.ts` creates `sessionDir = join(repoRoot, '.gobbi', 'sessions', sessionId)` — each session id resolves to a unique directory path on disk. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` line 158.)
- [ ] [BVA] The SQLite db is opened as `join(sessionDir, 'gobbi.db')` — one `gobbi.db` per session directory, so concurrent sessions write to distinct databases without row-level locking concerns. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` line 211.)
- [ ] [GAP] Verify `packages/cli/src/lib/project-config.ts` (or equivalent config writer) uses atomic write semantics when updating `.claude/gobbi.json` — the no-lost-update guarantee for concurrent `gobbi config set` calls is aspirational pending a code check of the writer's locking behavior. (Hint: Run — `rg 'writeFileSync\|writeFile\|rename\|tmp' packages/cli/src/lib/project-config.ts | head`.)

---

## O-CI-X-03: `/gobbi` inside active peer worktree — must not auto-cleanup

- [ ] [EP] `_git/gotchas.md` "Recommending cleanup of worktrees that may belong to concurrent sessions" gotcha specifies "default to `Leave it` as the recommended option" — the behavioral rule exists and is in the always-active skill set. (Hint: Codebase — `.claude/skills/_git/gotchas.md`, section "Recommending cleanup of worktrees…".)
- [ ] [ST] `SKILL.md §FIFTH` question 3 (git workflow) concerns the current session's git mode, not peer worktree management — the install/setup flow has no step that scans or acts on existing worktrees. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FIFTH "Third question — git workflow mode".)
- [ ] [DT] `plugins/gobbi/hooks/hooks.json` SessionStart hook runs `gobbi workflow init` only — there is no hook command that scans `.claude/worktrees/` or issues `git worktree remove`. (Hint: Codebase — `plugins/gobbi/hooks/hooks.json` SessionStart hook `"command"` value.)
- [ ] [EP] `_gobbi-rule.md` AskUserQuestion rule requires "(Recommended)" to be placed on the non-destructive option — the behavioral rule applies to any prompt about worktrees encountered during setup. (Hint: Codebase — `.claude/skills/_gobbi-rule-container/_gobbi-rule.md` §User Authority.)

---

## O-CI-X-04: Idempotent SessionStart hook — second `gobbi workflow init` is a no-op

- [ ] [ST] `packages/cli/src/commands/workflow/init.ts` idempotency fast-path (lines 171–181): `existsSync(metadataPath)` → `readMetadata` → silent `return` — the second invocation exits without emitting any event. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 168–181.)
- [ ] [ST] The docblock (lines 9–12) states "no events are emitted, and the command exits 0 silently" on a re-invocation against an existing directory — the idempotency contract is part of the public interface. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 9–12.)
- [ ] [BVA] `plugins/gobbi/hooks/hooks.json` SessionStart `"matcher"` is `"startup|resume|compact"` — the hook fires on all three trigger types, making idempotency load-bearing for every session type. (Hint: Codebase — `plugins/gobbi/hooks/hooks.json` SessionStart matcher value.)
- [ ] [EP] A corrupt `metadata.json` triggers `process.exit(1)` with a stderr message (lines 173–180) rather than silent overwrite — the idempotency fast-path distinguishes valid-existing from corrupt-existing. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 173–180.)
- [ ] [DT] `cli-setup.md §What the CLI Provides` `gobbi workflow init` row describes "Initialize a session directory … emit the first `workflow.start` event" — the "first" qualifier confirms init is not expected to emit on re-entry. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §What the CLI Provides, `gobbi workflow init` row.)

---

## O-CI-X-05: `SessionStart[compact]` after context compaction — resume, do not re-create

- [ ] [ST] `plugins/gobbi/hooks/hooks.json` SessionStart `"matcher"` includes `compact` — the hook fires on compaction, so `gobbi workflow init` idempotency must hold for this trigger type. (Hint: Codebase — `plugins/gobbi/hooks/hooks.json` SessionStart matcher value.)
- [ ] [ST] `CLAUDE.md` top line states "MUST load this at session start, resume, and compaction. MUST reload skills `/gobbi`" — the reload instruction is present and the `/gobbi` skill's setup-questions path handles the reuse case via §FOURTH. (Hint: Codebase — `.claude/CLAUDE.md` first `---` block, first paragraph.)
- [ ] [EP] `SKILL.md §FOURTH` describes the config-get check that surfaces existing settings after compaction — the reuse path is the expected post-compact path when settings were already saved. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §FOURTH.)
- [ ] [ST] `packages/cli/src/commands/workflow/init.ts` idempotency fast-path (lines 171–181) does not branch on the SessionStart trigger type — the no-op behavior applies equally for `compact` as for `startup` and `resume`. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 154–181, confirm no `trigger`/`compact` conditional.)

---

## O-CI-X-06: Session interruption mid-install — next `/gobbi` detects partial state

- [ ] [EP] `SKILL.md §THIRD` always runs `gobbi --version` unconditionally at step start — there is no "skip check if previous install was attempted" path that could bypass the gate after an interruption. (Hint: Codebase — `.claude/skills/gobbi/SKILL.md` §THIRD.)
- [ ] [ST] `cli-setup.md §Installation` describes `npm install -g @gobbitools/cli` as the install command with no bespoke pre-check of npm cache state — the documented path is idempotent by npm's own semantics, not by custom logic. (Hint: Codebase — `.claude/skills/gobbi/cli-setup.md` §Installation Option 1.)
- [ ] [EP] `packages/cli/src/commands/workflow/init.ts` §Session id resolution (lines 154–158) uses `CLAUDE_SESSION_ID` from the new session's env — a fresh Claude Code session gets a distinct session id regardless of what the interrupted session left on disk. (Hint: Codebase — `packages/cli/src/commands/workflow/init.ts` lines 154–158.)
- [ ] [GAP] Verify `SKILL.md §THIRD` or `cli-setup.md` contains no mid-install-detection logic that inspects npm cache or global prefix for a partial `@gobbitools/cli` installation — bespoke mid-install recovery is aspirational. (Hint: Trace — `rg 'npm cache\|partial.*install\|interrupted' .claude/skills/gobbi/SKILL.md .claude/skills/gobbi/cli-setup.md`.)
