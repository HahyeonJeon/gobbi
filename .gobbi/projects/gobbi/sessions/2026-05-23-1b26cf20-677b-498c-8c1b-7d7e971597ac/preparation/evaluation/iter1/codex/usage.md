## Artifact Summary + Memory reads

What: Usage review asks whether Planning, Execution, and Wrap-up can consume the Preparation outputs without clarifying questions.
Why: The next consumer should not need to rediscover readiness facts or decode unstated policy assumptions.
How: I read the canonical draft, Sub-step A-D findings, all seven staged artifacts, Ideation PASS, project rules, project mistakes, and Preparation evaluation child doc.
V-1: no `.claude/scripts/`, but one historical non-session grep hit exists.
V-2: D-3's three cited mistakes are present and active.
V-3: the five D-4 phase docs exist as symlinks from `.claude/skills/...` into `.gobbi/projects/gobbi/skills/...`.
V-4: seven staging files exist and map to the draft's generated/deferred sections.
Main consumer risk: Planning could encode a false instruction that `.claude/skills` is a normal canonical tree and `.gobbi/projects/gobbi/skills` is only a derived mirror.

## Locked Frame (Stage 1)

Scenario U1: Planning leader can decompose T1/T3 without re-asking the user.
Checklist U1.1: Each gap has a locked outcome.
Checklist U1.2: T1 Planning notes include the three required mistakes.
Checklist U1.3: T1 phase-doc file set is explicit.
Scenario U2: Execution executor receives correct operational instructions.
Checklist U2.1: T1 task briefs can cite the correct `session.template.json` path.
Checklist U2.2: T1 task briefs can cite mirror-discipline accurately.
Checklist U2.3: T3 hook work has enough precedent and deferred skill context.
Scenario U3: Wrap-up assistant can route staging.
Checklist U3.1: Decisions, design, and backlogs are in expected staging subdirectories.
Checklist U3.2: Project/feature scope is clear from frontmatter or path.
Checklist U3.3: No staged file needs project-memory promotion before Planning except absent generated skills.
Scenario U4 (adversarial): A consumer forms the wrong mental model from Preparation.
Checklist U4.1: "Workspace canonical" does not hide symlink-to-project reality.
Checklist U4.2: "Manual mirror-edit" does not instruct duplicate edits against the same linked file.
Checklist U4.3: "No sync mechanism" does not imply no prior mirror-sync context exists.
Accessibility/I18n: not applicable to UI; internal markdown is scannable via headings and tables.

## Per-scenario per-check results

U1.1: Yes. The decisions log covers every D-row and additional mirror/sync items.
U1.2: Yes. D-3 clearly mandates three mistake citations for every T1 task brief.
U1.3: Yes. D-4 names five phase docs and validation command.
U2.1: Yes. Notes for Planning intake correct `.claude/skills/orchestration/templates/session.template.json`.
U2.2: No. Mirror-discipline is not accurate for the current filesystem topology because `.claude/skills` files are symlinks into `.gobbi`.
U2.3: Yes. T3 has `session-start.sh` precedent, and hook-authoring skill deferral explains N=2 timing.
U3.1: Yes. V-4 confirms expected staging subdirectories.
U3.2: Yes. Frontmatter is present on all seven staged files and scopes are readable.
U3.3: Yes. No generated skill exists in this loop, so the Preparation skill's narrow pre-Planning promotion exception is not triggered.
U4.1: No. The policy file would cause a reader to believe `.claude/skills` physically owns the source.
U4.2: No. Manual mirror-edit guidance is ambiguous when workspace files already dereference into project memory targets.
U4.3: Partial. There is no mechanism, but the scan evidence should acknowledge the historical env-var-audit mirror-sync exclusion.

## Typed findings

ID: COD-USAGE-PREP1-001
Type: assumption_risk
Domain: consumer-mental-model
Disposition: open
Confidence: 93
Severity: High
Evidence: A Planning leader following `mirror-propagation-policy-workspace-canonical.md` would brief executors that workspace is canonical and mirror derives, while `stat` shows workspace files are symlink entry points to `.gobbi/projects/gobbi/skills`.
surfaced-by: codex

ID: COD-USAGE-PREP1-002
Type: design_flaw
Domain: task-briefing
Disposition: open
Confidence: 88
Severity: Medium
Evidence: The Preparation draft recommends manual mirror-edit Option a for T1, but does not say whether executors must preserve symlinks, edit symlink targets, or avoid tools that replace symlinks.
surfaced-by: codex

ID: COD-USAGE-PREP1-003
Type: scenario_gap
Domain: consumer-mental-model
Disposition: open
Confidence: 86
Severity: Medium
Evidence: Stage 1 added U4 because the artifact did not include an adversarial "wrong mental model" scenario for mirror policy consumption.
surfaced-by: codex

## Low-confidence appendix

No low-confidence usage findings. The main consumer failure mode is directly evidenced by filesystem symlinks.

VERDICT: REVISE
