# Claude Docs Audit

Audit of the living `.claude/` documentation as of 2026-04-03. This report checks machine-verifiable drift: broken internal references, filesystem mismatches, and whether the documented audit tooling currently works.

## Scope

- `.claude/CLAUDE.md`
- `.claude/README.md`
- `.claude/rules/`
- `.claude/skills/`
- `.claude/agents/`
- `.claude/project/gobbi/`

Historical notes under `.claude/project/gobbi/note/` were excluded.

## Method

- Read the canonical entry docs and project docs.
- Compared documented paths against the current repository tree.
- Ran the bundled audit scripts from `.claude/skills/_audit/scripts/`.

## Findings

### High: `.claude/project/gobbi/design/claude-docs.md` is materially stale

The inventory doc claims to reflect the current repository state, but several entries point to files that do not exist.

- `project-context.md` is listed at `.claude/skills/gobbi/project-context.md`, but the actual file is `.claude/skills/gobbi/project-setup.md`. See `claude-docs.md:155`.
- The gotcha inventory points to centralized files like `.claude/skills/_gotcha/_orchestration.md` and `.claude/skills/_gotcha/_git.md`, but the current repo stores gotchas next to each skill as `gotchas.md` inside the skill directory. See `claude-docs.md:166-177` and `claude-docs.md:239`.
- Benchmark scenario 2 is listed as `.claude/skills/__benchmark/benchmarks/scenario-02-gobbi-claude-skills-skill-creation.md`, but the actual file is `.claude/skills/__benchmark/benchmarks/scenario-02-skills-skill-creation.md`. See `claude-docs.md:186`.

Because the document is an inventory, these stale entries undermine its primary purpose.

### High: `.claude/project/gobbi/design/structure.md` describes repo areas that are not present

The structure doc describes plugin and CLI layout that is not in the current tree.

- It documents `plugins/gobbi/`, `.claude-plugin/marketplace.json`, and `templates/`, but none of those paths exist in this checkout. See `structure.md:85-108`.
- It says the CLI source lives in `src/` and `packages/market/`, but neither path exists. See `structure.md:112-118`.

This creates a misleading picture of the repository's current architecture.

### Medium: the bundled audit automation is not currently usable

Two scripts in `.claude/skills/_audit/scripts/` fail immediately when run from the repository root:

- `audit-references.sh .claude` exits with `syntax error in conditional expression: unexpected token ')'`
- `audit-conventions.sh .claude` exits with `syntax error in conditional expression: unexpected token ')'`

`audit-commands.sh .claude` succeeds.

The `_audit` skill advertises these scripts as the way to automate reference and convention checks, so this is a real maintenance gap even though it is a tooling issue rather than a content issue.

### Medium: `.claude/project/gobbi/README.md` overstates what lives under `design/`

The project README says `design/` covers "vision, architecture, workflow, agents, evaluation, state, hacks, distribution, GSD analysis", but the current directory contains only:

- `architecture.md`
- `claude-docs.md`
- `structure.md`

See `README.md:9`.

## Clean Areas

- Root entry docs exist and are easy to locate.
- The documented `.claude/project/gobbi/` subdirectories now exist.
- Command references checked by `audit-commands.sh` passed in this review.

## Recommended Fix Order

1. Update `.claude/project/gobbi/design/claude-docs.md` to match the current tree.
2. Rewrite `.claude/project/gobbi/design/structure.md` around the repo that actually exists now, or mark future-state sections clearly as planned.
3. Repair the broken `_audit` scripts so the drift checks are runnable again.
4. Tighten `.claude/project/gobbi/README.md` so its directory descriptions match current contents.
