# gobbi-memory — Scenarios

Behaviour specifications for the Pass-2 multi-project memory redesign. Covers the 11-dir taxonomy, per-file symlink farm, bootstrap, `gobbi install` 3-way merge, `gobbi project list|create|switch`, active-session gates, per-step README on STEP_EXIT, and `'plan'` → `'planning'` backward-compat.

This file does NOT cover: the settings cascade itself (see `../gobbi-config/scenarios.md`), state-machine transitions outside the rename (`deterministic-orchestration.md`), or plugin-side template packaging (`one-command-install.md`). Every scenario has a stable ID in the `G-MEM2-NN` format — `rg 'G-MEM2-' .gobbi/projects/gobbi/design/v050-features/gobbi-memory/` surfaces every reference. Scenario IDs, once published, never change; new scenarios get higher numbers.

See `README.md` for the feature overview.

---

## Bootstrap — fresh install

### G-MEM2-01 — Fresh `gobbi install` produces a working state end-to-end

**Given** a repo with no `.gobbi/` and no `.claude/{skills,agents,rules}/` farm
**When** `gobbi install` runs
**Then** `.gobbi/projects/gobbi/{skills,agents,rules}/` exist with the bundled template files; `.gobbi/projects/gobbi/.install-manifest.json` records a sha256 per template file; `.gobbi/settings.json` has `projects.active === "gobbi"` and `projects.known === ["gobbi"]`; `.claude/{skills,agents,rules}/` are populated with per-file relative symlinks into the project tree; exit code is `0`.

Evidence: `packages/cli/src/commands/install.ts::runInstallWithOptions` (fresh branch), `applyFreshInstallActivation`. Commits `2b5c4d5` (W5.3), `db6c391` (W5 eval F1+F2).

---

### G-MEM2-02 — Fresh install preserves non-farm `.claude/` content (NI-1)

**Given** a repo with pre-existing `.claude/CLAUDE.md`, `.claude/hooks/`, `.claude/settings/`
**When** `gobbi install` runs
**Then** those paths are unchanged (inode, content, mtime); only the three farm-kind directories are newly written; exit code is `0`.

Evidence: `packages/cli/src/lib/symlink-farm.ts::buildFarmIntoRoot`. Commit `5c5ac65` (NI-1 fix).

---

### G-MEM2-03 — Fresh install aborts when farm-kind directories already contain non-symlink files

**Given** `.claude/skills/legacy-skill/SKILL.md` exists as a regular file
**When** `gobbi install` runs
**Then** exit code is non-zero; stderr names the preexisting farm-kind content; `.gobbi/projects/gobbi/` is NOT created.

Evidence: `packages/cli/src/commands/install.ts::targetHasPreexistingContent`. Commit `2b5c4d5`.

---

### G-MEM2-04 — `gobbi workflow init` on a fresh repo auto-creates the default project

**Given** a repo with no `.gobbi/` and no prior `gobbi install`
**When** `gobbi workflow init` runs
**Then** a project named `basename(repoRoot)` is created under `.gobbi/projects/{basename}/`; `projects.active` is set to that name; the session's `metadata.projectName` is stamped accordingly.

Evidence: `packages/cli/src/commands/workflow/init.ts` — bootstrap fallback. Commit `668ee5a`.

---

## Install — upgrade & 3-way merge (6 merge actions)

### G-MEM2-05 — Action `add`: template has a new file the user never had

**Given** baseline manifest lacks `skills/_new/SKILL.md`; template now includes it; project tree lacks it
**When** `gobbi install` runs
**Then** the file is copied into `.gobbi/projects/{active}/skills/_new/SKILL.md`; the new manifest records its hash; the action classification is `add`.

Evidence: `install.ts::classifyFiles` (add case). Commit `2b5c4d5`.

---

### G-MEM2-06 — Action `unchanged`: all three hashes agree

**Given** a file whose project, baseline, and template hashes are identical
**When** `gobbi install` runs
**Then** no write occurs; the action is `unchanged`; the manifest entry is retained.

Evidence: `install.ts::classifyFiles` (unchanged). Commit `2b5c4d5`.

---

### G-MEM2-07 — Action `template-only`: template changed, user still matches baseline

**Given** `currentHash === baseHash && templateHash !== baseHash`
**When** `gobbi install` runs
**Then** the template file overwrites the project file; the manifest is updated to the new template hash; the action is `template-only`.

