---
name: defeatureize-review-namespace
description: Dissolved the non-canonical review feature; split its memory into project-level cross-system files plus the new features/coding feature
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [refactor, process]
keywords: [defeatureize, namespace-refactor, review-feature, dissolution, coding-feature]
author: claude
features_touched: [coding]
loops_completed: [execution]
shipped: []
supersedes: null
superseded_by: null
---

# Dissolved the review feature; split its memory two ways

## What happened
The user determined that `features/review/` was a non-canonical value-feature. Gobbi's seven
canonical value-features are workflow, memory, agents, evaluation, guardrails, git-workflow, and
install-runtime — "review" is not one of them. This session ran the sanctioned namespace-refactor
operation (memory `rules.md` §1.5 carve-out + `mistake/SKILL.md`) in two passes:

1. **Dissolve** — every typed memory file under `features/review/` was `git mv`'d up to its
   project-level namespace and the feature directory removed.
2. **Re-home by owner** — the content split by what it actually belongs to. The `review/` feature
   had bundled two unrelated bodies of work, so they went to two different homes (below).

## Final architecture (two destinations)
- **(a) Cross-system adversarial-review work → PROJECT level (7 files).** The gobbi
  whole-system adversarial-review charter and its harness baselines are genuinely
  project-scoped (they review the whole system, not one feature): the charter
  `plans/workflow/2026-06-29-adversarial-review-charter.md`, four harness references under
  `references/memory/` (Agent OS, Claude Flow, Claude Task Master, Superpowers), and two
  backlogs (`backlogs/evaluation/run-deep-adversarial-review.md`,
  `backlogs/process/fix-confirmed-seed-findings.md`). These stay at project level.
- **(b) The #321 review.md code-review playbook memory → NEW `features/coding/` feature
  (41 files).** `skills/coding/review.md` is the coding skill's child, so its design memory
  belongs to a `coding` value-feature: 16 `decisions/`, 11 `references/docs/`, 4 `design/`,
  3 `checklists/`, 3 `discussions/`, 1 `plans/`, 1 `backlogs/`, 1 `changelogs/`, 1 `scenarios/`.
  A `features/coding/README.md` identity doc was created.

## What the dissolved feature held (folded from its README)
The `review` feature had covered two surfaces: (1) the coding code-review playbook —
`skills/coding/review.md`, a child of `coding/SKILL.md` (that skill file itself was never part of
`features/review/` and is untouched), now backed by the new `features/coding/` memory; and (2) the
adversarial-review charter for gobbi's whole system surface plus four external-harness baselines,
now at project level. Its work spanned two sessions (author `review.md` on 2026-06-27; author the
charter on 2026-06-29). The README was a structural index, not durable typed memory, so it was
removed rather than re-homed — this note preserves its rationale.

## What shipped
- 7 cross-system files kept at project level (charter, 4 `references/memory/` harness refs, 2 backlogs).
- 41 #321 files re-homed under `features/coding/`, with frontmatter flipped to `scope: feature` / `feature: coding`.
- `features/coding/README.md` created (feature identity doc).
- `features/review/README.md` removed (`git rm`); its rationale folded here.
- Inbound path references repointed: the charter self-references and the journal
  `notes/evaluation/2026-06-29-adversarial-review-charter-authored.md` (pass 1), and the
  intra-`features/coding/` cross-references between the re-homed files (pass 2).

## What got stuck
Nothing. The earlier tension — four feature-subdir-only types (`changelogs`, `checklists`,
`scenarios`, `discussions`) briefly sitting at project level — is now RESOLVED: those types live
under `features/coding/`, which is rule-compliant per `rules.md` §2.3/§3 (they exist only under
`features/{f}/`).

## What shifted
The first pass moved everything to project level; the user then split the content by owner,
creating `features/coding/` for the review.md-playbook subset and keeping only the cross-system
adversarial-review files at project level.

## Decisions to respect
- `review` is NOT a canonical value-feature — do not recreate `features/review/`.
- The review.md code-review playbook's design memory lives under `features/coding/` (the coding skill's feature).
- The adversarial-review charter is project-scoped: its durable home is `plans/workflow/2026-06-29-adversarial-review-charter.md`, NOT under a feature.
- Namespace refactor preserves slug identity: `[[slug]]` wikilinks and `supersedes`/`related` slug-links survived the moves untouched; only path references were repointed.

## Next session
The deep adversarial review (`backlogs/evaluation/run-deep-adversarial-review.md`) and the seed-fix
backlog (`backlogs/process/fix-confirmed-seed-findings.md`) live at project level. The review.md
playbook memory lives under `features/coding/`.

## Related

- [[adversarial-review-charter]] — the charter, project-level `plans/workflow/`
- [[adversarial-review-charter-authored]] — the session journal whose path refs this refactor repointed
- [[run-deep-adversarial-review]] — the next-session deep review, a project-level backlog
