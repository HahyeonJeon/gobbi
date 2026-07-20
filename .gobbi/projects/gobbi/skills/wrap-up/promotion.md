# Wrap-up Promotion WORK Lookup

Read this child during Wrap-up WORK after [`SKILL.md`](SKILL.md). The parent owns the operation, the universal DISCUSSION → WORK → EVALUATION → RECORD loop, and the handoff contract. This lookup supplies the detailed promotion mechanics: typed-source inventory, candidate rendering, complete manifest and preimage freeze, stable apply, interrupted recovery, actual-tree reconciliation, and the evidence sent to both fresh evaluators.

Promotion is one operation inside WORK. It accepts only regular files beneath Record-authorized typed `staging/` directories. It never treats scratch, drafts, cross-reviews, synthesis, evaluator reports, outputs, or another direct input as a promotion source.

## WORK boundary and evidence locations

The current iteration's normal creation package stays at the Record-owned locations below `4-wrap-up/working/iteration-{n}/`. Promotion-support evidence is stored as flat Markdown files under that iteration's `research/` directory so it remains inside the authorized session shape:

| Evidence | Iteration-scoped working path |
|---|---|
| Final recursive staging inventory and immutable source hashes | `4-wrap-up/working/iteration-{n}/research/staging-inventory.md` |
| Candidate validation and source-accounting decisions | `4-wrap-up/working/iteration-{n}/research/candidate-register.md` |
| Complete frozen source and mutation manifest | `4-wrap-up/working/iteration-{n}/research/promotion-manifest.md` |
| Whole-file destination and mutation preimages | `4-wrap-up/working/iteration-{n}/research/destination-preimages.md` |
| Ordered row receipts and interrupted-run state | `4-wrap-up/working/iteration-{n}/research/apply-receipt.md` |
| Actual changed-tree reconciliation | `4-wrap-up/working/iteration-{n}/research/project-delta.md` |
| Prior-staging rehash and owner-provided validator results | `4-wrap-up/working/iteration-{n}/research/promotion-verification.md` |

The canonical synthesis contains the resolved promotion plan and handoff body. `open-decisions.md` records material conflicts and their user-approved resolutions. The current Wrap-up handoff candidate is a normal typed notes source at `4-wrap-up/staging/notes/{slug}.md`; it is not a working-file exception.

Earlier step and task staging is immutable evidence. Wrap-up may create its own typed notes source, but it may not edit, rename, move, replace, or normalize any earlier staged file. A deterministic mechanical normalization is rendered into the destination candidate and recorded in the candidate register; it never changes the source. A semantic gap returns `NEEDS_CONTEXT`.

## Promotion procedure

Run the following actions in order during WORK. One invalid source, candidate, decision, preimage, or mutation row blocks the complete apply.

### 1. Enumerate every expected typed staging directory

Derive the expected step-level and Execution-task staging roots from the locked plan and the Record-owned tree. Recursively visit every authorized typed directory, including nested `backlogs/feature/` and `backlogs/project/`. Record each directory even when it contains zero files.

Reject a missing expected directory, symbolic link, non-regular source, unknown type directory, source outside the current session, or path that resolves outside `session.json.git.worktreePath`. Exclude every non-staging path without inspecting it as a candidate.

For each eligible file, record its normalized session-root-relative path, type directory, size, SHA-256 digest, and stable source identity `{sessionId, source-relative-path}`. Sort by source-relative path. This identity and the frozen mapping, not a stripped frontmatter field, control reruns.

An inventory containing no files is valid. Record the empty result and continue without creating a finding, rule, note, or other filler. The required closure handoff is authored later because the workflow requires a handoff, not to make the initial inventory non-empty.

### 2. Account for every source and validate candidate intent

Give every inventoried source exactly one source-accounting outcome:

- `promote`, with one authorized typed destination;
- `defer`, with the approved reason, owner, and continuation pointer;
- `drop`, with the approved evidence-based rationale; or
- `already-promoted`, with the prior frozen mapping and equal-byte proof.

No source may have two outcomes or disappear from the register. A defer or drop is an accounting decision, not permission to create a hidden destination.

Validate each source against its matching Memory template and authoritative evidence. Confirm its type, scope, area input, routing fields, lifecycle intent, sensitive-content handling, and user authority for every material fork. A syntactically plausible file with unsupported durable content is invalid.

Hash every earlier staging source before and after this pass. Any path or byte change is a hard failure.

### 3. Synthesize and stage the handoff source

