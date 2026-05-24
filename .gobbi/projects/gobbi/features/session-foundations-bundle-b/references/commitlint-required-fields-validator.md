---
title: commitlint — required-fields validator for structured commit messages
source: https://commitlint.js.org/guides/local-setup.html
type: docs
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [validator, required-fields, pre-commit, lint, schema]
related: [rbac-matrix-single-source-of-truth]
---

# commitlint required-fields validator pattern

## Insight
commitlint enforces conventional-commit structure via a `commit-msg` git hook plus a configuration file (`commitlint.config.js`) that declares required fields (`type`, `scope?`, `subject`, `body?`, `footer?`) and per-field rules (`type-enum`, `scope-enum`, `subject-max-length`, `body-max-line-length`, `*-empty: never`). Husky (or alternative pre-commit framework integrations such as `espressif/conventional-precommit-linter`) wires the hook to the git lifecycle. The enforcement layer is the `commit-msg` hook — invoked *before* the commit lands, surfaces a non-zero exit code with a structured error if a required field is missing. The pattern: declared schema + declarative rules + structural validator + lifecycle-anchored enforcement.

## Why it applies
T2's "Load Directives validator" is a directly-analogous design problem: a structured doc (the Load Directives block in a delegation prompt) has required fields (tier-3 Skills enumerates exactly the right skills), and the manager-side pre-dispatch step is the lifecycle anchor for validation. commitlint demonstrates this exact pattern works at scale and gives a deterministic answer to T2's "where does the enforcement layer sit" design question: pre-dispatch (analog of `commit-msg`), not CI (post-fact) and not editor lint (too distant). The structural validator should consume the matrix as its configuration (analogous to `commitlint.config.js`).

## Source
- https://commitlint.js.org/guides/local-setup.html
- https://github.com/conventional-changelog/commitlint
- Both accessed 2026-05-23

## Excerpt
> "Rules enforce that a field is not empty. The linter accepts several configurable parameters including --types to define the types of commits allowed… Additional configurable parameters include scope restrictions, subject length requirements, and body line length validation."
> "To use commitlint you need to setup commit-msg hook (currently pre-commit hook is not supported)."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T2 external insight #2 — anchors validator location (pre-dispatch ≅ commit-msg), schema-as-config pattern |
