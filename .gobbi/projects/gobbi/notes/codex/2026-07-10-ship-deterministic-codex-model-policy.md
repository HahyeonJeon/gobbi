---
name: ship-deterministic-codex-model-policy
description: Shipped one explicit Codex model and reasoning policy across native, bridge, validation, and plugin surfaces.
type: notes
scope: project
feature: null
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, process, verification]
keywords: [gpt-5.6-sol, xhigh, plugin-0.5.2, compatibility-self-test]
author: codex
related: [deterministic-codex-model-policy, native-defaults-and-settings-shipped, policy-docs-and-validator-shipped, release-metadata-and-integration-gates-shipped]
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [native-defaults-and-settings-shipped, policy-docs-and-validator-shipped, release-metadata-and-integration-gates-shipped, evaluator-retry-overwrote-canonical-files, auto-mode-research-overgated, scope-summary-omits-named-surfaces, single-quoted-jq-apostrophe, json-patch-ambiguous-sibling-field]
---

# Deterministic Codex model policy

## What happened

The session researched the published Codex model and configuration surfaces, locked one explicit policy, prepared the repository authorities, and decomposed the work into three ordered tasks. The user selected `gpt-5.6-sol` and `xhigh` for every live Codex role, required explicit model and effort overrides on Claude-hosted `codex exec` calls, included skills, agents, plugins, templates, and validators, and excluded historical records.

Execution committed native defaults and settings first, aligned the policy owners and compatibility validator second, then synchronized the plugin release metadata and ran the full integration boundary. The final release candidate at `138e49171806efad0f341c90aa8bfce59604d5b4` contains exactly 19 tracked modified files relative to `develop`.

Wrap-up inventoried 86 staged records. It promoted 82 records, converted one explicitly deferred cost-measurement item to a feature backlog, and dropped three duplicate mistake candidates with their source staging preserved. Ten mistake-candidate routes were confirmed by the user before memory writes began.

## What shipped

- Native defaults and settings: `c70de262ed5baac75b88f82f19b551733ef1d15d`, indexed by `features/workflow/changelogs/codex/2026-07-10-native-defaults-and-settings-shipped.md`.
- Policy owners and validator self-test: `7d043fe41a7edfe8c66ef4c2bdd6854cf3deb379`, indexed by `features/workflow/changelogs/codex/2026-07-11-policy-docs-and-validator-shipped.md`.
- Plugin metadata and complete release gates: `138e49171806efad0f341c90aa8bfce59604d5b4`, indexed by `features/workflow/changelogs/codex/2026-07-11-release-metadata-and-integration-gates-shipped.md`.
- The durable implementation plan at `features/workflow/plans/codex/2026-07-10-deterministic-codex-model-policy.md` and the supporting workflow decisions, designs, scenarios, checklists, references, discussions, and reviews.
- Three skill-owned mistake sections across the discussion and evaluation companions, plus three cross-cutting project mistakes under `mistakes/assumption/` and `mistakes/tooling/`.
- The script-owned `.claude/skills/discussion/mistakes.md` symlink for the new canonical discussion companion; plugin-package synchronization passes.
- A low-priority deferred measurement item at `features/workflow/backlogs/codex/uniform-xhigh-cost-remains-accepted.md`; it does not change or block the accepted runtime policy.

## What got stuck

No implementation work remains. Wrap-up initially paused because seven mistake candidates had not been included in the first Always-Ask routing decision. The manager surfaced them as one grouped decision, the user confirmed the routes, and memorization resumed without guessing.

The Codex installed-cache smoke check still reports four known warnings for symlinked plugin components omitted from the installed cache. Source topology, marketplace registration, installation, enablement, and manifests pass. Repository policy forbids materializing the symlinked source package as a workaround.

## What shifted

The initial scope count grew from 18 to 19 tracked files when live research found the current Git wrapper-policy statement. Planning needed three iterations to turn prose checks into runnable, fail-closed contracts. During Execution, the compatibility validator gained five isolated negative fixtures, and the final plugin package version moved from `0.5.1` to `0.5.2`.

One planning record, `retain-cohesive-task02-load`, had been marked as a mistake candidate even though it documented an accepted task-cohesion decision. Wrap-up removed only the mistaken routing classification and promoted the underlying feature decision normally.

## Decisions to respect

- Keep the exact model identifier `gpt-5.6-sol` and reasoning effort `xhigh` on every live Codex role unless a later user-authorized policy change replaces them.
- Keep explicit `-m gpt-5.6-sol -c 'model_reasoning_effort="xhigh"'` overrides on every current Claude-hosted Codex proposer and evaluator command.
- Preserve scalar model leaves in the Auto and Chat settings templates; do not add an unused effort field.
- Treat the current policy, validator assertions, workflow owner pointer, and plugin version as one release unit.
- Preserve historical files unchanged and do not materialize plugin symlink directories to hide installed-cache limitations.

## Next session

No follow-up is required for this release. Start a new scoped workflow only if maintainers want measured `xhigh` cost data, need to react to a future Codex CLI change, or intentionally revise the model policy.

## Related

- [[deterministic-codex-model-policy]] — the ordered implementation plan.
- [[native-defaults-and-settings-shipped]] — native configuration task.
- [[policy-docs-and-validator-shipped]] — policy and self-test task.
- [[release-metadata-and-integration-gates-shipped]] — final release boundary.
