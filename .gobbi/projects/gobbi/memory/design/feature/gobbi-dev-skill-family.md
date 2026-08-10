# Gobbi development lifecycle skill family

## Intent

The [Gobbi Development Lifecycle root](../../../skills/gobbi-dev/SKILL.md) is a navigation-only domain skill
for accepted Gobbi change work and independently triggered lifecycle lookup. It routes every matching request
to all applicable direct children and owns no child policy.

Broad pre-acceptance design stays with existing Ideation, Planning, Skill Writing, and Agent Writing owners
unless a `gobbi-dev` child trigger also applies. Review findings, Evaluation verdicts, and manager or user
acceptance remain separate records and decisions.

## Family and ownership

| Child | Type | Current owner |
|---|---|---|
| [`gobbi-dev-conventions`](../../../skills/gobbi-dev/gobbi-dev-conventions/SKILL.md) | Preference | Lifecycle names, topology, branch roles, handoff vocabulary, and evidence forms. |
| [`gobbi-dev-deployment`](../../../skills/gobbi-dev/gobbi-dev-deployment/SKILL.md) | Operation | Contained installation, verification, and recovery for one released package in caller-named isolated Claude Code and Codex targets. |
| [`gobbi-dev-development`](../../../skills/gobbi-dev/gobbi-dev-development/SKILL.md) | Operation | Realization of an accepted change contract through a verified local commit and exact lifecycle handoffs. |
| [`gobbi-dev-release`](../../../skills/gobbi-dev/gobbi-dev-release/SKILL.md) | Operation | Candidate preparation, Evaluation handoff, accepted promotion, publication, and recovery without taking acceptance or Git authority. |
| [`gobbi-dev-review`](../../../skills/gobbi-dev/gobbi-dev-review/SKILL.md) | Operation | Read-only scoped evidence and findings without an acceptance verdict. |
| [`gobbi-dev-testing`](../../../skills/gobbi-dev/gobbi-dev-testing/SKILL.md) | Operation | Exact-revision test evidence and failure routing without acceptance. |
| [`gobbi-dev-toolchain`](../../../skills/gobbi-dev/gobbi-dev-toolchain/SKILL.md) | Tool | Current Gobbi commands, prerequisites, effects, diagnostics, and recovery facts without action authority. |

The canonical family contains exactly ten files: the root, seven child skills, and release and deployment
checklists. It has no aliases, grandchildren, or additional support files.

## Lifecycle composition

- Development coordinates an already accepted change contract. Testing returns revision-bound evidence.
  Review returns scoped findings. Evaluation derives a criteria-based verdict. The manager or user accepts.
- Release prepares and freezes a candidate from `develop`. Evaluation judges that unchanged candidate before
  manager or user acceptance. Later promotion, tagging, and hosted publication require their own current Git,
  network, and credential authority.
- Deployment consumes one immutable released local package. It validates two absent, distinct direct-child
  targets under one caller-named isolation root, verifies Claude fully before Codex begins, and preserves exact
  partial state on failure. Removal requires separate fresh authority.
- Conventions and toolchain may load independently. Their judgments and facts never grant mutation, external,
  release, deployment, or acceptance authority.

## Local discovery and package exclusion

Canonical sources live in `.gobbi/projects/gobbi/skills/gobbi-dev/`. Repository-local Codex and Claude
discovery expose the full family through generated entrypoints and canonical-resolving links. The two native
entrypoint files remain byte equal.

The plugin package excludes exactly the top-level `gobbi-dev` skill family. The package contains no family
file, directory, link, or literal ownership route. Similarly named unrelated skills remain included. Both
package and entrypoint synchronizers validate the complete family contract before mutation and reject owner,
frontmatter, inventory, row, or description drift without changing any owned surface.

## Installed-runtime observation boundary

Runtime smoke tracing uses three separate policies:

1. `source-precheck` and `source-postcheck` each require exactly four ordered denied local stream probes with
   injected `EACCES`, no descriptor, and no effect.
2. Helper stages are strict. Every injected prohibited call stops the helper.
3. A fixed production wrapper may classify a complete denied call as a blocked no-effect probe only for its
   closed stage list. The record must end exactly with injected `EACCES`, return no descriptor or effect, and
   belong to a zero-status child.

The Codex production stages are exactly `version`, `marketplace-add`, `available-list`, `install`, and
`installed-list`. Claude adds `validate` to that same closed set. No caller-selected production policy or
unlisted stage is accepted.

Each production trace is a nonempty private regular file authenticated before and after launch. Parsing
requires complete anchored records and per-PID terminal closure. Successful local IPC requires exact
`AF_UNIX` or `AF_LOCAL` socket-pair evidence plus decoded descriptor provenance. Successful, malformed,
truncated, unfinished, resumed, wrong-error, unmarked, ambiguous, unclassified, or nonzero-child cases fail.
The boundary observes trusted supported runtimes. It is not a hostile-code sandbox, and a failed stage is not
replayed automatically.

Static parser tests and fixtures prove policy wiring only. They do not prove a production runtime PASS.

## Decisions to preserve

- Keep the root navigation-only and load every direct child whose exact trigger matches.
- Keep the seven globally prefixed child names and their five-operation, one-tool, one-preference type split.
- Keep `develop` as candidate integration and `main` as accepted release promotion unless a new accepted
  project contract changes those roles.
- Keep canonical, generated local, packaged, and installed surfaces distinct. Edit canonical owners and use
  synchronizers for derived views.
- Keep the entire family repository-local and preserve the exact top-level package exclusion.
- Keep source-exact, helper-strict, and fixed production semantic no-effect policies separate.
- Keep fixed wrappers, closed stages, authenticated traces, per-PID terminal closure, strict Unix
  descriptor provenance, one stage execution, and preserved first-failure evidence.

The completed [Gobbi development lifecycle skill family review](../../reports/review/2026-08-10-gobbi-dev-skill-family-review.md)
records implementation evidence, evaluation dispositions, and remaining limits.
