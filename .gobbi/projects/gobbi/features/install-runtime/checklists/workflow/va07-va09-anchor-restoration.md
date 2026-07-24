---
name: va07-va09-anchor-restoration
description: VA-07 and VA-09 narrowed the Preparation anchor-7/anchor-9 properties while claiming 1:1 preservation; restored to full (a)-(h)/(a)-(d) and attached to owning tasks
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-proj-002, va-07, va-09, anchor-narrowing, preparation-anchor-fidelity]
author: claude
scenario: plan-proj-lock-coverage
item_status: implemented
anchor: novel
implemented_in: null
---

# VA-07 and VA-09 restored to their full Preparation anchor properties

## What

The plan's VA-07/VA-09 verification-anchor labels must map 1:1 onto Preparation anchors 7 and 9 with NO
narrowing, since the plan claims exactly that 1:1 preservation.

## Why

At iter1, VA-07 dropped D11, resume, promotion-exclusion, and the grading burden; VA-09 dropped the
equivalent-evidence/different-grouping and many-question behavioural trials — a narrowing that contradicted the
plan's own 1:1 claim (`COD-PLAN-PROJ-002`, High/100).

## Verification

Both anchors restored to their full property (VA-07 (a)-(h), VA-09 (a)-(d)), diffed clause-by-clause against
`preparation.md:101-121` — no sub-property missing. Attached to every task that owns a part of them (T4/T5/T6/
T7/T8/T9 for VA-07; T2/T6/T8/T9 for VA-09); resume + promotion-exclusion made acceptance-bearing checklist items
in T7. A 14-row behavioural-trial register closes the loop, checked by name in T9.

## Status notes

Resolved at iter2. Residual: 7 of the 14 trial rows initially had no owning producer task — closed separately as
[[trial-row-ownership-assignment]].

## Related

- [[trial-row-ownership-assignment]] — the residual trial-ownership fix this finding's residual became
