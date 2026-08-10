---
name: claude-plugin
description: "MUST load when authoring or reviewing the shared Gobbi Claude Code and Codex plugin package, manifests, marketplaces, projections, or install checks."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: tool
---

# Claude Plugin

Use this manual for the shared Gobbi package at `plugins/gobbi/`. It covers both plugin manifests, both
marketplaces, generated package components, repository-local discovery views, source checks, and isolated
installed-cache checks.

Canonical skills and agents remain outside the package. The package is a filtered generated projection:
every included path must match its canonical owner, while registered repository-only skill roots remain
available in local discovery and absent from shipped and installed plugin trees.

## Principles

### Keep one editable owner

Canonical files under `.gobbi/projects/gobbi/` are editable owners. Discovery mirrors, package components,
and installed caches are derived views whose differences must be explained by an explicit projection rule.

### Prove source and installed behavior separately

Source topology proves what the checkout intends to ship. Each real runtime install proves what that runtime
actually copied into its private cache; neither observation substitutes for the other.

### Make exclusions exact and local

A registered repository-only skill root is excluded only from the package skills projection and installed
caches. Canonical skills, repository-local Claude and Codex discovery, agents, and similarly named roots stay
complete.

### Fail closed on unsupported components

Gobbi ships no hooks. An unknown component, symlinked package entry, missing included path, extra installed
path, byte difference, or leaked repository-only root is a package failure.

## Rules

- **MUST edit only canonical skill and agent owners.** Reconcile discovery and package views through
  `scripts/sync-plugin-package.sh`; never hand-edit a derived file or link.
- **MUST validate every registered repository-only skill owner before any sync-managed mutation.** The owner
  must satisfy its exact real-directory, root-file, identity, type, navigation, and inventory contract.
- **MUST keep package skills as a filtered materialized real directory and compare every included file and
  directory with canonical.** Package agents remain complete and may use only the shapes the generator accepts.
- **MUST keep both manifests, marketplaces, entrypoints, role wrappers, local discovery, package projections,
  versions, and hook absence inside the source gate.** A failed preflight changes no owned surface.
- **MUST run both isolated installed-cache smokes when their accepted release or deployment contract requires
  them.** Each smoke uses the exact runtime executable and private homes, then compares the full installed tree
  and bytes with the filtered package.
- **NEVER treat an intentional registered repository-only omission as missing package content, or treat an
  unexpected included-path omission as intentional.** The exact projection predicate is the only distinction.

## Manual

### Package layout and projections

```text
.gobbi/projects/gobbi/
|-- skills/                         canonical complete skills
`-- agents/                         canonical complete agents

plugins/gobbi/
|-- .claude-plugin/plugin.json      Claude metadata
|-- .codex-plugin/plugin.json       Codex metadata and skills declaration
|-- skills/                         filtered generated real directory
`-- agents/                         complete generated component
```

Repository-local views remain complete:

| Surface | Required shape |
|---|---|
| `.agents/skills/{name}` | Whole-directory link to the canonical skill |
| `.claude/skills/{name}/` | Real directory with per-file links to the canonical skill |
| `plugins/gobbi/skills/` | Filtered real projection; included paths and bytes equal canonical |
| `plugins/gobbi/agents/` | Complete generated agents projection |
| `.claude/agents/{role}.md` | Link to the canonical role Markdown |
| `.codex/agents/{role}.toml` | Repository-local native role wrapper |

The package skills projection uses a registered exact top-level exclusion. It does not use frontmatter,
prefixes, globs, substring matching, or a second policy root. Package-side walks stay unfiltered so a forbidden
stale path, empty directory, or link remains visible as drift.

### Manifest and marketplace contracts

The Claude manifest is metadata-only. Claude Code discovers conventional package directories, so the
manifest declares no `skills`, `agents`, or `hooks` key.

The Codex manifest declares this supported component:

```json
{
  "skills": "./skills/"
}
```

It declares neither agents nor hooks. `.claude-plugin/marketplace.json` uses a string `source`, while
`.agents/plugins/marketplace.json` uses a local source object with `source.path`. Both point to
`./plugins/gobbi` through their ecosystem-specific schemas.

### Source reconciliation

Run the read-only source gate first:

```bash
bash scripts/sync-plugin-package.sh --check
```

It checks registered repository-only owners, manifests, marketplaces, versions, native entrypoints, role
wrappers, local discovery, filtered skills, complete agents, included-path bytes, and hook absence.

When the task authorizes repository-local mirror reconciliation, run:

```bash
bash scripts/sync-plugin-package.sh
bash scripts/sync-plugin-package.sh --check
```

Normal sync validates all owners and all mutation plans before changing a discovery surface. It never creates
or restores package skills as a canonical-tree link.

When the task authorizes package generation, run:

```bash
bash scripts/sync-plugin-package.sh --materialize-package
bash scripts/sync-plugin-package.sh --check
```

Materialization constructs the filtered skills and complete agents expected sets, prunes proved stale paths
without following links, copies canonical bytes, and verifies the result.

The fixture regression is:

```bash
bash scripts/test-sync-plugin-package.sh
```

It covers exact exclusion, similarly named inclusion, invalid-owner zero mutation, local completeness,
package omissions, extras, changed bytes, links, empty directories, entrypoint drift, and idempotence.

### Installed-cache checks

Run the real installed-cache checks only when the caller authorizes their isolated runtime effects:

```bash
bash scripts/check-claude-plugin-smoke.sh
bash scripts/check-codex-plugin-smoke.sh
```

Each script locks one exact executable, clears inherited environment state, binds private runtime homes,
installs from the local marketplace, derives the installed path from runtime output, proves resolved
containment, and compares every installed directory, file, and byte with `plugins/gobbi/`. It also rejects
hooks and every registered repository-only root or literal. The first failure preserves the private target and
stops; do not retry or delete that evidence by implication.

Claude's separate schema validation remains useful before a real install:

```bash
claude plugin validate --strict plugins/gobbi
```

It does not replace the isolated Claude install observation.

### Failure diagnosis

| Symptom | Inspect first | Response |
|---|---|---|
| Invalid repository-only owner | Exact canonical root and preflight diagnostic | Correct the canonical owner; prove all owned surfaces remained unchanged |
| Missing or stale local discovery | Canonical skill tree and sync preflight | Reconcile only with mirror-mutation authority |
| Missing included package path | Filtered expected inventory and canonical file | Regenerate; never classify it as an intentional exclusion |
| Leaked repository-only root | Package path, literal guard, and projection predicate | Stop publication and correct the generator or stale package |
| Manifest or marketplace rejection | Exact JSON owner and current runtime schema | Correct only the owning schema |
| Installed inventory or byte mismatch | Preserved private target and named package path | Keep the target; diagnose the first differing included path |
| Hook field or path | Manifest, package, settings, or installed cache | Stop; hooks are unsupported |
| Version disagreement | Both manifests and Claude marketplace | Re-align only to the user-approved release version |

## References
