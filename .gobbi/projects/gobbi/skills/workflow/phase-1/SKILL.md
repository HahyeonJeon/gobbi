---
name: phase-1
description: "MUST load when Workflow enters Phase 1. Configures or recovers one isolated session, locks the user's intent through Ideation, and hands a verified contract to Planning."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
user-invocable: false
---

# Workflow Phase 1

The manager loads this child only after the parent [Workflow](../SKILL.md) activates `P1 · Configuration`, or
when recovery selects an unfinished Phase 1 item. The parent remains loaded; it owns TODOs, evidence,
participants, assignments, gates, records, recovery, and transitions.

Phase 1 creates or recovers the isolated session, locks What, Why, How, scope, success, and authority with the
user, and produces the verified Ideation contract that Planning consumes.

## Principles

### Establish isolation before dependent work

Verify identity, branch, worktree, settings, and evidence root before Ideation writes session evidence.

### Lock material direction with the user

Phase 1 resolves user-owned choices so later phases can make routine in-contract decisions.

### Recover from the earliest unproved item

Preserve verified work and resume at the first Configuration or Ideation claim that current evidence cannot
prove.

## Rules

- **MUST enter through the parent route with exactly one Phase 1 item active.** Stop when TODO, branch,
  worktree, evidence root, or prior checkpoint cannot be reconciled safely.
- **MUST confirm the parent's Delegation, Discussion, Git, and Memory load register before acting.** Generate
  the UUID before deriving either Git name.
- **MUST resolve every material Ideation unknown with the user or assign an explicit owner.** Never infer
  scope, authority, success, or a material design choice.
- **MUST apply the parent's [shared productive-step cycle](../SKILL.md#14-apply-the-shared-productive-step-cycle)
  with the fast two-iteration gate.** Apply Gobbi's finding gate through the parent; only PASS continues.
- **MUST use the parent's participant matrix, evidence schemas, assignment additions, and recovery rule.** This
  child supplies only Phase 1 inputs, roles, outputs, and checks.
- **NEVER let a receipt, runtime identity, specialist report, or summary replace the native TODO.** Return to
  the earliest unproved item when evidence disagrees.

## Procedure

### Phase 1 — Configure or recover the session

#### 1.1 Enter and classify the session

- Confirm the parent is loaded, its four owner skills are registered in order, and only `P1 · Configuration`
  is active on fresh entry. Inspect repository, branch, worktrees, TODOs, evidence, explicit recovery identity,
  and protected user work without mutation.
- Apply [Git](../../git/SKILL.md) before any branch or worktree action. Classify the session as fresh only when
  no verified identity exists; otherwise recover through Step 1.3.

#### 1.2 Configure a fresh session

- Resolve the Execution cap, roles, required-system availability, narrow waivers, Git finalization, base, and
  protected work with the user. Consume Gobbi's normalized slug and partner policy.
- Apply parent Step 1.2 completely: run layout bootstrap preflight; generate the full UUID and capture the
  original UTC date; derive branch and worktree leaf separately; create and verify one isolated branch and
  worktree; then create the byte-matching session leaf and `configuration.md`.
- Verify base, registration, clean worktree, ignore posture, evidence directories, initial TODO route, identity,
  settings, validated root pair, and creation checks. Apply [Memory](../../memory/SKILL.md) `Temporary Record`,
  prove the receipt ignored and the tracked tree unchanged, then activate `P1 · Ideation`.

#### 1.3 Recover an existing session

- Read `configuration.md`, the latest verified checkpoint, native TODO, branch, worktree registration, session
  root, packages, gates, and receipts. Require separate new or permanent legacy parsers to reproduce one tuple.
  New state retains its slug; legacy state retains `slug: not-applicable` and its original names.
- Reconstruct a missing shape, slug field, or partner policy only from the matched live tuple and valid Gobbi
  entry state. Record the complete parent Step 1.2 Configuration schema through Memory `Temporary Record` and
  keep the tracked tree unchanged. Never infer a legacy slug, rename or migrate live state, or create a second
  object for the UUID.
- Return to Gobbi entry when mode, applicable slug, or partner evidence is missing, ambiguous, or conflicting.
  Otherwise rebuild completed TODOs only from verified evidence, activate the first unproved item, and continue
  after TODO, evidence, branch, and worktree agree.

### Phase 2 — Lock and verify Ideation

#### 2.1 Freeze the discussion contract

- Load [Ideation](../../ideation/SKILL.md). Build the leader brief through
  [Delegation](../../delegation/SKILL.md) plus
  [parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments), using request, rules, memory, repository evidence,
  prior art, constraints, risks, recovery needs, accepted findings, and exact output path.
- Use [Discussion](../../discussion/SKILL.md) to resolve with the user:
  - the root problem and affected people;
  - What changes and remains unchanged;
  - Why the outcome matters;
  - How the approach works;
  - success and failure conditions;
  - material assumptions and alternatives;
  - safety, external, publication, merge, and destructive authority; and
  - explicit deferrals and their owners.
- Freeze one neutral contract only when every material unknown has a decision or owner. Retitle to WORK after
  rereading the contract.

#### 2.2 Run the shared productive-step cycle

- Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`; the frozen Ideation contract and immutable project evidence
  as subject; `1-ideation/outputs/ideation.md` as canonical output; the fast gate; cap `2`; and complete
  material-decision coverage as the unique check.
- The local leader produces, self-reviews, and synthesizes. Resolve user-owned conflicts before EVALUATION.
  Require the canonical result to cover the problem, actors, What, Why, How, scope, success/failure, alternatives,
  authority, risks, recovery, accepted findings, and deferrals.
- Run every RECORD pass. Write the canonical output only after PASS, keep it ignored and uncommitted, and prove
  the tracked tree unchanged. On first-pass REVISE, return to DISCUSSION; on second-pass FAIL, preserve exact
  recovery evidence and present the user-owned choices. Never create iteration 3.

### Phase 3 — Hand off to Planning

#### 3.1 Verify Phase 1 completion

- Verify Configuration, canonical Ideation output, policy-required reports, gate, receipt, accepted findings,
  branch, worktree, and active `P1 · Hand-off`. Confirm the contract is concrete enough for Planning and no later
  TODO is active. Return to the earliest responsible Phase 1 step on failure.

#### 3.2 Render and continue

- Apply the parent Step 1.6 checkpoint schema with Phase `Phase 1`; completed Configuration and Ideation;
  Configuration receipt, canonical output, and evaluation evidence; resolved settings and material user
  decisions; and `Next TODO: P2 · Planning`.
- Reread every field, complete `P1 · Hand-off`, activate the next TODO, display the checkpoint, and continue in
  the same turn unless the user interrupts for clear or compact.

## References

- [Parent Workflow](../SKILL.md) owns all shared Workflow contracts and transitions.
- [Ideation](../../ideation/SKILL.md) owns the canonical design operation.
- [Git](../../git/SKILL.md) and [Memory](../../memory/SKILL.md) own isolation and temporary-record mechanisms.
