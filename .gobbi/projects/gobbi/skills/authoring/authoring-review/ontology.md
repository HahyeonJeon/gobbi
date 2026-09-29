# Authoring Review Ontology

This document gives the domain questions that [Authoring Review](SKILL.md) loads in Step 1.3. The writing terms
for facets and kinds are in [Authoring Ideation ontology](../authoring-ideation/ontology.md), and the test
questions are in [Ontology Facets](../../ontology/SKILL.md#facets).

## Questions

Ask these questions in the Phase 2 critique for each changed document, section, and defined term, and record
each "no" as a Step 2.2 result. Read the session area file and its Memory copy under the project's
`memory/ontology/`. Write to neither.

| Group | Question |
|---|---|
| Facets | Can each Ontology test question be answered from the writing and the accepted design, in the [writing terms](../authoring-ideation/ontology.md#facets-in-writing-terms)? |
| Names | Does each name match the preferred name in the session area file, and does each synonym point to the preferred name? |
| Facts | Is each fact stated once, in the document that owns it, with other documents linking to it? |
| Kinds | Does each task match its Action type's submission criteria, operations, side effects, and failure result, and each state list its Process, as [Kinds in Writing](../authoring-ideation/ontology.md#kinds-in-writing) states? |
| Cross-references | Does each cross-reference say why it points there? |
| Session changes | Is each unit that the session area file adds, changes, or removes, compared with its Memory copy, named in the accepted design or the execution handoff, and does the writing match the session version? |

Example: "Delay a flight" fails the Kinds question when its troubleshooting omits that a departed flight stays
unchanged, which is the failure result of Delay flight.
