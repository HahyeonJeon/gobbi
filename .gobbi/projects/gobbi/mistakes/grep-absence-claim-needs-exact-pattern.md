---
name: grep-absence-claim-needs-exact-pattern
description: A "feature X is absent" claim backed by a grep must quote the EXACT pattern that returned zero; a loose pattern (e.g. including a common word like read-only) returns hits and falsifies the claim.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process, research, verification, grep]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# A grep-backed absence claim must use the exact discriminating pattern

## What happened

The research draft asserted "grep confirms zero hits for
`sandbox|approval_policy|workspace-write|danger-full|network_access|read-only` across `skills/`."
When the grep was actually run, the pattern returned 6 hits — because `read-only` is a common term
that appears in unrelated Memory-Access-Matrix rows (`mistake/SKILL.md:21`, `research/SKILL.md:23`).
The intended claim (git-runtime sandbox/approval concepts are absent) was TRUE, but the cited
pattern was too loose, so the literal claim "zero hits" was false.

## Why it happens

When proving an absence, it is tempting to list every related term in one alternation pattern. But
absence-grep is only valid if EVERY term in the pattern is discriminating — a single common word
(`read-only`, `commit`, `branch`) that appears in any unrelated context flips the count from 0 to
non-zero and falsifies the "zero hits" claim, even when the substantive finding holds.

## Correct approach

Before writing "grep confirms zero hits for <pattern>", RUN that exact pattern and read the count.
If non-zero, either (a) narrow the pattern to only the discriminating terms, or (b) keep the loose
pattern but state the count honestly and explain which hits are unrelated (with file:line). Never
assert a count without running the exact pattern that produces it.

## How to detect

- A draft contains "grep … zero hits for `A|B|C`" where one of A/B/C is a common English word or a
  term used in unrelated subsystems.
- The absence claim was written before the grep was executed, or the executed grep used a different
  (narrower) pattern than the one quoted.

## Related

- Reinforces `planning-asserted-skill-without-verifying.md` (assert only what you verified) and
  `plan-rename-must-enumerate-all-ref-classes.md` (a grep's pattern scope determines what it can
  prove). The discipline generalizes: a verification command's claim is only as strong as the exact
  command quoted next to it.
