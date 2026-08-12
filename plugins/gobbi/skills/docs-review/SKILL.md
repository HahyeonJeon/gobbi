---
name: docs-review
description: "MUST load when reviewing one caller-named Markdown subject for reader-facing documentation quality and returning a file or response report without editing the subject."
allowed-tools: Read, Grep, Glob, Bash, Write
skill-type: operation
---

# Documentation Review

A documentation reviewer uses this operation when a caller requests a reader-facing quality review of one
exact Markdown subject. The result is one complete evidence-backed report bound to the reviewed content.

The operation keeps the subject read-only, inspects four quality categories, and separates Defects, Optional
Improvements, Strengths, and Evidence Gaps. The caller selects either a named report file or explicit
response-only delivery, while specialized truth and acceptance stay with their owners.

## Principles

### Reader outcome

A reviewer ties each concern to the reader outcome, a governing source, or an observed reader cost instead
of a private house style.

### Result meanings

An unmet requirement, an optional better choice, a verified benefit, and missing evidence create different
owner decisions. Mixing them hides correction needs and weakens author choice.

### Improvement evidence

Improvement analysis must be visible even when it supports no change. Evidence decides whether the result is
an opportunity or an explained `None supported`, so the review does not reward cosmetic churn.

### Subject and delivery

A changed subject or unauthorized side effect is a recoverable stop, not a completed review. Review evidence
remains current only while the subject is stable and the selected output boundary is honored.

## Rules

- **MUST bind the exact subject, readers and tasks, scope, governing basis, caller questions, reviewer
  relationship, and caller-selected output boundary before judgment.** Review begins only when each material
  input and a stable identity are explicit.
- **MUST keep the subject read-only and confine output to the selected boundary.** Completion requires an
  unchanged subject, only the caller-named report file for file delivery, or no file write for response-only
  delivery.
- **MUST inspect all four quality categories and applicable cross-cutting concerns against available owners.**
  Check claim support and internal consistency, and route specialized factual judgment to its domain owner.
- **MUST keep Defects, Optional Improvements, Strengths, and Evidence Gaps distinct and evidenced.** Every
  review contains supported improvement records or an evidenced `None supported` analysis.
- **MUST render the reconciled result through the required report template and verify it before handoff.** IDs,
  counts, anchors, fields, zero states, placeholders, subject stability, and output effects must agree.
- **NEVER edit the subject or invent severity, priority, blocker, verdict, acceptance, tool dependency, release,
  publication, or cleanup behavior.** Caller labels require their supplied basis, and every other action or
  decision stays with its owner.

## Procedure

### Phase 1 — Bind the Review

#### 1.1 Bind review inputs

- Take the exact Markdown path or path set, intended readers and tasks, included and excluded scope,
  governing sources, caller questions, optional classification labels and their basis, reviewer relationship,
  and explicit output boundary.
- Require a caller-named report file for delegated or durable work. Permit response-only output only when a
  direct caller explicitly selects it. Never infer, select, or silently switch the boundary.
- Confirm that a file boundary is authorized, does not overlap the subject, and names one exact destination.
  Inspect the actual subject before summaries, prior reviews, checklists, or tool output.
- Stop before judgment and name each missing material subject, reader, task, scope, source, question, label
  basis, relationship, or output fact. Resume this step only when the caller supplies it.

#### 1.2 Prove subject identity, method, and limits

- Bind committed content to its exact revision or tree and reviewed path set. Bind uncommitted content to the
  exact paths and pre-review content hashes. Bind external content to a stable URL plus retrieval date or a
  content hash.
- Establish a read-only inspection method and record the subject and output preimage needed to verify later
  stability and side effects. Do not run a tool whose effects are unknown or may persist; record the missing
  evidence and its effect instead.
- Record unavailable owners, files, rendered views, checks, access, locale, or other evidence and how each
  limit narrows the review. Partial evidence may continue only when the scoped reader outcome remains
  responsibly reviewable; otherwise stop with the exact need.
- Stop when stable identity or a safe method cannot be proved. Resume this step with a stable subject or proved
  read-only method; never weaken the identity or safety boundary to continue.

### Phase 2 — Inspect Documentation

#### 2.1 Inspect reader-facing quality

- Inspect all four categories and record coverage even when a category produces no result:
  - **Shape and structure:** title and opening, topic ownership, hierarchy, section roles and order, missing or
    duplicate content, and useful headings, lists, tables, code blocks, and links.
  - **Vocabulary and precision:** stable terms, defined abbreviations, explicit actors and actions, scope,
    conditions, exceptions, references, normative force, and wording that permits more than one material
    meaning.
  - **Economy and necessity:** repetition, tautology, heading restatement, filler, stale text, needless
    hedging, ornament, and content that does not help a reader route, decide, act, recover, or verify.
  - **Readability and flow:** one main claim per sentence, one topic per paragraph, prerequisite order, early
    conclusions and actions, clear references, useful parallel form, and source or rendered-form risks.
- Inspect applicable cross-cutting concerns: purpose, audience, completeness, prerequisite order, claim
  support, failure and recovery guidance, accessibility, locale, maintenance, safety, privacy, normative force,
  Markdown mechanics, and stale or conflicting content. Record a scope-based reason for each omitted concern.
- Inspect rendered form when Markdown constructs may change meaning or navigation. A parser, linter, spell
  checker, link checker, or renderer supplies evidence only; a pass is not a content conclusion.
