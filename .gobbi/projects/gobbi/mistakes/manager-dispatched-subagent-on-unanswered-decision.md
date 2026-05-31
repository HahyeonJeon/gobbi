---
name: manager-dispatched-subagent-on-unanswered-decision
description: Manager fired a subagent whose scope depended on a decision it had asked the user about in the same turn — encoding the assumed answer in the dispatch before the user replied.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-30
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [process, delegation, manager, askuserquestion]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Manager Dispatched Subagent Before Getting the Answer to a Scope-Defining Question

## What happened

During the principles clarity session, the manager asked the user via AskUserQuestion whether Principle 14's reach should cover (a) instruction docs only or (b) all agent-authored text. In the same turn, the manager also dispatched the Ideation leader — and that dispatch encoded "instruction docs only" (option a) as the assumed scope for P14's draft.

The user answered "all agent-authored text" (option b). The leader's P14 draft was therefore scoped too narrowly and had to be widened in a subsequent remediation step.

## Why it happens

The manager sent both the AskUserQuestion call and the Agent dispatch in the same message, treating the "recommended option" it had suggested in the question as though it were the settled answer. The assumption was: "I suggested option A; the user will probably agree; I can get ahead by dispatching while the question is in flight."

This is a latency-optimization reflex applied to a decision it does not have the authority to make. The question existed precisely because the answer was not known. Dispatching on an assumed answer is semantically equivalent to not asking the question at all.

## Correct approach

Wait for the user's answer to any decision that determines a subagent's scope before dispatching the subagent.

The dispatch is safe to send in the same turn as a question ONLY when the dispatch is genuinely independent of the answer — i.e., the subagent will do the same work regardless of what the user says. If the answer to the question would change the subagent's brief, the dispatch must wait.

Decision gate before dispatch:

> "Does this subagent's scope / brief change depending on what the user answers?" If yes — wait. If genuinely no — proceed in parallel.

## How to detect

You are about to send a message that contains both an AskUserQuestion call and an Agent dispatch. Ask: does the Agent's scope, brief, or any parameter depend on the question being asked? If the answer is yes — split into two turns: ask first, dispatch after the reply arrives.

A second signal: you are framing the dispatch prompt using the "recommended option" you suggested in the question, rather than an option the user explicitly confirmed.

## Related

- `[[manager-mispec-grep-c]]` — a related process mistake where the manager encodes an assumption into a subagent brief that the brief itself should have left open for investigation.
