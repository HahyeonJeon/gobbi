---
name: handoff-artifact-spec
description: Handoff artifact location, naming, template, and "shown to session" mechanic
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, design]
keywords: [handoff, artifact]
author: claude
supersedes: null
superseded_by: null
related: [wrap-up-5-stage-pipeline]
---
# Evaluated handoff artifact specification

## Problem

Wrap-up needs one closure contract whose promoted durable body, session output, evaluation subject, and final Git facts cannot drift.

## Scope

This record defines the universal Wrap-up loop, the matching handoff body in two locations, its nine required sections, and the separate post-evaluation finalization receipt.

## Approach

Wrap-up uses the same four stages as every productive step:

1. DISCUSSION confirms closure inputs and final material additions.
2. WORK runs dual-system creation over the promotion plan and handoff, freezes source and destination preimages, applies the complete manifest idempotently inside the isolated worktree, and verifies the actual project delta.
3. EVALUATION gives two fresh systems the actual post-promotion tree and handoff.
4. RECORD seals only PASS artifacts and checkpoints the final outcome.

One evaluated Markdown body appears at `4-wrap-up/outputs/handoff.md` and as a durable notes record at `notes/{area}/{YYYY-MM-DD}-{slug}.md`. The body is byte-identical after removing only the durable notes frontmatter wrapper.

The body contains exactly these required sections:

1. Outcome and agreed scope.
2. Completed or shipped work with artifact and verification evidence.
3. Dual-system evaluation result, approved finding dispositions, and waivers.
4. Decisions to respect.
5. Durable memory promoted or superseded.
6. Pre-finalization Git state and authorized finalization plan.
7. Unresolved, blocked, or deferred items with explicit reasons.
8. Known risks and accepted exceptions.
9. Exact next-session start point: objective, required reads, branch/worktree state, and first action.

The manager displays the complete evaluated body. After finalization, it appends a factual receipt for the actual local commit, issue, push, pull request, merge, branch, worktree, and cleanup results. The receipt never mutates the evaluated handoff.

## Validation

Verify staging-only provenance, the frozen manifest and preimages, actual-tree reconciliation, two PASS reports, matching handoff bodies, all nine sections, evidence for every completion claim, and an accurate separate Git receipt.

## Trade-offs

The evaluated body intentionally excludes facts that do not exist until finalization. Keeping those facts in a receipt preserves the integrity of what the evaluators actually reviewed.
