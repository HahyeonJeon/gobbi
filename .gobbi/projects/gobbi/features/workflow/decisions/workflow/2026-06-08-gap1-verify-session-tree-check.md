---
name: gap1-verify-session-tree-check
description: Create verify-session-tree.sh as a runnable --check script (Option A) to satisfy the design's sync-check + path-validation requirement without a test framework.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [tooling, test-harness, session-tree, scaffold]
author: claude
supersedes: null
superseded_by: null
---

# Create verify-session-tree.sh --check (Option A) for sync-check and path-validation

## Context

The session-memory redesign specifies two runtime guarantees: (1) a spec-to-script sync-check — the `session-tree.md` spec and `scaffold-session-dir.sh` must stay in sync; (2) a fail-closed path-validation contract — the scaffold script rejects unsafe inputs (`..`, leading `/`, non-absolute root, bad step-dir) and exits non-zero. Both guarantees need a runnable verification gate. No test framework existed in the repo: no CI pipeline, no `package.json`, no `Makefile`, no `*.bats` files.

## Decision

Create `orchestration/scripts/verify-session-tree.sh` as a runnable `--check` script following the `sync-plugin-package.sh --check` in-repo precedent. It ships in the same PR as the scaffold script and spec doc.

## Rationale

Four options were considered. The selection rests on an established in-repo convention: `scripts/sync-plugin-package.sh --check`, `scripts/check-plugin-invocability.sh`, and `scripts/validate-plugin-hooks-fire-once.sh` are all manually-invoked `--check` scripts documented in skill prose as manual gates. These scripts follow `set -euo pipefail` and exit non-zero on failure. The verification script for the session-tree fits this pattern exactly: it scaffolds a throwaway `<step-dir>` to a temp path, `find`-sort-diffs only the script-created loop/task subtree against the `session-tree.md` spec baseline (COD-STRUCTURE-2 narrowing — never the manager-created root `transcripts/`/JSON invariants), and runs path-validation negative cases. It is documented as a manual gate in `orchestration/SKILL.md` and the `session-tree.md` spec doc.

No new dependency, no new tooling. Ships in the same PR. User confirmed Option A via the Sub-step D AskUserQuestion gate during Preparation.

## Alternatives considered

- **Option B (bats)** — Bash Automated Testing System. Rejected: introduces a new external dependency with zero prior use in the repo and no CI to run it.
- **Option C (prose-only)** — document the sync-check requirement in skill prose without a runnable gate. Rejected: leaves the determinism guarantee unrunnable.
- **Option D (defer)** — delay until CI infrastructure exists. Rejected: removes the guarantee the redesign rests on.

## Consequences

- `orchestration/SKILL.md` and `orchestration/templates/session-tree.md` document the `--check` gate as a "run before claiming the spec is current" pointer.
- The script diffs only what it scaffolds (loop/task subtree), not the manager-created root invariants (`transcripts/`, `session.json`).
- COD-STRUCTURE-2 narrowing applies: `verify-session-tree.sh --check` exits 0 against the spec+scaffold for the `<step-dir>` subtree ONLY.

## Related

- design/session-memory-tree.md
- decisions/2026-06-08-scaffold-script-mechanism.md
