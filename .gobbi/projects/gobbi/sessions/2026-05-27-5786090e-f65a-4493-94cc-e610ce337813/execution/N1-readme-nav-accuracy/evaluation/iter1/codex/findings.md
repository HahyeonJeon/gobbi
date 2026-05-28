VERDICT: REVISE

## Summary

Commit `3792cae` keeps scope to README files and the §4.5 README leak gate prints no matching files. Seventeen of the eighteen in-scope READMEs satisfy the nav-accuracy check: their `## Subdirectories` sections either list exactly the live `ls -d <dir>/*/` basenames or, for leaf dirs, use a `_None_` placeholder.

One primary acceptance check fails in the root README. The live root contains 16 subdirectories, but the bullet list under `.gobbi/projects/gobbi/README.md` `## Subdirectories` has only 12 entries. The four live subdirectories `agents/`, `sessions/`, `skills/`, and `tmp/` are mentioned together in a trailing prose sentence, not represented as one list entry per live subdir as the prompt requires. Because the prompt says to compare listed entries against `ls -d` output and flag missing entries as real defects, this is a REVISE.

## Findings

[general] [High] [100] `.gobbi/projects/gobbi/README.md` does not list every live root subdirectory as a `## Subdirectories` entry. Verified live output is `agents archive backlogs decisions design features learnings mistakes notes plans references reviews rules sessions skills tmp`; the section's bullet entries are only `archive backlogs decisions design features learnings mistakes notes plans references reviews rules`. The missing list entries are `agents/`, `sessions/`, `skills/`, and `tmp/`. The prose sentence at line 30 names those directories, but the spec requires one entry per live subdir, and the mandated listed-entry extraction catches only the 12 bullet entries. Evidence: `.gobbi/projects/gobbi/README.md:15`; `.gobbi/projects/gobbi/README.md:17`; `.gobbi/projects/gobbi/README.md:30`; `ls -d .gobbi/projects/gobbi/*/`.

## Per-README nav-accuracy table

| # | README | Live subdirs | Listed entries | Verdict |
|---|---|---:|---:|---|
| 1 | `.gobbi/projects/gobbi/README.md` | 16 | 12 bullet entries; 4 prose mentions | REVISE |
| 2 | `.gobbi/projects/gobbi/features/README.md` | 7 | 7 | PASS |
| 3 | `.gobbi/projects/gobbi/features/agents/README.md` | 7 | 7 | PASS |
| 4 | `.gobbi/projects/gobbi/features/evaluation/README.md` | 5 | 5 | PASS |
| 5 | `.gobbi/projects/gobbi/features/git-workflow/README.md` | 9 | 9 | PASS |
| 6 | `.gobbi/projects/gobbi/features/guardrails/README.md` | 5 | 5 | PASS |
| 7 | `.gobbi/projects/gobbi/features/install-runtime/README.md` | 9 | 9 | PASS |
| 8 | `.gobbi/projects/gobbi/features/project-memory/README.md` | 10 | 10 | PASS |
| 9 | `.gobbi/projects/gobbi/features/workflow/README.md` | 8 | 8 | PASS |
| 10 | `.gobbi/projects/gobbi/backlogs/README.md` | 0 | `_None_` | PASS |
| 11 | `.gobbi/projects/gobbi/decisions/README.md` | 0 | `_None_` | PASS |
| 12 | `.gobbi/projects/gobbi/design/README.md` | 0 | `_None_` | PASS |
| 13 | `.gobbi/projects/gobbi/learnings/README.md` | 0 | `_None_` | PASS |
| 14 | `.gobbi/projects/gobbi/mistakes/README.md` | 0 | `_None_` | PASS |
| 15 | `.gobbi/projects/gobbi/notes/README.md` | 0 | `_None_` | PASS |
| 16 | `.gobbi/projects/gobbi/plans/README.md` | 0 | `_None_` | PASS |
| 17 | `.gobbi/projects/gobbi/references/README.md` | 0 | `_None_` | PASS |
| 18 | `.gobbi/projects/gobbi/reviews/README.md` | 0 | `_None_` | PASS |

Root README detail:

```text
.gobbi/projects/gobbi/README.md: REVISE | live=agents,archive,backlogs,decisions,design,features,learnings,mistakes,notes,plans,references,reviews,rules,sessions,skills,tmp | listed=archive,backlogs,decisions,design,features,learnings,mistakes,notes,plans,references,reviews,rules
  missing=agents,sessions,skills,tmp extra=-
```

## Verification outputs

`git show 3792cae --stat --oneline`:

```text
3792cae docs(prose): N1 — README Subdirectories nav accuracy across 18 P_live READMEs
 .gobbi/projects/gobbi/README.md                        | 17 +++++++++++++++++
 .gobbi/projects/gobbi/backlogs/README.md               |  4 ++++
 .gobbi/projects/gobbi/decisions/README.md              |  4 ++++
 .gobbi/projects/gobbi/design/README.md                 |  4 ++++
 .gobbi/projects/gobbi/features/README.md               | 12 ++++++++++++
 .gobbi/projects/gobbi/features/agents/README.md        | 16 ++++++++++++----
 .gobbi/projects/gobbi/features/evaluation/README.md    |  4 +---
 .../projects/gobbi/features/project-memory/README.md   | 18 ++++++++++--------
 .gobbi/projects/gobbi/learnings/README.md              |  4 ++++
 .gobbi/projects/gobbi/mistakes/README.md               |  4 ++++
 .gobbi/projects/gobbi/notes/README.md                  |  4 ++++
 .gobbi/projects/gobbi/plans/README.md                  |  4 ++++
 .gobbi/projects/gobbi/references/README.md             |  4 ++++
 .gobbi/projects/gobbi/reviews/README.md                |  4 ++++
 14 files changed, 88 insertions(+), 15 deletions(-)
```

Scope check:

```text
$ git show 3792cae --name-only --format='' | awk 'NF && $0 !~ /README\.md$/ {print}'
<no output>
```

§4.5 leak gate:

```text
$ find .gobbi/projects/gobbi -name 'README.md' -not -path '*/archive/*' -not -path '*/sessions/*' -not -path '*/skills/*' -not -path '*/tmp/*' -not -path '.gobbi/projects/gobbi/agents/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
<no output; xargs exit=123 because grep matched nothing>
```

Cross-ref checks:

```text
features/README.md exists
project-root design/memory-system-redesign.md exists
features-relative design/memory-system-redesign.md missing
```

The added Markdown link from the root README to `features/README.md` resolves. The added inline code reference `design/memory-system-redesign.md` resolves from the project-memory root, but not relative to `.gobbi/projects/gobbi/features/README.md`; I did not classify that as a blocking finding because it is not a Markdown link and the project-memory file exists at the named project-root path.
