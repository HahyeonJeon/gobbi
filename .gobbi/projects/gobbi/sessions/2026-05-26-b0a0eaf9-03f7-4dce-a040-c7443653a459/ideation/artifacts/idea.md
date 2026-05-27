---
loop: ideation
iter: 2
artifact_type: framed-problem
created_at: 2026-05-26
status: final
supersedes: []
related:
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/design-options.md
  - ideation/artifacts/resolution-log.md
  - ideation/artifacts/memory-reads.md
---

# Ideation Idea — development-document-level project-memory standard

## What

A **development-document-level writing standard** for gobbi project-memory docs, plus a
conformance-first then prose-quality retrofit of live docs — delivered in three priority-ordered
scope tiers (standard + content rewrite → skills/principles minimal grep gate → organization &
navigation light wave).

## Why

PR #272 fixed *where* memory files live and *what* they are named. It did NOT define or enforce
*how well each doc is written as a development document*. Two evidenced consequences (HEAD d2b5b37):

1. **Frontmatter never retrofitted to the base schema.** Only 50 / 208 live memory docs carry the
   full base schema — ~24% conformant. Legacy staging-routing keys persist as leaks (59 files carry
   ≥1 illegitimate key under the type-aware predicate).
2. **Cryptic session-internal references survive in doc bodies.** Confirmed at
   `features/git-workflow/design/worktree-create-before-session-stamp.md:31-33,49-51` — `T1-I-2`,
   `COD-PROJ-001`, `draft-iter3.md:308` are meaningless to a zero-context reader.

Root cause: no standard governing intra-doc prose quality, section structure, abstraction level, or
durable-vs-narrative content distinction.

## How

Wave-based, conformance first:

1. Write the dev-doc-level standard as a new section in `memorization/rules.md` (canonical file:
   `.gobbi/projects/gobbi/skills/memorization/rules.md`; `.claude/skills/...` is a symlink mirror).
2. Conformance wave (mechanical, wave 1): type-aware frontmatter base-schema normalization + FIX-1
   type-aware allowlist strip of illegitimate staging-routing keys + de-crypt cryptic session-coord
   body references.
3. Prose-quality wave (wave 2): per-type prose rewrite toward the quality bar; type-purity per
   Diátaxis.
4. Tier-3 light nav wave (wave 3, lowest priority): verify each feature `README.md`'s Subdirectories
   section; optionally add a top-level index pointer.

## Scope Contract (summary — see artifact scope-contract.md for full detail)

- **Project:** gobbi
- **Feature:** project-memory
- **Task:** Author a dev-doc-level memory standard and retrofit live docs in waves.
- **Primary deliverable:** written standard + mechanical conformance wave + prose wave.
- **Out-of-scope:** re-homing docs (PR #272 settled this), big-bang rewrites, heavy
  self-enforcement, frozen `archive/` docs, stripping legitimate per-type keys.
- **Builds on:** PR #272 branch `chore/session-2026-05-25-a10c82d6`; merge to develop deferred.

## Key Design Decisions (10 locked)

| # | Decision | Direction |
|---|---|---|
| D1 | Taxonomy | Keep 13 types; import Diátaxis type-purity as prose guidance only |
| D2 | Standard's home | New section in `memorization/rules.md` (canonical path; symlink mirror auto-reflects) |
| D3 | Positive quality bar | Lead with "what good looks like" + real before/after examples |
| D4 | Per-type section contract | ADR-shaped for decisions/design; existing schema for mistakes; new schemas for learnings/notes |
| D5 | Self-contained prose | No load-bearing vanished-session coordinates in bodies |
| D6 | Frontmatter conformance — TYPE-AWARE (FIX-1) | Type-aware allowlist: strip S-keys per predicate P; preserve legitimate-per-type extensions |
| D7 | Rollout | Wave-based; conformance first; each wave verified before the next |
| D8 | Enforcement depth | Minimal — mechanical grep gate at most; no Principle-13 surgery |
| D9 | Narrative handling | Reclassify to `notes/`; never delete |
| D10 | Scope edge | Exclude frozen `archive/` from standard, retrofit, and gate |

## FIX-1 predicate (critical lock — do not regress to blanket strip)

Illegitimate staging-routing key-set S:
`{ finding-id, confidence, severity, surfaced-by, promoted-from, promoted-at, mistake-candidate }` +
`disposition` ONLY when the file is NOT under a `backlogs/` directory.

File-selection predicate P: operate on P_live (not `archive/`, not `sessions/`/`skills/`/`agents/`/`tmp/`).
For each file F: strip every key in `S \ {disposition}` unconditionally; strip `disposition` from F
only if F is NOT under a `backlogs/` directory.

Safety invariant (locked): never strip a key that is legitimate for that doc's type/dir.

Measured baseline (HEAD d2b5b37): 59 files carry ≥1 illegitimate key under predicate P.
28 backlog files carry legitimate `disposition` (preserved). 35 non-backlog files carry `disposition`
as leak (stripped). 13 backlog files carry non-`disposition` illegitimate keys (stripped for those keys only).

## Population

- P_live_all = 208 files (includes 17 README.md index files)
- P_live_content = 191 files (P_live_all minus 17 READMEs)
- Fully conformant today: 50 / 208
- Measured at HEAD d2b5b37, worktree chore/session-2026-05-25-a10c82d6

## Implementation Notes for Planning

- **Edit the CANONICAL file**, not the symlink: `.gobbi/projects/gobbi/skills/memorization/rules.md`
- **12-vs-13 principle drift:** AGENTS.md + .codex/AGENTS.md say "12 principles"; .claude/CLAUDE.md
  says 13. Reconcile both entrypoints to 13 + add P13 row when authoring the standard (narrow
  non-surgery count-consistency fix). Surface as Planning confirm/defer task (PR-1 finding, Low).
- **#272 merge-back:** P13 + 13-type taxonomy + re-home exist only on this branch. Keep the
  `rules.md` edit additive to minimize merge-conflict surface; flag reconciliation as a
  Planning/handoff item.
- **Context budget:** 208-file / 191-content population is large. Planning should split waves into
  bounded tasks against the `manager-context-overflow-with-large-bundle` mistake.
- **CN-1 cosmetic note (non-blocking):** The FIX-1 sub-counts "28 + 35 = 63" use a looser filter
  for the 28; under single P_live filter the backlog-disposition count is 27 (27+35=62 reconciles).
  Normalize at Execution.
