---
name: codex-skill-prior-art
description: skills/codex/SKILL.md already owns Codex sandbox vocabulary and cross-references the git skill via a dangling link; git skill must align with it
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex, sandbox, prior-art, alignment, internal]
title: skills/codex/SKILL.md already owns Codex sandbox vocabulary and cross-references the git skill — internal prior art the git-skill change must ALIGN with
source: .gobbi/projects/gobbi/skills/codex/SKILL.md
accessed: 2026-06-14
ref_type: code
---

# skills/codex/SKILL.md already owns Codex sandbox vocabulary and cross-references the git skill — internal prior art the git-skill change must ALIGN with

## Insight

`skills/codex/SKILL.md` is the canonical internal source for Codex sandbox / runtime vocabulary,
and it already cross-references the git skill via a dangling link at `:254`. Verified content:
sandbox vocabulary (`sandbox_mode = "read-only"` :76, `--sandbox workspace-write` :117/:214/:306,
`:126`, `danger-full-access` anti-pattern :181), `## Runtime Matrix` (:18),
`### Models and Sandbox` (:72), `### CWD inheritance` (:187), `### Absolute-path mandate` (:196),
`### Cross-tree writes` (:208). The cross-ref at `:254` says "see `git/SKILL.md § Worktree CWD
discipline`" — but that section does NOT exist today (dangling link).

## Related

- INT-7 — the internal insight label in draft-iter2.md
- DD-1 — alignment note: cross-reference codex/SKILL.md, do not duplicate
- DD-7 — add git/SKILL.md § Worktree CWD discipline to resolve the dangling link
- C20 — checklist item for the section addition

## Why it applies

The git-skill change must (a) ALIGN with `codex/SKILL.md` as the canonical Codex sandbox source —
cross-reference it, do not duplicate or contradict its sandbox-mode/workspace-write/danger-full-access
definitions — and (b) ADD a `git/SKILL.md § Worktree CWD discipline` section so the existing
`codex/SKILL.md:254` link resolves. This makes `codex/SKILL.md` an affected/alignment file in the
Scope Contract (item g), and reframes the dual-runtime gap as the git skill catching up to vocabulary
the codex skill already owns.

## Source

- `.gobbi/projects/gobbi/skills/codex/SKILL.md` (lines as cited above)

## Excerpt

> `:76` "Use `sandbox_mode = "read-only"` only for agents that must never write, such as
> `evaluator`." / `:126` "Use `workspace-write` only when Codex must write files." / `:181`
> anti-pattern "Using `danger-full-access` as a default sandbox." / `:254` "see
> `git/SKILL.md § Worktree CWD discipline` — codex inherits CWD from the calling shell, and
> worktree-bound CWD applies to both file reads/writes and `--cd` defaults."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-14 | 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d | R1 root-defect remediation; DD-1 alignment note; DD-7 + C20 section addition |
