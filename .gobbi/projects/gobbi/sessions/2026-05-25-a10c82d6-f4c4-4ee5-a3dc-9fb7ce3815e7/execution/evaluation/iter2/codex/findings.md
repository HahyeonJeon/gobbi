    23	| 3 | BUILD FROM THE BASE UP, ONE STEP AT A TIME, WITH THE USER IN THE LOOP. |
    24	| 4 | SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER. |
    25	| 5 | NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
    26	| 6 | REFUSE TO TRANSACT IN VAGUENESS. |
    27	| 7 | NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. |
    28	| 8 | EVERY IMPLEMENTATION CHANGE MUST BE REFLECTED IN DOCUMENTATION. |
    29	| 9 | EVERY DESIGN AND IMPLEMENTATION DECISION IS JUDGED FROM THE USER'S POINT OF VIEW. |
    30	| 10 | NO CHANGE WITHOUT A REAL MOTIVATOR. |
    31	| 11 | NO IMPROVEMENT THAT GAMES THE TOOL. |
    32	| 12 | NO TASK STARTS WITHOUT CLEAR WHAT / WHY / HOW. |
    33	| 13 | NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN. |
    34	
    35	---

exec
/usr/bin/zsh -lc 'readlink .claude/skills/memorization/rules.md' in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6
 succeeded in 0ms:
../../../.gobbi/projects/gobbi/skills/memorization/rules.md

exec
/usr/bin/zsh -lc 'rg -n "Twelve principles|Thirteen principles|## Principle 13" .gobbi/projects/gobbi/skills/principles/SKILL.md .claude/CLAUDE.md' in /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6
 succeeded in 0ms:
.gobbi/projects/gobbi/skills/principles/SKILL.md:9:Canonical behavioral discipline for every gobbi agent. Loaded as a skill via the Skill tool. Required at every session start (per the CLAUDE.md mandate) and any time an agent faces a judgment call where the Iron Law alone is not enough — load this skill for the full reasoning and named anti-rationalizations behind each principle. Thirteen principles plus their named anti-rationalizations.
.gobbi/projects/gobbi/skills/principles/SKILL.md:331:## Principle 13 — Spec + CRUD-Think for Documentation Work

codex
## A. Execution

- HIGH-1: CLOSED — `skills/memorization/rules.md:3-5` scopes the standard to “every memory file” and explicitly excludes `skills/`, `agents/`, and `sessions/`.
- HIGH-2: CLOSED — `skills/memorization/rules.md:120-125` restores the `features/` own-tier rule, including README `scope: feature` + `feature: {own-slug}`.
- MEDIUM: CLOSED — `skills/memorization/rules.md:79-81` keeps the 12-value enum and explicitly carves out `changelogs`, `discussions`, `scenarios`, `checklists` as the only feature-subdir exception values.
- LOW: CLOSED — `skills/memorization/rules.md:79` says “12 promotable content types” and treats `archive` as lifecycle destination.
- LOW: CLOSED — `skills/memorization/memory-map.md:5` has the one-line back-reference to `rules.md`.
- Design faithfulness: CLOSED — `rules.md:21-38` matches design §4 naming; `rules.md:63-110` matches design §5 frontmatter/status/staging-strip model.

NEW defect:
- MEDIUM — `skills/memorization/memory-map.md:114` still documents flat `archive/{slug}.md`, while `rules.md:79` and design §5 use typed archive paths such as `archive/decisions/`.

## B. Planning

- H1: CLOSED — W0-T1/T2/T9 are marked DONE/SKIP at `planning/rawdata/draft-iter1.md:112-118`, `133-138`, `213-218`; duplicate `## Principle 13` guard is present at `127` and `561`.
- H2: CLOSED — W2-T3b splits env-var-audit before W3-T1 at `311-320`; final gate covers all listed blocklist patterns at `576-583`.
- H3: CLOSED — CWD convention is declared at `22-24` and repeated for gate suites at `557`.
- CN-01: CLOSED — W2-T3 now excludes `ideation-decisions.md` and only owns the 5 orch decisions + 7 `item-X` design files at `299-305`.
- ST-02: CLOSED — symlink checks are scoped to `find ... -type l` at `571` and `598`.
- ST-03: CLOSED — W3-T3 recovery manifest is required at `385-395`.
- US-01: CLOSED — W3-T1 enumerates env-var-audit destination intent at `351-361`.
- US-02/03: CLOSED — bounded sweep is at `260-266`; locked design doc is required for W3 tasks at `546-547`.
- RK-01: CLOSED — tmp pre-inspection is required at `428-434`.
- CN-02: CLOSED — Bundle B count is reconciled as 100 cluster md + README at `383-392` and `414`.
- AE-01: CLOSED — `files-out` semantics are normalized at `26`.

Added task graph:
- CLOSED — W0-T1b, W2-T3b, and W2-T4 do not introduce a dependency cycle; dependency table `479-511` preserves forward ordering.

NEW defect:
- MEDIUM — W0-T1b is stale: the plan says the “Twelve→Thirteen” tweak was not in `90c46fd` (`draft-iter1.md:39`, `121-127`), but the live file already says “Thirteen principles” at `skills/principles/SKILL.md:9`.

## C. Preparation

