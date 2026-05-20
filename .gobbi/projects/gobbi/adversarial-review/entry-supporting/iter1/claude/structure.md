# Structure Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary for the shared header. This file inherits the same artifact + memory reads.)

## Locked Frame (Stage 1)

Seed scenarios (from ideation/evaluation.md Structure) adapted to a documentation/skill artifact:

1. **Components cohere** — each skill owns one concern (gobbi=bootstrap, principles=behavioral floor, git=git ops). Boundaries don't drift.
2. **A skeptical reader can map every claim to a specific structural element** — section headings let the reader navigate without grep.
3. **Boring-by-default holds** — section ordering, table-based contracts, regex-based validators — no novel structural devices for novelty's sake.
4. **Two-week smell test** — a returning maintainer can find any rule in any of the three skills by topic in <30s.
5. **Testability** — the artifact's claims are verifiable: regexes can be executed, paths can be checked, cross-references can be grepped.
6. **(adversarial)** — Decomposition silently introduces a circular dependency: gobbi/SKILL.md → principles/SKILL.md → orchestration/SKILL.md → back to gobbi as the entry. Is this a real cycle or just navigation?
7. **(adversarial)** — A "manager/coordinator" anti-pattern: a single skill that touches every other skill. principles/SKILL.md is referenced by every other skill — is this a coordinator hub or legitimate floor?

Adversarial scenarios: present (scenarios 6, 7).

## Per-scenario per-check results

**Scenario 1 — Components cohere:** Spot-checked. gobbi/SKILL.md does cover bootstrap-and-only-bootstrap (no implementation guidance leaks). principles/SKILL.md is pure behavioral discipline (no procedural guidance). git/SKILL.md is git ops; conventions.md is the deterministic split-out. **PASS.**

**Scenario 2 — Navigability:** gobbi/SKILL.md uses `## Session Bootstrap Order` → numbered subsections (`### 1. Load core skills`...`### 6. Enter the workflow`). principles/SKILL.md uses `## Principle N — Name`. git/SKILL.md uses `## Core Principles / Prerequisites / Role Boundaries / Forbidden Operations / Procedures / Failure Modes / Output paths / Constraints`. All scannable. **PASS but S-S-01** below — principles has no top-of-skill index/summary table; reader must scroll.

**Scenario 3 — Boring-by-default:** Tables, regexes, numbered procedures throughout. No novel devices. **PASS.**

**Scenario 4 — Two-week smell test:** Pass for git (clearly structured by lifecycle). Pass for gobbi (boot order). For principles, the lack of an Iron-Law summary table means a returning maintainer must scroll 300 lines to find a specific principle by topic. Mitigated by `.claude/CLAUDE.md`'s Iron Law table (out-of-scope), but the skill itself does not carry it. **PARTIAL — S-S-01.**

**Scenario 5 — Testability:** Conventions regexes are testable. Cross-references are grep-checkable. Paths are file-existence checkable. **PASS.**

**Scenario 6 (adversarial) — Cycle check:** gobbi/SKILL.md loads principles + orchestration + discussion + delegation + git at session start. Each of those references back to gobbi only via the entry-point relationship — they don't *re-load* gobbi. The graph is a tree rooted at gobbi, not a cycle. **PASS.**

**Scenario 7 (adversarial) — Coordinator hub:** principles is cited by everyone, but it is read-only behavioral discipline — it neither dispatches nor orchestrates. It's the equivalent of a constants module, not a coordinator. **PASS.**

## Typed findings

### S-S-01 — principles/SKILL.md lacks a scannable Iron Law index

- **Type**: design_flaw
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: principles/SKILL.md is 307 lines with 12 principles. The Iron Law table exists in `.claude/CLAUDE.md` (lines 30–43 per system reminder, out of scope) but not in the skill itself. The skill opens with a paragraph + "Load when" + jumps to `## Principle 1`. A maintainer who loads the skill explicitly during a judgment call must scroll until they hit the right `## Principle N` heading. Worse, the skill's own line 307 ends with "Future work: a Red Flags table per principle, listing the named rationalizations from each principle in scannable tabular form" — the author has acknowledged the gap but deferred it.
- **Remediation**: Add an "## Iron Laws (summary)" section after the opening paragraph, mirroring the `.claude/CLAUDE.md` table format (numbered 1–12, just the Iron Law line). Cost: ~15 lines. Eliminates the scroll-to-find problem and aligns with `.claude/CLAUDE.md`. The deferred "Red Flags table" can remain a future enhancement.

### S-S-02 — git/SKILL.md "Constraints" section duplicates the Memory Access Matrix + Role Boundaries

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: git/SKILL.md § Constraints (lines 262–280) re-states many invariants already encoded in § Memory Access Matrix (write-tier rules), § Role Boundaries (subagent never pushes), and § Forbidden Operations (no `git reset --hard`, no `git stash` inside worktree). The redundancy is intentional reinforcement (good) but means a future edit could land in only one place and drift. There is no cross-reference from Constraints back to the canonical home of each rule.
- **Remediation**: Either (a) add per-bullet cross-references in Constraints ("MUST never push from a subagent — see § Role Boundaries"), or (b) accept the redundancy with an explicit comment ("Constraints intentionally mirror earlier sections for fast scanning"). Either resolves the drift risk.

### S-S-03 — gobbi/SKILL.md "Skill Map" categorizes principles inconsistently

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md line 23 lists `principles` first in "Load core skills" (it is the floor for behavior). But the Skill Map (line 150) places `principles` under "Supporting skills" alongside `git` and `_claude` — a category whose first sentence is "Supporting skills". This is structurally backward: principles is the *most-loaded* skill of all, not a support skill. Compare to delegation/SKILL.md and discussion/SKILL.md which sit under "Cross-cutting skills" — better fit.
- **Remediation**: Either (a) move `principles` row from "Supporting skills" to "Cross-cutting skills" (which already houses orchestration, discussion, delegation, evaluation), or (b) rename the supporting-skills section to "Discipline + tooling" to disambiguate. Option (a) is cleaner.

## Low-confidence appendix

- **L-S-01 (confidence 25)**: conventions.md's heading hierarchy uses `## Section / ### Subsection` consistently except for the embedded PR Body template (line 159 `## Summary` etc.) which is *inside* a code fence as a markdown sample. A reader scanning headings via grep `^##` would pick up the embedded `## Summary` and `## Changes` as if they were top-level. Mitigated by the surrounding fence in renderers, but plain-grep tools see them. Severity Low; might be false-positive (linter-catchable).

## Verdict

**PASS** — 3 in-scope findings (1 Medium, 2 Low); none Critical, none High. Structure is sound; S-S-01 is worth doing in a follow-up.
