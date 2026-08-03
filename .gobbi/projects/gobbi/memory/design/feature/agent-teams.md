# Agent Teams

## Intent

Agent Teams is Gobbi's compact tool manual for the experimental Claude Code team interface. It explains how
to enable, choose, create, coordinate, recover, and clean up a team. Native Codex has no Agent Teams interface
and uses Gobbi's repository custom-agent roles instead.

## Design

[`gobbi/agent-teams/SKILL.md`](../../../skills/gobbi/agent-teams/SKILL.md) is a 101-line, 576-word tool skill.
Its body is limited to an introduction, Principles, Rules, Manual, and References. It has no Procedure or
child document.

The manual keeps only Claude Code tool behavior and durable safety constraints:

- enable Agent Teams before starting Claude Code;
- use teams for independent work that benefits from shared tasks or teammate discussion;
- give parallel writers separate files or worktrees because the tool does not isolate edits;
- keep team creation, coordination, shutdown, and cleanup with the lead; and
- verify returned work independently because task and idle states are scheduling signals, not acceptance
  evidence.

## Ownership boundary

The tool skill does not own Gobbi orchestration policy. [`Cowork`](../../../skills/cowork/SKILL.md) and
[`Workflow`](../../../skills/workflow/SKILL.md) own assignment fields, role reuse boundaries, write ordering,
acceptance, and recovery evidence for their modes. The manual owns only Agent Teams setup, use, limits, and
cleanup.

This boundary keeps the tool explanation usable outside either mode and prevents mode-specific orchestration
policy from returning to the manual.

## References

- [Agent Teams compact tool skill review](../../reports/review/2026-08-02-agent-teams-tool-skill-review.md)
- [Plugin skill and agent locator](../architecture/plugin-skill-locator.md)
