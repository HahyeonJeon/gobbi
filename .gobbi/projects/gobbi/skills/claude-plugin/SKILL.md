---
name: claude-plugin
description: Use when authoring or reviewing the shared Gobbi Claude Code and Codex plugin package, manifests, marketplaces, source topology, or install checks.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: tool
---

# Claude Plugin

Tool manual for the shared Gobbi package at `plugins/gobbi/`. Use it when a change touches either plugin manifest, either marketplace, the package components, runtime discovery mirrors, or the source and installed-cache checks.

The package serves two runtimes, but it has one canonical source tree. This manual explains the package boundary and the commands that prove it. Workflow behavior, role authority, and release decisions remain with their own owners.

## Principles

### Keep canonical sources outside the package

Canonical skills and agents under `.gobbi/projects/gobbi/` are the only editable owners. The package publishes one generated copy of them that a guard proves byte-equal to canonical; any other duplicate, or a hand edit of a generated file, breaks that single-owner rule.

### Keep source topology separate from installed-cache behavior

`scripts/sync-plugin-package.sh --check` proves the checked-out source package, manifests, marketplaces,
entrypoints, role wrappers, and discovery mirrors. `scripts/check-codex-plugin-smoke.sh` installs the package
into an isolated Codex home and compares every installed file path and byte with the source package. A source
pass does not predict installed-cache dereferencing.

### Let each ecosystem own its manifest shape

The Claude manifest is metadata-only because Claude Code discovers conventional `skills/` and `agents/` directories. The Codex manifest declares the `skills` component explicitly. Native Codex role wrappers remain repo-local and are not a plugin component.

### Fail closed on unsupported components

Gobbi ships no hook component. The package, both manifests, project Claude settings, source checker, sync tests, and installed-cache smoke all enforce that absence. A new component requires a separate user-approved design and current CLI evidence.

## Rules

### Must follow

- **CP-1 — Edit canonical owners.** Change skills under `.gobbi/projects/gobbi/skills/` and agents under `.gobbi/projects/gobbi/agents/`. Do not hand-edit their package or discovery views.
- **CP-2 — Keep the package bounded.** `plugins/gobbi/` contains the two manifests plus the `skills` and `agents` component directories. It contains no project memory or repository-wide documentation.
- **CP-3 — Keep the Claude manifest metadata-only.** Do not add `skills`, `agents`, or `hooks` keys to `plugins/gobbi/.claude-plugin/plugin.json` for the current conventional layout.
- **CP-4 — Keep the Codex manifest explicit and supported.** `plugins/gobbi/.codex-plugin/plugin.json` declares `"skills": "./skills/"`. It does not declare agents or hooks.
- **CP-5 — Keep marketplaces ecosystem-specific.** `.claude-plugin/marketplace.json` uses a string `source`. `.agents/plugins/marketplace.json` uses a local source object with `source.path`.
- **CP-6 — Preserve the release decision.** Change manifest or marketplace versions only when the user-approved release task requires it. When a version changes, keep both manifests and the Claude marketplace entry equal.
- **CP-7 — Verify both layers.** Run sync source checks and the isolated Codex smoke. When Claude Code is installed, also run strict Claude plugin validation.
- **CP-8 — Treat installer omission as package failure.** When an installed cache omits or changes any package
  file, fail with the installed-tree mismatch instead of hiding it. The generated package copy is the one
  permitted answer to the Codex installer not following a symlinked component; add no other copy and hand-edit
  no generated file.

### Must not follow

- Do not add a hook directory, hook manifest field, project hook registration, or development hook link.
- Do not register `.codex/agents/*.toml` as plugin agents. They are repo-local native Codex entrypoints.
- Do not hand-edit `.agents/skills/`, `.claude/skills/`, or `plugins/gobbi/{skills,agents}`.
- Do not use one marketplace schema as the template for the other.
- Do not infer installation success from source files alone.
- Do not change a version, reinstall a plugin, or mutate a marketplace merely to make a local source edit visible unless the user authorized that operation.

## Manual

### Package layout and owners

```text
.gobbi/projects/gobbi/
|-- skills/                         canonical skill owners
`-- agents/                         canonical role pairs

plugins/gobbi/
|-- .claude-plugin/plugin.json      Claude metadata
|-- .codex-plugin/plugin.json       Codex metadata plus skills component
|-- skills/                         generated copy of the canonical skills
`-- agents/                         generated copy of the canonical agents
```

The two component directories hold real files, not symlinks, because the Codex installer does not follow a symlinked component and installs nothing behind one. The sync command generates them from the canonical tree and proves every generated file byte-equal to its owner. A wrong generated file means the canonical owner or the generator is wrong: correct that and regenerate, and never hand-edit the generated file.

The package has no `hooks` entry. Empty untracked directories are not components, but any file, symlink, manifest field, settings block, or installed-cache directory for hooks is invalid.

Runtime views have different shapes:

| Surface | Shape | Owner |
|---|---|---|
| `.agents/skills/{name}` | whole-directory symlink to one canonical skill | sync command |
| `.claude/skills/{name}/` | real directory with per-file symlinks to one canonical skill | sync command |
| `plugins/gobbi/skills/` | generated real directory, byte-equal to canonical skills | sync command |
| `plugins/gobbi/agents/` | generated real directory, byte-equal to canonical agents | sync command |
| `.claude/agents/{role}.md` | hand-owned symlink to the canonical role Markdown | agent-writing contract |
| `.codex/agents/{role}.toml` | hand-owned symlink to the canonical role wrapper | agent-writing contract |

Claude Code uses the package `agents/` directory. Native Codex uses the five repo-local `.codex/agents/*.toml` wrappers. The wrappers point to the protected canonical Markdown role documents.

