# Structure perspective — T6 conform install-runtime

Scope: do the conformed files obey §1 (naming/address), §2 (frontmatter shape), §3 (placement/atomicity)?

## Checks
- **Scope clean (§3 placement)** — PASS. `git show --stat 9f8562c` = 24 files, every path under `features/install-runtime/{discussions,design,decisions,changelogs}/`. No T7 subdir (scenarios/checklists/README/plans) touched. No cross-feature bleed.
- **type enum / feature-subdir exception (§2.1)** — PASS. discussions→`type: discussions`, design→`type: design`, decisions→`type: decisions`, changelogs→`type: changelogs`. The 4 feature-subdir types use their own name per the §2.1 documented exception. All carry `scope: feature`.
- **Base frontmatter block well-formed (§2.1)** — PASS. All 24 carry the 9 base keys in valid YAML; no malformed frontmatter (awk-delimited extraction succeeded on all 24).
- **Non-S extension keys preserved (§2.2/§4.4 safety invariant)** — PASS. `related`, `discussion-id`, `session-id`, `supersedes`, `superseded_by`, `decision_status`, `verdict`, `task`, `plan`, `design-id`, `topic`, `slug` all retained where present (tooled before/after diff = 0 dropped).
- **Atomicity (§3)** — N/A change. T6 did not split/merge files; one-concept-per-file shape inherited from prior state, unchanged.

## Finding

### F-STRUCT-1 — generic/positional H1 titles weaken the §1.3 "name the subject" address
- **Type:** general · **Domain:** docs-quality · **Disposition:** open · **Confidence:** 75 · **Severity:** Low
- **Evidence:** `# T1 Decisions Log` (session-start-hook-script-decisions.md) and `# Planning Decisions Log` (task-decomposition-decisions.md) are positional/generic H1s — the filename slug carries the concept (`session-start-hook-script`, `task-decomposition`) but the title does not. §1.3 (name the subject, not its position) is a slug rule; §4.1 extends it to the body title. This is the structural mirror of F-PROJ-1.
- **Why it matters:** a reader skimming H1s alone (e.g. via a docs index) sees "Decisions Log" not the subject. Low severity because the slug + frontmatter `name`/`description` carry the subject correctly.
- **Suggested direction:** fold into the F-PROJ-1 title-decrypt decision.

VERDICT: PASS
