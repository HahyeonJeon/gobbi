---
slug: manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck
title: "Manager constructed iter2 revision brief from memory instead of re-reading the locked spec verbatim"
domain: process
severity: high
mistake-candidate: true
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: preparation
created: 2026-05-23
status: active
supersedes: null
date: 2026-05-23
feature: null
superseded_by: null
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
promoted-at: 2026-05-23T14:00:00Z
---

# Manager constructed iter2 revision brief from memory instead of re-reading the locked spec verbatim

## What went wrong

The iter2 Preparation leader brief listed 8 H2 sections that contradicted the locked Idea Design A at `ideation/staging/design/item-a-codex-skill-structure.md` lines 15-23. Specifically:

- The brief said H2 #8 was "Constraints" — but the locked spec has "Anti-patterns" as H2 #8.
- The brief omitted "Cost + sandbox budget awareness" as H2 #7 entirely.
- The brief instructed frontmatter key `when-to-load` — but the canonical project skill convention is `allowed-tools` (16 of 16 existing skills use `allowed-tools`; 0 use `when-to-load`).

The leader followed the brief faithfully. The resulting iter2 stub diverged from the locked Idea contract at exactly 2 structural points (section 7 substitution + frontmatter shape), causing REVISE verdicts from both Claude and Codex evaluators.

## Why

The manager constructed the iter2 revision brief from memory — recalling "the locked 8 sections" imperfectly — rather than `Read`-ing `item-a-codex-skill-structure.md` lines 15-23 into context before authoring. The mistake originates from the iter1 Codex evaluation itself, which also miscalled `when-to-load` as the correct frontmatter. The manager inherited that incorrect finding and propagated it as a "fix-mandate" in the iter2 brief without cross-verifying against the Ideation contract.

This is an Iron Law 7 (Principle 7) violation: "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE." The verification gate was applied to the leader's output (evaluators checked the stub against the spec) but not to the manager's own brief-construction step. The manager assumed memory was sufficient for encoding a "paste-inline-verbatim" specification.

## How to recognize

Before the manager authors any delegation brief that contains "exact" or "verbatim" instructions (e.g., "use exactly these 8 H2 sections in this order"), check whether the locked spec was `Read` into context within the last 10 manager turns of the current session. If the spec has not been freshly read, that is the warning sign.

Specific triggers:
- Brief contains phrases like "the locked sequence is..." or "use exactly these sections..."
- The section names or field names in the brief differ by even one word from the locked spec
- The brief cites a prior evaluator's description of the spec rather than the spec itself
- The brief references line numbers but those lines have not been scrolled through in-session

## Corrected approach

The manager MUST `Read` the locked spec into context immediately before constructing any "paste-inline-verbatim" section of a delegation brief. The `Read` call serves as the verification gate — without it, the brief is a memory claim, not a verified specification.

Companion rule: when a delegation brief includes any verbatim content claim, the brief-construction turn should grep-cite the source line range (e.g., "per `item-a-codex-skill-structure.md:15-23`") and that grep must have run in the current session. A citation that was not freshly verified is not a citation — it is a paraphrase.

Concrete fix for this mistake class:
1. Before authoring the revision brief, `Read` the locked spec file at the cited line range.
2. Copy the exact text from the `Read` output into the brief — never retype from memory.
3. Include the file path + line range as an inline citation in the brief so evaluators can re-verify independently.
