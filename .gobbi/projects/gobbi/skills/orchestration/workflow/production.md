# Workflow — Production (Orchestration)

How the **manager** orchestrates the PRODUCTION (WORK) sub-phase that runs inside every workflow loop (Ideation, Preparation, Planning, Execution, Wrap-up). This document is loaded by the manager. The Codex proposer runs as the `codex exec` assistant-wrapper documented in [`codex/SKILL.md` § Dual-System Production](../../codex/SKILL.md); the Claude producer — leader for Ideation/Preparation/Planning, executor for Execution, assistant for Wrap-up — does the integration. Production is the creation-time analogue of [`workflow/evaluation.md`](evaluation.md): evaluation runs two reviewers on a finished artifact; production runs two generators before the artifact is finished.

**The manager spawns exactly two producers — the Claude producer and the Codex proposer — and does NOT integrate.** The Claude producer is the default integrator; the manager adjudicates ONLY large gaps and escalates them to the user. Codex NEVER writes the canonical artifact — it only proposes. Authoring the canonical artifact from the Codex proposal, or having the manager blend the two outputs, is a workflow breach.

The proposer is gated per loop by `workflow.{loop}.propose.mode` (`dual` = run the Codex proposer; `single` = Claude-only), default `dual` for all five steps. All proposer output is **session-scoped** under `sessions/{date}-{session-id}/{N}-{loop}/working/proposals/codex/`; the proposer never writes to memory and never writes the canonical draft.

---

## Why dual-system production

Every WORK sub-phase has one Claude author, so the canonical artifact carries one model family's framing bias, blind spots, and local maxima. The downstream evaluator can only surface defects against an already-committed single-author frame — it cannot inject an alternative production hypothesis at creation. Dual-system production adds a second independent generator at creation, so the anti-groupthink benefit the user trusts at review also exists at creation.

The gain depends on HOW the two outputs are combined. Under **selection-based** integration — fold in the better element, keep the stronger one — a diverse two-system team beats a single model; under naive **synthesis** (averaging / blending) a mixed team loses to a single-model baseline. So the producer SELECTS, never synthesizes (see § Producer selective integration). The selective-integration step's quality, not the mere presence of a second proposer, is the dominant lever.

The two generators do **not** see each other while generating. Inter-generator visibility would re-introduce the bandwagon and anchoring biases the dual-system mandate exists to remove. Independent generation is the signal; a Codex-first or Claude-first hand-off would destroy it.

---

## Spawning the Producers

Per enabled WORK sub-phase, the manager spawns two producers in **parallel-independent** generation:

| Producer | Who | Output (independent) | Sees the other? |
|---|---|---|---|
| **Claude producer** | leader (Ideation / Preparation / Planning) · executor (Execution) · assistant (Wrap-up) | canonical `working/draft-iter{n}.md` | no |
| **Codex proposer** | `codex exec` assistant-wrapper ([`codex/SKILL.md` § Dual-System Production](../../codex/SKILL.md)) | `working/proposals/codex/draft-iter{n}.md` | no |

