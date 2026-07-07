---
name: point-01-chat-mode-cycles-and-length
description: Dual-system review of the Chat-mode compact-cycles + doc-length change request, with an implementation-ready change-set.
type: reviews
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [evaluation]
keywords: [workflow, chat-mode, maxIterations, compact-cycles, token-cost, condensation, state-template-split]
author: claude
review_kind: code-review
subject: orchestration/chat-mode.md + templates/settings.chat.json (Chat compact-cycles + doc length)
verdict: needs-attention
---

# Point 1 — Chat-mode compact cycles + doc length

## Point (verbatim user text)

> Point 1 — chat-mode of orchestration skill.
> 1. The chat-mode should have more compact cycles. Current chat-mode includes maxIter=5. But Planning loop should only have maxIter=1, Execution Loop should have maxIter=3, Wrap-up Loop should have maxIter=3. Ideation should stay deep. Expectation: shorter turn-over per topic while keeping ideation deep.
> 2. The chat-mode.md looks too long / narrative-heavy. It causes a lot of token usage in every skill-loading phase.

## Session context

- **Mode:** Chat-mode review. **Implementation is DEFERRED** — this doc edits no skill / agent / settings file; it is the review + implementation-ready change-set a future session executes.
- **Reviewers (dual-system):** `leader` (Claude, this producer) + an independent `codex` proposer. The Codex proposal was frozen before integration; the producer selectively integrated it (SELECT the stronger element, never blend). The cross-system record is in § Cross-system reconciliation.
- **Verdict `needs-attention`:** direction is fully approved and all three decision forks are resolved. The verdict is not `pass` because the change-set carries **correctness-implementation work that must not be skipped**: MF-1 (the shared-rule counting-convention pin) and MF-2 (the state-template split + its parity guard + the three-mirror deployment). These are specified below, not open questions.

## Decisions locked

**User decisions (locked this session):**
1. **Planning REVISE handling:** keep Planning `maxIter=1`, keep `evaluate.mode: always`; on a REVISE, route to Chat's **existing after-EVALUATION user gate** (accept / revise-once / reframe). **No hard `Aborted`.** (Leader option (b) = Codex Option A + Option C gate wording.)
2. **ADR / provenance history in chat-mode.md §1–§2:** **RECLASSIFY** to a `decisions/` record (preserve per never-delete, memory/rules.md §4.3) — not delete, not footnote.
3. **Fork #3 — the settings→state propagation gap is resolved by SPLITTING the state template by mode** (parallel to the existing `settings.{mode}.json`): create `state.auto.json` + `state.chat.json`, replacing the generic `state.template.json`. `settings.{mode}.json` stays the **authoritative** cap source; the split only makes the DEFAULT seed born mode-correct; Config still stamps any customize-gate override into `state.json` from resolved settings; a parity guard prevents the two mode-template families from drifting. Full design in MF-2.

**Manager-locked confirmations:**
4. **Chat-only** — Auto keeps `maxIterations: 5` across the board; `settings.auto.json` + the Auto defaults table are untouched (and `state.auto.json` keeps all-5).
5. **Pin the counting convention** — `maxIterations` = "max WORK passes", so `1` reliably means one-shot. Clarifies the **shared** SKILL.md iteration rule (Auto reads it too). See MF-1.
6. **Two separate implementation tasks / two PRs** — 1.1 (compact cycles + the state split + correctness fixes) and 1.2 (length) ship separately, from this one review doc.
7. **Out-of-scope adjacents are SEPARATE backlog follow-ups** — not folded in: (a) the dangling `mistakes/skills-mirror-symlinks-not-copies.md` xref; (b) the D4-008 glossary drift (`EVAL` / `MEMO` / `InProgress` tokens), fixable opportunistically only IF the 1.2 length pass already edits those lines.

---

## Findings 1.1 — Compact cycles

### Cap values (as decided)

