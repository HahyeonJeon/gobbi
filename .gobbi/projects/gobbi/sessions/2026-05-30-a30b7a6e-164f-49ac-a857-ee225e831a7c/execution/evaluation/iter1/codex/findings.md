# Codex Evaluation Findings

## Project

VERDICT: REVISE

- [High] The change does not fully meet the "principles now state instructions literally; obscuring metaphors gone" goal because live agent/delegation instruction surfaces still teach Principle 6 through the retired metaphor. Evidence: `.gobbi/projects/gobbi/agents/assistant.md:35` says "refuse to transact in vagueness"; `.gobbi/projects/gobbi/agents/assistant.md:115` says "Principle 6: refuse vagueness"; `.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:37` says "Principle 6 — refuse vagueness". These are live docs, not frozen session/archive material, and they contradict the new P6 Iron Law at `.gobbi/projects/gobbi/skills/principles/SKILL.md:141`.

## Consistency

VERDICT: REVISE

- [Medium] `CLAUDE.md` still has a stale principle-count reference. Evidence: `.claude/CLAUDE.md:31` correctly says "The 14 principles below", and `.claude/CLAUDE.md:48` adds row 14, but `.claude/CLAUDE.md:62` still says "`13 behavioral principles every agent must follow`". The prompt required the principle count to be 14 in every place it appears in `CLAUDE.md` and the principles file.

- [High] Live docs still contain the old P6 metaphor/old-Iron-Law shorthand after the P6 rewrite. Evidence: `.gobbi/projects/gobbi/agents/assistant.md:35` repeats "refuse to transact in vagueness"; `.gobbi/projects/gobbi/agents/assistant.md:115` and `.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:37` both retain "refuse vagueness". This is stranded old wording in `agents/` and `skills/`, which the Risk perspective grep explicitly had to cover.

- [Medium] P10 wording was only partially migrated in live backlogs. Evidence: `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md:29` updates the title to "Change Only With a Real Trigger" but still says "real motivator"; `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md:35` still says "witness-pattern"; `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md:44` still says "witness-backed"; `.gobbi/projects/gobbi/backlogs/ci-symlink-integrity-check.md:29` still cites "Principle 10 (witness-bound work)". These are live backlog references to the old title/concept vocabulary, not the intentional quoted `"a witness"` counter-example inside P14.

- [Pass evidence] The `CLAUDE.md` Iron Law table itself matches the current principles file character-for-character for rows 1-14. I verified this with an `awk` extraction of `**Iron Law:**` lines from `.gobbi/projects/gobbi/skills/principles/SKILL.md` diffed against the numbered table rows in `.claude/CLAUDE.md`; the diff was empty. `grep -c "^## Principle " .gobbi/projects/gobbi/skills/principles/SKILL.md` returns `14`.

## Structure

VERDICT: REVISE

- [Medium] P14 does not preserve the existing principle-section separator pattern. Evidence: `.gobbi/projects/gobbi/skills/principles/SKILL.md:380` ends P13's mechanism, and `.gobbi/projects/gobbi/skills/principles/SKILL.md:382` immediately starts `## Principle 14 — Write Plainly and Literally`; there is no `---` separator between P13 and P14. A direct separator check reported `missing separator before line 382`.

- [Pass evidence] P14 otherwise follows the expected section shape: title at `.gobbi/projects/gobbi/skills/principles/SKILL.md:382`, Iron Law at line 384, Why at line 386, Discipline at line 388, Anti-rationalizations at line 394, and Mechanism at line 400. Markdown remains parseable as plain Markdown, but the local principle-format contract is broken by the missing separator.

## Risk

VERDICT: REVISE

- [High] Whole-tree stale-reference grep found live old vocabulary outside the edited blast radius, so future agents can still load obsolete principle wording. Evidence: `rg -n -L "refuse to transact|refuse vagueness|real motivator|witness-bound|witness-pattern|witness-backed" .claude .agents/skills .codex/agents .gobbi/projects/gobbi/skills .gobbi/projects/gobbi/agents .gobbi/projects/gobbi/rules .gobbi/projects/gobbi/backlogs --glob '!**/sessions/**' --glob '!**/archive/**'` returns the live hits cited above in `agents/assistant.md`, `delegation/templates/assistant.md`, `hooks-domain-mistakes-watchlist.md`, and `ci-symlink-integrity-check.md`. This is the exact failure mode from the project mistake `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`: a docs rename requires whole-file/whole-tree grep for retired wording, not only verification of the directly edited lines.

- [Pass evidence] The deleted `Iron Law Index` does not appear in the searched live docs, and the P13 blast-radius example is correct at `.gobbi/projects/gobbi/skills/principles/SKILL.md:337` through `.gobbi/projects/gobbi/skills/principles/SKILL.md:340`: a new principle now maps to `principles/SKILL.md` plus the `CLAUDE.md` Iron Law table, "two places, one change".

AGGREGATE: REVISE
