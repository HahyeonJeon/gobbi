---
name: resolve-preset-conflict-via-published-artifact
description: A prose contradiction about a shipped preset's membership is settled by reading the published artifact's config construction, not by picking a prose page.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification]
keywords: [eslint-plugin-react-hooks, preset-membership, dist-tags, npm-tarball]
author: claude
priority: medium
domain: verification
---

# Resolve a config or preset contradiction against the published artifact, not either prose page

## What happened

Two sources disagreed about whether a lint plugin's compiler-powered rules were included in its
`recommended` preset or still opt-in: the vendor's own documentation page implied they were
included, and a secondary source said they were still opt-in with a plan to fold them in later.
Research correctly declined to pick a side and flagged the contradiction, because reading more
prose could not have settled it — both sources were internally coherent and neither was obviously
wrong. The contradiction was resolved by fetching the shipped package from the npm registry and
reading the preset's actual config construction: the current stable release's `recommended` export
listed every rule directly, settling the question that two prose pages could not.

## Why it happens

Prose documentation describes *intent* and generalizes; it can also lag the shipped release, or
describe a preset as the vendor plans it rather than as the current version constructs it. A
changelog, a docs page, and a blog post can each be honest and still disagree about a preset's
present membership, because they were written at different points in the release timeline. The
shipped package's config construction, by contrast, **is** the behavior — it is not a description
of the answer, it is the answer.

## Correct approach

Fetch the published artifact — the npm tarball, the wheel, the release asset — and read the config
construction directly, then cite that as the source, instead of trying to adjudicate between two
prose pages. This technique has a limit, so do not over-apply it: the artifact tells you what the
current release *does*, not what the vendor *intends next*. For direction of travel — a
deprecation plan, a rule scheduled to move presets in a future major — prose remains the source.
Use the artifact for present behavior and prose for future intent, and never let one answer the
other's question.

## How to detect

Any contradiction about a thing that is *shipped code* rather than a policy statement: preset or
config membership, a flag's default value, a rule's default severity, an enabled-by-default
feature, or which entries a bundled recommended set contains. The tell that prose cannot settle
it: two sources that both cite the same vendor and still disagree, or a doc page whose claim
cannot be dated against a specific released version.

## Related

- [[reresolve-release-state-at-authoring-time]] — same incident, the sibling trap: even a verified
  claim about the package's release channel and rule roster went stale between research and
  authoring time
