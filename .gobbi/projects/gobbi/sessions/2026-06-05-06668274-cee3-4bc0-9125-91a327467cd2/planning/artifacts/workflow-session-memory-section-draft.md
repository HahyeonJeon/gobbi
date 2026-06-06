---
name: workflow-session-memory-section-draft
description: Verbatim reframed "## Workflow Session Memory" section (replacing orchestration/SKILL.md current "## Canonical session tree", lines 134-176) plus the exact inbound-link repoint edits the rename forces.
type: plans
scope: project
feature: null
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, session-memory, docs-reframe, anchor-rename]
domain: docs
---

# Planning artifact — reframe `## Canonical session tree` → `## Workflow Session Memory`

This artifact is a DRAFT for an executor to land later. It contains:

1. The complete verbatim new `## Workflow Session Memory` section (drop-in replacement for the current `orchestration/SKILL.md` lines 134-176).
2. The exact edit spec for the one inbound reference the H2 rename breaks.
3. A scope note: what was deliberately kept-as-pointer vs. what would have duplicated owner discipline.

---

## SPEC (Principle 13)

- **What:** Rename + procedurally reframe the `## Canonical session tree` H2 in `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` to `## Workflow Session Memory`, so an agent reads it as a *timeline* (when each piece of session memory is written across the workflow lifecycle) plus a *how-to* (who writes it, what the write-root is, that everything is session-scoped until Wrap-up promotes). Keep the directory-tree diagram and the two H3 subsections as the inventory.
- **File type:** `orchestration/SKILL.md` is an instruction-document skill (Principle 14 governs its language). The H3 anchors must be preserved to avoid extra blast-radius; only the H2 anchor changes.
- **Must-not bleed:** Do NOT absorb memorization's staging→promotion discipline, wrap-up's promotion/normalization procedure, git's write-root rationale, or the state.json schema. Those stay owned by their skills; this section carries brief pointers only.

## CRUD plan

- **Update** — `orchestration/SKILL.md` lines 134-176: replace the whole `## Canonical session tree` block (H2 through the trailing `---`) with the verbatim section in §A below. (Executor: anchor the replacement on the literal `## Canonical session tree` heading and the `---` separator that precedes `## Workflow State Machine`.)
- **Update** — `evaluation/SKILL.md` line 98: repoint the one inbound cross-reference (§B below).
- **Read (consistency only, no edit)** — `memorization/SKILL.md` (per-perspective + quartet owner), `wrap-up/SKILL.md` (normalization owner), `git/SKILL.md § Memory Access Matrix` (write-root rule). Pointers in §A target these; confirmed live during this draft.
- **Blast radius — confirmed:** A full grep of the canonical tree (excluding `sessions/`) for both `canonical-session-tree` (anchor) and `Canonical session tree` (text) returns exactly ONE inbound reference outside the section itself: `evaluation/SKILL.md:98`. No other file links the old anchor or names the old section. No `templates/`, `agents/`, `rules/`, `workflow/`, or other skill references it.

---

## A. Verbatim new section (drop-in replacement for current lines 134-176)

> Executor: paste everything between the BEGIN/END fences below verbatim, replacing the current
> `## Canonical session tree` block. Preserve the leading and trailing `---` exactly as in the
> current file (the section is bounded by the `---` after the Status Display block and the `---`
> before `## Workflow State Machine`).

<!-- BEGIN REPLACEMENT -->
## Workflow Session Memory

