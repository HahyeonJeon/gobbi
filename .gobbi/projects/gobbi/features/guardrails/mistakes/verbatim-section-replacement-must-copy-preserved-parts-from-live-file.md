---
name: verbatim-section-replacement-must-copy-preserved-parts-from-live-file
description: "When a drop-in replaces an entire section but only part of it changes, the unchanged subsections must be copied verbatim from the current on-disk file — never reconstructed from memory or a prior draft."
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [process, docs-sync, section-replacement, regression]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# Copy preserved subsections verbatim from the live file when replacing a whole section

## What happened

During task 06 execution (session 2026-06-05-06668274, commit `44ca2f6`), a planning draft was prepared for a "verbatim section replacement" of `## Workflow Metadata` in `orchestration/SKILL.md`. The section contained two subsections: one that was being rewritten (the new per-agent token-usage procedure) and one that was supposed to be preserved unchanged (`### Session metadata`).

The draft author reconstructed the "preserved" subsection from its earlier shape — not from the current file on disk. That earlier shape pre-dated the always-worktree change (commit `46d93c8`, same branch, same session), which had already:
- removed `direct`-mode language from `### Session metadata`, and
- fixed two broken `../../../features/...` relative links.

The executor pasted the draft faithfully, so the regression shipped in `44ca2f6`. The evaluator caught it (REVISE verdict, iter 1), and a second commit (`7a119ad`) remediated the regression.

## Why it happens

The mistaken assumption is: when authoring a full-section drop-in, the parts marked "preserved / unchanged" can be safely reconstructed from memory of what they looked like, because they have not been modified as part of this task.

This assumption is false whenever the file has been edited earlier in the same branch or session — even if those edits were to a different part of the section or a different subsection. A session/branch may contain multiple sequential tasks that each touch the same file. A drop-in draft that reconstructs "preserved" content from a snapshot predating those edits silently reverts them.

## Correct approach

1. **Read the live file before authoring any drop-in.** Run `git show HEAD:<path>` or `Read` the file at draft time. Copy the "preserved" subsections character-for-character from the current file — do not reconstruct them from memory, a prior draft, or an earlier task's output.

2. **Include only the changed subsection(s) in a targeted Edit.** Where possible, replace only the subsection that actually changes rather than dropping in the whole parent section. A targeted edit has no preserved-content risk by construction.

3. **At evaluation: diff preserved subsections against HEAD.** Evaluation should run `git diff HEAD -- <path>` and explicitly check that subsections marked "unchanged" in the plan match `git show HEAD:<path>` for those lines. Silent reverts trigger a REVISE — the regression is always detectable by diff.

## How to detect

- A "replace this whole section verbatim" plan where only a portion of the section changes AND the file has been edited earlier in the same branch/session (even by a different task).
- `git diff HEAD -- <path>` shows deletions of lines that were never in scope for the current task.
- The evaluator's diff review surfaces lines with `direct` mode, old relative link paths, or other pre-task-N content that should have been gone.

## Related

- `[[2026-06-06-session-operation-metadata-recording-from-agent-transcripts]]` — the task this correction arose from (task 06, session operation metadata recording procedure).
- Cross-ref — RELATED but DISTINCT from `paste-complete-approved-content-into-delegation-verbatim.md` (that mistake is about delegation assembly: dropping a block when transcribing approved content into a delegation prompt. Context: manager authoring. This mistake is about execution: reconstructing "preserved" subsections from memory rather than the live file. Context: executor doc editing. Both share a completeness root but are different scenarios, different fixes, and different detectors.)
- Layer-2 promotion candidate: this mistake generalizes across projects — any multi-task branch session that performs whole-section replacements faces this risk. Recommend promoting to workspace-level skill storage at Wrap-up.
