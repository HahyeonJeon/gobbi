---
type: mistakes
skill: wrap-up
description: "Recorded traps for wrap-up — load before doing wrap-up work"
updated: 2026-07-16
---

# Wrap-Up — Mistakes

> Load before any wrap-up work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Wrap Up Green Check Must Rerun Standing Guards Post Promotion

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — A migration session drove a project content-guard to zero, then Wrap-up promoted 14 memory files plus a journal. The Stage-3 memory-validation gate (both systems PASS) re-ran the frontmatter validator and checked promotion coverage, routing, strip-integrity, and no-delete — but it never re-ran the project's standing content-guard over the post-promotion tree. Seven of the promoted files legitimately quote the retired-form tokens in their body prose. The guard's allowlist had been derived from the pre-promotion tree, so it did not cover the new carriers, and the guard flipped from exit 0 to exit 1 with 17 residuals. The regression was caught only by a manual pre-commit guard re-run, AFTER the dual-system gate had already returned PASS.
**Why it happens** — The Stage-3 evaluation brief enumerated the frontmatter validator as the runnable check and omitted the project's other standing guards. A promotion is not a no-op on content-guards: promoted mistakes, journals, plans, and decisions frequently DOCUMENT the very vocabulary or pattern a guard scans for, so each promotion can add legitimate carriers an allowlist derived before the promotion will not recognize. Validating frontmatter proves the records are well-formed; it says nothing about whether the new content trips a body-content guard. The two checks measure different things, and passing one is silently assumed to cover the other.
**How to detect** — The Wrap-up / Stage-3 brief lists the frontmatter validator as the only runnable green-check and omits the project's content-guards, link checker, or reference resolver; a standing guard the originating session drove to exit 0 reports exit 1 immediately after promotion on lines inside newly promoted files; the flagged lines are documentation of the scanned pattern (a mistake explaining it, a journal narrating it), not live use — the signal that the carrier is legitimate and the allowlist, not the file, needs the change.
**Correct approach** — The Wrap-up green-check (and the Stage-3 brief that drives it) MUST re-run EVERY standing project guard over the post-promotion tree, not only the frontmatter validator: the content/vocab guards, the link checker, and any layer/reference resolver. Enumerate the guards from the project's verification surface and run each against the tree as it stands AFTER promotion. When a promotion adds a legitimate carrier that a guard flags, extend that guard's allowlist using its own discipline (derive from a fresh run, file-plus-line keyed) in the same commit that lands the promotion. Treat "all standing guards exit 0 over the post-promotion tree" as a non-negotiable pre-commit gate, distinct from "frontmatter validates".

### Related
- [[strip-contract-dropped-required-extension-field]] — sibling Wrap-up-promotion trap caught the same session: a promotion step validated against the wrong authority
- The post-promotion green-check procedure this trap governs now lives in `promotion.md` § Post-promotion standing-guard green-check (moved out of `SKILL.md` in the redesign).

## Strip Contract Dropped Required Extension Field

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — The Wrap-up routing contract instructed "strip `domain`" on 6 mistake promotions. `domain` is a REQUIRED mistakes extension — the validator FAILS any mistakes file missing it, and all existing promoted mistakes carry it. Had the strip been applied, all 6 promoted files would have FAILED the non-skippable stage-3 validator gate. The same defect appeared twice more in the same contract: it told the promoter to strip `scope` / `feature` from feature-scoped files (required base fields) and `project-scope` from a backlog (a required backlogs extension).
**Why it happens** — The contract author reasoned only from the staging-field STRIP table (what to remove) and never cross-checked the REQUIRED-extension list (what must remain) for the destination type. The strip table and the required-extension list are two different authorities. A field can be absent from the strip table AND required — `domain` is exactly that: it is not a staging-only field, so the strip table never lists it for removal, yet the standard requires it on every mistakes file. Deriving a strip instruction from the strip table alone silently drops a required field.
**How to detect** — A strip / promotion contract names a field to remove that appears in the destination type's required-extension set (mistakes → `priority` / `domain`; backlogs → `priority` / `project-scope`; references → `title` / `source` / `ref_type`; reviews → `review_kind`; reports → `report_type`) or in the required base set (`scope`, `feature`, etc.); a promoted file fails the validator with a "missing required base field" or "missing required extension" error immediately after a strip step; the strip instruction was written by reading only the strip table.
**Correct approach** — Any routing/strip contract that promotes a file between types MUST validate the final frontmatter against the destination type's required-extension list BEFORE delegating — not just against the strip table. The two checks are complementary: the strip table removes staging-only routing fields; the required-extension list guarantees the destination type's mandatory fields survive. When a contract instruction conflicts with a required field, the producing agent keeps the required field and flags the conflict rather than silently stripping it. The cheapest guard is to run the validator on each promoted file before declaring the promotion done — a clean exit proves no required field was dropped.

### Related
- The frontmatter strip / preserve allowlist this trap governs now lives in `promotion.md` § Frontmatter allowlist on promotion (moved out of `SKILL.md` in the redesign).

