# Structure Perspective

Verdict: PASS

## Artifact Summary + Memory reads

Stage 0 summary: Preparation iter3 stages a `codex` skill skeleton whose structure, not final content, is the deliverable. The locked contract is the source-of-truth path plus frontmatter and the exact 8 H2 sections from Idea Design A. The artifact is evaluable: What = staged codex skill stub and readiness draft; Why = close iter2 structural/frontmatter regressions before Planning; How = source-verified H2 and frontmatter restamp with an audit trail.

Memory reads:
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/preparation/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter3.md`
- Prior iter: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/evaluation/iter2/codex/structure.md`
- Convention audit reads: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/*/SKILL.md`

## Locked Frame (Stage 1)

Scenario 1: Staged skill file uses the expected project-skill frontmatter.
- Check: YAML frontmatter exists.
- Check: frontmatter contains `name`, `description`, `allowed-tools`.
- Check: frontmatter omits `when-to-load`.

Scenario 2: H2 structure is mechanically compatible with Planning and Execution.
- Check: the stub has exactly 8 H2 sections.
- Check: the 8 H2 names and order match Design A lines 15-23.
- Check: `Constraints` is not an H2 in this stub.

Scenario 3 (adversarial): Existing project-skill conventions conflict with the body-block choice for `Constraints`.
- Check: sampled existing project skills use `## Constraints`.
- Check: iter3's body-block choice is treated as a Planning DISCUSSION ambiguity, not as a hidden ninth H2.

Scenario 4: The artifact is a stub by contract, not an accidental skeleton.
- Check: the comments explicitly mark Execution-fill areas and cite anchors.
- Check: no `TODO`, `TBD`, or `<...>` placeholders are present.

Coverage notes: dependency supply chain is not applicable; no new dependency is introduced. Observability is not applicable to this markdown-only Preparation artifact.

## Per-scenario per-check results

Scenario 1:
- Yes. Frontmatter read returned exactly `name`, `description`, `allowed-tools`.
- Yes. `rg -n '^name:|^description:|^allowed-tools:|^when-to-load:' .../SKILL.md` returned only lines 2-4 for `name`, `description`, and `allowed-tools`.
- Yes. Project convention audit returned `name=16`, `description=16`, `allowed-tools=16`, `when-to-load=0` across existing project skills.

Scenario 2:
- Yes. `grep -c '^## ' .../SKILL.md` returned `8`.
- Yes. The H2 scan matched the locked order from `item-a-codex-skill-structure.md:15-23`.
- Yes. `rg -n '^## Constraints|^\*\*Constraints\*\*' .../SKILL.md` returned only line 132: `**Constraints** ... NOT an H2 section`.

Scenario 3:
- Yes. `rg -n '^## Constraints$' .gobbi/projects/gobbi/skills/*/SKILL.md | head -3` returned examples in `execution`, `wrap-up`, and `research`.
- Yes. This is recorded below as a Low deferred Planning DISCUSSION item. It does not change the locked 8-H2 Preparation compliance result.

Scenario 4:
- Yes. The stub labels its comments as `Execution: fill`, and the banner states Preparation only fixes the skeleton while Execution fills content.
- Yes. No mechanical placeholder evidence was found in the verified checks; the explicit Execution-fill comments are intentional for this Preparation stub.

## Typed findings

Finding: ITER2-COD-STRUCT-FRONTMATTER
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Structure found the stub had `when-to-load` and omitted `allowed-tools`. Iter3 frontmatter now has `name`, `description`, `allowed-tools`; the convention audit confirmed 16/16 existing project skills use `allowed-tools` and 0/16 use `when-to-load`.
- FP-check: tool-verified; not style preference because the project convention is empirical.

Finding: ITER2-COD-STRUCT-H2
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Structure found H2 ordinals 7 and 8 wrong. Iter3 H2 scan now matches Design A lines 15-23 exactly.
- FP-check: tool-verified; not out-of-scope.

Finding: ITER3-COD-STRUCT-CONSTRAINTS-BODY-BLOCK
- Type: `general`
- Domain: `docs-sync`
- Disposition: `deferred`
- Confidence: 100
- Severity: Low
- Evidence: iter3 intentionally keeps `Constraints` as a body block at line 132 so H2 count stays exactly 8, but sampled existing project skills `execution`, `wrap-up`, and `research` use `## Constraints`. This is a structure-convention ambiguity for Planning DISCUSSION, not a Preparation blocker because Design A locks exactly eight H2 sections and does not include `Constraints`.
- FP-check: not a false positive; severity Low because changing it now would violate the locked section contract.

Structure verdict: PASS. The only open structural note is Low and deferred to Planning DISCUSSION.

## Low-confidence appendix

None.
