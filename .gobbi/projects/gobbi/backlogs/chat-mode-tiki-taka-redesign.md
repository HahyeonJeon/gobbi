---
name: chat-mode-tiki-taka-redesign
description: Redesign conversational chat-mode UX for fluid short-turn exchanges without losing AskUserQuestion-as-decision-gate rigor; deferred — needs many discussions.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [chat-mode, ux, redesign, discussion, deferred]
title: "Chat-mode tiki-taka redesign"
project: gobbi
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
disposition: open
---

# Chat-mode tiki-taka redesign

## Context

"Chat mode" is the conversational mode of the gobbi orchestration (vs `auto` mode where the manager runs the workflow loops). The "tiki-taka" framing refers to short-turn back-and-forth user-manager exchanges that should feel like a natural conversation rather than a procedural state-machine. The current chat mode is documented in `orchestration/SKILL.md` Configuration Step 1; the redesign would explore how to make multi-turn discussion more fluid without losing the rigor of AskUserQuestion-as-decision-gate.

## Why deferred

User explicitly deferred during Sub-step A bundle-scope deliberation with the rationale "needs many discussions." Out of session scope. The work is fundamentally exploratory — requires multiple rounds of user dialogue to converge on a direction.

## When to pick up

- Whenever the user feels current chat-mode UX is friction-heavy (witness signal).
- After the workflow-foundation work (T1, T3, Item 1-2, Codex CI) stabilizes — chat-mode design should layer on top of a stable workflow foundation, not co-evolve with one.

## Suggested approach

1. Start a dedicated Ideation Loop with the chat-mode UX as the framed problem.
2. Run multiple PI rounds — innovative + best stances — to surface design options.
3. Reference external prior art: conversational-agent design patterns (LangChain conversation memory, multi-turn dialogue research).
4. Convert directionally-locked decisions into a discussion skill or update to `discussion/SKILL.md`.

## Effort estimate

Large — multi-session. Discussion-heavy ideation followed by careful incremental rollout.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A bundle-scope deliberation (user verbatim: "needs many discussions")