| Loop | Current Chat | New Chat | Auto (unchanged) | Note |
|---|---:|---:|---:|---|
| Ideation | 5 | **5** | 5 | stays deep — user intent |
| Preparation | 0 / `skip: true` | **0 / skip** | 5 | already Skipped at loop entry in Chat |
| Planning | 5 | **1** | 5 | one-shot; REVISE → user gate (not Aborted) |
| Execution | 5 | **3** | 5 | up to 3 WORK passes per sub-step |
| Wrap-up | 5 | **3** | 5 | up to 3 remediation iterations |

Behavioral risk: execution=3 and wrap-up=3 are safe budget trims (auto-iteration preserved; exhaustion escalates to the present user). planning=1 changes the loop's *shape* — see Planning-REVISE semantics + MF-1.

### Full edit-site change-set

The blast radius is **~9 doc files + settings.chat.json + one script edit + a parity-guard addition + the state-template split (2 new files, 1 deletion) across canonical + 3 mirror surfaces.** Every `file:line` is from the versions read this session.

**Behavioral source — `templates/settings.chat.json`:**

| Line | Current | New |
|---|---|---|
| 24 | `planning.maxIterations: 5` | `1` |
| 31 | `execution.maxIterations: 5` | `3` |
| 38 | `wrap-up.maxIterations: 5` | `3` |
| 10 | `ideation.maxIterations: 5` | unchanged |
| 16-17 | `preparation.skip: true`, `maxIterations: 0` | unchanged |
| 22 | `planning.evaluate.mode: always` | **unchanged** (eval kept per locked decision 1) |

**Mode doc — `orchestration/chat-mode.md` (canonical only; `.claude/…` mirror is a symlink — edit canonical, symlink reflects):**

| Line | Current (excerpt) | New |
|---|---|---|
| 48 | "up to 5 remediation … (`wrap-up.maxIterations: 5`)" | `5 → 3` (count + inline value) |
| 76 | diagram "Ideation Loop (maxIter=5)" | unchanged |
| 99 | diagram "mini Planning Loop (maxIter=5)" | `→ maxIter=1` |
| 105 | diagram "mini Execution Loop … (maxIter=5)" | `→ maxIter=3` |
| 121 | diagram "Wrap-up Loop (maxIter=5)" | `→ maxIter=3` |
| 146 | "ideation … (Chat default = 5)" | unchanged |
| 176 | "planning … (Chat default = 5)" | `→ 1` + one-shot note |
| 194 | "execution … (Chat default = 5)" | `→ 3` |
| 229 | "wrap-up … (Chat default = 5)" | `→ 3` |
| 237 | "up to `max=5` remediation iterations" | `→ max=3` |
| 301 | §5 "Iteration cap is 5 for Ideation / Planning / Execution …" | **rewrite per-loop** (see below) |
| 524 | §8.2 "ideation … iter == maxIter (5)" | unchanged |
| 530 | §8.2 "planning … iter == maxIter (5) → Aborted" | `(5) → (1)` + **reword the To-state/Guard to the user-gate, not `Aborted`** (locked decision 1) |
| 535 | §8.2 "execution … iter == maxIter (5)" | `(5) → (3)` |
| 559-562 | §8.3 worked example "iter 1 PASS" | no cap change (first-pass illustration) |

§5 L301 rewrite (per-loop):
> "**Iteration caps are per-loop in Chat:** Ideation 5, Planning 1 (one-shot — a REVISE routes to the after-EVALUATION user gate, §3 Step 4 / §8.2, not a hard abort), Execution 3, Wrap-up 3; Preparation skipped. (Auto keeps 5 across the board — `auto-mode.md §4`.) Exhausting a loop's budget without `PASS` is a signal to reframe or split — at the tighter Chat caps this is deliberate: short turn-over per topic while Ideation stays deep."

**Shared state-machine doc — `orchestration/SKILL.md` (cap semantics):**

| Line | Current | New |
|---|---|---|
| 264 | "`maxIterations` is read from `workflow.{step}.maxIterations` (default `5`)." | Clarify: read from **resolved settings**; defaults are mode-specific (Auto 5 all loops; Chat 5 / 0-skipped / 1 / 3 / 3). |
| 274-282 | Iteration rule (`iter` starts 0; abort at `iter == maxIterations`) | **MF-1** — pin "`maxIterations` = max WORK passes" so `1` = one-shot. |

