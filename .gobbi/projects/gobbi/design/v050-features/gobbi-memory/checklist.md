# gobbi-memory — Verification Checklist

Verification harness for the scenarios in `scenarios.md`. Items are grouped by scenario ID so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag: `@functional`, `@integration`, `@data`, `@boundary`, `@concurrency`, `@recovery`, `@manual`. All items target behaviour shipped in Pass-2 redesign (Waves 3–5 + NI-1, SHAs cited in `review.md`).

---

## G-MEM2-01 — Fresh install end-to-end

- `@functional` Fresh `gobbi install` creates `.gobbi/projects/gobbi/{skills,agents,rules}/` populated from the bundled template.
  - Evidence: `packages/cli/src/commands/__tests__/install.test.ts` (fresh-install describe block); commit `2b5c4d5`.
- `@data` `.gobbi/projects/gobbi/.install-manifest.json` records a sha256 per copied file.
  - Evidence: `install.ts::buildNextManifest`; commit `db6c391`.
- `@integration` `.gobbi/settings.json` is seeded with `projects.active === "gobbi"` and `projects.known === ["gobbi"]`.
  - Evidence: `install.ts::applyFreshInstallActivation` + `SeedResult`; commit `db6c391`.
- `@integration` `.claude/{skills,agents,rules}/` are built as per-file relative symlinks after the copy.
  - Evidence: `symlink-farm.ts::buildFarmIntoRoot`; commits `004eda1`, `db6c391`.

---

## G-MEM2-02 — Fresh install preserves non-farm `.claude/` (NI-1)

- `@functional` `.claude/CLAUDE.md`, `.claude/hooks/`, `.claude/settings/` unchanged after fresh install.
  - Evidence: `install.test.ts` — NI-1 preservation case; commit `5c5ac65`.
- `@data` Farm build never removes non-farm-kind paths from `.claude/`.
  - Evidence: `symlink-farm.ts::buildFarmIntoRoot` — authority scoped to three kinds; commit `5c5ac65`.

---

## G-MEM2-03 — Fresh install refuses pre-existing farm-kind content

- `@functional` Install exits non-zero when `.claude/skills/legacy-skill/SKILL.md` exists as a regular file.
  - Evidence: `install.ts::targetHasPreexistingContent`; commit `2b5c4d5`.
- `@boundary` Individual symlinks already in the farm do NOT trigger the refusal (install idempotent over symlinks).
  - Evidence: `install.test.ts` — mixed preexisting content case.

---

## G-MEM2-04 — Workflow init bootstraps default project

- `@functional` `gobbi workflow init` on a fresh repo creates a project named `basename(repoRoot)`.
  - Evidence: `packages/cli/src/commands/workflow/init.ts`; commit `668ee5a`.
- `@data` `metadata.projectName` matches `projects.active` at init time.
  - Evidence: `init.ts` — project resolution; commit `668ee5a`.

---

## G-MEM2-05 through G-MEM2-10 — The six 3-way-merge actions

- `@functional` Each action kind (`add`, `unchanged`, `template-only`, `user-only`, `converged`, `conflict`) is produced by `classifyFiles` for the hash triple defined in its scenario.
  - Evidence: `install.ts::classifyFiles`; `install.test.ts` — per-action describe blocks; commit `2b5c4d5`.
- `@data` The action discriminator union in `install.ts` enumerates exactly six kinds.
  - Evidence: `install.ts` `FileAction` type definition.
- `@boundary` `conflict` does not abort the run — non-conflict actions still apply and exit code is `0`.
  - Evidence: `install.ts::runInstallWithOptions` — conflicts accumulate in a separate list; commit `2b5c4d5`.

---

## G-MEM2-11 — Install refuses during active session

- `@functional` Install exits `2` when any session has non-terminal `state.json.currentStep`.
  - Evidence: `install.ts::collectActiveSessions` + `renderActiveSessionError`; commit `2b5c4d5`.
- `@concurrency` Active-session check runs before any manifest / template write.
  - Evidence: `install.ts::runInstallWithOptions` — gate ordering.

---

## G-MEM2-12 — Upgrade manifest excludes conflicts

