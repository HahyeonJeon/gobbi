# Coding skill family

## Result

- Implementation commit: `7a92642bc76819d13c7c0d9c2abca734125d7295` (`feat(coding)!: add coding skill family`).
- Tree: `6affce88bddbed8dcb4ab93cdfcc3c1ee3c55c9e`.
- Parent: `6a89f7c16e6be88ef4337c322cb55411e11bf72c`.
- Current design: [Coding skill family](../../design/feature/coding-skill-family.md).
- Session progression: [Coding skill family completed](../../history/2026-09-02-coding-skill-family.md).

## Durable result

The `coding` root is a navigation-only domain. It routes exactly three direct operations:
`coding-ideation`, `coding-execution`, and `coding-review`. Coding Ideation adds a dependency-gated top-down
design ladder to Generic Ideation. Coding Execution adds code-specific reach, specialist selection, slice
thinking, and commit-or-retain completion to Generic Execution. Coding Review preserves independent or disclosed
self-review feedback without target mutation, verdict, gate, correction, or acceptance authority.

Generic Planning remains the multi-task decomposition owner. Generic Evaluation remains outside the Coding
family as the independent gate. For an in-contract code judgment, Evaluation consumes the Coding Review checklist
after its unaided critique and may read a same-subject Review report only as delayed prepared evidence.

Domain Skill classification now requires at least two independently loadable direct children, each truthfully
classified as an operation, tool, or preference. It no longer requires one child of every type. The public
top-level `code-review` skill and discovery name are replaced by `coding-review` without an alias. The checklist
keeps 26 core categories, 30 expected scenarios, 180 negative signs, and 15 ordered specialist overlays.

Canonical skills, caller routes, four runtime role maps, runtime discovery, current Design Memory, Unreleased,
and generated plugin views changed as one consistency unit. Historical Memory and released changelog entries keep
their point-in-time names and facts.

## Verification and coverage

- The implementation commit contains the complete 80-path migration and no session files.
- `scripts/sync-plugin-package.sh --check` returned `package matches canonical projection` on 2026-09-02 after
  the implementation commit.
- The worktree and index were clean on `feat/coding-skill` at the implementation commit before this Memory action.
- Session self-verification covered the three-child family, root-to-child applicability text, role and discovery
  routing, local links, projection parity, and preserved Coding Review checklist and template bytes.
- Evaluation-01 returned `REVISE` against an earlier uncommitted subject. Later corrections and the final
  three-child design made that result stale, so it is not final quality coverage.

## Limits and authority

- Partner policy was disabled. The final implementation has self-verification only; no fresh independent
  evaluation covers the implementation commit.
- The `code-review` to `coding-review` replacement is intentionally breaking and has no compatibility alias.
- This closure does not claim merge, push, release, publication, or worktree cleanup.
