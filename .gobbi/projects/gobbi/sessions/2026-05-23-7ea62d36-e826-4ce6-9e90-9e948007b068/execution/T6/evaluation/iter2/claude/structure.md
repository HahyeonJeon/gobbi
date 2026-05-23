# Structure Perspective — iter2 re-eval (Claude)

**Target:** codex/SKILL.md @ b9970dc.

## Frame

Scope: section ordering, H2 contract, frontmatter, body composition.

## Scenario Checklist

- S1: 8 H2 sections present and in the locked order? **YES** — `grep -c '^## ' = 8`. Sections retained: Why codex / Patterns / Sandbox+CWD / Witnesses-citations integrated into Section 2 / Concurrency / Worked example / Pitfalls / Constraints body.
- S2: Frontmatter unchanged (no `when-to-load` re-introduction)? **YES** — diff hunks do not touch frontmatter; baseline shape preserved.
- S3: Iter2 additions live in correct sections? **YES** — witness IDs appended to Section 2 (where patterns are described, witnesses substantiate them), git cross-link in Section 6 (concurrency/worktree topic), symlink anti-pattern in Section 8 (Pitfalls).
- S4: No accidental new H2? **YES** — additions use bold inline text + bullets, not `^## `.
- S5: Worked-example block in Section 6 (or wherever it lived) expanded coherently? **YES** — Step 2 expanded with 3 distinct verification commands; Step ordering preserved (1→2→3→4); no orphaned steps.

## Findings

None.

## Must-Preserve

- Locked 8-H2 contract.
- Witness ID block placement under Section 2 (Patterns).
- Worked-example Step 1→4 numbering.

VERDICT: PASS