- `@data` `buildNextManifest` carries over prior baseline hash for `conflict` entries.
  - Evidence: `install.ts::buildNextManifest`; commit `2b5c4d5`.
- `@functional` Re-running install with no template change does not re-flag the conflict as `add`.
  - Evidence: `install.test.ts` — re-run idempotency case.

---

## G-MEM2-13 — Template bundle discipline

- `@data` `enumerateTemplateFiles` returns paths only under `skills/`, `agents/`, `rules/`.
  - Evidence: `install.ts::enumerateTemplateFiles`; commit `2b5c4d5`.
- `@manual` No `design/`, `learnings/`, `references/`, `notes/`, `decisions/`, `scenarios/`, `checklists/`, `reviews/`, `playbooks/`, `backlogs/` files exist under `node_modules/@gobbitools/cli/dist/templates/`.
  - Evidence: `find node_modules/@gobbitools/cli/dist/templates -type f -not -path '*/skills/*' -not -path '*/agents/*' -not -path '*/rules/*'` returns empty.

---

## G-MEM2-14 — `gobbi project list`

- `@functional` `gobbi project list` enumerates `projects.known` and marks `projects.active`.
  - Evidence: `packages/cli/src/commands/project/list.ts`; `project/__tests__/list.test.ts`; commit `8b707ec`, `87d2ec2`.

---

## G-MEM2-15 — `gobbi project create` scaffolds taxonomy

- `@functional` `gobbi project create demo` creates the 11 taxonomy subdirectories under `.gobbi/projects/demo/`.
  - Evidence: `packages/cli/src/commands/project/create.ts`; commit `d6e31c5`.
- `@data` `projects.known` is updated atomically; `projects.active` is preserved.
  - Evidence: `create.ts` — settings update.
- `@boundary` Re-running with the same name is idempotent (exit 0, no modification).
  - Evidence: `project/__tests__/create.test.ts` — idempotency case; commit `87d2ec2`.

---

## G-MEM2-16 — Invalid project name refused

- `@functional` `gobbi project create "foo/bar"` exits non-zero and emits a naming-rule message.
  - Evidence: `create.ts` — regex validation; `project/__tests__/create.test.ts`.
- `@boundary` Name containing `/`, `..`, uppercase, or leading `-` all rejected.
  - Evidence: validator against `^[a-z][a-z0-9-]*$`.

---

> **Retired in v0.5.0 PR-FIN-2:** Items G-MEM2-17 through G-MEM2-20 (and the `switch.ts` evidence in G-MEM2-23 / G-MEM2-24) document the legacy `gobbi project switch` command. That command was removed in PR-FIN-2 once project resolution moved to `basename(repoRoot)` plus the `--project` flag. The items below remain in place as the historical record of what Pass 2 shipped; they no longer reflect the current command surface.

## G-MEM2-17 — `gobbi project switch` rotates the farm

- `@functional` After switch, all three farm kinds point into the new project.
  - Evidence: `project/switch.ts::runProjectSwitchWithOptions`; `project/__tests__/switch.test.ts`; commit `3d0b955`.
- `@data` `projects.active` is updated after a successful swap.
  - Evidence: `switch.ts` — settings update follows `swapKinds`.
- `@integration` Non-farm `.claude/` content survives the rotation.
  - Evidence: `switch.test.ts` — preservation assertions.

---

## G-MEM2-18 — Switch refuses during active session

- `@concurrency` `shouldBlockSwitch` returns true when any session in the workspace has non-terminal currentStep.
  - Evidence: `switch.ts::shouldBlockSwitch`; commit `3d0b955`.
- `@functional` Exit code is `2`; `projects.active` and farm unchanged.
  - Evidence: `switch.test.ts` — active-session gate case.

---

## G-MEM2-19 — Switch refuses unknown project

- `@functional` Unknown `<name>` → exit non-zero, stderr names the unknown project.
  - Evidence: `switch.ts` — unknown-project branch.
- `@boundary` Validation against `projects.known` runs before the active-session gate (so unknown-name always beats active-session message).
  - Evidence: `switch.test.ts` — ordering case.

---

## G-MEM2-20 — Switch rollback on partial failure