Evidence: `install.ts::classifyFiles` (template-only). Commit `2b5c4d5`.

---

### G-MEM2-08 — Action `user-only`: user changed, template still matches baseline

**Given** `currentHash !== baseHash && templateHash === baseHash`
**When** `gobbi install` runs
**Then** the project file is NOT overwritten; the manifest retains the baseline hash; the action is `user-only`.

Evidence: `install.ts::classifyFiles` (user-only). Commit `2b5c4d5`.

---

### G-MEM2-09 — Action `converged`: user and template changed to the same new hash

**Given** `currentHash === templateHash && currentHash !== baseHash`
**When** `gobbi install` runs
**Then** no write occurs; the manifest is updated to the converged hash; the action is `converged`.

Evidence: `install.ts::classifyFiles` (converged). Commit `2b5c4d5`.

---

### G-MEM2-10 — Action `conflict`: user and template diverged differently

**Given** all three hashes differ
**When** `gobbi install` runs
**Then** the project file is NOT overwritten; the manifest retains the prior baseline for the entry; the plan output lists the path under a `CONFLICT` heading; non-conflict actions still apply; exit code is `0`.

Evidence: `install.ts::classifyFiles` + `renderPlan`. Commit `2b5c4d5`.

---

### G-MEM2-11 — Install refuses while a session is active

**Given** at least one session under `.gobbi/projects/*/sessions/` has non-terminal `state.json.currentStep`
**When** `gobbi install` runs
**Then** exit code is `2`; stderr names the blocking session id and project; no filesystem write occurs.

Evidence: `install.ts::collectActiveSessions` + `renderActiveSessionError`. Commit `2b5c4d5`.

---

### G-MEM2-12 — Upgrade manifest rewrite excludes conflicts

**Given** an upgrade run with one `conflict` and several `template-only` entries
**When** `gobbi install` completes
**Then** the rewritten manifest carries new template hashes for the `template-only` entries; the `conflict` entry retains its baseline hash; re-running with no template change does not re-flag the conflict as new.

Evidence: `install.ts::buildNextManifest`. Commit `2b5c4d5`.

---

### G-MEM2-13 — Template bundle discipline — only `skills/`, `agents/`, `rules/` ship

**Given** a fresh install enumeration
**When** `enumerateTemplateFiles` runs
**Then** every relative path begins with `skills/`, `agents/`, or `rules/`; no `design/`, `learnings/`, `references/`, `notes/`, `decisions/`, `scenarios/`, `checklists/`, `reviews/`, `playbooks/`, or `backlogs/` file is copied.

Evidence: `install.ts::enumerateTemplateFiles`. Commit `2b5c4d5`.

---

## Project lifecycle — list / create / switch

### G-MEM2-14 — `gobbi project list` enumerates known projects and marks the active one

**Given** `projects.known: ["gobbi", "demo"]` and `projects.active: "gobbi"`
**When** `gobbi project list` runs
**Then** stdout lists both names; `gobbi` is marked active; exit code is `0`.

Evidence: `packages/cli/src/commands/project/list.ts`. Commit `8b707ec`.

---

### G-MEM2-15 — `gobbi project create <name>` scaffolds the 11-dir taxonomy

**Given** `projects.known: ["gobbi"]` and no `.gobbi/projects/demo/`
**When** `gobbi project create demo` runs
**Then** `.gobbi/projects/demo/` is created with the 11 taxonomy directories + `.install-manifest.json`; `projects.known` gains `"demo"`; `projects.active` is unchanged; re-running with the same name is idempotent.

Evidence: `packages/cli/src/commands/project/create.ts`. Commit `d6e31c5`.

---

### G-MEM2-16 — `gobbi project create` refuses an invalid name

**Given** any workspace state
**When** `gobbi project create "foo/bar"` runs
**Then** exit code is non-zero; stderr names the naming-rule violation; no directory is created.

Evidence: `create.ts` — name validation against `^[a-z][a-z0-9-]*$`. Commit `d6e31c5`.

---

### G-MEM2-17 — `gobbi project switch <name>` atomically rotates the farm

**Given** `projects.active: "gobbi"`, project `demo` exists, no active session
**When** `gobbi project switch demo` runs
**Then** `.claude/{skills,agents,rules}/` symlinks all point into `.gobbi/projects/demo/`; `projects.active === "demo"`; non-farm `.claude/` content is unchanged; exit code is `0`.

