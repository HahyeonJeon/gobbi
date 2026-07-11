---
name: policy-docs-and-validator-adversarial-review
description: "Dual-system review passed Task 02 with executable stress and bounded process concerns."
type: reviews
scope: feature
feature: workflow
status: active
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [evaluation, verification]
keywords: [task-02, policy-validator, dual-system, self-test]
author: codex
review_kind: adversarial-review
subject: 7d043fe41a7edfe8c66ef4c2bdd6854cf3deb379
verdict: pass
---

# Policy Documents and Validator Adversarial Review

## Subject

Commit `7d043fe41a7edfe8c66ef4c2bdd6854cf3deb379`, implementing Planning task
`02-policy-docs-and-validator` across exactly seven policy documents and one validator script.

## Reviewer + scope

Claude and Codex each produced current files for Project, Structure, Performance, Aesthetics,
Usage, Consistency, Risk, and Overall. Both systems return PASS. Codex additionally executed the
complete task gate and adversarial variants; fresh RECORD reran the fixed-target live gates.

## Method

The review checked the fixed commit and parent, exact eight-file scope, immutable executor draft,
the Ideation per-site inventory, exact `gpt-5.6-sol`/`xhigh` authority values, 5+4 complete command
ownership, one pointer-only workflow line, preserved Claude and operational behavior, all retained
non-policy validator families, five isolated expected-reason fixtures, strict marker and argument
semantics, tracked exact-line residual classification, alias topology, and clean source state.

Codex stressed no-op and wrong-reason fixtures, duplicate and missing markers, new residuals in an
allowlisted carrier, exact duplicate allowed lines, alias inode/mode identity, and historical
surface preservation. Claude used close reading and did not claim shell execution.

## Findings

### Exact duplicate residual cardinality

- **Severity**: Low
- **Confidence**: 100
- **Description**: A second identical allowed line in the same path is not occurrence-count checked.
- **Evidence**: Codex `CDEX-E2-RISK-001` and `CDEX-E2-OVR-001` reproduced the behavior.
- **Proposed remediation**: Add cardinality only if exact duplicates become a real drift class.
- **Disposition**: open

### Bare dual-use token maintenance

- **Severity**: Medium
- **Confidence**: 50
- **Description**: A future legitimate `--effort` mention can make the body-wide residual gate fail.
- **Evidence**: Claude retry Structure `F-STRUCT-1`; the current correct-negative is classified.
- **Proposed remediation**: Co-edit the classifier or narrow to structural invocation forms if needed.
- **Disposition**: open

### Fixture byte-shape coupling

- **Severity**: Low
- **Confidence**: 50
- **Description**: Literal fixture mutations depend on current JSON, TOML, and Markdown formatting.
- **Evidence**: Claude retry Structure `F-STRUCT-2`; current formats were verified and 5/5 runs pass.
- **Proposed remediation**: Treat source formatting and fixture mutation as a required co-edit.
- **Disposition**: open

### Temporary cleanup on early failure

- **Severity**: Low
- **Confidence**: 50
- **Description**: Original Claude Structure raised a possible temp-dir leak after mid-run failure.
- **Evidence**: The finding survives only in the current original Overall file because retry
  Structure overwrote the original perspective. No detail beyond that summary is inferred.
- **Proposed remediation**: Stress early failure plus temp-root removal in a future validator edit.
- **Disposition**: open

### Executor-draft rejection wording

- **Severity**: Low
- **Confidence**: 100
- **Description**: The immutable executor draft paraphrases three rejection reasons.
- **Evidence**: Original Claude Aesthetics `F-AES-1`, retained by current Overall. Source behavior and
  machine-consumed markers remain exact.
- **Proposed remediation**: Quote exact labels in future task records.
- **Disposition**: open

### Exact-line reflow coupling

- **Severity**: Low
- **Confidence**: 75
- **Description**: Reflowing the correct negative effort line fails the exact residual classifier.
- **Evidence**: Claude Risk `F-RISK-1` traces the full-line tuple and alias special case.
- **Proposed remediation**: Co-edit the sentence and classifier tuple.
- **Disposition**: open

## Cross-system divergence

There is no verdict divergence. Claude's executable coverage was limited by shell unavailability;
Codex and RECORD supplied the fixed-target commands. The material divergence is process-shaped:
the original Claude evaluation completed eight PASS files but omitted mandatory load paths. An
optional retry replaced Project, Structure, Performance, and Aesthetics, then hit its cost cap.
Usage, Consistency, Risk, and Overall remain from the original attempt. Thus the current Overall
file does not synthesize the replacement findings, including a colliding `F-STRUCT-1` label.

The resolution log disambiguates findings by attempt and stages every distinct concern. The two
existing WORK mistake-candidates preserve the shell-backtick and retry atomic-publish traps without
mutation. The complete Codex stress suite supports the reconciled PASS; no retry output or Claude
shell evidence is fabricated.

## Outcome

Task 02 is accepted at its exact commit. Fixed-target verification, all 16 current evaluation
files, and fresh live gates pass. One Codex limitation is deduplicated across Risk and Overall;
Claude's inventory and shellless scope findings are addressed by fresh evidence; the remaining
distinct assumptions are staged as non-gating open records.

## Open items

The staged open items are maintenance constraints, not deferred product risks. No backlog is
created. Task 03 consumes the two literal Task 02 outputs for planned release integration.

## Related

- [[policy-docs-and-validator-shipped]] - changelog for the accepted commit.
- [[evaluator-retry-overwrote-canonical-files]] - WORK-staged atomic-publish candidate.
- [[residual-allowlist-cardinality]] - deduplicated Codex limitation.
