---
slug: constraints-body-block-kept-per-h2-lock
title: "Constraints body block vs ## Constraints H2 — keep body block per locked 8-H2 Idea contract"
domain: docs-sync
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: planning
created: 2026-05-23
status: active
supersedes: null
date: 2026-05-23
scope: feature
feature: evaluation
superseded_by: null
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-5-constraints-body-block-vs-h2.md
promoted-at: 2026-05-23T14:00:00Z
---

# Constraints body block vs ## Constraints H2 convention

## Question

Sampled existing project skills use `## Constraints` as H2. The codex stub uses `**Constraints**` as a body block per the brief directive. Either rev stub to H2 #9 (breaks "exactly 8 H2" Idea lock) OR re-read `_claude/SKILL.md` for the actual standard.

## Resolution

**Keep the body block per locked Idea Design A.** The 8-H2 count contract is locked at `idea.md:75-84` (`grep -c "^## " SKILL.md` MUST return 8).

**Additional fix:** the codex stub's Constraints block annotation cites `_claude/SKILL.md` as the convention source — but `.agents/skills/_claude/` and `.claude/skills/claude/` BOTH DO NOT EXIST. Task 06 drops the `_claude/SKILL.md` reference and replaces with "body block per locked Idea Design A; H2 count contract."

## Evidence — 6/6 sampled skills use `## Constraints` H2

`grep -n "^## Constraints" .agents/skills/*/SKILL.md` confirms: git, research, preparation, wrap-up, mistake, execution — all H2.

## Evidence — `_claude/SKILL.md` does not exist

`find /playinganalytics/git/gobbi -path "*/skills/claude*" -type f` finds only symlinks to other skills, not a `_claude/` or `claude/` skill.

## Action

Adopted in Planning draft-iter1.md Task 06 brief: drop `_claude/SKILL.md` reference; keep body block. No User Challenge.
