# Preparation Evaluation — STRUCTURE perspective (Claude, iter1)

## Artifact Summary + Memory reads
Same as project.md. Structure lens focuses on the organizing decomposition of the report + staged artifacts and downstream consumability.

## Locked Frame (Stage 1)
- Scenario: Staged decision/design files use the full template (frontmatter + no placeholders).
- Scenario: The rawdata report uses the required WORK-template sections.
- Scenario: Staged files follow the correct staging-path conventions for Wrap-up routing.
- Scenario: Generated artifacts are structurally compatible with Wrap-up promotion.

## Per-scenario per-check results
- **Staged files use full template:** PASS. All 4 decisions + 1 design doc have complete YAML frontmatter (`name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags`, `supersedes`, `superseded_by`, `decision_status`/`related`). No `TODO`/`TBD`/`<...>` placeholders found (grep-clean). Each has Context / Decision / Rationale / Evidence / Consequences structure. These are genuinely complete, standalone documents.
- **Report uses required sections:** PASS. Scope reference, Readiness summary, Design + memory readiness (Sub-steps A/B/C), Resolved design-details, Component inventory, Generated this loop, Out of scope gaps, Decisions log all present and substantive.
- **Staging-path conventions:** PASS. Decisions at `preparation/staging/decisions/`, design at `preparation/staging/design/` — correct subdirectories, kebab-case slugs ≤60 chars.
- **Wrap-up routing compatibility:** PASS. `type: decisions`/`type: design` + `scope: feature` + `feature: install-runtime` frontmatter routes cleanly to `features/install-runtime/{decisions,design}/`.

## Typed findings

### S-1 — Report cites a "6 staged references" set + scenarios/backlogs/discussions that live in IDEATION staging, not preparation staging — path attribution is ambiguous
- **Type:** general · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 75 · **Severity:** Medium
- **Evidence:** preparation.md line 30 lists "`staging/scenarios/worktree-faithful-install-path-default.md`, 2 `staging/backlogs/feature/*` ... 2 `staging/discussions/*`, 6 `staging/references/*`: all present and read." Item 4 (line 103) cites "`staging/scenarios/worktree-faithful-install-path-default.md`". Item 1 (line 82) cites "reference `marketplace-json-schema-and-skills-dir-plugins.md`". Verified on disk: `preparation/staging/` contains ONLY `decisions/` (4 files) + `design/` (1 file). The references, scenarios, backlogs, and discussions all live under `ideation/staging/` (verified: 6 references, 1 scenario, 2 backlogs, 2 discussions there). The report's bare `staging/...` prefix is unqualified and reads as if these are preparation-staged.
- **Why it matters:** A Wrap-up assistant or planner reading "staging/references/..." in the preparation report may look under `preparation/staging/` (per the phase convention that bare `staging/` = current-phase staging), find nothing, and conclude the evidence is missing. The files exist — but under the ideation phase. This is a path-qualification defect, not a missing-artifact defect.
- **Suggested direction:** Qualify every cross-phase pointer as `ideation/staging/...` vs `preparation/staging/...`. (Mirrors the project's recurring path-precision mistakes — `session-dir-placed-outside-worktree`, `subagent-relative-write-paths`.)

### S-2 — No staged scenario/backlog re-homed into preparation staging despite report claiming Item 4 is backed by a scenario
- **Type:** checklist_gap · **Domain:** process · **Disposition:** open · **Confidence:** 50 · **Severity:** Low
- **Evidence:** Item 4 (DD-7) resolution is "Option (a)" backed by `worktree-faithful-install-path-default.md` — which exists only in ideation staging. Preparation produced 2 decision files for Items 1+2 but did NOT stage a decision file for Item 4 (DD-7 Option a) despite the discussion-log marking it "Resolved (leader recommendations accepted)." So DD-7's resolution lives only in the report body + ideation scenario, with no preparation-staged decision artifact for Wrap-up to promote.
- **Why it matters:** At Wrap-up, the DD-7 Option-(a) resolution may not be promoted to feature memory (no staged file carries it), so the next session re-derives it. The other 4 items got staged decisions; DD-7 did not.
- **Suggested direction:** Planning/Wrap-up should confirm DD-7's Option-(a) resolution gets a promotable home (either a preparation decision file or fold it into the layout design doc).

## Must-preserve
- The 5 staged artifacts are complete, well-frontmattered, standalone — preserve their quality bar.
- The layout design doc's ASCII tree is precise and matches verified ground truth — preserve.

## Verdict: REVISE
S-1 is a Medium docs-sync finding at confidence 75 (≥50 → REVISE). Path attribution must be qualified before Planning consumes the cross-phase pointers.

## Low-confidence appendix
- S-2 at 50: depends on whether Wrap-up treats the report body as a promotable source or requires a staged decision file. If the former, S-2 is moot.
