# Work Mistakes

## Staging a deleted path that aborts the rest of `git add`

**Context:** Committing a topic that deletes files and also updates other files.

**Mistake:** Passing the deleted path to `git add --` after `git rm` had already staged it. Git
exited `fatal: pathspec ... did not match any files` and left the remaining paths unstaged. The
topic then needed a second commit.

**Correction:** After `git rm`, do not re-add the deleted path. Stage remaining updates in the same
command list only after confirming those paths still exist, or inspect `git status --short` and add
the leftover paths.

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

## Cutting CHANGELOG Unreleased without checking each carried bullet

**Context:** Cutting Keep a Changelog Unreleased work into a dated version section.

**Mistake:** Moving the Unreleased list as a block without re-reading each bullet against the shipped tree
leaves superseded facts as current. A four-runtime tree kept three-runtime helper and question-tool sentences.

**Correction:** Re-read each carried bullet against the shipped tree before accepting the version section.
Drop or rewrite any sentence that is no longer true.

## Running a Partner session write beside another session writer

**Context:** Partner writes the authorized write set under the worktree.

**Mistake:** Launching a `worktree` write while another worktree writer is also changing the tree makes the
preimage check unusable and can collide with authorized paths.

**Correction:** Launch Partner sequentially for `worktree` writes. Record the worktree preimage before the
write. Accept the authorized write set.

## Treating User Review Continue as merge authority

**Context:** Workflow `P2 · User Review` Continue activates Wrap-up. Configuration still records
merge and cleanup authority separately.

**Mistake:** Reading Continue as a rewrite of recorded `Merge authority` or `Cleanup authority`.
Wrap-up then either mutates without a grant or, correctly, stops while the manager treats the stop
as a surprise.

**Correction:** Continue enters Wrap-up. It does not grant Git integration. Reread Configuration
and the latest handoff for merge and cleanup authority. An explicit user grant is required before
Memory mutation that is followed by merge or cleanup.

## Leaving leftover verify-list words after a Planning field rename

**Context:** Planning renamed a dispatch field, and Workflow still lists older words in a RECORD verify
list.

**Mistake:** After Planning renamed `writer frontier`, Workflow Step 2.2 still said `contexts, writer
boundaries`. Those leftover synonyms can look like a recipe demand even when the RECORD REVISE bar
already uses the Planning assignment contract.

**Correction:** When a Planning field is renamed, update every Workflow verify list in the same change.
Do not treat leftover synonyms as in-contract REVISE when the RECORD bar is otherwise present.

## Packing new policy into an Operation Skill second sentence instead of splitting a Step

**Context:** Adding Evaluation-depth labeling policy without adding a seventh Rule or a new Phase.

**Mistake:** Folding polish-Improvement and criterion-mapping policy into Evaluation Step 2.2's second
sentence kept Gobbi Skill caps but packed extra policy into one substep.

**Correction:** Prefer a Step split when new policy is more than a condition of the first sentence. A
second sentence should only bound the first sentence, not introduce extra rules.

## Matching a Breaking relabel by a distinctive phrase

**Context:** Prefixing `**Breaking:**` on existing Changed bullets whose primary disclosure is a named
shipped surface, such as General mode.

**Mistake:** Treating the bullet that already contains a distinctive phrase ("Agent Teams", "Setup is
not a skill") as the only match, and skipping a sibling bullet whose primary disclosure is the same
surface under a different wording ("General discovers applicable operations").

**Correction:** Walk every Changed bullet and ask what it discloses, not whether it contains the
locked name string. Prefix each bullet whose primary disclosure is a locked surface. Keep the
sentence. Do not recategorize it into Removed.

## Narrowing a consumer's load to named entries drops its Rules

**Context:** A topic contract or brief narrows what a consumer skill loads, to save tokens.

**Mistake:** A contract told Coding Execution to read "only the entries named by the accepted design". That
skipped the child `SKILL.md` Rules, such as the learning-depth limit and the stated-force rule, which bind
every change.

**Correction:** When narrowing a load, always keep the skill's entry file with its Principles and Rules.
Narrow only the supporting docs.

## A correction brief that lists only the file being fixed

**Context:** Sending a correction brief after a review finds a wrong fact in one skill file.

**Mistake:** The brief allowed only the skill file. The coding family design memory restated the same fact, so
it stayed stale. This happened twice in one session.

**Correction:** Before sending a correction, grep every file that restates the corrected fact and put all of
them in the writer frontier (Principle 7). For coding skill wiring, include
`memory/design/feature/coding-skill-family.md` by default. When several author groups run in series, have each
group append the sentences that other files restate to one session file, and give that file to the final
consistency group.

## An unchecked claim in a brief

**Context:** A manager writes a commit or task brief from earlier notes.

**Mistake:** A brief called the old guides "unlinked". The committing author found that Ideation, Execution,
and a template linked them at the base; only the root did not.

**Correction:** Check each claim before it goes into a brief, or state it with its exact scope ("the root did
not link them").

## Grouping review findings by theme drops findings

**Context:** Turning many review findings into a contract or a disposition list.

**Mistake:** A contract summarized 36 findings by theme. Two findings fit no theme and got no disposition; the
planner caught them.

**Correction:** Build the disposition table from the finding IDs. Give every ID one row: applied, decided, or
backlogged.
