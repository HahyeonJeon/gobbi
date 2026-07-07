---
name: workflow-compaction-two-doc-kind
description: Two-doc-kind compaction pattern (loop-orchestration + gate-orchestration) for orchestration/workflow/*.md, with a hoist-then-point pointer mechanism and a drift guard.
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [compaction, orchestration-workflow, doc-kind, pointer-mechanism, drift-guard, hoist-then-point]
author: claude
---

# Workflow-doc compaction design — two doc kinds, hoist-then-point pointers, drift guard

**Validated core (kept intact across two iterations).** The two-kind split
(`loop-orchestration` / `gate-orchestration`), the visible `**Doc kind:**` marker, the typed
owner pointers, and the rule+guard drift strategy. Both independent producers (Claude + Codex),
then both independent dual-system evaluators, converged on this core — the anti-groupthink
signal held. Iteration 1 canonical output surfaced 8 findings on REVISE; this design folds in
every fix (see `## Revision log` below).

---

## Study — evidence base (exhaustive greps, not the brief's named files)

Per the blast-radius trap ([[blast-radius-map-from-named-files-not-exhaustive-grep]]), every
duplication claim is a form-covering grep across ALL 8 `workflow/*.md` + the 7 peer skills.

**Verified line counts (live):** `evaluation.md` 328 · `record.md` 347 · `ideation.md` 184 ·
`preparation.md` 158 · `planning.md` 156 · `execution.md` 145 · `production.md` 137 ·
`wrap-up.md` 84 → **1,539 total**. Peer skills: ideation 512 · preparation 446 · planning 516
· execution 296 · wrap-up 600 · evaluation 597 · record 371. `record-map.md` 284.

**Verified duplication + its REAL owner status (the hoist-then-point correction, F-CONSIST-1).**
A pointer is only valid if the owner ALREADY holds the content. Verified per block:

| Duplicated block | Repeats at | Owner holds it TODAY? | Compaction action |
|---|---|---|---|
| No-commit git-mechanics ("session record NOT committed", `git add` refused, no `chore(session)`) | `ideation:117` `preparation:98` `planning:96` `execution:87` + `wrap-up:43` | **NO** — `record.md` has 0 hits; `record/SKILL.md:226` covers only transcript-gitignore; `record-map.md:220-222` (D7) has only the abbreviated "`sessions/` is gitignored, removed at cleanup" fact | **HOIST-THEN-POINT**: first hoist the git-mechanics rule into `record.md` (manager RECORD owner, itself pointing at `record-map.md` D7 for the lifecycle), THEN point the 5 loop docs there |
| Output ASCII tree ("The canonical tree is …") | `ideation:142` `preparation:127` `planning:121` `execution:115` `wrap-up:59` | **YES** — `record-map.md` IS the tree SSOT (`:3-11`, `:15-65`) | point (safe) — never redraw |
| Dual-production paragraph (loop docs, TIER 3) | `ideation:87` `preparation:74` `planning:75` `execution:64` `wrap-up:25` | **YES** — `production.md` is the SSOT | point (safe) |
| Peer-skill `### Dual-system production` section (TIER 2) | `ideation/SKILL.md:358` `preparation:298` `planning:365` `execution:151` `wrap-up:280` | **YES** — `production.md` SSOT; the peer sections are already near-pointers | collapse to pointer (safe) |

The **RECORD-deferral precedent** the fix generalizes is identical in all 5 peer skills
(`ideation/SKILL.md:408` `preparation:351` `planning:418` `execution:205` `wrap-up:502`;
referenced at `record/SKILL.md:257`). Proven in-tree.

**Verified genre split (both systems agree).** Five docs are **per-loop wrappers** (a peer
skill owns their procedure). Three — `evaluation.md`, `record.md`, `production.md` — are
**cross-cutting sub-phase docs** that run inside every loop and have **no peer skill owning the
manager orchestration** (`production.md` has no peer; `evaluation.md:105-278` and
`record.md:132-235` [the 7 validation gates] have no peer twin). This is THE KEY TENSION.

---

## Part 1 — Skeleton shape (challenge + refine)

### The finding: TWO document kinds, not one skeleton

The 8-point skeleton is a per-loop-wrapper shape. A loop doc answers "how does the manager run
*this loop*?"; a cross-cutting doc answers "how does the manager run *this sub-phase,
everywhere*?" — it has no loop sub-phases of its own (`production.md` has none) and its body IS
the manager gates. This matches the tree's own Diátaxis type-separation, already adopted at
[`memory/rules.md § 4.1.1`](../../../../skills/memory/rules.md): "documentation types serve
different reader needs, and mixing them in one doc serves none well."

### The options

**Option 1 — Uniform 8-point on all 8 docs.** *Trade-off:* one visible shape, but a fiction —
`production.md` has no loop phases to map, and forcing a sub-phase SSOT into a loop-wrapper
skeleton hides or mislabels its gates. **Reject globally; keep it for the 5 loop docs only.**

**Option 2 — TWO doc kinds (RECOMMENDED, ratified this session).** A visible `**Doc kind:**`
marker splits the set: `loop-orchestration` (5 loop docs, answering the 8 skeleton questions as
ANSWERS, not 8 headings) vs `gate-orchestration` (3 cross-cutting docs, a gate-doc skeleton
whose payload is the manager gates). Matches the §2.1 gate-floors.

**Option 3 — Split the gate-heavy docs into new child docs.** *Trade-off:* shorter
`workflow/*.md`, but creates NEW owners against locked decision 4 ("hoist to EXISTING SSOTs, no
new `_loop-common.md`") and adds a manager read-hop. **Reject: scope expansion + drift risk.**

**Recommendation: Option 2 (ratified).** Treat "8-point skeleton" as "8 manager questions the
loop docs must ANSWER." It is the only option that fits `production.md`.

**Genre A — `loop-orchestration` (ideation / preparation / planning / execution / wrap-up).**
The 8-point skeleton, refined (keep 8 answers; do not split — `wrap-up` is 84L; do not merge
3+4): 1 Purpose + owners + `**Doc kind:**` marker; 2 Manager entry (incl. B4 — no `outputs/`
scaffold); 3 DISCUSSION orchestration (spawn + continuation + a compressed sub-step table whose
"user-decides" column IS the escalation set, gate #4); 4 WORK orchestration (producer +
explicit completion-proof + Production-owner pointer); 5 EVALUATION (Evaluation-owner pointer +
completion proof); 6 RECORD (Record-owner pointer + loop-specific delta only); 7 ITER/EXIT
(verdict table with B3/B11); 8 Output pointers (Path-owner pointer + loop-specific file
inventory replacing the ASCII tree + owner links).

> **Generalization is UNPROVEN (F-STRUCT-1 / COD-USAGE-001).** Only `ideation.md` is
> prototyped (Part 3). The skeleton is **not yet shown to fit** the other 4 loop docs or the 3
> gate docs — each carries loop-specific (M) gates that must be re-verified per doc at Planning
> (§ Scope-generalization gate below). Do NOT read "fits the five loop docs" as proven.

**Genre B — `gate-orchestration` (evaluation / record / production).** A concrete gate-doc
skeleton (NOT the loop 8-point shape): 1 Purpose + authority boundary (`**Doc kind:**
gate-orchestration.`); 2 Manager pre-spawn/pre-run inputs; 3 Manager validation / reconciliation
/ integration gates — each carrying a **stable gate ID** (`[GATE:{doc}.{gate-name}]`, see Part
2 § Gate-protection); 4 Failure / degraded / retry / stop-the-line; 5 Output contracts +
path-owner pointers; 6 Cross-references. Compaction lever = (D)-extraction + narrative trim +
gate-ID content protection, NOT skeleton-conformance. **A gate-doc worked prototype is required
at Planning** (§ Scope-generalization gate) — the KEY TENSION is named, not yet prototyped.

---

## Part 2 — The "point, don't restate" pointer mechanism + drift guard

### Hoist-then-point (the required PRE-STEP — F-CONSIST-1)

**A pointer is only valid if the owner already holds the content.** Before compacting any
block, VERIFY the pointer target actually contains it (grep the owner). Where it does NOT
(verified above: the no-commit git-mechanics block), the compaction MUST:

1. **Hoist** the rule into exactly one owner FIRST — establish the SSOT. (No-commit → hoist the
   manager-facing "no `chore(session)` commit; `git add` of `sessions/` is refused" rule into
   `record.md`, which points to `record-map.md` D7 for the underlying gitignore lifecycle.)
2. **Then point** — replace the 5 loop-doc copies with a pointer to that owner.

Skipping step 1 turns "delete + point" into a dead pointer + content loss propagated 5×. The
output-tree and dual-production blocks already have live owners (`record-map.md`,
`production.md`) — they skip step 1. Only no-commit needs the hoist.

### Exact pointer syntax — one grammar, single OR split owner

A pointer generalizes the in-tree RECORD-deferral blockquote (`ideation/SKILL.md:408`,
identical in all 5 peer skills). Grammar: **(1)** name the canonical owner(s) — **one owner
path, OR, for a split-owner concept, exactly two: the workflow-child gate doc + the peer-skill
procedure, each with its role stated** (COD-STRUCT-001); **(2)** state what THIS doc keeps
locally; **(3)** ban the restatement. Within `workflow/*.md`, the typed set:

```markdown
> **Procedure owner:** [`ideation/SKILL.md`](../../ideation/SKILL.md). Keeps only manager
> spawn, inputs, user gates, exit checks. Do not copy the peer procedure.               [single]

> **Production owner:** [`workflow/production.md`](production.md). Names only when the manager
> invokes dual-system production + any loop path exception. Do not restate spawn/freeze/
> integration/gap/degraded rules.                                                        [single]

> **Evaluation owner:** [`workflow/evaluation.md`](evaluation.md) for spawn/reconciliation/
> safety gates/failure; [`evaluation/SKILL.md`](../../evaluation/SKILL.md) for the evaluator's
> four-stage procedure. Keeps only loop-specific inputs + outputs.                        [split]

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + validation gates
> (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md) for
> the assistant procedure. Keeps only loop-specific inputs, outputs, exceptions.          [split]

> **Path owner:** [`record/record-map.md`](../../record/record-map.md). Do not redraw the
> session tree. Name only this loop's dir and loop-specific files.                       [single]
```

The `single`/`split` tag is a grammar annotation, not doc text. The split form is permitted
ONLY for the two named split-owner concepts (Evaluation, Record) — a workflow-child gate doc +
its peer-skill procedure; every other pointer is single-owner.

### Pointer vs. restatement — the distinguishing test

> **RULE.** After a typed owner pointer to owner O for concept C, the doc MUST NOT contain a
> fenced block, table, or ordered list that **reproduces C's content**. The pointer *replaces*
> the block. The session-record ASCII tree is NEVER redrawn outside `record-map.md`.

A pointer is allowed when it is one blockquote/short paragraph, names its one (or split-owner
two) owner path(s), and says what the doc keeps. A **restatement is disallowed** when it copies
a peer procedure/phase table; redraws the session/output tree; repeats the no-commit
explanation; repeats the dual-production procedure outside `production.md` (except a one-line
pointer); repeats the perspective table (allowed only as "all seven perspectives + Overall");
or repeats the Type + Domain routing table. **Manager gates are the exception** — a doc MAY
keep tables/paragraphs answering the acceptance test (who to spawn / what to pass / output
proof / user+safety gates / owner pointers) even where they resemble a restatement.

### Drift prevention — a rule PLUS a runnable guard (guard is primary)

gobbi pairs a **prose rule (the "why")** with a **runnable guard (the "gate")** — as
[`memory/rules.md § 4`](../../../../skills/memory/rules.md) pairs with `validate-frontmatter.sh`.

1. **The rule** — the first `rules/docs/` entry (`point-dont-restate-workflow-docs`), loaded at
   session start: *"In `orchestration/workflow/*.md`, any concept whose SSOT is a peer skill,
   `record-map.md`, `production.md`, `evaluation/SKILL.md`, or `record/SKILL.md` is referenced
   by exactly one typed owner pointer (single, or the two named split-owners) and MUST NOT be
   reproduced as a fenced block, redrawn tree, enumerated value list, or restated procedure.
   Hoist-then-point: never point at content the owner does not yet hold."*

2. **The guard** — `orchestration/scripts/check-workflow-pointer-drift.sh`, alongside the
   verified guard family. It scans the canonical `.gobbi/projects/gobbi/skills` tree (symlink
   mirrors only in an explicit `--mirrors` mode, per [[find-misses-symlinked-mirror-dirs]]),
   **fails closed on any missing/unreadable required doc**, and avoids `\b` ERE (BSD/macOS grep
   — use explicit delimiters / `grep -w` / character classes). Checks:

   1. Loop docs contain `**Doc kind:** loop-orchestration.`; gate docs contain
      `**Doc kind:** gate-orchestration.` (exact-line match).
   2. Each loop doc contains **all 5** typed owner pointer blocks — Procedure, **Production**,
      Evaluation, Record, and Path owner (COD-CONS-001: the 4-only list would false-pass a doc
      that dropped the Production pointer — the exact dual-production drift the guard targets).
   3. **No fenced session-tree redraw** — CONTEXT-AWARE, not a bare path grep (F-RISK-2): flag
      only a line INSIDE a ```` ``` ```` code fence that contains a box-drawing char
      (`├`/`└`/`│`) AND a session-dir segment. An inline `1-ideation/` path mention outside a
      fence is legitimate and passes.
   4. **No-commit restatement** — flag the no-commit phrase family ONLY when it appears OUTSIDE
      a pointer blockquote. Allowlist (legitimate mentions): a `> **… owner:**` blockquote line,
      or a line containing "owned by" / "do not restate" / "commit boundary". This is the
      off-limits/negative-mention exemption `evaluation.md:59-69` warns a literal grep misses.
   5. **No `### Dual-system production` heading** in loop docs — a heading-LINE match
      (`^###[[:space:]]+Dual-system production`), not a body substring; the Production-owner
      pointer is the allowed form.
   6. `evaluation.md` has no seven-perspective table (allowed: "all seven perspectives +
      Overall" + pointer) — detect a table whose header row names ≥3 perspective slugs.
   7. `record.md` has no full session-tree fence (check #3's structural rule applied to
      `record.md`); compressed validation gates are allowed.

### Gate-protection — content/identity, NOT a count (F-RISK-1 + COD-RISK-001)

A `[GATE]`-count check is wrong both ways: a gate can be gutted/merged while the count holds
(fail-open), and a legitimate consolidation lowers the count (fail-closed). Replace it with
**stable gate IDs + an external manifest + content-presence**, designed to avoid the
[[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]] trap:

- **Stable gate ID in the doc.** Each load-bearing gate paragraph carries a stable anchor
  `[GATE:{doc}.{gate-name}]` (e.g. `[GATE:record.file-presence]`, `[GATE:record.session-json-integrity]`,
  `[GATE:evaluation.major-divergence]`). The ID is the paragraph's identity — it survives
  rewording; it is removed only by an intentional gate retirement.
- **External manifest (NOT hardcoded in the guard).** The required gate-ID set lives in a
  reviewed data file `orchestration/workflow/gate-manifest.txt` beside the docs — NOT an
  in-script `expected=(...)` array. Per the cited mistake, an unavoidable baseline is treated
  as **part of the structure's spec** and is a member of every gate-changing PR's file set; it
  is never a hidden third copy inside the guard.
- **Content-presence check.** For each manifest ID, the guard asserts (a) the anchor resolves
  to exactly one gate doc, and (b) the anchored paragraph clears a min-substance floor (non-
  empty, ≥ N words, and — optional hardening — matches a committed per-gate content snapshot
  under `orchestration/workflow/gate-snapshots/{id}.sha` so a silent gutting also trips).
- **Update rule (the anti-fragility contract).** Adding / retiring / merging a gate is a
  deliberate edit to the manifest (and snapshot) in the SAME PR as the doc edit. So a legitimate
  consolidation PASSES (manifest updated to match) while an accidental gut/delete FAILS
  (manifest still requires the ID, content-presence fails). This is the derive-vs-baseline
  discipline the mistake prescribes: prefer the doc's own `[GATE:id]` tags as the source of
  truth for "what a gate is," and keep only the required-SET as external reviewed spec.

**Guard-authoring caveat** ([[clean-verdict-unreliable-without-edge-case-stress]]): the guard
is a shell script needing edge-case stress before trust — an `awk`/shell state machine, no `\b`,
fail-closed on missing files, fixture tests for harmless non-tree code fences, off-limits
`working/proposals/` warnings, negative "do not restate" mentions, nested links, and anchored
pointer blocks. A literal grep is evidence, not semantic proof (`evaluation.md:59-69`).
Acceptance: run the guard, then `check-markdown-links.sh .../orchestration/workflow`.

---

## Part 3 — Prototype on ONE loop doc: `ideation.md`

**Why `ideation.md`.** Most-duplicative loop doc (184L); exercises all 8 points incl. the
richest DISCUSSION orchestration; first loop → its shape templates the other 4 (Principle 2).
`execution.md` is the ratified second target (its loop-specific executor-continuation gate is
the toughest (M)-content stress). `wrap-up.md` (84L) is too simple to stress the skeleton.

### Measured reduction — honest (F-PERF-1 + COD-PERF-001)

- **Lines: 184 → 113 = 39%** — but the line % is **inflated LOW by re-wrapping**: this draft
  hard-wraps prose at ~90 chars where the original packs long unwrapped lines.
- **Content (the honest figure): words 2,046 → 852 = 58%; chars 16,487 → 6,729 = 59%.**
- **All-8-doc estimate vs the ~40% target (not one flattering per-file number):** loop docs at
  the Codex ceilings (95+80+75+75+55 = 380) + gate-doc floors (evaluation ~210 + record ~185-200
  + production ~105 = ~500-515) → **≈ 885-895 lines vs 1,539 ≈ 42% corpus line reduction**
  (content-wise higher). The gate floors are what hold the aggregate at ~40%, not lower — by
  design (the gates have no peer home).

### Before → after structure

| Current `ideation.md` (184L) | → | prototype (113L) |
|---|---|---|
| intro + phase table (`:1-15`) | → | Purpose + `**Doc kind:**` marker + top pointers |
| DISCUSSION spawn+continuation+sub-step table+escalation (`:18-72`) | → | DISCUSSION: spawn/continuation kept; sub-step table compressed; "user-decides" column = escalation set |
| WORK + dual-production para (`:75-88`) | → | WORK completion-proof kept; dual-production → Production-owner pointer |
| EVALUATION (`:91-100`) | → | Evaluation-owner pointer + completion proof |
| RECORD + no-commit block (`:102-121`) | → | Record-owner pointer; no-commit HOISTED to record.md then pointed; B4 delta kept |
| ITER/EXIT (`:125-136`) | → | kept + B3 mode-explicit + B11 FAIL=escalate + SKIPPED |
| Output ASCII tree (`:140-166`) | → | Path-owner pointer + prose file inventory (tree not redrawn) |
| Cross-references (`:174-185`) | → | compact Cross-references |

### The actual rewritten doc (concrete reference — validated at iter1, unchanged)

```markdown
# Workflow — Ideation (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager drives Ideation until the idea (What / Why / How) is concrete
enough to plan against. It runs the four sub-phases — DISCUSSION → WORK → EVALUATION →
RECORD — then the ITER / EXIT decision; it does NOT perform the leader / evaluator /
assistant procedures. Planning owns Who / When / Where.

> **Procedure owner:** [`ideation/SKILL.md`](../../ideation/SKILL.md). This doc keeps only
> manager spawn, inputs, user gates, and exit checks — do not copy the peer procedure.
> **Path owner:** [`record/record-map.md`](../../record/record-map.md). Do not redraw the
> session tree — name only Ideation's dir and loop-specific files.

## Manager Entry

Enter with the user's initial framing (or the prior `REVISE` findings); feature memory +
project `mistakes/` / `rules/` / `design/`; codebase + `git log` for the touched area.
After Sub-step B the manager stamps `project` / `feature` / `task` into `session.json` and
bootstraps `1-ideation/{working,staging,evaluation}/` — NOT `outputs/` (PASS-only). Never
touch `features/{feature-name}/...` (Wrap-up owns it).

## DISCUSSION Orchestration

The manager spawns (or continues) the `leader` as needed for research-backed input on the
next decision, then continues the user dialogue; multiple spawns are normal. The full
sub-step procedure lives in the Procedure owner. The manager runs A→D in order, each gated
by the user-decision primitive — the **User decides** column is the escalation set:

| # | Sub-step | Leader brings | User decides |
|---|---|---|---|
| A | Frame What/Why | root cause / impact / success criteria / prior attempts / steel-man / re-framing | the six forcing questions + re-framing go/no-go |
| B | Lock Scope | candidate `{Project,Feature,Task}` triplets + dependency pick | the Scope Contract + backlog routing of non-picked candidates |
| C | Research | internal + external insights, presented separately | insight accept/reject on each surface |
| D | Design | scenarios + anchored checklist + directional design decisions | scenario completeness + design direction |

Plus any contribution point the leader surfaces. DISCUSSION is done when the Scope Contract
and decision set are user-locked and explicit enough for WORK to document with no new design.

**Leader continuation (Claude Code Agent Teams).** The manager continues ONE leader
teammate across A→B→C→D→WORK via delta-briefs — the strongest in-loop token saver.
Decision rule + evaluator-FORBIDDEN wall:
[`delegation/SKILL.md § Continue vs Fresh`](../../delegation/SKILL.md#continue-vs-fresh).
Fresh-spawn fallback when Agent Teams is off, the runtime is native Codex, or the teammate
died (`/compact` / `/clear` / resume kill it).

## WORK Orchestration

The manager spawns (or continues) the leader to DOCUMENT only what DISCUSSION approved —
no new content. **Completion proof:** `1-ideation/working/draft-iter{n}.md` carries all 7
sections (Scope Contract / Framed Problem / Research Insights / Scenarios / Implementation
Checklist / Design / Decisions Log); one `staging/references/{slug}.md` per confirmed
external insight; `staging/backlogs/{feature,project}/` matches the Sub-step B/C lists; the
Decisions Log cites the user-decision outcomes. No memory writes.

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Ideation WORK may run dual-system production (`propose.mode: dual`, default). Do not
> restate proposer spawn, freeze, selective integration, gap classification, or
> degraded-mode rules.

## EVALUATION Orchestration

> **Evaluation owner:** [`workflow/evaluation.md`](evaluation.md) for manager spawn,
> reconciliation, safety gates, and failure handling; [`evaluation/SKILL.md`](../../evaluation/SKILL.md)
> for the evaluator's four-stage procedure.

Pass the working draft, staged references + backlogs, the Scope Contract, and the
discussion log; all seven perspectives + Overall, no pruning. Done when the per-system
files under `1-ideation/evaluation/iter{n}/{claude,codex}/` + the reconciled verdict exist.
Cross-system divergence is derived at RECORD, not written to a file.

## RECORD Orchestration

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure.

The manager spawns one `assistant` after every verdict. **Ideation delta:** `outputs/` is
PASS-only — NOT in the loop-entry scaffold. Every iter, the assistant copies the transcript
+ upserts `session.json.workflow.ideation.iterations[]`; on PASS it also writes
`1-ideation/outputs/`, stages typed findings + derivatives, and sets `finishedAt` +
`verdict: PASS`. No memory write during Ideation; Wrap-up promotes.

## ITER / EXIT

| Verdict | Manager action |
|---|---|
| `PASS` | Exit; advance to the **next loop** — **Preparation** in Auto mode, **Planning** in Chat mode (Chat skips Preparation). `outputs/` + `staging/` ready for Wrap-up promotion |
| `REVISE` | Re-enter DISCUSSION with evaluator findings as input; increment the iter counter |
| `FAIL` | **Safety-gate escalation to the user** (revise / abort-ideation / accept-with-deferral) — never auto-re-entered as a REVISE |
| `SKIPPED` | Exit if settings skipped Ideation |

Iteration cap: `workflow.ideation.maxIterations` (default 5). At the cap without `PASS`,
the manager escalates to the user.

## Output Pointers

Ideation's loop dir is `1-ideation/`. Loop-specific files: WORK draft
`working/draft-iter{n}.md`; optional Codex proposal `working/proposals/codex/draft-iter{n}.md`
+ Integration Log `working/reconciliation-iter{n}.md`; evaluation
`evaluation/iter{n}/{system}/{perspective}.md` (+ `overall.md`); PASS outputs
`outputs/{free-filename}.md`; staging `staging/{scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/{slug}.md`.
The full session tree, 4-slot interior, and PASS-only `outputs/` lifecycle are owned by the
Path owner — never redrawn here.

## Cross-references

- Ideation peer procedure → [`ideation/SKILL.md`](../../ideation/SKILL.md)
- Research procedure → [`research/SKILL.md`](../../research/SKILL.md)
- Production orchestration → [`workflow/production.md`](production.md)
- Evaluation orchestration → [`workflow/evaluation.md`](evaluation.md)
- RECORD orchestration + assistant procedure → [`workflow/record.md`](record.md), [`record/SKILL.md`](../../record/SKILL.md)
- Session path owner → [`record/record-map.md`](../../record/record-map.md)
- Delegation patterns → [`delegation/SKILL.md`](../../delegation/SKILL.md)
```

---

## Part 4 — Gate preservation (the 5-gate acceptance test)

| # | Gate | Answered in prototype by | STAY vs POINT |
|---|---|---|---|
| 1 | **Who to spawn** | DISCUSSION+WORK `leader`; EVALUATION → two evaluators (via owner); RECORD → one `assistant` | STAY |
| 2 | **What to pass** | Manager Entry inputs + REVISE findings; DISCUSSION "leader brings"; WORK decision set + draft path; EVALUATION bundle; RECORD verdict/iter/dir/log | STAY |
| 3 | **What output proves completion** | WORK completion-proof (7 sections + staging match); EVALUATION per-system files + verdict; RECORD transcript + `session.json` + PASS `outputs/` | STAY |
| 4 | **Which decisions require the user** | DISCUSSION "User decides" column (escalation set) + contribution points; ITER/EXIT FAIL safety-gate | STAY |
| 5 | **Which doc owns each specialist procedure** | the 5 typed owner pointers | POINT |

**Ownership honesty (corrected, F-CONSIST-1).** Everything that POINTS lives at exactly one
owner **after the hoist-then-point pre-step establishes the SSOT**. For the output-tree and
dual-production blocks the owner already holds the content (safe pointer now). For the no-commit
block the owner does NOT yet hold it — the compaction must hoist it into `record.md` first;
until then the pointer would be dead. This is a REQUIRED first step, not an assumption.

**Correctness fixes folded into the prototype (pass-1):** B4 (`outputs/` PASS-only,
unscaffolded); B3 (next loop mode-explicit); B11 (FAIL = safety-gate escalation, split from
REVISE); B10 ("four sub-phases + the ITER/EXIT decision").

**Result:** all 5 gates answerable from the compacted doc + its pointers → the prototype passes
the acceptance test at 39% line / 58% content reduction — **for `ideation.md` only** (see the
Scope-generalization gate).

### Scope-generalization gate (Planning-time requirement — F-STRUCT-1 / COD-USAGE-001)

The skeleton is proven on `ideation.md` ALONE. Before compacting each remaining doc, Planning
MUST run the 5-gate acceptance test per doc AND re-verify that doc's loop-specific (M) gates
survive the pointer swap:

- **preparation.md** — the **Re-Ideate routing** (manager changes the path; not a REVISE) + the
  generated-skill sole-writer exception.
- **planning.md** — the plan artifact staging + dependency/lane conflict escalation.
- **execution.md** — the **executor-continuation** rule (shared-subsystem/under-cap) + per-task
  nesting + per-task value telemetry.
- **wrap-up.md** — **promotion commits ≠ session-record writes** (Wrap-up's RECORD may touch
  memory; the commit boundary is inverted vs the other loops).
- **≥1 gate doc (record.md or evaluation.md)** — a worked Genre-B prototype is REQUIRED to
  prove the gate-orchestration skeleton + the gate-ID/manifest protection on a real gate doc
  (the KEY TENSION, named but not yet prototyped).

---

## Decisions locked (ratified this session — not open questions, F-PROJ-1)

1. **Two doc kinds** (`loop-orchestration` / `gate-orchestration`) — Option 2.
2. **Doc-kind marker = visible prose** (`**Doc kind:** …`), not frontmatter.
3. **FLAG-2 guard home = the first `rules/docs/` entry** (`point-dont-restate-workflow-docs`).
4. **Guard fails on ALL workflow session-tree fences** — including `evaluation.md` / `record.md`
   (they keep compact path tables + gates, no ASCII tree). `record-map.md` owns the tree.
5. **Prototype `ideation.md` first, then `execution.md`** (the toughest (M)-content case).
6. **`production.md` — shape only this pass**; its runtime-command guidance stays with Point 3's
   runtime-matrix work.
7. **Keep the compressed sub-step table** in DISCUSSION (it is (M) orchestration, gate #4).

## Open questions (genuinely open)

1. **Drift guard — build in the compaction PR, or ship the `rules/` entry now and backlog the
   guard?** Recommend: **build it in the PR** — a dedup without a guard regrows, and the loaded
   traps show clean verdicts + one-phrase greps miss equivalents. (The only item from iter1's
   list the user has not yet ratified.)

---

## Revision log (iter2)

| Finding (system) | Change |
|---|---|
| COD-CONS-001 + aesth (guard 4→5 pointers) | Part 2 guard check #2 now requires **all 5** typed pointer blocks incl. Production-owner (a 4-only list false-passes a dropped production pointer — the exact drift targeted). |
| COD-RISK-001 + F-RISK-1 (count ≠ content) | Replaced the `[GATE]`-count check with **stable gate IDs + external manifest + content-presence** (new Part 2 § Gate-protection), designed against [[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]]: manifest is external reviewed spec (not an in-script array), updated in the same PR as a gate change; content-presence (+ optional snapshot) catches silent gutting; fail-open (deletion) and fail-closed (legit consolidation) both resolved. |
| F-RISK-2 (portable + non-literal) | Guard checks #3/#5/#7 made **context-aware/structural** (code-fence + box-drawing char; heading-LINE match), #4 given an explicit **pointer-form allowlist** for off-limits/negative mentions; no `\b` ERE; fail-closed on missing file; symlink `--mirrors` mode. |
| F-CONSIST-1 (SSOT gap) | Verified (grep) the no-commit block lives ONLY in the 5 loop docs; corrected the Study SSOT map (owner-holds-it column) + added **hoist-then-point** as a required Part 2 pre-step + fixed the Part 4 "each lives at exactly one owner" overclaim to "after the hoist establishes the SSOT." |
| COD-STRUCT-001 (grammar vs examples) | Pointer grammar now explicitly permits a **split-owner (two-path)** pointer for the two named concepts (Evaluation, Record); grammar and its own examples agree. |
| COD-PERF-001 + F-PERF-1 (honest metrics) | Part 3 now reports **58% content (words) / 59% chars** alongside 39% lines, notes the line % is re-wrap-inflated-low, and adds the **all-8 corpus estimate ≈42%** vs the ~40% target. |
| COD-USAGE-001 + F-STRUCT-1 (scope honesty) | Added the **Scope-generalization gate** (Part 4) — generalization to the other 4 loop docs + 3 gate docs is UNPROVEN; Planning must re-verify named loop-specific gates per doc + prototype ≥1 gate doc; removed "fits the five loop docs cleanly." |
| F-PROJ-1 (labeling) | Moved the 7 ratified items to **Decisions locked**; kept only the single genuinely-open item (guard-in-PR-vs-defer) as an open question. |

## Related

- [[two-doc-kind-compaction-model]] — the locked decision this design's Part 1 documents
- [[point-dont-restate-guard-rule-home]] — the locked decision for the FLAG-2 guard-rule home
- [[compaction-prototype-scope-parameters]] — the locked implementation-scope decisions (marker, guard scope, prototype order, `production.md` scope, sub-step table)
- [[workflow-doc-generalization-unproven]] — the locked Planning-time gate-check requirement
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — the evidence-gathering discipline this design's Study section applies
- [[clean-verdict-unreliable-without-edge-case-stress]] — the verification discipline behind the guard-authoring caveat in Part 2
