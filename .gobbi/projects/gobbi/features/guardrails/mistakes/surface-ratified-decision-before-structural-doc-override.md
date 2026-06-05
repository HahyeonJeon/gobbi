---
name: surface-ratified-decision-before-structural-doc-override
description: Before a structural doc edit, grep the decisions tree and surface any ratified decision the edit would override to the user — do not fold supersession into Wrap-up bookkeeping.
type: mistakes
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [docs-sync, process, structural-override]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# Surface a ratified design decision before overriding it in a structural doc edit

## What happened

Task 1 merged the 14-principle template from 4 fields (Why/What/How/Anti-pattern) to 3 fields (Why/Practice/Anti-pattern). A prior decision record, `features/guardrails/decisions/2026-06-01-principles-4field-template.md`, had ratified the 4-field shape via dual-system (Claude+Codex) evaluation and was still `status: active`. The manager found that record in the blast-radius grep but classified its supersession as a mechanical Wrap-up step rather than as an Always-Ask design override to surface to the user up front. The execution-eval caught the gap and returned REVISE.

## Why it happens

A structural doc change that "only moves blocks around" feels mechanically safe, so the existence of a governance artifact (a ratified decision locking that exact structure) was treated as bookkeeping rather than as a decision the user must explicitly re-authorize. Mechanical-safety and governance-safety are different axes (P10: change only with a real trigger; P2: discuss eval findings with the user).

## Correct approach

During the blast-radius / pre-execution check for a structural doc change: (1) grep the decisions tree for any active decision governing the target's structure; (2) if found, AskUserQuestion to confirm the override before dispatching the executor; (3) on approval, plan the explicit supersession (new ratifying decision + flip old to superseded+archive) as part of the task, not as incidental cleanup.

## How to detect

Any edit that changes the structure/shape/template of an instruction doc (skill, principle, agent spec, rules) — not just its prose. Before executing, grep `**/decisions/**` for a decision governing that structure. If one exists and is `status: active`, the edit is overriding a ratified decision — it is an Always-Ask (design) item to surface to the user BEFORE committing, not a silent Wrap-up supersession.
