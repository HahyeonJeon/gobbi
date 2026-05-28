# Codex iter2 remediation re-evaluation (dual-system; you are the GPT-Codex half)

You are an independent adversarial evaluator. A Claude evaluator reviews the same artifacts in parallel — divergence is the signal. Do NOT propose fixes; find whether the remediations are correct and complete. Verify everything against the files yourself (read them in full). This is READ-ONLY.

All paths are relative to this repo root (your --cd): `/playinganalytics/git/gobbi`. The live branch state is in the worktree:
WT = `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`

Three remediated artifacts were produced to close iter1 dual-system REVISE findings. For EACH, confirm every listed iter1 finding is actually CLOSED in the file, and that the fix introduced NO new contradiction/regression.

## A. Execution — `$WT/.gobbi/projects/gobbi/skills/memorization/rules.md` (+ `memory-map.md`)
iter1 findings to verify closed:
- HIGH-1: applicability was overscoped ("every file under .gobbi/projects/{name}/"); must now be scoped to "every memory file" and EXCLUDE non-memory surfaces (skills/, agents/, sessions/).
- HIGH-2: the `features/` own-tier scope rule was dropped from the structure-rules section; must now be present (features/ is its own tier; README carries scope: feature + feature: own-slug).
- MEDIUM: `type` enum (12 values) vs the 4 feature-subdir types (changelogs/discussions/scenarios/checklists) setting type to their own name — must now have an EXPLICIT exception model that resolves the contradiction.
- LOW: "13 content types" wording → must be "12 promotable content types; archive is a lifecycle destination, not a type enum value".
- LOW: `memory-map.md` must now contain a one-line back-reference to rules.md.
Also: is rules.md still internally consistent and faithful to the design at `$WT/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` (§4 naming, §5 frontmatter)?

## B. Planning — `$WT/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md`
iter1 findings to verify closed:
- H1: W0-T1, W0-T2, W0-T9 must be marked DONE/SKIP (shipped in commit 90c46fd) so re-execution can't duplicate Principle 13 / overwrite rules.md; a duplicate-"## Principle 13" grep guard must be added.
- H2: env-var-audit's blocklist-violating files (ideation-decisions.md, planning-decisions.md, preparation-decisions.md, t1-decisions.md, ideation-discussion.md, ideation-references.md) must be split/renamed BEFORE re-homing (a new task, e.g. W2-T3b); the W5 Final Gate must be expanded to catch ALL blocklist patterns.
- H3: verify/gate commands must have a declared CWD convention (or worktree-absolute paths).
- Mediums: CN-01 (W2-T3 file enumeration corrected), ST-02 (symlink verify loops scoped to `-type l`), ST-03 (W3-T3 recovery manifest), US-01/02/03, RK-01 (tmp pre-inspection). Lows: CN-02 (count 100+1=101), AE-01 (files-out semantics).
Check the ADDED tasks (W0-T1b, W2-T3b, W2-T4) introduce NO dependency cycle and no contradiction with the preserved dependency table / wave ordering.

## C. Preparation — `$WT/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/preparation/rawdata/readiness.md` (+ `preparation/staging/decisions/`)
iter1 findings to verify closed:
- Artifact must now follow the 7-section Preparation template (Scope reference / Readiness summary / Design + memory readiness / Execution skills readiness / Generated this loop / Out of scope gaps / Decisions log). The Decisions log must record the 8 locks + RATIFY outcomes.
- The stale "rules.md absent → to be CREATED" line must be corrected (rules.md now exists, committed 90c46fd).
- Two follow-ups (FLAG-2 missing claude skill; L8 skills/agents location) must be staged in `preparation/staging/decisions/` and be born-compliant with the naming + frontmatter standard in `$WT/.gobbi/projects/gobbi/skills/memorization/rules.md`.

## Output
Print a structured report to STDOUT (the manager captures it). Structure: section A, B, C — for each, list each iter1 finding with CLOSED / NOT-CLOSED / REGRESSION + one line of evidence (path:line or quote). Then any NEW defect you find. End with three lines:
A-VERDICT: PASS|REVISE|FAIL
B-VERDICT: PASS|REVISE|FAIL
C-VERDICT: PASS|REVISE|FAIL
OVERALL-VERDICT: PASS|REVISE|FAIL
(PASS = all iter1 High/Critical closed + no new High/Critical; REVISE = a finding not closed or a new High; FAIL = a new Critical.)
