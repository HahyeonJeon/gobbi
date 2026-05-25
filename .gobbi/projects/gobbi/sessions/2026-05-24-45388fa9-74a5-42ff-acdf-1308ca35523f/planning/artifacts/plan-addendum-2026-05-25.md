---
loop: planning
artifact_type: plan-addendum
created_at: 2026-05-25
status: locked
supersedes-note: "Does NOT supersede plan.md. Amends it: expands T03 scope and appends T07. T04/T05/T06 unchanged."
related:
  - planning/artifacts/plan.md
  - ../../backlogs/gobbi-mistake-promote-command-does-not-exist.md
  - execution/staging/decisions/proposed-deleting-model-instead-of-fixing-stale-mechanism.md
---

# Plan Addendum — Bundle C follow-up session (2026-05-25)

Authored by the manager during the post-/clear resume of session `2026-05-24-45388fa9`.
Amends the locked iter3 plan (`plan.md`) under explicit user approval (4 AskUserQuestion
decisions, 2026-05-25). The locked plan's T01/T02 are shipped; T04/T05/T06 are unchanged.
This addendum (1) expands T03 scope and (2) appends a new task T07.

## Trigger / witness

Backlog `gobbi-mistake-promote-command-does-not-exist.md` (user-correction-2026-05-25):
the `gobbi mistake promote` CLI command does not exist; it is referenced as a v0.4.x
CLI-era artifact across CLAUDE.md + mistake/SKILL.md + (discovered this session)
gobbi/SKILL.md. The user deferred the fix to this follow-up session.

## User decisions locked this session (UL-1..UL-4, 2026-05-25)

| UL | Decision |
|---|---|
| UL-1 | Include the `gobbi mistake promote` defect fix in this session. Fold the `mistake/SKILL.md` rewrite into T03 (honors D-7 sole-owner); add new task T07 for the non-mistake-skill surfaces. |
| UL-2 | **KEEP the two-layer promotion model.** Do NOT drop Layer 2. (Reverses an earlier mis-framed "drop Layer 2" selection — see the staged correction `proposed-deleting-model-instead-of-fixing-stale-mechanism.md`.) |
| UL-3 | Mechanism: the `gobbi mistake promote` CLI is replaced by **agent-driven promotion during the Wrap-up phase** (no CLI). Both layers attributed to Wrap-up-phase agents. |
| UL-4 | Include `gobbi/SKILL.md` (lines 189-192) in the fix, and **wire Layer 2 into wrap-up/SKILL.md** (project mistakes → workspace-level skill storage, performed by the Wrap-up assistant; preserve existing workspace-level destination wording). |

These do not re-open DL-1..DL-7 (still binding). They are additive to the locked plan.

## T03 — EXPANDED scope (CL-3, plus folded promote-ref rewrite)

Original locked T03 (unchanged): (a) add `hooks` to domain-tag examples at `mistake/SKILL.md`
lines 63 + 90; (b) rewrite `{session-id}` Path-conventions row at line 129 to canonical M2
wording (3 locked clauses per DL-5); plus `hooks-domain-mistakes-watchlist.md` clarifier.

FOLDED addition (UL-1 + UL-2 + UL-3): in the SAME file open / SAME commit, rewrite the 5
`gobbi mistake promote` references in `mistake/SKILL.md`:
- line 3 (frontmatter `description:`), line 11 (staging→promotion body), line 27
  (`**Promotion**:` note), line 47 (`> **Promotion is a separate command...**` heading +
  body), line 96 (P4 `### Reference the promotion command`).
- Replace every CLI reference with: promotion is performed by **agents during the Wrap-up
  phase** (Wrap-up MEMORIZATION / the Wrap-up assistant). No `gobbi mistake promote` command.
- KEEP the two-layer model framing.
- Reconcile the "agents never write directly to project memory" claim (lines 3, 11): clarify
  that the Wrap-up phase is the documented sole-writer/promotion exception (agents DO write
  promoted mistakes to project memory during Wrap-up).

