---
name: gate-decisions-need-citable-session-record
description: A DISCUSSION-gate user decision cited only from the manager's transcript is not a permitted evidence source — the manager must write a citable gate-decision record file at every gate.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [discussion-gate, gate-decision-record, citable-evidence, askuserquestion, provenance]
author: claude
priority: medium
domain: process
related: [manager-locked-decision-without-audit-trail-sync]
---

# DISCUSSION-gate user decisions need a citable session-record file, not just the manager's transcript

## What happened

The Preparation iter-1 WORK draft asserted several "the user decided X" claims about the Preparation DISCUSSION gate's outcome — the readiness-verdict acceptance, the D2 guard-buildability weighting decision, and the "D2 stays open at Planning" decision. The only place these outcomes actually existed was inside the manager's own conversational transcript (the raw AskUserQuestion call and its answer). Codex's iter-1 evaluator (`CODEX-PREP-USAGE-001`, High/100, `design_flaw`/`process`) found that a transcript is not a permitted evidence source for a WORK artifact's claims — it is unstructured, not anchor-addressable, and not part of the citable session record. The fix was for the manager to write a new, purpose-built file — `2-preparation/working/gate-decisions-iter1.md` — that states the exact question, the options, the verbatim user answer, and the bound outcomes, which the iter-2 draft then cites by anchor for every post-gate claim.

## Why it happens

A DISCUSSION gate FEELS complete once the user has answered — the manager has the answer, remembers it, and can act on it. But "the manager knows the answer" and "the answer is a citable, durable part of the session record" are different properties. Treating a gate as conversation rather than as a record-producing event leaves every downstream claim about that decision ungrounded — the WORK artifact says "the user decided X" with no file a reader (or an evaluator) can open to verify it, and the manager's raw transcript is both the wrong shape (unstructured prose) and, in this session's naming convention, explicitly out-of-bounds as a claim source.

## Correct approach

The manager writes a `gate-decisions-iter{n}.md` record at EVERY DISCUSSION gate, as routine bookkeeping — not only after an evaluator finds the gap. The record states: the decision asked, the decision class, the options presented, the user's verbatim answer, and the bound outcomes the answer triggers. Every downstream WORK-artifact claim about "what the user decided" cites this file by anchor. This was done for this loop (`gate-decisions-iter1.md`) and is adopted as session practice going forward for every subsequent DISCUSSION gate in this session (Planning, Execution, Wrap-up).

## How to detect

Any WORK-artifact claim of the form "the user decided X" / "the user approved Y" / "per the user's gate answer" that does not cite a specific file path with a resolvable anchor. The trigger: a Decisions-log or equivalent section names a user decision but the only supporting evidence anywhere in the session is the manager's own raw transcript — that is unstructured conversation, not a citable record.

## Related

- [[manager-locked-decision-without-audit-trail-sync]] — the sibling project mistake: a locked decision must be synced into the durable audit trail (discussion-log, integration-log disposition) at the moment it is made, not left to lag; this mistake is the specific instance of that discipline applied to DISCUSSION-gate AskUserQuestion outcomes, where the fix is a dedicated gate-decision record file rather than a discussion-log entry