**Shared state-machine doc — `orchestration/SKILL.md` (state-template references, updated for the split, MF-2):**

| Line | Current | New |
|---|---|---|
| 111 (Config row 4) | stub source "`templates/state.template.json`" + "Set `mode` from resolved settings" | name the mode template `state.{mode}.json`; **document that Config stamps any customize-gate `maxIterations` override into `state.json` from resolved settings** |
| 112 (Config row 4R) | link `[state.template.json]` | update the link; note 4R rehydrates the persisted `state.json` unchanged (no template re-read on resume) |
| 247 | "Initial template \| [`templates/state.template.json`]" | the two mode templates `state.auto.json` / `state.chat.json` |
| 357 | "Both `templates/state.template.json` and `templates/session.template.json` seed `workflow.chat: { tasks: [] }`" | name `state.chat.json` (+ `state.auto.json` keeps the empty `chat.tasks`) |

**Workflow sub-docs (consistency — the "generic default 5 → mode-specific" clarification; NOT per-value edits):**

| File:line | Current | New |
|---|---|---|
| `workflow/evaluation.md:276` | "default 5 for Ideation/Planning/Execution, 5 for Wrap-up" | mode-specific (Auto 5; Chat 5/0/1/3/3) |
| `workflow/planning.md:115` | "planning.maxIterations (default 5)" | "Auto 5; Chat 1" + note first-REVISE → user gate |
| `workflow/execution.md:107` | "execution.maxIterations per task (default 5)" | "Auto 5; Chat 3" |
| `workflow/wrap-up.md:47, 53` | "wrap-up.maxIterations default 5" | "Auto 5; Chat 3" |
| `workflow/preparation.md:121` | "preparation.maxIterations (default 5)" | "Auto 5; Chat 0/skipped" |
| `workflow/record.md:316` | "loop's iteration cap (…default 5)" | generic note (or leave; lowest priority) |

**Auto side must NOT change:** `settings.auto.json:24/31/38`, `auto-mode.md:74/92/110/128/146/205-209`, and the new `state.auto.json` all keep 5. Optional: an `auto-mode.md` cross-ref note that the Chat-vs-Auto difference now includes compact caps, not only preparation-skip.

**Disambiguation (must be LEFT):** "5-row loop" (chat-mode.md:100/106, auto-mode.md) is the phase COUNT (DISCUSSION/WORK/EVAL/RECORD/ITER-EXIT), NOT a cap.

### Correctness must-fix MF-1 — the counting-convention off-by-one (co-headline)

`SKILL.md:264/276-282` says **`iter` starts at `0`** and aborts at **`iter == maxIterations`**, incrementing while `iter < maxIterations`. Read literally, `maxIterations:1` yields **two** WORK passes (iter 0, then iter 1). But the Status Display (`SKILL.md:131` "1/5") and the §8.3 worked example (`chat-mode.md:559` "iter 1 PASS") render the **first pass as iter 1** — a 1-based display over a 0-based counter. The conventions disagree about whether `maxIterations` is "max WORK passes" or "max re-entries after the first pass."

At `maxIter=5` nobody notices; at `maxIter=1` it is the whole point — one pass vs two. **Fix (locked decision 5):** pin **"`maxIterations` = max WORK passes"** so `1` = exactly one pass. Reword the SKILL.md iteration rule (e.g. "the loop runs at most `maxIterations` WORK passes; on the `maxIterations`-th REVISE it exits to the mode's cap-exhaustion path") and confirm the display renders `current/max` consistently. Shared rule — Auto reads it too — a deliberate cross-mode clarification landed in task 1.1.

> Codex under-weighted this: it restated the literal rule but did not flag the contradiction, and its Option B ("set Planning to 2 for one automatic fix pass") implicitly assumed the 1-based reading — precisely the ambiguity MF-1 resolves. Kept as a leader-owned co-headline correctness fix.

