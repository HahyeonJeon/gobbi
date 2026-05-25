---
title: "Remove/replace non-existent `gobbi mistake promote` command references (7 across CLAUDE.md + mistake/SKILL.md)"
name: gobbi-mistake-promote-command-does-not-exist
type: backlog
severity: medium
confidence: 100
scope: project
source: user-correction-2026-05-25
disposition: addressed
status: addressed
created: 2026-05-25
session-id: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
project: gobbi
feature: session-foundations-bundle-c
anchor_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
closed_by: <post-merge>
---

# `gobbi mistake promote` command does not exist — 7 stale references

## Context

User correction (2026-05-25): the `gobbi mistake promote` command referenced throughout the mistake-recording documentation is **wrong information** — the command does not exist. Empirically confirmed: the installed `gobbi` CLI (`@gobbitools/cli`, stable channel) exposes only `docs / config / session / notify / note / validate / audit / doctor / image / video / web` — there is **no `mistake` subcommand**. The user also stated "We don't use gobbi command now" — the v0.5.0 redesign moved off the CLI-driven model.

## The stale references (7 total)

**`.claude/CLAUDE.md`:**
- Line 48 — heading: "**Gobbi-specific tooling: the `mistake` skill and `gobbi mistake promote` command.**"
- Line 50 — body: "After the session ends, run `gobbi mistake promote` to promote corrections to permanent workspace-level skill storage..."

**`.claude/skills/mistake/SKILL.md`** (→ `.gobbi/projects/gobbi/skills/mistake/SKILL.md`):
- Line 3 — `description:` frontmatter: "...promote via `gobbi mistake promote` — never write directly to project memory."
- Line 11 — "Promotion to project memory ... happens via `gobbi mistake promote` after the session ends..."
- Line 27 — "**Promotion**: `gobbi mistake promote` runs outside the session (post-session)..."
- Line 47 — "`gobbi mistake promote` is the user-facing command that moves staged mistake-candidates from session staging to project memory."
- Line 96 — "After `gobbi mistake promote` runs (outside the session), staged mistake-candidates appear in `mistakes/`..."

**Bonus stale reference (same class — v0.4.x CLI-era artifact):**
- `.claude/CLAUDE.md` line 13 — cites `packages/cli/src/specs/` as where the 6-step state machine lives + "driven by `gobbi workflow init`". `packages/cli/` does not exist in the current tree, and `gobbi workflow init` is not a command the installed CLI exposes (`config` is the nearest). Verify + reconcile.

## Why it's wrong

This is a **v0.4.x CLI-era artifact** that survived the v0.5.0 markdown-tree redesign. The actual v0.5.0 promotion mechanism is the **Wrap-up loop's MEMORIZATION sub-phase**, which copies staged mistake-candidates from `sessions/.../{loop}/staging/decisions/*.md` directly into `.gobbi/projects/{name}/mistakes/`. This is what session 45388fa9's Wrap-up did empirically (promoted 2 mistakes without any CLI step).

## Internal contradiction the rewrite must resolve

The mistake skill currently states two things that conflict under v0.5.0:

1. "Agents never write directly to project memory" + "promotion is via `gobbi mistake promote`" (Layer 2, lines 47/96).
2. But CLAUDE.md + orchestration + wrap-up skill all say **Wrap-up's MEMORIZATION is the sole writer to project memory** — and Wrap-up is run by an agent (the assistant). So an agent DOES write promoted mistakes to project memory; the "never" is false under v0.5.0.

The correct v0.5.0 model: agents write mistake-candidates to **session staging** only; the **Wrap-up loop's MEMORIZATION** (sole-writer exception) promotes staging → `.gobbi/projects/{name}/mistakes/`. There is no separate post-session CLI command. The "Layer 2 cross-session workspace-level promotion" concept (mistakes → workspace skill storage) either needs a real mechanism documented or needs to be dropped if it was never built.

## Suggested fix (deferred per user — "fix later")

1. Rewrite the 7 `gobbi mistake promote` references to describe the actual Wrap-up-MEMORIZATION promotion mechanism (no CLI command).
2. Resolve the "agents never write to project memory" contradiction — clarify that Wrap-up MEMORIZATION is the documented sole-writer exception.
3. Decide the fate of "Layer 2 workspace-level promotion": document a real mechanism or remove the claim.
4. Reconcile CLAUDE.md line 13 (`packages/cli/src/specs/` + `gobbi workflow init`) against the actual tree + CLI.
5. Scope note: this overlaps T03 (CL-3 already edits `mistake/SKILL.md` to add the `hooks` domain tag) — the `gobbi mistake promote` rewrite of `mistake/SKILL.md` could fold into T03's edit, OR ship as its own task. CLAUDE.md edits are a separate Always-Ask surface.

## When to pick up

Next session (the Bundle C follow-up resuming T03-T06 on branch `chore/session-2026-05-24-45388fa9`). Editing CLAUDE.md + skills is an Always-Ask category — surface to user before editing. The user has already flagged the defect and deferred the fix; the follow-up session should confirm scope (fold into T03 vs standalone task) before implementing.

## Resolution

Addressed by T03 + T07 of session `2026-05-24-45388fa9` (Bundle C):

**T03** (mistake/SKILL.md rewrite — 5 `gobbi mistake promote` refs fixed):
- All 5 references in `.gobbi/projects/gobbi/skills/mistake/SKILL.md` replaced with Wrap-up-phase promotion mechanism language.
- `description:` frontmatter, Memory Access Matrix, Core Principles, P4 procedure, and Constraints all updated.
- Contradiction resolved: working-loop agents are READ-ONLY on project memory; the Wrap-up assistant is the sole documented exception (promotion during Wrap-up phase, no CLI).

**T07** (CLAUDE.md + gobbi/SKILL.md reword + wrap-up Layer-2 wiring):
- `.claude/CLAUDE.md` line 48 heading: replaced `gobbi mistake promote` command mention with "Wrap-up-phase promotion".
- `.claude/CLAUDE.md` line 50 body: removed CLI reference; described two-layer promotion model (Layer 1 = project mistakes/, Layer 2 = workspace-level skill storage) performed by the Wrap-up assistant.
- `.claude/CLAUDE.md` line 13: removed stale `packages/cli/src/specs/` and `gobbi workflow init` references (both absent from the current tree, confirmed by `ls packages/cli 2>/dev/null`). Replaced with: "governed by the `orchestration` skill and its per-step `workflow/` sub-documents — markdown-driven, no CLI."
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` Layer 2 sentence: replaced `gobbi mistake promote` CLI with "During the Wrap-up phase, the Wrap-up assistant also promotes generalizable project-mistakes ... to workspace-level skill storage ... No CLI command."
- `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md`: added a `> Layer-2 promotion` Core Principles block documenting the Wrap-up assistant's Layer-2 responsibility (project mistakes → workspace-level skill storage, no CLI, Always-Ask decision gate for scope).

**User-locked decision (2026-05-25):** KEEP the two-layer promotion model. Replace the CLI mechanism with agent-driven promotion during the Wrap-up phase (performed by the Wrap-up assistant). Both layers happen during Wrap-up. The "agents never write to project memory" claim is reconciled by noting the Wrap-up assistant is the documented sole-writer/promotion exception.
