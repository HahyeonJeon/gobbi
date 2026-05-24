# Usage Perspective — Task 06 iter1

**Target:** commit `32b9adc` — usability of the footnote + smoke-test from the manager's POV.

## Direct-mode opt-out — manager-runnability

A manager reading row 5.5 + the new footnote can answer:
- "Should I create a worktree?" → check `settings.git.workflow.mode`. If `direct`, skip; else create.
- "When is direct mode legitimate?" → emergency hotfix OR pure-read session.
- "Is direct mode set per-step or per-session?" → user-level setting at Configuration Step 1, not per-step override (explicitly stated).

Strong. Each operational question has a one-sentence answer in the footnote.

## Smoke-test gate — manager-runnability

A manager reaching Memorization phase on the first post-merge session can execute:
```
jq '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json
```
and pattern-match against the documented regex. The doc also calls out the `worktreePath` non-null assertion for worktree-pr sessions. Both checks are runnable as-written.

Empirical test (run during this evaluation):
```
$ jq '.git.branch' .gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20.../session.json
null
```
The current session's session.json has `null` for `git.branch` — pre-T01 session, branch was never stamped. So the smoke test will correctly start firing on the **first session AFTER this feature merges**, not on this session.

## Findings

- **U-01** — Type: `assumption_risk` / Domain: `process` / Disposition: `open` / Confidence: `75` / Severity: `Medium`
  - "Run this check at the first post-merge session's Memorization phase" lacks an explicit assignment — there is no checklist item, no hook, no schedule entry. The check relies on a future manager remembering that this skill mentioned a one-shot smoke test. Memorization phase docs (`skills/orchestration/workflow/memorization.md`) are not (per the change) updated to reference this gate.
  - Why it matters: smoke tests that aren't wired into a scheduler don't run. The doc describes the gate but does not enroll it.
  - Evidence: orchestration/SKILL.md:123 — "Run this check at the first post-merge session's Memorization phase"; no corresponding edit to memorization phase doc in this commit.

- **U-02** — Type: `general` / Domain: `process` / Disposition: `open` / Confidence: `75` / Severity: `Medium`
  - The doc says "every new session running `worktree-pr` must produce a `session.json.git.branch` value that matches the regex". But the smoke-test command in the fenced block uses a single-session lookup (`.gobbi/projects/.../<latest>/session.json`) — it does not iterate over all sessions or check the contract on each. A reader could interpret "smoke test" as a one-shot point-in-time check rather than a per-session invariant assertion.
  - Why it matters: ambiguity between "spot-check post-merge" and "ongoing per-session check". The doc straddles both; the manager may pick the cheaper interpretation.
  - Evidence: orchestration/SKILL.md:121-123 vs the stronger "every new session" wording at line 121.

- **U-03** — Type: `general` / Domain: `usage` / Disposition: `open` / Confidence: `50` / Severity: `Low`
  - `<latest>` placeholder in the jq path is not defined. A naive reader may not know how to resolve it (newest mtime? newest folder name lexicographically? newest by sessionId?).
  - Why it matters: usability nit; affects copy-paste correctness.
  - Evidence: orchestration/SKILL.md:122.

## Verdict (usage perspective)

**REVISE.** U-01 + U-02 (Medium severity, Confidence 75) raise a concern that the smoke-test gate is documented but not enrolled. Manager-as-reader can act on the footnote without ambiguity; the smoke-test gate is half-wired.

## Preserve list

- The two-condition checklist for direct-mode legitimacy (emergency hotfix / pure-read).
- The explicit statement that opt-out is not a fallback-on-error.
