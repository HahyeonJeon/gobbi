---
name: caveman-plain-concise-writing
description: Prior art on plain and concise writing for LLM/agent text — caveman plugin, Strunk & White, plain-language.gov, Flesch readability, Anthropic guidance — anchored the rewrite of Principle 7 "Say/Write Plainly, Briefly, and Literally".
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-04
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, principle-7, plain-language, concision, prior-art, research]
title: Plain and Concise Writing Prior Art — Anchor for Principle 7 Rewrite
source: sessions/2026-06-02-9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10/ideation/rawdata/research/caveman-plain-concise-writing.md
accessed: 2026-06-04
ref_type: internal-research
---

# Research — Plain and Concise Writing Prior Art (anchor for Principle 7 rewrite)

Goal: gather prior art on making LLM / agent text PLAIN and CONCISE — simple words, short clear sentences, no needless length — to anchor the rewrite of gobbi Principle 7 ("Say/Write Plainly, Briefly, and Literally"). The rewrite KEEPS the existing "literal, not metaphorical" point and ADDS: simple words, short clear sentences, cut needless length. Motivated by two costs: token usage AND user comprehension.

Every external claim below is cited with a URL. The caveman ruleset is quoted from the repo's own source files (cloned and read directly), so its confidence is high.

---

## PRIMARY SOURCE — caveman

**What it is (1 line):** A Claude Code / multi-agent plugin that puts an agent into a "caveman" output mode — terse, fragmented prose that cuts ~65–75% of OUTPUT tokens while keeping full technical accuracy.
**URL:** https://github.com/JuliusBrussee/caveman

**Problem it targets:** AI agents produce verbose responses. Verbosity costs tokens (money + latency) and makes the user wade through filler. Caveman's slogan: *"why use many token when few do trick"* (README). It frames the cost precisely: *"Caveman no make brain smaller. Caveman make *mouth* smaller."* — i.e. it compresses the OUTPUT, not the reasoning (`skills/caveman/SKILL.md`; README).

**HOW it works (technique) — confidence HIGH (read from source files):**
Caveman is fundamentally a **system-prompt / ruleset** injected as always-on context (via a SessionStart hook that emits the ruleset as hidden system context), plus optional intensity levels and a separate file post-processor (`caveman-compress`). The behavior-defining ruleset lives in `skills/caveman/SKILL.md`. The ACTUAL rules it ships:

Verbatim from `skills/caveman/SKILL.md` (the "## Rules" block):

> Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). Technical terms exact. Code blocks unchanged. Errors quoted exact.
>
> Pattern: `[thing] [action] [reason]. [next step].`
>
> Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
> Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

The concrete word/structure rules, decomposed:
1. **Drop articles** (a/an/the).
2. **Drop filler words** — explicit list: `just / really / basically / actually / simply`.
3. **Drop pleasantries** — `sure / certainly / of course / happy to`.
4. **Drop hedging** — (and the `ultra` level says strip conjunctions too).
5. **Prefer short synonyms** — explicit examples: *"big not extensive"*, *"fix not 'implement a solution for'"*.
6. **Keep technical terms exact**; code blocks and quoted error strings unchanged.
7. **Sentence shape:** `[thing] [action] [reason]. [next step].` — short, one-clause statements.

**Auto-Clarity guardrail (important):** caveman explicitly TURNS OFF terseness when terseness would cause a misread. Verbatim from `## Auto-Clarity` in `skills/caveman/SKILL.md` — drop the terse mode for:
> - Security warnings
> - Irreversible action confirmations
> - Multi-step sequences where fragment order or omitted conjunctions risk misread
> - Compression itself creates technical ambiguity
> - User asks to clarify or repeats question

