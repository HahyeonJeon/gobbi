---
name: wrap-up
description: MUST load for Wrap-up. Promotes typed session staging, produces the evaluated handoff, and proves the session is ready for manager-owned Git finalization.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Wrap-up

Use this skill after all planned Execution tasks pass. The assistant accounts for typed staging, freezes and applies a complete promotion manifest inside the session worktree, writes one evidence-backed handoff body in session and durable memory, and proves the result ready for finalization.

Wrap-up is the final productive step. It uses DISCUSSION → WORK → EVALUATION → RECORD like every other productive step. It is not a separate closeout sequence. The manager alone performs Git finalization after PASS RECORD.

## Principles

### Promotion begins only from typed staging

Typed staging is the complete source set. Scratch, discussion history, WORK artifacts, evaluator reports, outputs, and ad hoc direct candidates are not promotion sources. Empty staging is a valid result and must not be filled with invented material.

### Plan the complete mutation before writing

Inventory every source, route, destination, preimage, lifecycle update, archive move, and reference change before the first durable-memory write. One invalid row blocks the complete apply.

### Prior evidence is immutable

Earlier staging, creation artifacts, and evaluation reports are read-only evidence. Normalize only in a Wrap-up-owned candidate. Never repair an authoritative source in place.

### The next session receives facts, not recollection

Every completion claim cites an artifact, verification result, or commit. The evaluated handoff body is identical in its session output and durable note. Git facts created after evaluation belong only in the finalization receipt.

## Rules

### Must follow

- **W-1 — Use the universal loop.** DISCUSSION locks closure inputs; dual-system WORK creates and applies the promotion and handoff; two fresh evaluators inspect the actual result; RECORD seals PASS artifacts.
- **W-2 — Inventory typed staging only.** Recursively account for every file in every expected step-level and Execution-task staging directory. Each source has one outcome: promote, explicit defer, explicit drop, or already promoted.
- **W-3 — Accept empty staging.** Record that the inventory is empty and continue. Do not create a note, finding, rule, or mistake merely to make staging non-empty.
- **W-4 — Freeze all mutations and preimages.** The manifest covers the entire source set and every destination or related lifecycle mutation before apply. Capture whole-file preimages for shared destinations.
- **W-5 — Write only inside the isolated worktree.** Resolve every durable target from the validated session worktree and prove it is not the main checkout or another worktree.
- **W-6 — Apply idempotently.** Stable source identity plus the frozen mapping selects the destination. Equal bytes are a no-op; preimage drift halts and rebuilds the complete manifest.
- **W-7 — Close with the right lifecycle, archive, and never delete.** A true one-record supersession is
  reciprocal. Retirement, completion, and abandonment do not invent successors. Move every complete
  terminal record to the sole project-root typed archive with its exact compatible reason. Preserve the
  frozen body verbatim under Memory's archive-body contract, then repoint active inbound path references.
- **W-8 — Validate the actual post-promotion tree.** Reconcile every changed path to the frozen manifest,
  prove prior staging is unchanged, and run the applicable memory, link, mistake, vocabulary, and
  topology guards. Apply Memory's link scope exactly: archive bodies stay outside relative-link
  resolution, while every changed active carrier and every live namespace move remains link-gated.
- **W-9 — Produce one nine-section handoff body.** The session output and durable note bodies match. Every claim and next action has direct evidence.
- **W-10 — Keep finalization manager-owned.** The assistant does not push, merge, remove a worktree, delete a branch, or claim that a planned Git action succeeded.
- **W-11 — Repeat full review after material change.** A change to the manifest, promoted tree, or handoff starts another complete iteration with dual-system WORK and two fresh evaluations.

### Must not follow

- Do not promote from working, evaluation, outputs, runtime history, or an ad hoc direct input.
- Do not mutate prior staging to make it validate.
- Do not apply a partial valid prefix before the complete batch validates.
- Do not invent a destination type, area, schema field, scope, or collision policy.
- Do not delete a durable record or session evidence.
- Do not finalize Git before PASS RECORD.

## Procedure

### 1. Confirm closure inputs in DISCUSSION

