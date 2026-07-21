---
name: workflow-state-record-coherence-fix-plan
description: 4-task sequential decomposition of the Cluster-1 review-fix design (GEN-D1-001/D1-003/D7-001/D7-002) into FIX tasks
type: plans
scope: feature
feature: workflow
status: completed
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [planning]
keywords: [cluster-1, GEN-D1-001, GEN-D1-003, GEN-D7-001, GEN-D7-002, fix-plan]
author: claude
task: workflow-state-record-coherence-fix
task_count: 4
supersedes: null
superseded_by: null
archived_at: 2026-07-20
archive_reason: completed
---

# Planning Draft — Workflow-State + RECORD Coherence FIX (4 tasks)

Decomposition of the LOCKED design (`1-ideation/outputs/design-package.md`, fuller detail
`1-ideation/working/draft-iter3.md`) into 4 sequential FIX tasks. The fix sequence is LOCKED by the
design (state-machine group then RECORD/audit group; Execution is sequential). Decomposition only — no
skill/doc edit made here; no design change. All 4 directions are Always-Ask (they edit gobbi skills).

## Scope reference

- Project: gobbi. Feature: `workflow-state-record-coherence`. Worktree canonical root:
  `.../worktrees/claude-2026-07-03-bf4dc336-65bd-4a52-9055-d79fc82b7e2e/.gobbi/projects/gobbi/skills/...`.
- Scope Contract (locked, from `1-ideation/working/draft-iter3.md` §Scope Contract): reconcile the 4
  Codex High findings GEN-D1-001 / GEN-D1-003 / GEN-D7-001 / GEN-D7-002 (each a doc promising a
  state/record the schema or reader cannot represent). Each finding's LOCKED direction:
  - GEN-D1-001 → (a) drop the RE-IDEATE **verdict**; re-Ideate stays a Preparation DISCUSSION user decision.
  - GEN-D1-003 → (b) base RECORD per slice in Chat + extend the Wrap-up promotion inventory (2-file fix).
  - GEN-D7-001 → split fresh initialization from resume rehydration (concrete resume signal + 4 invariants).
  - GEN-D7-002 → runtime-aware RECORD branch on the EXISTING `session.json.system` (no schema change).
- Out-of-scope (do NOT absorb): all other findings; GEN-D7-004 (document `chat/tasks/` in
  `record/record-map.md` + scaffold scripts) — deferred; the `skills/claude/SKILL.md` dangling ref.

## File map (grouped by fix / subsystem concern)

**State-machine group (T01, T02):**
| File | Touched by | Change |
|---|---|---|
| `orchestration/SKILL.md` | T01 (edit), T04 (edit — group2) | Step 1 fresh-vs-resume split; row-4 `ideation.state="Active"` made fresh-only; add resume "Rehydrate state.json" row |
| `gobbi/SKILL.md` | T01 (edit), T04 (read-only) | §6 "first productive step is Ideation" → fresh-only + resume branch; classify glossary restatement `:135-136` |
| `orchestration/auto-mode.md` | T01 (`:64`), T02 (`:92,:100`) | T01: fix hardcoded rows-1-4 enum for the split; T02: RE-IDEATE verdict → user-decision wording |
| `orchestration/workflow/preparation.md` | T02 | delete the RE-IDEATE verdict-table row (`:117`) |
| `preparation/SKILL.md` | T02 (edit), T04 (validate-only `:386`) | `:15` reword to DISCUSSION re-entry; normalize uppercase RE-IDEATE `:222,:280,:368` |
| `preparation/evaluation.md` | T02 (optional, classify) | 7 uppercase RE-IDEATE hits — normalize wording; KEEP the surviving DISCUSSION-model lens |

**RECORD/audit group (T03, T04):**
| File | Touched by | Change |
|---|---|---|
| `orchestration/chat-mode.md` | T03 | remove §4 Steps 6-7 skip + mine/reconstruct promise; retarget ALL "narrowed PASS path" restatements to base RECORD |
| `wrap-up/SKILL.md` | T03 | extend promotion inventory (`:75` rule, `:159` Inputs, `:172` Step-2; check `:30` access-matrix) to glob the Chat staging subtree |
| `record/record-map.md` | T03 (G2 optional `:223-233`), T04 (`:158-162`) | T04: transcript rules add Codex-null degraded case; T03(G2, Always-Ask): one-line F-P2 chat/tasks parity cross-ref |
| `record/SKILL.md` | T04 | `:191` system-branch; `:198`/`:253` runtime-aware clarifier + "per-loop restatements inherit" line |
| per-loop RECORD exit checklists | T04 (VALIDATE-only, no edit) | `ideation:457` / `planning:453` / `preparation:386` / `execution:241` DEFER; confirm each carries the "Canonical procedure … do not re-derive" note |

## Tasks

