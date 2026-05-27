---
name: constraints-body-block-kept-per-h2-lock
description: Keep the Constraints body block in the codex skill — the 8-H2 Idea Design A contract takes precedence over the H2-per-section convention used by sibling skills.
type: decisions
scope: feature
feature: evaluation
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, constraints, h2-count, codex-skill]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Constraints body block vs ## Constraints H2 convention

## Context

The codex skill stub renders `Constraints` as a bolded `**Constraints**` body block rather than a `## Constraints` H2, to keep the skill at exactly 8 H2 sections. Sampled existing project skills use `## Constraints` as an H2, which raised two questions: should the codex stub be revved to a ninth H2 to match, and the stub's annotation cited `_claude/SKILL.md` as the convention source — is that citation correct?

## Decision

Keep the `**Constraints**` body block, and drop the `_claude/SKILL.md` citation. The annotation is changed to read "body block per locked Idea Design A; H2 count contract" instead of pointing at a non-existent skill file.

## Rationale

The codex skill's locked design fixed exactly 8 H2 sections — the contract `grep -c "^## " SKILL.md` MUST return 8 — so a ninth `## Constraints` H2 would break the lock. Two pieces of evidence settled the rest:

- **6/6 sampled skills use `## Constraints` as H2.** `grep -n "^## Constraints" .agents/skills/*/SKILL.md` confirms git, research, preparation, wrap-up, mistake, and execution all use the H2 form — so the divergence is real, but it does not justify breaking the locked 8-H2 count.
- **`_claude/SKILL.md` does not exist.** `find /playinganalytics/git/gobbi -path "*/skills/claude*" -type f` finds only symlinks to other skills — neither `.agents/skills/_claude/` nor `.claude/skills/claude/` exists. The stub's citation pointed at a phantom file, so it had to be replaced.

## Alternatives considered

- **Rev the stub to a ninth `## Constraints` H2 to match the 6 sibling skills** — rejected: breaks the locked 8-H2 grep contract.
- **Keep the `_claude/SKILL.md` citation** — rejected: the file does not exist, so the citation is a dangling reference; it was replaced with a citation to the locked Idea Design A and the H2-count contract.

## Consequences

The codex skill keeps the body-block form, divergent from the 6 H2-form sibling skills, and its Constraints annotation now cites a real source (the locked design + H2 contract). The decision was adopted directly into the codex-skill stub-authoring brief with no user challenge.

## Related

- [`decisions/constraints-body-block-convention-deferred-to-planning.md`](constraints-body-block-convention-deferred-to-planning.md) — the deferral decision this one resolves.
- [`design/codex-skill-structure.md`](../design/codex-skill-structure.md) — the locked design that fixes the 8-H2 contract.
