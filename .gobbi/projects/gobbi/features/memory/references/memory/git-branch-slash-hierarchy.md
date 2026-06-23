---
name: git-branch-slash-hierarchy
description: Git layers a type/area/name namespace over a flat ref store, identity-stable and convention-enforced at write-time.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, git, design]
keywords: [namespace, branch-naming, slash-hierarchy, refactorable]
author: claude
title: Git branch slash-hierarchy as a namespace model
source: https://www.baeldung.com/ops/git-refs-branch-slash-name
accessed: 2026-06-21
ref_type: docs
---

# Git branch slash-hierarchy as a namespace model

## Insight

Git layers a `type/area/name` namespace over a flat ref store (`feature/ui/cli/x`, `hotfix/42687/buggy-thing`). It refuses a bare branch named like a type-prefix — the prefix behaves like a directory with refs nested under it — and supports wildcard selection of a whole prefix (`bug/*`). The convention is enforced by hooks/CI, not by the storage layer.

## Reason

The user framed the redesign as "refactorable like git branches." This is the literal model: a path-segment namespace (`{type}/{namespace}/{slug}`) over a flat addressable store, where the namespace is a convention enforced at write-time (the validator) and a record can be re-namespaced by moving it, because its identity (the slug) is stable. Invoke it when justifying the `{type}/{area}/{slug}.md` shape and the validator-as-write-gate enforcement.

## Source

- https://www.baeldung.com/ops/git-refs-branch-slash-name
- https://gist.github.com/revett/88ee5abf5a9a097b4c88

## Excerpt

"Git enforces a design principle where it refuses to have a standalone branch with the same name as an existing type prefix, which reinforces the image that types act like directories with branches nested within them."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored the area-namespace path shape + write-time enforcement decision (DP-2, DP-4) |

## Related

- [[johnny-decimal-bounded-namespace]] — the cap-and-curate complement to the slash-hierarchy model