## Prior-Record Validation Must Not Mutate Staging

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — The Stage-1 compliance scan needs a normalized candidate to promote, so a tempting shortcut is to "auto-backfill" or normalize a prior-loop staging file IN PLACE (the B-E1 contradiction: the read-only Memory Access Matrix vs a Step-2.5 that wrote back into prior-loop trees). That mutates the very evidence the promotion is verified against, and a mutated source no longer matches what the loop actually produced. A validator that repairs its own input then certifies its own mutation.
**Why it happens** — The scan reads a prior-loop record, finds it needs a mechanical fix (a stamped field, a normalized path), and the closest write target is the source file itself. Validation and repair are treated as one operation, and because the intended promoted result is easy to derive, changing the source feels harmless. But the prior-loop staging tree is the append-only audit trail, so repairing the input to fix the output destroys the trail.
**How to detect** — A Stage-1 procedure has write access to, or WRITES to, any `sessions/{date}-{session-id}/{N}-{loop}/staging/` path; a prior-loop source's path / hash / size / mtime / inode CHANGES between the inventory and the manifest freeze; or a mechanical correction has no matching overlay under `sessions/{date}-{session-id}/5-wrap-up/working/correction-overlays/`.
**Correct approach** — Treat every prior-loop staging source as READ-ONLY; capture before/after path + byte evidence. A deterministic mechanical normalization goes into a correction overlay under `sessions/{date}-{session-id}/5-wrap-up/working/correction-overlays/` and is applied only while rendering the destination candidate; the manifest records source hash + normalization delta + rendered candidate; the original source is never mutated. A judgment-required repair returns `NEEDS_CONTEXT`. A changed prior-loop source is a hard Stage-1 failure — verify by hashing every prior-loop staging file before AND after Stage-1; all unchanged.

### Related
- [[promotion-writer-leaks-content-wrapper-tag]] (`mistakes/docs-sync/promotion-writer-leaks-content-wrapper-tag.md`) — sibling promotion-write trap: the rendered candidate, not the source, is the write surface.

## Stripped Key Cannot Be Rerun Identity

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — The collision / idempotency policy keyed on a staging-only field (`finding-id`) that the promotion strip REMOVES. On re-run over the same immutable inventory, the durable file no longer carries that key, so the idempotency check cannot recognize the prior write — and it creates a `-2` / `-3` suffixed duplicate of a record it already promoted.
**Why it happens** — `finding-id` is a stable-looking hash at staging time, so it is a natural collision key; correlation metadata is confused with durable source identity. But it is a staging-only routing field, stripped on promotion. A field available while rendering cannot later prove that the same source owns the destination, because stripping it is part of the destination contract.
**How to detect** — A collision or idempotency policy names `finding-id`, `mistake-candidate`, `area`, or any other field excluded from durable destination frontmatter as the rerun identity; a re-run recomputes suffixes instead of loading the frozen mapping; or an unchanged source inventory creates `-2` / loop-suffixed files.
**Correct approach** — Key idempotency and collisions on stable SOURCE identity `{session-id, source-relative-path}` plus the frozen manifest mapping — both survive the strip and both identify the destination on re-run. Use stripped fields only as staging-time hints; reuse an identical mapped destination as a no-op, halt on preimage drift, and allocate suffixes only for genuinely distinct stable source identities. Verify by running the mapping twice over the same inventory → identical target set, in-place overwrite, zero suffixed duplicates.

## Stage-3 Cannot Certify Stage-5

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — The Stage-3 memory-validation gate tried to verify Stage-5 git-finalization POSTCONDITIONS — that the finalization commit landed carrying the right surface, that an open PR was reused, that the push / merge / worktree-cleanup succeeded. But Stage-5 runs only AFTER Stage-3 returns PASS, so at Stage-3 those git outcomes do not exist yet; certifying them certifies a non-existent state — a phantom that only appears real one stage later.
**Why it happens** — Both stages name "git finalization", so the gate and the gated action are reviewed as one finished pipeline; the evaluator wants end-to-end assurance and reaches forward into a future stage. But Stage-3 is the gate that PRECEDES and authorizes finalization — a gate cannot verify the outcome of the action it gates.
**How to detect** — A Stage-3 / memory-validation check asks for a successful commit, push, PR mutation, merge, or worktree removal; marks an open-PR-reuse plan PASS as if reuse already happened; or cites Stage-5 postconditions before the Stage-3 verdict exists. The Risk scenario/checklist verifies executed git outcomes at Stage-3 rather than the absence of premature finalization.
**Correct approach** — Stage-3 verifies ONLY (a) that no premature finalization commit / push / merge has run, and (b) that the manager's finalization PLAN and ownership are valid (the plan commits the promotion writes + journal, excludes the gitignored session tree, will reuse an open PR, and records PR-deferred when unavailable). It labels every future git postcondition PENDING. Stage-5 verifies its OWN executed git postconditions after PASS. Pre-finalization git-postcondition checks are removed from the Stage-3 Risk frame.

### Related
- [[split-added-content-must-match-skill-and-runtime-facts]] (`mistakes/docs-sync/split-added-content-must-match-skill-and-runtime-facts.md`) — a claim about a runtime state must match a fact that actually exists; a Stage-5 outcome does not exist at Stage-3.

## Baseline Must Remain Immutable Across REVISE

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [process, verification]`

**What happened** — A Stage-3 `REVISE` returned to Stage 1, which re-ran the snapshot step and overwrote the original `pre-wrap-up-snapshot.txt` baseline with the already-mutated post-iteration-1 tree. The Stage-3 delta then no longer saw the first iteration's promotion writes, so evaluation treated real mutations as if they were part of the baseline.
**Why it happens** — The snapshot step writes the same fixed path unconditionally on every Stage-1 entry. It has no first-write absence guard and gives per-iteration comparisons no iteration-scoped path.
**Correct approach** — Capture `pre-wrap-up-snapshot.txt` only on the first Stage-1 entry and keep it immutable across every `REVISE`. A re-entry reads and reuses that original baseline. Write any derivative comparison to an iteration-scoped artifact such as `snapshot-iter{n}.txt`; the original baseline remains the Stage-3 delta authority.
**How to detect** — Grep the Stage-1 snapshot step for an unconditional write to `pre-wrap-up-snapshot.txt` with no absence guard, or for a per-iteration comparison that reuses the fixed baseline artifact instead of an iteration-scoped derivative artifact.
