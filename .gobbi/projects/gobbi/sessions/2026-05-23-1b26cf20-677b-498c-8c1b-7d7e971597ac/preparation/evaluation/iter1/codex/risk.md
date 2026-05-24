## Artifact Summary + Memory reads

What: Risk review examines blast radius if Preparation's readiness assessment is wrong.
Why: The next loop may encode task briefs from these artifacts, so incorrect premises can propagate into worktree/session-memory rules.
How: I read the canonical draft, Sub-step findings, staged files, Ideation PASS, project mistakes, project rule, and Preparation evaluation child doc.
Mandatory checks: V-1 found no `.claude/scripts/` but one historical mirror-sync text hit; V-2 confirmed three mistake files; V-3 confirmed five phase docs as symlinks; V-4 confirmed seven staged files.
Additional check: `find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/features/session-foundations-bundle-b` returned ENOENT, matching the draft's "absent expected" claim.
Risk posture: no evidence of unauthorized direct feature-memory writes during Preparation; the main risk is false source-of-truth guidance for later edits.

## Locked Frame (Stage 1)

Scenario R1: Wrap-up sole-writer contract is preserved.
Checklist R1.1: Preparation outputs stay under session staging.
Checklist R1.2: Feature directory is not pre-created during Preparation.
Checklist R1.3: No generated skill is directly promoted before a PASS gate.
Scenario R2: RE-IDEATE triggers are assessed.
Checklist R2.1: Every gap is checked for design-premise failure.
Checklist R2.2: `0 re-Ideate` is supported by Ideation and gap evidence.
Checklist R2.3: Any unworkable premise would be routed upstream.
Scenario R3: Deferred risks are not lost.
Checklist R3.1: Hook mistakes watchlist has concrete triggers.
Checklist R3.2: Session-lifecycle design doc has pickup criteria.
Checklist R3.3: Workspace-to-mirror sync backlog states interim discipline.
Scenario R4 (adversarial): A false mirror model causes unsafe edits or hidden drift.
Checklist R4.1: The artifact warns about symlink replacement risks.
Checklist R4.2: The artifact distinguishes policy from current implementation.
Checklist R4.3: The artifact does not tell executors to rely on a nonexistent auto-sync.
Privacy/data retention: not applicable; no PII observed.
License/IP: not applicable; no external content copied into generated skills.
Cost/budget: not applicable except downstream rework risk.

## Per-scenario per-check results

R1.1: Yes. V-4 shows all new artifacts under session staging.
R1.2: Yes. The feature dir check returned ENOENT, matching the draft's expected absence.
R1.3: Yes. No `preparation/staging/skills/` file exists, so no generated-skill promotion path is active.
R2.1: Mostly yes. The base D-1 through D-9 gaps do not reveal unworkable Ideation premises.
R2.2: Yes for T1/T3 design. Worktree-first and hook/reconstructor remain workable.
R2.3: Partial. The mirror-policy contradiction is a Preparation REVISE trigger, not a RE-IDEATE trigger, but it is not routed in the artifact.
R3.1: Yes. Hooks-domain watchlist names N>=2 mistakes or third hook proposal.
R3.2: Yes. Lifecycle design doc waits until T1 ships and N=2 sessions exercise the pattern.
R3.3: Partial. The sync backlog includes interim discipline, but its current-state description is wrong for symlinked `.claude/skills` files.
R4.1: No. Symlink replacement is not discussed.
R4.2: No. Current implementation is described as "frozen historical copy" even though workspace files point to project files.
R4.3: Partial. It says no auto-sync mechanism exists, but the mirror policy still says "mirror auto-syncs" without an implementation.

## Typed findings

ID: COD-RISK-PREP1-001
Type: assumption_risk
Domain: write-safety
Disposition: open
Confidence: 92
Severity: High
Evidence: Since `.claude/skills/*` files are symlinks into `.gobbi/projects/gobbi/skills`, an executor may unintentionally write project-memory targets or replace symlinks while believing they are editing a standalone workspace-canonical tree.
surfaced-by: codex

ID: COD-RISK-PREP1-002
Type: design_flaw
Domain: mirror-policy
Disposition: open
Confidence: 90
Severity: High
Evidence: The policy says project mirror auto-syncs, but V-1 found no mechanism and V-3/find show symlink topology instead; leaving this to Planning risks hidden drift or symlink breakage.
surfaced-by: codex

ID: COD-RISK-PREP1-003
Type: checklist_gap
Domain: risk
Disposition: open
Confidence: 84
Severity: Medium
Evidence: Stage 1 added R4.1-R4.3 because the Preparation risk frame did not ask "what breaks if the mirror policy is wrong?"
surfaced-by: codex

ID: COD-RISK-PREP1-004
Type: general
Domain: re-ideate
Disposition: closed
Confidence: 82
Severity: Low
Evidence: No T1/T3 design premise appears unworkable; the correct route for the found mirror issue is Preparation REVISE, not RE-IDEATE.
surfaced-by: codex

## Low-confidence appendix

No low-confidence risk findings. The write-safety concern is based on direct symlink evidence.

VERDICT: REVISE