Added success criteria for the fold (verified in T03 EVAL alongside the locked SC-3.x):
- F-T03-1: zero occurrences of the literal `gobbi mistake promote` remain in `mistake/SKILL.md`.
- F-T03-2: the two-layer model is still present (Layer-1 + Layer-2 language retained).
- F-T03-3: promotion attributed to the Wrap-up phase / Wrap-up agent (≥1 explicit mention).
- F-T03-4: the absolute "agents never write directly to project memory" phrasing is reconciled
  (no remaining unqualified claim that contradicts Wrap-up's sole-writer role).

## T07 — NEW task (promote-ref / Layer-2 fix outside mistake/SKILL.md)

- **Depends on:** T06. **Blocks:** — (last implementation task). **Sequence:** T06 → T07.
- **agent-type:** executor (sonnet). **eval-policy:** dual-system (Claude + Codex).
- **Files (op):**
  - `.claude/CLAUDE.md` — modify. Reword line 48 heading + line 50 body (drop the
    `gobbi mistake promote` command; attribute promotion to the Wrap-up phase by agents,
    keep the two-layer model). Reconcile line 13: `packages/cli/src/specs/` +
    `gobbi workflow init` are stale (packages/cli was wiped at e083fad; CLI not used) —
    replace with the actual current mechanism (the workflow state machine lives in the
    orchestration skill; skill-driven, no CLI). State the current truth; do not invent.
  - `.claude/skills/gobbi/SKILL.md` — modify lines 189-192: keep the two-layer model, reword
    Layer 2's mechanism from `gobbi mistake promote` (CLI, post-session) to Wrap-up-phase
    agent promotion. Preserve the workspace-level destination wording ("workspace-level skill
    storage … persist across all projects").
  - `.claude/skills/wrap-up/SKILL.md` — modify: ADD a concise Layer-2 promotion responsibility
    (project mistakes → workspace-level skill storage, performed by the Wrap-up assistant).
    This makes the two-layer model internally complete (no "model described, mechanism
    missing" gap). Do NOT disturb T06's M2 `{session-id}` Path-conventions edit to this file.
  - `.gobbi/projects/gobbi/backlogs/gobbi-mistake-promote-command-does-not-exist.md` — modify:
    `status`/`disposition` → addressed; append `## Resolution` citing T03 + T07.
- **files-must-not-touch:** `mistake/SKILL.md` (T03 owns it); the 10 CL-5 sweep files'
  M2 rows (T06 owns those edits — T07 only ADDS the Layer-2 section to wrap-up/SKILL.md,
  must not alter T06's `{session-id}` row); any session.json/state.json/settings.json.
- **Success criteria (verified in T07 EVAL):**
  - SC-T07-1: zero `gobbi mistake promote` occurrences remain in CLAUDE.md, gobbi/SKILL.md.
  - SC-T07-2: CLAUDE.md line 13 no longer cites `packages/cli/src/specs/` or `gobbi workflow init`
    as the live mechanism; replacement is factually consistent with the current tree.
  - SC-T07-3: gobbi/SKILL.md still presents the two-layer model; Layer 2 mechanism = Wrap-up
    agent promotion.
  - SC-T07-4: wrap-up/SKILL.md contains a Layer-2 promotion responsibility (project mistakes →
    workspace-level storage) attributed to the Wrap-up assistant.
  - SC-T07-5: T06's M2 `{session-id}` row in wrap-up/SKILL.md is intact (regression check).
  - SC-T07-6: backlog `gobbi-mistake-promote-command-does-not-exist.md` status/disposition
    addressed + `## Resolution` present.

## Revised DAG

`T01 → T02 → T03(expanded) → T04 → T05 → T06 → T07` (strict sequential; Bundle C = one PR).

## File-overlap audit (revised)

- `mistake/SKILL.md`: T03 only (fold respects D-7 sole-owner).
- `gobbi/SKILL.md`: T07 only (excluded from T06 per iter2 H1; the exclusion was about the M2
  sweep, not this defect — no lock violated).
- `wrap-up/SKILL.md`: T06 (M2 `{session-id}` row) then T07 (ADD Layer-2 section) — sequential,
  disjoint sections, no content conflict. T07 carries a regression check (SC-T07-5).
- `CLAUDE.md`: T07 only (real file; not a skill symlink).
