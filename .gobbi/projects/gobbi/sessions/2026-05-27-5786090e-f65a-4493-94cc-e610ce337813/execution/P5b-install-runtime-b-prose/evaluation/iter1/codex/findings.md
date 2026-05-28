VERDICT: REVISE

## Summary

The P5b prose wave mostly brought the 20 install-runtime docs into the §4.2 body shapes, and the current markdown links resolve. Two issues block PASS: two checklist files use ad-hoc extra sections despite the checklist contract requiring exactly one of the two allowed forms, and several old precise source/cross-reference pointers were removed or weakened to generic session-source prose even though the original targets still exist under `.gobbi/projects/gobbi/`.

## Findings

- [checklist_gap] [High] [95] Two checklist files do not match either allowed checklist form exactly. §4.2/checklist prompt requires either Form A (`# ... — implementation checklist`, table, `## Item details`) or Form B (`## What`, `## Why`, `## Verification`, `## Status notes`) with no ad-hoc shape. `hook-latency-bounds.md` uses Form B and then adds `## Source`, making it neither exact Form B nor Form A: `.gobbi/projects/gobbi/features/install-runtime/checklists/hook-latency-bounds.md:15`, `.gobbi/projects/gobbi/features/install-runtime/checklists/hook-latency-bounds.md:19`, `.gobbi/projects/gobbi/features/install-runtime/checklists/hook-latency-bounds.md:23`, `.gobbi/projects/gobbi/features/install-runtime/checklists/hook-latency-bounds.md:27`, `.gobbi/projects/gobbi/features/install-runtime/checklists/hook-latency-bounds.md:31`. `structured-header-migration-behavior.md` similarly uses Form B and then adds `## Related`: `.gobbi/projects/gobbi/features/install-runtime/checklists/structured-header-migration-behavior.md:15`, `.gobbi/projects/gobbi/features/install-runtime/checklists/structured-header-migration-behavior.md:19`, `.gobbi/projects/gobbi/features/install-runtime/checklists/structured-header-migration-behavior.md:23`, `.gobbi/projects/gobbi/features/install-runtime/checklists/structured-header-migration-behavior.md:27`, `.gobbi/projects/gobbi/features/install-runtime/checklists/structured-header-migration-behavior.md:31`.

- [general] [High] [90] Content/source preservation regressed: precise old references were deleted or weakened to generic prose while their targets still exist. The prompt explicitly requires flagging removed refs whose target exists and precise paths weakened to a parent/session-level pointer. Examples: `dry-inline-jq-hook-script.md` used to cite `evaluation/iter1/claude/structure.md`, `evaluation/iter1/claude/risk.md`, `staging/decisions/goodhart-factor-when-demanded-deferred.md`, and `rawdata/draft-iter3.md:240` / `:353-360` (old file lines 42-46 in `git show e94e94b^:.gobbi/projects/gobbi/features/install-runtime/backlogs/dry-inline-jq-hook-script.md`); the new file only gives a session root plus generic source prose at `.gobbi/projects/gobbi/features/install-runtime/backlogs/dry-inline-jq-hook-script.md:34` and `.gobbi/projects/gobbi/features/install-runtime/backlogs/dry-inline-jq-hook-script.md:40`. Verified existing targets include `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/rawdata/draft-iter3.md`, `.../ideation/evaluation/iter1/claude/structure.md`, and `.../ideation/staging/decisions/goodhart-factor-when-demanded-deferred.md`. The same pattern appears in `ci-symlink-backlog-pseudocode-plumbing.md`: old lines 36-37 cited `preparation/staging/backlogs/project/ci-symlink-integrity-check.md` and `preparation/evaluation/iter3/claude/risk.md`, both verified present under the originating session; the new file keeps only the promoted project backlog link and generic source prose at `.gobbi/projects/gobbi/features/install-runtime/backlogs/ci-symlink-backlog-pseudocode-plumbing.md:40` and `.gobbi/projects/gobbi/features/install-runtime/backlogs/ci-symlink-backlog-pseudocode-plumbing.md:44`. If session-only coordinates should not remain in evergreen bodies, the preserving fix is to reclassify those precise witness pointers into project-level notes or a concrete source pointer, not drop them into a generic "surfaced during evaluation" sentence.

