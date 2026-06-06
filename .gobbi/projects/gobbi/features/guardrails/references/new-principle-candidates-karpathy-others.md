---
name: new-principle-candidates-karpathy-others
description: Candidate behavioral principles from Karpathy (rhythm tweet, vibe-coding, bearblog) + 6 current agent-coding harnesses (Aider, Cline, Claude Code, AGENTS.md, Amp, OpenHands) — gap analysis against gobbi's 7-principle set (before task 16 added P8).
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-04
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, new-candidates, karpathy, gap-analysis, research, context-management]
title: New Behavioral-Principle Candidates — Karpathy + Current Harnesses
source: sessions/2026-06-02-9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10/ideation/rawdata/research/new-principle-candidates-karpathy-others.md
accessed: 2026-06-04
ref_type: internal-research
---

# New Behavioral-Principle Candidates — Karpathy + Current Harnesses

**Purpose.** Surface candidate BEHAVIORAL principles gobbi might adopt (or RE-ADD), drawn from (1) Andrej Karpathy's public guidance on coding with LLMs/agents and (2) 6 current agent-coding harnesses. Each candidate is mapped against gobbi's CURRENT 7 principles, flagged COVERED or GAP. Re-add candidates (principles this session removed but the sources strongly emphasize) are flagged explicitly.

