# Usage Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. Execution-phase usability: can Execution fill the stub against the Idea checklist?
2. Planning-phase usability: can Planning decompose against this stub shape?
3. Loader/runtime usability: will the skill be loaded correctly by both Claude and Codex?

## Verification

- Idea checklist item 1 (idea.md:247): "`grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns 8". iter2 stub: passes arithmetically.
- Idea checklist item 15 (idea.md:261): "Add Anti-patterns section". iter2 stub: present.
- Idea acceptance idea.md:76: "cost subsection". iter2 stub: present as sub-bullet, not as H2 — depends on whether "subsection" means H2 vs sub-bullet (Idea draft-iter3:349 explicitly says H2 #7).

## Findings

### F-U-01 — Execution task targeting "Cost + sandbox budget awareness" has no H2 target
- Type: `scenario_gap`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Idea acceptance criteria reference a "cost subsection". If Planning decomposes Item A into sub-tasks per locked H2 (which is the natural decomposition pattern given Idea Design A's numbered 1-8 list), Execution will be missing a task target for section 7. Either Planning has to bake the fold-in into its task list (deviating from Idea), or Execution has to re-introduce the section (re-doing Preparation structural work).
- Why it matters: Principle 3 (build from the base up, one step at a time) — the structural base is misaligned with the decomposition the Idea anticipates. Planning gets a harder job; Execution gets ambiguity.
- Suggested direction: covered by F-S-01.

### F-U-02 — `allowed-tools:` removal risks loader/permission breakage
- Type: `assumption_risk`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 50
- Severity: Medium
- Evidence: 16/16 project skills use `allowed-tools:`; the standard Claude skill loader uses this field for tool-permission gating. Removing it may default the skill to "all tools" or "no tools" depending on loader behavior. iter2 brief mandated removal based on iter1 codex finding, but the loader contract was not re-verified.
- Why it matters: Principle 7 (no completion claims without fresh verification) — removing `allowed-tools:` without verifying loader behavior is an untested change to the skill-loader contract.
- Suggested direction: verify loader behavior with a stub `Skill()` permission test, OR re-instate `allowed-tools:` per F-S-03.

### F-U-03 — Stub-as-stub is otherwise usable for Planning decomposition
- Type: `general`
- Domain: `process`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: Each H2 has a detailed HTML comment listing concrete witnesses (I1-I13), anchor files, and content shape. Planning can decompose Item A into 8 fill-content sub-tasks once the H2 list is corrected.
- Why it matters: positive — the scaffolding work iter1/iter2 invested is reusable.

## Must-preserve

- Detailed scaffolding comments.
- 6 of 8 correctly-locked H2 sections (1-6).
- Idea checklist item 1's arithmetic grep gate.

## Verdict

REVISE — F-U-01 High Confidence 100 inherits the structure verdict; F-U-02 Medium Confidence 50 is below revise threshold on its own but corroborates F-S-03.
