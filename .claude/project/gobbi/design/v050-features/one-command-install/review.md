# Review — one-command-install

| Pass date  | Pass ID             | Reviewer | Verdict      | PR   |
|------------|---------------------|----------|--------------|------|
| 2026-04-20 | session `e78b75d2…` | executor | needs-work   | TBD  |

## Pass 2026-04-20 — Findings

All 67 checklist items passed verification against the live codebase — 57 items confirmed their assertion directly against SKILL.md, cli-setup.md, hooks.json, plugin.json, package.json, bin/gobbi.js, and init.ts; the 10 `[GAP]`-tagged items confirmed that their ASPIRATIONAL behaviors are genuinely absent from code (no semver comparison, no auto-retry, no auto-install-Bun, no bespoke mid-install detection, no three-way partial-entry branch, no npm-prefix PATH guidance, no explicit symlink-failure fallback, no CLI-binary delivery in the plugin). The cluster of 7 findings concentrates around two patterns: (1) `README.md` paragraph 2 and paragraph 4 describe plugin scope and CLI version-currency behavior that code does not implement (DRIFT-01, GAP-01) — the highest-impact pattern, since users form their mental model from README; (2) scenario-level aspirational guidance (GAP-02..04) that the skill and troubleshooting table do not yet cover. A secondary drift (DRIFT-02) notes that `gobbi.json` as a storage location is itself stale — the config writer has moved to `.gobbi/config.db` (SQLite WAL), which actually *resolves* the scenario O-CI-X-02's concurrent-write concern but leaves stale path references throughout SKILL.md, scenarios.md, and checklist.md. NOTE-01 captures a lower-severity agent-manifest drift (plugin.json lists 4 agents; the filesystem ships 7 symlinks).

---

### DRIFT-01: [issue (high)] README paragraph 2 overstates plugin scope

- **Trace:** scenario `O-CI-H-03` Evidence note (ASPIRATIONAL: "the `plugin install refreshes CLI binary` claim in `README.md` paragraph 2… the plugin ships skills/agents via symlinks but does NOT ship the CLI binary"); checklist item `O-CI-H-03` `[GAP]` "Verify no CLI binary delivery path exists in `plugins/gobbi/`"
- **Code reference:** `plugins/gobbi/` ships `hooks/hooks.json` + `.claude-plugin/plugin.json` + `skills/` (symlinks into `.claude/skills/`) + `agents/` (symlinks into `.claude/agents/`) + a plugin `README.md` + a `settings.json`. There is no `bin/`, no `dist/`, no `package.json`, and no CLI binary under the plugin directory. The CLI binary is distributed separately via `npm install -g @gobbitools/cli` (`packages/cli/package.json` `"bin"` at line 6–8; `packages/cli/bin/gobbi.js` line 1).
- **Finding type:** DRIFT
- **Impact:** Users reading `README.md` paragraph 2 ("Installing the plugin brings the entire gobbi system in a single operation: the CLI binary, all workflow agents, domain knowledge skills, always-active behavioral rules, and the hook wiring") form an incorrect mental model — they believe `/plugin install gobbi` is sufficient for a working installation. In reality, the plugin enables hooks and ships the skill/agent symlinks, but the hooks use the bare `gobbi` command and will fail silently without a separate `npm install -g @gobbitools/cli`. The `cli-setup.md §Installation` Option 2 paragraph (lines 43–51) also suggests the plugin "registers the CLI and the five v0.5.0 workflow hook entries ... automatically," which reinforces the same confusion.
- **Proposed fix:**
  - Light: Rewrite `README.md` paragraph 2 to separate the two install paths. Something like: "Installing the plugin registers hook entries, the skills, the agents, and the always-active behavioral rule with every Claude Code session. The CLI binary ships separately via `npm install -g @gobbitools/cli`; the plugin's hooks invoke that binary by bare `gobbi` command. This two-layer split means plugin updates and CLI updates are independent."
  - Heavier: Both the light fix above AND correct `cli-setup.md §Installation Option 2` lines 43–51 to drop the phrase "registers the CLI" (the plugin does not register the CLI binary — only the hook entries that invoke `gobbi`). Optionally add a note: "Installing the plugin does NOT install `@gobbitools/cli` — run Option 1 (`npm install -g @gobbitools/cli`) first."