This is the single most relevant lesson for gobbi: **concision has a floor — never compress to the point of ambiguity.** Caveman also exempts `code/commits/PRs` from the terse style ("write normal") in its `## Boundaries` section. (Gobbi's principle governs ALL agent text including commits/comments — so we adopt caveman's *plainness* rules but NOT its article-dropping/fragment-telegraphing register, which would clash with gobbi's "clear, complete sentences" intent.)

---

## SURROUNDING PRIOR ART

### 1. Strunk & White — "Omit needless words" (Elements of Style, Rule 17)
**What it is:** The canonical concision rule in English style guidance (1918 / 1959).
**URL:** https://news.cornell.edu/stories/2009/03/omit-needless-words-elements-style-turns-50
**Concrete rule (verbatim):**
> "Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts."
**Takeaway for us:** the concision test is per-word and per-sentence: every word must earn its place. This is the strongest anchor for an "every word must do work; cut the rest" Practice bullet. **Confidence HIGH** (quote is widely attested and primary-rule-numbered).

### 2. Federal Plain Language Guidelines / plainlanguage.gov + digital.gov
**What it is:** The U.S. government's plain-language standard, mandated by the Plain Writing Act of 2010.
**URLs:**
- https://digital.gov/guides/plain-language/principles/short-simple/
- https://www.archives.gov/open/plain-writing/10-principles.html
**Concrete rules:**
- **Short sentences, simple words, active voice:** *"Choose simple, clear words and the active voice to encourage understanding."* and *"Long, complex sentences containing multiple phrases and clauses can confuse the reader."*
- **One idea per sentence / average length:** plain-language guidance targets ~15–20 words per sentence.
- **Cut empty modifiers (explicit list):** avoid *"absolutely, actually, completely, really, quite, totally, and very"* — *"not necessary and may even be nonsensical."* (digital.gov) — this list overlaps caveman's filler list, cross-validating it.
- **Word substitution (shorter for longer):** *"Due"* not *"Due and payable"*; *"Stop"* not *"Cease and desist"*.
- **Common words, explain jargon:** use everyday words; if a technical term is necessary, explain it on first reference.
**Takeaway for us:** directly supports "simple/common words over fancy ones," "short sentences," "cut empty intensifiers," and "define a term you must use." **Confidence HIGH** (government standard, quotes pulled from the page).

### 3. Anthropic prompt-engineering / Claude guidance — "be clear, direct, concise"
**What it is:** Anthropic's official guidance on writing for and from Claude.
**URLs:**
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- https://console.anthropic.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct
**Concrete rules (paraphrase, from search of the official docs):**
- Newer Claude models are deliberately *"more concise and natural ... more direct ... less verbose."* The house style of the model itself is brevity.
- Claude *"provides the shortest answer it can ... addresses the specific query ... avoiding tangential information unless absolutely critical."*
- System prompts should *"use simple, direct language"*.
**Takeaway for us:** this is the LLM-context anchor — the platform's own guidance says the target behavior is short, direct, on-topic answers with tangential info cut. **Confidence MEDIUM-HIGH** (paraphrased from official-doc search snippets, not quoted verbatim from a fetched page; the direction is unambiguous and consistent across multiple official URLs).

### 4. Flesch Reading Ease / readability guidance
**What it is:** The standard readability metric (Rudolf Flesch) — readability is a function of average sentence length and average syllables per word.
**URL:** https://readable.com/readability/flesch-reading-ease-flesch-kincaid-grade-level/
**Concrete rules:**
- *"Aim for 15–20 words per sentence. Stick to one idea per sentence."*
- *"Use simpler words and replace long terms with shorter synonyms (e.g., 'utilize' → 'use')."*
- Avoid jargon; explain technical terms or use everyday language.
**Takeaway for us:** quantifies "short sentences" (15–20 words, one idea each) and gives the mechanism for "simple words" (fewer syllables → more readable). **Confidence HIGH** (the metric and the 15–20-word / one-idea heuristics are standard).

---

## Cross-source synthesis

| Move | caveman | Strunk&White | plainlanguage.gov | Flesch/readability | Anthropic |
|---|---|---|---|---|---|
| Cut filler / empty words (just, really, actually, very) | Yes | Yes (omit needless words) | Yes (modifier list) | — | Yes (cut tangential) |
| Cut pleasantries / throat-clearing / hedging | Yes | — | — | — | Yes (direct) |
| Short sentences (~15–20 words, one idea each) | Yes (pattern) | Yes (per-sentence test) | Yes | Yes (explicit) | — |
| Prefer the shorter / more common word | Yes (big not extensive) | — | Yes (due not due and payable) | Yes (utilize→use) | Yes (simple words) |
| Keep / define necessary technical terms | Yes (terms exact) | — | Yes (explain on first use) | Yes | — |
| Active, direct phrasing | — | Yes | Yes (active voice) | — | Yes (direct) |
| Concision has a FLOOR — never compress into ambiguity | Yes (Auto-Clarity) | implicit | Yes (clarity is the goal) | — | Yes (clarity over brevity) |

The seventh row is the guardrail every source implies and caveman makes explicit: brevity serves comprehension, so you stop cutting before the meaning gets ambiguous. The rewrite must carry this floor or it will read as "shorter is always better," which is wrong.

---

## Confidence summary
- **caveman ruleset** — HIGH (quoted from cloned `skills/caveman/SKILL.md`, `skills/caveman-review/SKILL.md`, `src/rules/caveman-activate.md`, `CLAUDE.md`).
- **caveman token-reduction %** — LOW (their unverified benchmark claim; cite as their claim).
- **Strunk & White Rule 17** — HIGH (canonical, primary quote attested).
- **plainlanguage.gov / digital.gov** — HIGH (government standard; quotes pulled from page).
- **Flesch / readability** — HIGH (standard metric; 15–20-word / one-idea heuristics corroborated).
- **Anthropic prompt guidance** — MEDIUM-HIGH (paraphrased from official-doc search snippets, consistent across multiple official URLs; not quoted from a fetched page).
