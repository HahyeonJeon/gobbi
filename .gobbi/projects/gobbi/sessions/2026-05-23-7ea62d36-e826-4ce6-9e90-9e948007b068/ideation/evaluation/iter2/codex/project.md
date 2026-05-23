# Codex Evaluation Iter2 - Project

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, an Ideation idea draft for Bundle A: codex skill, memorization discipline, wrap-up compliance, naming enforcement, and two gobbi skill polish edits. What: a scoped implementation direction for seven locked items A-G. Why: prior session discipline failures lost evaluation findings and exposed codex path mistakes. How: documentation/skill changes plus validation commands and wrap-up detection. Scope Contract source: `draft-iter2.md` lines 49-105. Downstream consumers: Planning, Execution, Wrap-up, future Gobbi managers and subagents.

Memory reads:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.claude/skills/ideation/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/evaluation/iter1/codex/project.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter1.md`

Fresh verification:
- `for t in T1 T2 T3 T4 T5 T6 T7; do find .../execution/$t/evaluation -type f | wc -l; done` returned `T1 8`, `T2 13`, `T3 3`, `T4 2`, `T5 9`, `T6 2`, `T7 2`.
- `ls -la /playinganalytics/git/gobbi/.agents/skills/` shows directory symlinks into `../../.gobbi/projects/gobbi/skills/*`; `find .../.agents/skills -maxdepth 1 -type l | wc -l` returned `16`.

## Locked Frame (Stage 1)

Scenario P1: Prior-session witness is precise and scoped to the right pathology.
- Check: The T-by-T counts are stated accurately.
- Check: Memorization-gap loops are distinguished from eval-also-skipped loops.
- Check: The witness supports the proposed B/C/D changes without overstating evidence.

Scenario P2: Codex skill exposure matches the project surfaces.
- Check: Source of truth is `.gobbi/projects/gobbi/skills/codex/SKILL.md`.
- Check: Claude surface and Codex surface are both required.
- Check: The existing `.agents/skills` pattern is empirically checked before extending it.

Scenario P3 (adversarial): The draft does not solve a broader or different problem than the locked scope.
- Check: Deferred items remain explicitly out of scope.
- Check: Design sections map back to A-G.

## Per-scenario per-check results

P1: PASS. Draft lines 126-129 and 204-205 state T1/T2/T5 as full-evaluation memorization gaps and T3/T4/T6/T7 as partial-evaluation plus no-staging gaps. The live count command matches the line text exactly: 8/13/3/2/9/2/2.

P2: PASS with non-blocking precision note routed to Consistency. Draft lines 61, 95, 382-386, and 578 add the required `.agents/skills/codex` directory symlink. Live `ls -la .agents/skills/` confirms the pattern of directory symlinks into `.gobbi/projects/gobbi/skills/*`. However, the draft's repeated "17 existing entries" wording is inaccurate because the live count is 16 before adding codex; Consistency records that as a Medium docs-sync issue.

P3: PASS. Scope remains bounded to A-G, and deferred items are named at lines 69-81 and 106-113.

## Typed findings

### COD-PROJ-001 - Prior-session evaluation witness is overstated
- Type: `assumption_risk`
- Domain: `process`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: Iter2 lines 126-129 and 204-205 match the fresh count command: T1=8, T2=13, T3=3, T4=2, T5=9, T6=2, T7=2. The draft now separates T1/T2/T5 memorization gaps from T3/T4/T6/T7 eval-also-skipped gaps.
- Resolution status: RESOLVED.

### COD-PROJ-002 - Codex-facing `.agents/skills` exposure is missing from the new skill contract
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: Iter2 lines 61, 95, 382-386, and 578 require `.agents/skills/codex -> ../../.gobbi/projects/gobbi/skills/codex`. Live `ls -la .agents/skills/` confirms the symlink pattern the new codex symlink should follow.
- Resolution status: RESOLVED.

Counts: Critical 0 / High 0 / Medium 0 / Low 0 / Nit 0.

Verdict: PASS

## Low-confidence appendix

None.
