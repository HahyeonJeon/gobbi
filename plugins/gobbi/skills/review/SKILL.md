---
name: review
description: "Review is an independent check of one finished result against its Goal. Use it when a caller needs a verdict on code, docs, skills, or visual work before accepting it."
allowed-tools: Read, Grep, Glob, Bash, Write
skill-type: operation
---

# Review

Review checks one finished result against its Goal with a reviewer who did not make it, and turns the findings
into one verdict the caller acts on. Use it in Workflow REVIEW and on a Cowork `review` call.

## Principles

### Check, do not trust

The producer's handoff is a list of claims. The reviewer reads the result itself and reruns the checks it relies
on, because an author checks what it meant to build, not what it built.

### Use the fewest reviewers that cover the risk

One fresh reviewer covers most work. A second reviewer from another model family pays off only where a missed
defect is expensive, so add it by risk, not by habit.

### Block only what this change broke or left unshown

A reviewer asked to find problems always finds some, and fixing all of them adds loops and abstraction. Only a
shown defect this change introduced, or missing evidence that the Goal is met, holds the work back; everything
else is a follow-up.

## Rules

- **NEVER review your own work or change the subject.** A review that the producer runs, or that edits what it
  judges, can no longer tell the caller what was delivered.
- **Give every finding its evidence.** Use a `path:line` quote, a step-by-step scenario that reaches a wrong
  outcome, or a command and its output; a finding with none of these is an opinion and never blocks.
- **Block only a defect this change introduced that breaks the Goal or the contract, or a part of the Goal that
  no passed check shows, because an inconclusive or unrun check is no evidence.** Taste, pre-existing problems,
  and improvements go to follow-ups, so review does not grow the scope.
- **Stop after two fix rounds that still fail.** The premise is likely wrong, so rethink it or ask the user
  instead of a third round.

## Procedure

### Phase 1 — Set Up the Review

The caller decides who reviews and what they get. Done when every reviewer has a brief and nothing more.

#### 1.1 Choose the reviewers

- Assign one fresh `reviewer` that did not produce the work.
- Add one read-only [Partner](../partner/SKILL.md) run from another model family when the change adds
  user-facing behavior, changes a public interface or a skill's Rules or Principles, touches security or data, or
  closes a session. Brief it to find what breaks and prove it; when the Partner policy allows no such runtime,
  note the missing second review under Not checked.
- Skip review for a change that only rewords or reformats and passes its checks.

#### 1.2 Brief each reviewer

- Write each brief through [Delegation](../delegation/SKILL.md): the Goal and its evidence of done, the exact
  subject (a commit, diff, or paths), the checks to rerun, the stage bar below, the matching domain bar, and the
  report path.
- Leave out the producer's reasoning and other reviewers' reports, so each reviewer judges the result alone.

### Phase 2 — Review the Result

The reviewer judges the result against the Goal and the bars. Done when the report exists at its path.

#### 2.1 Check and read

- Rerun the checks the verdict relies on, then read the result itself before any handoff claim.
- Apply the stage bar and the domain bar. Ask also what is missing, where the result meets the form of the Goal
  but not its purpose, and how a strong version would differ.

#### 2.2 Write the report

- Write the report from the [report template](report.md): a verdict, the findings, and what was and was not
  checked. Keep each finding to its place, problem, evidence, whether it blocks and why, and a suggested fix.
- A read-only Partner returns its report as its final message, and the caller saves it at the report path.

### Phase 3 — Decide and Fix

The caller turns the reports into one verdict. Done when the verdict is recorded where the caller keeps its
results.

#### 3.1 Decide the verdict

- Reproduce each blocking finding by rereading its quote or rerunning its command. Drop what does not reproduce,
  and record each dropped or follow-up item with a one-line reason.
- Record PASS when nothing blocks, REVISE with the blocking findings when a safe fix exists, or FAIL when none
  does. Apply Gobbi's [finding gate](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) to each fix.
- When a finding repeats a recorded mistake or an earlier finding, apply Step 3.2.

#### 3.2 Turn a repeated mistake into a check

- Cite two distinct occurrences of the same failure, then choose the smallest change that prevents or detects
  both: remove the failure path first, otherwise a tool limit, type, lint, or test. A lesson that needs
  judgment and cannot be enforced stays in its entry, with the reason.
- When the change fits the accepted Goal and authority, apply the finding gate and send it to the caller's
  writer with the past failing case and the corrected case. Otherwise add it to the project backlog.
- Accept the check only after fresh review shows it rejects the past mistake, accepts the correction, and runs
  on the path future work takes. Closure then removes the mistake entry.

#### 3.3 Run a fix round

- Send the blocking findings to the writer the caller names for the fix. Re-review only the fixes and the lines
  they touched, with one reviewer who confirms each blocking finding is resolved.
- After two rounds that still fail, stop and rethink the premise, or ask the user.

## Stage Bars

| Stage | A strong result shows |
|---|---|
| Ideation | The goal, decisions, boundaries, and constraints are clear, and every user-owned choice was asked and recorded. Not implementation detail or polish. |
| Planning | The tasks cover the whole work without overlap, each Goal can be judged, every constraint has a source, and the Task Graph has no cycle. Not implementation steps. |
| Execution | The Goal is met and shown by checks that **passed**, nothing the change reaches is left stale, and the change adds nothing unasked. |

## References

| Name | Description |
|---|---|
| [Report template](report.md) | The short report every reviewer writes. |
| [Coding Review](../coding/coding-review/SKILL.md) | The domain bar for code and code design. |
| [Authoring Review](../authoring/authoring-review/SKILL.md) | The domain bar for docs, skills, and other durable prose. |
| [Design Review](../design/design-review/SKILL.md) | The domain bar for visual work. |
| [Delegation](../delegation/SKILL.md) | Defines each reviewer's brief and handoff, and the check outcomes passed, failed, and inconclusive. |
| [Memory](../memory/SKILL.md) | Holds the recorded mistakes that Step 3.2 turns into checks. |
| [Partner](../partner/SKILL.md) | Runs the second reviewer from another model family. |
| [Gobbi](../gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) | Owns the finding gate that decides which fixes run without the user. |
