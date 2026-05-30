# Performance Perspective - Codex Evaluation

## Artifact Summary + Memory reads

The performance surface is install/update payload size and cache churn, not runtime hot paths. I rechecked the iter-1 repo-root payload finding against the revised bounded package decision, the cache-contents gate, and local payload sizes (`sessions` is the dominant payload under `.gobbi/projects/gobbi/`).

## Locked Frame (Stage 1)

- Scenario: install/update copies only the intended plugin payload.
- Scenario: the cache validation catches accidental inclusion of session memory or project memory.
- Scenario (adversarial): the package avoids empty symlink installs but balloons through accidental source-root selection.

## Per-scenario per-check results

- The revised package scope explicitly excludes session memory, project memory, and repo content.
- The success criteria include a post-install cache-contents allow-set gate.
- The remaining source-path ambiguity is recorded under Structure rather than duplicated here.

## Iter-1 Finding Status

### PERF1 - Repo-root source has no payload budget despite cache-copy semantics: RESOLVED

- Evidence: `draft-iter2.md:81-83` adds a post-install cache-contents gate allowing only `skills/`, `agents/`, and `hooks/`; `draft-iter2.md:309-317` replaces repo-root with a bounded package and explicitly cites the 77M sessions payload as the reason. Local verification confirms `.gobbi/projects/gobbi/sessions` is 77M while current skills/agents/hooks are small.
- Assessment: The performance issue was the same root cause as R1. The bounded package and cache gate resolve it at Ideation level.

## Typed findings

None.

## Low-confidence appendix

None.
