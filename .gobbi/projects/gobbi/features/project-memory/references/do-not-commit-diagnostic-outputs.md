---
name: do-not-commit-diagnostic-outputs
description: Logs and diagnostic outputs are outputs, not source — keep bulk out of git; reference via lightweight metadata or external/LFS storage.
type: references
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [gitignore, repo-hygiene, logs, transcripts, ephemeral]
title: Managing large files / don't commit build outputs
source: https://learn.microsoft.com/en-us/azure/devops/repos/git/manage-large-files
accessed: 2026-06-08
ref_type: docs
---

# Managing large files / don't commit build outputs

## Insight
Logs, tracing output, and diagnostic data are outputs of code, not source — the community consensus is to keep them out of the git tree. When large append-only files must be referenced but not bloat history, store a lightweight metadata/pointer file in git and keep the bulk external (or in Git LFS).

## Related
- design decision D8 (untrack ephemeral sessions/; git rm --cached + gitignore)
- design decision D4 (raw transcripts ephemeral; durable signal via session.json)

## Why it applies
D8 untracks the ephemeral `sessions/` tree (2737 tracked files today) because session working memory is an output, not durable source — the durable record is the promoted `notes/` record. D4 keeps raw `.jsonl` transcripts in the ephemeral tree for debugging only and carries the durable signal (roster, tokens, timings) in `session.json` — the metadata-pointer pattern this reference describes.

## Source
- https://learn.microsoft.com/en-us/azure/devops/repos/git/manage-large-files
- https://docs.github.com/en/repositories/working-with-files/managing-large-files
- https://git-lfs.com/

## Excerpt
"Don't commit logs, tracing output, or diagnostic data from your builds and tests, as these are outputs from your code, not the source code itself." "Store a lightweight metadata file in the repository containing references to data stored externally."
