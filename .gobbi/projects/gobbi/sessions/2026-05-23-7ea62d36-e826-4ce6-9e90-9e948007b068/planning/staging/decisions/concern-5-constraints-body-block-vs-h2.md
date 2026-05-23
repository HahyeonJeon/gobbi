---
slug: concern-5-constraints-body-block-vs-h2
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
feature: gobbi-orchestration-workflow-improvements
superseded_by: null
---

# Constraints body block vs ## Constraints H2 convention

## Question

Sampled existing project skills use `## Constraints` as H2. The codex stub uses `**Constraints**` as a body block per the brief directive. Either rev stub to H2 #9 (breaks "exactly 8 H2" Idea lock) OR re-read `_claude/SKILL.md` for the actual standard.

## Resolution

**Keep the body block per locked Idea Design A.** The 8-H2 count contract is locked at `idea.md:75-84` (`grep -c "^## " SKILL.md` MUST return 8). Promoting Constraints to H2 #9 breaks the lock.

**Additional fix:** the codex stub's Constraints block annotation cites `_claude/SKILL.md` as the convention source — but `.agents/skills/_claude/` and `.claude/skills/claude/` BOTH DO NOT EXIST. The "body block per `_claude/SKILL.md` standard" annotation references a non-existent file.

Resolution: Task 06 (codex content fill) drops the `_claude/SKILL.md` reference in the Constraints annotation and replaces with "body block per locked Idea Design A; H2 count contract."

## Evidence — 6/6 sampled skills use `## Constraints` H2

- `git/SKILL.md:263` → `## Constraints`
- `research/SKILL.md:159` → `## Constraints`
- `preparation/SKILL.md:401` → `## Constraints`
- `wrap-up/SKILL.md:349` → `## Constraints`
- `mistake/SKILL.md:100` → `## Constraints`
- `execution/SKILL.md:275` → `## Constraints`

Verification command: `grep -n "^## Constraints" .agents/skills/*/SKILL.md`.

## Evidence — `_claude/SKILL.md` does not exist

- `ls /playinganalytics/git/gobbi/.agents/skills/_claude/` → not found
- `ls /playinganalytics/git/gobbi/.claude/skills/claude/` → not found
- `find /playinganalytics/git/gobbi -path "*/skills/claude*" -type f` → finds `git/research/planning/mistake/orchestration` SKILL.md symlinks only

## Follow-up backlog candidate (out of scope)

"Normalize Constraints to `## Constraints` H2 across all skills once the codex H2-count contract is revisited" — stage at `backlogs/project/normalize-constraints-h2.md` by Task 05 or Task 06 (manager decides). Not for this session.

## Action

Adopted in Planning draft-iter1.md Task 06 brief: drop `_claude/SKILL.md` reference; keep body block. No User Challenge.
