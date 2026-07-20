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

**What happened** — A migration session drove its scoped checks to zero, then Wrap-up promoted durable records. Dual-system EVALUATION re-ran the frontmatter validator and checked promotion coverage, routing, strip integrity, and no-delete, but it did not re-run the rest of the verification declared by the shipped change against the actual post-promotion worktree. A manual pre-commit check then found the regression after both evaluators had returned PASS.
**Why it happens** — The evaluation contract treats schema validation as if it proves content and reference correctness too. Promotion changes the worktree: a well-formed record can still add a broken link, violate a feature-specific invariant, or reintroduce retired behavior. Those checks measure different properties.
**How to detect** — The Wrap-up EVALUATION brief lists the frontmatter validator as its only runnable check, omits the implementation's declared verification commands, or gives evaluators a pre-promotion tree instead of the actual post-promotion worktree and frozen manifest.
**Correct approach** — Freeze the complete verification set in Wrap-up WORK, apply the promotion manifest inside the isolated worktree, and run every relevant owner check against that actual post-promotion tree before and during dual-system EVALUATION. Include the promotion manifest, destination preimages, changed paths, and verification evidence in both evaluator inputs. A schema-clean promotion is necessary but not sufficient.

### Related
- [[strip-contract-dropped-required-extension-field]] — sibling Wrap-up-promotion trap caught the same session: a promotion step validated against the wrong authority
- The post-promotion verification procedure is owned by the Wrap-up WORK and EVALUATION contracts.

## Strip Contract Dropped Required Extension Field

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [verification, process]`

**What happened** — The Wrap-up routing contract instructed "strip `domain`" on six mistake promotions. `domain` is a required mistakes extension — the validator fails any mistakes file missing it. The same defect appeared twice more: the contract told the promoter to strip `scope` / `feature` from feature-scoped files and `project-scope` from a backlog, even though they are required destination fields.
**Why it happens** — The contract author reasoned only from the staging-field STRIP table (what to remove) and never cross-checked the REQUIRED-extension list (what must remain) for the destination type. The strip table and the required-extension list are two different authorities. A field can be absent from the strip table AND required — `domain` is exactly that: it is not a staging-only field, so the strip table never lists it for removal, yet the standard requires it on every mistakes file. Deriving a strip instruction from the strip table alone silently drops a required field.
**How to detect** — A strip / promotion contract names a field to remove that appears in the destination type's required-extension set (mistakes → `priority` / `domain`; backlogs → `priority` / `project-scope`; references → `title` / `source` / `ref_type`; reviews → `review_kind`; reports → `report_type`) or in the required base set (`scope`, `feature`, etc.); a promoted file fails the validator with a "missing required base field" or "missing required extension" error immediately after a strip step; the strip instruction was written by reading only the strip table.
**Correct approach** — Any routing/strip contract that promotes a file between types MUST validate the final frontmatter against the destination type's required-extension list BEFORE delegating — not just against the strip table. The two checks are complementary: the strip table removes staging-only routing fields; the required-extension list guarantees the destination type's mandatory fields survive. When a contract instruction conflicts with a required field, the producing agent keeps the required field and flags the conflict rather than silently stripping it. The cheapest guard is to run the validator on each promoted file before declaring the promotion done — a clean exit proves no required field was dropped.

### Related
- The frontmatter strip / preserve contract is verified as part of the frozen promotion manifest in Wrap-up WORK.

## Prior-Record Validation Must Not Mutate Staging

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — Wrap-up WORK needed a normalized candidate to promote, so a tempting shortcut was to "auto-backfill" or normalize a prior-loop staging file in place. That mutates the very evidence the promotion is verified against, and a changed source no longer matches what the productive step actually produced. A validator that repairs its own input then certifies its own mutation.
**Why it happens** — The scan reads a prior-loop record, finds it needs a mechanical fix (a stamped field, a normalized path), and the closest write target is the source file itself. Validation and repair are treated as one operation, and because the intended promoted result is easy to derive, changing the source feels harmless. But the prior-loop staging tree is the append-only audit trail, so repairing the input to fix the output destroys the trail.
**How to detect** — A Wrap-up WORK operation writes to any prior productive step's staging directory; a staged source's path, hash, size, or bytes change between inventory and manifest freeze; or a normalized destination has no recorded source hash and transformation evidence in the Wrap-up iteration's working package.
**Correct approach** — Treat every prior-loop staging source as read-only and capture source hashes in the frozen promotion manifest. Render any deterministic normalization into the current Wrap-up iteration's working candidate or directly into the declared destination while preserving the source; record the normalization delta and destination preimage. A judgment-required repair returns `NEEDS_CONTEXT`. Re-hash prior-loop staging after application and require byte-for-byte equality.

### Related
- [[promotion-writer-leaks-content-wrapper-tag]] (`mistakes/docs-sync/promotion-writer-leaks-content-wrapper-tag.md`) — sibling promotion-write trap: the rendered candidate, not the source, is the write surface.

## Stripped Key Cannot Be Rerun Identity

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — The collision / idempotency policy keyed on a staging-only field (`finding-id`) that the promotion strip REMOVES. On re-run over the same immutable inventory, the durable file no longer carries that key, so the idempotency check cannot recognize the prior write — and it creates a `-2` / `-3` suffixed duplicate of a record it already promoted.
**Why it happens** — `finding-id` is a stable-looking hash at staging time, so it is a natural collision key; correlation metadata is confused with durable source identity. But it is a staging-only routing field, stripped on promotion. A field available while rendering cannot later prove that the same source owns the destination, because stripping it is part of the destination contract.
**How to detect** — A collision or idempotency policy names `finding-id`, `mistake-candidate`, `area`, or any other field excluded from durable destination frontmatter as the rerun identity; a re-run recomputes suffixes instead of loading the frozen mapping; or an unchanged source inventory creates `-2` / loop-suffixed files.
**Correct approach** — Key idempotency and collisions on stable SOURCE identity `{session-id, source-relative-path}` plus the frozen manifest mapping — both survive the strip and both identify the destination on re-run. Use stripped fields only as staging-time hints; reuse an identical mapped destination as a no-op, halt on preimage drift, and allocate suffixes only for genuinely distinct stable source identities. Verify by running the mapping twice over the same inventory → identical target set, in-place overwrite, zero suffixed duplicates.

## Evaluation Cannot Certify Later Git Finalization

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [verification, process]`

