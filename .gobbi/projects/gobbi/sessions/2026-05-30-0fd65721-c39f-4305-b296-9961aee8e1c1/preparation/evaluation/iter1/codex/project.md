# Project Perspective

## COD-PROJ-001 - READY verdict depends on a workspace skill that does not exist

Type: assumption_risk  
Severity: High  
Confidence: 100  
Evidence: `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:64-73` claims `claude` (`.claude/` doc-authoring standard) is present at canonical `skills/claude/SKILL.md` and concludes "Execution skills gaps: NONE." Verified fact: `test -d .gobbi/projects/gobbi/skills/claude` and `test -d .agents/skills/claude` both returned absent; the canonical skill list has 18 dirs and no `claude`. The repo-local `gobbi` skill also marks the `claude` doc-authoring standard as absent (`[FLAG-2] currently absent`).  
Why-it-matters: The Preparation artifact's job is workspace-skill readiness. A required executor skill marked READY but absent makes the READY verdict unsound. Planning may assign Execution assuming an instruction surface exists when it does not, especially for the `claude-plugin` skill deliverable that is documentation-heavy.  
Suggested-direction: Correct the readiness row before Planning. Either classify the missing `claude` standard as an actual generate-now/defer gap, or state explicitly that Execution must proceed without it and cite the concrete replacement sources/conventions the executor should use.

## COD-PROJ-002 - "Generated this loop: None" contradicts the actual preparation staging output

Type: checklist_gap  
Severity: High  
Confidence: 100  
Evidence: `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/preparation/rawdata/preparation.md:142-144` says "None" and "without new artifacts." Verified fact: `preparation/staging/` contains five files: four decisions and one design file (`bounded-package-root-and-marketplace-source-resolved.md`, `drift-resync-trigger-and-mechanical-gate-resolved.md`, `hook-double-registration-steady-state-dev-vs-installed-split.md`, `permissions-disposition-keep-project-local-verify-empirically.md`, `gobbi-plugin-component-inventory-and-layout.md`).  
Why-it-matters: The Preparation evaluation frame requires "Generated this loop" to match the staging directory. This is not just wording: Wrap-up and Planning depend on knowing which session-scoped artifacts exist and should be consumed or promoted. A READY report that omits all generated staging artifacts has incomplete readiness accounting.  
Suggested-direction: Update the Generated section to list the five staging artifacts and classify them by destination/purpose, or explicitly explain if they were created after the rawdata draft and then regenerate the readiness report so the audit trail is coherent.
