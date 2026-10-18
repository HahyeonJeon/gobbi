# Recursive exploration and the six-kind ontology

> Tracked Memory work account at `memory/reports/note/`. Omit Git action states and recovery commands.

**Completed at:** 2026-10-18T05:01:11Z

## Result

Ontology is six kinds, and Recursive Exploration writes that record by asking what the subject is. Review of
`9515b9f2` passed for docs and code. No session ontology area was promoted.

## Context

| Item | Detail |
|---|---|
| Purpose | Record the accepted six-kind ontology and Recursive Exploration so current Memory matches that work. |
| Requirements | The Ontology design states the six kinds and the absence of templates, examples, and a checker. Closure adds one learning, one note, and one history. |
| Scope | The Ontology skill, Recursive Exploration, and the Memory homes those decisions shape. |
| Exclusions | No session ontology file was promoted. The Web UI test files under `topic-06-web-ui-test/` stay unpromoted. |
| Accepted decisions | [Ontology skill](../../design/feature/ontology-skill.md). |

## Work

| Item | Detail | Evidence |
|---|---|---|
| Six-kind ontology | Ontology is only ObjectDefinition, FunctionDefinition, and LinkDefinition, plus ObjectInstance, FunctionInstance, and LinkInstance. Shared fields are name, Markdown context, Markdown definition, and metadata id, kind, and version. ObjectDefinition has properties. FunctionDefinition has inputInterface, action, and outputInterface. LinkDefinition has from, relation, and to. An Instance has definedBy. A LinkInstance also has from and to. A file is one `entities` list. There is no template, no example, and no `ontology.py`. | `3e9a982f` |
| Recursive Exploration | The operation asks what the subject is, studies the materials, and writes the ontology only in Decomposition and Ontology definition. Review revises that file or asks the next question. There is no test-before-decompose phase and no handoff phase. | `9515b9f2` |
| Web UI test | Two subagents and Codex agreed that a Web UI is the interface a user agent renders from author-supplied web content. They stopped at 39, 93, and 274 entities. The stop does not fix the grain. | Accepted at closure. |
| Review | Review of head `9515b9f2` passed for docs and code, Grok and Codex. No in-contract problem. The branch was not pushed. | `9515b9f2` |

## Memory

| Action | Owner | Change and reason | Evidence |
|---|---|---|---|
| Updated | `design/feature/` | Replaced the Ontology skill design with the six-kind model and the absence of templates, examples, and a checker. | [Ontology skill](../../design/feature/ontology-skill.md) |
| Removed | `backlogs/` | Deleted the ontology backlog. Every heading existed only for the removed checker, the templates, or the old wording. | [Backlog index](../../backlogs/README.md) |
| Created | `learnings/authoring/` | Recorded that the exploration stop does not bound grain. The caller names a last question when the goal is a definition rather than a full catalog. | [Authoring mistakes](../../learnings/authoring/mistakes.md) |
| Updated | Memory skill | The ontology directory names Object, Function, and Link, each as a Definition and an Instance. The closure and split links no longer use anchors the Ontology skill does not have. | [Memory](../../../skills/memory/SKILL.md) |

## Remaining limits

The exploration stop does not fix grain. The Web UI test stopped at 39, 93, and 274 entities. No session
ontology area was promoted. The branch was not pushed.