Evidence: `packages/cli/src/commands/project/switch.ts::runProjectSwitchWithOptions` + `swapKinds`. Commit `3d0b955`.

---

### G-MEM2-18 — `gobbi project switch` refuses while a session is active

**Given** a session with non-terminal `currentStep` exists
**When** `gobbi project switch demo` runs
**Then** exit code is `2`; stderr names the blocking session; `projects.active` is unchanged; the farm is unchanged.

Evidence: `switch.ts::shouldBlockSwitch` + `renderActiveSessionError`. Commits `3d0b955`, `f428f18`.

---

### G-MEM2-19 — `gobbi project switch` refuses an unknown project

**Given** `projects.known: ["gobbi"]`
**When** `gobbi project switch demo` runs
**Then** exit code is non-zero; stderr names the unknown project; neither farm nor settings change.

Evidence: `switch.ts` — unknown-project branch. Commit `3d0b955`.

---

### G-MEM2-20 — `gobbi project switch` rolls back on partial swap failure

**Given** a switch that fails mid-rotation
**When** the failure occurs during `swapKinds`
**Then** `SwapKindsRollbackFailedError` carries the partial-state details; already-renamed kinds are flagged for manual recovery; `projects.active` is NOT updated.

Evidence: `switch.ts::SwapKindsRollbackFailedError`. Commit `3d0b955`.

---

### G-MEM2-21 — `install` and `project` verbs are registered in top-level dispatch

**Given** the CLI is invoked as `gobbi install` or `gobbi project ...`
**When** the top-level dispatcher runs
**Then** both routes resolve to their handlers (not "command not found").

Evidence: `packages/cli/src/cli.ts`. Commit `02dce1e` (W5.5).

---

## Symlink farm — build & rotation

### G-MEM2-22 — Farm links are relative and portable

**Given** a freshly built farm for project `gobbi`
**When** a symlink target is read under `.claude/skills/`
**Then** the target is a relative path such as `../../.gobbi/projects/gobbi/skills/_delegation/SKILL.md`; it resolves to a file inside the repo.

Evidence: `packages/cli/src/lib/symlink-farm.ts::mirrorTreeAsSymlinks`. Commit `004eda1`.

---

### G-MEM2-23 — Farm rotation is atomic per-kind via double-rename

**Given** a switch rotating three kinds
**When** `swapKinds` runs
**Then** each kind's swap is `rename(src → .old) && rename(.next → src)` — no intermediate state visible to a reader within a single kind; cross-kind ordering is documented as best-effort sequential.

Evidence: `switch.ts::swapKinds`. Commit `3d0b955`.

---

### G-MEM2-24 — Temp-location farm is cleaned up on swap failure

**Given** a switch that fails before the second kind is swapped
**When** the error-handling path runs
**Then** `.claude.next/` and `.claude.old/` are removed; the next manual recovery can re-run `gobbi project switch` without leftover temp dirs.

Evidence: `switch.ts::safeRmTree` invoked in error/finally paths. Commit `7bf177d`.

---

### G-MEM2-25 — Farm rebuild preserves sibling `.claude/` content

**Given** `.claude/CLAUDE.md` and `.claude/hooks/pre-stop.sh` exist alongside an existing farm
**When** `buildFarmIntoRoot` rebuilds
**Then** `.claude/CLAUDE.md` and `.claude/hooks/` are untouched; only the three farm-kind directories are rewritten.

Evidence: `symlink-farm.ts::buildFarmIntoRoot`. Commit `5c5ac65` (NI-1).

---

## Per-step README on STEP_EXIT

### G-MEM2-26 — Step README is written once on STEP_EXIT with derived frontmatter

**Given** an in-flight session transitions through STEP_EXIT for `ideation`
**When** `writeStepReadmeForExit` fires
**Then** `.gobbi/projects/{name}/sessions/{id}/ideation/README.md` exists with frontmatter `step: ideation`, `sessionId`, `projectName`, `stepStartedAt`, `stepEndedAt`; the file is written exactly once per step exit.

Evidence: `packages/cli/src/workflow/step-readme-writer.ts::writeStepReadmeForExit`. Commit `6e7c911` (W5.1).

---

### G-MEM2-27 — Step README lists every subagent spawn with model + effort + transcript hash

**Given** a step that ran three subagents and emitted transcripts
**When** the README is generated
**Then** the `agents` array has three entries; each carries `name`, `stance?`, `model`, `effort`, `startedAt`, `endedAt`, `transcriptSha256?`.

