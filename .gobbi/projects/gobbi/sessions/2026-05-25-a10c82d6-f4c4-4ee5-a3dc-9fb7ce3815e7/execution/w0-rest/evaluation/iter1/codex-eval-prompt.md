# Codex adversarial evaluation — memory-redesign Wave 0-rest (standards authoring)

You are an adversarial evaluator. The agent that produced this work CANNOT evaluate it — that is your job. Arrive with NO trust in the producer's claims. DO verify against the source-of-record yourself; DO NOT rubber-stamp.

## Target

The Wave 0-rest changeset = `git diff f425c45..HEAD` in this worktree. 6 commits, 24 doc files (memory-map.md, memorization/SKILL.md, 17 templates, wrap-up/SKILL.md, orchestration/SKILL.md, gobbi/evaluation/mistake SKILL.md). View it:
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6
git --no-pager log --oneline f425c45..HEAD
git --no-pager diff f425c45..HEAD -- .gobbi/projects/gobbi/skills/
```

## Source of record (the contract the changeset must satisfy)

- Design-of-record §7 propagation table (per-target edits #3,#5,#6,#7,#8,#10,#11,#12), §2 (13 type specs), §3 (canonical session tree / per-task Execution quartet / per-perspective eval filenames), §5 incl §5.3 staging-field stripping:
  `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md`
- Locked plan W0 task YAMLs (W0-T1b,T3,T4,T5,T6,T7,T8,T10) + verifies lines:
  `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/planning/rawdata/draft-iter1.md`
- Naming + frontmatter standard being propagated (frozen — must NOT be edited by this wave):
  `.gobbi/projects/gobbi/skills/memorization/rules.md`

## What to check (adversarially)

1. **Design fidelity (project perspective).** Does each edited file actually implement its design §7 target, not just contain the grep-gate keyword? E.g. memory-map.md must have 13 per-type-spec home pointers, a session.json.lock row, archive typed-subdir-wins, plans→maintainer-only, FLAG-1 note — verify the SUBSTANCE, not just that the word "maintainer" appears once.
2. **17-template alignment (structure/consistency).** Each `skills/memorization/templates/*.md` must carry base+extension frontmatter per §5 and temporal-split naming per §2. Spot-check several for drift, wrong type value, missing scope rule. archive.md must have NO static `type: archive` literal. templates/rules.md (the template, NOT the frozen sibling) must reword no-frontmatter→"stub-redirect TARGET docs only". feature-readme.md must add value_proposition + drop sprint keys.
3. **Re-touch guard integrity.** Confirm NONE of these were modified in f425c45..HEAD: `skills/principles/SKILL.md` P13 body/Iron-Law-Index, `.claude/CLAUDE.md`, `skills/memorization/rules.md` sibling body, the 5 delegation files. (`git diff --name-only f425c45..HEAD` must not list them.) Confirm `grep -c "## Principle 13" skills/principles/SKILL.md` == 1 (no duplicate).
4. **The state.json question (orchestration/SKILL.md, commit 7dd02b1).** The executor did NOT retire the active `state.json` references, arguing state.json is the LIVE workflow state-machine (distinct from session.json, initialized at Step 1 row 5.5 from state.template.json, no replacement specified in the design). Judge: is keeping the active state.json references coherent and correct, OR did the design §7 #7 genuinely intend to retire them (and if so, where do the phase/state/iter fields move)? Flag as a finding either way with your reasoning.
5. **Symlink integrity.** `for f in $(find .claude/skills/memorization -maxdepth 1 -type l); do readlink -e "$f" >/dev/null || echo BROKEN $f; done` — must be silent.
6. **No scope creep / no double-edit.** Only canonical `skills/...` files touched (not `.claude/skills/...` symlink targets directly).

## Output (REQUIRED)

Write your findings to (path relative to this worktree's `.gobbi/projects/gobbi`):
`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w0-rest/evaluation/iter1/codex/findings.md`

Use this structure. Each finding: `[SEVERITY Critical|High|Medium|Low | TYPE scenario_gap|checklist_gap|design_flaw|assumption_risk|general | CONFIDENCE 0-100] <id> — <statement> — <evidence: file:line or command output>`.

End the file with a single line:
`VERDICT: PASS` (no Critical/High open, changeset faithfully implements design §7) or `VERDICT: REVISE` (≥1 actionable Critical/High) or `VERDICT: FAIL` (fundamentally broken).
