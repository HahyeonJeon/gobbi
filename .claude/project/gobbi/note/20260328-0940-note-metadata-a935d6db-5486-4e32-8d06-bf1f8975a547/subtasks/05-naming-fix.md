# 05 — Naming convention fix

Changed note directory naming from `{YYYYMMDD}-{session_id_short}-{slug}` to `{YYYYMMDD-HHMM}-{slug}-{session_id}`.

Rationale: UUID goes at the end because humans don't need to read it -- it's for machine cross-referencing. Datetime gets HHMM back for minute-level precision.

Example: `20260328-0706-doc-review-a935d6db-5486-4e32-8d06-bf1f8975a547`

## Changes

### Scripts

- `.claude/hooks/session-metadata.sh` -- Removed `session_id_short` variable and `CLAUDE_SESSION_ID_SHORT` export. Only `CLAUDE_SESSION_ID` (full UUID) is exported.
- `.claude/skills/gobbi-note/scripts/note-metadata.sh` -- Removed `session_id_short` and `date` outputs. Only `session_id` (full UUID) and `datetime` (YYYYMMDD-HHMM) remain.
- `.claude/skills/gobbi-note/scripts/note-init.sh` -- Directory path changed from `${date}-${session_id_short}-${slug}` to `${datetime}-${slug}-${session_id}`.

### Skill docs

- `.claude/skills/gobbi-note/SKILL.md` -- Updated naming convention, directory tree, example, and all references from `session_id_short`/`$CLAUDE_SESSION_ID_SHORT` to `session_id`/`$CLAUDE_SESSION_ID`.
- `.claude/skills/gobbi-collection/SKILL.md` -- Same updates as gobbi-note.

### Directory renames

| Old | New |
|-----|-----|
| `20260328-a935d6db-doc-review` | `20260328-0706-doc-review-a935d6db-5486-4e32-8d06-bf1f8975a547` |
| `20260328-a935d6db-doc-fix` | `20260328-0845-doc-fix-a935d6db-5486-4e32-8d06-bf1f8975a547` |
| `20260328-a935d6db-gobbi-improvements` | `20260328-0914-gobbi-improvements-a935d6db-5486-4e32-8d06-bf1f8975a547` |
| `20260328-a935d6db-note-metadata` | `20260328-0940-note-metadata-a935d6db-5486-4e32-8d06-bf1f8975a547` |
| `20260328-ed5b2db3-installation-system` | `20260328-0951-installation-system-ed5b2db3-7d89-4208-a25b-8ad0889a0c80` |

### Index

- `.claude/project/gobbi/note/README.md` -- Updated all directory links to new names. Kept Session column with short 8-char ID for human readability (full UUID is already in the link path).

## Not changed

Historical note files (ideation.md, execution.md, subtasks/) that reference the old naming convention were left as-is. They are accurate records of what was decided at the time.
