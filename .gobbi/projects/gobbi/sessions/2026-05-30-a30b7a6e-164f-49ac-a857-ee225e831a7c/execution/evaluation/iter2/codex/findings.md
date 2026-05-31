# Codex Evaluation Findings

## Project

VERDICT: PASS

- No project-scope finding. The iter1 remediation landed the live-instruction rewrites that previously taught old P6/P10 wording: `.gobbi/projects/gobbi/agents/assistant.md:35` now says "make a vague requirement concrete before acting", `.gobbi/projects/gobbi/agents/assistant.md:115` now says "refine vague requirements before acting", `.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:37` now says "refine vague requirements before acting", `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md:29` and `.gobbi/projects/gobbi/backlogs/ci-symlink-integrity-check.md:29` now use trigger vocabulary, and `.gobbi/projects/gobbi/skills/interview/SKILL.md:67` now names the section `Trigger`.

## Consistency

VERDICT: PASS

- No consistency finding. `grep -c "^## Principle " .gobbi/projects/gobbi/skills/principles/SKILL.md` returns `14`; the principles file states "Fourteen principles" at `.gobbi/projects/gobbi/skills/principles/SKILL.md:9`.
- Both Iron Law tables match the principles file character-for-character. I diffed extracted `**Iron Law:**` lines from `.gobbi/projects/gobbi/skills/principles/SKILL.md` against table rows in `.claude/CLAUDE.md` and `.codex/AGENTS.md`; both diffs were empty. The visible count/table evidence is `.claude/CLAUDE.md:31` and `.claude/CLAUDE.md:35` through `.claude/CLAUDE.md:48`, plus `.codex/AGENTS.md:63` and `.codex/AGENTS.md:67` through `.codex/AGENTS.md:80`.
- The prior count miss is fixed in both navigation rows: `.claude/CLAUDE.md:62` and `.codex/AGENTS.md:95` both say `14 behavioral principles every agent must follow`.

## Structure

VERDICT: PASS

- No structure finding. P14 has the required separator before it at `.gobbi/projects/gobbi/skills/principles/SKILL.md:382`, starts at `.gobbi/projects/gobbi/skills/principles/SKILL.md:384`, and has the required separator after it at `.gobbi/projects/gobbi/skills/principles/SKILL.md:404`.
- Section ordering is intact: P13 remains `.gobbi/projects/gobbi/skills/principles/SKILL.md:309`, P14 follows at `.gobbi/projects/gobbi/skills/principles/SKILL.md:384`, and the final single-source note follows P14 at `.gobbi/projects/gobbi/skills/principles/SKILL.md:406`. `git diff --check 31d53f9^..HEAD` and `git diff --check ec2c735^..ec2c735` both exited 0.

## Risk

VERDICT: REVISE

- [Medium] The explicit retired-phrasing grep gate is not clean: `transact in vagueness` still appears in the canonical live principles file at `.gobbi/projects/gobbi/skills/principles/SKILL.md:391`, mirrored by `.agents/skills/principles/SKILL.md:391`. The line is a negative example, but the iter2 brief only locked the quoted `"a witness"` counter-example as intentional and required zero stranded hits for the listed retired phrasings. The exact grep command over the live surface returned this hit: `rg -n -S -L --no-messages 'Specificity Is the Only Currency|transact in vagueness|refuse vagueness|Witness-bound Work|witness-bound|witness-pattern|witness-backed|real motivator|NO CHANGE WITHOUT A REAL MOTIVATOR|Metrics Are Signals' .claude/CLAUDE.md .codex/AGENTS.md .agents .gobbi/projects/gobbi/skills .gobbi/projects/gobbi/agents .gobbi/projects/gobbi/rules .gobbi/projects/gobbi/backlogs --glob '!**/sessions/**' --glob '!**/archive/**'`.
- Pass evidence for the rest of the risk gate: excluding `transact in vagueness`, the same live-surface grep for `Specificity Is the Only Currency|refuse vagueness|Witness-bound Work|witness-bound|witness-pattern|witness-backed|real motivator|NO CHANGE WITHOUT A REAL MOTIVATOR|Metrics Are Signals` returned no hits. The only old-P10 `"a witness"` hit is the user-locked counter-example at `.gobbi/projects/gobbi/skills/principles/SKILL.md:392`, mirrored by `.agents/skills/principles/SKILL.md:392`.

AGGREGATE: REVISE
