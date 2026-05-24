# Structure Evaluation - Planning iter2

## Artifact Summary + Memory Reads

Evaluated `draft-iter2.md`, a Planning iter2 task decomposition whose stated delta is limited to five fixes from iter1. The structural question is whether the dependency graph and verification fields now make the plan executable by fresh executors without hidden ordering or unavailable-tool assumptions.

Memory reads: `draft-iter2.md`; baseline `draft-iter1.md`; iter1 Codex `structure.md`; iter1 Claude `structure.md`, `consistency.md`, and `overall.md`; empirical `grep -n 'requires:' draft-iter2.md`; empirical `command -v shellcheck; echo "shellcheck-exit: $?"`; symlink check for `.claude/skills/orchestration/SKILL.md`; project rules and listed mistakes.

## Locked Frame (Stage 1)

Scenario S1: Dependency edges graph-enforce LOCK #1 T1 wave before T3 wave.
- Check: Task 07 `requires` includes both terminal T1 leaves, Task 05 and Task 06.
- Check: the dependency table repeats 05 -> 07 and 06 -> 07.

Scenario S2: Shared `orchestration/SKILL.md` edits are ordered.
- Check: Task 10 `requires` includes Task 06.
- Check: the dependency table records the 06 -> 10 edge.

Scenario S3: Shell-script verification is runnable in the current workspace.
- Check: `bash -n` is always run for Task 07 and Task 08.
- Check: `shellcheck` is conditional on `command -v shellcheck`.
- Check: shellcheck absence is documented for the executor commit body.

Scenario S4 (adversarial): A prose-only wave lock could still diverge from machine-readable `requires`.
- Check: task YAML, dependency table, and lane table all agree on the strengthened edges.

## Per-scenario Per-check Results

S1: yes. Task 07 has `requires: [05-five-phase-docs-per-iter-cadence, 06-direct-mode-opt-out-and-smoke-test]` at `draft-iter2.md:276`; the dependency table has Task 07 depending on `05, 06` at `draft-iter2.md:388`.

S2: yes. Task 10 includes `06-direct-mode-opt-out-and-smoke-test` in `requires` at `draft-iter2.md:347`; the dependency table repeats `01, 04, 06, 07, 08` at `draft-iter2.md:391`.

S3: yes. Task 07 always runs `bash -n` at `draft-iter2.md:285` and Task 08 at `draft-iter2.md:309`; shellcheck is conditional at `draft-iter2.md:286` and `:310`. Empirical check returned `shellcheck-exit: 1`, so the conditional path is needed and now documented.

S4: yes. The lane table states L4 is gated on L3 plus L2-step-06 at `draft-iter2.md:412`, and L6 depends on 06 at `draft-iter2.md:414`.

## Typed Findings

### shellcheck-verifier-not-runnable

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: addressed
- confidence: 98
- severity: High
- evidence: `command -v shellcheck` returned no executable with `shellcheck-exit: 1`, but `draft-iter2.md:285-286` and `draft-iter2.md:309-310` now make `bash -n` the always-run gate and shellcheck conditional only.
- surfaced-by: codex
- inherited-from: iter1/structure-shellcheck-verifier-not-runnable

### lock-graph-under-enforced

- finding-id: lock-graph-under-enforced
- type: design_flaw
- domain: structure
- disposition: addressed
- confidence: 96
- severity: High
- evidence: Claude iter1 F-STRUCT-1 requested adding Task 06 to Task 07 `requires`; `draft-iter2.md:276`, `:388`, `:399`, and `:412` now encode that edge.
- surfaced-by: codex
- inherited-from: iter1/structure-F-STRUCT-1

### orchestration-shared-file-edge-missing

- finding-id: orchestration-shared-file-edge-missing
- type: design_flaw
- domain: structure
- disposition: addressed
- confidence: 95
- severity: Medium
- evidence: Claude iter1 F-STRUCT-2 requested ordering Task 06 before Task 10; `draft-iter2.md:347`, `:391`, `:395`, and `:418` now encode 06 -> 10.
- surfaced-by: codex
- inherited-from: iter1/structure-F-STRUCT-2

## Low-confidence Appendix

No new structure High/Critical finding found. Claude iter1's non-blocking concerns about Tasks 07/08 size and `effort:` schema status remain outside the five surgical fixes, but they are not new and do not invalidate the dependency/shellcheck fixes under this prompt's verdict rule.

VERDICT: PASS
