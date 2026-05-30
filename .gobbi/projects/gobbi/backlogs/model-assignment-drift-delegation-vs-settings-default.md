---
name: model-assignment-drift-delegation-vs-settings-default
description: "delegation/SKILL.md § Model Selection table conflicts with settings.chat.json + settings.auto.json (formerly settings.default.json) on executor/evaluator model assignments; deferred from chat+auto mode redesign session."
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-28
session: 8eed14fb-c4b5-455f-aa5e-497c33ed8bbf
tags: [drift, docs-sync, delegation, settings, deferred]
title: "Model-assignment drift between delegation/SKILL.md and settings.chat.json + settings.auto.json"
project: gobbi
anchor_session: 2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf
disposition: open
---

# Model-assignment drift between delegation/SKILL.md and settings.chat.json + settings.auto.json

## Context

Two sources of truth conflict on which model handles which role:

- `delegation/SKILL.md § Model Selection` table — claims **executor = sonnet**, **evaluator = opus**
- `settings.chat.json` and `settings.auto.json` — `models.claude.executor` is set to **opus** in both files; the evaluator slot is set to **sonnet** in both

The inversion is complete: every assignment in the doc is the opposite of what the per-mode default templates ship. (Originally one bundled `settings.default.json`; split into `settings.chat.json` + `settings.auto.json` later in the same PR — the drift is now mirrored in both files.)

## Why it matters

Any reader consulting only one source will dispatch subagents with the wrong model. A manager briefing an executor from `delegation/SKILL.md` will use sonnet; the same manager reading the per-mode `settings.{mode}.json` default will use opus. The discrepancy is silent — no runtime validation catches it — so wrong-model dispatches can persist across sessions undetected.

## Why deferred

The chat+auto mode redesign session (`2026-05-28-8eed14fb`) chose not to embed either model assignment into the new `chat-mode.md` or `auto-mode.md` prose, precisely because the upstream conflict was unresolved. Section §5 footnotes in the redesign docs acknowledge both cited sources. Baking in a choice would have locked a contested default; the redesign session's scope was the mode structure, not model-assignment governance.

## Resolution options for the picking-up session

No decision is made here. Three options to evaluate:

**(a) Align `delegation/SKILL.md` to match the per-mode default templates** — update the Model Selection table so executor = opus, evaluator = sonnet. The configs become the single source of truth; the doc follows them.

**(b) Align `settings.chat.json` + `settings.auto.json` to match `delegation/SKILL.md`** — swap `executor` and `evaluator` model values in `models.claude` in BOTH files (the same swap is required in each, since the model assignments are intentionally identical across modes). The doc rationale (opus for evaluation breadth, sonnet for fast execution) becomes normative.

**(c) Ratify a different assignment entirely** — run a dedicated Ideation loop to pick the correct assignment from first principles (cost, latency, quality trade-offs per role), then update both sources consistently.

All three options require touching at least two files; option (c) requires prior deliberation before any edit.

## Origin

Idea iter1 Finding F-C1 (Codex adversarial perspective) surfaced the inversion during the chat+auto mode redesign session. Iter2 evaluation partially addressed the finding as "deferred via §5 footnote" — the redesign doc acknowledges the conflict but does not resolve it. This backlog captures the open item for a future session to close.
