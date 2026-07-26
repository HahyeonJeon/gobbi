---
name: firing-check-claims-about-itself
description: A check that fires (or stays silent) is a claim about the check's own construction, not automatically a claim about the thing it checks — nine independent loose-check false positives surfaced in one session.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification, tooling]
keywords: [loose-check, false-positive, substring-match, symlink, digest-reproducibility]
author: claude
priority: high
domain: verification
related: [grep-absence-claim-needs-exact-pattern, regex-header-check-false-missing, literal-grep-gate-false-fails-legitimate-usage, find-misses-symlinked-mirror-dirs, exit-in-command-substitution-fails-open]
---

# A firing check is a claim about the check, not (yet) about the subject

## What happened

One session surfaced nine independent instances of a loose check producing a wrong signal, each a
different mechanism: a substring pattern matching inside a longer, unrelated word; a parser that
read only the first line of a wrapped multi-line block and silently ignored the rest; a `stat`
call that reported on a symlink itself rather than the file it points to; a grep pattern matching
`reactivate` when hunting a narrower term; a phrase match firing inside a longer phrase that
happens to contain it; a shell `&&` chain that printed a success message even though an earlier
stage in the chain had failed to parse; and a composite digest recipe — several piped commands
each individually documented — that no two independent readers could reproduce identically,
which stalled and then aborted a single peer evaluation run costing roughly 244,000 tokens before
the mismatch was traced to the recipe rather than to either reader's environment.

## Why it happens

A check is code, and code has the same gap between "the author's intent" and "what the pattern
actually matches" as any other code. A firing check FEELS like ground truth because it is
mechanical and repeatable, but mechanical repeatability only proves the check is deterministic —
it says nothing about whether the check's boundary (a word boundary, a line boundary, a file-vs-
link distinction, an exit-code propagation point, a canonicalization step) matches the boundary
the author had in mind. Composite recipes compound this: each individual command in a pipeline can
be independently correct and separately documented, while the PIPELINE as a whole introduces a
behavior (a trailing newline, an intermediate line-first read, a lost exit code) that no single
command's documentation would predict, and that costs real resources to discover only once two
independent parties try to reproduce it and disagree.

## Correct approach

Before trusting a check's firing or non-firing as a fact about the subject, ask what the check's
boundary actually is, not what its name or intent suggests: does the pattern respect word
boundaries; does the parser consume the whole block or a truncated read; does the file-inspecting
command dereference a symlink or report on the link; does the exit code the caller inspects
actually propagate from the stage that can fail; does a canonicalization step in a pipeline append
or strip a trailing terminator the next stage will hash. For any digest, checksum, or fingerprint
computed through a shell pipeline, treat reproducibility across two independent invocations as a
prerequisite, not an assumption — run the exact recipe twice, in two environments if possible,
before trusting its output as a comparison anchor.

## How to detect

A check's PASS or FAIL is being treated as self-evidently true about the subject rather than as a
claim that itself needs auditing. Specific tells: a grep or substring pattern with no word-
boundary anchor; a parser or reader whose loop exits after the first matching line without an
explicit "continue to end of block" step; a `stat`, `ls`, or file-inspection call with no `-L`/
`--dereference` flag on a path that might be a symlink; a shell chain using `&&` or `;` where an
earlier stage's own success is inferred from a later stage's success rather than checked directly;
and — the highest-cost case — a fingerprint or digest computed by more than one piped command where
no one has run the exact recipe from two independent starting points and diffed the byte output,
not just the resulting hash length or format.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — the substring/word-boundary instance of this family
- [[regex-header-check-false-missing]] and [[literal-grep-gate-false-fails-legitimate-usage]] — the
  pattern-vs-intent-boundary instances
- [[find-misses-symlinked-mirror-dirs]] — the symlink-dereference instance
- [[exit-in-command-substitution-fails-open]] — the exit-code-propagation instance
- [[shell-pipeline-digest-includes-tool-trailing-newline]] — this session's own composite-digest
  instance, staged and promoted alongside this trap
