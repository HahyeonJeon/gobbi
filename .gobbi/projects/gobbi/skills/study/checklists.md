# Study Checklists

Copy applicable items into the caller's ordinary checklist. This source remains unchecked. `N/A`
requires an explicit applicability reason and evidence.

## Assignment and containment

- [ ] **RS-CHK-ID-01** `[gate/killer, read-do]` The assignment includes the absolute Gobbi root, exact
  step/stage/iteration/task cursor, stable slug, question, decision, scope, exclusions, and evidence needs.
  - **Scenarios:** RS-SCN-01-A, RS-SCN-01-B, RS-SCN-01-C.
  - **Evidence:** frozen assignment envelope.
- [ ] **RS-CHK-ID-02** `[gate/killer, read-do]` No runtime/thread ID, environment variable, global pointer,
  current-directory guess, or worktree scan supplies session identity.
  - **Scenarios:** RS-SCN-01-A, RS-SCN-01-C.
  - **Evidence:** invocation and accessed-identity trace.
- [ ] **RS-CHK-ID-03** `[gate/killer, read-do]` The normalized target uses the correct non-Execution or
  Execution layout and remains beneath the supplied root.
  - **Scenarios:** RS-SCN-02-A, RS-SCN-02-B, RS-SCN-02-C.
  - **Evidence:** supplied root, relative target, and containment result.

## Evidence coverage

- [ ] **RS-CHK-EVD-01** `[required, read-do]` Applicable code, typed memory, tests, documentation, and Git
  history are inspected, or each omitted class has a defensible not-applicable reason.
  - **Scenarios:** RS-SCN-03-A through RS-SCN-03-C.
  - **Evidence:** internal search/read inventory.
- [ ] **RS-CHK-EVD-02** `[required, read-do]` Applicable external evidence prioritizes direct official,
  primary, standard, maintainer, or original-research sources.
  - **Scenarios:** RS-SCN-04-A through RS-SCN-04-C.
  - **Evidence:** source ledger with authority classification.
- [ ] **RS-CHK-EVD-03** `[gate/killer, read-do]` Every load-bearing citation resolves to an exact
  file/line/commit, command result, or direct URL and supports the attributed claim.
  - **Scenarios:** RS-SCN-03-A, RS-SCN-04-A, RS-SCN-04-C.
  - **Evidence:** citation replay.
- [ ] **RS-CHK-EVD-04** `[required, read-do]` Source freshness, version, scope, authority, applicability,
  and limitations are explicit.
  - **Scenarios:** RS-SCN-04-A through RS-SCN-04-C.
  - **Evidence:** evidence ledger fields.
- [ ] **RS-CHK-EVD-05** `[required, read-do]` Counterexamples, failed searches, contradictory evidence,
  and unavailable sources are preserved with calibrated claims.
  - **Scenarios:** RS-SCN-03-B, RS-SCN-03-C, RS-SCN-04-B, RS-SCN-04-C.
  - **Evidence:** contradiction and limits sections.

## Synthesis gate

- [ ] **RS-CHK-SYN-01** `[gate/killer, read-do]` Every evidence item includes Source, Insight, Why it
  matters, applicability, and limitations; the report is not a link dump.
  - **Scenarios:** RS-SCN-05-A.
  - **Evidence:** complete evidence ledger.
- [ ] **RS-CHK-SYN-02** `[required, read-do]` The executive finding distinguishes verified, supported,
  inferred, disputed, and unknown claims.
  - **Scenarios:** RS-SCN-03-B, RS-SCN-04-B, RS-SCN-05-A.
  - **Evidence:** finding and claim labels.
- [ ] **RS-CHK-SYN-03** `[required, read-do]` The report contains contradictions, uncertainty, limits,
  recommendation, evidence-to-change, owned open questions, and repeatable verification.
  - **Scenarios:** RS-SCN-05-A.
  - **Evidence:** required report sections.
- [ ] **RS-CHK-SYN-04** `[gate/killer, read-do]` Study does not change scope, make a material user
  choice, accept work, or substitute popularity for applicability.
  - **Scenarios:** RS-SCN-04-B, RS-SCN-05-B.
  - **Evidence:** recommendation language and Discussion handoff.
- [ ] **RS-CHK-SYN-05** `[required, read-do]` Every included source materially informs the assigned
  decision; unrelated source stockpiling is absent.
  - **Scenarios:** RS-SCN-05-A.
  - **Evidence:** source-to-question trace.

## Write-boundary gate

- [ ] **RS-CHK-WR-01** `[gate/killer, read-do]` Study returns Markdown and its envelope but performs
  no repository, worktree, session, staging, cache, or durable-memory write.
  - **Scenarios:** RS-SCN-06-A through RS-SCN-06-C.
  - **Evidence:** pre/post changed-path inventory and status report.
- [ ] **RS-CHK-WR-02** `[gate/killer, read-do]` The active runtime assistant validates the envelope,
  containment, sections, and citations before storing at the exact Record-owned target.
  - **Scenarios:** RS-SCN-06-A, RS-SCN-06-B.
  - **Evidence:** validator result and stored path.
- [ ] **RS-CHK-WR-03** `[gate/killer, read-do]` A failed validation leaves the prior destination
  byte-for-byte unchanged and creates no fallback artifact.
  - **Scenarios:** RS-SCN-06-B.
  - **Evidence:** before/after digest and exact error.
- [ ] **RS-CHK-WR-04** `[required, read-do]` Durable evidence reaches memory only through a RECORD-derived
  typed staging candidate and later Wrap-up promotion; clean/non-durable study may leave staging empty.
  - **Scenarios:** RS-SCN-06-C.
  - **Evidence:** staging provenance or explicit no-candidate disposition.

## Acceptance rule

Coverage passes only when every applicable item has a result and evidence. Acceptance passes only when
all applicable gate/killer items pass and no missing load-bearing source is hidden by a confident
summary. The caller's ordinary step verdict remains authoritative.