- **Resolution:** REJECTED 2026-04-21 — user direction: current feature-doc README reflects the new v0.5.0 design; code and legacy docs will be updated to match in a future pass (backlog issue #112).
- **Tag:** DRIFT-01

---

### GAP-01: [issue (high)] README paragraph 4 promises CLI version-currency check that does not exist

- **Trace:** scenario `O-CI-H-05` (entire scenario is marked ASPIRATIONAL in its Evidence line); checklist items `O-CI-H-05` `[GAP]`×3 + `[ST]` (README vs SKILL.md drift)
- **Code reference:** `README.md` line 13 claims "the session agent checks whether `gobbi-cli` is installed and whether its version is current. If the CLI is missing or outdated, the session agent installs or updates it automatically." Actual: `.claude/skills/gobbi/SKILL.md` line 17 (`**THIRD**`) only runs `gobbi --version` and branches on exit code; no semver parsing, no comparison to a "latest" or "current-release" target, no update trigger. `rg 'semver|compareVersion|isOutdated|version.*compare' packages/cli/src/` returns zero matches. `rg 'semver|compare|outdated|@latest' .claude/skills/gobbi/SKILL.md` returns zero matches. `.claude/skills/gobbi/cli-setup.md` line 98 mentions "CLI version mismatch" as a diagnosis hint in the Troubleshooting table but offers no automated update mechanism — the fix is a manual `reinstall if stale`.
- **Finding type:** GAP
- **Impact:** A user reading `README.md` expects `/gobbi` to detect an outdated CLI and offer to update. When the feature silently does not exist, users who installed `@gobbitools/cli` months ago will run stale binaries against current event-store schemas and current state-machine specs — the exact failure mode that schema v2 and the reducer's strict unknown-event handling are designed to catch, but at a stage where the failure is unhelpfully late. The README also uses the name `gobbi-cli` for the package, which does not match the actual name `@gobbitools/cli` — a minor secondary drift.
- **Proposed fix:**
  - Light (doc-only): Edit `README.md` line 13 to drop the version-currency claim. Replace "checks whether `gobbi-cli` is installed and whether its version is current. If the CLI is missing or outdated, the session agent installs or updates it automatically" with "checks whether `@gobbitools/cli` is installed. If the CLI is missing, the session agent loads `cli-setup.md` and walks the user through `npm install -g @gobbitools/cli`." This makes the README accurately describe `SKILL.md §THIRD` without implementing new behavior.
  - Heavier (code): Implement the version-currency check. Add a `gobbi version --check-latest` subcommand that hits the npm registry (or a cached manifest) and returns a structured "current | stale | unknown" verdict. Wire `SKILL.md §THIRD` to call it after the availability check. Add a Troubleshooting row in `cli-setup.md` covering update failures. Defer unless the user explicitly prioritizes version-check automation over documentation accuracy.
- **Resolution:** FIXED 2026-04-21 — commit e478d00 adds `gobbi --is-latest` CLI flag (`packages/cli/src/lib/version-check.ts` + `cli.ts` dispatch); commit c8c26ea wires it into `SKILL.md §THIRD` and adds a usage paragraph to `cli-setup.md §Installation Option 1`. README version-currency claim preserved per user direction.
- **Tag:** GAP-01

---

### GAP-02: [suggestion (medium)] cli-setup.md §Troubleshooting lacks PATH-fix row for partial install

- **Trace:** scenario `O-CI-E-03` Evidence note (ASPIRATIONAL: "specific remediation guidance naming `npm config get prefix` as the check and `$PREFIX/bin` as the fix is ASPIRATIONAL — cli-setup.md §Troubleshooting does not currently contain this specific guidance"); checklist items `O-CI-E-03` `[GAP]` ×2
- **Code reference:** `.claude/skills/gobbi/cli-setup.md` §Troubleshooting (lines 92–100) contains 4 rows covering `gobbi: command not found` (row 1, line 96), `bun: command not found` (row 2, line 97), `gobbi workflow init` fails (row 3, line 98), and `Hooks fail silently` (row 4, line 99). No row specifically names the "npm exit 0 but `gobbi` not on PATH" failure mode, and no row mentions `npm config get prefix` as the diagnostic step. Row 4's remediation ("Ensure global install — hooks run in a shell that may not have local `node_modules/.bin` in PATH") covers the scenario tangentially but does not tell the user *how* to fix their PATH.
- **Finding type:** GAP
- **Impact:** Users on nvm, macOS with custom npm prefix, or corporate-managed environments will see "Hooks fail silently" (row 4) and "command not found" (row 1) behaviors simultaneously — the recommended fix for row 1 (re-run `npm install -g`) produces exit 0 again and does not fix the problem. Without concrete PATH-fix guidance, users are stuck in a retry loop that never resolves.
- **Proposed fix:**
  - Light: Add a fifth Troubleshooting row: `| npm install -g exits 0 but gobbi: command not found | npm global prefix is not on shell PATH | Run npm config get prefix to see the prefix; add $PREFIX/bin to your shell PATH and reload the shell |`.
  - Heavier: Same as light, plus a short "PATH diagnostics" callout under `§Installation Option 1` explaining why nvm/Homebrew/pnpm/corporate setups commonly need this step.
- **Resolution:** DEFERRED 2026-04-21 to backlog issue #113 (bundled with GAP-03 + GAP-04 as skill-doc coverage extensions).
- **Tag:** GAP-02

---

### GAP-03: [suggestion (medium)] SKILL.md §SECOND lacks explicit symlink-failure branch

- **Trace:** scenario `O-CI-E-04` Evidence note (ASPIRATIONAL: "agent surfaces the failure rather than silently copying" is the correct behavior per the SECOND step's auto-update contract, but the skill does not explicitly describe the failure branch); checklist item `O-CI-E-04` `[GAP]`
- **Code reference:** `.claude/skills/gobbi/SKILL.md` line 15 (`**SECOND**`): "Check whether `.claude/rules/_gobbi-rule.md` exists in `$CLAUDE_PROJECT_DIR`. If it is missing, create a symlink from `.claude/rules/` pointing to `_gobbi-rule.md` in the `_gobbi-rule-container` skill directory. This symlink makes the core behavioral rules always-active and auto-updates when the gobbi plugin is updated." The instruction covers the success path only. No text describes what to do when symlink creation fails (e.g., Windows without developer mode, restricted filesystem, read-only `.claude/rules/` directory).
- **Finding type:** GAP
- **Impact:** A subagent hitting `EPERM` / `EACCES` / "symbolic link not supported" on symlink creation has no documented next step. The most obvious fallback (copy the file contents into `.claude/rules/_gobbi-rule.md`) would silently defeat the auto-update guarantee of scenario O-CI-H-03 — future plugin updates would not refresh the rule, and the session's always-active behavioral rule would drift from what the plugin ships. Without an explicit instruction to *not* copy, a well-meaning agent may make exactly this mistake.
- **Proposed fix:**
  - Light: Append one sentence to `SKILL.md §SECOND`: "If the symlink cannot be created (e.g., platform does not support symlinks, `.claude/rules/` is read-only), surface the error to the user and pause — do not fall back to copying the file contents, as a copy would become a stale snapshot that does not refresh on plugin updates."
  - Heavier: Same as light, plus a cross-reference in `cli-setup.md §Troubleshooting` with a new row covering "symlink creation fails" → "platform does not support symlinks; see SKILL.md §SECOND failure branch."
- **Resolution:** DEFERRED 2026-04-21 to backlog issue #113 (bundled with GAP-02 + GAP-04).
- **Tag:** GAP-03

---

### GAP-04: [suggestion (medium)] SKILL.md §FOURTH lacks three-way branch for partial/inconsistent config entries

- **Trace:** scenario `O-CI-X-01` Evidence note (ASPIRATIONAL: "the 'detect partial entry + three-way prompt' branch is not explicitly described in `SKILL.md §FOURTH`"); checklist item `O-CI-X-01` `[GAP]`
- **Code reference:** `.claude/skills/gobbi/SKILL.md` line 19 (`**FOURTH**`): "present the saved settings to the user and ask whether to reuse them or reconfigure." This is a binary branch (reuse / reconfigure). When a saved entry is partial (e.g., `gitWorkflow: worktree-pr` without `baseBranch`, or schema drift across gobbi versions where new required fields were added), neither option handles the case gracefully — "reuse as-is" leaves the missing field undefined; "reconfigure" re-asks every question when only one field needs patching.
- **Finding type:** GAP
- **Impact:** Users who upgrade gobbi between sessions will hit partial-entry states on every resume that spans an upgrade. The binary branch forces them to choose between a broken reuse and a redundant reconfigure. A three-way prompt ("Patch missing field X" / "Clear and reconfigure" / "Abort") would fix this. Today, the orchestrator has no guidance on which branch to take when `gobbi config get` returns a partial entry.
- **Proposed fix:**
  - Light: Add one sentence to `SKILL.md §FOURTH` noting partial-entry handling: "If the saved settings are missing a field required by the current gobbi version (e.g., `baseBranch` when `gitWorkflow` is `worktree-pr`), present a three-way AskUserQuestion — 'Patch the missing field', 'Clear and reconfigure', 'Abort' — rather than the binary reuse/reconfigure branch."
  - Heavier: Same as light, plus implement a `gobbi config validate <session-id>` subcommand that returns a structured diff vs the current required-fields schema. Wire `SKILL.md §FOURTH` to call it. Defer unless partial-entry drift becomes a recurring support issue.
- **Resolution:** DEFERRED 2026-04-21 to backlog issue #113 (bundled with GAP-02 + GAP-03).
- **Tag:** GAP-04

---

### DRIFT-02: [note (low)] `gobbi.json` path references are stale — actual storage is `.gobbi/config.db`

- **Trace:** scenario `O-CI-H-04` state trace references `.claude/gobbi.json`; scenario `O-CI-X-02` state trace and checklist item `O-CI-X-02` `[GAP]` both target `.claude/gobbi.json` writer; `SKILL.md §FOURTH` line 19 says "saved settings in `gobbi.json`"; `SKILL.md` persistence block line 52 says "`gobbi.json` lives at `$CLAUDE_PROJECT_DIR/.claude/gobbi.json`"
- **Code reference:** `packages/cli/src/commands/config.ts` line 12–14 ("The backing store is SQLite (config.db) with WAL mode, eliminating the lost-update race that settings.json suffered from under concurrent writes"); `packages/cli/src/lib/config-store.ts` line 488 (`const dbPath = join(projectDir, '.gobbi', 'config.db');`). The legacy `.claude/gobbi.json` is still referenced as a migration source (config-store.ts line 500, config.ts line 152), but the primary storage is SQLite. The scenario X-02 item 5 hints at `packages/cli/src/lib/project-config.ts` as the config writer, but `project-config.ts` writes `.gobbi/project-config.json` (a per-repo file), not session config.
- **Finding type:** DRIFT
- **Impact:** The aspirational concern in scenario O-CI-X-02 ("concurrent `gobbi config set` calls may produce a lost-update race on `.claude/gobbi.json`") is actually *resolved* by the SQLite migration — WAL mode + `INSERT ... ON CONFLICT DO UPDATE` guarantees atomic per-field updates with no race. So the storage change is a safety improvement. However, the drift is that `.claude/skills/gobbi/SKILL.md` still refers to `gobbi.json` as the storage location (lines 19 and 52), `scenarios.md` and `checklist.md` inherit the same stale path, and the checklist's `O-CI-X-02` `[GAP]` hint targets the wrong source file (`project-config.ts` instead of `config-store.ts`). Reader confusion rather than correctness risk.
- **Proposed fix:**
  - Light (doc-only): Update `SKILL.md §FOURTH` line 19 and the persistence block line 52 to name `config.db` (or at least "session config") rather than `gobbi.json`. One possible phrasing for line 52: "Session config lives at `$CLAUDE_PROJECT_DIR/.gobbi/config.db`, is gitignored (runtime-only, per-user), and is managed exclusively through `gobbi config`. (Legacy `.claude/gobbi.json` is migrated automatically on first access.) Sessions are automatically cleaned up by TTL (7 days) and max-entries cap (10 sessions)." Leave scenarios.md and checklist.md as-is unless the user wants a second pass — paths there are load-bearing for the stable-ID trace.
  - Heavier: Light fix plus rewriting the relevant scenario and checklist lines (O-CI-H-04, O-CI-X-01, O-CI-X-02) to cite `config.db` and `config-store.ts`. Breaks the "checklist.md edits are box-flips only" rule for this pass — defer to a scenarios/checklist pass rather than bundling it here.
- **Resolution:** DEFERRED 2026-04-21 to backlog issue #114.
- **Tag:** DRIFT-02

---

### NOTE-01: [note (low)] plugin.json agent manifest is a subset of `plugins/gobbi/agents/` on disk

- **Trace:** scenario `O-CI-H-03` Evidence references `plugins/gobbi/.claude-plugin/plugin.json` (`skills` key + `agents` array); checklist item `O-CI-H-03` `[DT]` "plugins/gobbi/agents/ directory exists and lists agent files"
- **Code reference:** `plugins/gobbi/.claude-plugin/plugin.json` lines 13–18 list four agents: `gobbi-agent.md`, `_agent-evaluator.md`, `_project-evaluator.md`, `_skills-evaluator.md`. On disk, `plugins/gobbi/agents/` contains seven symlinks: the four above plus `__executor.md`, `__pi.md`, `__researcher.md`.
- **Finding type:** NOTE
- **Impact:** Informational only. The extra three (`__executor`, `__pi`, `__researcher`) are double-underscore internal agents per `.claude/rules/__gobbi-convention.md` — they are filesystem-present in the plugin but not declared in the plugin manifest. Either (a) the manifest is intentionally scoped to externally-identifiable agents and the internals are just colocated for symlink refresh convenience, or (b) the manifest is stale and should include the three internals. No correctness impact — Claude Code's plugin loader reads the manifest, not the filesystem.
- **Proposed fix:** If (a) — the current state is intentional — leave as-is, and optionally add a one-line comment in `plugin.json` (as a sibling documentation file, since JSON does not support comments) explaining the scope decision. If (b) — the manifest should match the filesystem — extend the `agents` array with `./agents/__executor.md`, `./agents/__pi.md`, `./agents/__researcher.md`. No user-visible triage needed; surface only if the next feature pass (`cli-as-runtime-api` or similar) depends on the full agent set.
- **Resolution:** DEFERRED 2026-04-21 to backlog issue #115.
- **Tag:** NOTE-01

---

## Code Improvements

| Finding | Type | Severity | Commit | Summary |
|---------|------|----------|--------|---------|
| GAP-01  | issue | high   | e478d00 | feat(cli): add `gobbi --is-latest` (+ unit tests in version-check.test.ts) |
| GAP-01  | issue | high   | c8c26ea | docs(skill): wire `gobbi --is-latest` into `/gobbi` §THIRD + brief note in cli-setup.md §Installation |

All other findings in this pass resolved to REJECTED (DRIFT-01 → backlog #112) or DEFERRED (GAP-02/03/04 → #113; DRIFT-02 → #114; NOTE-01 → #115). No other code changes landed in this PR's scope.
