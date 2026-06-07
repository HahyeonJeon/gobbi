---
name: planning-leader-asserted-file-type-without-verifying
description: Planning leader stated a file's type (real vs symlink) without running test -L or ls -l to verify
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [process, planning, citation-fidelity, symlinks, verification]
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/planning-leader-asserted-file-type-without-verifying.md
layer2-rationale: Generalizable across all projects — any planner/leader that asserts file type/existence in a brief without checking propagates a potential executor failure.
supersedes: null
superseded_by: null
---

# Planning Leader Asserted File Type Without Verifying

## Layer-2 note

This is a Layer-2 copy of `mistakes/planning-leader-asserted-file-type-without-verifying.md`. It lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

A planning leader stated in cross-cutting plan notes that target files are "real files (NOT symlinks)" without running `test -L` or `ls -l` to verify. The assertion was incorrect — the files ARE symlinks. An executor using the stated paths would fail (e.g., the Edit tool refuses symlink paths). The manager caught the error during plan verification and patched all executor briefs before dispatch.

## Why it happens

The same citation/verification-fidelity failure as `leader-iter2-verification-claim-without-evidence.md` — a file-property claim stated from assumption, not from a live check. The leader reasoned from prior knowledge rather than verifying against the actual file system.

## Correct approach

Before asserting a target file's type, existence, or path in a plan or brief:
1. Run `test -L <path>` or `ls -l <path>` to check symlink status.
2. Run `find . -name <filename>` repo-wide to confirm the canonical location.
3. Cite the verification command in the plan note.

The planning brief's assertion is the executor's spec; an unverified file-type claim becomes the executor's incorrect starting assumption.

## How to detect

Any "X is/ isn't a symlink / real file / exists" claim in a plan or brief without a cited verification command. If the claim says "NOT symlinks" or "real file" with no supporting `ls -l`/`find` evidence, treat it as unverified.

## Related

- `mistakes/leader-iter2-verification-claim-without-evidence.md` — the broader verification-fidelity pattern
