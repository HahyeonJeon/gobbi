---
name: manifest-verbatim-rerun-reproducibility
description: Checklist for ensuring D-e manifest commands reproduce their stated counts on verbatim re-run
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, verification]
keywords: [manifest]
author: claude
archived_at: 2026-07-20
archive_reason: addressed
---

# Manifest verbatim-rerun reproducibility — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Change `T="memoriz\|..."` to use ERE alternation `T="memoriz|..."` for `grep -E` commands | `evaluation/iter2/claude/project.md` (PROJ-1) | pending | Re-run each manifest row verbatim; confirm result matches stated count |
| 2 | Fix INT-2's `grep -v historical` to exclude the real historical set (4 caps-bearing `features/workflow/` files or the full 21-EXCLUDE path set) | `evaluation/iter2/codex/consistency.md` (codex-consistency-003) | pending | Re-run INT-2 command; confirm result = 49 |
| 3 | Re-run every manifest row (B1..B7, INT-2, 92-union) after dialect fix; confirm count↔command coherence | Both findings above | pending | Row-by-row: command result = stated count |

## Item details

### 1. ERE alternation fix
INT-2's `T` variable and the B-bucket row commands use `grep -rilE "$T"` with BRE `\|` inside the `$T` string. Under ERE (`-E`), `\|` is literal (not alternation), so B2 → 0, B7 → 0, etc. Fix: either change `T="memoriz|session[ -]memor|project[ -]memor"` (ERE `|`) or drop `-E` and keep BRE `\|`. Both spellings are equivalent; the ERE form is shorter.

**Anchor reasoning**: PROJ-1 (tool-verified: ran B7 verbatim → 0; claimed 5).

**Verification approach**: Run B2 with fixed dialect → should return 2; run B7 → should return 5.

### 2. Historical exclude predicate fix
INT-2's annotation uses `grep -v historical` to filter out historical files, but no path in the repo contains "historical" as a path component — the filter is a no-op. The correct predicate is explicit path exclusion of the 4 or 21 EXCLUDE-bucket paths.

**Anchor reasoning**: codex-consistency-003 (tool-verified: ran INT-2 annotated command → 53, not 49).
