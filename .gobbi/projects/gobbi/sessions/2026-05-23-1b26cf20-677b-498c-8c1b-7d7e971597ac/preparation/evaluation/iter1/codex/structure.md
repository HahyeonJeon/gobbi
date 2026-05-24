## Artifact Summary + Memory reads

What: Structure review of the Preparation iter1 readiness artifact and the seven staged outputs it produced.
Why: Planning and Wrap-up need predictable sections, paths, slugs, and promotion shapes.
How: I checked the rawdata draft, Sub-step A-D file, staging directory layout, phase child frame, project rule, and project mistakes.
Primary reads: `draft-iter1.md`, `sub-steps-a-d-iter1.md`, `bundle-b-ideation-pass.md`.
Staging reads: two decisions, one design file, and four project backlog files under the absolute Preparation staging path.
Rule read: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`.
Mistake reads: all nine files under `.gobbi/projects/gobbi/mistakes/`, including the README placeholder and eight active mistake records.
Mandatory verification register: V-1 found no `.claude/scripts/` dir and one non-session grep hit; V-2 confirmed the three cited mistakes exist; V-3 confirmed five phase docs exist as symlinks; V-4 confirmed exactly seven staging files.

## Locked Frame (Stage 1)

Scenario S1: Rawdata draft follows the Preparation WORK structure.
Checklist S1.1: Required sections are present and populated.
Checklist S1.2: The draft has no obvious placeholder strings.
Checklist S1.3: Decisions log is tabular and complete enough for downstream audit.
Scenario S2: Staging layout matches Wrap-up routing expectations.
Checklist S2.1: Decision files are under `preparation/staging/decisions/`.
Checklist S2.2: Design files are under `preparation/staging/design/`.
Checklist S2.3: Project backlogs are under `preparation/staging/backlogs/project/`.
Scenario S3: Generated artifact quality.
Checklist S3.1: D-3 decision is a complete decision record, not a note stub.
Checklist S3.2: D-4 design names the five intended phase docs and validation command.
Checklist S3.3: Backlogs include trigger, effort, and origin.
Scenario S4 (adversarial): Path topology assumptions are structurally wrong.
Checklist S4.1: If a staged decision describes a source-of-truth tree, it verifies file/link structure, not just directory names.
Checklist S4.2: The decision distinguishes symlinked workspace files from real workspace files.
Checklist S4.3: Planning can infer exact edit surfaces without guessing whether symlink replacement is allowed.

## Per-scenario per-check results

S1.1: Yes. The draft includes scope reference, readiness summary, per-category readiness, generated/deferred/skipped sections, mirror policy, decisions log, out-of-scope gaps, planning notes, and exit checklist.
S1.2: Yes. No `TODO`, `TBD`, or template placeholder was observed in the rawdata read.
S1.3: Yes with minor wording noise. Fifteen decision rows are present.
S2.1: Yes. V-4 shows both decisions in `staging/decisions/`.
S2.2: Yes. V-4 shows `workflow-phase-doc-set-for-per-iter-cadence.md` in `staging/design/`.
S2.3: Yes. V-4 shows four files in `staging/backlogs/project/`.
S3.1: Yes. D-3 includes context, decision, rationale, alternatives, consequences, and related paths.
S3.2: Yes. D-4 enumerates ideation, preparation, planning, execution, and wrap-up docs and gives a grep validation.
S3.3: Yes. All four backlog files include why deferred and when to pick up.
S4.1: No. The mirror-policy decision verified `.gobbi/projects/gobbi/skills/` real directories, but not `.claude/skills/*` file symlinks.
S4.2: No. `find .claude/skills -maxdepth 2 -type l` shows many symlinked `SKILL.md` and `evaluation.md` files into `.gobbi`.
S4.3: No. A Planning executor using tools that replace symlinks could accidentally break the current link-based topology.

## Typed findings

ID: COD-STRUCT-PREP1-001
Type: design_flaw
Domain: structure
Disposition: open
Confidence: 92
Severity: High
Evidence: `find /playinganalytics/git/gobbi/.claude/skills -maxdepth 2 -type l -ls` shows core skill files symlinked into `.gobbi/projects/gobbi/skills/`; the staged mirror decision never models symlink-preservation risk.
surfaced-by: codex

ID: COD-STRUCT-PREP1-002
Type: checklist_gap
Domain: structure
Disposition: open
Confidence: 88
Severity: Medium
Evidence: Stage 1 added S4.2 and S4.3 because the Preparation frame lacked a check for symlinked file topology before declaring a workspace-canonical edit model.
surfaced-by: codex

ID: COD-STRUCT-PREP1-003
Type: general
Domain: docs-sync
Disposition: open
Confidence: 80
Severity: Low
Evidence: Decisions log row 13 says "5 staging files" but describes D-3, D-4, D-2, D-6, D-7, mirror policy, and sync-mechanism backlog, ending with "= 7 total"; wording should be cleaned.
surfaced-by: codex

## Low-confidence appendix

No low-confidence structural findings. The symlink observation is direct filesystem evidence.

VERDICT: REVISE
