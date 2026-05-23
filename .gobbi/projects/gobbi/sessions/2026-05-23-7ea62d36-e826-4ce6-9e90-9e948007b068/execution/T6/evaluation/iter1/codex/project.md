# Project Perspective - Execution Evaluation T6

Verdict: REVISE

## Artifact Summary (Stage 0)

Task 06 implements commit `bcfaab2` on branch `feat/266-orch-workflow-improvements`. The change-set fills `.gobbi/projects/gobbi/skills/codex/SKILL.md` and adds the `codex` row to `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`. The task exists to turn the previously stubbed codex skill into a content-complete operational guide for Codex invocation from Claude Code, while preserving the locked 8-H2 contract and wiring discovery through the Gobbi Skill Map. The approach is documentation-only: preserve the section skeleton, expand concrete procedures, cite the sandbox/CWD mistake, document dual-system evaluation, and keep the commit diff scoped to exactly two files.

Memory reads:
- `AGENTS.md`
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/execution/evaluation.md`
- `.agents/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/artifacts/plan.md`
- `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`
- `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/references/five-type-vocabulary.md`

W/W/H gate: clear. Phase tag matches execution. No Stage 0 halt.

## Locked Frame (Stage 1)

Scenario 1: The change-set implements the whole Task 06 scope.
- Check: `codex/SKILL.md` has exactly 8 H2 headings.
- Check: H2 names match the locked spec verbatim and in order.
- Check: frontmatter contains `name`, `description`, `allowed-tools`, and no `when-to-load`.
- Check: content length is within the required 350-500 line band.
- Check: `gobbi/SKILL.md` gets the `codex` row in Skill Map -> Cross-cutting skills.

Scenario 2: The implementation stays inside commit scope.
- Check: `git diff --name-only HEAD~1..HEAD` returns exactly the two expected worktree files.
- Check: no unrelated source, session, or generated files are committed.

Scenario 3: The task-specific content contract is traceable to locked inputs.
- Check: the skill cites the relevant empirical witnesses I1/I2/I3/I4/I5/I13/I14 and E1/E2/E3/E4/E5 from `idea.md`.
- Check: the skill carries the assistant-wrapper decision requirements.
- Check: the skill carries the sandbox/CWD mistake citation and corrected approach.

Scenario 4 (adversarial): A mostly complete skill silently drops a locked checklist item.
- Check: every `traces-to` item in Task 06 has visible coverage, not just adjacent prose.
- Check: no user-specified gate passes mechanically while losing the underlying operational requirement.

Coverage declarations: privacy, licensing, supply-chain, and error budget are not applicable to this documentation-only change. Cost/budget applies and is checked in the Performance perspective.

## Stage 2 Results

Scenario 1: PASS. `grep -c '^## ' .gobbi/projects/gobbi/skills/codex/SKILL.md` returned `8`. `grep -n '^## '` returned the locked headings at lines 13, 26, 95, 126, 187, 241, 316, and 350. `wc -l` returned `386`. Frontmatter lines 2-4 contain `name`, `description`, and `allowed-tools`; `grep -n '^when-to-load:'` returned no matches. The Skill Map row appears in the Cross-cutting skills table.

Scenario 2: PASS. `git diff --name-only HEAD~1..HEAD` returned exactly:

```text
.gobbi/projects/gobbi/skills/codex/SKILL.md
.gobbi/projects/gobbi/skills/gobbi/SKILL.md
```

Scenario 3: FAIL. Task 06 line 350 requires inline empirical witness citation, and lines 362-364 name the required inputs. The implemented skill has general prose such as "empirical witness" at lines 54 and 300, but `rg '\bI[0-9]+\b|\bE[0-9]+\b' .gobbi/projects/gobbi/skills/codex/SKILL.md` returned no witness labels. It also does not spell out several locked witness facts, including E1 thread/resume behavior and I14 `.agents/skills` symlink count.

Scenario 4: FAIL. The task's trace list requires checklist 15, including a missing-symlink anti-pattern. The Anti-patterns section has 8 entries, but none mention `.agents/skills/codex`, `.claude/skills/codex/SKILL.md`, or symlink absence.

## Findings

### T6-PROJ-001 - Empirical witness trace is not inline as required

Type: checklist_gap
Domain: docs-sync
Confidence: 75
Severity: High
Disposition: open

Evidence: `plan.md:350` says "Cite empirical witnesses I1-I14 + E1-E5 inline"; `plan.md:362-364` names `idea.md` insights as required inputs. `idea.md:143-164` defines the witness labels and facts. The implemented `codex/SKILL.md` has no `I1`/`E1`-style labels and omits at least E1 and I14 as explicit cited facts.

Why it matters: The codex skill is supposed to be the durable source future agents load instead of reconstructing from session memory. Without witness IDs and facts, future revisions cannot tell which claims are empirical, which are inferred, and which are merely recommended practice.

FP-check: Not a false positive. The skill contains several empirical facts, but the task required inline citation to the locked witness set, not only prose-level coverage.

### T6-PROJ-002 - Missing-symlink anti-pattern from locked checklist is absent

Type: checklist_gap
Domain: docs-sync
Confidence: 75
Severity: Medium
Disposition: open

Evidence: `plan.md:355` traces Task 06 to checklist 15: "Anti-patterns section >=8 entries including subagent-cannot-spawn-plugin-agent + missing-symlink entries." `idea.md:233-237` names the adversarial missing `.agents/skills/codex` scenario. `rg 'symlink|\.agents/skills/codex|\.claude/skills/codex' codex/SKILL.md` returned no matches, and the Anti-patterns section at `codex/SKILL.md:350-366` contains no symlink entry.

Why it matters: The file meets the numeric "8 entries" gate but misses one of the specifically required entries. That leaves a known dogfood failure mode undocumented.

FP-check: The commit-scope gate still passes. This finding is about the skill content, not about adding symlink files in this commit.

## Low-confidence Appendix

No suppressed project findings.
