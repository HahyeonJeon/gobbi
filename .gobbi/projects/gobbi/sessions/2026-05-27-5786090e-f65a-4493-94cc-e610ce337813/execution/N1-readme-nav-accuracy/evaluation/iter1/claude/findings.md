VERDICT: PASS

## Summary

N1 (commit `3792cae`, 14 files +88/-15) makes the `## Subdirectories` section
of 17 of the 18 in-scope READMEs strictly match `ls -d <dir>/*/` basenames,
and uses `_None — this is a leaf directory; ... live as sibling .md files._`
placeholders for all 9 project-tier leaf READMEs. The 4 already-accurate
feature READMEs (`features/{git-workflow,guardrails,install-runtime,workflow}/README.md`)
were untouched per minimal-edit discipline; their bullet lists were verified
against live `ls` and match exactly.

The root README (`.gobbi/projects/gobbi/README.md`) lists 12 memory-tier
subdirs as bullets under `## Subdirectories` and disposes of the 4
non-memory surfaces (`skills/`, `agents/`, `sessions/`, `tmp/`) in a
trailing prose sentence. Under a strict reading of "entries == basenames"
this is a partial gap, but it is consistent with the §4 memory-standard
scope (READMEs index memory tiers; non-memory surfaces are explicitly
out-of-scope). Recorded as Low/informational, not a blocker.

§4.5 leak-gate over READMEs is clean (zero matches). All added cross-refs
resolve (`features/README.md`, `design/memory-system-redesign.md`). Scope
adherence is intact (only `README.md` files touched).

No Critical or High findings. The work is faithful to the spec and the
commit message's claims survive per-README diffing.

## Findings

[general] [Low] [75] Root README disposes of 4 non-memory surfaces
(`skills/`, `agents/`, `sessions/`, `tmp/`) via a trailing prose
sentence rather than as bullet entries under `## Subdirectories`.
This is consistent with the §4 memory-standard scope (memory tiers
only) but is a minor deviation from a strict literal reading of
"entries == `ls -d` basenames". The footnote does name all 4
surfaces, so the information is present and discoverable — no
navigational dead-end. Disposition: open / acceptable-as-designed
pending user decision on whether the trailing sentence counts as
satisfying the spec. Evidence:
`.gobbi/projects/gobbi/README.md:14-30` (12 bulleted entries +
trailing "Non-memory surfaces ... skills/, agents/, sessions/, tmp/"
sentence at the end); live `ls -d .gobbi/projects/gobbi/*/` returns
16 entries (agents, archive, backlogs, decisions, design, features,
learnings, mistakes, notes, plans, references, reviews, rules,
sessions, skills, tmp).

[general] [Low] [100] `features/project-memory/README.md` lists
`mistakes/` with the qualifier "currently holds no feature-scoped
entries — project-scope mistakes live under the project-tier
`mistakes/` dir". This is accurate (live `ls` shows the dir exists;
it is empty), but a reader who follows the link expecting content
will find an empty dir. This is a documentation-truth observation,
not a bug — disposition: addressed (qualifier text already explains
the absence).
Evidence: `.gobbi/projects/gobbi/features/project-memory/README.md:36`.

## Per-README nav-accuracy table

