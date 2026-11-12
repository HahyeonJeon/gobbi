# Work Mistakes

## Staging a deleted path that aborts the rest of `git add`

**Context:** Committing a topic that deletes files and also updates other files.

**Mistake:** Passing the deleted path to `git add --` after `git rm` had already staged it. Git
exited `fatal: pathspec ... did not match any files` and left the remaining paths unstaged. The
topic then needed a second commit.

**Correction:** After `git rm`, do not re-add the deleted path. Stage remaining updates in the same
command list only after confirming those paths still exist, or inspect `git status --short` and add
the leftover paths.

**Seen:** 2026-09-14 (bbcb32b5)

## Passing on a claim without checking it against its owner

**Context:** A plan, brief, review summary, or earlier note states a count, a set, a fact list, or a command
that later work depends on.

**Mistake:** The claim was passed on from a summary instead of its owner. A plan stated 24 references; the
true count was 59, and a counted file was a symlink. A brief called guides "unlinked" when only the root was,
and gave a script with no arguments, which only printed usage. A classification sentence checked against a
reviewer's suggestion contradicted five keys in the design's tables. A contract grouped 36 findings by theme
and two got no disposition. Each cost a review round or more.

**Correction:** Check each claim against its owner before you pass it on: re-derive a count, check every
member of a set against its source table (or state the claim by exception), take a fact list from the design
rather than a summary, build a disposition table from the finding IDs, grep the claimed text before a
multi-file fix, and give each command with the arguments it needs. Otherwise state the claim with its exact
scope.

**Seen:** 2026-08-02 (bb689f0d), 2026-09-25 (4670edff, two incidents), 2026-09-29 (3af9e384), 2026-11-11
(session gobbi-skills)

## Two assignment channels for one piece of work

**Context:** Assigning a task to a delegate through both a task-tracking system and a direct message.

**Mistake:** Setting a task's owner in the task list AND sending a delegation message for the same assignment
reads as two separate triggers, not one. This caused a duplicate run of the same work twice in one session.

**Correction:** Treat every assignment surface — a task-list owner change, a delegation message — as capable
of triggering work on its own. Use exactly one per assignment, or make clear which one is authoritative before
using both.

**Seen:** 2026-08-02 (bb689f0d)

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

**Seen:** 2026-08-02 (bb689f0d)

## Uncommitted work in a git-ignored directory has no protection

**Context:** An accepted, frozen artifact — a plan, a design — exists only inside a session's own working tree
and has not yet been committed.

**Mistake:** A git-ignored session directory gives an accepted artifact no protection at all. A frozen plan
was deleted from exactly such a directory and was unrecoverable, because nothing about "accepted" or "frozen"
made it durable.

**Correction:** Give every artifact accepted before it can be committed an immutable copy outside the
session's own working tree, not just an "accepted" status inside it.

**Seen:** 2026-08-02 (bb689f0d)

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

**Seen:** 2026-08-02 (bb689f0d)

## Cutting CHANGELOG Unreleased without checking each carried bullet

**Context:** Cutting Keep a Changelog Unreleased work into a dated version section.

**Mistake:** Moving the Unreleased list as a block without re-reading each bullet against the shipped tree
leaves superseded facts as current. A four-runtime tree kept three-runtime helper and question-tool sentences.
A bullet can also be true only against an intermediate commit. The v1.3.2 Unreleased text called the Coding
Ideation change a rename of one level, but v1.3.1 had shipped a different four-level ladder.

**Correction:** Re-read each carried bullet against the shipped tree before accepting the version section.
Drop or rewrite any sentence that is no longer true. Check each changed skill with a diff against the previous
release tag, not against the last commit.

**Seen:** 2026-08-16 (e60aa772), 2026-11-12 (release review of `a8ffb000`: a removed skill that never shipped,
and superseded Delegation bullets)

## Running a Partner session write beside another session writer

**Context:** Partner writes the authorized write set under the worktree.

**Mistake:** Launching a `worktree` write while another worktree writer is also changing the tree makes the
preimage check unusable and can collide with authorized paths.

