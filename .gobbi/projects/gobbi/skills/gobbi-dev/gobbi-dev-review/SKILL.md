---
name: gobbi-dev-review
description: "MUST load when reviewing one Gobbi change or the whole Gobbi project for scoped evidence and findings without an acceptance verdict."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Gobbi Review

A reviewer uses this read-only operation to inspect one frozen Gobbi change or the whole frozen project. The
result is a scoped record of evidence, verified strengths, findings, limits, and unanswered questions.

Review does not correct the subject, issue an Evaluation verdict, accept work, or change workflow state. It
hands exact evidence to the caller or an independent Evaluation owner.

## Principles

### Protect the subject

Review evidence is trustworthy only when inspection cannot change what is being judged. A command with
unknown or persistent effects belongs outside this protected review.

### Inspect owners before claims

Gobbi behavior is distributed across canonical owners, generated views, scripts, runtime surfaces, and
documents. A finding must compare the subject with the owner that actually defines the expectation.

### Separate observation from judgment

The review records what was inspected, what it shows, and why it matters. Evaluation applies caller criteria
and derives any verdict later.

### Keep limits visible

Unavailable access, sampling, unrun checks, and uncertain causes narrow the review. They never become an
implied pass or failure.

## Rules

- **MUST freeze the exact revision, tree, scope, questions, governing contracts, requested perspectives, and
  read-only method before review.** Stop when subject identity or protected access cannot be proved.
- **MUST keep every review action read-only and confined to the named repository and supplied evidence.** Do
  not run a command that may mutate source, generated views, caches, runtime homes, external systems, or Git.
- **MUST inspect actual files and observable state before summaries, prior findings, checklists, or test
  reports.** Use applicable owners as expectations and record every material exclusion or unavailable check.
- **MUST state each finding with expectation, observation, impact, evidence location, supported cause or
  hypothesis, uncertainty, and confidence.** Keep verified strengths and unanswered questions separate.
- **NEVER correct, stage, commit, publish, merge, release, deploy, change workflow state, issue an Evaluation
  verdict, or accept the subject.** Route those actions and decisions to their current owners.
- **MUST bind the final review record to the unchanged subject and disclose independence, method, evidence,
  limits, strengths, findings, and remaining questions.** A changed subject makes affected review evidence
  historical and requires a new review.

## Procedure

### Phase 1 — Bind Protected Scope

#### 1.1 Freeze revision, questions, and limits

- Take the caller identity, exact commit and tree or whole-project revision, requested scope, questions,
  accepted contract when present, governing rules, known risks, prior failures, and intended evidence consumer.
- Confirm reviewer independence and disclose any design, authoring, implementation, or decision role that may
  affect the work. Stop or narrow the assignment when the conflict prevents a credible protected review.
- Record the included and excluded paths, generated and installed views, runtime observations, checks, time or
  environment limits, and access boundaries. Name every unavailable material surface.
- Prove a read-only method and snapshot the subject identity and tracked status. If identity or status changes
  during review, stop and return the last valid observation without a current conclusion.

### Phase 2 — Execute Gobbi Review

#### 2.1 Inspect applicable owner contracts

- Inspect the actual subject first. Map its files, callers, consumers, generated projections, tests, documents,
  runtime effects, authority boundaries, failure paths, and recovery states.
- Identify each applicable canonical owner and expectation. Compare source with generated, packaged, installed,
  or reported views only where current readable evidence makes that comparison valid.
- Exercise ordinary, boundary, failing, recovery, adversarial, change, and cosmetic-compliance cases through
  static inspection or proved read-only commands. Do not treat prepared coverage as a ceiling.
- Record exact commands, paths, object identities, outputs, and limits needed to reproduce material evidence.
  Sanitize credentials, secret values, and unrelated private paths.

#### 2.2 Record strengths and findings

- Reconcile conflicting observations against their owners. Keep an explanation as a hypothesis when read-only
  evidence cannot distinguish causes.
- Record a strength only for a directly verified beneficial outcome. State its evidence and the condition
  future work should preserve.
- Record a finding only for an unmet contract, outcome, or material risk. Include expectation, observation,
  impact, evidence, supported cause or hypothesis, uncertainty, confidence, and responsible owner.
- Keep missing evidence and unanswered questions explicit. Do not convert them into an Evaluation verdict,
  acceptance decision, or recommendation to suppress a check.

### Phase 3 — Handoff

#### 3.1 Freeze scoped evidence for independent Evaluation

- Recheck the subject commit and tree, review path set, tracked status, and all cited evidence. Mark the result
  historical if the subject changed.
- Produce one read-only record containing the subject identity, independence, scope, method, governing owners,
  reproduction details, evidence, limits, strengths, findings, questions, and exact next owner.
- When Evaluation is requested, supply the unchanged subject and review record without adding criteria or a
  verdict. The Evaluation owner inspects the actual subject independently and may disagree with review.
- Hand correction requests to `gobbi-dev-development` or the earliest mechanism owner, and hand acceptance
  decisions to the manager or user. Review completes when the scoped record is reproducible and no mutation
  occurred.

## References