- Favor topic-first wording and short descriptive titles without imposing fixed headings or order, a word
  count, a sentence score, or a voice rule. Recommend a list, table, code block, or link only when it reduces
  reading or lookup work. Preserve exact domain language, rationale, evidence, conditions, exceptions, safety
  boundaries, recovery guidance, normative force, and useful linear prose.

#### 2.2 Check claims and route specialized judgment

- Compare factual and normative claims with the available source that owns each expectation. Check internal
  consistency across the reviewed set and directly related governing sources.
- Record a supported documentation defect when the subject conflicts with an available owner or leaves a
  required claim unsupported. State a cause only as far as the evidence reaches and retain alternative
  explanations as hypotheses when needed.
- For legal, security, runtime, version, specialized accessibility testing, or other domain truth, record the
  exact claim, available support, missing judgment, effect on this review, needed evidence, and responsible
  domain owner. Do not make the specialized judgment.
- Carry unavailable specialized judgment as an Evidence Gap when the remaining scope is responsibly
  reviewable. Stop the affected review when the unavailable owner prevents a responsible scoped result.
- Return to Step 1.1 when evidence changes the subject, readers, scope, basis, questions, or output contract.
  Otherwise continue with the recorded support, conflicts, limits, and owner routes.

### Phase 3 — Reconcile Evidence

#### 3.1 Form typed results

- Reconcile conflicts against their owners. Deduplicate one cause into one primary result with a unique typed
  ID and reference that ID instead of repeating the concern.
- Record a Defect (`D-NN`) only when a requirement, reader outcome, or supported material risk is unmet. State
  its category, exact location, expected and observed states, reader impact, evidence, cause or hypothesis,
  uncertainty, confidence, next owner, smallest correction boundary, and check.
- Record an Optional Improvement (`I-NN`) only when the current condition is acceptable and evidence supports
  a better outcome. State its category, location, current and better states, benefit, trade-off, evidence,
  decision owner, available choice, and check.
- Record a Strength (`S-NN`) only for a directly verified beneficial outcome. State the outcome, evidence, and
  condition to preserve. A Strength cannot offset a Defect.
- Record an Evidence Gap (`Q-NN`) when missing or conflicting evidence prevents a supported judgment. State
  the unknown, its effect on judgment, needed evidence, and owner. A gap is not a Defect by default.
- Preserve a caller-supplied priority, severity, or blocker label only with its stated basis. Do not use an
  Optional Improvement or Strength to change a Defect, and do not derive a verdict or acceptance result.

#### 3.2 Complete improvement analysis

- Analyze supported improvement opportunities across the complete review, not by quota per file or category.
  Keep each opportunity only when it survives its category guardrail and has a concrete benefit, trade-off,
  evidence, decision owner, available choice, and check.
- When at least one opportunity is supported, render each as its `I-NN` record. When none is supported, record
  `None supported` with the dimensions inspected, evidence anchors, and each limit that could hide an
  opportunity, or `No material evidence limit found.`
- Treat the evidenced zero state as completed analysis, not proof of perfect documentation. Continue only
  after every reviewed concern has one semantic type and the improvement analysis is explicit.

### Phase 4 — Deliver the Review

#### 4.1 Render output

- Recheck the bound subject identity before output. If it changed, mark affected observations historical,
  write no current report, and return to Step 1.1 to bind and inspect the changed subject.
- Load [`templates/report.md`](templates/report.md) only after the evidence and improvement analysis are
  reconciled. Render its receipt plus fixed `Defects`, `Improvement analysis`, `Strengths`, and `Evidence gaps`
  sections with the same meanings in both output branches.
- For file output, write only the exact caller-named report path. For response-only output, return the complete
  report in the response and write no file. Copy no sensitive subject content beyond the minimum evidence
  anchor and observation needed.
- If the file path is unauthorized or the write fails, do not choose a fallback or silently return the report
  in a response. Retain the reconciled evidence, report the exact boundary failure, and resume this step only
  after the caller supplies a valid boundary for the unchanged subject.

#### 4.2 Verify or recover the report

- Recheck subject identity after rendering. Resolve every evidence anchor; reconcile unique IDs and counts;
  remove every template comment and placeholder; and confirm the receipt records identity, reader outcome,
  scope, basis, method, stability, relationship, chosen output and verification, caller labels and basis,
  limits, and result counts.
- Confirm all four fixed sections are present, each item has its complete evidence fields, improvement analysis
  is explicit, specialized gaps name an owner, and the report contains no verdict or implied acceptance.
- For file output, prove that only the authorized report path was written and reread its exact bytes. For
  response-only output, prove that no file was written and the response uses the same report structure.
- If the subject changed, mark the report historical and stop; do not present it as current or remove an
  artifact without authority. Rebind at Step 1.1 and repeat affected inspection before another report.
- If IDs, counts, anchors, fields, zero states, or placeholders disagree, correct only the authorized report
  output and repeat this step plus the subject-stability check. If response-only output caused a file write,
  report the exact unauthorized side effect, remove nothing without authority, and stop for caller direction.

#### 4.3 Final handoff

- Complete only when the unchanged subject retains its bound identity; all four categories and applicable
  cross-cutting concerns were inspected; claims and specialized routes are explicit; result types, IDs,
  anchors, and counts reconcile; improvement analysis is present; and the chosen boundary verifies with no
  placeholder or unauthorized side effect.
- Hand Defects and Optional Improvement choices to the document owner, Evidence Gaps to their named domain
  owners, and any criteria-derived acceptance request to Evaluation. The report grants no document mutation,
  priority, verdict, acceptance, release, publication, or cleanup authority.

## References

- [Documentation review report template](templates/report.md)
