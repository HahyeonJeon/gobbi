---
name: constraints-body-block-kept-per-h2-lock
description: Keep the Constraints body block in the codex skill — the 8-H2 Idea Design A contract takes precedence over the H2-per-section convention used by sibling skills.
type: decisions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, constraints, h2-count, codex-skill]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Constraints body block vs ## Constraints H2 convention

## Question

Sampled existing project skills use `## Constraints` as H2. The codex stub uses `**Constraints**` as a body block per the brief directive. Either rev stub to H2 #9 (breaks "exactly 8 H2" Idea lock) OR re-read `_claude/SKILL.md` for the actual standard.

## Resolution

**Keep the body block per locked Idea Design A.** The codex skill's Idea Design A locked exactly 8 H2 sections (`grep -c "^## " SKILL.md` MUST return 8), so `## Constraints` as a 9th H2 would violate that contract.

**Additional fix:** the codex stub's Constraints block annotation cites `_claude/SKILL.md` as the convention source — but `.agents/skills/_claude/` and `.claude/skills/claude/` BOTH DO NOT EXIST. Task 06 drops the `_claude/SKILL.md` reference and replaces with "body block per locked Idea Design A; H2 count contract."

## Evidence — 6/6 sampled skills use `## Constraints` H2

`grep -n "^## Constraints" .agents/skills/*/SKILL.md` confirms: git, research, preparation, wrap-up, mistake, execution — all H2.

## Evidence — `_claude/SKILL.md` does not exist

`find /playinganalytics/git/gobbi -path "*/skills/claude*" -type f` finds only symlinks to other skills, not a `_claude/` or `claude/` skill.

## Action

Adopted in the codex-skill Task 06 brief: drop `_claude/SKILL.md` reference; keep body block. No User Challenge.