### Manifest contracts

The Claude manifest at `plugins/gobbi/.claude-plugin/plugin.json` contains package metadata such as `name`, `version`, `description`, `author`, `license`, and `keywords`. Claude Code discovers the conventional package directories without component keys.

The Codex manifest at `plugins/gobbi/.codex-plugin/plugin.json` contains the same package identity plus its Codex interface metadata and this component field:

```json
{
  "skills": "./skills/"
}
```

The outer object contains the full metadata; the snippet shows only the component contract. The current Codex manifest schema rejects a `hooks` field, and Gobbi has no hook component in either runtime.

### Marketplace contracts

The Claude marketplace file is `.claude-plugin/marketplace.json`. Its Gobbi entry uses:

```json
{
  "name": "gobbi",
  "source": "./plugins/gobbi"
}
```

The Codex marketplace file is `.agents/plugins/marketplace.json`. Its Gobbi entry uses:

```json
{
  "name": "gobbi",
  "source": {
    "source": "local",
    "path": "./plugins/gobbi"
  }
}
```

Keep the remaining marketplace metadata in its ecosystem's schema. The sync checker validates both source pointers and the Gobbi entry identity.

### Source reconciliation

Run the read-only source gate first:

```bash
bash scripts/sync-plugin-package.sh --check
```

It validates:

- both manifests and both marketplace pointers;
- equal non-empty versions across both manifests and the Claude marketplace;
- `AGENTS.md`, `.codex/AGENTS.md`, and `.claude/CLAUDE.md` entrypoints;
- all five canonical role pairs and both runtime wrapper symlinks;
- `.agents/skills` discovery links;
- the per-file `.claude/skills` mirror;
- `plugins/gobbi/{skills,agents}`;
- in-process Agent Teams settings; and
- explicit absence of hook components and registrations.

If only a script-owned mirror has drifted and the current task authorizes reconciliation, run:

```bash
bash scripts/sync-plugin-package.sh
bash scripts/sync-plugin-package.sh --check
```

Normal sync performs a complete fail-closed preflight before its first mirror mutation. It never creates hooks. Do not run it when the task forbids mirror mutation or while another writer is changing canonical skills.

The focused sync test is:

```bash
bash scripts/test-sync-plugin-package.sh
```

It covers safe reconciliation, unsafe mirror entries, idempotence, bounded traversal, owner moves, manifest and marketplace drift, role-wrapper drift, and injected hook rejection.

### Claude validation

When `claude` is available, validate the package without installing it:

```bash
claude plugin validate --strict plugins/gobbi
```

A validation failure is a package failure. Read the exact manifest or component error before changing anything. Do not add redundant component keys to silence discovery problems.

For a real user-authorized install, the marketplace-qualified name is selected from the configured marketplace. Installation, update, removal, and publication mutate external state and remain outside a read-only package review.

### Codex installed-cache smoke

Run:

```bash
bash scripts/check-codex-plugin-smoke.sh
```

The smoke creates an isolated `CODEX_HOME`, registers the repository as the `gobbi-workspace` marketplace, installs `gobbi@gobbi-workspace`, and verifies:

- the plugin is available, installed, and enabled;
- both manifests reached the installed cache;
- no hook field or hook directory reached the cache;
- both components are materialized directories before the install;
- the cache top level contains only manifests, skills, and agents; and
- every packaged manifest, skill, and agent file reached the cache at the same path with the same bytes.

A missing or byte-different installed path is always a failure, never a limitation to note. The smoke's
negative fixture proves that an omitted nested leaf and changed installed bytes both fail complete-tree
comparison. The installer copies nothing behind a symlink at any depth, which breaks a package two ways, and
the check reports them separately because they have different repairs. A symlinked component root delivers no
component at all and fails before the install. A symlink left inside a materialized component directory drops
exactly that path and fails after it. Both name `--materialize-package`. A hook component is always a failure.

### Failure diagnosis

| Symptom | Owner to inspect | Required response |
|---|---|---|
| Wrong or dangling package/discovery symlink | `scripts/sync-plugin-package.sh` and canonical target | Confirm the raw target; reconcile only when authorized |
| Stale or missing `.claude/skills` leaf | canonical skill tree plus sync output | Classify mirror drift; never hand-edit the leaf |
| Manifest or marketplace rejection | failing JSON file plus current CLI validation | Correct the owning schema without changing unrelated metadata |
| Missing role wrapper | canonical role pair and hand-owned runtime symlink | Restore the exact role symlink; do not create a new role |
| Installed skill omitted | isolated smoke output and installed path | Check the named package path for a symlink, then regenerate the package rather than copying the file |
| Any hook path or manifest field appears | package, settings, or cache preimage | Stop and remove the unsupported component within the authorized scope |
| Version disagreement | both manifests and Claude marketplace | Re-align to the user-approved release version |

## References

- [Repository runtime contract](../../../../../AGENTS.md)
- [Native Codex tool manual](../codex/SKILL.md)
- [Agent-writing wiring owner](../agent-writing/SKILL.md)
- [Skill-writing owner](../skill-writing/SKILL.md)
- [Source topology command](../../../../../scripts/sync-plugin-package.sh)
- [Source topology tests](../../../../../scripts/test-sync-plugin-package.sh)
- [Codex installed-cache smoke](../../../../../scripts/check-codex-plugin-smoke.sh)
- [Claude plugin manifest](../../../../../plugins/gobbi/.claude-plugin/plugin.json)
- [Codex plugin manifest](../../../../../plugins/gobbi/.codex-plugin/plugin.json)
