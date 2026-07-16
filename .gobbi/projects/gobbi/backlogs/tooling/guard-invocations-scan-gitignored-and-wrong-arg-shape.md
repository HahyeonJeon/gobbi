---
name: guard-invocations-scan-gitignored-and-wrong-arg-shape
description: "Standing guards mis-behave when handed the whole project dir: check-markdown-links.sh + check-residual-vocab.sh scan the gitignored sessions/ scratch (149 false 'broken links' from executor drafts); check-residual-vocab.sh runs Family-A vocab over the memory tree (Family-B surface); validate-frontmatter.sh takes .md FILES not a dir (no-args is its designed run). Add gitignore-aware pruning / correct the standing-invocation reference."
type: backlogs
scope: project
feature: null
status: open
priority: medium
project-scope: true
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [process, validation]
keywords: [guard-invocation, check-markdown-links, check-residual-vocab, validate-frontmatter, gitignored-sessions, family-a-family-b, designed-invocation]
author: claude
---

# Guard invocations: gitignored-scratch scan + wrong arg shape

Surfaced in the 2026-07-16 wrap-up-redesign Execution (T7 + Execution eval). When a green-check hands the WHOLE project dir to the standing guards:

- `check-markdown-links.sh <project>` reports ~149 "broken links" — ALL inside the gitignored `sessions/` scratch (executor drafts + Codex proposals carrying skill-relative links). Zero in the durable tree.
- `check-residual-vocab.sh <project>` runs Family-A vocab over the memory tree (Family-B's surface + frozen history (legacy retired-vocab keyword carriers)) → thousands of false hits — the exact family/surface conflation the guard's two-family design forbids.
- `validate-frontmatter.sh <project-dir>` returns "no .md files to validate" (exit 2) — it takes `.md` FILE args; no-args is its designed auto-scoped run (excludes archive/sessions/skills/agents/tmp/worktrees).

**Fix options**: (a) add a gitignore-aware `sessions/` (+ scratch) prune to `check-markdown-links.sh` / `check-residual-vocab.sh`; (b) correct the standing-invocation reference (the wrap-up green-check + any doc that cites `<project>` as the guard arg) to each guard's designed surface. **Impact**: a naive `<project>` green-check gate looks red when the durable tree is clean — misleads the acceptance signal. Needs a user/manager decision on which guard behavior is canonical.