- `@recovery` `SwapKindsRollbackFailedError` carries partial-state details (which kinds were renamed).
  - Evidence: `switch.ts::SwapKindsRollbackFailedError`; commit `3d0b955`.
- `@integration` `projects.active` is NOT updated on partial failure.
  - Evidence: `switch.ts` — settings update guarded by post-swap success.

---

## G-MEM2-21 — Top-level dispatch registers `install` + `project`

- `@integration` `gobbi install` resolves to `runInstall`; `gobbi project <verb>` resolves to the project group handler.
  - Evidence: `packages/cli/src/cli.ts` — dispatch table; commit `02dce1e`.
- `@functional` Unregistered commands return a clear "command not found" message.
  - Evidence: `cli.ts` — default-case handling.

---

## G-MEM2-22 — Relative symlinks in the farm

- `@data` Symlink targets are relative (e.g., `../../.gobbi/projects/...`), not absolute.
  - Evidence: `symlink-farm.ts::mirrorTreeAsSymlinks`; commit `004eda1`.
- `@boundary` Every mirrored link resolves to an existing file in `.gobbi/projects/{active}/`.
  - Evidence: `symlink-farm.ts::buildFarmIntoRoot` — walk + link phase.

---

## G-MEM2-23 — Atomic per-kind rotation

- `@concurrency` Per-kind swap is `rename(src → old) && rename(new → src)` — readers within a single kind never see an intermediate state.
  - Evidence: `switch.ts::swapKinds`; commit `3d0b955`.
- `@manual` Cross-kind ordering is documented as best-effort sequential (not guaranteed atomic across kinds).
  - Evidence: `switch.ts` — JSDoc on `swapKinds`.

---

## G-MEM2-24 — Temp-location cleanup on swap failure

- `@recovery` `.claude.next/` and `.claude.old/` are removed on error paths.
  - Evidence: `switch.ts::safeRmTree`; commit `7bf177d`.
- `@functional` A subsequent `gobbi project switch` does not see leftover temp dirs.
  - Evidence: `switch.test.ts` — re-run-after-failure case.

---

## G-MEM2-25 — Farm rebuild preserves non-farm content

- `@functional` `buildFarmIntoRoot` does not remove `.claude/CLAUDE.md` or `.claude/hooks/`.
  - Evidence: `symlink-farm.ts::buildFarmIntoRoot`; commit `5c5ac65` (NI-1).
- `@data` Only the three farm-kind directories are targeted for rewrite.
  - Evidence: `CLAUDE_FARM_KINDS` constant in `symlink-farm.ts`.

---

## G-MEM2-26 — Step README on STEP_EXIT

- `@functional` `writeStepReadmeForExit` writes `.gobbi/projects/{name}/sessions/{id}/{step}/README.md` on step exit.
  - Evidence: `packages/cli/src/workflow/step-readme-writer.ts`; `workflow/__tests__/step-readme-writer.test.ts`; commit `6e7c911`.
- `@data` Frontmatter carries `step`, `sessionId`, `projectName`, `stepStartedAt`, `stepEndedAt`.
  - Evidence: `step-readme-writer.ts::generateStepReadme`.
- `@boundary` The writer fires exactly once per step exit (no duplicate writes).
  - Evidence: `step-readme-writer.test.ts` — idempotency case.

---

## G-MEM2-27 — Agent spawn entries in README

- `@data` Each spawn produces one `agents` array entry with `name`, `stance?`, `model`, `effort`, `startedAt`, `endedAt`, `transcriptSha256?`.
  - Evidence: `step-readme-writer.ts::generateStepReadme`; `step-readme-writer.test.ts` — multi-spawn case; commit `6e7c911`.

---

## G-MEM2-28 — Evaluation verdict in README

- `@data` `evaluation` frontmatter contains `{ perspectives, verdict, verdictAt }` when eval ran.
  - Evidence: `step-readme-writer.ts` — evaluation branch.
- `@boundary` When no eval ran, the field is absent (not null).
  - Evidence: `step-readme-writer.test.ts` — no-eval case.

---

## G-MEM2-29 — Authoritative artefact + artifact list

- `@data` `authoritative` names the primary hand-off path; `artifacts` lists all emitted files with byte counts.
  - Evidence: `step-readme-writer.ts::generateStepReadme` — artifacts block.

