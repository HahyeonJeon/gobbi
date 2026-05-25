---
title: "Resolve subagent CCSI semantics conflict with skill path conventions"
name: f-risk-01-subagent-ccsi-semantics
type: backlog
severity: medium
confidence: 75
scope: project
source: ideation-iter3-claude-eval
disposition: addressed
created: 2026-05-22
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
status: addressed
project: gobbi
feature: null
task: null
anchor_session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
promoted_from: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/staging/backlogs/project/f-risk-01-subagent-ccsi-semantics.md
promoted_at: 2026-05-22
---

# Resolve subagent CCSI semantics conflict with skill path conventions

## Context

The env-var audit session (2026-05-22-bac669ad) renamed `$CLAUDE_SESSION_ID` to `$CLAUDE_CODE_SESSION_ID` across 12 skill files (13 occurrences). The rename was motivated by the empirical finding that `$CLAUDE_CODE_SESSION_ID` is the runtime-auto-set var (added in Claude Code v2.1.132) while `$CLAUDE_SESSION_ID` was hook-only and typically empty in Bash subshells.

However, when a Task-spawned subagent runs, it receives its own `$CLAUDE_CODE_SESSION_ID` — the subagent's own UUID — **not** the parent session's UUID. Skills that use `$CLAUDE_CODE_SESSION_ID` in "path conventions" snippets (e.g., `sessions/{date}-{session-id}/...` where `{session-id}` is documented as `$CLAUDE_CODE_SESSION_ID`) will emit subagent-scoped paths when executed from a subagent context.

The skills affected include every skill with a "Path conventions" section that mentions `$CLAUDE_CODE_SESSION_ID` as the session-id source — 12 files post-rename (mistake/SKILL.md, wrap-up/SKILL.md, research/SKILL.md, orchestration/workflow/evaluation.md, planning/SKILL.md, execution/SKILL.md, ideation/SKILL.md, memorization/SKILL.md, interview/SKILL.md, evaluation/SKILL.md, preparation/SKILL.md, and gobbi/SKILL.md).

This assumption risk persisted through all 3 Ideation iterations and all 11 accepted fixes. It was acknowledged as a known open assumption and explicitly deferred.

## Why

The practical impact: Memorization (the assistant subagent sub-phase) is spawned as a Task-spawned subagent to do session staging. If Memorization reads `$CLAUDE_CODE_SESSION_ID` to construct its write path (e.g., `sessions/2026-05-22-{CCSI}/ideation/staging/...`), it would construct `sessions/2026-05-22-{subagent-uuid}/...` — a different directory than the manager's session directory `sessions/2026-05-22-{parent-uuid}/...`. The staging write would land in a subagent-scoped path that no downstream loop reads.

Current operational reality: The manager explicitly passes the parent session-id in subagent delegation prompts, so subagents in practice construct paths from the delegated value rather than from `$CLAUDE_CODE_SESSION_ID`. This delegation pattern prevents the bug from manifesting currently. But the skill docs describe `$CLAUDE_CODE_SESSION_ID` as the source — if any agent follows the skill docs literally rather than the delegation prompt, the bug surfaces.

## Candidate mitigations

Three approaches are on the table; this session did not evaluate them:

1. **Skills cite `session.json.sessionId` as the canonical source.** The manager writes `sessionId` to `session.json` during Configuration, sourced from the parent CCSI. All agents read `session.json.sessionId` for path construction instead of `$CLAUDE_CODE_SESSION_ID` from env. Advantage: parent-anchored by design; no delegation-prompt dependency. Disadvantage: requires agents to read `session.json` before constructing any path (adds an I/O step; may complicate bootstrapping before `session.json` exists).

2. **Manager always passes parent-session-id explicitly in subagent delegation prompts (current de facto practice, documented).** Update skills to say "use `{session-id}` from the delegation prompt's `session-id:` field; do NOT read `$CLAUDE_CODE_SESSION_ID` for this value." Advantage: minimal change; codifies current practice. Disadvantage: every delegation prompt must be correct; skills become delegation-prompt-dependent rather than self-contained.

3. **Workflow design treats subagent-scoped runs as separate sessions.** Each subagent has its own session directory and writes to its own `sessions/{date}-{subagent-ccsi}/...`. The manager collects results and merges into the parent session directory. Advantage: clean isolation. Disadvantage: large workflow redesign; incompatible with current single-session-directory model.

## Suggested next step

This topic warrants its own Ideation session to evaluate the three mitigations and surface trade-offs. It is cross-feature (affects all 12 skills, all loops, all subagent delegation patterns) and should be scoped as a project-level design decision rather than tacked onto a feature session.

Prerequisites before picking up: the env-var audit session (2026-05-22-bac669ad) should be merged first, so the `$CLAUDE_CODE_SESSION_ID` rename is settled baseline. Then scope this as a follow-up Ideation on "subagent path-construction semantics."

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/`

Finding source: `evaluation/iter1/claude/overall.md` Karpathy mode 1 (F-RISK-01), first surfaced iter1, persisted through iter2 and iter3 as open assumption risk. Confidence 75, severity Medium (operational risk is low given current delegation-prompt practice, but documentation risk is high if any agent follows skill docs literally).

## Resolution

Addressed in session `2026-05-24-45388fa9` (Bundle C, task T06, CL-5) by the M2 documentation sweep across 10 skill files.

**Mitigation chosen: M2** (candidate 2 — manager passes parent session-id in the delegation prompt's `session-id:` field; skills now explicitly state to read from the delegation prompt, NOT from `$CLAUDE_CODE_SESSION_ID`).

**M1 and M3 were explicitly NOT chosen:** M1 (read from `session.json.sessionId`) was rejected as it adds an I/O bootstrapping dependency; M3 (separate subagent sessions) was rejected as a large workflow redesign incompatible with the current single-session-directory model. These decisions are locked at DL-5 (idea.md, session `2026-05-24-45388fa9`).

**Scope of the M2 sweep (T06 — this task):** 10 skill files updated — `evaluation/SKILL.md`, `execution/SKILL.md`, `ideation/SKILL.md`, `interview/SKILL.md`, `memorization/SKILL.md`, `orchestration/workflow/evaluation.md`, `planning/SKILL.md`, `preparation/SKILL.md`, `research/SKILL.md`, `wrap-up/SKILL.md`. Each file's `{session-id}` Path-conventions row now states the three locked M2 clauses: (CLAUSE-1) id comes from the delegation prompt's `session-id:` field, (CLAUSE-2) do NOT read `$CLAUDE_CODE_SESSION_ID` for this value, (CLAUSE-3) that env-var holds the subagent's own UUID, not the parent session's.

**T03 (CL-3):** `mistake/SKILL.md` was updated in task T03 (earlier in this session) with the same M2 wording. It was excluded from T06 scope to avoid cross-task conflict.

**gobbi/SKILL.md excluded (iter2 H1 downscoping):** `gobbi/SKILL.md` has no Path-conventions section and no `{session-id}` row. Its 3 CCSI mentions are env-var passthrough tables and Gate-1 runtime health-check prose — not M2 codification surfaces. Adding a section would be CL-5 scope expansion (Iron Law 4). It remains untouched.

**Codification artifact:** idea.md DL-4 (M2 selected) and DL-5 (M2 wording locked verbatim), session `2026-05-24-45388fa9`.

**closed_by:** (set post-merge — placeholder, do not substitute SHA until the PR lands on develop)
