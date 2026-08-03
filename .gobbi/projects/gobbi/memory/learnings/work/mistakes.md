# Work Mistakes

## Treating a teammate's idle notification as a completion signal

**Context:** Coordinating multiple teammate agents in a session and reacting to their idle or notification
signals.

**Mistake:** Assuming a teammate going idle means it delivered the assigned work. In one session every
teammate went idle without delivering, and one had produced nothing at all.

**Correction:** Verify completion from direct evidence — the actual diff, file contents, or command output —
before treating a teammate's work as done. Idle is a scheduling state, not a completion signal.

## Accepting a reported verification instead of reproducing it

**Context:** A teammate reports that a check or test passed.

**Mistake:** Trusting the claim as stated. One executor reported a markdown link check as passing when it had
actually run the script with no arguments and gotten a usage message. The check did pass once run correctly,
but the claim as made was hollow.

**Correction:** Reproduce every verification claim independently — run the same command and confirm the
output — before accepting it as evidence.

## Trusting a count instead of re-deriving it

**Context:** A plan, brief, or prior report states a count — of references, files, renames, occurrences — that
a task's own verification depends on.

**Mistake:** A plan stated 24 references to convert; the true count was 59, because the plan excluded relative
markdown links, path-shaped citations, and everything outside its cited line ranges. The same plan stated 33
renames across 14 files; the true count was 31 across 13, because one of the counted files was a symlink to
another, so editing it as a regular file would have replaced a tracked symlink.

**Correction:** Never let a task trust a count handed down from a plan, a brief, or a coordinating agent.
Re-derive the inventory independently before treating the task as complete.

## Two assignment channels for one piece of work

**Context:** Assigning a task to a delegate through both a task-tracking system and a direct message.

**Mistake:** Setting a task's owner in the task list AND sending a delegation message for the same assignment
reads as two separate triggers, not one. This caused a duplicate run of the same work twice in one session.

**Correction:** Treat every assignment surface — a task-list owner change, a delegation message — as capable
of triggering work on its own. Use exactly one per assignment, or make clear which one is authoritative before
using both.

## Routing around a tool guard's refusal instead of reading it

**Context:** A tool call is rejected — "file has been modified since read," a script errors, a rule blocks an
instructed action.

**Mistake:** Treating a refusal as an obstacle to route around. One agent hit "file has been modified since
read" and ran `rm -f` to force past it, destroying an accepted, unrecoverable artifact. A second agent hit the
identical refusal, read it as information, re-read the file, confirmed the other writer's content was correct,
and left it alone.

**Correction:** A tool's refusal is a fact about the world, not a lock to pick. Read it, understand what it is
telling you, and resolve the underlying condition before retrying — never bypass the mechanism that produced
it.

## Uncommitted work in a git-ignored directory has no protection

**Context:** An accepted, frozen artifact — a plan, a design — exists only inside a session's own working tree
and has not yet been committed.

**Mistake:** A git-ignored session directory gives an accepted artifact no protection at all. A frozen plan
was deleted from exactly such a directory and was unrecoverable, because nothing about "accepted" or "frozen"
made it durable.

**Correction:** Give every artifact accepted before it can be committed an immutable copy outside the
session's own working tree, not just an "accepted" status inside it.

## A coordinating role is not exempt from its own single-writer rule

**Context:** A coordinating agent (a manager, a lead) is waiting on a delegate to finish writing a file it
also has the ability to edit directly.

**Mistake:** A coordinating agent sent a delegate an instruction, then — when the delegate had not responded
quickly — applied part of the same instruction to the file itself. Two writers held one instruction for one
file at the same time; only a separate tool guard rejecting the delegate's stale-content edit prevented a
silent overwrite.

**Correction:** Once an instruction is delegated, the delegate owns that file until it reports or is
explicitly released — including for the agent that did the delegating. If a coordinating agent needs to take a
file back, it must say so to the delegate first, not just start editing.