Both independent Wrap-up drafts and reciprocal reviews cover the complete promotion plan and the same handoff body. The active-runtime assistant synthesizes them and resolves every material conflict through the manager's user gate.

Render the resolved handoff body through [`memory/templates/notes.md`](../memory/templates/notes.md) and write it as one typed source at `4-wrap-up/staging/notes/{slug}.md`. Then recompute and freeze the final recursive inventory. The handoff source follows the same validation, mapping, preimage, apply, and evaluation rules as every other typed source.

Do not create a `staging/rules/` directory. The Record vocabulary has no ordinary rule source, and Wrap-up has no direct rule-write exception.

### 4. Render complete destination candidates

For every `promote` row, resolve the legal durable home through [Staging → Memory routing](#staging--memory-routing), then render the complete destination bytes through the matching Memory template and [frontmatter allowlist](#frontmatter-allowlist-on-promotion).

Record the candidate path and digest, exact source digest, resolved type, scope, area, preferred slug, destination, user-decision references, any deterministic normalization delta, collision decision, and lifecycle intent. Validate the entire rendered candidate. For a shared destination, render and validate the complete resulting file, not only an appended section.

Never invent a type, scope, area, schema key, route, or collision rule. A missing owner decision returns `NEEDS_CONTEXT` before any durable write.

### 5. Freeze one complete source and mutation manifest

The manifest contains two closed sets:

1. one source-accounting row for every file in the final inventory; and
2. one mutation row for every path the apply may create, replace, append, move, or repoint.

Each mutation row records a stable row ID, owning source identity or authorized lifecycle set, operation, target, complete candidate digest or move result, dependencies, and expected postcondition. Include related mutations such as shared-file changes, reciprocal supersession edits, archive moves, inbound path-reference repoints, and any owner-required index change.

Capture the whole-file preimage for every mutable path. Use `absent` for a missing path or the exact content digest plus relevant metadata for an existing path. A move captures both source and destination preimages. A shared file captures its complete bytes. A reference repoint captures the complete carrier file. Directory creation is explicit and root-contained.

Validate the complete manifest, every candidate, every preimage row, root containment, and dependency order together. Freeze the manifest digest only after the complete set passes. Do not apply a valid prefix while another row is invalid.

### 6. Recheck the whole preimage set before writing

Immediately before the first durable mutation, recompute every frozen preimage. If any value differs, make zero durable writes. Record the exact path, expected value, observed value, and stop reason. Rebuild the complete candidates and manifest against fresh state through another full WORK iteration.

The recheck includes primary destinations, shared files, move sources and destinations, reference carriers, and every other path named by a mutation row. Checking only the main promotion destinations is insufficient.

### 7. Apply in stable order and record each row

Apply only frozen mutation rows inside the validated session worktree, in stable dependency order and then row-ID order. Do not recalculate routes, names, suffixes, candidates, or preimages during apply.

After each row, verify the actual bytes or move state, then append a receipt containing row ID, start and finish time, observed result digest, and `applied` or `no-op`. Equal expected bytes at the frozen target are a no-op for the same stable source identity.

If a filesystem operation fails after earlier rows completed, stop at the exact row and preserve the manifest plus receipts. Do not continue to later rows. Before resuming, verify every completed row still equals its frozen postcondition and every remaining row still has its frozen preimage. Any mismatch causes zero further writes and requires a rebuilt complete manifest. Otherwise continue from the first unreceipted row. Never allocate a new suffix for the same frozen source.

### 8. Complete ordinary supersession and archive moves

Apply one authorized supersession as one manifest-owned mutation set: write the new record, add reciprocal plain-slug lifecycle links, move the complete terminal old record to its typed archive path, and repoint every inbound path reference.

The old record keeps its original type and complete body. The active source, archive destination, new record, and every reference carrier have whole-file preimages. Verify both lifecycle directions, the complete archived bytes, and every repointed path. Never hard-delete a record or replace it with a tombstone.

Use [`memory/templates/archive.md`](../memory/templates/archive.md) for the current move form and [`memory/rules.md`](../memory/rules.md) for ordinary lifecycle constraints. Promotion does not define another archival policy.

### 9. Reconcile the actual tree and prior evidence

Compare the actual post-promotion project tree with the frozen preimages. Every changed path must map to exactly one mutation row, and every mutation row must have its expected result or an explicit stopped receipt. An unmanifested path or a row without a verified result fails the operation.

Re-enumerate and re-hash every earlier staging path. The path set and bytes must equal the initial source register. Confirm no source, draft, review, synthesis, evaluator report, or prior output changed during apply.

Run every applicable current validator from its authoritative owner against the actual post-promotion tree. At minimum, use the Memory frontmatter validator for durable records, the scoped Markdown-link validator for changed Markdown and its inbound carriers, the Mistake validator when a skill-owned mistake file changed, and any topology or content guard whose declared scope includes a changed path. Preserve exact commands and results. A legitimate guard-carrier correction is a new planned mutation and requires another complete iteration; it is not patched outside the manifest.

### 10. Freeze evaluator inputs and matching handoff evidence

Compare the staged handoff source, promoted durable notes file, and session candidate after removing only the durable frontmatter wrapper where applicable. The evaluated body must be byte-for-byte identical in both destinations. Reconcile every handoff claim with the actual promoted tree, commits, verification evidence, approved finding dispositions, waivers, and current pre-finalization Git state.

Give each fresh evaluator the complete dual-system creation package, final inventory, source hashes, candidate register, frozen manifest and digest, whole-file preimages, row receipts, actual project delta, prior-staging proof, validator output, both handoff candidates, and authorized Git plan. The evaluated subject is the actual post-promotion tree and handoff, not the intended manifest alone.

A material correction to the manifest, durable tree, or handoff starts a complete new iteration. Rebuild both independent drafts, both cross-reviews, synthesis, manifest, apply evidence, and both fresh evaluations.

### 11. Seal only after PASS

After the two fresh reports aggregate to PASS and the user approves the finding-disposition batch, RECORD writes `4-wrap-up/outputs/handoff.md` and `4-wrap-up/outputs/promotion-manifest.md` from the exact evaluated subjects. Before the following completed-step transition, verify these PASS outputs while `state.json.current` still names Wrap-up RECORD and `lastVerdict` is PASS.

Return the verified artifacts to the manager for local commit and configured finalization. Git results that occur afterward are appended as a factual receipt and never alter the evaluated handoff body.

## Staging → Memory routing

[`memory/memory-map.md`](../memory/memory-map.md) is the sole typed-source-to-durable-home map. [`memory/rules.md`](../memory/rules.md) owns type, scope, area, naming, lifecycle, and destination constraints. Apply those owners to each source-accounting row; do not copy or extend their route table here.

Only the typed sources listed by the Record and Memory owners are eligible. There is no direct working-file, journal, rule, output, or evaluator-report route. A new durable route requires a prior change to the Record staging vocabulary and its validators.

## Frontmatter allowlist on promotion

[`memory/rules.md` § 2](../memory/rules.md#2-frontmatter-standard) is the sole owner of durable base fields, per-type extensions, required values, lifecycle links, and staging-field stripping. The matching file in [`memory/templates/`](../memory/templates/) owns the body and frontmatter form for its type.

Read routing inputs before rendering, preserve every owner-required durable field, strip only owner-declared staging fields from the destination candidate, and leave the immutable source unchanged. Validate the complete rendered file before manifest freeze. A skill-owned `mistakes.md` destination follows the Mistake-owned section contract instead of the durable-memory frontmatter standard.

## Collision and idempotency

Idempotency uses the stable source identity `{sessionId, source-relative-path}` plus the frozen manifest mapping. A stripped routing or provenance field never authorizes overwrite or rerun identity.

For the same source and mapping, equal destination bytes are a no-op, a still-absent destination may be created only while its absent preimage remains true, and any other byte drift halts. For distinct sources that request one preferred path, allocate the deterministic disambiguation during manifest construction and freeze it. Never recompute a suffix during apply or rerun.

Semantic similarity is not source identity. Treat existing related content as a distinct collision, an approved drop, or an authorized ordinary supersession; never overwrite it because it looks equivalent.

## Completion proof

Promotion WORK is complete only when:

- every expected typed staging directory, including each empty directory, is accounted for;
- every eligible source has exactly one source outcome;
- every candidate and the complete manifest validate before the first durable write;
- all whole-file preimages match immediately before apply;
- each applied or no-op row has a verified receipt;
- an interrupted run has an exact safe continuation point or a mandatory rebuild decision;
- ordinary supersession and archive moves are reciprocal, complete, and link-resolved;
- earlier staging paths and bytes are unchanged;
- the actual project delta is a bijection with completed mutation rows;
- all applicable current owner-provided validators pass on the actual tree;
- the session and durable handoff bodies match; and
- the complete actual-tree evidence package is frozen for two fresh evaluators.
