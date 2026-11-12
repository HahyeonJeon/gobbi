# Gobbi skills refactor

> Tracked Memory work account at `memory/reports/note/`. Omit Git action states and recovery commands.

**Completed at:** 2026-11-12T12:41:00Z

## Result

A Cowork session of twelve topics, then a Pstack comparison with accepted fixes, reshaped the skill system:
seven roles by phase, a general Delegation and a background Partner manual, goal-based planning, one shared
Review skill, a lesson loop, user-only Cleansing and Socratic Method skills, a six-field Ontology preference, and
a repository guard with a shipped skill checker. Review 03 and Review 04 passed at head `f1719808`. The
decisions live in their design homes:
[roles](../../design/process/identity-and-load-role-contracts.md),
[Review](../../design/process/evaluation.md), [lesson loop](../../design/process/lesson-loop.md),
[Partner](../../design/feature/partner.md), [Cleansing](../../design/feature/cleansing-skill.md),
[Socratic Method](../../design/feature/socratic-method-skill.md),
[Ontology](../../design/feature/ontology-skill.md), and
[Repository guard](../../design/architecture/repository-guard.md).

## Context

Base `develop` at `5a913d16`; work branch `refactor/gobbi-skills`; 28 commits. The session's accepted topics are
in the changelog's Unreleased section.

## Evidence

- `check_skills` reported 0 errors across 8 checks, `guard check` 0 errors across 12 checks, `tests/guard` 48 OK,
  and `tests/skill_checks` 56 OK.
- Review 03 passed for `f0a8d74f`, and Review 04 passed for the follow-ups, `bf02983c`, and `f1719808`.
- The `sentences` check found 11 violations where a review had listed 4, which is why a new check is run over
  the whole tree first (see the [work learning](../../learnings/work/tips.md)).

## Memory

Closure rewrote the `design/` statements the session made false (roles, role pins, Partner, Review, Cowork,
Delegation, Discussion, hooks status, the locator's root-pair owner, the sync script name, and the Authoring,
Design, and Coding family rows) and added designs for the guard, the lesson loop, Cleansing, and Socratic Method.
It added six learnings, one `Seen` occurrence, and 14 backlog items, and removed 17 backlog items whose subject
the session removed or finished.

## Remaining limits

Setup guides and README install steps still name the removed scripts and hooks until reimplementation. Nothing is
merged into `develop`; merge and publication need a separate request.