Each task = one focused commit. Every FIX brief inherits the Cross-cutting execution rules block below.

```yaml
id: T01-d7-001-split-fresh-init-resume-rehydration
what: Split fresh initialization from resume rehydration in Config Step 1 + entry, so a resumed session continues its persisted active step instead of re-stamping Ideation=Active.
finding: GEN-D7-001
group: state-machine (1 of 2)
traces-to:
  - "Golden — D7-001: Resume a session whose state.json.workflow.execution.state=Active → manager detects resume, validates, renders Execution active, continues. Config does NOT re-stamp Ideation=Active."
  - "Edge — D7-001 (mode reconfigure): user legitimately reconfigures mode on resume → resume-validation invariant #4 validates state.json.mode against CURRENT settings.json, re-stamps mode, keeps the active step — does NOT NEEDS_CONTEXT-halt."
  - "Implementation Checklist: D7-001 — split fresh/resume at orchestration/SKILL.md Step 1 + gobbi/SKILL.md §6 + edit auto-mode.md:64; concrete resume signal; 4 invariants (mode-refined); fail-safe to NEEDS_CONTEXT (I-3)."
requires: []
scope-in:
  - "gobbi/SKILL.md §6 (content at :104, 'The first productive step is Ideation'): add a fresh-vs-resume branch — fresh enters Ideation; resume continues the persisted step. Classify + keep-consistent the glossary restatement at :135-136."
  - "orchestration/SKILL.md Step 1 procedure table: make the row-4 `workflow.ideation.state=\"Active\"` stamp (:107) FRESH-ONLY; add a resume 'Rehydrate state.json' row that reads+validates state.json and renders the active step; keep row-2 create-if-absent. Read-anchors (no edit): :179/:243 name state.json the recovery source — the new resume row is the reader they imply."
  - "orchestration/auto-mode.md:64 — its hardcoded 'rows 1-4: Create Worktree → Resolve Settings → Init state.json → Init session.json' enumeration is stale under the split; either update it to reflect the fresh/resume split OR remove the enumeration so it truly defers to the SKILL.md canonical table."
  - "Encode the concrete resume SIGNAL (F-STRUCT-1): resume iff settings.json exists AND session.json.previousSessionId is non-null AND a valid state.json carries a non-configuration Active/Revising step; fresh iff row-1 reports worktreePath:null OR no prior state.json/settings.json."
  - "Encode the 4 resume-validation invariants: (1) exactly ONE workflow entry Active/Revising; (2) earlier steps Done/Skipped; (3) later steps not Done unless active step is after them; (4) mode — validate state.json.mode against CURRENT settings.json; an intended reconfigure is legitimate (re-stamp mode, keep active step). Halt to NEEDS_CONTEXT ONLY on a genuinely inconsistent state.json (invariants 1-3 broken), NEVER on an intended reconfigure."
scope-out:
  - "NO template edit (state.template.json / session.template.json stay unchanged — the recommended direction reads existing state.json)."
  - "chat-mode.md:136 and :458 are VERIFY-ONLY read-anchors (they defer to SKILL.md) — confirm they still read correctly; do NOT edit."
  - "Do NOT touch orchestration/SKILL.md:177 (that is T04's transcript RECORD row)."
files:
  - {path: ".gobbi/projects/gobbi/skills/gobbi/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/auto-mode.md", op: modify}
verifies:
  - "git grep -ni 'first productive step is' -- .gobbi/projects/gobbi/skills/gobbi/SKILL.md  →  fresh-session-only wording (resume branch documented)."
  - "git grep -n 'ideation.state = \"Active\"' -- .gobbi/projects/gobbi/skills/orchestration/SKILL.md  →  the stamp sits inside a fresh-only row."
  - "git grep -ni 'rows 1-4' -- .gobbi/projects/gobbi/skills/orchestration/auto-mode.md  →  either updated for the split or the enumeration removed (deferring to SKILL.md)."
  - "Dry-run 1: seed settings.json present + state.json.workflow.planning.state=Active → resume renders Planning active, does NOT alter workflow.ideation."
  - "Dry-run 2: seed fresh (no settings/state) → bootstrap stamps Configuration Done + Ideation Active."
  - "Dry-run 3: seed a resume where the user reconfigures mode → resume re-stamps state.json.mode, keeps the active step, does NOT halt. Seed an inconsistent state.json (two Active steps) → resume surfaces NEEDS_CONTEXT."