Read every canonical step artifact, approved finding disposition, user decision, waiver, task commit, verification result, current branch and worktree state, and configured Git policy. Enumerate all expected staging directories from the locked task list and record owner.

Present omissions, conflicts, final material additions, deferred work, risks, and publication intent to the user. Any final durable material must first be written to the correct typed Wrap-up staging directory under the normal RECORD rules. Do not create a special direct-input path.

Evidence: a user-approved closure contract and exact expected-source register.

### 2. Inventory immutable staging

Recursively enumerate each expected typed staging directory at step and Execution-task altitude. Record path relative to the session root, type, size, hash, and source identity. Include empty directories in the accounting. Exclude every non-staging path.

Hash prior staging before further work. A missing expected staging directory is a record-shape failure. An existing empty directory is valid.

Evidence: a stable, sorted inventory whose row count reconciles to the filesystem.

### 3. Run the neutral WORK contract

Freeze the closure contract, staging inventory, routing owners, current durable preimages, prior artifacts, commits, verification, finalization policy, and handoff requirements as identical inputs to the workflow-owned dual-system WORK procedure.

Both systems independently design the promotion manifest and the complete nine-section handoff body. Cross-reviews challenge omission, routing, idempotency, evidence, wrong-tree risk, supersession, and resume usability. Route every material conflict to the user before apply.

After synthesis and user decisions, write the durable handoff candidate through the notes template into the current Wrap-up typed staging directory. Recompute and freeze the complete staging inventory, now including that candidate. Derive the session handoff candidate from the same body. No other WORK artifact becomes a promotion source.

Evidence: a validated dual-system package, one decision-complete handoff body, and a final typed-source inventory.

### 4. Render and validate every candidate

For each staged file, ask the owning memory rules for its legal destination, durable frontmatter, scope, area, and lifecycle behavior. Read routing fields before stripping them from the candidate. Use user decisions only where the owner declares a material routing fork.

Render candidates in Wrap-up working space. Mechanical normalization changes only the candidate and records the source hash plus delta. Semantic gaps return NEEDS_CONTEXT. Validate every candidate and every shared-file result before continuing.

Evidence: one validated candidate or explicit no-write outcome for every inventory row.

### 5. Freeze the promotion manifest and preimages

Create one source-accounting row per staged source and one mutation row per path the apply may change.
Include creates, replacements, shared-file appends, reciprocal true-supersession edits, non-successor
terminal stamps, project-root archive moves, inbound-reference repoints, and any required index update.

Capture absent or exact hashed preimages for every target, move source, move destination, and reference carrier. Freeze the complete manifest and its hash only after all rows and candidates validate. If any row is invalid, make zero durable writes.

### 6. Recheck and apply inside the worktree

Immediately re-read every frozen preimage. On any difference, make zero writes and rebuild the complete manifest against fresh state. When all match, apply only the frozen rows in stable order inside session.json.git.worktreePath.

After each mutation, verify the expected bytes or move state. Stop at the exact failed row on I/O error and preserve the manifest for recovery. On rerun, equal candidate bytes at the same frozen target are a no-op; never allocate a suffix for the same stable source.

### 7. Complete supersession and archive moves

