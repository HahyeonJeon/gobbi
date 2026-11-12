# Lesson loop

## Intent

A recorded lesson reaches the next task, and a repeated mistake becomes a check instead of a longer note. The
loop has four owners and no new skill.

## Steps and owners

| Step | Owner |
|---|---|
| Before the first brief of a Goal, the manager scans the `##` headings of `memory/learnings/*/*.md`, checks each matching entry against its current owner, copies each matching mistake's Correction into Constraints and each matching tip into Context, citing its path and heading. | [Gobbi Step 2.6](../../../skills/gobbi/SKILL.md#26-pass-recorded-lessons-into-each-brief) |
| A mistake entry carries `Seen`: one date and the commit or report for each occurrence. A second occurrence is added to the existing entry, not a second entry. | [Memory](../../../skills/memory/memory.md) |
| A finding that repeats a recorded mistake or an earlier finding cites two distinct occurrences and gets the smallest change that prevents or detects both: remove the failure path first, otherwise a tool limit, type, lint, or test. A lesson that needs judgment stays in its entry, with the reason. | [Review Step 3.2](../../../skills/review/SKILL.md#32-turn-a-repeated-mistake-into-a-check) |
| At Closure, each mistake that an accepted check, tool limit, structural change, or skill Rule now holds is removed. Closure records this and does not build a check. | [Memory Phase 2](../../../skills/memory/SKILL.md) and [Wrap-up memory](wrap-up.md) |

Titles of learning entries name the situation a future task would match, because briefs select entries by
heading alone.

## References

- [Review](evaluation.md)
- [Wrap-up memory](wrap-up.md)
