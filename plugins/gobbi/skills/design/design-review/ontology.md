# Design Review Ontology

This document gives the domain questions that [Design Review](SKILL.md) loads in Step 1.3. Facets and kinds are
in [Ontology Facets](../../ontology/SKILL.md#facets) and [Ontology Kinds](../../ontology/SKILL.md#kinds). The
test questions are in Ontology Facets.

## Questions

Ask these questions in the Phase 2 critique for each changed component, user-facing object, and named
visual-language term, and record each "no" as a Step 2.2 result. Read the session area file and its Memory copy
under the project's `memory/ontology/`. Write to neither.

| Group | Question |
|---|---|
| Facets | Can each Ontology test question be answered from the visual work and the accepted design, as [Ontology Facets](../../ontology/SKILL.md#facets) states? |
| Names | Does each component and label use the preferred name in the session area file, and does each synonym point to the preferred name? |
| Controls | Does each control trigger one Action type and show that Action type's failure result, as [Ontology Kinds](../../ontology/SKILL.md#kinds) states? |
| States | Does each state visual match one state of its Process, one to one, with no visual for a state the Process lacks? |
| Disabled and hidden | Does each disabled or hidden control, and each hidden piece of data, match a submission criterion of its Action type or a Security policy grant? |
| Session changes | Is each unit that the session area file adds, changes, or removes, compared with its Memory copy, named in the accepted design or the execution handoff, and does the visual work match the session version? |

Example: the Delay flight dialog fails the Controls question when a failed delay closes the dialog without naming
the failed criterion, which is the failure result of Delay flight.
