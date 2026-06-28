---
name: skill-writing-dead-mistake-links
description: skill-writing/SKILL.md has 3 pre-existing dead links to mistakes/planning-asserted-skill-without-verifying.md, which moved under mistakes/verification/ during the namespace migration.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [docs-sync]
keywords: [skill-writing, dead-links, namespace-migration, planning-asserted, inbound-refs, link-resolution]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Repoint dead links in `skill-writing/SKILL.md` to moved mistake file

## Context

During the memory namespace migration (PR #314, session ending 2026-06-24), `mistakes/planning-asserted-skill-without-verifying.md` was moved to `mistakes/verification/planning-asserted-skill-without-verifying.md`. The migration procedure repoints inbound `required-mistakes:` PATH refs but does not guarantee that prose body links inside skill files are updated.

`skills/skill-writing/SKILL.md` contains approximately 3 inbound references to the old path at ~lines 50, 270, and 299. These are body-prose links (not `required-mistakes:` frontmatter refs), so they were not caught by the migration's repoint sweep. They now point to a file that no longer exists at the old path.

Discovery: observed during session b5601d38 when `check-markdown-links.sh` was run post-promotion and the links were noted as out-of-scope for this session's R1/R2/R3 scope.

## Why deferred

Out of scope for session b5601d38. The dead links are pre-existing from the migration; fixing them requires a targeted edit to `skill-writing/SKILL.md` to update three link targets. This is a standalone, low-risk cleanup task.

## When to pick up

No prerequisites. Can be picked up any time after session b5601d38 merges. `check-markdown-links.sh` will flag these links; running the guard confirms the exact line numbers.

## Suggested approach

1. Run `check-markdown-links.sh` on the post-migration tree to identify the exact dead link lines in `skill-writing/SKILL.md`.
2. Update the 3 link targets from `../../mistakes/planning-asserted-skill-without-verifying.md` (or similar) to `../../mistakes/verification/planning-asserted-skill-without-verifying.md`.
3. Re-run `check-markdown-links.sh` to confirm zero new broken links.
4. Commit the fix.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-27-b5601d38-c988-4f53-b34b-9ace12a55c25/`

## Related

- [[planning-asserted-skill-without-verifying]] — the mistake file that moved
- [[preexisting-broken-markdown-links]] — the broader backlog tracking pre-existing link issues
