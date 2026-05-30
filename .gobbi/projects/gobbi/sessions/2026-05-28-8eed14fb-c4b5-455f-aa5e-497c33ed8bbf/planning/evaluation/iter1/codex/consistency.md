# Consistency — Planning iter1 Evaluation (Codex)

## Artifact Summary
The artifact is a Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it maps an Ideation artifact to seven tasks and cross-task acceptance criteria. Why: it should preserve the locked Idea decisions and avoid drift across task docs, mode docs, SKILL.md, JSON templates, and backlogs. How: it uses `traces-to:` anchors, dependencies, out-of-scope files, and success criteria to keep the plan synchronized. Scope Contract source: Ideation sections 2 and 7. Downstream consumers are executors, Wrap-up, and future evaluators.

## Memory reads
- Required skills and rules listed in `project.md`.
- Planning draft and Ideation artifact listed in `project.md`.
- `gobbi/SKILL.md` skill map.
- Filesystem checks for mode-doc placeholders, `.claude` symlinks, absent `plugins/`, and absent `claude` skill.

## Locked Frame (Stage 1)
Scenario 1: Every `traces-to:` reference points to a real Ideation section.
- Check: T1 anchors exist in Idea sections 3.1-3.6, 6.3, 8, and 7.3.
- Check: T2 anchors exist in Idea sections 4.1-4.4 and 7.3.
- Check: T4/T5 anchors exist in Idea sections 5, 6.7, and 7.3.
- Check: T3 anchors exist in Idea sections 6.1-6.7 and 7.3.
- Check: T6/T7 anchors exist in Idea sections 2, 5, 7.3, 8, and 9.

Scenario 2: Plan statements about existing files match the current worktree.
- Check: chat-mode.md and auto-mode.md placeholders exist in the worktree.
- Check: `.claude/skills/orchestration/{chat,auto}-mode.md` are symlinks.
- Check: no main-tree absence false positive is emitted.

Scenario 3: Plan references to skills match the repo-local skill inventory.
- Check: a skill named in `required-skills` exists or is explicitly marked as a non-skill reference.
- Check: cross-reference paths are not dangling.

Scenario 4 (adversarial): A stale cross-artifact claim survives in a risk note and misdirects Execution.
- Check: old `plugins/` mirror claims are not treated as current mirror obligations.
- Check: project-memory facts are reconciled against the current prompt and filesystem state.

Coverage matrix declarations:
- Privacy/data retention: D-A and D-B are consistent with session-local task-record handling.
- Licensing/IP: not applicable.
- Memorization staging shape/naming: T7 slug is consistent across task and acceptance check.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes: all task `traces-to:` anchors map to visible Idea headings or named rows. The Idea heading scan confirms sections 3.1-3.6, 4.1-4.4, 5, 6.1-6.7, 7.3, 8.2/8.3, and 9 exist.

Scenario 2 result:
- Yes: local checks confirm worktree placeholders and symlinks exist: `chat_symlink=0`, `auto_symlink=0`, `chat_file=0`, `auto_file=0`.

Scenario 3 result:
- No: the Plan requires and cross-references a `claude` skill that the repo's own Gobbi skill map marks absent.

Scenario 4 result:
- No: the Plan includes a `plugins/` mirror note that conflicts with the evaluation brief's explicit false-positive prevention annotation and with local filesystem state.

Findings:

### codex-consistency-001
- Type: design_flaw
- Domain: docs-sync
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:540` lists `.claude/skills/claude/SKILL.md`; `draft-iter1.md:142`, `199`, `249`, `292`, and `356` require `claude`. `gobbi/SKILL.md:187` says the `claude` skill is absent and should not be relied on. Local filesystem checks also found no such skill path.
- Disposition: open

### codex-consistency-002
- Type: design_flaw
- Domain: docs-sync
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:518` treats `plugins/gobbi/skills/orchestration/{chat,auto}-mode.md` as an active mirror concern. The evaluator brief says `plugins/` was deleted in PR #264 and no plugin-mirror task should be required. Local checks found `main_plugins_dir=1` and `worktree_plugins_dir=1`.
- Disposition: open

VERDICT: REVISE

## Low-confidence appendix
None.