done-definition: "All three edit files carry the fresh/resume split with the concrete signal + 4 invariants + NEEDS_CONTEXT fail-safe; all three greps + three dry-run traces pass; one focused commit."
```

```yaml
id: T02-d1-001-drop-re-ideate-verdict
what: Collapse re-Ideate to the DISCUSSION user-decision model and remove the RE-IDEATE verdict framing the evaluator/aggregation/state schema cannot emit.
finding: GEN-D1-001
group: state-machine (2 of 2)
traces-to:
  - "Golden — D1-001: Preparation DISCUSSION, a gap is unworkable → user picks re-ideate → Preparation halts, re-enters Ideation, iter unchanged. No evaluator verdict is ever RE-IDEATE."
  - "Implementation Checklist: D1-001 — collapse re-Ideate to the DISCUSSION model; excise the 3 verdict sites; normalize uppercase RE-IDEATE at preparation/SKILL.md:222,280,368 + preparation/evaluation.md (I-1)."
requires: [T01-d7-001-split-fresh-init-resume-rehydration]   # same state-machine group; sequence after T01; T01 must NOT add a new state/verdict (post-fix invariant)
scope-in:
  - "orchestration/workflow/preparation.md:117 — DELETE the verdict-table row `| RE-IDEATE | Special verdict … |`; state re-Ideate exits before WORK/EVALUATION so it never reaches aggregation."
  - "orchestration/auto-mode.md:92 — replace 'A RE-IDEATE verdict in row 5 re-enters Ideation' with a user-confirmed re-ideate DISCUSSION-decision wording."
  - "orchestration/auto-mode.md:100 — remove the row-5 `RE-IDEATE → re-enter Step 2` verdict route from the ITER/EXIT table; re-ideate is a DISCUSSION exit, not a row-5 verdict."
  - "preparation/SKILL.md:15 — reword to a DISCUSSION re-entry (re-ideate is a per-gap resolution, not a verdict)."
  - "preparation/SKILL.md:222,280,368 — normalize uppercase RE-IDEATE wording to the DISCUSSION trigger/decision (Sub-step D routing :222; Decisions-log template :280; PASS-artifact note :368)."
  - "OPTIONAL preparation/evaluation.md:261,270-273,297,304,319 — normalize the 7 uppercase RE-IDEATE hits to 're-ideate trigger/decision/escalation'; these describe the SURVIVING DISCUSSION-model classification — KEEP the evaluator lens, drop only verdict-implying casing."
scope-out:
  - "NO template edit (state.template.json unchanged — do NOT add a RE-IDEATE enum; that is the rejected alternative b)."
  - "Do NOT delete the dominant DISCUSSION-model KEEP sites: preparation.md:40,48,51-54,84 and preparation/SKILL.md:48,52,110,116,141,145,169,194,206,211,220,226,341,445 — classify every hit; excise ONLY the 3 verdict sites (preparation.md:117, auto-mode.md:92, :100)."
  - "Do NOT touch auto-mode.md:64 (that is T01's rows-1-4 edit — re-grep by content; the line will have drifted after T01)."
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/preparation.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/auto-mode.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/preparation/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/preparation/evaluation.md", op: modify}   # optional — include only if wording-normalization is needed
verifies:
  - "git grep -nE 'RE-IDEATE.*verdict|verdict.*RE-IDEATE|Loop verdict.*RE-IDEATE' -- .gobbi/projects/gobbi/skills  →  ZERO."
  - "git grep -ni 'RE-IDEATE' -- .gobbi/projects/gobbi/skills/preparation .gobbi/projects/gobbi/skills/orchestration  →  only trigger/classification wording remains (classify EACH hit; not a hard gate — a legitimate DISCUSSION-trigger mention is expected to survive)."
  - "Trace: one user-confirmed re-ideate DISCUSSION row produces no Preparation evaluation files, no Preparation RECORD verdict, workflow.preparation.iter unchanged, Ideation Active."
done-definition: "The 3 verdict sites are excised; DISCUSSION-model sites preserved + casing normalized; verdict grep returns zero; the residual RE-IDEATE grep is classified all-DISCUSSION; one focused commit."
```

```yaml
id: T03-d1-003-chat-record-per-slice-wrapup-inventory
what: Make Chat run full base RECORD per slice and extend the Wrap-up promotion inventory to glob the Chat staging subtree, so Chat-mode typed findings reach durable memory.
finding: GEN-D1-003
group: record/audit (1 of 2)
traces-to:
  - "Golden — D1-003: Chat slice EVALUATION PASS → slice RECORD runs full base Steps 6-7, staging typed findings to chat/tasks/{NN}-{slug}/{N}-{loop}/staging/ → Wrap-up's extended inventory globs chat/tasks/*/{N}-{loop}/staging/ (+ .../4-execution/task-*/staging/) and promotes. No mining."
  - "Implementation Checklist: D1-003 — (i) chat-mode.md §4 removes the Step 6-7 skip (full base RECORD per slice) + removes the mine/reconstruct promise; (ii) wrap-up/SKILL.md extends the inventory to glob the Chat staging subtree (I-2)."
