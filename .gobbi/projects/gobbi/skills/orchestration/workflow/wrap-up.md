# Wrap-up Manager Adapter

[`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) owns staging-only promotion, handoff construction, and closeout details. This adapter owns manager entry, dispatch inputs, user gates, completion proof, and transitions.

## Entry and DISCUSSION

Enter Wrap-up DISCUSSION after all planned Execution tasks pass. Supply the assistant with every canonical step artifact, approved finding disposition, waiver, decision, verification result, commit, current staging inventory, durable destination preimage, and configured Git finalization policy.

Present the closure inventory to the user. Resolve final material additions, omissions, accepted exceptions, deferred items, publication intent, and any operation requiring new authority. DISCUSSION completes when the promotion and handoff contract is frozen without inventing material merely to fill staging.

## WORK

Run [`dual-system-work.md`](dual-system-work.md) with the assistant role. The dual-system package covers the promotion manifest and complete handoff. The active-runtime assistant applies the resolved manifest idempotently inside the isolated worktree, verifies every changed durable path, and freezes the post-promotion tree and handoff evidence.

Only typed staging is eligible for promotion. An empty staging area is accounted for explicitly and remains empty. The session handoff and durable note use one body.

## EVALUATION

Run [`evaluation.md`](evaluation.md). Both fresh evaluators inspect the actual post-promotion worktree, full creation package, frozen manifest, destination preimages, verification, handoff, and authorized finalization plan. Obtain the user's finding-disposition decision before RECORD. A material change to the manifest, promoted tree, or handoff requires another full WORK iteration and two fresh reports.

## RECORD and exit

Run [`record.md`](record.md). On PASS, seal the canonical Wrap-up artifacts and checkpoint their durable pointers. The manager then performs verified local commit and only the configured, authorized Git finalization. Checkpoint the actual outcome, mark state complete, display the complete evaluated handoff, and append the factual finalization receipt. On REVISE or FAIL, follow [`state-machine.md`](state-machine.md); do not finalize Git early.
