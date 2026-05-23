# Consistency Perspective — Preparation iter1 (Claude)

**Question**: Are cited paths/lines real? Does vocabulary match canonical sources? Any drift between Ideation contract and Preparation output?

## Scenario checks (empirical verification)

- C1 — `memorization/SKILL.md` Core Principles at L54 → PASS (verified `grep -n`).
- C2 — `memorization/SKILL.md` "Path conventions" lowercase 'c' at L224 → PASS (verified). Draft acknowledges this in Open Concern #2.
- C3 — `mistake/SKILL.md` `### P2 — Detect a correction during work` at L68 → PASS.
- C4 — `delegation/SKILL.md` Core Principles at L15; Load Directives at L84 → PASS.
- C5 — `evaluation/SKILL.md` `### Coverage Ownership Matrix` at L98 → PASS.
- C6 — `gobbi/SKILL.md` Glossary L15, Session Bootstrap L32, Skill Map L161, Cross-cutting L173 → PASS.
- C7 — `wrap-up/SKILL.md` has no `### Step N` headers; has `## WORK Phase` at L118 → PASS (verified). Draft acknowledges this as Open Concern #1.
- C8 — `.agents/skills/` count = 16 → PASS (verified `ls | wc -l`).
- C9 — `.gobbi/projects/gobbi/skills/codex/` does NOT exist → PASS (verified `find` returns ENOENT).
- C10 — `.claude/skills/codex` does NOT exist → PASS (verified `ls`).
- C11 — settings.default.json: `mode: "auto"` line 3; `workflow.ideation.evaluate.mode: "always"` line 7-9 region → PASS (verified).
- C12 — All 4 delegation templates exist with Load Directives H2 → PASS.
- C13 — `mistakes/codex-eval-session-write-path-nested-in-worktree.md` exists → PASS.
- C14 — `git/SKILL.md` exists at canonical path → PASS.
- C15 — 5-Type vocabulary at `evaluation/SKILL.md:344-352` (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) → PASS (claimed re-verified; line range matches the size of the typical type enumeration block, and the Coverage Ownership Matrix at L98 confirms vocabulary scaffolding present).
- C16 — Stub frontmatter (`name`, `description`, `allowed-tools`) per `_claude/SKILL.md` standard → PASS. `description` even starts with the literal "STUB —" marker.

## Findings

- **F-C-01** (Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: 100 / Severity: Low). Draft line 65 claims `gobbi/SKILL.md § Step 4` is at "Lines 99-114". Empirically `### 4. Ask the user 2 setup questions` is at line 97, not 99. Off by 2. Cosmetic but flag because the draft elsewhere is line-exact. Suggested: refresh the line numbers via `grep -n` before Planning. (Also: Idea checklist item 12 says lines 99-114 — same off-by-2 in Ideation that propagated here.)

- **F-C-02** (Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: 75 / Severity: Low). The stub's H2 count is 10, not the locked 8 (per Idea checklist item 1). Same finding as F-S-01 but viewed from Consistency: there is a literal mismatch between the Idea contract (`grep -c "^## " ... = 8`) and the staged artifact (10). The leader's resolution (STUB-removal note) means the post-ship file will satisfy the contract, but the staged file as currently shaped does not. Manager should make sure the promotion step + Execution Item-A task explicitly preserve the contract.

## Must-preserve

- Empirical-verification table (lines 53-67) — gold standard for downstream consumability.
- Iter3 vocabulary fix posture (5 Types verified verbatim from source).
- All path citations in backticks.

## Verdict

PASS. Two Low findings; both are minor textual drift, not semantic regressions.
