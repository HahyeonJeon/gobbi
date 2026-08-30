# Work Tips

## After Phase 2 Complete, add a new tasks and plan part

**Context:** The user asks for more work after Workflow Phase 2 is already Complete.

**Tip:** Record that work as a new `tasks-NN` and `plan-NN` with the next unused
number. Do not rename earlier parts, and do not keep the extra work as a silent
manager-only todo.

**Application:** Append the new parts, update the Planning indexes, and reopen
Execution at the first new task. Leave Wrap-up stopped until that extra work is
accepted.

## Investigate a partner-round disagreement instead of picking a side

**Context:** The two independent drafts of one partner round disagree on a factual or design question during
the same task.

**Tip:** Disagreement between the two systems is often a signal that the question is genuinely unresolved,
not noise to average away. In one case the partner system was right that a file both drafts were about to
remove was still live, because a smoke-test script actively created it; the partner system also surfaced a
bootstrap ordering paradox that the active runtime's draft had glossed over, while the active runtime was
right that a proposed new top-level heading was forbidden.

**Application:** When the two systems disagree, investigate the disagreement directly with fresh evidence
rather than defaulting to either system's answer.

## A report that names what it did not do is more trustworthy than one that claims everything

**Context:** Judging whether to accept a delegate's report of completed work without independently reproducing
all of it.

**Tip:** A report that could have claimed full credit but instead states plainly that part of the result was
already correct on arrival, and names exactly which part, is more trustworthy than one that claims the whole
result as its own work. In one case this distinction is what made the rest of the report worth accepting
without re-deriving it.

**Application:** When reviewing a delegate's report, weight a report that explicitly disclaims partial credit
more highly than one that claims it all — and treat a report that claims everything as needing more
independent verification, not less.

## Grok Partner write-bound is a restricting flag plus an authorized write-set postimage

**Context:** Deciding whether Grok can be a Partner launch row, or launching Grok through a host wrapper.

**Tip:** Treat write-bound as one AND rule: a help-backed sandbox or tool-restriction flag that is not
`--always-approve`, plus a postimage that accepts the authorized write set. Measured Grok 1.0.5 uses
`--sandbox workspace`. `--always-approve` is not that flag. `--sandbox workspace` remains the restricting
flag. `--sandbox workspace` is not a session-directory-only deny. A host `timeout` around the Grok CLI is a
separate bound from Grok's own `[toolset.bash] timeout_secs` in user-level `~/.grok/config.toml`.

**Application:** Do not add a Grok launch row from a clean in-session file check alone. Do not treat a
wrapper-host bash timeout as Grok's tool timeout, or the reverse. When Grok hosts a Partner
wrapper, the ~300s host tool cap can kill the wrapper after the inner command finishes; see
[A Grok host tool timeout can kill a finished Partner wrapper](../grok/tips.md).

## A whole-branch Partner evaluation can exceed a 1200s wrapper timeout

**Context:** Launching a remaining-runtime evaluator over a large frozen tree with a host
`timeout 1200` around the Partner wrapper.

**Tip:** A whole-branch evaluation can still be running at 1200s. `WRAPPER_EXIT 124` plus one of
`report.md` or `checklist.md` is an incomplete pair. It is never PASS input, never a report to
disposition, and never a file to extract, repair, or retry in place.

**Application:** Require both regular non-empty files before using a runtime as gate input. A retry
needs a new assignment identity or a new iteration directory. Raising the wrapper timeout is a
caller authority choice, not an automatic Partner repair. This is not the Grok host-tool cap in
[A Grok host tool timeout can kill a finished Partner wrapper](../grok/tips.md#a-grok-host-tool-timeout-can-kill-a-finished-partner-wrapper). An attempt is counted by the actual external runtime or invocation. Wrapper silence and activity notifications do not count as an invocation or evidence of progress.

## Freeze checklist-free critique before checklist coverage

**Context:** A review uses a reusable checklist after an independent critical critique of one exact subject.

**Tip:** Bind the exact subject and affected surfaces first. Lock actual-code observations and coverage leads
before checklist exposure. Never backfill the locked record from checklist answers. If prepared material
contaminates the critique or the subject rebinds, discard the affected record and restart from binding.

**Application:** Keep the checklist as a coverage backstop and reconcile its findings with the locked critique;
do not let prepared categories become the source of the first review.

## Thinning Ideation and Planning checklists does not stop completeness hunts

**Context:** Changing Ideation or Planning so evaluation stops demanding executor-owned implementation
details.

**Tip:** Removing checklist items that demand recipes is not enough. Evaluation criticizes before any
checklist. Phase 2 prompts and gather stay stage-blind unless Evaluation binds caller-supplied
`evaluation-depth`. Cowork `evaluate` has no Workflow RECORD filter.

**Application:** Bind `evaluation-depth` in Evaluation and name the token in Workflow and Cowork evaluator
briefs. Keep Ideation and Planning checklists aligned with purpose and boundary, but do not treat
checklist thinning as the depth bind.

## Cowork whole-branch evaluate cannot freeze while tracked implementation is dirty

**Context:** A Cowork `evaluate` call names no subset while accepted implementation is still uncommitted.

**Tip:** Whole-branch evaluate freezes the branch from the immutable base through current head.
Uncommitted tracked implementation is not in that freeze. The call stops and asks for `commit` or a
named subject.

**Application:** Commit accepted tracked implementation first, or name a subset. Do not treat Execution
PASS as a freezeable whole-branch subject while those files remain dirty.
