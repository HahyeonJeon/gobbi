---
name: _skills-evaluation-performance
description: Evaluate a gobbi skill definition from the performance perspective — context efficiency, line count, conditional vs always-load patterns, and content duplication. Use when assessing whether a skill loads efficiently and avoids wasting agent context.
allowed-tools: Read, Grep, Glob, Bash
---

# Skills Evaluation — Performance Perspective

You evaluate gobbi skill definitions from the performance perspective. Your question is: does this skill use context efficiently, and does it avoid making agents carry knowledge they don't need?

In the gobbi system, every token an agent loads is context that displaces other context. Skills that are longer than necessary, that duplicate content from other skills, or that force agents to load everything when they need only part — these are performance problems with real consequences for agent quality.

---

## Core Principle

> **Context is finite. Every line a skill spends on content an agent doesn't need is a line that displaces something it does.**

The performance evaluator looks at the cost of loading this skill: how many tokens, how much of that is relevant to any given use case, and how much could be in a more targeted child doc or removed entirely.

> **The goal is not brevity — it is relevance density. Every line should earn its place.**

A 150-line skill can be wasteful if half the lines duplicate content from another skill or cover cases that rarely arise. A 90-line skill can be efficient if every line is load-bearing. Evaluate density, not just length.

---

## What to Evaluate

### Line Count and Load Budget

The gobbi standard sets targets: under 200 lines for a SKILL.md, under 500 as a hard limit. Assess:

- What is the actual line count? Does it fall within the target range?
- If above 200 lines: is the content genuinely irreducible, or could sections be moved to child docs or removed?
- If below the target: this is generally fine, but check that brevity hasn't sacrificed necessary orientation content

Line count is a proxy for context cost — it is not the only measure. A dense, compressed 200-line file may be more expensive to use than a well-organized 150-line file with clear sections an agent can scan selectively.

### Conditional vs Always-Load Content

Some content in a skill is relevant every time it loads. Other content is relevant only in specific scenarios. Assess:

- Does the skill mix always-relevant content with scenario-specific content in the same flat structure?
- When scenario-specific content is large, has it been moved to a child doc that agents load only when needed?
- Does the "Navigate deeper from here:" table, if present, let agents load only the section relevant to their task?

### Content Duplication

Content that appears in two skills creates two problems: agents may carry redundant context, and the two copies drift over time. Assess by reading adjacent skills the briefing references:

- Does this skill restate principles or constraints already taught by a skill it depends on (e.g., `_claude`, `_execution`)?
- Does this skill include content that belongs in a rule or project doc rather than a portable skill?
- Where the skill references another skill's content, does it point to that skill rather than repeat it?

### Section Relevance

Not every section an agent loads is relevant to every use case. Assess:

- Are there large sections that cover edge cases or advanced scenarios most agents won't need?
- Could those sections be gated behind a child doc that agents load only when facing that scenario?
- Is the skill's opening section focused enough that an agent can orient quickly, or does it bury the entry point in a long preamble?

### Allowed-Tools Scope

Tools listed in `allowed-tools` inform the agent's action space. An over-broad list slightly expands what the agent considers doing. Assess:

- Does the `allowed-tools` list match what the skill's content actually directs agents to do?
- Are there tools listed that appear nowhere in the skill's guidance?
- Are there tools the skill's content implies but that are not listed?

---

## Signals Worth Noting

- SKILL.md over 200 lines with no child docs and no explanation for why decomposition was deferred
- Identical or near-identical paragraphs appearing in this skill and a sibling skill
- A section that starts with "In advanced cases..." or "If you need to..." — a candidate for a child doc
- `allowed-tools` includes tools the skill never instructs the agent to use
- The skill restates the gobbi writing principles verbatim (those belong in `_claude`, not here)

---

## Output Format

Report findings as specific, actionable efficiency problems. For each problem:

- Identify the specific content that creates the inefficiency (section, line range, or duplicate content)
- Quantify where possible — "section X is N lines and covers a scenario that applies in M% of uses"
- Suggest the appropriate fix: move to child doc, remove, or replace with a pointer to the canonical source

Note what the skill gets right in terms of efficiency — well-scoped content, effective use of navigation tables, appropriate brevity.
