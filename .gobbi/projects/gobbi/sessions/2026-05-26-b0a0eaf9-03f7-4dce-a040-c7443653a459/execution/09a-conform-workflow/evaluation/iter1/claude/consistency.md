# Consistency perspective — T9a conform features/workflow §4 (commit 1287e88)

## Checks
- Type values vs directory: all canonical and aligned (backlogs/backlogs, changelogs/changelogs, checklists/checklists, decisions/decisions, design/design, discussions/discussions, plans/plans, README/features). PASS.
- Base-key ordering: T9a places base block first, then extensions — consistent across changed docs. PASS.
- KEEP-key treatment uniformity: INCONSISTENT — see F1.
- `title` extension treatment: INCONSISTENT — see F2.

## Findings

### F1 — `project` key treated inconsistently across sibling docs
- Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High
- Evidence: `features/workflow/README.md` had `project: gobbi` stripped (net -1); `features/workflow/decisions/wrap-up-step-2-5-anchor-placement.md` retained `project: gobbi` (still present, line 12). The sibling-feature project-memory README carries `project: gobbi` (restored by dbe61c3). Within the same task, the same key is dropped on one doc and kept on another.
- Why it matters: violates the cross-doc uniformity the conformance pass is meant to deliver; trips brief Gate 7. Future grep/tools that read `project` see a hole on workflow README only.
- Suggested direction: restore on README (or, if standard rules `project` strippable, strip from anchor-placement too — but dbe61c3 already chose KEEP).

### F2 — `title` extension kept on 4 docs, stripped on 1 (decisions doc)
- Type: checklist_gap | Domain: docs-sync | Disposition: open | Confidence: 75 | Severity: Low
- Evidence: `title:` retained on design/dependency-graph, design/five-locked-decisions, design/task-decomposition, plans/orch-workflow-improvements; stripped from decisions/wrap-up-step-2-5-anchor-placement.md (content folded into `description` + `# heading`). Per §2.2, `title` is a legit extension ONLY for `references` — none of these 5 are references, so strictly `title` is non-canonical on all 5. The pass neither uniformly keeps nor uniformly strips it.
- Why it matters: inconsistent application of the allowlist. Low severity because the stripped title's content was preserved (description + # heading), no information loss.
- Suggested direction: decide one rule for `title` on non-reference docs and apply uniformly; brief lists `title` as KEEP, so retaining on all is the safer reconciliation.

## Verdict reasoning
F1 High@100 (cross-doc KEEP inconsistency) → REVISE.

VERDICT: REVISE
