---
name: explicit-draft-demoted-to-advisory
description: An explicitly selected draft was demoted because a different version was merged and procedurally complete.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-11
session: 019f5040-e1d9-74e0-abbc-feda844e9dea
tags: [process, assumption]
keywords: [user-source, draft-version, normative-reference, merge-status]
author: codex
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Preserve An Explicitly Selected Reference Version As Normative

## What happened

The user asked the redesign to follow a specific newer `skill-writing` draft. After discovering that the draft was unmerged and had an incomplete wiring step, the manager recommended making the merged version normative and the requested draft merely advisory.

## User feedback

The user corrected the authority decision directly: follow the explicitly named newer version.

## Why it happens

Merge status and procedural completeness can look like stronger evidence of authority than the user's explicit design-source instruction. Those facts identify risks to plan around; they do not revoke the user's choice of governing reference.

## Correct approach

Treat the explicitly named reference as normative unless the user changes that choice. Verify and disclose missing or contradictory parts, then make those gaps explicit scope or design decisions. Do not demote the selected reference based on repository status alone.

## How to detect

A user names a specific draft, branch, revision, or reference as the basis for a redesign, but the proposed decision silently promotes a different artifact because it is merged, complete, newer on the base branch, or easier to execute.

## Related

- [[2026-07-11-delegation-ownership-boundary-redesign]] — session journal for the redesign where the correction was made
