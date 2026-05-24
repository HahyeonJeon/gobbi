## Stage 0 — Artifact Summary + Memory reads
Artifact: Ideation iter3 draft.
Consistency lens: cross-artifact coherence, internal contradictions, cited-source sync, and scope-diff discipline.
What: three fixes applied to iter2.
Why: final iteration must not carry a high-confidence contradiction into Planning.
How: compare draft to git conventions, official hooks page, staged files, and iter2 baseline.
W/W/H gate: PASS.
Memory reads:
- shared Stage 0 reads from `project.md`
- `draft-iter3.md` full file
- `draft-iter2.md` diff
- `.claude/skills/git/conventions.md` full file
- staged reference `claude-code-posttooluse-hook-schema.md`
- staged backlog `dot-gobbi-project-json-bootstrap.md`
- official hooks page current fetch
- prior Consistency and Overall files from iter1/iter2, both Claude and Codex.

## Locked Frame (Stage 1)
Scenario C1: Fix A is synchronized everywhere a branch name appears.
- Check C1.1: active design statements use `chore/session-`.
- Check C1.2: validation regex uses `^chore/session-...`.
- Check C1.3: remaining `session/` is historical or provenance URI.
Scenario C2: Fix B is synchronized between draft, staged reference, and upstream docs.
- Check C2.1: draft quotes appear at all three required locations.
- Check C2.2: staged reference contains equivalent table rows.
- Check C2.3: upstream confirms the event and exit behavior.
- Check C2.4: event-count prose matches evidence.
Scenario C3: Fix C is synchronized between Scope, Design, Checklist, Backlog, and empirical file state.
- Check C3.1: Out-of-Scope and Deferred mention the project.json backlog.
- Check C3.2: D-3-3-resolver labels step (i) dormant.
- Check C3.3: checklist includes T3-I-T3.h.
- Check C3.4: backlog file exists and describes two paths.
Scenario C4 (adversarial): iter3 contains an orthogonal edit outside the three fixes.
- Check C4.1: diff head maps to allowed categories.
- Check C4.2: no unrelated content rewrite is visible in touched areas.
Scenario C5: inherited consistency residuals get dispositions.
- Check C5.1: branch convention contradiction is addressed.
- Check C5.2: DQ-anchor residual remains low/medium.
- Check C5.3: status schema deferral remains clean.

## Per-scenario per-check results
C1.1: YES. G-1, E-2, F-4, D-1, T1-I-T1.a, T1-I-T1.h, and validation all use `chore/session-`.
C1.2: YES. `draft-iter3.md:281` and `:424` use `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`.
C1.3: YES. Filtered grep leaves only an audit sentence; full grep occurrences are provenance URI, historical iter2 text, or active corrected branch forms.
C2.1: YES. Required quote strings appear in draft lines 205, 289, and 366.
C2.2: YES with formatting difference. Reference lines 33 and 39 include table-form equivalents with backticks and spacing.
C2.3: YES. Independent upstream check confirms `PostToolUseFailure` lifecycle and exit-code behavior and command hook support.
C2.4: NO. The draft/reference says 31 events, but the reference enumerates 29 and current upstream visible event list is 29.
C3.1: YES. Scope lines 53 and 89 mention the backlog.
C3.2: YES. Design line 377 explicitly marks the dormant precondition and active fallback.
C3.3: YES. Checklist line 294 adds T3-I-T3.h.
C3.4: YES. Backlog lines 31-36 describe two pickup paths.
C4.1: YES. Diff changes map to metadata/header, Fix A, Fix B, or Fix C.
C4.2: YES. No unrelated design surface was materially edited.
C5.1: ADDRESSED. Branch contradiction is gone.
C5.2: OPEN / NON-BLOCKING. DQ-anchor traceability is unchanged.
C5.3: DEFERRED. Status schema remains pointed at its feature backlog.

## Typed findings
### COD-CONS-004 — Branch naming internally and externally consistent
- type: design_flaw
- domain: regression
- disposition: addressed
- confidence: 100
- severity: High
- surfaced-by: codex
- inherited-from: iter2/codex/consistency.md COD-CONS-004; iter2/claude/consistency.md C1
- evidence: branch validator passes for `chore/session-2026-05-23-1b26cf20`; all active branch references use the corrected form.

### COD-CONS-ITER3-001 — Hook event count contradicts captured evidence
- type: general
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: Medium
- surfaced-by: codex
- inherited-from: none
- evidence: `draft-iter3.md:205`, `:366`, `:533` and reference lines 27/43/75 claim 31 hook events. The same reference enumerates 29 events at lines 45-73 and the current official page visible lifecycle list is 29. This should be corrected before promotion, but it does not undermine the verified `PostToolUseFailure` support.

### COD-CONS-ITER3-002 — `chore` label line citation is off by two lines
- type: general
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: Low
- surfaced-by: codex
- inherited-from: none
- evidence: `draft-iter3.md:310` and `:524` say the label table has `chore | #e4e669` at line 261. `grep -n` shows `fix` at line 261 and `chore` at line 263.

### COD-CONS-002 — DQ-anchor traceability remains a residual
- type: checklist_gap
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- surfaced-by: codex
- inherited-from: iter2/codex/consistency.md COD-CONS-002; iter2/codex/overall.md COD-OVERALL-004
- evidence: iter3 did not reopen the DQ-anchor traceability deferral; F1-Fix decisions still provide enough local trace for Planning.

## Low-confidence appendix
No additional Consistency concerns exceeded 25 confidence.
False-positive check: event-count and line-number issues are not elevated to High because the actual operational claims they support were independently verified.

Verdict: PASS