requires: [T02-d1-001-drop-re-ideate-verdict]   # RECORD/audit group starts after the state-machine group completes (sequential Execution)
scope-in:
  - "orchestration/chat-mode.md §4 (R5-lock :246-281): remove the Steps 6-7 skip (:254-257) so Chat runs the UNMODIFIED base record/SKILL.md procedure per slice; remove the 'Wrap-up mines transcript/task-records/reconstructs' promise (:271-278), the §5 pointer (:314), and §6.5 (:427-429). Keep task-record.md as a user-facing review/navigation artifact only."
  - "orchestration/chat-mode.md — retarget EVERY 'narrowed PASS path' restatement to 'Chat RECORD runs the unmodified base record/SKILL.md procedure'. Enumerate case-INSENSITIVELY (I-5: 10 case-sensitive vs 13 case-insensitive hits): :83,:102,:108,:123-124,:153,:183,:201,:225,:234,:236,:314,:427-429,:512,:518,:522,:595-597 + the §4 block. Grep-driven, not eyeball — classify each hit."
  - "wrap-up/SKILL.md — EXTEND the promotion-inventory to ALSO enumerate `chat/tasks/*/{N}-{loop}/staging/` and `chat/tasks/*/4-execution/task-*/staging/` at: the promotion-inventory rule (:75), the Inputs list (:159, 'all prior loops' staging trees' — G1) — and CHECK the Memory-Access-Matrix READ row (:30) so the source list is consistent everywhere it appears — and Step-2 procedure (:172). Preserve F-P2 and the non-Chat invariant (non-Chat Wrap-up still promotes from 1-ideation..4-execution + interview staging/ only)."
scope-out:
  - "record/SKILL.md UNCHANGED — the base RECORD procedure IS the target Chat now runs; do NOT edit it in this task."
  - "Do NOT document the chat/tasks/ tree in record-map or add scaffold scripts — that is deferred GEN-D7-004. (EXCEPTION: the G2 one-line parity cross-ref at record-map.md:223-233 — Always-Ask; see Carried gaps. Include ONLY if the user accepts the offer at the FIX gate.)"
files:
  - {path: ".gobbi/projects/gobbi/skills/orchestration/chat-mode.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/wrap-up/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/record/record-map.md", op: modify}   # G2 ONLY — Always-Ask; the :223-233 parity cross-ref, if the user accepts
verifies:
  - "git grep -niE 'narrowed PASS path|steps skipped|mine the session transcript|reconstruct typed findings|task-record.*(promotion|staging)' -- .gobbi/projects/gobbi/skills/orchestration/chat-mode.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md  →  ZERO (minus any deliberately-marked obsolete note)."
  - "git grep -n 'chat/tasks/\\*' -- .gobbi/projects/gobbi/skills/wrap-up/SKILL.md  →  shows the two new inventory globs present at EVERY intended site (:75 rule, :159 Inputs, :172 Step-2 — not just 2; G1 completeness check)."
  - "git grep -ni 'Promotion-inventory rule' -- .gobbi/projects/gobbi/skills/wrap-up/SKILL.md  →  still names staging/ as the only source class (now including the Chat staging subtree)."
  - "Dry-run: a Chat slice reaches Ideation PASS → RECORD writes chat/tasks/NN-slug/1-ideation/{outputs,staging}/… ; Wrap-up Step 2 inventories that staging and promotes it; it does NOT read transcript/task-record/evaluation as promotion sources."
done-definition: "chat-mode.md narrowed-PASS model fully excised (case-insensitive grep zero); wrap-up inventory extended at all enumerated source sites incl. :159 (G1); non-Chat invariant + F-P2 preserved; dry-run trace passes; one focused commit."
```

```yaml
id: T04-d7-002-runtime-aware-transcript-audit-branch
what: Add a runtime-aware RECORD branch on the existing session.json.system so a Codex null transcriptPath is a degraded-audit pass, not a false Critical + false transcript-copy-contract failure.
finding: GEN-D7-002
group: record/audit (2 of 2)
traces-to:
  - "Golden — D7-002: Codex session, transcriptPath=null → RECORD skips raw copy, writes a lower-severity general/process audit-degraded note, PASSES Step 9 VERIFY + the base AND every per-loop exit checklist, continues. Claude Code missing transcript → still Critical + VERIFY-fail + gate-2 block."
  - "Edge — D7-002 (per-loop restatement, iter3): a per-loop exit checklist restates 'transcript copied' but its RECORD section is MISSING the 'Canonical procedure … do not re-derive' deferral note → the validation grep must catch this. (All 4 loop docs currently HAVE the note — all defer.)"
  - "Implementation Checklist: D7-002 — system-branch at record/SKILL.md:191 + acknowledge the Codex-null degraded case at orchestration/SKILL.md:177, record/SKILL.md:198, :253, record/record-map.md:158-162, AND a one-line runtime-aware clarifier in record/SKILL.md VERIFY/exit-checklist that per-loop restatements inherit (the 4 loop docs + record.md DEFER — no per-loop edit) (I-4)."
