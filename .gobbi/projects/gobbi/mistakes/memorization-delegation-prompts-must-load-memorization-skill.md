---
name: memorization-delegation-prompts-must-load-memorization-skill
description: MEMORIZATION delegation prompts must include `memorization/SKILL.md` in Load Directives; subagents do not inherit parent skills.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [process, orchestration, delegation, memorization]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# MEMORIZATION Delegation Prompts Must Include `memorization/SKILL.md` in Load Directives

## What happened

This is Design decision α from Bundle A (Item C: Memorization delegation hard gate). The root cause of the T1-T7 staging gap observed in session `2026-05-22-bac669ad` was confirmed this session: the MEMORIZATION assistant was dispatched without `memorization/SKILL.md` in the delegation prompt's Load Directives Skills tier. Because subagents do not inherit the parent session's loaded skills, the assistant ran without the staging procedure and produced only the minimal outputs (transcript + session.json upsert) — none of the typed-finding stagings, design stagings, or discussion stagings.

A prior session's MEMORIZATION dispatch produced sparse output: only transcript preservation + session.json entry. No `staging/scenarios/`, `staging/decisions/`, `staging/design/`, or `staging/discussions/` files were written across T1-T7 execution loops. The assistant completed and returned `DONE` without error. The manager did not catch the thin output because there was no hard gate on the delegation prompt.

## Why it happens

The manager assumed the assistant would load the memorization skill because it was present in the project's skills directory. Subagents do not inherit the parent agent's loaded skills — every subagent starts fresh. If the delegation prompt does not list a skill in Load Directives, the subagent does not load it. The `memorization/SKILL.md` staging procedure (Steps 5-7 of the PASS-path) was never loaded; the assistant therefore did not know to write to `staging/` at all.

## Correct approach

Every MEMORIZATION delegation prompt MUST include `memorization/SKILL.md` in tier-3 (Skills) of the Load Directives block. This is a non-negotiable gate.

Concrete Load Directives block for any MEMORIZATION dispatch:

```markdown
## Load Directives (in order — mandatory)

1. `principles` skill
2. `.gobbi/projects/{project-name}/rules/`
3. Skills:
   - `mistake` skill (mandatory)
   - `memorization` skill (your phase skill — load FULL skill, this is the PASS-path)
   - `{loop}/SKILL.md § MEMORIZATION Phase` (e.g., `ideation/SKILL.md`)
4. Mistakes: [any relevant recent mistakes]
```

The manager verifies this gate at prompt-construction time. If `memorization/SKILL.md` is absent from the Skills tier, the prompt is rejected and rewritten before dispatch.

This gate is the subject of Item C of Bundle A, which adds it to `delegation/SKILL.md § Core Principles` and to the per-role delegation templates for assistant, leader, and executor.

## How to detect

Trigger signals:
- MEMORIZATION assistant returns `DONE` but `sessions/{session-id}/{loop}/staging/` is empty or absent.
- Only `rawdata/transcript-iter{n}.jsonl` and `session.json` were updated; no `artifacts/` files and no `staging/{type}/` files.
- The assistant's output contains no mentions of typing findings, routing types to staging subdirectories, or stamping templates.
- `find sessions/{session-id}/{loop}/staging -type f` returns empty or no output after MEMORIZATION completes.

## Related

- Design C of this session: delegation hard gate — `delegation/SKILL.md` edit
- Item B of this session: moment-of-capture Core Principle — `memorization/SKILL.md` edit
- `memorization/SKILL.md § MEMORIZATION Phase` Step 4 (GUARD) — PASS path requires Steps 5-8 including staging
- Session `2026-05-22-bac669ad`: T1-T7 execution loops — full evaluations present, staging empty/absent
- `mistake/SKILL.md` P3 — staging procedure for mistake-candidates
- Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`, loop: ideation, iter: 3 (designed as Item C)
