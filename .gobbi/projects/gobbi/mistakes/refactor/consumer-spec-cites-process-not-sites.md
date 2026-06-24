---
name: consumer-spec-cites-process-not-sites
description: Design consumer-change specs cited the sweep discipline in prose but under-enumerated sites and mis-cited a consumer line, repeating known namespace-sweep mistakes within the design doc itself.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [rename-sweep, docs-sync, verification]
keywords: [consumer-spec, enumeration, line-ref, namespace-sweep, ideation-design]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [plan-rename-must-enumerate-all-ref-classes, namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep]
---

# Consumer-change spec cites the sweep discipline but does not apply it — misses sites and mis-cites a line

## What happened

During Ideation for the per-type vocabulary redesign, the consumer-change spec (§5 of `draft-iter2.md`) cited the project's own `plan-rename-must-enumerate-all-ref-classes` and `namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep` mistakes by name in a Decisions Log annotation. It declared the sweep was "vocabulary-sweep — enumerate write-vs-ref ... grep all path-forms." Despite this, §5 itself did two wrong things:

1. **Under-enumerated consumer sites.** The draft listed consumer FILES (validator, wrap-up, rules.md) but did not enumerate ALL sites within those files. `rules.md §2.2` was omitted entirely (later caught as REVISE finding CONS-1), and `validate-frontmatter.sh`'s `required_ext_for` function was not enumerated as a site.

2. **Mis-cited a line.** The `_shared` no-match terminal in `wrap-up/SKILL.md` was cited at line 172 in the draft. Line 172 is the routing-table-pointer step 4d ("mentions §1.5 selection rule"). The actual `_shared` no-match terminal is at **line 312** in the "Area resolution on promotion" block 306-314. The evaluator (Claude REVISE finding STR-1) caught this discrepancy by re-grepping the live file.

Both systems (Claude + Codex) returned REVISE on iter1 with strong convergence on this root cause. The data model (§8 JSON) was sound; the defect lived entirely in §5.

## User feedback

The dual-system REVISE verdict (iter1) was the signal. Both evaluators independently identified that §5 cited the sweep discipline but did not apply it to the spec itself.

## Why it happens

The design doc's Decisions Log cited the sweep mistakes as meta-awareness ("we know this mistake, Planning will do the exhaustive sweep"). This awareness did not translate into actually applying the discipline to §5 AT AUTHORING TIME. The author treated §5 as "directional" — naming consumer files but deferring all line-level enumeration to Planning. The trap: once a spec names a consumer FILE without enumerating its sites, a wrong line ref or a missing section can slip in because there is nothing to cross-check against.

The mis-cited line 172 is a concrete example: the author had the file structure in mind but did not re-grep to verify the terminal's actual location. The citation felt "close enough" without verification.

## Correct approach

When authoring a consumer-change spec that covers a vocabulary sweep:

1. **Re-grep every retired form to get the actual line refs.** Do not rely on memory or "the file probably has it around line X." The spec's cited line references are checkable claims; make them correct at authoring time.
2. **Enumerate ALL sites within each consumer file, not just the file name.** If a file has 3 places to update, the spec must list all 3. An enumeration that lists the file but not the sections within it is a partial enumeration.
3. **If exhaustive enumeration is deferred to Planning, say so explicitly — and write the Planning-sweep contract in the spec.** It is acceptable to defer full enumeration to Planning, but the deferral must be an explicit contract: "These are the grep-verified KNOWN sites. Planning MUST perform the exhaustive enumeration." The spec's Decisions Log annotation is not the place to record this — the §5 body is.

## How to detect

- A design doc that names consumer files in a "consumer-change spec" section without listing the specific lines, functions, or sections within each file.
- A design doc that says "see `plan-rename-must-enumerate-all-ref-classes`" or similar in prose without then applying the discipline to its own site list.
- A line number in a consumer-change spec that was not verified by re-grepping the live file before authoring the spec.
- §5 or equivalent that lists files and "Change" columns but whose line refs are round numbers or estimates (e.g., "around line 300").

## Related

- [[plan-rename-must-enumerate-all-ref-classes]] — the recorded project mistake that this episode repeated inside a design doc
- [[namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep]] — the complementary sweep discipline that was cited but not applied
