---
name: conformance-executor-pre-executed-prose-wave-reshape
description: A mechanical-conformance executor (T5) reshaped backlog body sections to the §4.2 per-type section contract — prose-wave work — during the conformance pass. Conformance prompts must explicitly forbid §4.2 body-section restructuring; section reshaping belongs to the prose wave only.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [process, conformance, scope-creep, prose-wave, executor]
priority: medium
domain: process
supersedes: null
superseded_by: null
---

# Conformance executor pre-executed prose-wave reshape of body sections

## What went wrong

During T5 (conform features/guardrails), the mechanical-conformance executor reshaped backlog body sections to match the §4.2 per-type section contract: it renamed and reordered `##` headings inside backlog files to fit the prescribed structure. This was prose-wave work (P-tasks), not conformance-wave work. The conformance pass scope is: frontmatter S-set stripping, concept-first title normalization, and type-aware KEEP key preservation. Body section restructuring — renaming/reordering `##` headings to match the §4.2 per-type contract — is explicitly deferred to the prose wave.

The T5 evaluators caught the scope overstep and returned REVISE. The executor had conflated "apply §4 standard" with "apply all of §4," when the conformance pass only covers §4.4/§4.5, not §4.2.

## Why it went wrong

The conformance prompt said "conform to the dev-doc standard §4" without explicitly carving out the body-section contract (§4.2) as out-of-scope for the conformance pass. The executor, seeing a standard with multiple sub-sections, applied what it could — including the body-section contract. "De-crypt + conform" naturally creeps into prose-restructuring when the prompt does not bound the scope to frontmatter + inline coords.

## How to recognize this situation

- A conformance-wave commit changes body SECTION structure: `##` headings are renamed or reordered, not just frontmatter keys removed/preserved.
- The commit diff shows new or differently named `##` sections inside files where the prior structure was different — beyond just title-line edits.
- Evaluators flag "scope overstep" or "prose-wave work done in conformance pass."

## Corrected approach

Conformance prompts must explicitly state in the scope boundary:

> "DO NOT reshape body sections. The conformance pass touches: (1) frontmatter S-set stripping, (2) concept-first title normalization, (3) type-aware KEEP key preservation. The §4.2 per-type section contract (body section structure/headings) is prose-wave scope — do not rename, reorder, or add `##` headings during conformance."

The prose wave (P1–P7b tasks) is the sole executor of §4.2 body-section restructuring. Any conformance commit that touches `##` heading names or order inside file bodies is out-of-scope and must be reverted.
