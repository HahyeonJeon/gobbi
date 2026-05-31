---
name: bounded-package-root-path-unnamed
description: Plugin package root path and marketplace source value not yet named; Planning must fix to prevent inferring incorrectly
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, marketplace, layout]
supersedes: null
superseded_by: null
decision_status: proposed
---

# Name the bounded plugin package root path and the marketplace `source` value

## Context

The iter-2 design (DD-2) ratified a "dedicated, self-contained package directory" for the `gobbi` plugin. The directory contains exactly: `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`. However, the draft never names the PARENT path of this package (e.g., `plugins/gobbi/`, `.gobbi-plugin/`, or something else).

The `marketplace.json` entry requires a `source` field. Relative sources resolve from the marketplace root; local relative sources resolve to the main checkout (not the worktree). Without a named `source` value, Planning could accidentally use `./` (repo root) as the source, which would recreate the R1 cache-payload problem (77M `.gobbi/.../sessions` tree in the global plugin cache) that DD-2 was specifically designed to prevent.

Codex evaluator flagged this as STRUCT-1 (Medium/75): "The whole R1 fix depends on the marketplace source pointing at the bounded package, not at the repo root."

## Decision

**OPEN — Planning must resolve before writing implementation tasks.** Must name:

1. The exact package root path (e.g., `plugins/gobbi/` to match the prior `plugins/gobbi-core` shape, or a different dedicated subtree).
2. The exact `marketplace.json` plugin `source` value corresponding to that root.

The bounded-cache invariant (allow-set = skills/agents/hooks only) MUST be attached to whichever path is chosen so Planning can verify it.

## Rationale

The prior `plugins/gobbi-core` package (62b95a0) used a bounded `plugins/gobbi-core/` subtree — that shape is the proven prior art. Using a similar `plugins/gobbi/` subtree would be the "boring-by-default" choice. The `source` in `marketplace.json` would then be `"./plugins/gobbi"` (relative to the marketplace file location).

## Alternatives considered

- **Defer to Execution:** Risk — Execution could choose a path that re-introduces R1. The decision is structural and must be made at Planning.
- **Use `.claude-plugin/` at repo root:** The `.claude-plugin/` naming convention is used for the manifest inside the package (`.claude-plugin/plugin.json`), not the package parent. Could be confusing.
- **Use `plugins/gobbi/` subtree:** Matches prior art (62b95a0 used `plugins/gobbi-core/`); clear separation from repo root; the `source` value is precise and auditable.

## Consequences

Once the path is named, the cache-contents gate success criterion (allow-set assertion) can be written against a specific directory. The marketplace `source` value can be verified against the doc's relative-path resolution behavior.

## Related

- `ideation/evaluation/iter2/codex/structure.md` STRUCT-1
- `ideation/staging/references/marketplace-json-schema-and-skills-dir-plugins.md`
- `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`
- `ideation/staging/references/prior-gobbi-core-plugin-package-history.md`
