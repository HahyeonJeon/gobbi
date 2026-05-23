# Project Perspective

## Artifact Summary + Memory reads

What: iter2 re-evaluates the surgically restamped `codex` skill stub and `draft-iter2.md` after iter1 REVISE. Why: Preparation must produce a valid generated skill stub before Planning can decompose Item A. How: close-read the stub, draft, locked Ideation Design A, iter1 audit copy, prior iter Codex findings, project skill frontmatter baseline, and project mistakes/rules. Scope contract: Item A Design A locks the `codex` skill source-of-truth path and exactly 8 H2 sections.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/skill-stub-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md`
- Prior iter files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/evaluation/iter1/codex/`
- Project mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `manager-rm-rf-without-investigating-tracked-files.md`
- Project rule: `rules/stub-redirect-format.md`
- Project skill baseline: 16 existing `SKILL.md` files under `.gobbi/projects/gobbi/skills/`
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: The generated `codex` stub must stay inside locked Idea Design A.
- Check: it has exactly 8 H2 sections.
- Check: each H2 name and ordinal position matches Design A lines 15-23.
- Check: content not yet written by Execution does not change the Preparation skeleton contract.

Scenario 2: Preparation must not adopt manager-side brief drift as if it were the locked design.
- Check: the draft distinguishes "brief said" from "Design A locks".
- Check: any wrong brief instruction is rejected in favor of the locked artifact.

Scenario 3 (adversarial): if Preparation PASS triggers promotion before Planning, the promoted skill must be a valid planning target.
- Check: frontmatter follows existing project skill convention.
- Check: the missing skill is staged only under session memory before PASS.

Coverage notes: privacy, licensing, and dependency-supply-chain are not applicable to this local markdown stub. Cost coverage is applicable because Design A locks a cost/budget H2.

## Per-scenario per-check results

Scenario 1:
- PASS: H2 count is 8 (`grep -c '^## '` returned `8`).
- FAIL: H2 identity/order does not match the locked list. Actual H2s are:
  1. `When to load`
  2. `Invocation patterns`
  3. `Why subagents must use `codex exec``
  4. `Sandbox + CWD discipline`
  5. `Hang + timeout discipline`
  6. `Use cases`
  7. `Anti-patterns`
  8. `Constraints`
- FAIL: locked #7 is `Cost + sandbox budget awareness`; actual #7 is `Anti-patterns`. Locked #8 is `Anti-patterns`; actual #8 is `Constraints`. `Cost + sandbox budget awareness` is missing as an H2, and `Constraints` is an extra H2 not in Design A.

Scenario 2:
- FAIL: `draft-iter2.md` lines 16-18 and 94/106 follow the wrong iter2 brief: they remove `Cost + sandbox budget awareness` as an H2 and use `when-to-load` while claiming compliance with Design A and frontmatter convention.
- PASS: Open Concern #4 is reclassified from Planning to Preparation in draft lines 19, 122, and 130.
- FAIL: the reclassification says "resolved", but the actual Preparation fix is still noncompliant with Design A.

Scenario 3:
- PASS: `.gobbi/projects/gobbi/skills/codex` does not exist before PASS (`test -e` returned exit 1), so no premature project-memory write was found.
- FAIL: frontmatter has `name`, `description`, and `when-to-load`, but no `allowed-tools`. All 16 existing project skills have `allowed-tools`; none have `when-to-load`.

## Typed findings

### COD-PREP2-PROJ-001

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Design A lines 15-23 lock H2 #7 as `Cost + sandbox budget awareness` and H2 #8 as `Anti-patterns`. The iter2 stub has `## Anti-patterns` at line 111 and `## Constraints` at line 126, with no `## Cost + sandbox budget awareness`.
- FP-check: not a preference for section naming. The user explicitly instructed every H2 mismatch against the locked list to be High.

### COD-PREP2-PROJ-002

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: the iter2 draft lines 16-18 state that removing the Cost H2 and adding `when-to-load`/removing `allowed-tools` are fixes. The locked design and empirical frontmatter baseline contradict both claims.
- FP-check: not attributable to Execution content being absent; this is the Preparation skeleton and metadata.

### Inherited finding dispositions

- `COD-PREP-PROJ-001`: superseded by `COD-PREP2-PROJ-001` and `COD-PREP2-PROJ-002`. Count changed from 10 to 8, but locked-skeleton noncompliance remains.
- `COD-PREP-PROJ-002`: addressed on classification only. Concern #4 moved out of Planning, but the claimed fix remains defective and is covered by `COD-PREP2-PROJ-001`.

## Verdict

REVISE. High-confidence High findings remain in the project contract: the generated stub no longer fails by count, but it still fails the locked Design A H2 list and project skill frontmatter convention.

## Low-confidence appendix

No low-confidence findings.