### Correctness must-fix MF-2 — settings→state propagation, RESOLVED by the state-template split (fork #3)

**Root gap.** `state.template.json:6-10` seeds every productive loop's `maxIterations` to `5` and stamps a NEW session's `state.json` (Config row 4). `state.json` carries `maxIterations` per loop (`SKILL.md:251`) and per chat task sub-record (`SKILL.md:357`). Config row 4 (`SKILL.md:111`) documents only "set `mode` and states" — NOT a copy of `maxIterations` from resolved settings. So a mode-agnostic template seeding `5` could survive into `state.json` and make the Chat value flip **docs-only** (caps stay 5) if the runtime reads the cap from `state.json`.

**Resolution (fork #3 — the user's third option, better than the leader's A/B or Codex's Option B).** Split the state template by mode, exactly parallel to the existing `settings.{mode}.json`:

1. **Create `templates/state.auto.json`** — all productive loops `maxIterations: 5` (identical to today's generic template).
2. **Create `templates/state.chat.json`** — ideation 5, preparation 0, planning 1, execution 3, wrap-up 3. (Keep the same rest-of-shape: `configuration` null, `chat: { tasks: [] }`, `activeNote`.)
3. **Delete `templates/state.template.json`** (after the one live reader is repointed — see the reader sweep).
4. **Edit `record/scripts/init-record-map.sh:86`** — `stub state.template.json state.json` → `stub "state.$mode.json" state.json`, mirroring the adjacent line 87 `stub "settings.$mode.json" settings.json`. `$mode` is `$2` (already validated by the settings stub). Result: a fresh `state.json` is born mode-correct; **no resume-time overlay needed** (row 4R rehydrates the persisted `state.json` unchanged).
5. **`settings.{mode}.json` stays AUTHORITATIVE.** The split only fixes the DEFAULT seed. If the user overrides a cap at the Config customize gate (`SKILL.md:110` row 3), Config (row 4) MUST stamp that override into `state.json` from resolved settings — otherwise the seed is stale. Document this explicitly (the row-4 edit above).
6. **Parity guard.** Add a check (extend `record/scripts/verify-record-map.sh` or a sibling guard) asserting `state.{mode}.json` caps == `settings.{mode}.json` caps for each loop, so the two mode-template families cannot drift.

**Why the split is low-risk (precedent):** `settings.{auto,chat}.json` already exists and is already mirrored across all runtime surfaces — the state split follows the identical, proven pattern. It also removes the mode-agnostic-template hazard entirely rather than papering over it with an overlay.

**Three-mirror deployment (feasibility — verified this session).** `templates/` is mirrored three ways, so the 2-create + 1-delete must reach every surface:

| Surface | Kind | Action |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/templates/` | canonical (real files) | create `state.auto.json` + `state.chat.json`; delete `state.template.json` |
| `.claude/skills/orchestration/templates/` | per-file **symlinks** to canonical | add 2 symlinks; remove the `state.template.json` symlink (content auto-reflects; the symlink entries themselves must be created/removed) |
| `.agents/skills/orchestration/templates/` | physical **copies** (Codex runtime) | add 2 copies; delete 1 |
| `plugins/gobbi/skills/orchestration/templates/` | physical **copies** (Claude Code plugin) | add 2 copies; delete 1 |

The `init-record-map.sh:86` edit likewise must reach the physical-copy mirrors (`.agents`, `plugins`); `.claude` reflects it via its script symlink. Run the standard deployment/mirror-sync step (G1 deployment-hygiene precedent) so canonical → mirrors, and confirm presence on all four surfaces.

### state.template.json reader sweep (exhaustive — feasibility check)

Repo-wide grep (`state\.template\.json`, plus `state[._-]template` / `stateTemplate`; worktrees/.git/node_modules excluded):

| Class | Site(s) | Action |
|---|---|---|
| **Live code reader (repoint)** | `record/scripts/init-record-map.sh:86` | THE edit — `stub "state.$mode.json" state.json` |
| **Live doc readers (update for the split)** | `orchestration/SKILL.md:111, 112, 247, 357` | update per the SKILL.md split-reference table above |
| **Frozen — archive/ (LEAVE, §4.6)** | `archive/design/workflow/2026-07-03-{d1-001,d7-001,d7-002}*.md` | none |
| **Historical memory (LEAVE; optional parenthetical only)** | `features/workflow/decisions/…/2026-06-08-session-tree-spec-doc.md:25`; `features/workflow/design/…/{codex-proposer-model,d7-001…shipped,d7-002…shipped}.md`; `features/workflow/plans/…/2026-07-03-workflow-state-record-coherence-fix-plan.md` (×4) | none required (describe past decisions/scoping) |
| **Frozen review records (LEAVE)** | `reviews/adversarial-review/2026-06-29*.md`, `…/2026-07-01-codex-*.md` (×several; also cite the `.agents/…/state.template.json` mirror) | none |

**Confirmed:** `scaffold-session-dir.sh` has NO state-template reference (tolerates the split); `verify-record-map.sh` only asserts `state.json` exists (tolerates it, and is the natural home for the new parity guard). The ONLY live code reader is `init-record-map.sh:86`. No TS/JS/hook reader exists.

### Planning `maxIter=1` REVISE semantics (as decided)

Per locked decision 1: Planning stays one-shot with mandatory evaluation. On a REVISE at the single pass, the manager does **not** stamp a hard `Aborted`; it routes to Chat's **existing after-EVALUATION user gate** (`chat-mode.md §5` L296-300 — "after EVALUATION → discuss findings and remediation"), where the user picks **accept-as-is / revise-once (ad-hoc cap raise) / reframe**. Keeps the dual-system plan-evaluation signal, avoids the `Aborted` stigma, matches Chat's user-driven posture. Reinforced by `workflow/evaluation.md:266` (Chat already escalates a stuck finding to the user before the cap; it notes "chat-mode.md is silent on stuck detection" — a reconciliation point). Implementation: one clarifying sentence in §5 + the §8.2 planning row (L530) reworded from `→ Aborted` to `→ user gate`.

Alternative considered and rejected (recorded): Codex Option B — Planning `maxIterations: 2` (one automatic repair pass). Rejected: does not match the user's requested value; the user chose one-shot + user gate.

---

## Findings 1.2 — Length / token cost

### Measurement (dual-system cross-check)

| Doc | Lines | Words | Bytes (`wc -c`) | Chars (`wc -m`) | Rough tokens |
|---|---:|---:|---:|---:|---:|
| **chat-mode.md** | **617** | 5,124 | 40,348 | 39,206 | **~9,800–10,600** |
| auto-mode.md (peer) | 413 | 4,237 | 32,628 | 32,268 | ~8,100–8,600 |
| SKILL.md | 446 | 7,448 | 56,463 | 55,901 | ~14,000 |

(bytes-vs-chars gap = multi-byte box-drawing / status glyphs.) chat-mode.md is **~204 lines longer and ~1.5× the token weight of its peer auto-mode.md**, for a simpler runtime shape.

**When it loads (recurring cost):** dispatched at Configuration end (`SKILL.md:80-86`) — Chat → chat-mode.md, Auto → auto-mode.md. **Confirmed it does NOT load in Auto sessions.** It reloads into the manager's context at session start + every resume / `/clear` / `/compact` re-prime; the manager is the durable cross-task agent, so on a long chat session the ~10K tokens recur several times, alongside `SKILL.md`.

### Normative content to PRESERVE (verbatim or condense-only)

| Range | Why preserved |
|---|---|
| §2 term lock "per-task slice" (L39-41) | naming lock |
| §3 per-step tables (L148-237) | the actual procedure; carries the cap values 1.1 edits |
| §4 Chat RECORD R5 lock blockquote (L246-270) | single-canonical-statement lock |
| §6 task-record spec (L338-441) | session-artifact contract |
| §8.2 state-transition table (L519-539) | normative state contract |
| §9 discuss-first contract (L578-588) | mode-level regression guard |

### Condensable / redundant content (line ranges + per-cut estimate + risk)

| # | Range | What | Cut | ~Saving | Risk |
|---|---|---|---|---:|---|
| K1 | §1 ADR history L15-29 | "why this doc exists" provenance | **RECLASSIFY to `decisions/`** + 1-line `## Source` pointer (locked decision 2; never delete) | ~250-350 tok | Low |
| K2 | §1↔§2 overlap L34-57 | mode-posture stated ~3× + re-frame list pre-echoing §3 | merge to one ~12-line posture section | ~250-380 tok | Low-med |
| K3 | §3 ASCII diagram L68-128 | duplicates the per-step tables below | replace with a compact table (step / cap / owner / exit) carrying the new caps | ~900-1,200 tok | Med — table MUST preserve all caps + skip |
| K4 | §4 sub-bullets L272-282 | re-enumerate base RECORD steps the R5 lock says run "unmodified" | keep the lock quote + promotion-source para; drop the restatement | ~150-250 tok | Low |
| K5 | §5 discipline L286-327 | overlaps §3 + SKILL.md State Machine + production.md | 6 short bullets + links; **keep the 3 in-loop gates + mistake moment-of-capture** | ~500-800 tok | Med |
| K6 | §8.3 worked example L541-575 | one status-display render | move to appendix or delete (§8.2 table is the normative source) | ~600-800 tok | Low |
| K7 | cross-refs L591-617 | long list, some duplicate inline links | shrink to essential owner docs | ~300-450 tok | Low |
| (K6.2) | §6.2 frontmatter-deferred L386-401 | deferred-decision history | condense to the current default rule + a backlog pointer — **only if Planning resolved the frontmatter choice; else keep a short warning** | ~250-350 tok | Med |

### Recommended condensation approach

**In place, no file split.** Target **~30% reduction** (~150-215 lines / ~2,500-3,500 tokens), toward peer parity with auto-mode.md (~410-430 lines). Preserve every NORMATIVE anchor; take all cuts from the condensable list. **Reclassify, never delete** (K1 per locked decision 2 + memory/rules.md §4.3). **Edit canonical only** (mirror is a symlink). Acceptance test: after condensation, chat-mode.md states no rule already owned elsewhere (record/SKILL.md for RECORD, SKILL.md State Machine for gates, production.md for integration) — it keeps only Chat-specific deltas + its own locks.

---

## Cross-system reconciliation (dual-system record)

Full per-delta log: `working/reconciliation-iter1.md`. Summary:

**Both systems agreed (independent convergence — the strong signal):**
- The cap value set (planning 1 / exec 3 / wrap-up 3; ideation 5; prep skip) and the chat-mode.md doc-site list.
- The `state.template.json` settings→state propagation gap (MF-2). Codex surfaced it as a "runtime consistency caveat" + open question; the leader's post-mistake addendum reached it independently. Two paths, one finding — high confidence.
- The broader blast radius including the workflow sub-docs.
- Planning REVISE → keep `maxIter=1` + keep eval + user gate (leader (b) = Codex A + C).

**Fork #3 evolution (recorded — the dual-system → user path):**
- Leader offered options (a) document-the-overlay / (b) verify-then-overlay in SKILL.md rows 4/4R.
- Codex offered "stamp from resolved settings during Configuration, OR split state initialization by mode" (its Open Q2) — i.e. Codex named the split as one branch.
- **The user chose the split** (`state.auto.json` + `state.chat.json`), a cleaner third option than an overlay: it removes the mode-agnostic-template hazard at the source and reuses the proven `settings.{mode}.json` pattern. Adopted as locked decision 3.

**Codex-only additions (integrated):**
- The five workflow sub-doc consistency sites with `file:line` (took the union incl. `preparation.md:121` as an edit site).
- The D4-008 glossary drift (`EVAL` / `MEMO` at L525, `InProgress`) — routed to an out-of-scope follow-up (opportunistic-only).
- The concrete `rg` verification patterns (incl. `EVAL|MEMO|InProgress`).
- The Planning `maxIter=2` alternative — recorded as considered-and-rejected.

**Leader-only (kept-own):**
- **MF-1, the counting-convention off-by-one** — co-headline correctness fix; Codex under-weighted it.
- **ADR history → reclassify, not delete** — Codex leaned delete; overridden by locked decision 2.

**No major divergence** requiring user adjudication; the substantive fork (delete-vs-reclassify ADR history) and the state-source fork were both resolved by user decisions.

---

## Implementation plan (two ordered tasks / two PRs)

**Order matters:** Task 1.1 first, then Task 1.2. Task 1.2 renumbers most of chat-mode.md, which would invalidate 1.1's line anchors — so 1.1 lands the behavior first, and 1.2 is authored against the post-1.1 file.

### Task 1.1 (PR 1) — compact cycles: value flip + state-template split + correctness fixes

1. `settings.chat.json`: planning `1`, execution `3`, wrap-up `3` (ideation/prep unchanged; `evaluate.mode` unchanged).
2. **State-template split (MF-2 / fork #3):** create `templates/state.auto.json` (all-5) + `templates/state.chat.json` (5/0/1/3/3); delete `templates/state.template.json`; edit `record/scripts/init-record-map.sh:86` to `stub "state.$mode.json" state.json`. Propagate to all three mirror surfaces (`.claude` symlinks: +2/−1; `.agents` + `plugins` copies: +2/−1) via the deployment/mirror-sync step.
3. **Parity guard:** extend `record/scripts/verify-record-map.sh` (or a sibling) to assert `state.{mode}.json` caps == `settings.{mode}.json` caps per loop.
4. `chat-mode.md`: the ~11 doc sites above, incl. the §5 L301 per-loop rewrite and the §8.2 L530 planning-REVISE → user-gate reword.
5. `SKILL.md`: **MF-1** (pin `maxIterations` = max WORK passes, L274-282) + L264 mode-specific-defaults clarify + the state-template split references (L111 incl. the customize-gate override-stamping, L112, L247, L357).
6. Workflow sub-docs consistency: `evaluation.md:276`, `planning.md:115`, `execution.md:107`, `wrap-up.md:47/53`, `preparation.md:121` (optional `record.md:316`).
7. Optional `auto-mode.md` consistency note.
8. Verify per the Verification plan.

### Task 1.2 (PR 2) — length: in-place condensation

1. Apply K1-K7 (+ K6.2) cuts; target ~30% / ~410-430 lines.
2. Reclassify the §1 ADR history to a `decisions/` record (never delete); leave a 1-line `## Source` pointer.
3. Preserve every NORMATIVE anchor; edit canonical only.
4. Opportunistic ONLY if a cut already edits those lines: repair the D4-008 `EVAL` / `MEMO` / `InProgress` tokens (else leave to the separate backlog item).
5. Verify per the Verification plan.

---

## Verification plan (for the implementer)

**After Task 1.1 — cap vocabulary (form-covering, not single-pattern — per the recorded enumerate-across-forms traps):**

```sh
rg -n 'maxIter=5|Chat default = 5|Iteration cap is 5|up to .max=5|wrap-up\.maxIterations: 5|iter == maxIter \(5\)' \
  .gobbi/projects/gobbi/skills/orchestration/chat-mode.md \
  .gobbi/projects/gobbi/skills/orchestration/SKILL.md \
  .gobbi/projects/gobbi/skills/orchestration/workflow
# Expect: only Ideation-specific hits (chat-mode.md:76, :146) + intentional generic "default 5" after clarify.

rg -n '"maxIterations": 5' .gobbi/projects/gobbi/skills/orchestration/templates/state.chat.json
# Expect: ONE hit (Ideation). state.chat.json: planning 1 / execution 3 / wrap-up 3 / preparation 0.
```

**After Task 1.1 — state-template split integrity:**

```sh
# (a) zero LIVE readers of the deleted template remain (archive/reviews/plans historical hits are expected):
rg -n 'state\.template\.json' \
  .gobbi/projects/gobbi/skills .claude .agents plugins/gobbi
# Expect: no hit under skills/ scripts or the runtime mirrors; init-record-map.sh now says state.$mode.json.

# (b) the split files exist on ALL four surfaces:
for d in .gobbi/projects/gobbi/skills/orchestration/templates \
         .claude/skills/orchestration/templates \
         .agents/skills/orchestration/templates \
         plugins/gobbi/skills/orchestration/templates; do
  ls "$d"/state.auto.json "$d"/state.chat.json 2>&1
done
# Expect: present on all four; state.template.json absent on all four.

# (c) parity guard: state.{mode}.json caps == settings.{mode}.json caps (the new guard automates this).
```

**MF-1 runtime check:** confirm a fresh chat session's `state.json` shows planning `1` / exec `3` / wrap-up `3` after Config (born from `state.chat.json`), and that a customize-gate override is stamped through from resolved settings.

**After Task 1.2:** form-covering grep of every removed phrase family before/after; re-read the §4 R5 lock, §8.2 table, §6 task-record spec, §9 discuss-first to confirm no lock was dropped. If the state-transition area was touched:

```sh
rg -n 'EVAL|MEMO|InProgress' .gobbi/projects/gobbi/skills/orchestration/chat-mode.md
# Expect: zero non-historical hits in canonical state / sub-phase slots (D4-008), or each remaining hit explicitly classified historical.
```

---

## Out-of-scope follow-ups (separate backlog items — do NOT fold into 1.1/1.2)

1. **Dangling xref** — `chat-mode.md:613-615` + `auto-mode.md:411-413` reference `mistakes/skills-mirror-symlinks-not-copies.md`, which does not exist as a file (verified). Backlog: create the mistake or repoint the references.
2. **D4-008 glossary drift** — stale `EVAL` / `MEMO` (chat-mode.md:525) + non-canonical `InProgress` tokens in the §8.2 table. Backlog; opportunistic during 1.2 only if that pass already edits the same lines.

## Open items for the implementer

- **MF-1 wording:** land the "max WORK passes" pin as a shared-rule edit; confirm the Status Display `current/max` rendering stays consistent for both modes.
- **Customize-gate override stamping (MF-2):** the split fixes the default seed, but a user cap override at the Config customize gate must still be stamped into `state.json` from resolved settings — verify and document at SKILL.md row 4.
- **Deployment sync:** the 2-create/1-delete template change + the `init-record-map.sh` edit must reach `.agents` + `plugins` physical-copy mirrors (and the `.claude` symlink entries be created/removed). Run the standard mirror/deployment step; verify presence on all four surfaces (see Verification (b)).
- **Planning REVISE ↔ stuck-detection reconciliation:** reconcile the after-EVALUATION user-gate wording with `workflow/evaluation.md:266` so the two do not describe the one-shot-planning REVISE differently.
- **1.2 frontmatter-deferred cut (K6.2):** only condense §6.2 if Planning has resolved the `task-record` frontmatter choice; else keep the short warning.

## Process mistake-candidate (for RECORD staging — self-caught)

**Symptom:** the iter1 blast-radius map was built by reading only the three files the brief named; it missed `state.template.json`, the five workflow sub-docs, and the three-mirror deployment surface. **Why:** enumeration by named-file reading instead of an exhaustive form-covering grep + manual classification across all surfaces (templates, scripts, mirrors, state schema). **Detect:** any "full blast radius / affected-file map" claim not backed by a repo-wide, multi-form grep. **Correct approach:** for any cross-cutting contract, grep every syntactic form of the concept across the whole tree (skills, scripts, hooks, templates, mirrors) and classify each hit before declaring the map complete. Recurrence-class of `mistakes/refactor/enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete.md` + `mistakes/refactor/cotouch-enumeration-must-cover-semantic-equivalents.md`. (Corrected this session after the user prompt; the finalized change-set above is the post-correction map.)
