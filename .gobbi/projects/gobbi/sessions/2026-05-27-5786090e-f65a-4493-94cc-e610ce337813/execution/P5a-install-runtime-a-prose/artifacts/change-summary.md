---
loop: execution
iter: 2
artifact_type: change-summary
created_at: 2026-05-27
status: final
supersedes: []
related:
  - ../evaluation/iter1/claude/findings.md
  - ../evaluation/iter1/codex/findings.md
---

# P5a Change Summary — install-runtime A prose pass (24 docs)

## Scope

PROSE wave task P5a: bring 24 docs under `features/install-runtime` subdirs A
(discussions/, design/, decisions/, changelogs/) to full §4.2 contract compliance
plus §4.1/§4.3 self-contained prose. 3 docs were already conformant and left
untouched.

## iter1 — `520cdb2` (21 files)

### Journal → ADR reshapes (4 decisions docs)

4 decisions docs had journal-style bodies (prose narrative, findings listed as
α-β-γ, planning-fix sequences). Each was reshaped to ADR format:

| Doc | Topic |
|-----|-------|
| `decisions/env-file-load-semantics.md` | env-file variable loading order |
| `decisions/pre-planning-readiness.md` | pre-planning readiness gate |
| `decisions/session-start-hook-script.md` | session-start hook script contract |
| `decisions/task-decomposition.md` | task decomposition strategy |

**Content preservation:** all evaluator findings (P1-P7, FIX 1-8/A-C, α-δ),
commit SHAs, planning-fix sequences (FIX I-VI, α-ε), and decision rationale
blocks preserved verbatim in the ADR bodies. Both Claude and Codex evaluators
confirmed content integrity on independent review.

### Design docs reshaped (6 docs)

6 design docs gained §4.2-compliant frontmatter (`topic:`, `status:`,
`feature:`, `session:`, `tags:`, `created:`) and §4.1 self-contained prose
(context paragraphs, decision rationale, trade-off notes where missing).

### Discussions docs reshaped (8 docs)

8 discussions docs reshaped to §4.3 contract: confirmed `type: discussion`
frontmatter, added missing `status:` and `tags:` fields, repaired prose headers
to match template expectations.

### Changelogs updated (5 docs)

5 changelogs gained the `**Task:**` line per §4.2 changelog contract. Entry
bodies were otherwise left intact.

### Cross-ref repairs — iter1 scope

Initial cross-ref sweep repaired obvious bare-name references to resolvable
relative paths throughout the 21 touched docs.

## iter2 — `0369b7d` + `5628346` (5 docs + 1 line)

### Driver

Codex REVISE verdict on iter1: 1 High finding — cross-ref resolution. Codex
identified 5 problematic references across the 4 P5a subdirs. Manager
ground-truthed each:

| Codex item | Classification | Action |
|------------|---------------|--------|
| `changelog → archived backlog path` | Real dead path-link | Repoint to live path |
| `decisions → stale staging path` (2 instances) | Real dead path-link | Repoint or remove |
| 3 bare-name refs in design/discussions | Bare-name (not dead) | Upgrade to resolvable relative paths |

### `0369b7d` — 5 docs

- 2 genuine dead path-links repointed to live destinations.
- 3 bare-name references upgraded to `[label](relative/path)` form.

### `5628346` — 1 line

- 1 residual stale staging path in the edit-contract narrative (line 37 of a
  decisions doc) repointed to the correct canonical path. Manager identified
  this after re-reading Codex's second item in context.

## Final state

- 21 docs modified in iter1 + 5 docs in iter2 + 1 line in iter2 fixup.
- 3 already-conformant docs untouched.
- No stale staging/archived-backlog paths remain in the 4 P5a subdirs
  (discussions/, design/, decisions/, changelogs/).
- §4.5 leak gate clean (D5 body scan clean; survivors: frontmatter `topic:`
  literal and `mistake` filename literal — both legitimate).
- P5b note: a residual stale staging path exists in
  `features/install-runtime/backlogs/ci-symlink-backlog-pseudocode-plumbing.md`
  — that file is P5b scope, not touched here.
