# Claude Docs Quality Review

Quality review of gobbi's `.claude/` docs as of 2026-04-03. This report evaluates the docs against the current `_claude` and `_project` guidance: clarity, navigability, scope control, and whether the docs behave like reliable entry points.

## Summary

The core entry docs are short and readable, but the project-level documentation is not yet acting as a dependable navigation layer. The main issue is not prose quality; it is trust. Two design docs present stale or speculative structure as current fact, which makes the project docs feel less reliable than the source tree.

## Findings

### High: the project design docs do not currently function as trustworthy navigation docs

`.claude/project/gobbi/design/claude-docs.md` and `.claude/project/gobbi/design/structure.md` both present current-state inventories, but each contains substantial stale content. Once an inventory or structure doc is wrong in a few obvious places, readers have to verify everything against the filesystem manually.

This is the main quality problem because these files are supposed to reduce lookup cost and onboard future sessions quickly.

### Medium: project-directory entry points are incomplete

The `_project` standard says every directory should have a `README.md` entry point. Under `.claude/project/gobbi/`, only the project root and `note/` currently have one.

Directories missing an entry README in this review:

- `.claude/project/gobbi/design/`
- `.claude/project/gobbi/docs/` before this report set
- `.claude/project/gobbi/gotchas/`
- `.claude/project/gobbi/reference/`
- `.claude/project/gobbi/rules/`

This slows navigation because readers must list files or open docs blindly.

### Medium: `.claude/project/gobbi/design/architecture.md` is drifting past the style target

The file is 260 lines long. `_claude` sets a hard cap of 500 lines but recommends targeting under 200. It also relies heavily on fenced ASCII diagrams, with code blocks starting at lines 11, 70, 121, and 163.

The document is still readable, but it is becoming harder to scan than the rest of the doc set. If it grows further, splitting it into smaller architecture docs would better match the current writing standard.

### Low: `.claude/project/gobbi/README.md` is too thin for the amount of structure it points at

The root project README is only 14 lines long and works as a directory list, but it does not tell the reader:

- what is current vs historical
- which docs are authoritative for repo structure
- where review and audit outputs live

That makes the project root readable but not very informative.

## Strengths

- `.claude/CLAUDE.md` stays short and behaves like a session reference card.
- `.claude/README.md` is concise and clear about gobbi's high-level principles.
- `.claude/rules/__gobbi-convention.md` is focused, specific, and easy to verify.
- Most individual skills follow a predictable entry-point pattern.

## Recommended Follow-Up

1. Treat `.claude/project/gobbi/design/claude-docs.md` and `.claude/project/gobbi/design/structure.md` as cleanup priorities before adding more project docs.
2. Add `README.md` files for `design/`, `gotchas/`, `reference/`, and `rules/`.
3. Decide whether `architecture.md` should stay as one overview doc or split into smaller docs for workflow, agent roles, and evaluation.
4. Expand the project root README so it points readers to the authoritative design and review docs.