---

## G-MEM2-30 — In-flight status via CLI only

- `@functional` No `README.md` exists in a step directory before STEP_EXIT.
  - Evidence: `step-readme-writer.ts` — writer invocation bound to exit.
- `@manual` `gobbi workflow status --step <name>` returns live progress from events.
  - Evidence: `packages/cli/src/commands/workflow/status.ts`.

---

## G-MEM2-31 — Legacy `'plan'` state normalized on read

- `@data` State loader rewrites `currentStep: 'plan'` → `'planning'` in memory before schema validation.
  - Evidence: commit `8affaa9` (W4 crit O-1/EP-1).
- `@functional` The on-disk file is not rewritten by the read path.
  - Evidence: W4 backward-compat tests in `workflow/__tests__/`.

---

## G-MEM2-32 — Writes use only `'planning'`

- `@data` Reducer writes `"currentStep": "planning"` after the rename.
  - Evidence: commits `6178277` (W4.1), `f383cce` (W4.2).
- `@data` Spec directory `specs/planning/` (not `specs/plan/`) is consulted.
  - Evidence: `specs/planning/` exists; `specs/plan/` is removed.

---

## G-MEM2-33 — `capture-planning` is the live verb

- `@functional` `gobbi workflow capture-planning` exits 0.
  - Evidence: commit `93fc80e` (W4.3).
- `@boundary` `gobbi workflow capture-plan` returns command-not-found.
  - Evidence: `cli.ts` dispatch — legacy verb removed.
- `@data` `resolveEvalDecision` no longer accepts `'plan'` as a step alias.
  - Evidence: commit `93fc80e` — bridge removal diff.

---

## G-MEM2-34 — `gobbi note planning`

- `@functional` `gobbi note planning` lands files under `.gobbi/projects/{name}/sessions/{id}/planning/rawdata/`.
  - Evidence: commit `f1a3bbe` (W4 crit O-2).
- `@data` Directory literal `planning/` replaces `plan/` in `note.ts` valid-phases list.
  - Evidence: `note.ts` — `validPhases`.

---

## G-MEM2-35 — Snapshots reflect the rename

- `@data` Snapshot files under `workflow/__tests__/__snapshots__/` contain `'planning'` exclusively for state literals.
  - Evidence: commit `fcd1171` (W4.4).
- `@manual` Post-regen audit: `rg "'plan'"` returns only prose contexts (no live code or snapshot literals).
  - Evidence: W4.4 PR body audit notes.

---

## G-MEM2-36 — `findStateActiveSessions` is the single source

- `@concurrency` All active-session gates (install, switch, wipe) route through `findStateActiveSessions`.
  - Evidence: `packages/cli/src/lib/session-scan.ts`; commits `f428f18` (W3.3), `f257779` (W3 eval).
- `@data` Active criterion is `state.json.currentStep ∉ {done, error}` — state-based, not heuristic.
  - Evidence: `session-scan.ts` — predicate.
- `@integration` Scans all `.gobbi/projects/*/sessions/` directories.
  - Evidence: `session-scan.ts` — glob pattern.

---

## G-MEM2-37 — Wipe-legacy-sessions skips active

- `@functional` Wipe deletes `done` and `error` sessions; skips non-terminal sessions.
  - Evidence: `packages/cli/src/commands/maintenance/wipe-legacy-sessions.ts`; `maintenance/__tests__/wipe-legacy-sessions.test.ts`; commit `44dd47a`.
- `@data` Stdout distinguishes wiped sessions from skipped sessions.
  - Evidence: `wipe-legacy-sessions.ts` — output format.

---

## G-MEM2-38 — Current session protected during Pass-2

- `@concurrency` Session `35742566-2697-4318-bb06-558346b77b4a` with `currentStep: 'execution'` is untouched by a wipe.
  - Evidence: `wipe-legacy-sessions.test.ts` — active-skip case.
- `@recovery` Wipe is idempotent — re-running produces no additional deletions.
  - Evidence: `wipe-legacy-sessions.ts` — skip-on-missing logic.

---

## G-MEM2-39 — Gotcha promote writes to active project learnings

