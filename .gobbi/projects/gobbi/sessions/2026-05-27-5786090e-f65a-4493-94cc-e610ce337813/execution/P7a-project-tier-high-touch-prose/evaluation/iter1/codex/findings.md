VERDICT: REVISE

## Summary

Commit `a04e509` mostly does the right thing: the edited learnings have the required learning sections, the edited active backlogs have the required backlog sections, the D5 evergreen-body scan only surfaced legitimate Source/literal-path hits, the staging-key leak gate is clean, and the changed files stay within the requested project-tier dirs. The remaining blocker is one edited design document that still fails the §4.2 ADR contract because it has no `## Consequences` section.

## Findings

- [checklist_gap] [Medium] [95] `design/memory-system-redesign.md` is missing the required ADR `## Consequences` section. The §4.2 contract says `design` docs must be ADR-shaped with `## Context` -> `## Decision` or `## Approach` -> `## Rationale` -> `## Alternatives considered` -> `## Consequences` (`.gobbi/projects/gobbi/skills/memorization/rules.md:175-181`). In the post-image, this file has `## Context` at `.gobbi/projects/gobbi/design/memory-system-redesign.md:24`, `## Decision (the locked design)` at `:28`, `## Rationale` at `:101`, `## Alternatives considered` at `:105`, then jumps to `## Related` at `:111` and `## Source` at `:118`. A direct heading scan confirms only the other two edited design docs contain `## Consequences`; `memory-system-redesign.md` does not. Add a `## Consequences` section that states the durable effects of the redesign, for example the shipped 7-feature memory model, the 13-type standard, Principle 13 as a standing gate, completed migration state, and deferred L8 follow-up.

## Judgment-call assessments

**Notes:** Accept the executor's choice not to reshape legacy notes. The notes template says journal entries are append-only history and are never edited after the session closes, while §4.3 explicitly treats notes as narrative/provenance-bearing rather than evergreen-strip targets. The existing notes are readable enough as journals even when their headings predate the current canonical template. No P7a finding.

**Closed backlog:** Accept the executor's handling of `backlogs/memory-redesign-remaining-waves.md`. It is already `status: closed` and `disposition: resolved` (`:7`, `:12`), so forcing it into an active-backlog pickup shape would be misleading. The added concrete `## Originating session` at `:86-88` is the right P7a prose touch; the next lifecycle action should be Wrap-up archive/move-on-terminal, not re-prosing the historical resume body.

**READMEs:** Not evaluated as P7a defects. The 5 index READMEs were untouched and are assigned to N1's README-nav-accuracy scope.

## Verification outputs

`git show --stat --oneline a04e509`

```text
a04e509 docs(prose): P7a - project-tier decisions+design+learnings+notes+backlogs §4.2 contracts + self-contained prose
 .../feature-dir-frontmatter-full-normalization.md  |  8 ++-
 .../backlogs/memory-redesign-remaining-waves.md    |  4 ++
 .../backlogs/normalize-path-conventions-h3.md      | 26 ++++++----
 .../stub-redirect-dangling-claude-skill-ref.md     | 12 ++---
 .../gobbi/design/archive-move-on-terminal-model.md | 29 ++++++++---
 .../gobbi/design/memory-system-redesign.md         | 35 +++++++++++--
 .../session-lifecycle-worktree-boundaries.md       | 59 +++++++++++++---------
 ...cking-authoritative-source-not-sibling-skill.md | 32 ++++++------
 .../dual-system-cross-mirror-drift-detection.md    | 11 ++--
 ...stem-divergence-catches-severity-underrating.md |  9 ++--
 .../locked-wording-supersedes-readability-nit.md   | 18 +++----
 .../sole-exception-phrasing-normalization.md       | 17 ++++---
 12 files changed, 169 insertions(+), 91 deletions(-)
```

D5 evergreen-body scan:

```text
.gobbi/projects/gobbi/design/memory-system-redesign.md:120:Originating session: `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/`. The full design artifact is at `ideation/artifacts/memory-system-redesign-design.md`; the locked 26-task migration plan is at `planning/rawdata/draft-iter1.md`; the eight locked decisions are at `ideation/rawdata/locked-decisions.md`, all under that session directory.
.gobbi/projects/gobbi/learnings/design-doc-cross-checking-authoritative-source-not-sibling-skill.md:41:patch the orchestration). The project mistake `leader-iter2-verification-claim-without-evidence`
.gobbi/projects/gobbi/learnings/design-doc-cross-checking-authoritative-source-not-sibling-skill.md:67:- `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md` - the project mistake describing the same class of error (a claim grounded in an un-cross-checked witness).
```

These D5 hits are legitimate: the first is a `## Source` footer; the other two are a literal mistake filename/path, not load-bearing session provenance.

§4.5 leak gate:

```text
NO MATCHES
```

Additional checks:

```text
rg -n '^## Consequences' .gobbi/projects/gobbi/design/memory-system-redesign.md .gobbi/projects/gobbi/design/archive-move-on-terminal-model.md .gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md
.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:87:## Consequences
.gobbi/projects/gobbi/design/archive-move-on-terminal-model.md:71:## Consequences (blast radius - what this refactor must touch)
```
