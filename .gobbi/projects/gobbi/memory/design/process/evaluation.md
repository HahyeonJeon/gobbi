# Review

## Intent

The independent agent pass is [Review](../../../skills/review/SKILL.md): one shared operation skill that checks
a finished result against its Goal with a reviewer that did not make it, and turns the findings into one
verdict. Workflow runs it as REVIEW on Execution tasks and Wrap-up. Cowork runs it only on the user's `review`
call. The Generic Evaluation skill, `skills/evaluation/`, and the Checklist skill with every reusable checklist
are gone. Do not restore them.

This file records live Review facts for Memory readers. Do not copy a live SOP here.

## Model

- One fresh `reviewer` reviews by default. A read-only [Partner](../feature/partner.md) from another model family
  joins only when the Partner policy allows one and the change adds user-facing behavior, changes a public
  interface or a skill's Rules or Principles, touches security or data, or closes a session. A change that only
  rewords or reformats and passes its checks needs no review.
- Every finding carries evidence: a `path:line` quote, a walked scenario, or a command and its output. Only a
  defect the change introduced, or a part of the Goal that no passed check shows, blocks. An inconclusive or
  unrun check is no evidence. Everything else is a follow-up.
- The caller reproduces each blocking finding and records PASS, REVISE, or FAIL with the dropped and follow-up
  items. A fix round re-reviews only the fixes and stops after two failing rounds.
- A finding that repeats an earlier one becomes a check (Review Step 3.2): the smallest change that prevents or
  detects both occurrences. Closure then removes the held mistake. See [Lesson loop](lesson-loop.md).
- Check outcomes are passed, failed, or inconclusive, and the report's Checked list gives each one.

## Stage bars and domain bars

Review holds one stage bar each for Ideation, Planning, and Execution. The domain bars are preference skills of
nine to twelve checks that Review applies, not procedures: [Coding
Review](../../../skills/coding/coding-review/SKILL.md), [Authoring
Review](../../../skills/authoring/authoring-review/SKILL.md), and [Design
Review](../../../skills/design/design-review/SKILL.md). Each also checks structure (each Ontology unit's
definition, responsibility, boundary, and relations), commonality and variability, and vocabulary in its own terms,
using [Ontology](../feature/ontology-skill.md). The `review-depth` tokens, per-domain `report.md` templates,
contract labels, quality opinions, and the `<class>/<runtime>/` review tree are removed.

## Paths

- One report per reviewer from the [report template](../../../skills/review/report.md): a verdict (PASS or
  REVISE), findings, what was checked, and what was not.
- Workflow writes `<item-dir>/review/iteration-N/<reviewer>.md`, and the work item's receipt records the verdict.
- Cowork writes `tmp/review-NN/<reviewer>.md` in the current topic and records the verdict in the topic contract.
- A Partner reviewer returns its report as its final message and the caller saves it. There is no `gate.md`.
- The reviewer role has no edit tools and never reviews its own work. The manager accepts.

## Ownership

| Concern | Owner |
|---|---|
| Review SOP, report, verdict, fix rounds | [Review](../../../skills/review/SKILL.md) |
| Domain bars | Coding, Authoring, and Design Review preference skills |
| Workflow REVIEW placement | [Workflow](../../../skills/workflow/SKILL.md) |
| Cowork `review` call | [Cowork](../../../skills/cowork/SKILL.md) and [Cowork commits](cowork.md) |
| Brief, handoff, and check outcomes | [Delegation](../../../skills/delegation/SKILL.md) |
| Finding gate | [Gobbi](../../../skills/gobbi/SKILL.md#23-apply-the-session-wide-finding-gate) |
| Role contract | [Identity-and-load role contracts](identity-and-load-role-contracts.md) |

## History

Generic Evaluation and `skills/evaluation/` were removed earlier; the Checklist skill, `review-depth`, and the
per-domain Review procedures were removed with the shared Review skill (see the
[2026-11-12 history](../../history/2026-11-12-gobbi-skills-refactor.md)). Callers that still load those skills
fail. See remaining items in [Evaluation backlog](../../backlogs/evaluation.md).
