# Wrap-up memory

## Intent

Wrap-up Phase 2 writes durable project memory before Git. Phase 3 commits, merges, and returns a response-only Git and recovery note.

Cowork wrap-up uses the same Memory extraction. It does not load the Wrap-up skill, does not merge, and does not write a Workflow note.

## What Phase 2 stores

| Accepted knowledge | Home |
|---|---|
| Design changes and intended behaviors | `design/` |
| Decisions | The design file they shape |
| Standing project preferences | `design/process/`, or the named feature or architecture file they constrain |
| Repeatable tips and mistakes | `learnings/` |
| Deferred leftovers | `backlogs/` |
| Work account | `reports/note/YYYY-MM-DD-<title>.md` |
| Net session change | `history/`, only when the project changed |

Update or merge an existing home first. Create a file only when that content is missing.

## What stays out

Do not store talk, transcripts, rejected options, one-session instructions, Git action states, recovery commands, or secrets. Do not edit the durable note after the closure tree is frozen.

The response note cites the `reports/note/` path. When Phase 1 stops before memory, that path is `None`.

## References

- [Wrap-up](../../../skills/wrap-up/SKILL.md)
- [Memory](../../../skills/memory/SKILL.md)
- [Cowork implementation commits](cowork.md)