requires: [T03-d1-003-chat-record-per-slice-wrapup-inventory]
scope-in:
  - "record/SKILL.md:191 (PRIMARY — the only Critical-raising site): add the `system`-keyed branch. claude-code + absent transcriptPath → Critical general/unevaluable (unchanged; Claude Code guarantees transcripts). codex + null transcriptPath → skip raw copy; write a LOWER-severity general finding (domain process) / audit-coverage-degraded note; continue."
  - "record/SKILL.md:198 (Step 9 VERIFY) — the 'transcript copied' check treats Codex-null as degraded-pass, not a reported failure. record/SKILL.md:253 (base exit checklist) — same."
  - "record/SKILL.md VERIFY/exit-checklist — add ONE runtime-aware clarifier line stating the 'transcript copied' exit gate is runtime-aware (Codex-null = degraded-pass) AND that per-loop exit-checklist restatements INHERIT it. This is the deferral mechanism that makes the 4 loop docs + record.md need NO independent edit."
  - "orchestration/SKILL.md:177 (RECORD row) — note the transcript copy is skipped/degraded under Codex-null. Re-grep by CONTENT (T01 edited this file; the line drifted)."
  - "record/record-map.md:158-162 (transcript rules) — add the Codex-null degraded-audit case."
scope-out:
  - "NO per-loop exit-checklist EDIT: ideation/SKILL.md:457, planning/SKILL.md:453, preparation/SKILL.md:386, execution/SKILL.md:241 DEFER to the amended base — validate (below), do NOT edit."
  - "NO template edit (session.template.json / state.template.json unchanged — that is the rejected alternative with the explicit audit.transcript field)."
  - "gobbi/SKILL.md :62/:67 and codex/SKILL.md :59/:457 are READ-anchors (the branch must stay consistent with them) — optional cross-link only; not required edits."
  - "orchestration/workflow/record.md:63,:328 are descriptive (non-gate) lines — leave consistent; do NOT convert to gates."
files:
  - {path: ".gobbi/projects/gobbi/skills/record/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/record/record-map.md", op: modify}
verifies:
  - "git grep -n 'Critical' -- .gobbi/projects/gobbi/skills/record/SKILL.md  →  the unevaluable-transcript Critical is gated to claude-code / guaranteed-transcript loss, not native-Codex null."
  - "git grep -ni 'codex' -- .gobbi/projects/gobbi/skills/record/SKILL.md .gobbi/projects/gobbi/skills/record/record-map.md  →  Step 2, Step 9 VERIFY, exit checklist, and the record-map rules each acknowledge the Codex-null degraded case."
  - "Per-loop DEFERRAL coverage (iter3): git grep -niE 'each agent transcript copied|transcript copied' -- .gobbi/projects/gobbi/skills/ideation/SKILL.md .gobbi/projects/gobbi/skills/planning/SKILL.md .gobbi/projects/gobbi/skills/preparation/SKILL.md .gobbi/projects/gobbi/skills/execution/SKILL.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md .gobbi/projects/gobbi/skills/orchestration/workflow/record.md  →  for EACH hit confirm its RECORD section carries the 'Canonical procedure: record/SKILL.md … do not re-derive' note OR is a descriptive (non-gate) line; NONE may be an independent FAIL-if-absent assertion. Complement: git grep -n 'Canonical procedure' -- ideation planning preparation execution loop docs → note present in all four."
  - "Dry-run 1: system=codex, transcriptPath=null → no Critical unevaluable; degraded-audit note; Step 9 VERIFY + base AND per-loop exit checklists PASS (via the inherited runtime-aware base)."
  - "Dry-run 2: system=claude-code, transcriptPath=null → Critical general/unevaluable; VERIFY fails loudly."
  - "Dry-run 3: system=codex, valid rollout → normal copy, coverage not degraded."
