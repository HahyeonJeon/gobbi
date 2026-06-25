---
name: family-a-allowlist-completeness
description: Family-A guard exits 1 on 4 legitimate skills/ carriers — the Task-1 derive-from-run discipline must enumerate them.
type: checklists
scope: feature
feature: memory
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification, memory]
keywords: [check-residual-vocab, family-a-allowlist, memorization-carriers, skills-surface]
author: claude
scenario: null
item_status: pending
anchor: novel
implemented_in: null
---

# Family-A guard allowlist completeness

## Finding

Source: Claude iter4 evaluator, `STR-OBS-iter4` (Structure, verification, Low@100).

Family-A's OWN allowlist is currently incomplete. The default guard (`check-residual-vocab.sh` with no path args, scanning `skills/` et al.) exits 1 on 4 legitimate `skills/` carriers:

- `skills/memory/scripts/validate-frontmatter.sh:106` — a `memorization` mention in the validator itself
- `skills/memory/SKILL.md:28` — `memorization` mention
- `skills/memory/SKILL.md:36` — `memorization` mention
- `skills/memory/SKILL.md:39` — `memorization` mention

The draft's Success Criterion 1 states "Family-A guard → 0 non-allowlisted residual." The derive-from-run discipline in Task 1 applies equally to Family A: enumerate these 4 carriers from a fresh run, add them to Family A's allowlist with per-entry reasons.

## Checklist

- [ ] Run Family-A guard (`bash <PM>/skills/orchestration/scripts/check-residual-vocab.sh`) and capture the output.
- [ ] Enumerate every hit as a legitimate carrier (with per-entry reason) OR as a genuine residual to fix.
- [ ] Add legitimate carriers to Family A's allowlist in the extended guard source.
- [ ] Re-run Family-A guard → 0 non-allowlisted residual.

## Why this is non-blocking at Ideation

The draft's Task-1 PROPERTY gate explicitly covers this: "Family A over `skills/` → 0 non-allowlisted residual." The derive-from-run method applies to both families. The Execution implementation of Task 1 MUST enumerate both families' carriers from fresh runs; Family A's 4 current exit-1 hits are captured here so they are not missed at Execution time.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — the parent guard-false-PASS trap this completeness check guards against
