# Consistency Perspective - Task 06 iter1 Codex

## Artifact Summary (Stage 0)

The commit adds docs that must stay consistent with the Task 06 plan, LOCK #5, orchestration row 5.5, git/SKILL.md, git/conventions.md, and settings.default.json. The acceptance greps pass, but cross-document consistency is the main risk surface.

## Memory reads

Same Stage 0 register as `project.md`, with whole-file grep over the changed orchestration file and cross-grep into worktree `git/SKILL.md`, `git/conventions.md`, and `orchestration/templates/settings.default.json`.

## Locked Frame (Stage 1)

Scenario C1 - Plan and scope consistency.
- Check C1.a: Task 06 modifies only orchestration/SKILL.md.
- Check C1.b: direct-mode opt-out remains in orchestration, not git/SKILL.md.
- Check C1.c: smoke-test regex matches the branch convention.

Scenario C2 - Cross-link consistency.
- Check C2.a: every "see X for full definition" link points to a section that actually has the promised definition.
- Check C2.b: row 5.5 and the footnote use coherent setting terminology.

Scenario C3 (adversarial) - Whole-file grep catches stale or orphaned concepts outside the changed hunk.
- Check C3.a: new direct/worktree-pr vocabulary is synchronized with settings.default.json.
- Check C3.b: no duplicated direct-mode opt-out block exists in git/SKILL.md.

Coverage: docs-sync is the dominant concern; privacy/licensing/dependency concerns are not applicable.

## Results (Stage 2)

- C1.a: yes. Commit stat shows one file changed.
- C1.b: yes. The new opt-out block is in orchestration. Worktree git/SKILL.md contains only pre-existing direct-mode fallback references and no new direct-mode opt-out section.
- C1.c: yes. `chore/session-2026-05-24-1b26cf20` matches both the git/conventions.md branch-shape regex and the smoke-test regex. The slug `session-2026-05-24-1b26cf20` is 27 chars, satisfying the 3-50 length rule.
- C2.a: no. The new footnote says `git/SKILL.md` Core Principles has the full definition of `direct` vs `worktree-pr` modes and behavioral contracts, but that section defines worktree isolation, manager ownership, issues, subagent commits, and AI provenance. It does not define those mode keys or contracts.
- C2.b: no. Row 5.5 says `git.workflow.mode`, while the new footnote says `settings.git.workflow.mode`; the settings template defines no such key.
- C3.a: no. `settings.default.json` has no `direct`, `worktree-pr`, or git workflow mode entry.
- C3.b: yes. LOCK #5 is respected in the narrow sense: the opt-out documentation is not duplicated in git/SKILL.md.

## Findings

### COD-CONS-T06-001 - Cross-link promises mode definitions that git/SKILL.md does not contain

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: orchestration/SKILL.md line 116 says "For the full definition of `direct` vs `worktree-pr` modes and their behavioral contracts, see [`git/SKILL.md` § Core Principles]". Worktree git/SKILL.md Core Principles contains headings for every task gets its own worktree, manager git lifecycle ownership, every task starts from an issue, subagents commit/manager pushes, and AI provenance. `rg -n 'worktree-pr|settings.git.workflow.mode|git.workflow.mode' git/SKILL.md` returns no mode-definition hits; `direct mode` appears only in path-root fallback prose elsewhere.
- Why it matters: this is the exact cross-reference the new T06 footnote asks future readers to trust. It sends them to a section that cannot answer the promised question.
- FP check: not out-of-scope; the eval prompt specifically required checking this cross-link.

### COD-CONS-T06-002 - Documented workflow-mode key is out of sync with settings.default.json

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: new lines 109 and 116 use `settings.git.workflow.mode`, row 5.5 uses `git.workflow.mode`, and worktree `settings.default.json` git block has no workflow/mode key. Focused `rg` over the settings template returns no `direct`, `worktree-pr`, `git.workflow.mode`, or `settings.git.workflow.mode`.
- Why it matters: Task 06 is meant to document the opt-out path. The docs and settings schema disagree about whether the path exists.
- FP check: not merely pre-existing; the commit adds new user-facing references to the absent key.

## Verdict

REVISE

## Low-confidence appendix

None.