| # | README | Live basenames | Listed entries | Verdict |
|---|--------|----------------|----------------|---------|
| 1 | `.gobbi/projects/gobbi/README.md` | 16 (incl. skills/agents/sessions/tmp) | 12 bullets + 4 in footnote | PASS (with Low note above) |
| 2 | `features/README.md` | 7 | 7 (agents, evaluation, git-workflow, guardrails, install-runtime, project-memory, workflow) | PASS |
| 3 | `features/agents/README.md` | 7 (backlogs, changelogs, checklists, design, discussions, references, scenarios) | 7 | PASS |
| 4 | `features/evaluation/README.md` | 5 (changelogs, decisions, design, discussions, references) | 5 | PASS |
| 5 | `features/git-workflow/README.md` | 9 (backlogs, changelogs, checklists, decisions, design, discussions, plans, references, scenarios) | 9 | PASS (untouched) |
| 6 | `features/guardrails/README.md` | 5 (backlogs, changelogs, checklists, discussions, references) | 5 | PASS (untouched) |
| 7 | `features/install-runtime/README.md` | 9 (archive, backlogs, changelogs, checklists, decisions, design, discussions, references, scenarios) | 9 | PASS (untouched) |
| 8 | `features/project-memory/README.md` | 10 (backlogs, changelogs, checklists, decisions, design, discussions, mistakes, plans, references, scenarios) | 10 | PASS |
| 9 | `features/workflow/README.md` | 8 (archive, backlogs, changelogs, checklists, decisions, design, discussions, plans) | 8 | PASS (untouched) |
| 10 | `backlogs/README.md` | 0 | `_None_` | PASS |
| 11 | `decisions/README.md` | 0 | `_None_` | PASS |
| 12 | `design/README.md` | 0 | `_None_` | PASS |
| 13 | `learnings/README.md` | 0 | `_None_` | PASS |
| 14 | `mistakes/README.md` | 0 | `_None_` | PASS |
| 15 | `notes/README.md` | 0 | `_None_` | PASS |
| 16 | `plans/README.md` | 0 | `_None_` | PASS |
| 17 | `references/README.md` | 0 | `_None_` | PASS |
| 18 | `reviews/README.md` | 0 | `_None_` | PASS |

Cross-refs added: `features/README.md` (root README) and
`design/memory-system-redesign.md` (features/README.md) both resolve.

## Verification outputs

### §4.5 leak gate on READMEs

```
$ find .gobbi/projects/gobbi -name 'README.md' \
    -not -path '*/archive/*' -not -path '*/sessions/*' \
    -not -path '*/skills/*' -not -path '*/tmp/*' \
    -not -path '.gobbi/projects/gobbi/agents/*' -print0 \
  | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
<no output — exit 123 from xargs means grep matched nothing in any file>
```

### git stat

```
$ git show 3792cae --stat
 .gobbi/projects/gobbi/README.md                        | 17 +++++++++++++++++
 .gobbi/projects/gobbi/backlogs/README.md               |  4 ++++
 .gobbi/projects/gobbi/decisions/README.md              |  4 ++++
 .gobbi/projects/gobbi/design/README.md                 |  4 ++++
 .gobbi/projects/gobbi/features/README.md               | 12 ++++++++++++
 .gobbi/projects/gobbi/features/agents/README.md        | 16 ++++++++++++----
 .gobbi/projects/gobbi/features/evaluation/README.md    |  4 +---
 .gobbi/projects/gobbi/features/project-memory/README.md| 18 ++++++++--------
 .gobbi/projects/gobbi/learnings/README.md              |  4 ++++
 .gobbi/projects/gobbi/mistakes/README.md               |  4 ++++
 .gobbi/projects/gobbi/notes/README.md                  |  4 ++++
 .gobbi/projects/gobbi/plans/README.md                  |  4 ++++
 .gobbi/projects/gobbi/references/README.md             |  4 ++++
 .gobbi/projects/gobbi/reviews/README.md                |  4 ++++
 14 files changed, 88 insertions(+), 15 deletions(-)
```

Scope check: all 14 changed paths are `README.md` files under
`.gobbi/projects/gobbi/`. No out-of-scope files touched.

## Must-preserve list

- Strict accuracy of the 17 fully-conforming bullet-list READMEs (the
  9 leaf `_None_` placeholders + 8 feature/index READMEs).
- Minimal-edit discipline (4 already-accurate feature READMEs left
  untouched; commit message documents this explicitly).
- The wording of leaf placeholders distinguishing project-scope
  vs. feature-scope and loop-written vs. maintainer-authored plans
  (plans/README.md's "Loop-written plans live under
  `features/{feature}/plans/`" is a load-bearing distinction).
- The features/project-memory/README qualifiers that explain why
  `backlogs/` and `mistakes/` exist as empty subdirs.
- The root README footnote explicitly carving out non-memory
  surfaces from the memory-standard.

## Overall verdict

PASS. The work substantively delivers what the spec asked for: 18
READMEs whose Subdirectories sections match live on-disk reality.
The single Low finding on the root README's footnote treatment is
acceptable-as-designed under the §4 memory-standard scope and does
not warrant a REVISE.
