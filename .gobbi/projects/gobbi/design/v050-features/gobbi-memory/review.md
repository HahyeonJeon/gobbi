# Review — gobbi-memory Pass-2 Redesign

| Pass date  | Session ID                                 | Verdict | PR              |
|------------|--------------------------------------------|---------|-----------------|
| 2026-04-24 | `35742566-2697-4318-bb06-558346b77b4a`     | shipped | #119 (draft)    |

Pass-2 redesign replaced the Pass-1 `.gobbi/project/` singular + `.claude/`-hosted skills layout with a plural `.gobbi/projects/{name}/` source-of-truth plus a `.claude/{skills,agents,rules}/` per-file symlink farm. It bundled the `'plan'` → `'planning'` state-literal rename (issue #133) and added three new CLI command groups (`install`, `project list|create|switch`, `maintenance wipe-legacy-sessions`).

All SHAs below exist on `feat/118-gobbi-memory-pass-2` (HEAD `5c5ac65` at review time).

---

## DRIFT entries

### DRIFT-1 — `.gobbi/project/` (singular) replaced by `.gobbi/projects/{name}/` (plural)

**Finding:** Pass-1 shipped `.gobbi/project/` as the singular project-memory root. Pass-2 redesign moves every `.gobbi/project/` reference to `.gobbi/projects/{name}/`. ~130 tracked files migrated via `git mv`; all code-path constants rewritten; facade `workspace-paths.ts` added so future renames touch one module instead of N call sites.

**Evidence:** `f94853d` (W3.1 content migration), `4708aca` (route `.gobbi/` callers through workspace-paths facade), `ab30ccb` (`gobbi gotcha promote` destination update).

**Severity:** High — any agent or test reading from `.gobbi/project/` directly (no facade) would miss.

**Resolution:** fix code + doc — migration committed; the facade is the single rename boundary going forward.

**Owner:** gobbi-memory Pass-2 redesign.

---

### DRIFT-2 — `.claude/{skills,agents,rules}/` became a per-file symlink farm (D3 post-eval flip)

**Finding:** Ideation originally proposed either a per-file farm (PI-innovative) or a single-directory symlink (PI-best). Post-evaluation the decision flipped decisively to **per-file**: three evaluators independently raised that directory-to-symlink transitions produce unresolvable merge conflicts on parallel active branches, that atomic cross-kind swap becomes non-uniform when skills/agents are dir-symlinks but rules are per-file, and that active-session idle risk is lower with per-file batch replacement. The farm now lives as ~100 individual relative symlinks per kind.

**Evidence:** `004eda1` (W3.2 — build per-file symlink farm). Ideation §10 D3 post-eval FLIPPED entry.

**Severity:** High — `.claude/skills/` is no longer a Pass-1-shape regular directory holding source content.

**Resolution:** fix code + doc — farm builder shipped; `buildFarmIntoRoot` enforces the three-kind scope.

**Owner:** gobbi-memory Pass-2 redesign.

---

### DRIFT-3 — Gotcha promote destination moved from `.gobbi/project/gotchas/` to `.gobbi/projects/{active}/learnings/gotchas/`

**Finding:** Pre-W3.1 the gotcha promote command wrote to `.gobbi/project/gotchas/`. Post-W3.1 that directory no longer exists and `projects.active` resolves the destination. The destination resolves at promotion time (not session-bind time), so a user who switches projects between sessions and then promotes will land gotchas under the newly-active project — matching the semantic that gotchas are project-scoped knowledge.

**Evidence:** `ab30ccb` (W3 eval F1 — point gotcha promote destinations at `.gobbi/projects/<name>/learnings/gotchas/`).

**Severity:** Medium — any hard-coded consumer expecting the old path breaks silently.

**Resolution:** fix code + doc — `SOURCE_DIR_REL` updated; scenario `G-MEM2-39` guards the new destination.

**Owner:** gobbi-memory Pass-2 redesign.

---

### DRIFT-4 — State-machine literal `'plan'` renamed to `'planning'` (issue #133 bundled)

**Finding:** Pass-2 bundled the `'plan'` → `'planning'` rename across 42 files and ~239 literal occurrences: `workflow/state.ts` union, `workflow/predicates.ts` (predicate names), `workflow/transitions.ts`, `specs/index.json`, `specs/plan/` → `specs/planning/` directory rename (including `__tests__/`, `README.md`, `spec.json`), `specs/artifact-selector.ts` (StepId union + subdir map + baseName), `EvalConfig.plan` → `EvalConfig.planning` field rename, `capture-plan.ts` → `capture-planning.ts`, and `note.ts` subcommand. The Pass-3 `resolveEvalDecision` `'plan'` backward-compat bridge was removed in the same wave; a pre-validation read-time normalization shim was added to keep legacy `state.json` files loadable.

**Evidence:** `6178277` (W4.1 state rename), `f383cce` (W4.2 specs dir), `adb8246` (W4.2 remediation — per-step spec.json + READMEs), `93fc80e` (W4.3 — capture-plan verb + bridge removal), `fcd1171` (W4.4 snapshot regen), `8affaa9` (W4 crit O-1/EP-1 pre-validation normalization), `f1a3bbe` (W4 crit O-2 note.ts rename), `ab0ac9b` (W4 EP-2 — capture-plan → capture-planning test renames), `caa43e4` (W4 minors — evalPlan predicates + --eval-plan flag).

**Severity:** High — mismatched literals break state-machine transitions silently; the bundled remediation is what prevents split-brain.

**Resolution:** fix code + doc — rename complete; normalization shim retained as a safety net for any stale rows.

**Owner:** gobbi-memory Pass-2 redesign (issue #133 closed).

---

### DRIFT-5 — Project-scoped worktrees at `.gobbi/projects/{name}/worktrees/` (D6 NEW lock)

**Finding:** Pass-1 and the v050-overview §Directory Split placed worktrees at workspace scope (`.gobbi/worktrees/`). D6 was a NEW lock surfaced during ideation — not in the user's original scope list — moving worktrees to project scope. `worktreeDir(repoRoot, projectName, worktreeName)` facade enforces the new location.

**Evidence:** `4708aca` (facade), `4bb9d38` (settings-io routing).

**Severity:** Medium — any `_git` workflow that pre-computes worktree paths from the old location breaks.

**Resolution:** fix code + doc — facade routes every caller; `v050-overview.md §Directory Split` updated to cite project-scoped worktrees.

**Owner:** gobbi-memory Pass-2 redesign.

---

## GAP entries

### GAP-1 — Cross-feature top-level dirs (`scenarios/`, `checklists/`, `reviews/`) are near-empty

**Finding:** D1 locked the 11-dir taxonomy and D2 locked feature-first co-location. The consequence is that the top-level `scenarios/`, `checklists/`, `reviews/` are currently near-empty — all per-feature content lives under `design/v050-features/{name}/`. This is by design, not a defect; any cross-feature content that accumulates later will populate them.

**Deferred to:** future passes that produce cross-feature scenarios / retrospectives.

**Owner:** Pass-2 redesign (deferred, not a defect).

---

### GAP-2 — `gobbi install --project <name>` not exposed in scenarios

**Finding:** The install command supports an override to install into a non-default project name, but the scenarios file cites only the default `"gobbi"` case. The override codepath is exercised by install tests (see `InstallOverrides` type) but not traced by a dedicated `G-MEM2-NN` scenario. Low risk because the codepath is narrow and tested.

**Evidence:** `install.ts::InstallOverrides`; commit `2b5c4d5`.

**Deferred to:** a follow-up scenario addition if the named-project install path becomes user-facing beyond bootstrap.

**Owner:** Pass-2 redesign (deferred).

---

### GAP-3 — Windows symlink / junction-point support not shipped

**Finding:** The farm uses `fs.symlinkSync` unconditionally. Windows requires either `symlinkSync(..., 'junction')` for directories or developer-mode for file symlinks. Per the solo-user context (Linux primary target) this is explicitly out of scope for Pass-2; the README documents Windows as unsupported.

**Evidence:** ideation §3 Q6 — "Windows = solo-user, Linux is primary target — document Windows as unsupported".

**Deferred to:** a dedicated cross-platform pass when a Windows user appears.

**Owner:** Pass-2 redesign (deferred).

---

### GAP-4 — Claude Code skill-cache empirical confirmation not run

**Finding:** The assumption that Claude Code caches skill content at session start (and does not re-read on reference) was taken as the safer default. A simple experiment — edit `.claude/skills/_git/SKILL.md` mid-session and observe whether the next invocation reflects the change — was proposed but not executed. The mid-session refuse-to-rotate guard was a property of the legacy `gobbi project switch` command (removed in v0.5.0 PR-FIN-2); a cache miss would not have caused user-visible incoherence, only made the switch safer than documented.

**Evidence:** ideation §12 OQ2.

**Deferred to:** an empirical session when the cache model matters for a future feature.

**Owner:** Pass-2 redesign (deferred).

---

## NOTE entries

### NOTE-1 — Fresh-install activation path split into separate functions (W5 eval F1/F2 remediation)

**Finding:** The initial W5.3 install shipped fresh-path activation inline inside `runInstallWithOptions`. W5 evaluation flagged that the fresh path was structurally duplicated and that a shared seed helper would make the upgrade path clearer. Remediation split activation into `applyFreshInstallActivation` + `SeedResult` + `SeedProjectOptions`, exported the seed helper for reuse by `gobbi project create`, and clarified that the upgrade path MUST NOT call `applyFreshInstallActivation` (the upgrade path is content-only, not activation).

**Evidence:** `db6c391` (W5 eval F1+F2 — complete gobbi install fresh-path setup + export seed helper).

**Owner:** gobbi-memory Pass-2 redesign.

---

### NOTE-2 — `wipe-legacy-sessions` uses state-based active detection, not directory-age heuristics

**Finding:** The initial W3.3 wipe command used a directory-age heuristic to decide which sessions were "legacy". W3 evaluation flagged that clock skew and stale lockfiles could mis-classify an active session as legacy. Remediation consolidated the check into `findStateActiveSessions` which reads `state.json.currentStep` directly — a session is active if and only if its current step is not `done` or `error`.

**Evidence:** `f257779` (W3 eval S1/A/minors — consolidate state.json reads + tighten wipe semantics), `f428f18` (W3.3 state-based helper).

**Owner:** gobbi-memory Pass-2 redesign.

---

### NOTE-3 — `buildFarmIntoRoot` scope rule documented post-NI-1

**Finding:** The NI-1 finding surfaced that an early version of `buildFarmIntoRoot` called `rm -rf` on `.claude/` before rebuilding the farm — which would have deleted `.claude/CLAUDE.md`, `.claude/hooks/`, and any user scratch. Remediation narrowed the authority of the farm builder to the three kind directories (`skills/`, `agents/`, `rules/`) exclusively; non-farm content survives every farm rebuild untouched. The rule is now enforced in `buildFarmIntoRoot` and tested in scenarios G-MEM2-02 and G-MEM2-25.

**Evidence:** `5c5ac65` (NI-1 fix — buildFarmIntoRoot must not wipe non-farm `.claude/` content).

**Owner:** gobbi-memory Pass-2 redesign.

---

## Summary table

| Finding  | Type  | Severity | SHAs                                                                      | Resolution |
|----------|-------|----------|---------------------------------------------------------------------------|-----------|
| DRIFT-1  | drift | high     | `f94853d` + `4708aca` + `ab30ccb`                                         | fix code + doc |
| DRIFT-2  | drift | high     | `004eda1`                                                                 | fix code + doc |
| DRIFT-3  | drift | medium   | `ab30ccb`                                                                 | fix code + doc |
| DRIFT-4  | drift | high     | `6178277` + `f383cce` + `adb8246` + `93fc80e` + `fcd1171` + `8affaa9` + `f1a3bbe` + `ab0ac9b` + `caa43e4` | fix code + doc |
| DRIFT-5  | drift | medium   | `4708aca` + `4bb9d38`                                                     | fix code + doc |
| GAP-1    | gap   | —        | —                                                                         | deferred; by design |
| GAP-2    | gap   | —        | `2b5c4d5` (codepath exists, scenario absent)                              | deferred; follow-up scenario |
| GAP-3    | gap   | —        | —                                                                         | deferred; cross-platform pass |
| GAP-4    | gap   | —        | —                                                                         | deferred; empirical session |
| NOTE-1   | note  | —        | `db6c391`                                                                 | eval remediation |
| NOTE-2   | note  | —        | `f257779` + `f428f18`                                                     | eval remediation |
| NOTE-3   | note  | —        | `5c5ac65`                                                                 | NI-1 remediation |

See `scenarios.md` for Gherkin bodies (G-MEM2-01 … G-MEM2-45) and `checklist.md` for ISTQB-tagged verification items.
