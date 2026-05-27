# Risk perspective — T9a conform features/workflow §4 (commit 1287e88)

The CRITICAL diff-read gate: no KEEP key stripped (Gate 7). I classified every removed frontmatter line.

## Removed-key classification (full diff)
- S-set / session-routing residue removed (LEGITIMATE strip): loop, promoted-from, promoted-at, severity, iter, finding-id, confidence, surfaced-by, slug, sub-step, scenario, phase, mistake-candidate, loop-iter, addressed-in, task, session-id. All correct.
- `date` removed (17) — renamed to base `created` (not a KEEP key; legitimate normalization). OK.
- `disposition` removed (7) — all on checklists/ + decisions/ (NON-backlog); backlog retained it. Correct per §4.4 conditional. OK.
- Base keys (`session`/`created`/`scope`/`feature`/`type`/`status`) appearing as removed lines are all reorder churn (removed+re-added net 0). OK.
- KEEP keys re-added net 0: value_proposition, domain, last_updated, supersedes, superseded_by, decision_status, subsystems. OK.

## Findings

### F1 (CRITICAL GATE 7) — `project: gobbi` NET-stripped from workflow README
- Type: design_flaw | Domain: process | Disposition: open | Confidence: 100 | Severity: High
- Evidence: diff removes `-project: gobbi` from README with no re-add; `grep -lE '^project:'` over non-archive workflow returns only the anchor-placement decision, NOT the README. The brief's Gate 7 explicitly lists `project` among "NO ... removed" KEEP keys. Prior same-session commit dbe61c3 restored exactly this key after T8 stripped it, citing §4.4 KEEP.
- Why it matters: this is the precise failure mode the brief's CRITICAL gate guards against, and a repeat of a defect remediated one commit earlier (Iron Law 11 / mistake-recurrence). Net data loss of a provenance/scope tag on the feature's identity document.
- Suggested direction: restore `project: gobbi` to workflow README.

### F2 — `title` net-removed from one decisions doc
- Type: assumption_risk | Domain: docs-sync | Disposition: open | Confidence: 75 | Severity: Low
- Evidence: `title: "Wrap-up Step 2.5 anchor placement — new H3 after ### WORK discipline"` removed from decisions/wrap-up-step-2-5-anchor-placement.md, no re-add. Brief Gate 7 lists `title` as KEEP. Mitigant: content folded into `description` + `# heading` (no information loss), and §2.2 makes `title` non-canonical on `decisions` anyway. Genuine standard-vs-brief tension.
- Why it matters: brief literally protects `title`; but the canonical §2.2 model only allows `title` on references. Manager+user to reconcile. Low severity — content preserved.
- Suggested direction: if brief Gate 7 governs, restore; if §2.2 governs, also strip the 4 retained `title:` for uniformity (see consistency F2).

## Verdict reasoning
F1 is a High@100 KEEP-strip on the brief's CRITICAL Gate 7 → REVISE (no Critical-severity finding, so not FAIL; but it is the gate the task names CRITICAL and a repeat of dbe61c3).

VERDICT: REVISE
