# Record Evaluation Entry

Use this entrypoint with [evaluation/SKILL.md](../evaluation/SKILL.md). It supplies Record-specific lenses for
one complete evaluation result. Step companions may add cases and checks but cannot replace the general method.
Record-owned schemas and fixtures validate only the calling workflow's report contract.

## Required inputs

- version 5 session manifest, version 3 router, current cursor, locked tasks, configured iteration caps, and exact session root;
- complete current-iteration WORK and EVALUATION evidence, approved dispositions, waiver when applicable, and expected canonical artifact;
- typed staging inventory, source ledger, template validation, canonical output or absent-output proof, and completion report;
- command invocations, patch files, before/at/after RECORD output-placement fixtures, byte-preservation evidence, failure fixtures, and verifier output;
- session tree, branch/worktree topology, and sensitive-data inspection;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- exact subject and acceptance-evidence digests.

## Perspective lenses

### Project

Compare the record with the agreed step or task result, aggregate verdict, approved dispositions, and expected artifact. Prove the matching RECORD/PASS output is accepted before completion and every earlier-stage, non-PASS, wrong-task, or future-step output is rejected. Detect lost evidence, invented durable candidates, materially changed subject, and RECORD-owned judgment or routing.

### Structure

Inspect v5/v3 owner boundaries, root and task shape, configured iterations, typed staging paths, evidence slots, canonical output placement, schema alignment, symlink rejection, and operation inputs. Placement must distinguish matching current RECORD/PASS from matching completed state; a correct filename in the wrong task or future step is a structural failure.

### Performance

Inspect deterministic ordering, repeated init, scaffold size, artifact rendering, validation, hashing, verification, and unchanged-file rewrites. Require measurements or operation counts where task count or artifact size makes resource claims material.

### Aesthetics

Inspect rendered artifacts for stable headings, plain names, concise evidence, meaningful links, and no filler. Machine JSON and human Markdown must remain easy to compare without hiding required fields.

### Usage

Cold-read completion proof as the manager and a resumed session. Verify exact paths, verdict, artifact status, staged candidates or explicit empty result, concern, command, and next legal route. Check unambiguous dates, paths, and terminology.

### Consistency

Compare system, step, task, iteration, assignment, digest, verdict, dispositions, report paths, output bytes, staging sources, schemas, state, manifest, locked tasks, and verifier result. Search for old versions, unauthorized iterations, wrong-system artifacts, stale hashes, cross-boundary patches, and output acceptance that disagrees with the state-machine transition order.

### Risk

Inspect root containment, traversal, symlinks, temporary-file cleanup, atomic replacement, failure byte preservation, sensitive content, direct project-memory writes, unapproved lifecycle change, and operational exhaust. Every invalid fixture must leave prior bytes unchanged.

### Overall

Challenge file existence used as semantic proof, non-empty staging used as quality proof, a green unrelated check, a renderer that changes evaluated meaning, and a manager route inferred from a runtime status. Preserve exact evidence, typed boundaries, and valid empty staging.

## Recommended verification

Use the record command's own self-tests and explicit fixtures. Run schema validation, idempotent init, task scaffolding, valid and invalid transition/checkpoint patches, peer rendering, verify, traversal and symlink rejection, old-version rejection, empty staging, and exact before/after byte comparison. For Ideation, Planning, each Execution task, the final Execution step output, and Wrap-up, exercise rejection before PASS, acceptance at matching RECORD/PASS before completion, and acceptance after the legal completed transition. Also exercise non-PASS RECORD, wrong-task, and future-step rejection while confirming `verify` does not mutate state. Inspect the final tree and rerun the exact verifier with locked tasks.

## Rule crosswalk

| Parent rules | Primary report coverage |
|---|---|
| R-1, R-2 | Project, Consistency |
| R-3, R-4, R-5 | Project, Structure, Risk |
| R-6 | Project, Structure, Consistency |
| R-7, R-8 | Structure, Consistency, Risk |
| R-9 | Project, Usage, Consistency, Overall |
| R-10, R-11 | Project, Risk, Overall |

Every applicable RECORD-CK item appears in the report checklist. Any material change to sealed content or placement creates a new subject digest and receives a complete fresh review.
