# Usage (iter10, claude — ABSOLUTE-FINAL)

## Artifact Summary + Memory reads (Stage 0)

iter10 closes a Usage gap for the **assistant role agent** loading memorization/SKILL.md and the **manager** loading orchestration/workflow/memorization.md: both surfaces now explicitly include `preparation` in the FORBIDDEN-from set, so a Preparation-loop assistant cannot misread the boundary contract as "preparation is excluded — maybe we can write to project memory". The patch makes the constraint unambiguous for all four non-Wrap-up loops.

**Memory reads**: iter9 claude/{usage,overall}.md (inheritance) · the 5 modified sites · cross-checked against the manager validator gate 5 logic at orchestration/workflow/memorization.md:187-198.

## Locked Frame (Stage 1)

Inherited from iter9 usage.md.

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| Assistant loading memorization/SKILL.md sees `preparation` in the FORBIDDEN set | YES | memorization/SKILL.md:45/295/296 |
| Manager validator (gate 5) sees `preparation` in the loop-list it gates on | YES | orchestration/workflow/memorization.md:187/189 |
| Preparation-loop agent cannot misread boundary as permissive | YES | Three constraint surfaces all enumerate preparation |
| No "and related" / "etc." escape hatches | YES | All 5 sites are explicit 4-loop enumerations |

## Typed findings

None new at iter10.

## Per-perspective verdict

**PASS — ABSOLUTE-FINAL**. The downstream consumers (assistant role in any of 4 non-Wrap-up loops, plus the manager's gate 5) all see the unambiguous 4-loop constraint.

## Low-confidence appendix

None.