The Codex proposer follows the `codex exec` discipline owned by [`codex/SKILL.md`](../../codex/SKILL.md): write+verify the prompt file before invoking, launch `codex exec` per the [§ `codex exec` launch runtime matrix](../../codex/SKILL.md#codex-exec-launch-runtime-matrix), kill by explicit PID (never `pkill -f`), and validate the proposal **structurally** (file exists / > 0 bytes / a `PROPOSAL:` header) — never by a content-vocabulary grep. The manager does not re-implement that discipline here; it spawns the wrapper and reads the frozen proposal file.

When `propose.mode: single`, the manager spawns only the Claude producer. This is a **deliberate, configured Claude-only run** — it is NOT degraded mode, so it does **NOT** stamp the degraded-mode label. The degraded-mode label (`production_mode: claude-only` + `codex_proposal_absent_reason`) is stamped ONLY when `propose.mode: dual` but the Codex proposal is empty / times out / errors (see § Degraded-mode policy).

---

## The two-phase freeze boundary

The parallel-generate-then-integrate model widens the window in which an evaluation target can change under the evaluator. Production pins it with an explicit two-phase freeze, derived from [`evaluation/mistakes.md#freeze-producer-artifact-before-evaluating`](../../evaluation/mistakes.md#freeze-producer-artifact-before-evaluating):

1. **PRE-INTEGRATION freeze.** Both independent outputs — the producer's first draft and the Codex proposal at `working/proposals/codex/draft-iter{n}.md` — are pinned before the producer begins integrating. The producer integrates against the **frozen** proposal; it never races a still-writing Codex run.
2. **Integration.** The producer selectively integrates into the canonical `working/draft-iter{n}.md` (next section).
3. **POST-INTEGRATION freeze.** The canonical artifact is frozen before the manager spawns the EVALUATION evaluators — no moving target during review.

The manager confirms the proposer's terminal output is the one on disk (read it; it carries the `PROPOSAL:` header) before releasing the producer to integrate, and confirms the canonical draft is terminal before dispatching evaluators.

**Proposer source-read-only gate (C-HIGH-4).** The Codex proposer runs under `--sandbox workspace-write`, so the prompt-only "write only your proposal" instruction is UNENFORCED — a proposer CAN write a source / skill / tracked file it was never meant to touch. The gate's job is to catch exactly that: it checks the SOURCE tree, NOT the proposal dir. Run it **right after the proposer completes and BEFORE the producer integrates** — at that point no legitimate source change exists yet, so a stray write cannot be confused with the producer's (or, in Execution, the executor's) later tracked-source edits. The manager runs `git -C <worktree-abs> status --porcelain` and confirms **no source / skill / tracked-file change appears**. The proposal writes live under the gitignored session tree (`.gitignore` → `.gobbi/projects/*/sessions/`), so `git status` cannot see them by design — an empty (or source-clean) porcelain output is the expected pass, NOT "changes confined to `working/proposals/codex/`" (that can never show). Any tracked-file modification OR untracked non-ignored file that appears is a proposer boundary violation and a **process failure**: the manager reverts the stray write and re-runs the proposer (or degrades to Claude-only per § Degraded-mode policy); it NEVER integrates a proposal from a boundary-violating run. Use `status --porcelain` ONLY — `git diff --stat` is fail-open here, since it misses untracked new files.

> **Residual limitation:** a proposer writing a SIBLING ignored session file (e.g. the canonical `working/draft-iter{n}.md`) is NOT caught — that path is gitignored too. If that confinement must be enforced, a filesystem check is required: `find <session-tree> -newer <pre-proposer-marker> -not -path '*/proposals/codex/*'`. Noted as a known limitation; not built here.

---

## Producer selective integration (SELECT, never synthesize)

The Claude producer is the **default integrator**. After the pre-integration freeze, it reads the frozen Codex proposal and performs **principle-based selective integration**:

1. Enumerate the substantive deltas between its own draft and the proposal.
2. Fold in the Codex element where it better satisfies the 10 principles + the Scope Contract + memory/mistakes; keep its own where stronger. **Never naive-blend** — integration is a SELECTION, not an average and not a third synthesized artifact.
3. Record the **Integration Log**, then surface any unresolvable delta (a large gap) to the manager.

This is evaluation's "never average" rule applied to creation: SELECTION wins; synthesis loses.

### Integration Log

Location: `working/reconciliation-iter{n}.md` (Execution: `task-{NN}-{slug}/working/reconciliation-iter{n}.md`). The Integration Log lives in `working/` as the loop's selection-quality audit trail — read in-loop by the EVALUATION evaluators and, in Chat, the finding-discussion gate — and is removed with the worktree at cleanup. It is not promoted as a file. Any substantive selection decision that warrants durable memory reaches memory through the **normal RECORD finding-staging path** — staged as a decision / design finding like any other and promoted at Wrap-up — not via a dedicated copy of the log. One row per delta:

| Field | Meaning |
|---|---|
| `delta` | what differs between the producer's draft and the Codex proposal |
| `decision` | `took-codex` / `kept-own` / `merged-selective` / `escalated` |
| `why` | the deciding principle # or Scope Contract clause |
| `codex_origin` | boolean — `true` where the canonical artifact now carries a Codex-originated element |

The per-delta `why` citation is the auditable record of selection quality; the `codex_origin` flags mark which canonical sections carry Codex-origin content (the input the downstream evaluators implicitly check).

**Structural validation.** Before spawning the EVALUATION evaluators, the manager validates the Integration Log structurally with [`validate-integration-log.sh`](../scripts/validate-integration-log.sh) `<path>`. It confirms every data row's `decision` is in the `{took-codex, kept-own, merged-selective, escalated}` enum and that every `merged-selective` row names both sides via a **names-both-sides heuristic** (a whole-word mention of both the producer's own side and the Codex side in the `delta`/`why` text). This is a **structural + heuristic** gate — enum membership plus the names-both-sides word check — NOT a proof that the selection was genuine rather than a disguised third draft. It catches the un-auditable single-side row the gate exists to reject; it does not certify intent. It reads the `decision` **column** (field `$4`, escape-aware so an escaped pipe `\|` inside a cell does not shift the columns), never a body-wide substring grep — so anti-synthesis prose like "SELECT, never blend" cannot false-fail a correct log (the COD-STRUCT-1 lesson). Exit 0 = structurally valid; nonzero prints the offending row and reason to fix before evaluation.

---

## Gap classification

When the producer cannot resolve a delta by principle, it classifies the gap. This maps 1:1 onto evaluation's Minor/Major divergence ladder:

| Class | Trigger | Path |
|---|---|---|
| **LARGE** | ANY of: (a) an Always-Ask category (Design / Scope / Destructive); (b) the two drafts are mutually exclusive at the artifact's core (a fork); (c) principle analysis cannot pick a winner (equipoise) | producer surfaces → **manager adjudicates** → escalate a decision card to the user |
| **SMALL** | additive / refinement / stylistic / clearly principle-decided | producer integrates locally + logs it in the Integration Log; no interrupt |

The **large-gap escalation is a safety gate — it interrupts in BOTH Auto and Chat** (it is NOT routine triage). It reuses the evaluation safety-gate contract: it is the production analogue of evaluation's Major-divergence stop-the-line. Small-gap integration is producer-local: in Chat the manager may surface the Integration Log at the existing finding-discussion gate; in Auto it is recorded and reviewed at Wrap-up. See [`auto-mode.md`](../auto-mode.md) and [`chat-mode.md`](../chat-mode.md) for the per-mode behavior.

---

## Degraded-mode policy (Claude-only fallback)

**Degraded mode applies ONLY under `propose.mode: dual`.** A `propose.mode: single` loop is a deliberate, configured Claude-only run — it is NOT degraded mode and carries NO degraded-mode label. Degraded mode is the distinct case where `dual` was configured but the Codex proposal failed.

A missing Codex **proposer** is NOT a safety gate — contrast a missing Codex **evaluator**, which IS (see [`workflow/evaluation.md` § Degraded-mode policy](evaluation.md)). When `propose.mode: dual` is set but the Codex proposal is empty, times out, or errors:

1. The Codex-side wrapper reports **BLOCKED** — it never self-authors a proposal to cover for the absent Codex output.
2. The producer proceeds **Claude-only** — it never fabricates a proposal to stand in for Codex.
3. The producer stamps a **durable label** in the canonical artifact's frontmatter: `production_mode: claude-only` plus `codex_proposal_absent_reason: <timeout|empty|error>`.

RECORD preserves both fields into the loop `outputs/` frontmatter (see [`record/SKILL.md` § Artifact frontmatter schema](../../record/SKILL.md)), so a degraded artifact can never look dual-system-produced. A `dual` artifact omits the absent-reason field. This makes degraded mode auditable rather than silent.

---

## Proposer ↔ evaluator independence

The Codex proposer and the Codex evaluator are **distinct, stateless `codex exec` runs** — each a fresh process with its own prompt and no shared context. Independence rests on three structural facts:

1. The proposer and the evaluator are independent processes; they cannot share state.
2. The artifact the evaluator reviews is the **Claude-authored canonical** draft, re-expressed by the producer during integration — never the Codex proposal file.
3. The Codex proposal transcript **NEVER enters the Codex evaluator prompt**. Feeding it in would re-introduce the self-preference bias the dual-system mandate removes. The manager enforces this before spawn with the **manual/semantic classification gate** in [`evaluation.md` § Pre-spawn independence classification](evaluation.md): it READS the evaluator prompt and judges it against the property's meaning. A literal path-grep (e.g. `grep -rl 'working/proposals/' <prompt>`) is **advisory evidence only, never the gate** — a bare `working/proposals/` path inside an off-limits warning ("do NOT read `working/proposals/`") is a PASS, which a literal grep would false-fail. Gate on the meaning, not the substring.

**The cross-family independence control for integrated content is the independent dual EVALUATION itself** — two systems (Claude + Codex) review every canonical artifact every loop, before RECORD. A producer that self-preferred a weaker frame is caught in-loop by the two cross-family evaluators, not deferred to Wrap-up. The residual self-preference touches only the Codex-origin sections of an otherwise Claude-authored, re-expressed artifact; it is **accepted and bounded**. The structural hardening — a different model/effort tier between the Codex proposer and the Codex evaluator — is the staged feature backlog `proposer-evaluator-model-tier-guard`, pulled in only if the residual is observed. No origin-aware verdict weighting is added; that would change the out-of-scope evaluation mechanism.

---

## Output paths

All proposer + integration writes are **session-scoped**. The proposer never touches memory; Codex never writes the canonical draft.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{N}-{loop}/working/proposals/codex/draft-iter{n}.md` | Codex proposer (`codex exec` wrapper) | Per enabled WORK iter — the independent Codex proposal (frozen before integration) |
| `sessions/{date}-{session-id}/{N}-{loop}/working/reconciliation-iter{n}.md` | Claude producer | Per integration — the Integration Log (`delta` / `decision` / `why` / `codex_origin` rows) |
| `sessions/{date}-{session-id}/{N}-{loop}/working/draft-iter{n}.md` | Claude producer | The canonical artifact (frozen before EVALUATION) |

**Execution per-task exception.** In the Execution loop each task carries the full quartet under `4-execution/task-{NN}-{slug}/`, so the proposal and Integration Log live at `task-{NN}-{slug}/working/proposals/codex/draft-iter{n}.md` and `task-{NN}-{slug}/working/reconciliation-iter{n}.md`.

**Path conventions** — `{date}`, `{session-id}`, `{N}-{loop}`, and `{n}` follow [`workflow/evaluation.md` § Output paths](evaluation.md). The `working/proposals/codex/` slot is scaffolded with the rest of the loop interior; the scaffold script and `record/record-map.md` own that shape.

---

## Cross-references

- Codex proposer wrapper pattern + launch-mode (per the § `codex exec` launch runtime matrix) / timeout / PID-kill / structural-validation discipline + degraded-mode label → [`codex/SKILL.md` § Dual-System Production](../../codex/SKILL.md)
- Degraded-mode label preservation into `outputs/` → [`record/SKILL.md` § Artifact frontmatter schema](../../record/SKILL.md)
- The dual EVALUATION that reviews the integrated artifact → [`workflow/evaluation.md`](evaluation.md), [`evaluation/SKILL.md`](../../evaluation/SKILL.md)
- Per-loop WORK orchestration → [`workflow/ideation.md`](ideation.md), [`workflow/preparation.md`](preparation.md), [`workflow/planning.md`](planning.md), [`workflow/execution.md`](execution.md), [`workflow/wrap-up.md`](wrap-up.md)
- Large-gap safety-gate vs producer-local small-gap, per mode → [`auto-mode.md`](../auto-mode.md), [`chat-mode.md`](../chat-mode.md)
- WORK loop state machine + the `working/proposals/` tree → [orchestration `SKILL.md`](../SKILL.md)
