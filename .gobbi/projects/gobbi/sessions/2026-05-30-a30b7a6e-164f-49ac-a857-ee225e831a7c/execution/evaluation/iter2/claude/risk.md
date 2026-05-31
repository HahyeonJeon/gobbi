# Execution Eval — Risk (iter2, Claude)

**Perspective:** Risk — whole-tree grep for retired wording; zero stranded hits in live docs; no regression from over-eager replacement.

## Verdict: REVISE

## Evidence
- **Scope-restricted grep (`.claude .codex skills agents rules backlogs`, excl sessions/archive) = ZERO retired-phrasing hits.** This matched the brief's stated scope list. BUT the brief's scope list omitted `features/` — a live project-memory doc tree. Per the user goal ("no live doc still teaches retired wording") and per the iter1 root-cause mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep`, I re-ran the grep with NO path restriction (whole tree, excluding only `sessions/`, `archive/`, `.git/`).
- **Unrestricted whole-tree grep surfaced one stranded retired-wording hit in a live doc** (see Finding RISK-01).
- `motivator` grep = ZERO hits.
- `witness` (generic English) = 6 legitimate hits in backlogs ("witness signal", "empirical witness", "witnessed by") — NOT the retired concept; correct as-is, must not be scrubbed.
- The intentional quoted counter-example inside P14 Discipline (`principles/SKILL.md:391-392`: `not "refuse to transact in vagueness."` and the `"a witness"` example) is present and correct — locked, must remain.

## Finding RISK-01

- **Type:** scenario_gap
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `.gobbi/projects/gobbi/features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:56` —
  `"... changing storage shape for no functional gain violates Principle 10 (witness-bound work)."`
  This live, git-tracked project-memory decision doc still teaches the RETIRED P10 metaphor "witness-bound work". P10 was renamed in this very change to "Change Only With a Real Trigger" (Iron Law "NO CHANGE WITHOUT A REAL TRIGGER"). The phrase "witness-bound work" is exactly the retired wording the change set out to eliminate.
- **Why it matters:** The user's stated goal is that NO live doc still teaches retired wording. This doc does. A reader following the cross-reference will look for a P10 named "witness-bound work" that no longer exists, and the obscuring metaphor the change was meant to remove survives in a tracked doc. This is the same failure class as the iter1 REVISE (stranded old wording outside the primary edited files) — the remediation's blast-radius sweep (F4) covered two backlog files but missed this `features/.../decisions/` file.
- **Suggested direction (not a prescription):** the manager + user decide. Candidate: update the parenthetical to the new P10 framing (e.g., "violates Principle 10 — no change without a real trigger"). Whether historical decision docs are in-scope for vocab migration is a user call.

## Note on scope
The brief's explicit scope list (`.claude .codex .agents skills/ agents/ rules/ backlogs/`) did not include `features/`. Under a strict literal reading of the brief, RISK-01 is out-of-listed-scope. Under the user's stated GOAL ("no live doc still teaches retired wording") it is in-scope. I report it because (a) the iter1 mistake this very eval exists to close is precisely "scope-narrowed grep missed a whole-file/whole-tree stale reference", and (b) `features/` decision docs are live, tracked project memory, not sessions/archive. Flagging an out-of-listed-scope-but-in-goal hit is the conservative, adversarial-correct choice; the manager may dispose it as `disputed`/`deferred` if historical decision docs are deemed frozen.

## Must-preserve
- The 6 legitimate "witness" backlog usages (correct English — do NOT scrub).
- The P14 quoted counter-examples (`principles/SKILL.md:391-392`).
