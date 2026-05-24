## Stage 0 — Artifact Summary + Memory reads
Artifact: Ideation iter3 scope-contract/design draft for feature `session-foundations-bundle-b`.
Phase: Ideation.
Artifact type: scope-contract plus directional design draft.
What: iter3 makes three surgical fixes to the iter2 draft: valid branch prefix `chore/session-{date}-{ssid-short}`, official `PostToolUseFailure` verbatim support, and `.gobbi/project.json` dormant-precondition disclosure plus backlog.
Why: iter2 closed FAIL/REVISE because the row 5.5 branch name used invalid `session/`, the official hook claim lacked preserved quotes, and the resolver's preferred project.json read was not flagged as dormant.
How: the draft propagates the corrected branch form through D-1, scenarios, checklist, validation, and decisions; adds two `PostToolUseFailure` quotes; and annotates D-3-3-resolver step (i) with a present-state fallback/backlog.
Scope Contract: `draft-iter3.md` frontmatter and `## Scope Contract`, especially lines 9-24 and 39-89.
W/W/H gate: PASS. The What, Why, and How are explicit and verifiable.
Phase gate: PASS. The artifact is an Ideation design draft.
Memory reads:
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/gobbi/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.agents/skills/orchestration/workflow/evaluation.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- all project mistakes under `.gobbi/projects/gobbi/mistakes/`
- `ideation/rawdata/draft-iter3.md` in full, 553 lines
- `ideation/rawdata/draft-iter2.md` for diff comparison
- all prior evaluation files under `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`
- all prior evaluation files under `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`
- all prior evaluation files under `iter2/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`
- all prior evaluation files under `iter2/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`
- `.claude/skills/git/conventions.md` in full
- `ideation/staging/references/claude-code-posttooluse-hook-schema.md`
- `ideation/staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md`
- independent current fetch of `https://code.claude.com/docs/en/hooks`
- command evidence: branch regex test, `grep -n "session/"`, project.json `ls`, and iter2/iter3 diff.

## Locked Frame (Stage 1)
Scenario P1 (adversarial): Fix A actually makes Configuration row 5.5 branch creation convention-compliant.
- Check P1.1: `chore/session-2026-05-23-1b26cf20` passes `git/conventions.md` regex.
- Check P1.2: `chore` is in the allowed type alternation.
- Check P1.3: `session-2026-05-23-1b26cf20` matches the slug regex and length rule.
- Check P1.4: residual `session/` occurrences are audit/provenance text, not active branch statements.
Scenario P2: Fix B grounds `PostToolUseFailure` with official evidence.
- Check P2.1: the two required quotes appear in the draft at T3-E-5, D-3-3, and T3-I-T3.c.
- Check P2.2: the staged reference contains equivalent table rows.
- Check P2.3: the current official page still supports `PostToolUseFailure` and command hooks.
- Check P2.4: any non-load-bearing doc-count discrepancy is recorded.
Scenario P3: Fix C makes the resolver precondition honest without blocking the active path.
- Check P3.1: `.gobbi/project.json` is absent.
- Check P3.2: D-3-3-resolver says fallback step (ii) is currently the only working path.
- Check P3.3: the backlog exists and describes two pickup paths.
Scenario P4: Scope discipline holds for the final iteration.
- Check P4.1: the diff maps to Fix A, Fix B, Fix C, or iter metadata/header updates.
- Check P4.2: no new design decision beyond those three fixes is smuggled in.
- Check P4.3: no prior high-severity Project finding remains open.

## Per-scenario per-check results
P1.1: YES. Shell regex test returned `shape=PASS` for `chore/session-2026-05-23-1b26cf20`.
P1.2: YES. `git/conventions.md:22` includes `chore` in `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/...`.
P1.3: YES. The slug `session-2026-05-23-1b26cf20` is 27 characters and matches `[a-z0-9]+(-[a-z0-9]+)*`.
P1.4: YES. Filtered `grep -n "session/" draft-iter3.md` leaves only line 553, an audit sentence about whole-file grep, not an active design statement.
P2.1: YES. Exact quote strings appear at `draft-iter3.md:205`, `:289`, `:366`, `:530`, and `:531`.
P2.2: YES with formatting caveat. The staged reference has equivalent table rows at lines 33 and 39, including backticks/padding from the table format.
P2.3: YES. Independent fetch shows `PostToolUseFailure` in the official hook lifecycle table, command hook handler support, and exit-code behavior showing stderr for failed tool calls.
P2.4: PARTIAL. The draft/reference claim 31 hook events, but the staged reference enumerates 29 names, and the current official page also shows 29 lifecycle event names in the visible table/TOC. This is not load-bearing for `PostToolUseFailure` support.
P3.1: YES. `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returned `No such file or directory`.
P3.2: YES. `draft-iter3.md:375-379` marks step (i) dormant and step (ii) as fallback/currently working.
P3.3: YES. `dot-gobbi-project-json-bootstrap.md` exists and lines 31-36 describe in-Execution write vs future deferral.
P4.1: YES. The first 200 diff lines show iter metadata, branch-prefix replacements, PostToolUseFailure quote additions, and project-json backlog/precondition additions.
P4.2: YES. No new Project-level design decision beyond Fixes A-C is present.
P4.3: YES. `COD-PROJ-001`, `COD-PROJ-002`, Claude P1/C1, Claude P2/O1, and Claude P3 are addressed by iter3.

## Typed findings
### COD-PROJ-001 — Branch naming regression addressed
- type: design_flaw
- domain: regression
- disposition: addressed
- confidence: 100
- severity: High
- surfaced-by: codex
- inherited-from: iter2/codex/project.md COD-PROJ-001; iter2/claude/project.md P1
- evidence: `draft-iter3.md:308-313` uses `chore/session-{date}-{ssid-short}`; regex test returned shape, slug, type, and length PASS; `git/conventions.md:22` includes `chore`.

### COD-PROJ-002 — No-issue bootstrap scenario addressed
- type: scenario_gap
- domain: process
- disposition: addressed
- confidence: 100
- severity: Medium
- surfaced-by: codex
- inherited-from: iter2/codex/project.md COD-PROJ-002
- evidence: `draft-iter3.md:227` covers non-feature sessions with the same valid `chore/session-{date}-{ssid-short}` form, avoiding issue/task slug dependency.

### COD-PROJ-ITER3-001 — Hook event count support prose is inaccurate
- type: general
- domain: docs-sync
- disposition: open
- confidence: 100
- severity: Low
- surfaced-by: codex
- inherited-from: none
- evidence: `draft-iter3.md:205`, `:366`, and `:533` say the page lists/enumerates 31 hook events. The staged reference enumerates 29 events at lines 45-73 and `awk '/^[[:space:]]*[0-9]+\\. `/' ...` returned 29. Independent current fetch likewise shows 29 visible lifecycle event names. The `PostToolUseFailure` entry and exit-code behavior remain verified, so this is a supporting-prose defect, not a Project blocker.

## Low-confidence appendix
No low-confidence Project findings above 25 were suppressed.
Residual note: the official docs page may have had a different count at the leader's fetch time, but the staged reference's own enumeration currently contradicts the prose claim.

Verdict: PASS