- 7-section template: CLOSED — headings appear in the required order at `preparation/rawdata/readiness.md:5`, `13`, `21`, `53`, `61`, `70`, `80`.
- Decisions log records 8 locks + RATIFY outcomes: CLOSED — L1-L8 are logged at `86-95`; RATIFY-1..8 at `97-108`.
- Stale rules.md absent/to-be-created line: CLOSED — `readiness.md:41-42` says `memorization/rules.md` was created in commit `90c46fd` and is no longer a gap.
- Follow-ups staged: NOT-CLOSED — both files exist, but born-compliance is incomplete. `skills-agents-canonical-location-contradiction.md` has a 46-character slug, exceeding the `≤~35 chars` rule in `rules.md:24`; both staged files use `scope: project` with `feature: project-memory` at lines `5-6`, conflicting with the base-schema expectation in `rules.md:71` for project-scope records.

NEW defects:
- LOW — `readiness.md:63` says no new staging artifacts were generated, then `65-68` lists two staged follow-up files.

A-VERDICT: PASS
B-VERDICT: PASS
C-VERDICT: REVISE
OVERALL-VERDICT: REVISE
tokens used
143,754
## A. Execution

- HIGH-1: CLOSED — `skills/memorization/rules.md:3-5` scopes the standard to “every memory file” and explicitly excludes `skills/`, `agents/`, and `sessions/`.
- HIGH-2: CLOSED — `skills/memorization/rules.md:120-125` restores the `features/` own-tier rule, including README `scope: feature` + `feature: {own-slug}`.
- MEDIUM: CLOSED — `skills/memorization/rules.md:79-81` keeps the 12-value enum and explicitly carves out `changelogs`, `discussions`, `scenarios`, `checklists` as the only feature-subdir exception values.
- LOW: CLOSED — `skills/memorization/rules.md:79` says “12 promotable content types” and treats `archive` as lifecycle destination.
- LOW: CLOSED — `skills/memorization/memory-map.md:5` has the one-line back-reference to `rules.md`.
- Design faithfulness: CLOSED — `rules.md:21-38` matches design §4 naming; `rules.md:63-110` matches design §5 frontmatter/status/staging-strip model.

NEW defect:
- MEDIUM — `skills/memorization/memory-map.md:114` still documents flat `archive/{slug}.md`, while `rules.md:79` and design §5 use typed archive paths such as `archive/decisions/`.

## B. Planning

- H1: CLOSED — W0-T1/T2/T9 are marked DONE/SKIP at `planning/rawdata/draft-iter1.md:112-118`, `133-138`, `213-218`; duplicate `## Principle 13` guard is present at `127` and `561`.
- H2: CLOSED — W2-T3b splits env-var-audit before W3-T1 at `311-320`; final gate covers all listed blocklist patterns at `576-583`.
- H3: CLOSED — CWD convention is declared at `22-24` and repeated for gate suites at `557`.
- CN-01: CLOSED — W2-T3 now excludes `ideation-decisions.md` and only owns the 5 orch decisions + 7 `item-X` design files at `299-305`.
- ST-02: CLOSED — symlink checks are scoped to `find ... -type l` at `571` and `598`.
- ST-03: CLOSED — W3-T3 recovery manifest is required at `385-395`.
- US-01: CLOSED — W3-T1 enumerates env-var-audit destination intent at `351-361`.
- US-02/03: CLOSED — bounded sweep is at `260-266`; locked design doc is required for W3 tasks at `546-547`.
- RK-01: CLOSED — tmp pre-inspection is required at `428-434`.
- CN-02: CLOSED — Bundle B count is reconciled as 100 cluster md + README at `383-392` and `414`.
- AE-01: CLOSED — `files-out` semantics are normalized at `26`.

Added task graph:
- CLOSED — W0-T1b, W2-T3b, and W2-T4 do not introduce a dependency cycle; dependency table `479-511` preserves forward ordering.

NEW defect:
- MEDIUM — W0-T1b is stale: the plan says the “Twelve→Thirteen” tweak was not in `90c46fd` (`draft-iter1.md:39`, `121-127`), but the live file already says “Thirteen principles” at `skills/principles/SKILL.md:9`.

## C. Preparation

- 7-section template: CLOSED — headings appear in the required order at `preparation/rawdata/readiness.md:5`, `13`, `21`, `53`, `61`, `70`, `80`.
- Decisions log records 8 locks + RATIFY outcomes: CLOSED — L1-L8 are logged at `86-95`; RATIFY-1..8 at `97-108`.
- Stale rules.md absent/to-be-created line: CLOSED — `readiness.md:41-42` says `memorization/rules.md` was created in commit `90c46fd` and is no longer a gap.
- Follow-ups staged: NOT-CLOSED — both files exist, but born-compliance is incomplete. `skills-agents-canonical-location-contradiction.md` has a 46-character slug, exceeding the `≤~35 chars` rule in `rules.md:24`; both staged files use `scope: project` with `feature: project-memory` at lines `5-6`, conflicting with the base-schema expectation in `rules.md:71` for project-scope records.

NEW defects:
- LOW — `readiness.md:63` says no new staging artifacts were generated, then `65-68` lists two staged follow-up files.

A-VERDICT: PASS
B-VERDICT: PASS
C-VERDICT: REVISE
OVERALL-VERDICT: REVISE
