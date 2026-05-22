---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: iter2-evaluator-driven-remediation
rounds: [4]
locks: ["Q-Survivor", "Q-StageE"]
---

# iter2 Evaluator-Driven Remediation: Survivor Set + Stage E Split

## Discussion Summary

iter1 Claude evaluation returned REVISE with 4 High findings. Manager ran a 2-question AskUserQuestion round (Round 4) to resolve two scope/design decisions before iter2.

**Q-Survivor — Survivor-set expansion vs. citation fix-up (Round 4)**

F-P-01 identified that `.claude/CLAUDE.md` lines 61-62 cite `design/v050-overview.md` and `design/v050-cli.md` — both of which are in the `design/` placeholder dir. F-R-02 identified that the three promoted mistake files would be deleted. The evaluator suggested either (a) expanding the survivor set to include `design/` and `mistakes/` or (b) fixing the citations and accepting the deletion.

User chose: don't expand the survivor set — fix the citations instead. Q-A stays as locked (`skills/`+`agents/`+`rules/` only). iter2's Stage B adds a step to surgically remove the two `v050-{overview,cli}.md` table rows from `.claude/CLAUDE.md`. The three promoted mistake files are accepted as deleted — trade-off intentional. The staged backlog stays session-scoped.

**Q-StageE — Stage E single vs. split (Round 4)**

F-S-01/F-U-01 identified that the bare-UUID delete-LAST instruction lacked a concrete gate, inviting the `executor-rationalized-failing-verification-gate` anti-pattern. The evaluator recommended splitting Stage E into E.1 (in-commit) + E.2 (post-commit terminal) with an explicit gate.

User chose: split Stage E — recommended option. E.1 deletes the 52 legacy session dirs (including `2026-05-21-c676684d-...`) in the sweep commit. E.2 deletes the CLI bare-UUID dir `6637e759-...` only after the sweep commit exists in git AND has been recorded in `session.json`. Concrete, testable gate.

(Note: this session.json SHA gate was later found to be self-referential by Codex in iter2, leading to Q-Gate-Redesign in Round 5.)

## Locked Decisions

| Lock | Decision |
|------|----------|
| Q-Survivor | Don't expand survivor set; surgical citation fix in `CLAUDE.md` instead; accept mistake-file deletion |
| Q-StageE | Split Stage E into E.1 (in-commit legacy delete) + E.2 (post-commit bare-UUID delete with gate) |

## Related

- `ideation/staging/decisions/claude-md-dangling-links-post-sweep.md` (F-P-01, addressed by Q-Survivor)
- `ideation/staging/decisions/mistake-files-in-delete-set.md` (F-R-02, addressed by Q-Survivor trade-off)
- `ideation/staging/decisions/sha-gate-self-referential.md` (F-CX-OV-01, discovered after Q-StageE)
- `ideation/rawdata/discussion-log.md` § Round 4
