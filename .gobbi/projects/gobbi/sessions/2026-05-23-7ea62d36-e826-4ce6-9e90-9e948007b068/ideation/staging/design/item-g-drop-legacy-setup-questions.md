---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
loop: ideation
iter: 3
topic: item-g-drop-legacy-setup-questions
status: final
---

# Design G — Drop Legacy Setup Questions in `gobbi/SKILL.md § 4`

**Chosen direction**: Rewrite `gobbi/SKILL.md § Step 4` (lines 97-114) from "Ask the user 2 setup questions" to "Ask 1 setup question + optional customize gate":
- Question 1 — mode (chat/auto), **default auto** per `orchestration/templates/settings.default.json:3`
- Optional "customize defaults?" gate — if yes, defer to `orchestration/SKILL.md § Step 1` row 2 walk-through
- Remove: explicit eval-mode + git-workflow-mode questions (these defaults live in settings.json)

**Rationale**: `orchestration/SKILL.md § Step 1` already encodes a "use defaults vs customize" gate (rows 1-2). The existing `gobbi/SKILL.md § 4` duplicates and partially overlaps that mechanism. Consolidated path: one mode question (default auto) + customize gate resolves docs-sync drift. Settings verified empirically: `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' orchestration/templates/settings.default.json` returns `"auto"`, `"always"`, `{"open": false, "draft": false}`.

**Critical note**: There is NO `.claude/skills/orchestration/workflow/configuration.md` file in the current repo — `find .claude/skills/orchestration/workflow -name "configuration*"` returns empty. The original brief referenced this non-existent file. Substitute everywhere with `orchestration/SKILL.md § Step 1`. This was auto-resolved in iter1 as "Concern 1".

**Anchored insights**: I10, verified settings defaults.

**Validation**: `awk '/^### 4\./,/^### 5\./' gobbi/SKILL.md` shows ≤ 2 AskUserQuestion mentions (mode + customize gate); zero mentions of "Always evaluate" / "Skip evaluation" / "Direct commit" / "Git workflow" as bootstrap-question options.
