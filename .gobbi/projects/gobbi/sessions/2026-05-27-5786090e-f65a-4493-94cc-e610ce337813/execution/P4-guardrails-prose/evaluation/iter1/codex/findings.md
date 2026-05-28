VERDICT: REVISE

## Summary

The prose wave is not clean. The diff stayed in `features/guardrails/` and the frontmatter leak gate is clean, but the post-image still violates the section-4 body contracts and one precise reference was weakened instead of re-pointed to an existing promoted file. These are fixable documentation issues, so the verdict is REVISE rather than FAIL.

## Findings

1. [general] [high] [95] The companion empirical reference was removed/softened even though the target exists elsewhere in project memory.

   Evidence: `features/guardrails/references/claude-code-posttooluse-hook-schema.md:93` now says the transcript JSONL shape was "verified empirically during the guardrails Ideation" without linking the reference. The pre-image at `d24c61c^:.gobbi/projects/gobbi/features/guardrails/references/claude-code-posttooluse-hook-schema.md:87` named `claude-code-transcript-tooluseresult-empirical.md`. `find .gobbi/projects/gobbi -name 'claude-code-transcript-tooluseresult-empirical.md' -print` shows the promoted target exists at `.gobbi/projects/gobbi/features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md`, with the relevant insight at lines 20-22. This is content weakening, not a valid broken-link repair.

2. [general] [high] [90] Both guardrails checklist docs still fail the checklist template shape required by the section-4 contract.

   Evidence: section 4.2 says other types, including feature-subdir types, follow their template shape (`skills/memorization/rules.md:171-182`). The checklist template offers a per-scenario table plus `## Item details` (`skills/memorization/templates/checklists.md:53-67`) or a per-checklist body with `## What`, `## Why`, `## Verification`, and `## Status notes` (`skills/memorization/templates/checklists.md:91-103`). The post-image instead has `## Context`, `## Checklist item for Planning / Execution`, `## Deferred`, `## Related` in `features/guardrails/checklists/cross-layer-drift-gate.md:15-35`, and `## Context`, `## Checklist item for Execution / docs sweep`, `## Related` in `features/guardrails/checklists/hook-event-count-31-vs-29-docs-sync.md:15-31`.

3. [general] [medium] [90] The feature README's `## Subdirectories` section is not an accurate pointer map.

   Evidence: the feature README template requires `design/`, `discussions/`, `decisions/`, `plans/`, `scenarios/`, `checklists/`, `backlogs/`, and `changelogs/` entries (`skills/memorization/templates/feature-readme.md:51-60`). The post-image lists `decisions/`, `design/`, `discussions/`, `references/`, `plans/`, `changelogs/`, and `archive/` (`features/guardrails/README.md:32-40`). The actual live directories are only `backlogs`, `changelogs`, `checklists`, `discussions`, and `references`, so the README omits live `backlogs/` and `checklists/` while pointing readers at non-existent `decisions/`, `design/`, `plans/`, and `archive/`.

4. [general] [medium] [85] Two backlog `## Originating session` bodies still do not provide the concrete session path required by the backlog template.

   Evidence: the backlog template requires a path to the session that produced the backlog (`skills/memorization/templates/backlogs.md:73-74`). `features/guardrails/backlogs/goodhart-factor-when-demanded-deferred.md:39-41` still uses only `.gobbi/projects/gobbi/sessions/` plus prose "session 1b26cf20". The untouched-but-in-scope `features/guardrails/backlogs/hook-event-count-31-vs-29-docs-sync.md:39-46` also uses only `.gobbi/projects/gobbi/sessions/` and preserves `COD-OVERALL-ITER3-001` as body provenance instead of a concrete session artifact path.

## Cross-ref resolution check

- Added or repaired paths that resolve: `.gobbi/projects/gobbi/backlogs/codex-ci-integration-for-dual-system-eval.md`, `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md`, `.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md`, `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`, guardrails backlog/checklist/reference related paths, and the three cited project mistakes.
- The claimed broken companion reference in `claude-code-posttooluse-hook-schema.md` is only absent from `features/guardrails/references/`; it exists in promoted project memory under `features/install-runtime/references/`. It should be re-pointed rather than replaced with generic prose.
- Scope check: `git diff --name-only d24c61c^ d24c61c | grep -v '^\.gobbi/projects/gobbi/features/guardrails/'` printed nothing. `git diff --name-only d24c61c^ d24c61c | grep '/archive/'` printed nothing.

## Verification outputs

### git stat

```text
commit d24c61cd931eec4bc80b6a402e31eb9f08b5d980
Author: HahyeonJeon <jeonhh0061@gmail.com>
Date:   Wed May 27 16:16:01 2026 +0000

    docs(prose): P4 — features/guardrails §4.2 contracts + self-contained prose
    
    AI-Provenance-Record: gobbi://session/5786090e-f65a-4493-94cc-e610ce337813/task/P4-guardrails-prose

 .gobbi/projects/gobbi/features/guardrails/README.md  | 16 +++++++++++++---
 .../goodhart-factor-when-demanded-deferred.md        |  4 ++--
 .../posttooluse-failure-webfetch-verification-gap.md |  7 +++----
 .../changelogs/2026-05-26-bundle-b-rehome.md         |  6 +++---
 .../guardrails/checklists/cross-layer-drift-gate.md  |  6 +++---
 .../hook-event-count-31-vs-29-docs-sync.md           |  4 ++--
 .../2026-05-24-mistake-bundle-extension-to-t3.md     |  8 ++++----
 .../claude-code-hooks-12-lifecycle-events.md         |  9 +++++++--
 .../claude-code-posttooluse-hook-schema.md           | 20 +++++++++++++-------
 9 files changed, 50 insertions(+), 30 deletions(-)
```

### D5 body scan

Command:

```bash
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/guardrails/ --include='*.md' | grep -vE '/archive/' || true
```

Output:

```text
.gobbi/projects/gobbi/features/guardrails/discussions/2026-05-24-mistake-bundle-extension-to-t3.md:27:2. **Iron Law 7 mistake only for hook + reconstructor tasks** (recommended) - `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` applies; the other two (cwd routing, rm -rf safety) are inapplicable to these surfaces.
.gobbi/projects/gobbi/features/guardrails/discussions/2026-05-24-mistake-bundle-extension-to-t3.md:37:- `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`: guards against paraphrasing "verbatim" spec content without re-reading. Hook + reconstructor tasks involve verbatim citation of hook stdin contract, structured-header regexes, and JSON schema field names. Directly applicable.
```

These two hits are legitimate existing-file references to `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`.

### Leak gate

Command:

```bash
find .gobbi/projects/gobbi/features/guardrails -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):' || true
```

Output:

```text
```