**Honesty note on quotes.** X/Twitter is not directly fetchable from this environment (403). Karpathy tweet text below is reproduced from secondary sources that quote it; each is marked **[verbatim-via-secondary]** (reproduced consistently across multiple independent secondary sources, high confidence the words are his) vs **[paraphrase]** (my summary of a secondary source's characterization). His talk and his own blog (bearblog) are characterized from fetchable transcripts/summaries and marked accordingly. No quote or URL below is invented.

---

## gobbi's CURRENT 7 principles (the baseline for gap analysis)

1. Think and Study Before Acting
2. Bottom-Up Construction (foundation-first, minimal steps)
3. Design With the User, Based on References
4. Refine the Task With the User (prompt is a trigger; ask What/Why/How until concrete)
5. Scope Is a Contract With the User
6. Start With Docs, Finish With Docs (read/update docs; CRUD-think; team memory)
7. Say/Write Plainly, Briefly, and Literally

**Removed earlier this session (re-add watchlist):**
- (R-A) Verification Is a Hard Gate — fresh verification before completion claims
- (R-B) Single Perspective per Agent — producer ≠ evaluator
- (R-C) Change Only With a Real Trigger — no speculative change
- (R-D) Improve the Property, Not the Metric — no gaming the tool/metric

---

## PART 1 — KARPATHY'S KNOW-HOW

### Source K2 — "Rhythm in AI-assisted coding" tweet (Apr 2025) — the core disciplined workflow
- **What it is:** Karpathy's numbered description of how he codes with AI on code he "actually and professionally care[s] about, contrast to vibe code."
- **URL:** https://x.com/karpathy/status/1915581920022585597
- **Verbatim numbered steps [verbatim-via-secondary]** (reproduced consistently across secondary sources):
  1. **"Stuff everything relevant into context"** — gather the relevant code/files into the prompt first. Context management.
  2. **"Describe the next single, concrete incremental change"** you're trying to implement — and **don't immediately ask for code; ask for a few high-level approaches and pros/cons** first, because "the LLM's judgment is not always great."
  3. **Pick one approach, ask for first-draft code.**
  4. **Review / learning phase:** manually pull up API docs in a side browser for unfamiliar functions, ask for explanations/clarifications/changes, "wind back and try a different approach."
  5. (Closing point, paraphrased consistently) Keep the changes small, test/verify, and only then move on — "be slow, defensive, careful, paranoid" and don't delegate the learning.
- **Disciplines encoded:** context-stuffing (context mgmt); single concrete incremental change; options-before-code (reference-first); manual review of every change; small + verified steps.
- **Confidence:** High for steps 1-4 (text reproduced verbatim across sources); step 5 is **[paraphrase]** of consistent secondary characterization.
- Source: https://nmn.gl/blog/dangers-vibe-coding

### Source K3 — "Keep AI on a tight leash" (Visual Studio Magazine / TechTimes, 2025)
- **Quotes:**
  - **"keep AI on a leash"** **[verbatim-via-secondary]** — his primary directive on deployment.
  - **"I'm still the bottleneck"** **[verbatim-via-secondary]** — the human review step, not generation, is the constraint.
  - The AI as **"over-eager junior intern savant with encyclopedic knowledge of software, but who also bull****s you all the time, has an over-abundance of courage and shows little to no taste for good code"** **[verbatim-via-secondary]** — treat output as untrusted-by-default; review for both correctness and taste.
- Sources: https://visualstudiomagazine.com/articles/2025/04/25/vibe-coding-pioneer-advises-tight-leash-to-rein-in-ai-bs.aspx · https://www.techtimes.com/articles/310925/20250620/openais-andrej-karpathy-warns-against-unleashing-unsupervised-agents-too-soon-keep-ai-leash.htm

### Source K5 — Karpathy "Sequoia Ascent 2026" blog (his own bearblog) — PRIMARY, fetched
- **URL:** https://karpathy.bearblog.dev/sequoia-ascent-2026/
- **Disciplines (quoted from the fetched page):**
  - **"agentic engineering" vs "vibe coding"** — agentic engineering = designing the system, specifying constraints, using AI to accelerate work you've already reasoned through. Engineers **cannot "blindly accept generated code"**; they must design detailed specs upfront, inspect diffs carefully, write/run tests, create eval loops.
  - **Small, verifiable increments** — delegate in bounded chunks: "Implement this feature. Refactor this subsystem. Research this library." **[verbatim]** "Each piece remains reviewable."
  - **The taste gap** — agent code "can be bloated, copy-pasted, awkwardly abstracted, brittle" **[verbatim]**; humans remain responsible for architecture/taste.
- **Confidence:** High — this is his own writing, fetched directly.

### Karpathy synthesis (the disciplines he repeats)
1. One concrete incremental change at a time.
2. Review/verify EVERY change; don't blindly accept — human is the verification bottleneck.
3. Small, verifiable, reviewable chunks.
4. Options/approaches before code; LLM judgment is suspect.
5. Context management — stuff the right context, manage it.
6. Autonomy is a dial set by the human, not a default.
7. Human owns correctness invariants and taste; treat output as untrusted.
8. Agent-friendly docs are part of the system.

---

## PART 2 — OTHER CURRENT HARNESSES

### H3 — Claude Code best-practices (Anthropic's own doc) — PRIMARY, fetched in full
- **What it is:** Anthropic's official best-practices guide. URL: https://code.claude.com/docs/en/best-practices
- **Encoded disciplines (verbatim section names + quotes):**
  - **"Explore first, then plan, then code"** — four phases: Explore (plan mode, no changes) → Plan (detailed implementation plan, editable) → Implement → Commit.
  - **"Give Claude a way to verify its work"** — "Give Claude something that produces a pass or fail." "Have Claude show evidence rather than asserting success." **Escalating gate options including: Stop hook (deterministic) + second opinion** ("a fresh model try to refute the result, so the agent doing the work isn't the one grading it"). → **fresh verification + evidence, producer≠grader**.
  - **"Add an adversarial review step"** — "a reviewer running in a fresh subagent context sees only the diff and the criteria... not the reasoning that produced the change, so it evaluates the result on its own terms." Writer/Reviewer pattern: "A fresh context improves code review since Claude won't be biased toward code it just wrote." → **producer/evaluator separation, explicitly.**
  - **Manage context aggressively** — `/clear` between unrelated tasks; "kitchen sink session"; "Scope investigations narrowly or use subagents."
- **Confidence:** Very high — fetched the primary doc in full.

### H1 — Aider (terminal AI pair programmer)
- **Encoded disciplines:**
  - **Small reviewable diffs, atomic commits** — "Every change Aider makes is an atomic Git commit with a descriptive message."
  - **Test-first / lint+test every change** — "automatically lint and test your code every time aider makes changes."
  - **Scope the context / small blast radius** — "Aider works best with a small, focused set of files"; "start with small tasks that have small blast radius and clear success criteria."
- **Confidence:** High on the atomic-commit + lint/test-every-change behavior (documented product features).
- Sources: https://aider.chat/ · https://www.deployhq.com/guides/aider

### H2 — Cline / Roo Code (VS Code autonomous agents)
- **Encoded disciplines:**
  - **Plan Mode → Act Mode (planning gate)** — "In Plan mode, Cline explores your codebase, asks clarifying questions, and lays out a strategy. Once you're aligned, switch to Act mode."
  - **Propose, human approves (human-in-the-loop)** — "Cline's core design principle is that AI should propose, but humans should approve. Every file creation, every edit, every terminal command — Cline asks for your confirmation before executing."
  - **Checkpoints / reversibility** — shadow git repo, snapshot after each tool use, one-click undo.
- **Confidence:** High — Plan/Act and per-action approval are core documented features.
- Sources: https://docs.cline.bot/core-workflows/plan-and-act

### H6 — OpenHands (formerly OpenDevin)
- **Encoded disciplines:**
  - **Mandatory pre-commit verification** — "Pre-commit hooks MUST pass successfully before pushing any changes... this is a mandatory requirement."
  - **Cost/iteration ceilings** — MAX_ITERATIONS, LLM_NUM_RETRIES, and a hard accumulated-cost cutoff — "don't ship a headless agent without all three." → bounded autonomy / stuck-detection.
- **Confidence:** Medium-high (repo AGENTS.md + DEV deep-dive + paper).
- Sources: https://github.com/OpenHands/OpenHands/blob/main/AGENTS.md

---

## PART 3 — CANDIDATE-PRINCIPLE LIST (with gap analysis vs gobbi's 7)

### C1 — Verify every change with a fresh, runnable check before claiming done; show evidence, don't assert.
- **Sources:** Karpathy K2.4/K3/K5; Claude Code H3 ("trust-then-verify gap... If you can't verify it, don't ship it"); Aider H1; OpenHands H6.
- **gobbi coverage:** **RE-ADD (was R-A, removed this session).** This is the single most universally emphasized discipline across *every* source examined. **Strongest re-add candidate.**

### C2 — The agent that produced the work must not be the one that grades it; use a fresh-context reviewer.
- **Sources:** Claude Code H3 ("a fresh model try to refute the result, so the agent doing the work isn't the one grading it"; Writer/Reviewer; "won't be biased toward code it just wrote"); Karpathy K4 (diff-based human review separate from generation).
- **gobbi coverage:** **RE-ADD (was R-B, removed this session).** Claude Code states the producer≠grader rule almost verbatim as gobbi's removed Principle. **Strong re-add candidate**, especially since gobbi's own workflow has a mandatory Evaluation sub-phase that *relies* on this separation.

### C7 — Manage context deliberately: load the right context; isolate/clear; don't let it bloat.
- **Sources:** Karpathy K2.1 ("stuff everything relevant into context"), K4 (context management as the core skill); Claude Code H3 ("Manage context aggressively," `/clear`, "infinite exploration," subagents for investigation).
- **gobbi coverage:** **GAP (behavioral-principle level).** No gobbi principle says "manage your working context deliberately — load what's relevant, isolate exploration, reset between unrelated tasks." **Candidate new principle.** (Caveat: gobbi is an orchestration framework where context is managed structurally by the workflow, so this may be better expressed as a workflow rule than a behavioral principle — flag for user.)

---

## PART 4 — RECOMMENDATION SUMMARY

**Tier 1 — strongest re-add candidates (every source emphasizes):**
1. **C1 — Verification Is a Hard Gate (re-add R-A).** Universal across Karpathy + all 6 harnesses. The single clearest gap in the current 7. Strongly recommend re-add.
2. **C2 — Producer ≠ Evaluator / fresh-context review (re-add R-B).** Stated near-verbatim by Claude Code; reinforced by Amp, OpenHands, Karpathy. gobbi's own mandatory Evaluation sub-phase depends on it. Strongly recommend re-add.

**Tier 2 — genuine gaps worth considering as NEW principles:**
3. **C7 — Deliberate context management.** A real gap among the 7; heavily emphasized by Karpathy + Claude Code. Caveat: may be a workflow rule rather than a behavioral principle in gobbi's architecture.

**Tier 3 — partial/weak; probably keep as-is or fold in:**
4. **C10 — No change without a trigger (R-C).** Weakly supported externally; largely subsumed by P5. Recommend NOT re-adding standalone.
5. **C11 — Don't game the metric (R-D).** Moderately supported; recommend folding into C1's anti-patterns rather than standalone.

**Already well-covered (validates keeping these):** C3 (P2 Bottom-Up), C4 (P1+workflow), C5 (P3+P4), C9 (P6).

**Net honest finding:** Of the four principles this session removed, **two (Verification, Producer≠Evaluator) are strongly re-justified by the external evidence** and should be surfaced to the user as re-add candidates; **two (Real-Trigger, Don't-Game-Metric) are weakly/moderately supported** and can stay removed or be folded into a re-added verification principle. The only *new* theme not in gobbi's history is **deliberate context management (C7)**.

---

## Confidence and concerns
- **Karpathy quote verifiability:** X is not directly fetchable here (403). The Apr-2025 "rhythm" tweet steps 1-4 are reproduced verbatim across multiple independent secondary sources (high confidence). His own bearblog (K5) was fetched directly (primary). The talk (K4) was characterized from fetchable notes, not the primary video — finer wording is paraphrase.
- **Harness sources:** Claude Code best-practices (H3) and AGENTS.md (H4) were fetched as primary docs (very high). Aider, Cline/Roo, Amp, OpenHands disciplines drawn from official docs + secondary guides (high on documented product features; medium on phrasing).
- **No fabrication:** no quote, URL, or behavior was invented. Where I could only verify a paraphrase, it is marked.