- `@functional` `gobbi gotcha promote` writes to `.gobbi/projects/gobbi/learnings/gotchas/{slug}.md`.
  - Evidence: `packages/cli/src/commands/gotcha/promote.ts`; commit `ab30ccb` (W3 eval F1).
- `@data` Legacy destination `.gobbi/project/gotchas/` is not written.
  - Evidence: `promote.ts` — `SOURCE_DIR_REL` updated.

---

## G-MEM2-40 — Promote resolves per active project

- `@functional` With `projects.active: "demo"`, promotion writes under `.gobbi/projects/demo/learnings/gotchas/`.
  - Evidence: `promote.ts` — active-project lookup; commit `ab30ccb`.

---

## G-MEM2-41 — Facade routing

- `@integration` All `.gobbi/` path derivations inside `packages/cli/src/` go through `workspace-paths.ts` exports.
  - Evidence: `packages/cli/src/lib/workspace-paths.ts`; commit `4708aca`.
- `@manual` `rg "'\.gobbi/'" packages/cli/src` surfaces only intentional string constants inside `workspace-paths.ts` itself or tests.
  - Evidence: manual audit during W2 / W3 remediation.

---

## G-MEM2-42 — Worktrees under `.gobbi/projects/{name}/worktrees/`

- `@data` `worktreeDir(repoRoot, projectName, worktreeName)` returns `.gobbi/projects/{projectName}/worktrees/{worktreeName}`.
  - Evidence: `workspace-paths.ts::worktreeDir`; commits `4708aca`, `4bb9d38`.
- `@manual` No live code path returns `.claude/worktrees/`.
  - Evidence: `rg 'claude/worktrees' packages/cli/src` returns comments / legacy refs only.

---

## G-MEM2-43 — `_bun` + `_typescript` skills in farm

- `@functional` After fresh install, both skills resolve through the farm.
  - Evidence: commit `890e6d1` (W3 eval F2).
- `@data` Template bundle includes both skill directories.
  - Evidence: `node_modules/@gobbitools/cli/dist/templates/skills/_bun/`, `_typescript/`.

---

## G-MEM2-44 — 11-dir taxonomy on create (D1)

- `@functional` `gobbi project create demo` creates the 11 top-level taxonomy directories.
  - Evidence: `project/create.ts`; commit `d6e31c5`.
- `@data` Directory list matches the README taxonomy table exactly (no missing, no extra).
  - Evidence: `project/__tests__/create.test.ts` — directory enumeration.

---

## G-MEM2-45 — Feature-first layout (D2)

- `@manual` `design/v050-features/gobbi-memory/` and `design/v050-features/gobbi-config/` both hold `{README,scenarios,checklist,review}.md`.
  - Evidence: `ls .gobbi/projects/gobbi/design/v050-features/{gobbi-memory,gobbi-config}/`.
- `@manual` Top-level `scenarios/`, `checklists/`, `reviews/` contain no per-feature content (only cross-feature).
  - Evidence: `ls .gobbi/projects/gobbi/{scenarios,checklists,reviews}/`.

---

## Verification procedure

1. `bun test packages/cli/src/commands/__tests__/install.test.ts` — exercises G-MEM2-01 through G-MEM2-13.
2. `bun test packages/cli/src/commands/project/__tests__/*.test.ts` — exercises G-MEM2-14 through G-MEM2-20.
3. `bun test packages/cli/src/lib/__tests__/symlink-farm.test.ts` — exercises G-MEM2-22, G-MEM2-25.
4. `bun test packages/cli/src/workflow/__tests__/step-readme-writer.test.ts` — exercises G-MEM2-26 through G-MEM2-30.
5. `bun test packages/cli/src/commands/maintenance/__tests__/wipe-legacy-sessions.test.ts` — exercises G-MEM2-37, G-MEM2-38.
6. `bun test packages/cli/src/commands/gotcha/__tests__/promote.test.ts` — exercises G-MEM2-39, G-MEM2-40.
7. Full suite (`bun test`) covers every scenario; `@manual` items require filesystem / CLI observation as called out inline.

See `scenarios.md` for the Given/When/Then bodies and `review.md` for the DRIFT / GAP / NOTE log with pinned SHAs.