Evidence: `step-readme-writer.ts::generateStepReadme`. Commit `6e7c911`.

---

### G-MEM2-28 — Step README records the evaluation verdict when eval ran

**Given** a step whose evaluation returned `REVISE` across three perspectives
**When** the README is generated
**Then** `evaluation` is `{ perspectives: [...], verdict: 'REVISE', verdictAt: <timestamp> }`; absence of the field indicates no eval ran.

Evidence: `step-readme-writer.ts::generateStepReadme` (evaluation branch). Commit `6e7c911`.

---

### G-MEM2-29 — Step README lists authoritative next-step input

**Given** a step that produced two artefacts and flagged one as the primary hand-off
**When** the README is generated
**Then** `authoritative` names the primary path; `artifacts` lists both with byte counts.

Evidence: `step-readme-writer.ts::generateStepReadme` (authoritative/artifacts block). Commit `6e7c911`.

---

### G-MEM2-30 — In-flight status is readable only via `gobbi workflow status`

**Given** a step is mid-flight
**When** the file system is inspected
**Then** no `README.md` exists in the step directory; `gobbi workflow status --step <name>` returns live progress from the event store.

Evidence: `step-readme-writer.ts` — writer is not invoked mid-step (D4 exit-only). Commit `6e7c911`.

---

## State / event backward-compat (`'plan'` → `'planning'`)

### G-MEM2-31 — Legacy `state.json` with `currentStep: 'plan'` reads as `'planning'`

**Given** a session whose `state.json` predates the rename and contains `"currentStep": "plan"`
**When** the state is loaded through the pre-validation normalization shim
**Then** the in-memory value is `'planning'` before schema validation; downstream consumers never see the legacy literal; the on-disk file is not rewritten by the read path.

Evidence: Commit `8affaa9` (W4 crit O-1/EP-1 pre-validation normalization).

---

### G-MEM2-32 — Post-rename `state.json` writes use only `'planning'`

**Given** a workflow transitions into the planning step
**When** the reducer writes `state.json`
**Then** the on-disk literal is `"currentStep": "planning"`; `specs/planning/` (not `specs/plan/`) is the spec directory consulted.

Evidence: Commits `6178277` (W4.1), `f383cce` (W4.2).

---

### G-MEM2-33 — `capture-planning` is the live CLI verb (not `capture-plan`)

**Given** a subagent or hook invokes the capture command
**When** `gobbi workflow capture-planning --session-id <id>` runs
**Then** exit code is `0`; invoking the legacy `gobbi workflow capture-plan` returns a command-not-found error; the `resolveEvalDecision` `'plan'` bridge is removed.

Evidence: Commit `93fc80e` (W4.3 verb rename + bridge removal).

---

### G-MEM2-34 — `gobbi note planning` replaces the legacy `plan` subcommand

**Given** a session writes a planning-step note
**When** `gobbi note planning --session-id <id>` runs
**Then** the note lands under `.gobbi/projects/{name}/sessions/{id}/planning/rawdata/` (directory literal `planning/`, not `plan/`).

Evidence: Commit `f1a3bbe` (W4 crit O-2 note.ts rename).

---

### G-MEM2-35 — Snapshot tests reflect the rename

**Given** snapshot tests that assert on spec id / step literal / state shape
**When** the full suite runs after W4
**Then** snapshots contain `'planning'` exclusively; no snapshot retains a bare `'plan'` literal outside prose contexts.

Evidence: Commit `fcd1171` (W4.4 snapshot regeneration).

---

## Active-session safeguards

### G-MEM2-36 — `findStateActiveSessions` is the single source of truth

**Given** any command that must gate on active sessions (install, switch, wipe)
**When** the command invokes `findStateActiveSessions(repoRoot)`
**Then** the return is derived from `state.json.currentStep ∉ {done, error}` (state-based, not heuristic); all `.gobbi/projects/*/sessions/` are scanned.

Evidence: `packages/cli/src/lib/session-scan.ts::findStateActiveSessions`. Commits `f428f18` (W3.3), `f257779` (W3 eval).

---

### G-MEM2-37 — `gobbi maintenance wipe-legacy-sessions` skips active sessions

**Given** three sessions: one `done`, one `error`, one `execution`
**When** `gobbi maintenance wipe-legacy-sessions` runs
**Then** `done` and `error` are deleted; `execution` is skipped; stdout lists which were wiped and which were protected; exit code is `0`.

