# Risk Perspective — Preparation iter1 (Claude)

**Question**: What gaps could surface late and damage Execution / Wrap-up?

## Scenario checks

- R1 — Manager forgets to promote the stub at EXIT → Planning operates against a non-existent file. Likelihood: low (named explicitly), Impact: medium. Mitigated by Open Concern #4 + lines 121-126.
- R2 — Execution writes content into the stub but forgets to remove the STUB-metadata block AND the Constraints block → post-ship `grep -c "^## "` returns 9 or 10, not 8 → Idea checklist item 1 validation fails. Likelihood: medium, Impact: low (caught by Execution-time grep). Suggested: Planning task A.1 explicitly lists "remove STUB-metadata block; merge or delete Constraints" as sub-steps.
- R3 — Wrap-up Step 2.5 placement (Open Concern #1) resolved as option (a) — new table row at position 2.5 — could conflict with the table's existing numbering scheme. Likelihood: low if Planning DISCUSSION picks option (b) as recommended.
- R4 — Path Conventions cross-link breaks if leader picks option (a) (normalize link target lowercase) and a future reader expects the canonical "Path Conventions" capitalized H3. Likelihood: low.
- R5 — `.agents/skills/codex` directory symlink uses wrong relative path → codex cannot load its own skill → dogfood broken. Mitigation: Open Concern #5 spells out the exact symlink targets (`../../.gobbi/projects/gobbi/skills/codex` for directory; `../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` for file). Pattern matches the 16 existing symlinks. Likelihood: low.
- R6 — Stub's `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion` may not match the workspace-doc-standard expected tool set for a SKILL.md frontmatter. Likelihood: depends on `_claude/SKILL.md` standard; not verified here.

## Findings

- **F-R-01** (Type: `assumption_risk` / Domain: `docs-sync` / Disposition: `open` / Confidence: 50 / Severity: Medium). Stub frontmatter line 4 declares `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion`. This treats the SKILL.md as if it were an agent/command spec. Most existing project SKILL.md files in `.gobbi/projects/gobbi/skills/` (verified: memorization 303-line, mistake 133-line, delegation 301-line, evaluation 589-line, gobbi 254-line, wrap-up 363-line) — none are spec'd with `allowed-tools` because SKILL.md is a documentation artifact, not an executable surface. Adding `allowed-tools` to a SKILL.md frontmatter may break frontmatter validators OR may simply be ignored. Suggested: verify against `_claude/SKILL.md` standard (or `.claude/skills/claude/SKILL.md`) whether SKILL.md frontmatter accepts `allowed-tools`, and remove if it does not. This is a Preparation hygiene call — manager should clarify before Planning.

- **F-R-02** (Type: `assumption_risk` / Domain: `process` / Disposition: `open` / Confidence: 50 / Severity: Low). Open Concern #3 (Coverage Ownership Matrix exact cell text) is genuinely deferred to user DISCUSSION. Risk: if user picks language Execution can't grep-match to anchor cross-link 7, the cross-link wires to a non-stable string. Mitigation: Planning DISCUSSION confirms exact cell text + the cross-link target string in one breath.

## Must-preserve

- Open Concern #5's explicit symlink-target paths (closes the highest-likelihood Execution-time risk).
- Self-removing STUB-metadata note (prevents Execution from shipping it).
- Honest "1 gap closed inline; 0 deferred" status (no risks hidden).

## Verdict

REVISE candidate — but only on F-R-01 (Confidence 50, Severity Medium). Verdict thresholds say "any High with Confidence ≥ 50 → REVISE". F-R-01 is Medium-50, which is below REVISE threshold (High required). Net Risk verdict: PASS with one open hygiene check the manager should resolve before/during Planning.
