VERDICT: REVISE

## Summary

The §4.2 section-shape pass is mostly clean: the 24 live docs under `features/install-runtime/{discussions,design,decisions,changelogs}/` have the required type sections, and the four high-risk decision rewrites preserve the key P/FIX/finding/commit content checked by grep (`P1`-`P7`, `FIX 1`-`FIX 8`, `FIX A`-`FIX C`, findings α-δ, commits `fd216fe`/`51199d6`, and Planning `FIX I`-`FIX VI` + `FIX α`-`FIX ε`). Scope is also clean: commit `520cdb2` changes 21 files, all inside the four P5a subdirs, with no archive or P5b-directory edits.

The blocking issue is cross-reference resolution. The prompt's mandatory cross-ref gate says every Related / inline doc link must point to an existing file and to flag weakened refs where the concrete target exists elsewhere in `.gobbi/projects/gobbi/`. Several changed docs still contain stale or bare backlog/archive refs that a future reader cannot `ls` from the doc.

## Findings

- [general] [High] [95] Cross-reference resolution still fails for backlog/archive references. `features/install-runtime/changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md:26` points to `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md`, but that file no longer exists; the existing target is `.gobbi/projects/gobbi/archive/backlogs/2026-05-25-gobbi-hook-authoring-skill.md`. `features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:99` points to `staging/backlogs/project/ci-symlink-integrity-check.md`, while the promoted target exists at `.gobbi/projects/gobbi/backlogs/ci-symlink-integrity-check.md`; the companion discussion weakens the same target to bare text at `features/install-runtime/discussions/edit-contract-addition.md:52`. `features/install-runtime/discussions/dual-hook-registration-confirm.md:42` and `features/install-runtime/discussions/scope-contract-lock.md:39` similarly say `Backlog schema-extension-agents-status-field` instead of the existing `.gobbi/projects/gobbi/features/install-runtime/backlogs/schema-extension-agents-status-field.md`. This violates the prompt's whole-tree cross-ref rule and leaves durable docs with non-resolvable pointers.

## Cross-ref resolution check

Fail. The correct targets exist:

```text
.gobbi/projects/gobbi/archive/backlogs/2026-05-25-gobbi-hook-authoring-skill.md
.gobbi/projects/gobbi/archive/backlogs/2026-05-25-workspace-to-mirror-sync-mechanism.md
.gobbi/projects/gobbi/backlogs/ci-symlink-integrity-check.md
.gobbi/projects/gobbi/features/install-runtime/backlogs/schema-extension-agents-status-field.md
```

But the live docs still contain stale or weakened refs:

```text
features/install-runtime/changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md:26
features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:63
features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:99
features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:127
features/install-runtime/discussions/dual-hook-registration-confirm.md:42
features/install-runtime/discussions/edit-contract-addition.md:52
features/install-runtime/discussions/scope-contract-lock.md:39
```

## Verification outputs

D5 body scan:

```text
.gobbi/projects/gobbi/features/install-runtime/discussions/edit-contract-addition.md:11:topic: Symlink-preservation edit contract — iter3 surgical addition
.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:129:- Mistake invoked: `leader-iter2-verification-claim-without-evidence.md` (the first-iteration leader's empirical claim "no sync mechanism exists" was directionally true at the file-storage level but missed the symlink layer; this corrected decision uses `find -type l` empirically to anchor the lock).
```

Both D5 hits are legitimate: the first is frontmatter (`topic:`), and the second is a literal existing mistake filename.

§4.5 leak gate:

```text
<no output>
```

Git stat:

```text
commit 520cdb2682c206b91201416f210c9ece7bf5d5ab
Author: HahyeonJeon <jeonhh0061@gmail.com>
Date:   Wed May 27 16:53:00 2026 +0000

    docs(prose): P5a — features/install-runtime discussions+design+decisions+changelogs §4.2 contracts + self-contained prose
    
    AI-Provenance-Record: gobbi://session/5786090e-f65a-4493-94cc-e610ce337813/task/P5a-install-runtime-a-prose

 ...026-05-25-gobbi-hook-authoring-skill-shipped.md | 18 ++---
 .../changelogs/2026-05-26-env-var-audit-shipped.md |  2 +
 ...propagation-policy-mirror-canonical-symlinks.md | 12 ++--
 .../decisions/env-file-load-semantics-decisions.md | 57 ++++++++++-----
 .../decisions/pre-planning-readiness-decisions.md  | 63 +++++++---------
 .../session-start-hook-script-decisions.md         | 40 +++++++----
 .../decisions/task-decomposition-decisions.md      | 83 ++++++++++------------
 .../design/dual-hook-registration-resolver.md      | 32 +++++----
 .../design/flock-serialization-on-session-json.md  | 29 ++++----
 .../install-runtime/design/hook-bash-jq-stack.md   | 30 ++++----
 .../design/metadata-extraction-input-vs-result.md  | 29 ++++----
 .../design/reconstructor-verify-and-fix.md         | 30 ++++----
 .../design/tool-use-id-correlation-key.md          | 29 ++++----
 .../discussions/dual-hook-registration-confirm.md  | 30 +++++---
 .../discussions/edit-contract-addition.md          | 14 ++--
 .../discussions/env-var-audit-scope-discussion.md  | 40 ++++++++---
 .../discussions/hook-contract-verification-gate.md | 29 +++++---
 .../hook-plus-reconstructor-mechanism.md           | 27 ++++---
 .../mirror-policy-mirror-canonical-relock.md       | 12 ++--
 ...mirror-policy-workspace-canonical-superseded.md |  6 +-
 .../discussions/scope-contract-lock.md             | 24 +++++--
 21 files changed, 378 insertions(+), 258 deletions(-)
```