Every session writes its working memory under one root: `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/`, inside the per-session worktree (the durable write-root is `session.json.git.worktreePath` — see [`git/SKILL.md` § Memory Access Matrix](../git/SKILL.md#memory-access-matrix)). All of it is **session-scoped**: nothing here is project memory until Wrap-up promotes the `staging/` trees. This section is the timeline — *when* across the workflow lifecycle each piece is written, and *who* writes it — followed by the on-disk inventory the timeline refers to.

**Lifecycle — when each piece is written, and by whom.** Read top-to-bottom as the session runs.

| When (workflow moment) | What is written | Who writes it | Where + how |
|---|---|---|---|
| **Configuration (Step 1)** | `state.json` (row 3) and `session.json` (row 4) at the session root | manager | Rooted at the row-1 worktree path; row 4 stamps `git.worktreePath`, the durable write-root for everything after. See [§ Step 1 — Workflow Configuration](#step-1--workflow-configuration). `settings.json` (resolved config) lands here in row 2. |
| **Loop entry (each of Steps 2-6)** | The loop's `{rawdata, staging, evaluation, artifacts}` subdirs (Execution: per-task `task-{NN}/` quartets) | manager | Bootstrapped empty at entry so WORK / EVALUATION / MEMORIZATION can assume the tree exists. |
| **WORK (per iteration)** | `rawdata/draft-iter{n}.md`, transcripts, `discussion-log.md`, `research/{slug}.md`; the owning specialist's `staging/` typed findings | owning specialist (`leader` / `executor` / `assistant`) | `{loop}/rawdata/` is the only scratch surface (no `tmp/` tier — see below). Staging is the Wrap-up promotion source. |
| **EVALUATION (per iteration)** | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `overall.md` | evaluator subagents (one per system) | Bare 7-vocabulary names, same set on both systems — see [§ Per-perspective evaluation file naming](#per-perspective-evaluation-file-naming) below. |
| **MEMORIZATION (per iteration)** | `session.json` UPSERT (iter / verdict); transcript snapshot; cumulative `staging/` findings | `assistant` subagent | Session-scoped only; project-memory promotion is NOT done here. See [`workflow/memorization.md`](workflow/memorization.md). |
| **On PASS (loop exit)** | `artifacts/{free-filename}.md` — the loop's canonical output | `assistant` (MEMORIZATION) | PASS-only; absent on REVISE / FAIL iterations. |
| **Every state transition** | `state.json` updated in place | manager | The live state-machine file used to recover position after `/clear` / `/compact` / resume — see [§ State persistence](#state-persistence). |
| **Wrap-up (Step 6)** | `staging/` trees promoted to project memory; non-canonical session subdirs normalized going-forward | `assistant` (Wrap-up) | The only step that writes project memory. Deviations from the canonical shape below are normalized here — see [`wrap-up/SKILL.md` § Non-standard session-subdir cleanup](../wrap-up/SKILL.md#non-standard-session-subdir-cleanup-going-forward). |

**On-disk inventory.** The canonical shape the lifecycle above writes into:

```
sessions/{date}-{session-id}/
├── session.json              ← per-session telemetry (manager init row 4 + assistant UPSERT)
├── settings.json             ← resolved session config (cascade)
├── state.json                ← per-session workflow state-machine file (manager init row 3; see § State persistence)
├── session.json.lock         ← advisory write-lock guarding concurrent session.json writes (manager; safe to ignore on read)
└── {loop}/                   ← loop ∈ ideation | preparation | planning | execution | wrap-up
    ├── rawdata/              ← draft-iter{n}.md, transcript-iter{n}.jsonl, discussion-log.md, research/{slug}.md
    │                            (the ONLY scratch surface — no separate tmp/ tier; resume/restore scratch lives here, not in restore/)
    ├── staging/{...}/        ← typed-finding stagings (Wrap-up promotion source)
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── artifacts/{free-filename}.md   ← PASS-only
```

**Session-root files.** `session.json` (telemetry), `settings.json` (resolved config), `state.json` (the workflow state-machine file — see [§ State persistence](#state-persistence)), and `session.json.lock` (advisory write-lock the manager creates / releases around each `session.json` write; not memory content — safe to ignore on read).

**No `tmp/` scratch tier.** `{loop}/rawdata/` is the only scratch surface in the canonical tree. A `tmp/` dir or a `rawdata/restore/` sub-tier is non-canonical — resume / restore scratch lives directly in `rawdata/`. Wrap-up removes `tmp/` going-forward (see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)).

### Per-task Execution layout (the quartet)

The Execution loop is per-task. Each task lives under `execution/task-{NN}/` and carries the **full quartet** — `{rawdata, staging, evaluation, artifacts}`:

```
execution/
├── staging/{...}/            ← loop-level (cross-task) staging
└── task-{NN}/
    ├── rawdata/draft-iter{n}.md, transcript-iter{n}.jsonl
    ├── staging/{...}/
    ├── evaluation/iter{n}/{claude,codex}/{perspective}.md + overall.md
    └── artifacts/{free-filename}.md
```

Every `task-{NN}/` gets the full quartet. A task with only `evaluation/` (missing rawdata / staging / artifacts) is an incomplete task layout — the quartet is required unless a task is documented eval-only.

### Per-perspective evaluation file naming

Evaluation outputs are named `evaluation/iter{n}/{system}/{perspective}.md` where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocabulary — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` — plus `overall.md`. **Bare names only**: no `pN-` positional prefix, and the **same 7-perspective vocabulary on both systems** so cross-system reconciliation pairs files 1:1. The 7-perspective vocabulary is owned by [`evaluation/SKILL.md`](../evaluation/SKILL.md); the manager's spawn / reconciliation orchestration is in [`workflow/evaluation.md`](workflow/evaluation.md).

---
<!-- END REPLACEMENT -->

---

## B. Inbound-link repoint — the one edit the rename forces

The H2 rename changes the GitHub-generated anchor `#canonical-session-tree` → `#workflow-session-memory`. Exactly one file links it.

**File:** `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`, line 98 (inside the "single source for evaluation file naming" blockquote).

**OLD (substring to find on line 98):**

```
[`orchestration/SKILL.md` § Canonical session tree](../orchestration/SKILL.md#canonical-session-tree)
```

**NEW (replacement substring):**

```
[`orchestration/SKILL.md` § Workflow Session Memory](../orchestration/SKILL.md#workflow-session-memory)
```

This is a surgical substring replace within line 98 — the rest of the blockquote (including the sibling `[memorization/SKILL.md § Per-perspective ...]` link, which does NOT change) is untouched.

**No other inbound references exist.** Grep of the canonical tree (excluding `sessions/`) for `canonical-session-tree` and `Canonical session tree`:
- `orchestration/SKILL.md:134` — the section heading itself (renamed in §A; this is the source, not an inbound link).
- `evaluation/SKILL.md:98` — the one inbound link (repointed above).

Count of inbound references to repoint: **1**.

---

## C. Scope note — kept-as-pointer vs. would-have-duplicated (tight-scope lock honored)

The locked intent is "reorganize THIS section + add procedural framing, with brief pointers to canonical owners — do NOT absorb discipline those skills own." What I deliberately pointed at instead of copying:

| Topic | Owner pointed to (not duplicated) | Why pointer, not copy |
|---|---|---|
| Write-root / `worktreePath` rule | `git/SKILL.md § Memory Access Matrix` | git owns the write-root contract + the `null`-worktreePath error rule; the section states only "session-scoped, rooted at worktreePath" and links. |
| staging→promotion discipline | `workflow/memorization.md` (per-iter) + `wrap-up/SKILL.md` (promotion + normalization) | memorization owns the every-iter/PASS-only procedure; wrap-up owns promotion + non-canonical cleanup. The section names *when* staging is written and *that* Wrap-up promotes, not *how*. |
| `state.json` schema + recovery | `§ State persistence` (same skill, below this section) | The schema table already lives in this skill; the section links rather than restating fields. |
| 7-perspective vocabulary | `evaluation/SKILL.md` (owner) + `memorization/SKILL.md` (per-perspective + quartet) | The H3 already pointed at evaluation; preserved verbatim so its anchor + ownership chain is unchanged. |
| Configuration row 3/4 detail | `§ Step 1 — Workflow Configuration` (same skill) | Row numbers are correct (worktree=1, settings=2, state.json=3, session.json=4); the timing table cites Step 1 rather than re-explaining init. |

What would have been over-reach (correctly excluded): the full Wrap-up promotion routing table, the memorization frontmatter/allowlist rules, the git Memory Access Matrix tier rows, and the state.json `workflow.chat.tasks[]` schema. All stay owned; the section links.

---

## D. Procedural-shape decision (Principle 5 — reference-first)

**Chosen shape: a lifecycle/timing TABLE**, mirroring the `### Step 1 — Workflow Configuration` procedure already in this same skill (a `# | Action | Description | Refs | Agent` table an agent reads top-to-bottom as a timeline). The user asked for procedural framing that conveys TIMING + HOW-TO without literal "What/When/How" headings; a table whose rows are workflow moments in order and whose columns are *What is written / Who writes it / Where+how* delivers exactly that and matches an existing in-skill reference. An ordered list was rejected because the three-axis content (moment × what × who × how) reads as a grid, not a sequence of prose steps — the table makes the who/where columns scannable, which a list would bury in sentence tails.

**Lifecycle moments the timing table covers (in order):** Configuration → loop entry → WORK (per-iter) → EVALUATION (per-iter) → MEMORIZATION (per-iter) → on-PASS (loop exit) → every state transition → Wrap-up. This is the full Configuration→Wrap-up arc the design guidance asked for, grounded against the `### Step 1` rows and the `### Loop states` / `### Loop ↔ agent type mapping` tables in `## Workflow State Machine` (who-writes-what confirmed: manager bootstraps + state.json; specialist WORK; evaluator EVALUATION; assistant MEMORIZATION + Wrap-up).

**Inventory kept as-is:** the directory-tree diagram (verbatim, now under an "On-disk inventory" lead-in the timing table references), the two H3 subsections (`### Per-task Execution layout (the quartet)` and `### Per-perspective evaluation file naming`) verbatim with their headings unchanged so their anchors and order are preserved (section-order-is-part-of-the-contract mistake honored), and the "Session-root files" + "No `tmp/` scratch tier" paragraphs verbatim.

---

## E. Self-review (planning skill checklist)

- [x] Scope bounded to the contract: rename + procedural reframe + brief pointers; no owner-discipline absorbed.
- [x] Every carried-over fact preserved accurately: tree diagram verbatim; row 4 / row 3 init labels kept; Step-1 row mapping correct (worktree=1, settings=2, state.json=3, session.json=4).
- [x] H3 anchors unchanged (`#per-task-execution-layout-the-quartet`, `#per-perspective-evaluation-file-naming`); only H2 anchor changes.
- [x] All pointer anchors verified live: `git/SKILL.md#memory-access-matrix` (line 17), `wrap-up/SKILL.md#non-standard-session-subdir-cleanup-going-forward` (line 302), `workflow/memorization.md`, `workflow/evaluation.md`, in-skill `#state-persistence` + `#step-1--workflow-configuration` + `#per-perspective-evaluation-file-naming`.
- [x] Inbound blast radius enumerated: exactly 1 (`evaluation/SKILL.md:98`); exact old→new substring given.
- [x] No placeholders / TODO / `<...>` in the drop-in section.
- [x] Plain-literal language (Principle 14); new H2 names its subject directly.
- [x] Executor edits only — this artifact plans; it does not touch target files.