**Correction:** Partner runs write runs in one directory one at a time. Before each write run, record `HEAD`
and save `git -C "$repo" diff --binary HEAD`, which holds staged and unstaged changes, and a copy of each
untracked file as the preimage, with `status --porcelain` as its inventory. Compare the final tree against the
same `HEAD`, and accept only the authorized write set.

**Seen:** 2026-08-16 (e60aa772)

## Matching a Breaking relabel by a distinctive phrase

**Context:** Prefixing `**Breaking:**` on existing Changed bullets whose primary disclosure is a named
shipped surface, such as General mode.

**Mistake:** Treating the bullet that already contains a distinctive phrase ("Agent Teams", "Setup is
not a skill") as the only match, and skipping a sibling bullet whose primary disclosure is the same
surface under a different wording ("General discovers applicable operations").

**Correction:** Walk every Changed bullet and ask what it discloses, not whether it contains the
locked name string. Prefix each bullet whose primary disclosure is a locked surface. Keep the
sentence. Do not recategorize it into Removed.

**Seen:** 2026-09-21 (3ff600ed)

## Narrowing a consumer's load to named entries drops its Rules

**Context:** A topic contract or brief narrows what a consumer skill loads, to save tokens.

**Mistake:** A contract told Coding Execution to read "only the entries named by the accepted design". That
skipped the child `SKILL.md` Rules, such as the learning-depth limit and the stated-force rule, which bind
every change.

**Correction:** When narrowing a load, always keep the skill's entry file with its Principles and Rules.
Narrow only the supporting docs.

**Seen:** 2026-09-25 (4670edff)

## A correction brief that lists only the file being fixed

**Context:** Sending a correction brief after a review finds a wrong fact in one skill file.

**Mistake:** The brief allowed only the skill file. The coding family design memory restated the same fact, so
it stayed stale. This happened twice in one session. In a later session, a correction added a per-class reviewer
rule to one procedure step only. The Rule count, the review layout, and the process design memory that restates
that layout stayed stale, and two reviews found them.

**Correction:** Before sending a correction, grep the whole canonical tree (skills, agents, `memory/design/`,
and READMEs) for the old literal, and put every file that restates the fact in the writer frontier
(Principle 6, Leave every affected file consistent). When the correction changes a count or
cardinality, also sweep every Rule, layout, and
aggregation surface that assumes the old count. For coding skill wiring, include
`memory/design/feature/coding-skill-family.md` by default. When several author groups run in series, have each
group append the sentences that other files restate to one session file, and give that file to the final
consistency group.

**Seen:** 2026-09-25 (4670edff)

## Dispatching a brief before its Materials exist

**Context:** A manager writes a brief whose Materials list names session files.

**Mistake:** A planning brief listed `tmp/file-map.md`, and the manager wrote that file seconds after dispatch.
The same mistake had happened in earlier sessions.

**Correction:** Write every Materials file first. Then check that each listed path is readable, for example with
`test -r`, and only then dispatch.

**Seen:** 2026-09-29 (3af9e384)

## Offering options before confirming what the user's term means

**Context:** The user names a facet, key, or field and asks for a change to it.

**Mistake:** The manager asked two cards about whether to store `relationship` before confirming what the user
meant by it. The user meant edges to other units by id, typed like parent, child, or link.

**Correction:** First restate the term's content in one line with an example, and confirm it with the user.
Offer storage or shape options only after that.

**Seen:** 2026-09-29 (3af9e384)

## A skill-design brief without the standard's hard limits

**Context:** Briefing a design that adds Rules or sections to a skill governed by a writing standard.

**Mistake:** A design added a seventh Rule. The skill standard allows six. The brief did not state that limit,
so the conflict surfaced only during execution.

**Correction:** Put the governing standard's hard limits, such as the Rule count, in every skill-design brief.

**Seen:** 2026-09-29 (3af9e384)

## Project-specific examples in a general skill

**Context:** Writing a skill that other projects will also use.

**Mistake:** A new skill's examples used this project's own files and paths. The design and its acceptance did
not check for them, and the user had to correct it.

**Correction:** The user's standing preference is that skill examples and descriptions are project-agnostic.
State this in every skill-writing brief. At acceptance, grep the new skill text for the project's own names and
paths.

**Seen:** 2026-09-29 (3af9e384)
