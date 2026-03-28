# Subtask 04: Note Directory Naming Convention Migration

## Session-to-Directory Mapping

Matching was performed by:
1. Extracting `sessionId` and `timestamp` from the first message of each transcript JSONL file
2. Searching for `mkdir` commands referencing each note directory slug across all transcripts
3. Cross-referencing creation timestamps with session active periods

### Transcript Sessions Found

| Session UUID | First Timestamp (UTC) | Last Timestamp (UTC) |
|---|---|---|
| `0509e5bb-d99b-4a54-a5e8-366a2830ce7f` | 01:52:39 | (early session, unrelated) |
| `85a1ef9f-fff3-4404-bb52-eba0499f81d3` | 02:52:22 | (early session, unrelated) |
| `a935d6db-5486-4e32-8d06-bf1f8975a547` | 06:38:44 | 10:00:04 |
| `f7f850b1-94ab-4ffd-acd7-225c49c5e56f` | 08:40:37 | 08:49:09 (compact test) |
| `817180d3-2372-412b-9a04-7c1fe59d3984` | 08:49:20 | 09:15:44 |
| `ed5b2db3-7d89-4208-a25b-8ad0889a0c80` | 09:15:56 | 09:59:21 |

### Directory-to-Session Mapping

Determined by finding which transcript contains `mkdir` commands for each directory:

| Old Directory Name | Session (mkdir found in) | Session ID Short | New Directory Name |
|---|---|---|---|
| `20260328-0706-doc-review` | `a935d6db-...` | `a935d6db` | `20260328-a935d6db-doc-review` |
| `20260328-0845-doc-fix` | `a935d6db-...` | `a935d6db` | `20260328-a935d6db-doc-fix` |
| `20260328-0914-gobbi-improvements` | `a935d6db-...` | `a935d6db` | `20260328-a935d6db-gobbi-improvements` |
| `20260328-0940-note-metadata` | `a935d6db-...` | `a935d6db` | `20260328-a935d6db-note-metadata` |
| `20260328-0951-installation-system` | `ed5b2db3-...` | `ed5b2db3` | `20260328-ed5b2db3-installation-system` |

## Renames Performed

All 5 directories renamed via `mv` in `/playinganalytics/git/gobbi/.claude/project/gobbi/note/`:

```
mv 20260328-0706-doc-review        -> 20260328-a935d6db-doc-review
mv 20260328-0845-doc-fix           -> 20260328-a935d6db-doc-fix
mv 20260328-0914-gobbi-improvements -> 20260328-a935d6db-gobbi-improvements
mv 20260328-0940-note-metadata     -> 20260328-a935d6db-note-metadata
mv 20260328-0951-installation-system -> 20260328-ed5b2db3-installation-system
```

## README.md Updates

- Added `Session` column with 8-char session ID short values
- Updated all directory names to new format
- Added links to directory paths
- Added missing rows for `note-metadata` and `installation-system` (only 3 of 5 were previously listed)

## Internal Reference Updates

Two files contained old-format directory references:
- `20260328-a935d6db-doc-fix/ideation.md` — updated `20260328-0706-doc-review` to `20260328-a935d6db-doc-review`
- `20260328-ed5b2db3-installation-system/plan.md` — updated `20260328-0951-installation-system` to `20260328-ed5b2db3-installation-system`

## Uncertainties

**None significant.** The `mkdir` grep across transcripts provided definitive evidence. Four directories were created by session `a935d6db` (the main long-running orchestrator session from 06:38 to 10:00). One directory (`installation-system`) was created by session `ed5b2db3` (a subagent or resumed session starting at 09:15).

Note: Sessions `f7f850b1` (compact test, 08:40-08:49) and `817180d3` (08:49-09:15) ran concurrently with `a935d6db` but did not create any note directories.

## Out-of-Scope References

Two skill files contain old-format directory names as illustrative examples (not modified per scope boundary):
- `.claude/skills/gobbi-orchestration/SKILL.md` line 135 — example compact message references `20260328-0706-doc-review`
- `.claude/skills/gobbi-gotcha/gobbi-orchestration.md` line 147 — same example in gotcha context
