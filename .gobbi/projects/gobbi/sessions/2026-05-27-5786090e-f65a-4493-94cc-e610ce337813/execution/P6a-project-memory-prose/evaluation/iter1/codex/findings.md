VERDICT: REVISE

## Summary

Commit `f367095` passes the mechanical Part A gates I could verify: all 32 live `features/project-memory` docs now have `type:` matching their directory, the 5 references preserve the old source subtype in `ref_type:`, the named residue grep is empty, the §4.5 leak gate is empty, and the diff is scoped to `features/project-memory/`.

The prose pass is not complete. Two `design/` docs still use the old `Problem / Scope / Approach / Validation / Trade-offs / Open issues` shape instead of the §4.2 ADR-shaped design contract. The tree also still renders two intentionally-dangling `skills/claude/SKILL.md` mentions as active markdown links, so the cross-reference gate fails. Separately, the commit touched 31 files while the live project-memory tree has 32 docs; the omitted file is `checklists/symlink-edit-target-merge-back-flag.md`.

## Findings

- [checklist_gap] [High] [95] The two `design/` docs still fail the §4.2 design section contract. The standard requires `decisions` and `design` docs to be ADR-shaped: `## Context` -> `## Decision` or `## Approach` -> `## Rationale` -> `## Alternatives considered` -> `## Consequences` (`.gobbi/projects/gobbi/skills/memorization/rules.md:177`). `design/dev-doc-memory-standard.md` still has `## Problem`, `## Scope`, `## Approach`, `## Scenarios`, `## Validation`, `## Trade-offs`, and `## Open issues` instead (`.gobbi/projects/gobbi/features/project-memory/design/dev-doc-memory-standard.md:21`, `:29`, `:42`, `:69`, `:81`, `:89`, `:96`). `design/memorization-moment-of-capture.md` likewise has `## Problem`, `## Scope`, `## Approach`, `## Validation`, `## Trade-offs`, and `## Open issues` (`.gobbi/projects/gobbi/features/project-memory/design/memorization-moment-of-capture.md:19`, `:23`, `:27`, `:31`, `:36`, `:40`). This is a direct miss against the "§4.2 COMPLETE" scope.

- [general] [Medium] [90] Two body references to the deliberately missing Claude skill are still active markdown links, so the cross-reference resolver reports broken links. `triplicate-backlog-remediated.md` renders `[claude skill](skills/claude/SKILL.md)` (`.gobbi/projects/gobbi/features/project-memory/decisions/triplicate-backlog-remediated.md:20`), and `coupling-mischaracterization-deferred.md` renders the same link (`.gobbi/projects/gobbi/features/project-memory/decisions/coupling-mischaracterization-deferred.md:20`). Since these docs are documenting a dangling link, the literal should be code text or otherwise non-clickable; as written, it is an unresolved inline path-link.

- [general] [Low] [90] The execution coverage claim is inconsistent: the evaluator prompt says P6a covers 32 docs, and the live tree has 32 non-archive docs, but `git show --stat f367095` reports only 31 changed files. The omitted doc is `.gobbi/projects/gobbi/features/project-memory/checklists/symlink-edit-target-merge-back-flag.md` (`:1`-`:14`). It already has `type: checklists`, but it was not part of the claimed 32-doc prose pass.

## Part A check

- Type-match: PASS. All 32 live non-archive docs under `features/project-memory/` match their canonical directory type; mismatch command printed nothing.
- Type changes: 16 files changed from evaluator/finding subtype values to directory types, matching the brief: 2 `checklist_gap -> checklists`, 9 decision/finding subtypes -> `decisions`, and 5 `code/docs/blog -> references`.
- `ref_type`: PASS. The 5 references preserve the old subtype as `ref_type:`: `code`, `docs`, `blog`, `blog`, `blog`.
- Residue keys: PASS. The required grep for `addressed-*`, `finding_ids`, `finding-id`, `surfaced-by`, `confidence`, and `severity` returned empty.
- KEEP preservation: PASS for checked keys. `domain`, `title`, `source`, `ref_type`, `related`, and `decision_status` remain present where they existed or were required.

## Cross-ref resolution check

Markdown/frontmatter path-link resolver over the whole live `features/project-memory` tree found two unresolved links, both to the intentionally missing `skills/claude/SKILL.md` path:

```text
.gobbi/projects/gobbi/features/project-memory/decisions/triplicate-backlog-remediated.md:20 broken markdown link -> skills/claude/SKILL.md
.gobbi/projects/gobbi/features/project-memory/decisions/coupling-mischaracterization-deferred.md:20 broken markdown link -> skills/claude/SKILL.md
```

All other markdown/frontmatter path-links resolved.

## Verification outputs

`git show --stat --oneline --no-renames f367095`:

```text
f367095 docs(prose): P6a — features/project-memory §4.2 contracts + self-contained prose + 16 type-frontmatter fixes
31 files changed, 380 insertions(+), 246 deletions(-)
```

Changed-file scope:

```text
git diff-tree --no-commit-id --name-only -r f367095 | awk '!/^\.gobbi\/projects\/gobbi\/features\/project-memory\// {print}'
<empty>
```

Live doc count vs changed doc count:

```text
find .gobbi/projects/gobbi/features/project-memory -name '*.md' -not -path '*/archive/*' | wc -l
32

git show --name-only --format= f367095 -- .gobbi/projects/gobbi/features/project-memory | sed '/^$/d' | wc -l
31
```

Type-match mismatch output:

```text
<empty: all 32 live docs matched expected directory type>
```

Reference `ref_type` output:

```text
adr-decision-record-shape.md: type: references; ref_type: code
diataxis-type-purity.md: type: references; ref_type: docs
docs-as-code-linting.md: type: references; ref_type: blog
frontmatter-as-schema.md: type: references; ref_type: blog
markdown-memory-atomicity.md: type: references; ref_type: blog
```

Residue grep:

```text
grep -rnE '^(addressed-in-iter|addressed-how|addressed-by|finding_ids|finding[-_]id|surfaced[-_]by|confidence|severity):' .gobbi/projects/gobbi/features/project-memory/ --include='*.md'
<empty>
```

D5 body/session-coordinate scan:

```text
.gobbi/projects/gobbi/features/project-memory/design/dev-doc-memory-standard.md:75:- **Edge (half-narrative):** a migrated design doc with `T1-I-2` / `draft-iter3.md:308` in the
.gobbi/projects/gobbi/features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md:77:T0 blocks everything. Wave 1 (T1-T9c) runs after T0; split-feature halves are chained (T3→T4, T6→T7).
```

Both D5 hits are legitimate: the first is a teaching example inside a bad-doc scenario, and the second is the plan's own dependency graph.

§4.5 leak gate:

```text
find .gobbi/projects/gobbi/features/project-memory -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
<empty>
```