Evidence: `packages/cli/src/commands/maintenance/wipe-legacy-sessions.ts`. Commit `44dd47a` (W3.3).

---

### G-MEM2-38 — Wipe protects the current in-flight session (D5 guard)

**Given** the current session `35742566-...` with `currentStep: 'execution'`
**When** `gobbi maintenance wipe-legacy-sessions` runs during the Pass-2 redesign
**Then** the current session directory is untouched; re-running is idempotent.

Evidence: `wipe-legacy-sessions.ts` — skip-active branch. Commit `44dd47a`.

---

## Gotcha promotion (post-W3.1)

### G-MEM2-39 — `gobbi gotcha promote` writes to the active project's learnings

**Given** a gotcha drafted with `projects.active: "gobbi"`
**When** `gobbi gotcha promote` runs
**Then** the promoted gotcha lands at `.gobbi/projects/gobbi/learnings/gotchas/{slug}.md`; the legacy destination `.gobbi/project/gotchas/` is NOT written.

Evidence: `packages/cli/src/commands/gotcha/promote.ts` — `SOURCE_DIR_REL` updated. Commit `ab30ccb` (W3 eval F1).

---

### G-MEM2-40 — Promote destination resolves per active project

**Given** `projects.active: "demo"` and a gotcha drafted against the demo project's session
**When** `gobbi gotcha promote` runs
**Then** the gotcha lands at `.gobbi/projects/demo/learnings/gotchas/{slug}.md`; no write occurs under `.gobbi/projects/gobbi/`.

Evidence: `promote.ts` — active-project lookup. Commit `ab30ccb`.

---

## Workspace-paths facade

### G-MEM2-41 — All `.gobbi/` callers route through `workspace-paths.ts`

**Given** any file under `packages/cli/src/` that needs a `.gobbi/` path
**When** the code is inspected
**Then** the path derives from `workspace-paths.ts` exports (`projectDir`, `projectSubdir`, `sessionsRoot`, `sessionDir`, `worktreeDir`), not from hard-coded string literals.

Evidence: `packages/cli/src/lib/workspace-paths.ts`. Commit `4708aca`.

---

### G-MEM2-42 — Worktrees resolve to `.gobbi/projects/{name}/worktrees/` (D6)

**Given** a request to create a project-scoped worktree
**When** `worktreeDir(repoRoot, projectName, worktreeName)` resolves
**Then** the returned path is `.gobbi/projects/{projectName}/worktrees/{worktreeName}`; the deprecated `.claude/worktrees/` location is NOT returned.

Evidence: `workspace-paths.ts::worktreeDir`. Commits `4708aca`, `4bb9d38`.

---

## Skill-farm imports

### G-MEM2-43 — Pass-2 ships `_bun` + `_typescript` skills into the farm

**Given** a fresh `gobbi install` with the new template bundle
**When** the farm is built
**Then** `.claude/skills/_bun/SKILL.md` and `.claude/skills/_typescript/SKILL.md` exist as farm symlinks resolving into `.gobbi/projects/gobbi/skills/`.

Evidence: Commit `890e6d1` (W3 eval F2).

---

## Structural locks (D1 / D2)

### G-MEM2-44 — 11-dir taxonomy materialises on `project create` (D1)

**Given** a freshly-created project `demo`
**When** `.gobbi/projects/demo/` is enumerated
**Then** the 11 taxonomy directories are present (`design/`, `decisions/`, `scenarios/`, `checklists/`, `reviews/`, `playbooks/`, `learnings/`, `references/`, `backlogs/`, `notes/`, `rules/`); `skills/` and `agents/` exist as farm-source directories.

Evidence: `packages/cli/src/commands/project/create.ts`. Commit `d6e31c5`.

---

### G-MEM2-45 — Feature docs co-locate under `design/v050-features/{name}/` (D2)

**Given** this feature (`gobbi-memory`) and its sibling (`gobbi-config`)
**When** the filesystem is inspected
**Then** both have `{README,scenarios,checklist,review}.md` co-located under `design/v050-features/{name}/`; top-level `scenarios/`, `checklists/`, `reviews/` hold only cross-feature content.

Evidence: `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/`, `.gobbi/projects/gobbi/design/v050-features/gobbi-config/`.

---

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-2 redesign DRIFT / GAP / NOTE with pinned commit SHAs.
