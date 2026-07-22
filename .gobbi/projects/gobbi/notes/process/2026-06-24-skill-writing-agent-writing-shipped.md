---
name: skill-writing-agent-writing-shipped
description: Session authored skill-writing and agent-writing reference skills; dual-system eval caught wrong-facts twice; verify-dont-assert mistake promoted.
type: notes
scope: project
feature: null
status: active
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [process]
keywords: [skill-writing, agent-writing, meta-skill, verify-dont-assert, dual-system-eval, layer-2]
author: claude
features_touched: [agents]
steps_completed: [ideation, execution, wrap-up]
shipped:
  - verify-dont-assert-taught-facts
  - skill-loadability-and-map-placement
  - claude-doc-authoring-standard
  - claude-skills-mirror-gap
---

# skill-writing and agent-writing reference skills shipped

## What happened

The session designed and implemented two new meta-skills for the `agents` feature: `skill-writing/SKILL.md` and `agent-writing/SKILL.md`. These teach gobbi agents how to author skills and agents correctly across the dual-runtime (Claude + Codex) mirror structure.

Ideation ran first. The leader investigated the prior-art meta-skills (`claude-plugin`, `gobbi-hook-authoring`) and locked three design decisions: DD-1 (loadability: 4-axis Claude Code model, `user-invocable: true`, `disable-model-invocation: false`, no `Skill()` entry), DD-3 (standalone single-file SKILL.md for each), and DD-5 (one value-features prose paragraph naming both skills, no table row — matches meta-skill precedent). Ideation evaluation went REVISE → remediated → PASS: the dual-system evaluators caught the Ideation leader's wrong-fact about `Skill()` as a discoverability gate (it is a tool-permission gate) and the wrong CRUD op for `.agents/skills/` (the script manages it; no hand-create step needed).

Execution implemented both skills in a single commit (`4e7c68a`). Execution evaluation also went REVISE → remediated → PASS: the evaluators caught approximately 4–6 un-reproduced facts in the initial drafts — `check-markdown-links.sh` taught as arg-less (requires path arg → exit 2), "exactly three frontmatter keys" contradicting the actual `user-invocable`/`disable-model-invocation` keys, a hard-coded skill count of "20" (actual 22), `assistant` role described read-only (actual tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch), and `claude-plugin` claimed in value-feature prose (actual: 0 occurrences in gobbi/SKILL.md).

The verify-dont-assert mistake recurred twice in one session — once in the Ideation leader, once in the Execution executor — both inside the very feature that codifies verification discipline. This was the trigger for Layer-2 promotion.

The `executor-wrote-to-main-tree-not-worktree` mistake recurred TWICE this session, across two different teammates: the executor at T1 (self-corrected), and the Wrap-up assistant, which wrote all 6 promoted memory files + a Layer-2 copy to the MAIN tree instead of the worktree. The manager caught the second case by verifying disk against the assistant's promotion-manifest (which claimed worktree paths) — the report was trusted-but-verified — then moved all files to the worktree. Two recurrences across two roles in one worktree session is a systemic signal: teammates spawned for a worktree session default to main-tree path resolution for `.gobbi/projects/gobbi/...` writes. No new mistake file (the existing `mistakes/executor-wrote-to-main-tree-not-worktree.md` covers it), but the cross-role recurrence is a candidate for stronger enforcement / Layer-2 next session. Separately, the Wrap-up assistant also made 6 OUT-OF-SCOPE edits to existing main-tree files (2 feature READMEs + `memory/rules.md` + 3 `layer2-*.md`), rewriting flat mistake-paths to area-namespaced form — all wrong (the targets are still flat; the `mistakes/` tree is mid-migration) and all out of this session's scope; the manager reverted all 6.

## What shipped

- `skills/skill-writing/SKILL.md` — reference skill for authoring gobbi skills (commit `4e7c68a`)
- `skills/agent-writing/SKILL.md` — reference skill for authoring gobbi agents (commit `4e7c68a`)
- `features/agents/README.md` — feature bootstrap (this Wrap-up)
- `archive/decisions/process/2026-07-19-skill-loadability-and-map-placement.md` — historical DD-1/DD-5/DD-3 contract, superseded on 2026-07-19
- `mistakes/verification/verify-dont-assert-taught-facts.md` — promoted mistake, Layer-2 candidate (this Wrap-up)
- `archive/backlogs/docs/2026-07-21-claude-doc-authoring-standard.md` — historical deferred backlog,
  closed after the redesign removed its dangling inbound references
- `archive/backlogs/tooling/2026-07-20-claude-skills-mirror-gap.md` — deferred backlog (this Wrap-up)

## What got stuck

Nothing blocked. Both skills shipped cleanly after two rounds of evaluation remediation.

## What shifted

- DD-1 was initially drafted with wrong loadability semantics (Skill() = discoverability gate). Evaluators corrected it to the 4-axis model. The correct model is now locked in the decision and in the skill itself.
- The "verify EVERY taught fact" lesson broadened from big mechanisms to small embedded counts and worked examples — the refined pattern is recorded in the promoted mistake.

## Decisions to respect

- **DD-1 (loadability):** `user-invocable: true`, `disable-model-invocation: false`, no `Skill()` entry, leave `settings.json` unchanged. Do not re-litigate.
- **DD-3 (file shape):** standalone single-file SKILL.md for each meta-skill.
- **DD-5 (skill-map):** one prose paragraph in value-features section; no table row. Meta-skills carry no Loop/Cross-cutting/Supporting row.
- **verify-dont-assert-taught-facts:** any future skill-writing work MUST run every command the skill teaches before shipping; count every "exactly N" claim against the live tree; read the script body for any wiring claim.
- **Layer-2 promotion (DONE):** `verify-dont-assert-taught-facts` is promoted to Layer-2 at `skills/mistake/layer2-verify-dont-assert-taught-facts.md` — the established layer2 convention (a cross-project recall copy carrying `layer: 2` + a `layer2-source` pointer to the project record `mistakes/verification/verify-dont-assert-taught-facts.md`). User-approved this session. (The layer2 files live only in canonical `skills/mistake/`; per the existing convention they are NOT per-file mirrored into `.claude/skills/mistake/` — the `.agents/skills/mistake` whole-dir symlink covers Codex.)

## Next session

- No pickup remains for
  `archive/backlogs/docs/2026-07-21-claude-doc-authoring-standard.md`; its missing-skill premise was
  addressed when the active inbound references were removed.
- Pick up `archive/backlogs/tooling/2026-07-20-claude-skills-mirror-gap.md` (low) during the next mirror audit.
- The `verify-dont-assert-taught-facts` mistake recurred twice in one session; the next session writing a skill must treat it as `critical` for that task's domain.

## Related

- [[verify-dont-assert-taught-facts]] — promoted mistake, Layer-2 candidate
- [[skill-loadability-and-map-placement]] — decision locked this session
- [[claude-doc-authoring-standard]] — deferred backlog
- [[claude-skills-mirror-gap]] — deferred backlog
