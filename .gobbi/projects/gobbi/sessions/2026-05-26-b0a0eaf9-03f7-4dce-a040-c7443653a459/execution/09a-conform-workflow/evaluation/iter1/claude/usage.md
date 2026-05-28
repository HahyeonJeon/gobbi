# Usage perspective — T9a conform features/workflow §4 (commit 1287e88)

Reader/tool-consumer lens: can a future agent grep base keys and read these docs cold?

## Checks
- 9 base keys queryable on all 26 docs (Gate 2). A `name`/`type`/`status` grep resolves uniformly. PASS.
- Leak gate clean (Gate 1): tools scanning for staging residue get 0 false hits over workflow. PASS.
- De-crypted titles (13) materially improve cold-read comprehension. PASS.

## Findings

### F1 — `project` grep returns a hole on workflow README
- Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Medium
- Evidence: a tool/agent listing feature READMEs by `project: gobbi` will find project-memory README (has it) but miss workflow README (stripped). Inconsistent machine-readable surface.
- Why it matters: degrades the cross-type-uniform header that frontmatter is meant to be; brief Gate 7 violation.
- Suggested direction: restore `project: gobbi`.

### F2 — Two cryptic-led titles slow cold-read for those 2 docs
- Type: checklist_gap | Domain: docs-sync | Disposition: open | Confidence: 75 | Severity: Low
- Evidence: `# LOCK #2 Tasks 07+08 …` and `# T1→T3 wave ordering …` force the reader to skip a vanished coordinate before reaching the concept. Slug names are descriptive, so impact is bounded.

## Verdict reasoning
F1 Medium@100, no High at ≥50 on usage lens → PASS on lens. (Project/Risk carry the High.)

VERDICT: PASS
