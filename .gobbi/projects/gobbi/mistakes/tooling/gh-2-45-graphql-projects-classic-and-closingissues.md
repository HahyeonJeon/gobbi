---
name: gh-2-45-graphql-projects-classic-and-closingissues
description: "On this repo, gh 2.45.0 `gh pr edit` hits a Projects-classic GraphQL error and `--json closingIssuesReferences` is unsupported — use `gh api` REST."
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [tooling, git]
keywords: [gh-cli, graphql, projects-classic, closingIssuesReferences, labels, rest-api]
author: claude
priority: medium
domain: tooling
---

# gh 2.45.0 on this repo: `gh pr edit` GraphQL "Projects classic" error + unsupported `closingIssuesReferences`

## What happened

On this repository, with `gh` CLI version 2.45.0, two documented git-lifecycle commands fail:
- `gh pr edit <num> --add-label <type>` (P4 step 4) fails with a GraphQL **"Projects classic"**
  error — the version's `gh pr edit` path touches a deprecated Projects-classic GraphQL field the
  API no longer serves.
- `gh pr view <num> --json closingIssuesReferences` (P5 step 6 / P8 issue-classification) fails —
  the `closingIssuesReferences` JSON field is **unsupported** on this `gh` version, so the documented
  closing-issue detection cannot run as written.

A run that trusts the documented `gh pr edit` / `--json closingIssuesReferences` path stalls the PR
labeling and the issue-close detection.

## Why it happens

The gobbi git skill documents the modern `gh` interface, but the installed CLI (2.45.0) predates /
diverges from it: its `gh pr edit` still issues a Projects-classic GraphQL mutation, and its `gh pr
view` JSON schema does not yet expose `closingIssuesReferences`. The docs and the installed binary
drift — the command name resolves but its server-side path or JSON field is gone/absent.

## Correct approach

Use the **REST API via `gh api`** instead of the high-level porcelain for both operations:
- **Labels:** `gh api repos/{owner}/{repo}/issues/<num>/labels -f labels[]=<type>` (REST add-label),
  not `gh pr edit --add-label`.
- **Closing-issue detection:** detect by PR-association through REST — the timeline /
  cross-reference API (`gh api repos/{owner}/{repo}/issues/<n>/timeline`) and the commit→PR
  association (`gh api repos/{owner}/{repo}/commits/<sha-or-branch>/pulls`) — not `gh pr view --json
  closingIssuesReferences`.
REST is stable across these `gh` versions where the porcelain GraphQL path is not.

## How to detect

You are about to hit this trap when: `gh pr edit` returns a GraphQL error mentioning **"Projects
classic"**; `gh pr view --json closingIssuesReferences` errors as unknown/unsupported field; or
`gh --version` reports 2.45.0 (or any version with the same Projects-classic GraphQL behavior).
On any of these, switch the operation to the `gh api` REST equivalent above.

## Related

- [[edit-tool-silent-write-failure-on-worktree]] — a related tooling silent-failure trap
