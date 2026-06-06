---
name: paste-complete-approved-content-into-delegation-verbatim
description: When a delegation prompt supplies user-approved content as "verbatim", paste the COMPLETE approved artifact (every block) and diff it against the approved draft before dispatch — a dropped block ships an incomplete deliverable.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [process, delegation, verbatim-paste, completeness]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Paste the COMPLETE approved content into a delegation; verify completeness before dispatch

## What happened

Task 10 merged two principles into a new Principle 7. The manager presented a full draft to the user (Why + Practice + Anti-pattern, all approved). When writing the executor delegation, the manager pasted the "verbatim, user-approved, pre-resolved" P7 block but dropped the `**Anti-pattern:**` block. The executor pasted exactly what it was given (correctly, per its contract), producing a P7 with no anti-patterns — an incomplete deliverable. The executor caught the resulting count mismatch (10 anti-pattern blocks for 11 principles) and flagged it; a second iter added the block.

## Why it happens

The manager hand-retyped / transcribed the approved content into the delegation prompt instead of copying it whole, and did not diff the pasted block against the approved draft before dispatch. A "verbatim" + "pre-resolved" + "do not invent" instruction means the executor will faithfully reproduce whatever is pasted, including its omissions — so an incomplete paste guarantees an incomplete deliverable, with no executor-side safety net (inventing the missing block would itself violate anti-scope-creep).

## Correct approach

When supplying approved content as verbatim in a delegation: (1) paste the artifact whole from the approved source, not retyped; (2) before dispatch, check the pasted block has every expected sub-part (for a principle: heading + Why + Practice + Anti-pattern); (3) put the expected structural invariant in the executor's verification list (e.g., "block counts N/N/N") so the executor catches an incomplete paste — as happened here. The executor catching it is the backstop, not the plan.

## How to detect

Any delegation that pastes an approved multi-part artifact (a principle = Why/Practice/Anti-pattern; a doc = its full section set; a config = all keys) as "verbatim / pre-resolved / do not change." The risk is highest when the manager is assembling the prompt from memory or across a long context.
