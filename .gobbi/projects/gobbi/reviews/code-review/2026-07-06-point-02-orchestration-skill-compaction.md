---
name: point-02-orchestration-skill-compaction
description: Dual-system review of the orchestration skill compaction — per-doc targets (Codex ceiling + gate-limited floors), the workflow↔skill duplication map, ~12 correctness bugs, and a fix-first implementation plan.
type: reviews
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [evaluation]
keywords: [orchestration, workflow, compaction, duplication-map, ssot, correctness-bugs, loop-skeleton, gate-preservation]
author: claude
review_kind: code-review
subject: orchestration/SKILL.md + auto-mode.md + agent-teams.md + workflow/*.md (compaction + manager/skill split)
verdict: needs-attention
---

# Point 2 — Orchestration skill compaction

## Point (verbatim user text)

> The next point is compacting orchestration skill.
> 1. The docs in orchestration skill look too long and large. Polish and compact the narrative sentences. We can delete unnecessary sections or sentences.
> 2. The docs in orchestration/workflow/*.md should describe what the MANAGER must know for orchestration. The details should NOT be duplicated with each skill.
> 3. Find any other improvement points.

## Session context

- **Mode:** Chat-mode review. **Implementation is DEFERRED** — this doc is the review + implementation-ready change-set.
- **Reviewers (dual-system):** `leader` (Claude, this producer) + an independent frozen `codex` proposal (441L). The producer selectively integrated (SELECT the stronger element, never blend). Cross-system record in § Cross-system reconciliation + `working/reconciliation-iter1.md`.
- **Scope:** IN — `SKILL.md` (446L), `auto-mode.md` (413L), `agent-teams.md` (189L), all 8 `workflow/*.md` (1,539L); ~2,587L total. OUT — `chat-mode.md` length (Point 1.2 owns it).
- **Verdict `needs-attention`:** the compaction is well-specified and approved in direction, but it must be **fix-first** (~12 latent correctness bugs, 2 semantic, fixed as pass 1 before any deletion) AND **gate-limited** (the target is a ceiling; every manager gate is preserved even where that keeps a doc above Codex's number).

## Decisions locked

**User decisions (locked this session, definitive — decided WITH the leader's both-sides read in hand):**
1. **Aggressiveness = FULL CORPUS ~40% — Codex's per-doc target table is the CEILING (§2.1), with a HARD gate-preservation constraint.** Compact all in-scope docs toward ~2,587 → ~1,515. **Where Codex's per-doc number would cut a manager gate, THE GATE WINS** — keep the orchestration content and annotate that doc "gate-limited (actual reduction < ceiling; gate preserved)." The leader's both-sides read DEFINES the gates. Gate-limited docs named in §2.1; `evaluation.md` is the prime one.
2. **Correctness bugs = FIX-FIRST, BUNDLED.** All ~12 (§2.3) fixed as **pass 1 before deleting text**, in the same compaction PR. The 2 remaining semantic ones (Ideation PASS→Preparation, `outputs/` PASS-only) need careful cross-doc alignment.
3. **B11 FAIL-behavior — RESOLVED (user): FAIL escalates to the user.** Separate FAIL from REVISE at `SKILL.md:298-299` (REVISE auto-iterates on budget; any FAIL is a safety-gate escalation). This aligns the per-loop ITER/EXIT tables + `evaluation.md` — which already assume FAIL=escalate — with the root state machine. This is the canonical behavior; it is a pass-1 correctness fix, not an open question.

**Manager-locked confirmations:**
4. **Structure = hoist to existing SSOTs** (`record-map.md`, the peer skills, `production.md`); "point, don't restate; never redraw the record-map tree." **NO new `_loop-common.md`.** Extend the in-tree RECORD-deferral precedent (§2.2).
5. **Adopt the uniform 8-point `workflow/{loop}.md` skeleton** (§2.2).
6. **PR shape = ONE compaction PR** (2.1+2.2+2.3 bundled), **coordinated with Point 1's PRs** on the `maxIterations` "default 5" lines (collision noted in §Plan).
7. **The doc-authoring guard** ("point, don't restate; never redraw the record-map tree") is a recommendation only — `rules/` is currently EMPTY (`NO_PROJECT_RULES`), so establish it as the first `rules/` entry OR fold into the (absent) claude doc-authoring standard; implementer decides.
8. **The 2 missing mistake files** → out-of-scope follow-up (create or repoint), same disposition as Point 1's dangling-xref item.

---

## Findings 2.1 — Per-doc compaction targets (Codex ceiling + gate-limited floor)

**Codex's per-doc table is the CEILING; the gate-floor is what the leader's both-sides read shows can be cut without losing a manager gate.** Where the two differ, the floor wins (locked decision 1).

| Doc | Now | Codex ceiling | Gate-floor | Disposition |
|---|---:|---:|---:|---|
| `SKILL.md` | 446 | 300 | 300 | Ceiling OK — cuts are §Workflow Metadata + §Teammate-aware + session-tree/quartet ASCII + the sample status table; state-machine + Configuration fresh/resume branch (gates) preserved |
| `auto-mode.md` | 413 | 240 | 240 | Ceiling OK — cuts are §2 per-step manuals (dup) + §7 rationale; Always-Ask + safety-gate carve-out (gates) preserved |
| `agent-teams.md` | 189 | 115 | 115 | Ceiling OK — cuts are operator setup + delegation dup + hook list; teammate constraints + no-survival + evaluator-never-teammate (gates) preserved |
| `workflow/ideation.md` | 184 | 95 | 95 | Ceiling OK — cuts are the boilerplate spine (dup); escalation list + ITER/EXIT (gates) preserved |
| `workflow/preparation.md` | 158 | 80 | 80 | Ceiling OK — spine cut; Re-Ideate routing + generated-skill exception (gates) preserved |
| `workflow/planning.md` | 156 | 75 | 75 | Ceiling OK — spine cut; escalation + ITER/EXIT preserved |
| `workflow/execution.md` | 145 | 75 | 75 | Ceiling OK — executor lifecycle → peer skill; executor-continuation rule + exit gates preserved |
| `workflow/wrap-up.md` | 84 | 55 | 55 | Ceiling OK — overview/tree cut; non-skippable eval + commit boundary preserved |
| `workflow/evaluation.md` | 328 | 190 | **~210 (GATE-LIMITED)** | **Floor > ceiling.** ~150L of spawn/reconciliation/divergence/failure/degraded/regression/stuck/caps has NO peer-skill equivalent → condense ONLY narrative + the 7-perspective table + the disposition/inheritance procedure + output trees. Do NOT cut to 190 if that means cutting orchestration. |
| `workflow/record.md` | 347 | 185 | **~185-200 (gate-limited)** | The 7 manager validation gates (`132-235`) are the manager's mechanical acceptance test → **compress, do NOT cut**. Output-tree + value-telemetry + iteration/idempotency restatements cut freely. 185 achievable only if the gates compress cleanly. |
| `workflow/production.md` | 137 | 105 | 105 | Ceiling OK — all content is manager-owned (no peer skill); only rationale + crossrefs trimmed |
| **Total** | **2,587** | **1,515** | **~1,535-1,550** | **~40% either way.** The gate-floor adds back ~20-35L (evaluation +~20; record +~0-15) to protect gates. |

**Gate-limited docs (named per locked decision 1):**
- **`evaluation.md` (PRIME) — floor ~210, not 190.** Its manager-reconciliation content (spawn+independence `40-69`, aggregation/divergence/verdict/failure/degraded `105-219`, regression/stuck/caps `254-279`) has NO peer-skill twin; it IS the manager's evaluation orchestration. Cut only the (D) rows: perspective table (`19-37`), disposition/inheritance procedure (`223-252`), output trees (`73-101`, `282-317`), rationale (`11-16`), crossrefs.
- **`record.md` (SECONDARY) — floor ~185-200.** The validation gates (`132-235`) are load-bearing manager acceptance criteria — compress the prose, keep every gate. All other cuts (output tree, value-telemetry, iteration/idempotency) are free.
- **All other docs hit Codex's ceiling** — their reductions are duplication/narrative, not gates.

---

## Findings 2.2 — workflow/*.md ↔ peer-skill duplication map (THE HEADLINE)

**Contract:** `workflow/{loop}.md` = ONLY manager orchestration (entry, who-to-spawn, what-to-pass, gates, verdict handling, exit). The PROCEDURE belongs in the peer skill. Both sides of all 7 pairs read in full this session.

**Root cause (leader framing):** the five per-loop docs restate a shared boilerplate spine. Three verbatim-across-5 blocks dominate:
- **No-commit block** ("Per-iteration session record is NOT committed") — `ideation:117` `preparation:98` `planning:96` `execution:87` `wrap-up:43` → hoist to `record.md`/`SKILL.md § Workflow Session Record`.
- **Output ASCII tree** — redrawn ×5 (~80L) despite `record-map.md` being the declared SSOT AND `record.md:121-128` tabling it → point, don't redraw.
- **Dual-system-production content — a TRIPLE-statement across 11 docs** (leader-only find; Codex saw 2 of 3 tiers): (1) `production.md` SSOT; (2) each peer skill's own `### Dual-system production (Codex proposer)` section — `ideation/SKILL.md:358` `preparation:298` `planning:365` `execution:151` `wrap-up:280` (~40L); (3) each `workflow/{loop}.md` 1-para version (~20L). Collapse tiers 2+3 to pointers (~45-50L).

**The fix already exists in-tree.** Every peer skill's RECORD section carries a `> Canonical procedure: record/SKILL.md … do not re-derive` deferral (`ideation:408` `preparation:351` `planning:418` `execution:205` `wrap-up:502`). The uniform 8-point skeleton (locked decision 5) generalizes that proven pattern:

> **8-point `workflow/{loop}.md` skeleton:** 1 Purpose + peer-skill owner · 2 Manager entry conditions/inputs · 3 DISCUSSION orchestration (who to spawn / what to ask / when to escalate) · 4 WORK orchestration (who owns production, what artifact must exist, pointer to procedure) · 5 EVALUATION (pointer to `workflow/evaluation.md` + phase child) · 6 RECORD (pointer to `workflow/record.md`, loop-specific exceptions only) · 7 ITER/EXIT decision table · 8 Output pointer to `record-map.md`.

**Duplication map (per pair — (D)=delete/point to peer, (M)=keep manager-only):**

| Pair | (D) duplicated content → peer owner | (M) keep in workflow/ |
|---|---|---|
| `ideation.md` ↔ `ideation/SKILL.md` | `:3-15` phase table, `:47-58` sub-step table (→`ideation/SKILL.md:94-288`), `:75-88` WORK artifact rules, `:102-121` RECORD+no-commit, `:140-166` output tree | `:60-72` escalation triggers, `:125-136` ITER/EXIT (with fixes) |
| `preparation.md` ↔ `preparation/SKILL.md` | `:3-12` phase table, `:32-42` sub-step table (→`:121-226`), `:62-75` WORK, `:89-104` RECORD, `:125-145` output tree | `:43-58` escalation + **Re-Ideate routing** (manager changes the path), generated-skill exception |
| `planning.md` ↔ `planning/SKILL.md` | `:3-15` phase table, `:37-47` sub-step table (→`:142-282`), `:64-75` artifact schema, `:88-100` RECORD, `:119-143` output tree | `:48-60` escalation, `:104-115` ITER/EXIT |
| `execution.md` ↔ `execution/SKILL.md` | `:25-64` executor 5-phase lifecycle + production (→`execution/SKILL.md:107-161`), `:79-93` telemetry/no-commit, `:113-130` output tree | `:9-22` prompt-construction, `:35-48` **executor-continuation rule**, `:97-109` ITER/EXIT |
| `wrap-up.md` ↔ `wrap-up/SKILL.md` | `:3-6` overview, `:21-25` five-stage pipeline (→`wrap-up/SKILL.md:132-437`), `:57-74` output tree | `:29-35` non-skippable eval gate, `:39-47` commit boundary, `:51-53` exit |
| `evaluation.md` ↔ `evaluation/SKILL.md` | `:19-37` perspective table (→`evaluation/SKILL.md:85-123`), `:73-101` output tree, `:223-252` inheritance/disposition procedure, `:282-317` output paths | `:40-69` spawn+independence, `:105-219` reconciliation/verdict/failure/degraded, `:254-279` regression/stuck/caps — **mostly legitimate (gate-limited)** |
| `record.md` ↔ `record/SKILL.md` | `:55-129` output tree + loop table, `:69-91` value-telemetry rule (→`record/SKILL.md:200-217`), `:261-319` iteration/idempotency restatement, `:322-334` output paths | `:23-52` assistant spawn + prompt fields, `:132-235` validation gates (**compress, don't cut**), `:237-258` failure handling |

**Correction to the leader's first pass (both systems agree):** `workflow/evaluation.md` is *mostly legitimate manager-orchestration* — its reconciliation/divergence/aggregation/failure/degraded content is NOT in `evaluation/SKILL.md` and must stay. Only the perspective table + disposition procedure are true (D). **Gate-limited floor ~210L — do NOT over-compact to 190 (§2.1).**

**`workflow/production.md` has NO peer skill (confirmed both systems)** — the Codex proposer runs as the `codex/SKILL.md` wrapper; production.md is unique manager orchestration. Not a 2.2 offender; only trim its rationale/crossrefs.

**Reverse direction (manager-needs buried in a skill):** LOW risk. The Scope Contract schema is correctly SSOT'd in `evaluation/SKILL.md:179-213` and pointed to; no manager-needed content is trapped un-pointed.

---

## Findings 2.3 — Correctness bugs (fix-first) + other improvements

### The ~12 latent bugs (VERIFIED this session; anchors re-pinned where Codex's were off)

| # | Site (verified) | Bug | Fix | Class |
|---|---|---|---|---|
| B1 | `SKILL.md:279` (Codex said :261 — corrected) | RECORD postcondition "Memory writes complete" | → "Session record updated / iteration staged"; RECORD writes session staging, memory is Wrap-up's | semantic-ish |
| B2 | `auto-mode.md:100` | "PASS or Skipped → promote generated skills" | PASS-only (no generated skills exist on Skipped) | wording |
| B3 | `ideation.md:131` | "advance to Planning Loop" | Auto's next loop is **Preparation** (Chat skips prep → Planning). Make mode-explicit | **SEMANTIC** |
| B4 | `ideation.md:58` | loop-entry scaffold lists `outputs/` | `outputs/` is PASS-only (`scaffold --pass`); remove from loop-entry bootstrap | **SEMANTIC** |
| B5 | `preparation.md:34` | "five sub-steps" (table has A-D) | "four sub-steps" | wording |
| B6 | `evaluation.md:3` | loop list omits Preparation | add Preparation | wording |
| B7 | `evaluation.md:276` | defaults omit Preparation | add Preparation. **Point-1 collision** — this is also Point 1's ADD-2 "default 5" line; coordinate | wording |
| B8 | `record.md:121-128` | per-loop summary table omits Preparation | add Preparation (or delete table in compaction) | wording |
| B9 | `wrap-up.md:84` | "Memory promotion → `record/SKILL.md`" | repoint to `wrap-up/SKILL.md` (durable promotion owner); `record/SKILL.md` stays session-record owner | xref |
| B10 | `ideation.md:7` + `planning.md:7` | "four-phase iteration shape" then a 5-item arrow (incl. ITER/EXIT) | standardize: "four sub-phases + the manager ITER/EXIT decision" (matches CLAUDE.md) | wording |
| B11 | `SKILL.md:298-299` vs `ideation.md:133`/`preparation.md:116`/`planning.md:112` + `evaluation.md` verdict-aggregation | **FAIL-behavior conflict:** SKILL.md groups `FAIL` with `REVISE` for auto-re-entry (iter<max → re-enter DISCUSSION); the per-loop ITER/EXIT tables + `evaluation.md` treat any `FAIL` as **escalate-to-user** (safety gate) | **RESOLVED (user, locked decision 3):** FAIL = escalate. Edit `SKILL.md:298-299` to split FAIL from REVISE (REVISE auto-iterates on budget; any FAIL is a safety-gate escalation). This is the canonical behavior the per-loop tables + `evaluation.md` already assume — a pass-1 correctness fix | SEMANTIC — resolved |
| B12 | `auto-mode.md:301`+`evaluation.md:5` → `mistakes/manager-skipped-dual-system-eval.md`; `auto-mode.md:411`+`agent-teams.md:187` → `mistakes/skills-mirror-symlinks-not-copies.md` | both files ABSENT (verified) | create the mistake OR repoint/remove — **out-of-scope follow-up** (locked decision 8) | dead-link |

**Fix-first ordering (locked decision 2):** apply B1-B11 as **pass 1 before any deletion**, so compaction does not bury stale behavior. B3/B4 are the semantic pair needing careful cross-doc alignment; B11 is now resolved (FAIL=escalate, locked decision 3) and lands in the same pass 1.

### Other improvements

- **2.3-A — value-telemetry count rule stated 3× (leader-only; more complete than Codex's double):** `record/SKILL.md:200-217` (assistant SSOT) + `workflow/record.md:69-91` (manager validation) + `SKILL.md:356+362-375` (session.json shape). Reduce the latter two to field-list + pointer.
- **2.3-B — output-tree SSOT (`record-map.md`) violated in 6 places** → the "never redraw the record-map tree" guard (locked decision 7).
- **2.3-C — dead-link gate:** run `check-markdown-links.sh` (exists at `orchestration/scripts/`) after edits. No `chat-mode.md:NN` line-refs exist in orchestration/, so Point 1.2's renumber will NOT break orchestration cross-refs. No stray `TODO`/`MEMO` tokens outside chat-mode.md.

---

## Cross-system reconciliation (dual-system record)

Full per-delta log: `working/reconciliation-iter1.md`. Summary:

**Took from Codex (Codex was stronger):**
- The **per-doc target table** (2,587 → ~1,515) with per-doc preserve/condense line-ranges — adopted as the CEILING (see the aggressiveness arc below).
- The **~12 correctness bugs** — the leader's first pass had not hunted latent bugs. Taken in full, but the producer **verified each against the files and re-pinned 2 anchors** (B1 `:261→:279`; B11 located at `:298-299` + the per-loop rows).
- The **uniform 8-point workflow skeleton** — a cleaner articulation than the leader's "extend the RECORD deferral"; adopted (they are the same pattern generalized).
- The **FAIL-behavior reconciliation** finding (B11) — leader had not flagged it; now user-resolved to FAIL=escalate (locked decision 3).

**Kept leader's own (more complete or Codex-absent):**
- The **both-sides gate-preservation findings** — `evaluation.md` mostly-legitimate + the reverse-direction low-risk result. These DEFINE the gate-floors in §2.1; without them, Codex's aggressive 190/185 numbers would have cut manager orchestration.
- The **in-tree RECORD-deferral precedent** (`ideation:408`/`prep:351`/`planning:418`/`exec:205`/`wrapup:502`) — the pattern to EXTEND.
- The **proposer TRIPLE-statement** — Codex found tiers 1+3 (production.md + workflow paras) but MISSED tier 2 (the 5 peer-skill `### Dual-system production` sections). The leader's triple is the complete finding.
- The **value-telemetry TRIPLE** (2.3-A) — Codex found the record.md↔record/SKILL.md double; the leader adds the third `SKILL.md:356/362` copy.
- The **Point-1 line-collision** coordination (`maxIterations` "default 5" lines, incl. B7's `evaluation.md:276`) — Codex does not mention Point 1.

**Merged-selective:** the 2.2 duplication map (Codex's per-pair line-ranges + leader's "evaluation.md mostly legitimate" nuance + proposer-triple); the no-commit + output-tree centralization (both found); the target table = Codex's ceiling annotated with the leader's gate-limited floors.

**THE dual-system divergence that mattered — the aggressiveness fork (logged as such):**
- **Codex** proposed ~41% (aggressive per-doc numbers, e.g. `evaluation.md`→190, `record.md`→185).
- **Leader's grounded both-sides read** showed a conservative ~20% floor if every gate is protected literally — because `evaluation.md`/`record.md` carry ~150L/~100L of manager orchestration with no peer-skill home.
- **User's re-decision (with both reads in hand): FULL ~40% as a CEILING + hard gate-preservation.** The synthesis is neither system's default — Codex's ambition bounded by the leader's gate map. Result: ~1,535-1,550 (≈40%), with `evaluation.md` floored at ~210 and `record.md` at ~185-200. This is the value of the dual-system: one system pushed for reduction, the other mapped what must survive; the user chose the envelope.

---

## Implementation plan (ONE compaction PR, fix-first, 5 passes)

Per Codex's ordering + the locked decisions. **One PR** (2.1+2.2+2.3 bundled), **coordinated with Point 1**.

1. **Pass 1 — FIX correctness (B1-B11) before deleting anything.** Land the 8 wording/xref fixes; apply the user-resolved **B11 FAIL=escalate** split at `SKILL.md:298-299` (locked decision 3); align the 2 remaining semantic ones (B3 mode-explicit transition, B4 outputs/ PASS-only).
2. **Pass 2 — root docs:** compact `SKILL.md` + `auto-mode.md` + `agent-teams.md` to the §2.1 ceilings (all hit ceiling — no gate-limit); hoist the value-telemetry rule (2.3-A) + teammate metadata to their SSOTs.
3. **Pass 3 — workflow docs:** rewrite each `workflow/{loop}.md` to the 8-point skeleton; replace duplicated specialist procedure (executor lifecycle, perspective table, sub-step tables, output trees, no-commit block, proposer tiers 2+3) with pointers per the §2.2 map. **Honor the gate-floors:** `evaluation.md` → ~210 (not 190), `record.md` → ~185-200 with the validation gates compressed-not-cut. Leave `production.md` as the cross-cutting contract (trim only).
4. **Pass 4 — link/path gate:** run `check-markdown-links.sh`; verify every hoisted block appears ONCE; resolve the 2 missing-mistake refs (B12) per the follow-up.
5. **Pass 5 — line-count check** against the §2.1 gate-floor totals (~1,535-1,550, minor variance allowed).

**Point-1 coordination (explicit collision):** the `maxIterations` "default 5" lines in `workflow/{planning,execution,wrap-up,preparation,evaluation,record}.md` are edited by **both** Point 1 (value change) and Point 2 (B7 Preparation-add + escalation-prose re-point). Land Point 1's value PRs first, then rebase Point 2's compaction; OR fold both per line at planning. `evaluation.md:276` is the sharpest overlap (B7 + Point-1 ADD-2).

---

## Verification plan

**ACCEPTANCE TEST (the gate-by-gate preservation test — the primary gate).** After compaction, a manager reading each compacted doc must STILL be able to determine, from that doc alone plus its pointers:
1. **who to spawn** (which specialist for the loop's phases),
2. **what to pass** (the delegation inputs / prompt fields),
3. **what output proves completion** (the artifact + the manager's validation gates),
4. **which decisions require the user** (the escalation triggers / Always-Ask / safety gates),
5. **which doc owns each specialist procedure** (the peer-skill pointers).
Any paragraph that answers one of these STAYS; anything else points to a peer skill / reference doc / nowhere. Walk this test per `workflow/{loop}.md` — a doc that fails any of the five was over-compacted (a gate was cut). This is the acceptance gate for the whole compaction.

**Mechanical gates:**
- **Dedup re-scan (form-covering):** `grep -n "Per-iteration session record is NOT committed" workflow/*.md` → 0; `grep -n "Dual-system production" workflow/*.md` + the 5 peer skills → pointers only; `grep -rn "The canonical tree is" workflow/*.md` → pointer lines, no following fence.
- **Correctness re-verify:** re-grep B1-B11 sites show the fixed text; Preparation now present in `evaluation.md:3/276`, `record.md` table; `SKILL.md:298-299` now splits FAIL (escalate) from REVISE (auto-iterate).
- **Gate-floor check:** `evaluation.md` ≥ ~210, `record.md` retains all 7 validation gates (compressed, not removed).
- **Link gate:** `orchestration/scripts/check-markdown-links.sh` to zero; the 2 missing-mistake refs resolved.
- **Line-count:** per the §2.1 gate-floor totals.

## Out-of-scope follow-ups (separate backlog items)

1. **B12 — 2 missing mistake files** (`manager-skipped-dual-system-eval.md`, `skills-mirror-symlinks-not-copies.md`): create or repoint. Same disposition as Point 1's dangling-xref item — consider one combined "dead mistake-xref" cleanup across Points 1+2.
2. **FLAG-2 — no claude doc-authoring standard exists:** the "point, don't restate; never redraw the record-map tree" guard has no home. Either the first `rules/` entry or a new doc-authoring standard (implementer decides — locked decision 7).

## Open items for the implementer

- **Gate-floors are a hard constraint** — `evaluation.md` ~210, `record.md` ~185-200; the gate-by-gate acceptance test is the arbiter, not the line-count ceiling.
- **B3/B4 mode-awareness** — the Ideation→next-loop transition and the outputs/ scaffold timing must align across `ideation.md`, `SKILL.md`, and the scaffold rule; verify holistically.
- **Point-1 sequencing** on the shared `maxIterations` lines — coordinate PR order.
- **`rules/` guard placement (FLAG-2)** — first `rules/` entry vs doc-authoring standard.
