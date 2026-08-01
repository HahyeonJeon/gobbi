# Work Tips

## Investigate a dual-system disagreement instead of picking a side

**Context:** Independent Claude and Codex proposers disagree on a factual or design question during the same
task.

**Tip:** Disagreement between the two systems is often a signal that the question is genuinely unresolved,
not noise to average away. In one case Codex was right that a file both proposers were about to remove was
still live, because a smoke-test script actively created it; Codex also surfaced a bootstrap ordering paradox
that a Claude proposal had glossed over, while Claude was right that a proposed new top-level heading was
forbidden.

**Application:** When the two systems disagree, investigate the disagreement directly with fresh evidence
rather than defaulting to either system's answer.
