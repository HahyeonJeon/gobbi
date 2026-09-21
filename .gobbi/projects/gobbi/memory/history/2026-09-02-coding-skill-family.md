# Coding skill family completed

**Completed at:** 2026-09-02T15:49:10Z

## Changes

- Added the navigation-only [Coding skill family](../design/feature/coding-skill-family.md) with direct
  `coding-ideation`, `coding-execution`, and non-gating `coding-review` operations. Generic Planning remains the
  multi-task decomposition owner, and Generic Evaluation remains the independent gate.
- Changed Domain Skill families to require at least two independently loadable, truthfully typed direct children
  instead of one operation, one tool, and one preference child.
- Replaced the public top-level `code-review` skill with `coding-review` without an alias. This supersedes the
  [standalone Code Review location](2026-08-22-code-review-skill.md) without rewriting that history. The shared
  checklist and report template moved while preserving Review semantics and baseline coverage.
- Shipped the canonical, runtime-discovery, role, changelog, current-design, and generated plugin changes in
  `7a92642bc76819d13c7c0d9c2abca734125d7295`. The [development account](../reports/note/2026-09-02-coding-skill-family.md)
  records verification and final evaluation limits.
