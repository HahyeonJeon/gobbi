---
name: _skills-evaluation-aesthetics
description: Evaluate a gobbi skill definition from the aesthetics perspective — naming clarity, writing quality, style consistency with the gobbi skill corpus, and readability for a fresh reader. Use when assessing whether a skill is well-crafted and intelligible without prior context.
allowed-tools: Read, Grep, Glob, Bash
---

# Skills Evaluation — Aesthetics Perspective

You evaluate gobbi skill definitions from the aesthetics perspective. Your question is: is this skill well-crafted — clear naming, readable prose, consistent style, and intelligible to a fresh reader?

Aesthetics is not about polish for its own sake. A skill with unclear naming fires on the wrong tasks. A skill with inconsistent style produces agent behavior that doesn't match the system's mental model. A skill that requires prior context to understand produces agents that guess.

---

## Core Principle

> **A skill's first job is to be understood. An evaluator that cannot understand it cannot use it.**

The aesthetics evaluator reads the skill as a fresh reader would — someone who has not seen the system before, who is about to load this skill for the first time. If orientation requires context not in the skill itself, the skill has failed its primary job.

> **Consistency with the gobbi skill corpus is not a style preference — it is a cognitive load reduction.**

Agents move across many skills in a session. When every skill follows the same writing patterns — blockquotes for principles, tables for navigation, command tone in descriptions — agents spend less effort parsing structure and more effort absorbing content. Inconsistency is friction.

---

## What to Evaluate

### Naming Clarity

The skill's directory name is how agents and orchestrators discover and refer to it. Assess:

- Does the name accurately predict the skill's content? Would a reader who knows only the name know when to load it?
- Does the name follow the gobbi naming convention — hyphen-separated, correct tier prefix (`_` or `__`), no underscores in the body?
- Is the name as short as it can be while remaining unambiguous?
- For a multi-word name: does the word order read naturally, or does it feel like a keyword dump?

### Description Quality

The `description` field is the skill's one-sentence pitch to the auto-invocation system and to any agent scanning the skill map. Assess:

- Does it open with an action phrase or "Use when..." that names the specific trigger scenarios?
- Is it written in command tone ("Use when writing or reviewing X") rather than feature tone ("This skill provides X")?
- Is it specific enough to distinguish this skill from adjacent ones? Could you tell from the description alone which skill to load?
- Is it a single sentence? Multi-sentence descriptions suggest the scope is unclear.

### Prose Quality

The skill teaches a mental model. Prose that is ambiguous, verbose, or uses jargon without definition forces agents to guess. Assess:

- Does the opening section tell the reader immediately what this skill is and when to load it?
- Are principles stated as principles — declarative, general, transferable — or as procedures?
- Is jargon either defined inline or obviously understood from context (gobbi-specific terms that appear in the CLAUDE.md or skill map)?
- Are there sentences that a reader would need to re-read to parse? These should be simplified.
- Does the writing feel like the rest of the gobbi skill corpus, or does it have a different voice or register?

### Style Consistency

Gobbi skills follow established formatting patterns. Assess by reading a sample of existing skills in `.claude/skills/`:

- Are blockquotes (`>`) used for bold principle statements only — not for side notes, warnings, or emphasis?
- Does the "Navigate deeper from here:" heading appear when child docs exist, using the exact phrasing?
- Are tables used for structured comparisons and navigation — not for content that would read better as prose?
- Do headings follow the gobbi pattern — title case for `##` sections, sentence case below?
- Is whitespace consistent — blank lines between sections, consistent use of bold and lists?

### Fresh-Reader Intelligibility

Load the skill as if you have never seen gobbi before. Assess:

- Can a reader understand what this skill does and when to use it from the first few lines alone?
- Does the skill assume context that is never established — acronyms, referenced systems, or prior knowledge of another skill's content?
- Would a reader know what to do after reading the skill, or would they need to read several other skills first to make sense of it?

---

## Signals Worth Noting

- A description that contains the phrase "provides" or "contains" (feature tone, not command tone)
- Blockquotes used for caveats, warnings, or emphasis rather than principle statements
- Inconsistent heading levels — `###` for a concept that warrants `##`, or vice versa
- A section titled "Overview" or "Introduction" that repeats the opening paragraph
- Terms like "LLM," "context window," "token budget" used without acknowledgment that the reader is an AI agent, in a way that would be confusing
- The skill uses "you" to address the agent clearly in some places and impersonally in others (inconsistent voice)

---

## Output Format

Report findings as specific, named craft problems. For each problem:

- Quote or reference the specific text, heading, or name that has the issue
- Explain what cognitive problem it creates for a reader or agent
- Suggest a direction for improvement without prescribing the exact wording

Note what is well-crafted — clear naming, consistent style, strong principle statements, effective use of formatting. Specific praise helps authors understand what patterns to preserve.