For each authorized true one-record supersession, write the new record and add reciprocal lifecycle
links. For each authorized design retirement, plan completion/abandonment, or checklist retirement,
keep `superseded_by` absent or null. Stamp the status-compatible archive reason and matching date, move
the complete record to project-root `archive/{type}/{area}/`, and repoint every inbound path reference
as one frozen mutation set. Preserve original type, scope, feature, and every body byte, including
historical outbound relative-link text. A feature-local archive destination is invalid. The exact
archive-body, active-carrier, and live-namespace link boundary remains owned by
[`memory/rules.md` §2.7](../memory/rules.md#27-strict-archive-form); do not invent or narrow it here.

Never delete or reduce the old record to a tombstone. If the source and new candidate conflict without authorized supersession, halt for a user decision.

### 8. Verify the post-promotion project tree

Diff the actual durable project tree against the frozen preimages. Every changed path must map to exactly one mutation row, and every mutation row must have the expected result. Re-hash prior staging and prove paths and bytes are unchanged.

Run all applicable post-promotion validators from their current owners. Run Memory validation with no
arguments for the live tree, then explicitly validate every newly rendered project-root archive path in
strict mode. Prove each new archive body byte-identical to its frozen active preimage. Run the root
Markdown-link validator over every changed active Markdown file, including inbound carriers, but do not
submit frozen archive bodies to relative-link resolution. A stale active inbound path fails, and a live
namespace move receives the complete changed-Markdown gate with no archive exception. Resolve a
legitimate new guard carrier through a new complete iteration; do not patch it outside the manifest.
Freeze final tree hashes and guard evidence for EVALUATION.

### 9. Reconcile the handoff with the actual result

The synthesized handoff body has these sections in this order:

1. Outcome and agreed scope.
2. Completed or shipped work, with artifact and verification evidence.
3. Dual-system evaluation result, approved finding dispositions, and any waiver.
4. Decisions to respect.
5. Durable memory promoted or superseded.
6. Pre-finalization Git state and authorized finalization plan.
7. Unresolved, blocked, or deferred items with explicit reasons.
8. Known risks and accepted exceptions.
9. Exact next-session start point: objective, required reads, branch and worktree state, and first action.

Use durable repository-relative paths for continuation. Each completion claim cites a commit and verification evidence. Each unresolved item has a runnable next action. Do not claim a commit, push, pull request, merge, or cleanup result that has not occurred.

Compare every promotion and Git claim with the actual post-promotion tree and current Git state. If any material claim differs, do not edit the promoted note or session candidate in place. Start a complete new iteration, rebuild the handoff candidate and manifest from typed staging, and repeat dual-system WORK.

### 10. Store one matching body in two locations

The session candidate is destined for 4-wrap-up/outputs/handoff.md on PASS. The durable candidate originated in typed staging and was promoted to notes/{area}/{YYYY-MM-DD}-{slug}.md with the required notes frontmatter. Compare the body bytes, excluding only the durable frontmatter wrapper. They must match.

Include both candidates and their hashes in the evaluated subject. The session output remains absent until PASS RECORD; the durable note is already part of the applied and verified promotion manifest.

### 11. Submit the actual result to EVALUATION

Give both fresh evaluators the complete creation package, frozen manifest, source inventory, all preimages, actual post-promotion tree, applied-delta comparison, prior-staging hashes, guard results, handoff candidates, and authorized Git plan. Neither evaluator sees the other's report.

The evaluated subject is the actual tree, not the intended manifest alone. A material correction repeats the complete WORK and EVALUATION stages.

### 12. Seal PASS artifacts and hand off finalization

After dual PASS and the approved disposition batch, RECORD seals the session handoff, canonical promotion evidence, and durable pointers. Confirm the final handoff body still matches the evaluated durable note and the record verifies.

Return control to the manager. The manager creates verified local commits and performs only configured, authorized publication or merge actions. The manager appends a factual finalization receipt after displaying the complete evaluated handoff; the evaluated body is not mutated to add those later facts.

Completion evidence: complete staging accounting, frozen and idempotently applied manifest, unchanged prior evidence, green post-promotion tree, matching handoff bodies, dual PASS, PASS-only session outputs, and a manager-owned finalization plan.

## References

- [Workflow Wrap-up adapter](../workflow/steps/wrap-up.md) owns entry, user gates, evaluator dispatch, transitions, and finalization handoff.
- [Dual-system WORK](../workflow/steps/dual-system-work.md) owns independent creation and reciprocal review mechanics.
- [Record map](../record/record-map.md) owns the session tree, typed staging vocabulary, and command paths.
- [Record](../record/SKILL.md) owns staging capture, PASS-only outputs, and RECORD validation.
- [Memory rules](../memory/rules.md) own durable types, routing, frontmatter, true supersession,
  non-successor terminal states, strict archive behavior, and archive/link validation scope.
- [Evaluation](../evaluation/SKILL.md) owns the independent review method, causal findings, verdict derivation,
  and repeat review. The active workflow adapter owns dual reports and finding dispositions.
- [Git](../git/SKILL.md) owns finalization, publication, merge authority, and safe cleanup.
