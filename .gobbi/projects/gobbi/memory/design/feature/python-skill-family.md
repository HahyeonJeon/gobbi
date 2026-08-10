# Python skill family

## Intent

The [Python root](../../../skills/python/SKILL.md) is a navigation-only domain skill. It routes Python work to
every applicable direct child and owns no child policy. The family has eleven direct children: six operations,
one tool, and four preferences. Project configuration and the supported project policy decide concrete tools,
frameworks, layouts, backends, resolvers, support ranges, and commands.

## Family and ownership

| Child | Type | Current owner |
|---|---|---|
| [`python-conventions`](../../../skills/python/python-conventions/SKILL.md) | Preference | Project-overridable written form, naming, comments, documentation, and formatting judgment. |
| [`python-debugging`](../../../skills/python/python-debugging/SKILL.md) | Operation | Reproduction, isolation, and root-cause diagnosis of runtime symptoms. |
| [`python-design`](../../../skills/python/python-design/SKILL.md) | Preference | Runtime/API contracts, errors, ownership, resource lifetime, and public-transition intent. |
| [`python-development`](../../../skills/python/python-development/SKILL.md) | Operation | Bounded implementation change and review. |
| [`python-packaging`](../../../skills/python/python-packaging/SKILL.md) | Operation | `pyproject.toml` semantics, distribution identity, artifacts, installed behavior, and metadata provenance. |
| [`python-performance`](../../../skills/python/python-performance/SKILL.md) | Operation | Measured performance evidence and causal conclusions. |
| [`python-project-structure`](../../../skills/python/python-project-structure/SKILL.md) | Preference | General workspace and lifecycle-aware placement. |
| [`python-release`](../../../skills/python/python-release/SKILL.md) | Operation | Immutable-artifact readiness, authorized verification coordination, and recovery. |
| [`python-testing`](../../../skills/python/python-testing/SKILL.md) | Operation | Executable correctness evidence and its limits. |
| [`python-toolchain`](../../../skills/python/python-toolchain/SKILL.md) | Tool | Interpreter, environment, project-pinned tool, and diagnostic facts. |
| [`python-typing`](../../../skills/python/python-typing/SKILL.md) | Preference | Static type-modeling judgment, not runtime validation. |

`python-project-structure` owns ordinary organization. `python-packaging` also loads when a layout changes
package discovery, artifact content, installed imports, or installed-consumer evidence. Every child owns one
local, unchecked, result-free `checklists.md` source. The family has no grandchild skills.

## Lifecycle and projection decisions

Public API or support-range changes use project policy. Design states supported consumers, compatibility,
migration or replacement, warning or documentation behavior, and a removal or review condition. Testing binds
the selected support matrix or explicit unsupported positions. Packaging binds that policy to `Requires-Python`,
dependencies, static or dynamic metadata sources, declared build-environment requirements, and artifact-metadata
agreement.

Canonical sources are `.gobbi/projects/gobbi/skills/python/` and the Python row in the Gobbi language map.
`plugins/gobbi/skills/python/` is the materialized package projection. Claude and agent discovery resolve to the
canonical source. The repository sync script is the only projection writer; repair source first, then reconcile
and verify the projections.

Only three local passages were safely compacted: toolchain observation interpretation, the
project-structure distribution-layout preference, and the packaging release handoff. Their nearby Rules and
local checklists retain the required standalone boundary. This reduced local repetition but did not shrink the
complete family; the accepted lifecycle revision added 176 words.

## Deferred concerns

Do not add a generic `python-lifecycle` or `python-build` child: neither has its own load trigger and outcome.
Security, observability, and concurrency each need a distinct approved trigger and owner. Operations, support,
deployment, incident response, and native-delivery/ABI policy are product- or artifact-specific, not baseline
Python policy. Publication, credentials, yanking, deletion, rollback, and other external mutation remain outside
this family’s authority. The completed [lifecycle review](../../reports/review/2026-08-09-python-skill-family-lifecycle-review.md)
records the accepted verification scope.