**What happened** — Wrap-up EVALUATION tried to verify post-loop Git-finalization outcomes: that the final commit landed, an open pull request was reused, and push, merge, or worktree cleanup succeeded. Those actions run only after the loop returns PASS, so the outcomes did not exist when the evaluators reviewed them.
**Why it happens** — The evaluator wants end-to-end assurance and reaches forward into a later manager action. But EVALUATION gates finalization; it cannot certify the result of an action it has not yet authorized.
**How to detect** — A Wrap-up evaluator asks for a successful final commit, push, pull-request mutation, merge, branch deletion, or worktree removal, rather than reviewing the pre-finalization Git state and authorized plan. Future outcomes are written as completed facts in the evaluated handoff.
**Correct approach** — Wrap-up EVALUATION verifies that no premature finalization ran and that the handoff accurately records the pre-finalization Git state plus the configured, authorized finalization plan. Label future actions as pending. After PASS and RECORD, the manager runs finalization and appends a factual receipt to the response without mutating the evaluated handoff body.

### Related
- [[split-added-content-must-match-skill-and-runtime-facts]] (`mistakes/docs-sync/split-added-content-must-match-skill-and-runtime-facts.md`) — a claim about runtime state must match a fact that actually exists; a future finalization outcome does not exist during EVALUATION.

## Baseline Must Remain Immutable Across REVISE

`priority: high` · `domain: process` · `added: 2026-07-16` · `status: active` · `tags: [process, verification]`

**What happened** — A Wrap-up `REVISE` began another full iteration and overwrote the original destination-preimage baseline with the already-mutated post-iteration-1 tree. The new evaluation delta no longer saw the first iteration's promotion writes, so real mutations appeared to be part of the baseline.
**Why it happens** — The preimage capture writes one fixed artifact on every iteration without a first-write guard. The procedure does not distinguish the immutable session baseline from iteration-scoped comparison evidence.
**Correct approach** — Freeze the destination preimages once before the first promotion application and keep them immutable across every `REVISE`. Each later full WORK iteration reuses that baseline and writes derivative evidence only under its own `working/iteration-{n}/` package. The original preimages remain the authority for idempotency and complete-session delta review.
**How to detect** — The Wrap-up WORK contract unconditionally rewrites a frozen preimage or inventory artifact on each iteration, or a per-iteration comparison reuses the immutable baseline path as its output.
