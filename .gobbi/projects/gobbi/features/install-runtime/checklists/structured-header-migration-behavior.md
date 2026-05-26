---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: addressed
feature: install-runtime
finding-id: COD-USAGE-004
type: checklist_gap
domain: observability
disposition: addressed
confidence: 75
severity: Medium
---

# Structured-header migration behavior — existing prompts produce null fields until refreshed

## Context

iter2/iter3 Codex Usage finding COD-USAGE-004: prompts that do not yet include the canonical structured headers (`Your phase: <X>`, `Your iteration: <n>`, `Your sub-step: <Y>`) will produce `null` values for `step / phase / iter` in `session.json.agents[]` until the next prompt-template refresh.

## Addressed by

`draft-iter3.md:291` (T3-I-T3.e) specifies a migration paragraph: existing prompts that lack the headers will produce `null` for `step/phase/iter` in `agents[]` until the next prompt-template refresh. The null values are acceptable — the hook populates other fields from the result side (`agentId`, `usage.*`, `totalDurationMs`); `step/phase/iter` become populated once each delegation prompt template is updated.

## Checklist item for Execution

- [ ] After T3-I-T3.e ships (`delegation/SKILL.md` structured-header convention), add the migration paragraph exactly as specified.
- [ ] In the first post-merge session, verify `agents[]` entries that came from updated prompts show non-null `step` and `phase`; entries from legacy prompts show `null` — confirm this is expected and documented.
- [ ] Track prompt-template refresh as a follow-up task in the Execution checklist.

## Related

- `evaluation/iter2/codex/usage.md` COD-USAGE-004
- `evaluation/iter3/codex/usage.md` COD-USAGE-004
- `rawdata/draft-iter3.md:291` (T3-I-T3.e migration paragraph)
- `rawdata/draft-iter3.md:388-399` (D-3-4 metadata extraction)
