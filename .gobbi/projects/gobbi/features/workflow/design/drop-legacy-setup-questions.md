---
name: drop-legacy-setup-questions
description: Replace the 2-question setup block in gobbi/SKILL.md with 1 mode question plus an optional customize gate, eliminating the legacy eval-mode and git-workflow-mode questions.
type: design
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [gobbi-skill, session-bootstrap, setup-questions, orchestration]
topic: drop-legacy-setup-questions
---

# Drop legacy setup questions — gobbi/SKILL.md session bootstrap rewrite

## Context

The session-bootstrap step in `gobbi/SKILL.md § Step 4` asked the user two setup questions (eval-mode and git-workflow-mode). Those same defaults are already encoded in `settings.auto.json` and walked through by `orchestration/SKILL.md § Step 1`'s "use defaults vs customize" gate (rows 1-2), so the two-question block duplicated and partially overlapped that mechanism — a docs-sync drift between the bootstrap prompt and the settings source of truth.

## Decision

Rewrite `gobbi/SKILL.md § Step 4` from "ask the user 2 setup questions" to "ask 1 setup question + an optional customize gate":

- Question 1 — mode (chat/auto), **default auto** per `orchestration/templates/settings.auto.json`.
- Optional "customize defaults?" gate — if yes, defer to the `orchestration/SKILL.md § Step 1` row-2 walk-through.
- Remove the explicit eval-mode and git-workflow-mode questions; those defaults live in `settings.json`.

## Rationale

`orchestration/SKILL.md § Step 1` already owns the defaults-vs-customize gate, so collapsing the bootstrap to one mode question plus a customize gate resolves the duplication without losing any capability. The settings defaults were verified empirically: `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' orchestration/templates/settings.auto.json` returns `"auto"`, `"always"`, `{"open": false, "draft": false}` — confirming the defaults the bootstrap no longer needs to ask about.

One referenced file does not exist: there is no `.claude/skills/orchestration/workflow/configuration.md` (`find .claude/skills/orchestration/workflow -name "configuration*"` returns empty). Wherever an earlier brief pointed at that path, substitute `orchestration/SKILL.md § Step 1`, which is the authoritative configuration walk-through.

## Alternatives considered

- **Keep the two setup questions in `gobbi/SKILL.md`.** Rejected: they duplicate the `settings.json` defaults and the `orchestration/SKILL.md § Step 1` customize gate, creating two places that can drift out of sync.
- **Remove the setup block entirely (no mode question).** Rejected: the chat/auto mode choice is the one bootstrap decision that genuinely belongs at session start; only the eval-mode and git-workflow-mode questions are redundant.

## Consequences

A fresh manager's bootstrap asks at most one mode question plus an optional customize gate; the eval-mode and git-workflow-mode questions are gone. Validation: `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` shows ≤ 2 AskUserQuestion mentions (mode + customize gate) and zero mentions of "Always evaluate" / "Skip evaluation" / "Direct commit" / "Git workflow" as bootstrap-question options.

## Related

- `design/glossary-placement.md` — the sibling `gobbi/SKILL.md` bootstrap-structure change shipped in the same Bundle A pass.
