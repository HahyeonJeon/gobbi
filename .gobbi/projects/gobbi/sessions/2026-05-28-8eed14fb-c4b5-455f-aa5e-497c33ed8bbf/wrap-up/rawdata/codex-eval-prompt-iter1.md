# Codex Evaluation — Wrap-up consolidation iter1

## Identity

You are a **Codex evaluator** running the wrap-up evaluation for session `2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`.

Load and follow the principles skill (13 Iron Laws), evaluation skill, and wrap-up skill before proceeding.

## Path Constants

- **main-tree**: `/playinganalytics/git/gobbi`
- **worktree**: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb`
- **session-dir (worktree-based)**: `<worktree>/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`
- **output-dir**: `<session-dir>/wrap-up/evaluation/iter1/codex/`

All session writes MUST use the **worktree-based absolute path** above. Do NOT use relative paths or pwd-derived paths.

## Task

Evaluate the Wrap-up consolidation for session `2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`. This session shipped: Chat Mode + Auto Mode redesign for the gobbi orchestration skill.

## Primary Artifact

`<session-dir>/wrap-up/artifacts/handoff.md`

## Supporting Artifacts

- `<session-dir>/session.json` — wrap-up state
- `<worktree>/.gobbi/projects/gobbi/archive/backlogs/2026-05-28-chat-mode-tiki-taka-redesign.md`
- `<worktree>/.gobbi/projects/gobbi/archive/backlogs/2026-05-28-auto-mode-silence-vs-always-ask.md`
- `<worktree>/.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md`
- `<worktree>/.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md` (expected but may be absent)
- `~/.claude/projects/-playinganalytics-git-gobbi/memory/project_chat_auto_mode_redesign_shipped.md`

## Verification Claims to Check

The evaluator MUST check each claim with a concrete file/grep check:

**Claim 1 — Archive moves performed with frontmatter stamping**
- Verify two backlogs moved to `archive/backlogs/`:
  - `grep -E "^(status:|disposition:|archived_at:|archive_reason:|shipped_in:)" <worktree>/.gobbi/projects/gobbi/archive/backlogs/2026-05-28-chat-mode-tiki-taka-redesign.md`
  - `grep -E "^(status:|disposition:|archived_at:|archive_reason:|shipped_in:)" <worktree>/.gobbi/projects/gobbi/archive/backlogs/2026-05-28-auto-mode-silence-vs-always-ask.md`
  - Expected: `status: closed`, `archived_at: 2026-05-28`, `shipped_in: chore/session-2026-05-28-8eed14fb`

**Claim 2 — Originals removed (moved)**
- Verify original backlog files are NOT present in `<worktree>/.gobbi/projects/gobbi/backlogs/`:
  - `test -f <worktree>/.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md && echo STILL_EXISTS || echo REMOVED`
  - `test -f <worktree>/.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md && echo STILL_EXISTS || echo REMOVED`

**Claim 3 — Handoff doc written with required sections**
- Verify handoff.md exists and has all required sections (Summary, Shipped, Locked Decisions, Open Threads, Pointers, Mistakes Promoted, Backlogs Closed/Filed, PR):
  - `test -f <session-dir>/wrap-up/artifacts/handoff.md && echo EXISTS || echo MISSING`
  - `grep -E "^## (Summary|What Shipped|Locked Decisions|Open Threads|Pointers|Mistakes Promoted|Backlogs Closed|Backlogs Filed|PR)" <session-dir>/wrap-up/artifacts/handoff.md`
  - Check `artifact_type: handoff` in frontmatter

**Claim 4 — Journal written**
- Verify per-session journal entry was written:
  - `test -f <worktree>/.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md && echo EXISTS || echo MISSING`
  - Check word count: `wc -l <worktree>/.gobbi/projects/gobbi/notes/2026-05-28-chat-auto-mode-redesign.md`

**Claim 5 — session.json final-stamps**
- Check `workflow.wrap-up.finishedAt` and `workflow.wrap-up.verdict` fields:
  - `python3 -c "import json; d=json.load(open('<session-dir>/session.json')); wup=d['workflow']['wrap-up']; print('finishedAt:', wup.get('finishedAt')); print('verdict:', wup.get('verdict'))"`
  - Expected for PASS seal: `finishedAt` is non-null ISO timestamp, `verdict: 'pass'`
  - NOTE: These may be null if MEMORIZATION phase has not yet completed (WORK done but MEMORIZATION pending)

**Claim 6 — Project-memory pointer**
- Verify user-level memory was updated:
  - `test -f ~/.claude/projects/-playinganalytics-git-gobbi/memory/project_chat_auto_mode_redesign_shipped.md && echo EXISTS || echo MISSING`
  - Check content covers shipped artifacts and decisions
  - Also check `~/.claude/projects/-playinganalytics-git-gobbi/memory/MEMORY.md` has entry pointing to this file

**Additional checks (handoff completeness)**

- Verify new backlog filed (claimed in handoff):
  - `test -f <worktree>/.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md && echo EXISTS || echo MISSING`
- Verify shipped orchestration files exist:
  - `wc -l <worktree>/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`
  - `wc -l <worktree>/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
  - `wc -l <worktree>/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`

## Output

Write 8 files (7 perspectives + overall) to `<output-dir>`:

```
<session-dir>/wrap-up/evaluation/iter1/codex/project.md
<session-dir>/wrap-up/evaluation/iter1/codex/structure.md
<session-dir>/wrap-up/evaluation/iter1/codex/performance.md
<session-dir>/wrap-up/evaluation/iter1/codex/aesthetics.md
<session-dir>/wrap-up/evaluation/iter1/codex/usage.md
<session-dir>/wrap-up/evaluation/iter1/codex/consistency.md
<session-dir>/wrap-up/evaluation/iter1/codex/risk.md
<session-dir>/wrap-up/evaluation/iter1/codex/overall.md
```

Each file MUST contain:
- `## Artifact Summary` section with W/W/H
- `## Locked Frame (Stage 1)` section
- Per-scenario per-check yes/no results with evidence
- Typed findings with Type / Domain / Confidence / Severity / Disposition
- `VERDICT: PASS|REVISE|FAIL` line at the top or bottom of the file

`overall.md` MUST contain:
- `VERDICT: PASS|REVISE|FAIL` on its own line
- Cross-perspective findings
- Karpathy 4 failure mode check
- Preserve list

## Critical Notes

- The session dir in the worktree is the canonical location: `<worktree>/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/`
- `plugins/` directory was deleted — do NOT flag its absence as a finding
- `claude skill` file absence is a known pre-existing state — do NOT flag as finding (FLAG-2 waived)
- `session.json` `wrap-up.finishedAt` and `wrap-up.verdict` being null is expected if MEMORIZATION phase hasn't run yet — note this as a state observation, not a blocking failure
- Focus evaluation on: promotion coverage, routing-table adherence, handoff verifiability, journal completeness, archive integrity

## Evaluation phase: wrap-up