## Cross-ref resolution check

- Current markdown links in the 20 changed files resolve successfully. Checked examples include:
  - `.gobbi/projects/gobbi/features/install-runtime/backlogs/ci-symlink-backlog-pseudocode-plumbing.md:40 -> ../../../backlogs/ci-symlink-integrity-check.md` OK
  - `.gobbi/projects/gobbi/features/install-runtime/backlogs/consequences-section-unqualified-claim.md:40 -> ../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` OK
  - `.gobbi/projects/gobbi/features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md:77-79` all OK
  - `.gobbi/projects/gobbi/features/install-runtime/scenarios/mirror-policy-workspace-canonical-false-premise.md:40-42` all OK
  - `.gobbi/projects/gobbi/features/install-runtime/README.md:59 -> ../../design/memory-system-redesign.md` OK
- No stale `staging/backlogs/project/ci-symlink-integrity-check.md` reference remains in the changed live install-runtime files.
- Removed/weakened historical references are the remaining cross-ref problem, documented in the second finding.

## Verification outputs

### D5 body scan

Command:

```bash
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios}/ .gobbi/projects/gobbi/features/install-runtime/README.md --include='*.md' | grep -vE '/archive/'
```

Output: no matches.

### §4.5 leak gate

Command:

```bash
find .gobbi/projects/gobbi/features/install-runtime/{backlogs,checklists,references,scenarios} .gobbi/projects/gobbi/features/install-runtime/README.md -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'
```

Output: no matches.

### git stat

```text
commit e94e94b9d9f597b940539e5031b6d9f55195998b
Author: HahyeonJeon <jeonhh0061@gmail.com>
Date:   Wed May 27 17:21:53 2026 +0000

    docs(prose): P5b — features/install-runtime rest+README §4.2 contracts + self-contained prose

    AI-Provenance-Record: gobbi://session/5786090e-f65a-4493-94cc-e610ce337813/task/P5b-install-runtime-b-prose
    Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

 .../gobbi/features/install-runtime/README.md       | 26 ++++++++++++------
 .../ci-symlink-backlog-pseudocode-plumbing.md      | 21 ++++++++------
 .../consequences-section-unqualified-claim.md      | 23 +++++++---------
 .../backlogs/dot-gobbi-project-json-bootstrap.md   | 25 +++++++----------
 .../backlogs/dry-inline-jq-hook-script.md          | 28 ++++++++-----------
 .../backlogs/hook-self-failure-budget-unstated.md  | 20 ++++++++------
 .../schema-extension-agents-status-field.md        | 12 ++------
 .../backlogs/sidecar-lock-refinement-deferred.md   | 29 ++++++++------------
 .../checklists/hook-latency-bounds.md              | 24 +++++++++-------
 ...exit-behavior-must-enumerate-all-fatal-paths.md | 16 +++++------
 .../mirror-policy-empirical-verification.md        | 12 +++++++-
 ...not-invent-json-field-paths-not-in-witnesses.md | 16 +++++------
 ...registration-must-mirror-real-settings-shape.md | 18 ++++++------
 ...-payloads-must-include-all-required-env-vars.md | 16 +++++------
 .../structured-header-migration-behavior.md        | 20 ++++++++------
 .../claude-code-changelog-ccsi-version.md          | 14 +++++++---
 .../references/claude-code-hooks-stdin-contract.md | 12 ++++++--
 ...aude-code-transcript-tooluseresult-empirical.md | 11 ++++----
 .../consumer-mental-model-symlink-topology.md      | 30 ++++++++++++++------
 ...ror-policy-workspace-canonical-false-premise.md | 32 +++++++++++++++-------
 20 files changed, 223 insertions(+), 182 deletions(-)
```
