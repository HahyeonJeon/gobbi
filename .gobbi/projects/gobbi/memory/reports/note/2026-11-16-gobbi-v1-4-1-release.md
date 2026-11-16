# Gobbi v1.4.1 release

**Completed at:** 2026-11-16T17:35:01Z

## Result

[Gobbi v1.4.1](https://github.com/HahyeonJeon/gobbi/releases/tag/v1.4.1) is the latest stable GitHub Release.
The marketplace, four runtime manifests, README badge, and dated changelog agree on 1.4.1. The user named 1.4.1;
the release has breaking changes, and the README and changelog state the patch version as the user's explicit
Semantic Versioning exception.

The release came from a measurement of the ten most recent Claude Code sessions run under Gobbi. Subagents were
about 90% of the cost, reviewer runs about 25% of subagent cost with fix passes about 14% more, and runs over
200 requests about 53% of subagent cost. The user chose one review and fix point for small work and two or three
for large work, a lean manager charter in the entry skill, and one entry script.

| Item | Verified result |
|---|---|
| Review points | `30345d0e` on `develop` |
| Manager charter and entry script | `37a9474e` on `develop` |
| Design and Authoring guidance | `e96dd40d` on `develop` |
| Release commit | `20ad83e2ba0023e0cd09554855b0b93c5c82ace3` on `develop` |
| Main integration | `bb084f6981c5f98035bb5376210d8926df4e16b0`, tree equal to the release commit |
| Tag | Annotated `v1.4.1`, object `abdbf3e5195fbec1eac1342b7dbb36895d565cae`, at the main integration commit |
| Notes | The dated 1.4.1 changelog section |

## Evidence

- Before publication: guard check 0 errors (12 checks), check_skills 0 errors, `tests/guard` 48 OK,
  `tests/skill_checks` 56 OK, `tests/entry` 7 OK.
- Review: a Claude reviewer and Grok returned REVISE on the review points and on the charter and entry script;
  after one fix pass each, the reviewer confirmed every blocking finding resolved. One Claude reviewer returned
  PASS on the Design and Authoring guidance. Codex was unavailable on a usage limit.
- Origin reports `develop` at the release commit, `main` at the integration commit, and the same tag object;
  GitHub reports the release as latest, not draft, not prerelease, target `main`.

## Remaining limits

- No session has run under the new skills in Claude Code, Codex, Cursor, or Grok, so the saving is not measured.
  The review and fix loop was the pool the change targets, not the saving.
- Long subagent runs have no mechanism yet.
- The CI job `Skill checks (Python 3.9)` fails at setup because the `ubuntu-latest` runner no longer offers
  Python 3.9. It failed the same way for 1.4.0, and it now also holds the entry script tests, which a reviewer
  ran by hand on Python 3.9.25.
- Five follow-ups from the review-points review stay open: an early-finished task can be reviewed twice, no
  merge rule exists when more than three fan-in points apply, Cowork's next `review-NN` can collide with a
  plan's number, a `review` call with no subject does not mention uncommitted changes, and the confirm-only
  wording does not cover a REVISE at Workflow Wrap-up.

Net change: [Gobbi v1.4.1 published](../../history/2026-11-16-gobbi-v1-4-1-published.md).
