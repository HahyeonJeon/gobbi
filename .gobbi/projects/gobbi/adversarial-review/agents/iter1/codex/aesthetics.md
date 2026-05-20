## Artifact Summary + W/W/H (Stage 0)

Artifact bundle: five agent role docs defining the v0.5.0 taxonomy. What: readable role-facing markdown specs. Why: make agent responsibilities, boundaries, and status contracts self-evident. How: frontmatter, a role heading, out-of-scope bullets, load directives, lifecycle, status contract, red flags, and quality expectations. W/W/H gate: clear. Aesthetic risks are naming, reader mental model, and stale vocabulary.

## Memory reads register

- Loaded same governing docs, role files, delegation templates, rule, mistakes, and runtime/mirror verification sources recorded in `project.md`.
- Additional aesthetic checks: `rg` for retired/overloaded names (`pi`, `innovative`, `best-practice`, `architecture`, `user`, old evaluator role names) across role docs, delegation docs, `.claude/CLAUDE.md`, and specs.
- Prior iteration: not applicable for ITER 1.

## Locked Frame (Stage 1)

Frame additions emitted:
- AE-SG-001 | Type: scenario_gap | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Low | Evidence: Stage 1 added stale vocabulary scenario because the artifact is a taxonomy rename.
- AE-CG-001 | Type: checklist_gap | Domain: accessibility | Disposition: open | Confidence: 100 | Severity: Low | Evidence: Stage 1 added scannability/heading checks for non-UI accessibility.

Scenario AE-1 - A new reader can distinguish the five roles from headings and names.
- Check AE-1.1: Role headings are clear.
- Check AE-1.2: Manager/Leader names do not blur authority.
- Check AE-1.3: Names align with industry/common agent expectations or explain deviations.

Scenario AE-2 - Vocabulary matches canonical evaluation/delegation terms.
- Check AE-2.1: Perspective names are canonical and consistent.
- Check AE-2.2: Retired v0.4 stance vocabulary is absent from canonical live docs.

Scenario AE-3 - Docs are scannable and accessible as operator references.
- Check AE-3.1: Each doc has consistent sections.
- Check AE-3.2: Status contracts are easy to find.
- Check AE-3.3: No placeholder/TBD/filler patterns.

Scenario AE-4 (adversarial) - A skimming reader leaves with the wrong model.
- Check AE-4.1: First-page/canonical docs do not teach the old PI dual-stance model.
- Check AE-4.2: Evaluator docs do not present obsolete perspective names.

Coverage declarations: Accessibility applies as scannable headings and consistent status placement; i18n has no user-facing strings beyond role terminology, so not-applicable: no locale/date/number behavior introduced.

## Stage 2 Findings

Scenario AE-1 results:
- AE-1.1: Yes. Evidence: each role file uses a clear H1 (`manager.md:8`, `leader.md:8`, `executor.md:8`, `evaluator.md:8`, `assistant.md:8`).
- AE-1.2: Partial. Evidence: `manager.md:8-10` calls manager the "Session Chief"; `leader.md:8-12` calls leader "Principal Investigator / Project Manager." Both are leadership-coded and could be confused without reading full scope.
- AE-1.3: Partial. Evidence: "Leader" is explained as PI/PM in `leader.md:8-12`, but common industry usage often maps "leader" to manager; the docs rely on explanation rather than the name carrying the meaning.

Scenario AE-2 results:
- AE-2.1: No. Evidence: `evaluator.md:12` and `templates/evaluator.md:8` list `architecture` and `user`; `evaluation/SKILL.md:87-94` uses Structure and Usage.
- AE-2.2: No. Evidence: `.claude/CLAUDE.md:15` still says "PI agents (innovative + best stances)"; `packages/cli/src/specs/ideation/spec.json:29-44` still contains innovative/best role entries.

Scenario AE-3 results:
- AE-3.1: Yes. Evidence: all role docs share "Before You Start", "Lifecycle", "Status Contract", "Red Flags / Anti-Patterns", and "Quality Expectations" sections.
- AE-3.2: Yes. Evidence: each spawned role has an explicit "Status Contract" section (`leader.md:104`, `executor.md:92`, `evaluator.md:91`, `assistant.md:87`).
- AE-3.3: Yes. Evidence: `rg -n 'TBD|TODO|\?\?\?' .gobbi/projects/gobbi/agents` returned no placeholder hits.

Scenario AE-4 results:
- AE-4.1: No. Evidence: `.claude/CLAUDE.md:15` is canonical first-load guidance and still teaches dual PI stances.
- AE-4.2: No. Evidence: evaluator role/template perspective lists include noncanonical `architecture`/`user`.

Typed findings:
- A-001 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High | Evidence: `.claude/CLAUDE.md:15` retains "PI agents (innovative + best stances)" while the v0.5.0 taxonomy says single Leader per dispatch. FP-check: canonical source-of-truth doc, not a minor wording issue.
- A-002 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: `evaluator.md:12` and `templates/evaluator.md:8` use `architecture`/`user` where canonical evaluation uses Structure/Usage (`evaluation/SKILL.md:87-94`). FP-check: exact term drift.
- A-003 | Type: assumption_risk | Domain: process | Disposition: open | Confidence: 50 | Severity: Medium | Evidence: role naming overload: `manager.md:8-10` and `leader.md:8-12` both use leadership-coded labels. FP-check: confidence capped because naming confusion is reader-dependent.

Per-perspective verdict: REVISE. A-001 is High with confidence 100.

## Low-confidence appendix

- LC-A-001 | Type: assumption_risk | Domain: i18n | Disposition: open | Confidence: 25 | Severity: Low | Evidence: "chief" and "leader" may translate poorly as distinct operational roles, but no localization scope exists in the artifact.