done-definition: "record/SKILL.md:191 carries the system-branch + the runtime-aware inherit clarifier; the 3 contract surfaces acknowledge Codex-null degraded; per-loop restatements validated as all-DEFER (no per-loop edit); Claude-null stays Critical everywhere; all greps + 3 dry-runs pass; one focused commit."
```

## Dependency table (When)

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| T01 (D7-001) | — | T02, T03, T04 | gobbi/SKILL.md, orchestration/SKILL.md, orchestration/auto-mode.md |
| T02 (D1-001) | T01 | T03, T04 | orchestration/workflow/preparation.md, orchestration/auto-mode.md, preparation/SKILL.md, preparation/evaluation.md |
| T03 (D1-003) | T02 | T04 | orchestration/chat-mode.md, wrap-up/SKILL.md, (record/record-map.md — G2 only) |
| T04 (D7-002) | T03 | — | record/SKILL.md, orchestration/SKILL.md, record/record-map.md |

**Order is strictly sequential: T01 → T02 → T03 → T04.** This is LOCKED by the design fix sequence
(state-machine group `D7-001 then D1-001`, then RECORD/audit group `D1-003 then D7-002`) and by the
gobbi rule that Execution runs one task at a time. No two tasks run concurrently.

## Parallel lanes

Single lane, sequential. No parallelization — every task edits gobbi skill docs and there are real
cross-task file collisions (below). Lanes are documentation only; Execution is sequential regardless.

## Collision map (shared files the executor MUST respect)

Because Execution is sequential and later tasks edit AFTER earlier ones, the design's ABSOLUTE LINE
NUMBERS DRIFT once an earlier task edits a shared doc (readiness gap G3). **Every task locates its edit
site by CONTENT / anchor text and re-verifies the line immediately before editing — never trusts a
stale design line number on a shared file.**

| Shared file | Earlier task (edits first) | Later task | Lines disjoint? | Rule |
|---|---|---|---|---|
| `orchestration/auto-mode.md` | T01 (`:64` rows-1-4 enum) | T02 (`:92,:100` RE-IDEATE) | YES | Sequential (both state-machine group). T02 re-greps `:92/:100` by content — `:64` edit shifted them. |
| `orchestration/SKILL.md` | T01 (`:107` row-4; new resume row) | T04 (`:177` RECORD transcript row) | YES | Cross-group. T04 re-greps `:177` by content — T01's inserted resume row shifted it. Never edit concurrently. |
| `gobbi/SKILL.md` | T01 (edit `:104` §6 + `:135-136`) | T04 (READ `:62/:67` only) | N/A (T04 read-only) | No edit collision; T04 only reads the null-transcript permit anchors. |
| `record/record-map.md` | T03 (G2 ONLY `:223-233` parity) | T04 (`:158-162` transcript rules) | YES (different sections) | Only a collision IF the user accepts the G2 offer. Disjoint sections; T04 re-greps `:158-162` by content. |

Confirmed against the live tree this session: `orchestration/SKILL.md:107` (row-4
`ideation.state="Active"`), `:177` (RECORD transcript-copy row), `:179`/`:243` (state.json
recovery-source); `auto-mode.md:64` (rows-1-4 enum), `:92`/`:100` (RE-IDEATE verdict) — all present
exactly as cited. After T01/T02/T03 land, these numbers are STALE for the later task; re-anchor by
content.

## Agent assignments (Who)

| Task | Agent type | Model | Continue vs Fresh | Required skills | Required mistakes |
|---|---|---|---|---|---|
| T01 | executor | opus | Start E1 (fresh) | principles, mistake, execution, git (+git/mistakes.md), claude (doc-authoring conventions), the design-package + draft-iter3 §GEN-D7-001 | git/mistakes.md (self-edit worktree-path); refactor/cotouch-enumeration-must-cover-semantic-equivalents; refactor/sweep-grep-literal-loop-name-blindspot; verification/grep-absence-claim-needs-exact-pattern; verification/literal-grep-gate-false-fails-legitimate-usage |
| T02 | executor | opus | **Continue E1** (from T01) | same as T01 (+ draft-iter3 §GEN-D1-001) | same as T01 + refactor/namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep |
| T03 | executor | opus | Start E2 (fresh) | principles, mistake, execution, git (+git/mistakes.md), claude, the design-package + draft-iter3 §GEN-D1-003 + readiness G1/G2 | git/mistakes.md; refactor/cotouch-enumeration-must-cover-semantic-equivalents; refactor/sweep-grep-literal-loop-name-blindspot; verification/grep-absence-claim-needs-exact-pattern; verification/literal-grep-gate-false-fails-legitimate-usage; verification/whole-file-allowlist-false-passes-same-file-residual |
| T04 | executor | opus | **Continue E2** (from T03) OR fresh | same as T03 (+ draft-iter3 §GEN-D7-002) | same as T03 + verification/verify-state-from-authoritative-source-not-proxy |

**My call: continue-within-group (2 executor sessions).**
- **E1 handles T01 → T02 (continue).** Recommended. The two share `auto-mode.md` (T01 `:64`, T02
  `:92/:100`) and both touch `orchestration/SKILL.md`. A continued E1 that made the T01 edits carries
  fresh memory of where its own `:64` edit landed, so it re-anchors the T02 `:92/:100` edits without
  trusting a stale line — directly mitigating the intra-group collision. Two tasks is well under the
  delegation ≤3 saturation cap.
- **E2 handles T03 → T04 (continue preferred; fresh acceptable).** Weaker overlap — they share
  `record/record-map.md` only if the G2 parity offer is accepted, and in different sections. Continue
  keeps the record/audit-subsystem context warm; a fresh T04 executor is equally safe because the
  cross-group `orchestration/SKILL.md:177` collision is re-anchored by content regardless (G3). If the
  manager prefers maximal scope isolation, spawn T04 fresh.
- **Alternative: fresh-per-task (4 spawns).** Cleaner scope isolation; higher re-load/re-grep cost.
  Safe because G3 (re-grep by content) is mandatory on every task anyway. Acceptable fallback.
- **Why NOT one executor across all 4:** 4 tasks exceeds the ≤3 saturation cap and mixes two
  subsystems (state-machine vs record/audit) — context bleed risk. Do not.

**Continuation discipline (E1 T01→T02, E2 T03→T04) — inject into each continue delta-brief:** re-`cd`
to the worktree at turn start (cwd resets across turns); use the ABSOLUTE worktree path on EVERY write
(a re-`cd` alone is insufficient — relative writes stray to the main tree); use `git -C <worktree-abs>`
for all git ops; re-state the task scope boundary and the status enum each turn. All executor tasks
default to `executor`/opus (not assistant) because the work is judgment-heavy: classify each grep hit,
never blind-delete a token that appears in a legitimate warning, and enumerate co-touch by concept
case-insensitively — not mechanical edits.

## Cross-cutting execution rules (inject verbatim into EVERY FIX brief)

1. **Edit canonical only — NO `.claude/skills/` re-sync (I-0).** Edit exactly ONE canonical file per
   change under `.gobbi/projects/gobbi/skills/{skill}/...`. `.claude/skills/*` are per-file symlinks to
   canonical; `.agents/skills` + `plugins/gobbi/skills` are dir-symlinks — all mirrors auto-propagate.
   Do NOT run any `.claude/skills/` re-sync. `sync-plugin-package.sh --check` is a symlink-INTEGRITY
   guard only, run once at the end — not a per-fix propagation gate.
2. **Self-edit worktree-path discipline (`git/mistakes.md`).** gobbi edits its OWN skill tree, so the
   worktree nests a duplicate `.gobbi/projects/gobbi/skills/`. Every Read/Edit/Write path MUST be the
   fully-expanded absolute worktree path and MUST literally contain
   `worktrees/claude-2026-07-03-bf4dc336-65bd-4a52-9055-d79fc82b7e2e/`. Never rely on a prior `cd` (it
   resets across tool boundaries). Immediately after the FIRST edit, re-grep the worktree copy to
   confirm the change took there (not in the main tree); if the worktree shows no change, you wrote to
   the wrong tree — stop and fix. Use `git -C <worktree-abs>` for all git ops.
3. **Locate by content/anchor, re-verify the line before editing (G3).** Do NOT trust the design's
   absolute line numbers on any SHARED file — earlier tasks shift them. Grep the anchor text, confirm
   the line, then edit.
4. **Grep case-INSENSITIVELY + classify every hit (I-5).** Between-doc contradiction is the recurring
   failure mode. Enumerate co-touch by CONCEPT across every phrasing, `grep -i`, root-relative `--`
   pathspecs from the worktree root. NEVER blind-delete a token that also appears in a legitimate
   warning / DISCUSSION-trigger / descriptive line — classify each hit as excise-verdict vs keep-model.
5. **Re-run that fix's validation before committing.** Each task's `verifies:` block (greps +
   dry-run traces) must pass on the worktree tree before the one focused commit for that task.
6. **Root-relative pathspecs only.** Every `git grep` uses `-- .gobbi/projects/gobbi/skills/...` from
   the worktree root — bare/subdir-relative pathspecs fatal-error and are the known trap.

**Final validation bundle (after T04, cwd = worktree root):** the per-finding case-insensitive greps
(classified, not hard-gated) + the per-loop exit-checklist deferral grep + one resume trace (D7-001) +
one Chat PASS→Wrap-up trace (D1-003) + `test -L`/`find -L` symlink-propagation re-verify +
`sync-plugin-package.sh --check` (symlink integrity only).

## Self-review report (Sub-step E)

- **Spec coverage:** every Implementation-Checklist item maps to exactly one task — D7-001→T01,
  D1-001→T02, D1-003→T03, D7-002→T04; the two "All:" checklist items (edit-canonical-only; enumerate
  co-touch case-insensitively) map to the Cross-cutting rules injected into all four. No orphan item;
  no task without a checklist anchor.
- **Placeholder scan:** zero `TBD`/`TODO`/`<...>`/`XXX`/`FIXME` in task descriptions or acceptance
  criteria. (The optional `preparation/evaluation.md` in T02 files and `record/record-map.md` in T03
  files are marked conditional, not placeholders.)
- **Type/name consistency:** file paths, finding IDs (GEN-D1-001 / D1-003 / D7-001 / D7-002), and the
  `session.json.system` / `state.json` / `transcriptPath` identifiers are used identically across all
  four tasks and match the design + the live-tree spot-check. No drift.
- **Collision correctness:** the two design-named collisions (auto-mode.md T01↔T02; orchestration/SKILL.md
  T01↔T04) plus the record-map.md T03(G2)↔T04 conditional collision are all captured with disjoint-line
  + re-anchor-by-content handling. Sequential order prevents concurrent edits.
- Clearance: zero outstanding findings.

## NOT in scope

- GEN-D1-002, D1-004, D2/D3/D4/D5/D6, D7-003, D7-005 (other findings — not this session).
- GEN-D7-004: full documentation of `chat/tasks/` in `record/record-map.md` + scaffold-script creation.
  (The G2 one-line parity cross-ref is a bounded Always-Ask offer distinct from this — see Carried gaps.)
- Template edits (`state.template.json`, `session.template.json`) — no recommended direction needs one.
- The `skills/claude/SKILL.md` dangling ref from `.claude/CLAUDE.md` — backlog (G4).

## Carried gaps

**G1 — D1-003 wrap-up in-file co-touch (ABSORBED into T03, not a carry).** The design map cited only
`wrap-up/SKILL.md:75` + `:172`, but the promotion sources are enumerated at FOUR in-file sites: `:30`
(Memory-Access-Matrix READ row), `:75` (rule), `:159` (Inputs), `:172` (Step-2). T03's scope explicitly
adds `:159` to the EDIT set and requires checking `:30` for parity, so wrap-up/SKILL.md is not left
internally inconsistent. Verification: `git grep -n 'chat/tasks/\*' -- wrap-up/SKILL.md` must return
every intended site, not just two. Resolved in-plan.

**G2 — record-map F-P2 parity seam (RECOMMENDATION: fold a one-line cross-ref into T03 as an
Always-Ask offer).** `record/record-map.md:223-233` is the AUTHORITATIVE promotion-inventory rule that
`wrap-up/SKILL.md:78` DEFERS to; its F-P2 note names `interview/staging/` as the sole non-loop
exception. After T03 extends wrap-up to enumerate `chat/tasks/*/staging/`, the deferring doc (wrap-up)
names chat/tasks while the authoritative doc (record-map) it defers to does not — a fresh instance of
the exact between-doc-contradiction class these 4 fixes exist to remove (I-5).
- **My recommendation: at the T03 FIX gate, OFFER the user a one-line F-P2 parity cross-ref inside
  record-map.md:223-233** (naming `chat/tasks/*/staging/` as a parallel non-loop source alongside
  `interview/staging/`). This is preferred over pure D7-004 deferral because shipping without it
  re-introduces the fixed defect class, it is one line, and it is the direct co-touch of the wrap-up
  edit (P9). It is DISTINCT from D7-004 (which is the FULL chat/tasks documentation + scaffold scripts —
  that stays deferred).
- **Why it is Always-Ask, not silent:** the Scope Contract EXPLICITLY defers "documenting chat/tasks in
  record-map" to D7-004. A one-line cross-ref touches that deferred surface, so folding it in is a
  scope-boundary decision the user must make (P5 — no silent scope expansion). If the user declines,
  record the residual inconsistency and keep it with D7-004; do NOT expand scope unilaterally.
- Net: recommend ACCEPT the one-line parity cross-ref (fold into T03); default to the user's call.

**G3 — cite-by-content, not stale line (INJECTED as Cross-cutting rule #3).** Handled as a standing
discipline in every FIX brief; not a separate task.

**G4 — no loadable `.claude/` doc-authoring standard skill (`skills/claude/SKILL.md` absent).** BACKLOG,
not a task. The executor matches the existing prose/table style in each edited canonical doc (all 4
fixes edit established docs with clear local conventions). The dangling `[claude skill]` ref from
`.claude/CLAUDE.md` is a separate pre-existing backlog candidate (own future task), not absorbed here.

## Decisions log

- Task order T01→T02→T03→T04 is LOCKED by the design fix sequence (state-machine group then
  RECORD/audit group) + the sequential-Execution rule. No slicing ambiguity — 4 findings, 4 tasks.
- Agent-assignment call: continue-within-group (E1: T01→T02; E2: T03→T04), executor/opus each; fresh-
  per-task is the accepted fallback. Rationale: intra-group file overlap makes continuation the
  collision-safest for the state-machine group; ≤3 cap respected.
- G1 absorbed into T03 EDIT set (`:159` + `:30` parity check). G2 recommended as an Always-Ask one-line
  parity offer folded into T03 (distinct from deferred D7-004). G3 injected as Cross-cutting rule #3.
  G4 is a backlog item, not a task.
- No design defect found during decomposition. The design's affected-file maps, fix sequence, and
  validation commands were spot-checked against the live worktree tree and match.
