---
name: manifest-command-grep-dialect-bug
description: The D-e manifest's printed grep commands use BRE \| under grep -E, returning 0 on verbatim re-run
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, vocabulary-sweep, verification]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Manifest printed commands use BRE alternation under grep -E

## Context
The D-e command-derived manifest in draft-iter2 is the centerpiece of the iter1→iter2 remediation — replacing hand-counted figures with commands every reader can re-run. The manifest uses `T="memoriz\|session[ -]memor|project[ -]memor"` with `grep -rilE "$T"`. Under ERE (`-E`), the `\|` is a literal backslash-pipe, not alternation — so the B2, B7, and INT-2 commands return 0 instead of their stated counts. The underlying COUNTS are all ground-truth-correct (independently re-derived: 71, 49, 92, 21, 15 refs, 20+1 symlinks).

## Decision
Accept the finding as a non-blocking docs-sync cleanup. The counts are correct; only the printed command syntax is defective. Fix in Planning or Execution: change `\|` to `|` under `-E`, or drop `-E` and keep BRE `\|`. Also fix INT-2's `grep -v historical` (a no-op predicate → returns 53, not 49) to exclude the real historical path set.

## Rationale
The design direction is sound and the inventory is accurate. The failure is loud (0 vs N) and one-character-fixable. Planning's decomposition can proceed without this fix; it only affects re-verifiability of manifest rows.

## Alternatives considered
- Block Planning until fixed (rejected: overkill for a command-transcription error; counts are correct).
- Ignore (rejected: downstream consumers who copy-paste will get wrong results, undermining the manifest's core promise).

## Consequences
Planning brief includes a note to fix the dialect before the D-e sweep verification step runs. The fix must produce consistent results: every manifest row's command must yield the count printed beside it.

## Related
- `evaluation/iter2/claude/project.md` (PROJ-1), `evaluation/iter2/claude/consistency.md` (CONS-1), `evaluation/iter2/claude/overall.md` (OVR-1), `evaluation/iter2/codex/consistency.md` (codex-ideation-consistency-003)
