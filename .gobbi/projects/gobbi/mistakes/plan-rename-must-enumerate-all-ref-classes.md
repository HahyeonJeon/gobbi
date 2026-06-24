---
name: plan-rename-must-enumerate-all-ref-classes
description: A rename plan that enumerates only path-refs and prose misses skill-name references, wrapper descriptions, inventory rows, and pipeline labels, leaving stale refs the plan never scoped.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [process, planning, rename, vocabulary-sweep]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Rename planning must enumerate all reference classes, not just paths and prose

## What happened

The planning decomposition for the memorization → {memory, record} rename scoped the sweep (task 07) to cover: path references (`memorization/SKILL.md` etc.), sub-phase/storage prose (`session memory`, `project memory`, `MEMORIZATION sub-phase`), and Glossary / delegation hard-gate entries. The plan did not enumerate skill-NAME references (a skill loaded by name in `required-skills` or `Load Directives`), agent-wrapper capability descriptions, plugin inventory rows, or pipeline-label entries.

Batch-2 evaluation surfaced 5 stale references the plan had never scoped:
- `assistant.toml` — a skill-name reference loading `memorization` by name.
- `session-end.sh` — a capability description naming `memorization`.
- `claude-plugin` inventory entry — listed `memorization` as a capability.
- Gobbi value-feature row — named `memorization` as a delivered value-feature.
- Pipeline-label entry — named the sub-phase using the old vocabulary.

These required task 07b as a remediation sweep.

## Why it happens

When planning a rename, the planner's natural reference classes are: the file's path in link text, and the concept's name in running prose. Less obvious reference classes — skill-names in `required-skills` arrays, capability descriptions in wrapper agent prompts, inventory/list rows in plugin manifests, and pipeline-label strings in hook scripts — carry the old name without appearing as a path reference or a long-form prose sentence. A grep that searches for the old path or a prose phrase misses these because they use the name in a structured-data context (YAML array, JSON field, short label).

The mistaken assumption: the co-touch enumeration for a rename is complete once it covers (a) path references in link text and (b) concept-name occurrences in prose paragraphs.

## Correct approach

When planning a rename, explicitly enumerate ALL reference classes before writing the task scope:

1. **Path refs** — the old path in `[text](path)` and relative-import forms.
2. **Prose refs** — the concept name in running text (paragraphs, headings, table cells).
3. **Skill-name refs** — `required-skills`, `Load Directives`, `Skill()` permission arrays — any structured field that names the skill by its directory/file name.
4. **Inventory/list refs** — plugin manifests, marketplace.json, capability lists, feature-value tables.
5. **Wrapper-description refs** — agent prompt blocks that describe capabilities by name.
6. **Pipeline-label refs** — hook scripts, sub-phase names in YAML/JSON event payloads, comment strings.

For each class, add a corresponding gate clause to the verify step so the check is exhaustive by design. The `check-residual-vocab.sh` guard built during this session implements a multi-class vocabulary scan that catches all six classes.

## How to detect

The trigger: a planning task's `what` and `verifies` mention only path-refs and prose (`grep -rIl 'old-name'`) without explicit mention of structured-data contexts (YAML arrays, JSON fields, wrapper prompts, hook comment strings).

Correct planning: the task scope lists all six reference classes; the verify step includes a structured-data scan (e.g., `grep -rIl 'old-name' --include='*.json' --include='*.yaml' --include='*.sh'` across all surfaces) in addition to the markdown prose grep.

## Related

- Task 07b (the unscoped-class remediation sweep): commit `318e72d3`
- Guard script: `.gobbi/projects/gobbi/skills/orchestration/scripts/check-residual-vocab.sh`
