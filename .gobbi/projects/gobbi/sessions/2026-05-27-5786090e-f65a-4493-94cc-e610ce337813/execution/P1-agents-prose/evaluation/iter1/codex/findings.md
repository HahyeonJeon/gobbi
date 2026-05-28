VERDICT: REVISE

## Summary

Commit `999a403` improves most of the prose and keeps the changed paths scoped to live `features/agents/` files, with the D5 scan and frontmatter leak gate clean after review. It still leaves a High self-containment/content defect in the D-reference checklist and several §4.2 template-shape gaps, so the honest verdict is REVISE.

## Findings

- [general] [severity: High] [confidence: 95] `.gobbi/projects/gobbi/features/agents/checklists/d-ref-codes-missing-inline-expansion.md:16` says the checklist covers four opaque codes (`D-3-3`, `D-4`, `D-5`, `D-9`), but the actionable table only creates items for `D-3-3`, `D-4`, and `D-9` at lines 20-22, and the detail sections only define those same three at lines 26-40. The preimage at `git show 999a403^:.../d-ref-codes-missing-inline-expansion.md` line 18 explicitly carried "D-5 skip rationale"; the reshaped file keeps `D-5` as an unresolved code but drops the "skip rationale" content with no replacement item, no explanation, and no notes/source destination. That violates §4.1/§4.3 self-contained prose and leaves one checklist item un-actionable for a zero-context executor.
- [design_flaw] [severity: Med] [confidence: 95] The four changed `references/` docs still fail the references body contract. The references template requires `## Related` as body content between `## Insight` and `## Why it applies` (`.gobbi/projects/gobbi/skills/memorization/templates/references.md:59-65`), but the changed files carry only frontmatter `related:` and jump from `## Insight` to `## Why it applies`: `autogen-pydantic-tool-schema-validation.md:15,20,23`, `claude-code-agent-sdk-task-output.md:15,20,41`, `langgraph-skill-catalog-pattern.md:15,20,23`, and `rbac-matrix-single-source-of-truth.md:15,20,23`. Frontmatter `related` is not a substitute because the template says the related material belongs in the body.
- [design_flaw] [severity: Med] [confidence: 90] `.gobbi/projects/gobbi/features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md` still does not match the scenario template. The template requires body `**Category:**` and `**Coverage:**` fields before `## Situation`, and a `## Related` section (`.gobbi/projects/gobbi/skills/memorization/templates/scenarios.md:54-69`). The actual file keeps `category: failure-mode` in frontmatter at line 11, has no body coverage field, and ends with `## Source` at line 39 instead of `## Related`.
- [design_flaw] [severity: Low] [confidence: 85] `.gobbi/projects/gobbi/features/agents/discussions/2026-05-24-shared-executor-context-continuity.md` omits the discussions template's required `## Related` section (`.gobbi/projects/gobbi/skills/memorization/templates/discussions.md:54-70`). The preimage line 41 named a companion decision path, but the reshaped file ends with `## Source` at lines 39-41 and does not carry that relationship forward into a body `## Related` section.

## Concern assessments

(a) description de-crypt: Acceptable. The changed `description:` values replace task-code shorthand such as `T2` / `T3` with the actual subject (`Load-Directives validator`, `agents[] hook`, etc.). §4.4's KEEP rule protects the key from being stripped; it does not freeze opaque values that can be made more self-contained while preserving meaning.

(b) no notes/ file: Mostly acceptable. I did not find a session-journal narrative that was compressed out and should have been reclassified to `notes/`; the diffs mostly convert evergreen decisions, backlogs, discussions, and references into type-shaped prose. The `D-5` problem above is not a missing-notes issue, but a checklist/content omission inside the same file.

(c) references ## Related: Not acceptable. The references template explicitly requires `## Related` as body content, and all four changed reference files omit it. This is a §4.2 body-section gap even though their frontmatter `related:` keys were preserved.

## Verification outputs

### D5 scan

Command:

```bash
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/agents/ --include='*.md' | grep -vE '/archive/'
```

Output:

```text
.gobbi/projects/gobbi/features/agents/design/execution-intake-notes-cross-cutting.md:43:.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
.gobbi/projects/gobbi/features/agents/design/execution-intake-notes-cross-cutting.md:49:.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
```

Assessment: legitimate literal file paths to a mistake document, not load-bearing session-coordinate leaks.

### §4.5 leak gate

Command:

```bash
find .gobbi/projects/gobbi/features/agents -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
```

Output:

```text
<no output>
```

Assessment: 0 files printed, so no §4.5 leak files were found.

### git stat / scope

Command:

```bash
git show 999a403 --stat
```

Output:

```text
commit 999a403f2ccbe3451d4c28761ecae3a67f10ee5c
Author: HahyeonJeon <jeonhh0061@gmail.com>
Date:   Wed May 27 10:22:37 2026 +0000

    docs(prose): P1 — features/agents §4.2 section contracts + self-contained prose

    AI-Provenance-Record: gobbi://session/5786090e-f65a-4493-94cc-e610ce337813/task/P1-agents-prose

 .../privacy-retention-agents-metadata-deferred.md  | 24 +++-----
 .../d-ref-codes-missing-inline-expansion.md        | 41 ++++++++-----
 .../design/execution-intake-notes-cross-cutting.md | 70 +++++++++++++++-------
 .../design/memorization-delegation-hard-gate.md    | 22 +++++--
 ...026-05-24-shared-executor-context-continuity.md | 18 +++---
 .../scope-literal-ask-vs-broader-verifier.md       | 27 +++++----
 .../autogen-pydantic-tool-schema-validation.md     | 12 ++--
 .../claude-code-agent-sdk-task-output.md           |  8 +--
 .../references/langgraph-skill-catalog-pattern.md  |  8 +--
 .../rbac-matrix-single-source-of-truth.md          |  8 +--
 .../hook-silence-no-agents-mutation-diagnostic.md  |  2 +-
 11 files changed, 146 insertions(+), 94 deletions(-)
```

Scope assessment: the changed paths are all under `.gobbi/projects/gobbi/features/agents/`; no `archive/` paths were touched.
