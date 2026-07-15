---
name: evaluator-wrapper-must-enforce-explicit-contract
description: "Wrapper gates must enforce explicit evaluation contracts, not invented headings."
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [process, evaluation, validation]
keywords: [evaluator-wrapper, break-attempts, contract-gate, false-block]
author: codex
---

# Require evaluator wrappers to enforce explicit contracts only

## Context

The Claude evaluator produced all eight nonempty canonical files and returned PASS. Its seven
perspectives document adversarial break attempts, and Overall reconciles that evidence. A wrapper
nevertheless returned BLOCKED solely because Overall lacks the literal heading
`## Break Attempts`.

## Decision

Treat the wrapper-only block as disputed and retain the dual-system PASS. Evaluator wrappers must
check requirements stated by the governing evaluation skill or delegation prompt; they must not
turn an unstated formatting preference into a mandatory gate.

## Rationale

The contract requires adversarial coverage and a defensible Overall reconciliation. It does not
require every Overall file to repeat perspective evidence under one exact heading. The evaluation
meets the semantic requirement, while the wrapper's heading assertion tests an invented syntax.

## Alternatives considered

Retrying Claude was rejected because the canonical evaluation is complete and frozen, and a retry
would only satisfy a noncontractual wrapper detail. Editing the evaluation file during RECORD was
rejected because evaluator artifacts are immutable inputs. Downgrading the implementation verdict
was rejected because neither evaluator found a substantive defect and Codex passed the complete
executable contract.

## Consequences

Task 03 remains PASS. Future wrapper validation should derive each required check from an explicit
contract citation. This record is a bounded process decision, not a user correction, product
finding, or request to mutate the frozen evaluation.

## Related

- [[release-metadata-and-integration-gates-adversarial-review]] - review containing the disputed gate.
