## Findings

**Type:** design_flaw  
**Severity:** High  
**Confidence:** 100%  
**Evidence:** The locked D4 notes contract requires `What-happened/What-shipped/Deferred/Decisions-to-respect` for notes (`.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/design-options.md:24`). The new §4.2 instead defines notes as `## What happened` / `## What shipped` / `## What got stuck` / `## What shifted` / `## Next session` (`.gobbi/projects/gobbi/skills/memorization/rules.md:180`). That is not a faithful encoding of the locked design, so downstream note retrofits would verify against a different section checklist than the one approved in Ideation.  
**Fix:** Change §4.2's `notes` row to the locked D4 headings, or explicitly revise the locked design through the workflow before using the template-derived headings as the foundation for downstream retrofit tasks.

VERDICT: REVISE
