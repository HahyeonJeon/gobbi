---
name: new-principle-candidates-gstack-superpowers
description: Deep-read of gstack and superpowers agent-coding harnesses — behavioral disciplines each encodes and gap analysis against gobbi's 7-principle set (the state before task 16 added P8).
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-04
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, new-candidates, gstack, superpowers, gap-analysis, research]
title: Candidate Behavioral Principles from gstack + superpowers — Gap Analysis vs Gobbi 7
source: sessions/2026-06-02-9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10/ideation/rawdata/research/new-principle-candidates-gstack-superpowers.md
accessed: 2026-06-04
ref_type: internal-research
---

# Research — Candidate Behavioral Principles from gstack + superpowers

**Task:** Deep-read two agent-coding harnesses (gstack, superpowers), extract the behavioral disciplines each encodes, and produce a candidate-principle list with gap analysis against gobbi's current 7 principles.

**Method:** Both repos were cloned to disk and read directly (not from marketing) — `git clone https://github.com/garrytan/gstack` and `git clone https://github.com/obra/superpowers`, plus Jesse Vincent's launch blog. File paths below are paths *inside each cloned repo*. Confidence is HIGH where I read the file's full body; MEDIUM where I read a grep'd excerpt or fetched-summary.

**Baseline — gobbi's current 7 principles (from the brief):**
1. Think and Study Before Acting
2. Bottom-Up Construction
3. Design With the User, Based on References
4. Refine the Task With the User
5. Scope Is a Contract With the User
6. Start With Docs, Finish With Docs
7. Say/Write Plainly, Briefly, and Literally

**Removed in this session (flag if a source re-emphasizes):** Verification Is a Hard Gate · Single Perspective per Agent (producer ≠ evaluator) · Change Only With a Real Trigger · Improve the Property Not the Metric.

---

## TOOL 1 — superpowers (Jesse Vincent / obra)

**What it is:** A zero-dependency Claude Code skills plugin that auto-triggers a brainstorm → plan → implement → verify workflow at session start. Skills are treated as "code that shapes agent behavior," tuned with adversarial pressure-testing. Repo: https://github.com/obra/superpowers

**Confidence: HIGH** — read the full body of CLAUDE.md and 9 of 14 SKILL.md files; grep-confirmed the rest.

### Encoded disciplines

**D1. Design before any code — a HARD GATE, no exceptions for "simple."**
`skills/brainstorming/SKILL.md:12` wraps the rule in `<HARD-GATE>`: "Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity." Anti-pattern section header (`:16`): "This Is Too Simple To Need A Design" — "'Simple' projects are where unexamined assumptions cause the most wasted work."

**D2. One question at a time; lead with a recommendation; YAGNI ruthlessly.**
`brainstorming/SKILL.md:140-145` Key Principles: "One question at a time," "Multiple choice preferred," "YAGNI ruthlessly - Remove unnecessary features from all designs," "Explore alternatives - Always propose 2-3 approaches before settling," "Lead with your recommended option and explain why."

**D3. Design for isolation — interface clarity checkpoint.**
`brainstorming/SKILL.md:94-99`: "Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers? If not, the boundaries need work."

**D4. Test-Driven Development as an Iron Law.**
`skills/test-driven-development/SKILL.md:33` — "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST. Write code before the test? Delete it. Start over."

**D5. Verification before completion — an Iron Law (DROPPED by gobbi).**
`skills/verification-before-completion/SKILL.md:19` — "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE." Gate function: IDENTIFY proof command → RUN fresh/full → READ output+exit code → VERIFY → only then claim. This is nearly verbatim gobbi's *removed* Principle 7.

**D6. Root cause before any fix — an Iron Law (overlaps gobbi's 3-strike rule).**
`skills/systematic-debugging/SKILL.md:19` — "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST." Four mandatory phases. After 3 failed fixes, STOP and question the architecture: "This is NOT a failed hypothesis - this is a wrong architecture. Discuss with your human partner before attempting more fixes." "No 'while I'm here' improvements. No bundled refactoring."

**D7. Reviewer separation — fresh constructed context, never session history (DROPPED by gobbi).**
`skills/requesting-code-review/SKILL.md:8` — "The reviewer gets precisely crafted context for evaluation — never your session's history." `subagent-driven-development/SKILL.md:10`: "They should never inherit your session's context or history — you construct exactly what they need." This is gobbi's *removed* Principle 2.

**D8. Evaluate review feedback technically; no performative agreement; push back when wrong.**
`skills/receiving-code-review/SKILL.md:11` — "Verify before implementing. Ask before assuming. Technical correctness over social comfort." Forbidden: "You're absolutely right!", "Great point!", any gratitude.

**D9. No placeholders in plans; self-review for coverage + type-consistency.**
`skills/writing-plans/SKILL.md:107-115` "No Placeholders" — bans "TBD", "add appropriate error handling," "Similar to Task N," and "References to types, functions, or methods not defined in any task."

**D10. Stop and ask when blocked — never guess; never start on main/master.**
`executing-plans/SKILL.md:40-47` "STOP executing immediately when: hit a blocker / instruction unclear / verification fails repeatedly. Ask for clarification rather than guessing."

**D13. No speculative / theoretical contributions; one problem per PR; no bulk PRs.**
CLAUDE.md "Speculative or theoretical fixes": "Every PR must solve a real problem that someone actually experienced. 'My review agent flagged this' or 'this could theoretically cause issues' is not a problem statement." Also "One problem per PR." This is gobbi's *removed* Principle 10 (Change Only With a Real Trigger), almost word-for-word.

---

## TOOL 2 — gstack (Garry Tan)

**What it is:** A library of ~23 Markdown "specialist" slash-commands (CEO reviewer, eng manager, designer, security officer, QA, release engineer, debugger) for Claude Code. A shared "Builder Ethos" preamble is injected into every skill. Repo: https://github.com/garrytan/gstack

**Confidence: HIGH** for ETHOS.md, AGENTS.md, careful/SKILL.md, and the SKILL.md behavioral sections. **MEDIUM** for review/, codex/, plan-eng-review/ disciplines (read via targeted grep excerpts, not full bodies).

### Encoded disciplines

**E1. User Sovereignty — "AI models recommend. Users decide." The rule that overrides all others.**
`ETHOS.md:111-141`: "Two AI models agreeing on a change is a strong signal. It is not a mandate ... When Claude and Codex both say 'merge these two things' and the user says 'no' — the user is right. Always." gobbi P5 covers "two agents agreeing is a signal not a mandate," but gstack elevates this to its *top* principle.

**E2. Search Before Building — three layers of knowledge; prize first-principles.**
`ETHOS.md:60-107`: "The 1000x engineer's first instinct is 'has someone already solved this?' ... The cost of checking is near-zero." Layer 1 (tried-and-true), Layer 2 (new-and-popular — "scrutinize ... the crowd can be wrong"), Layer 3 (first principles — "Prize them above everything else"). This is gobbi P3/P1's reference-first idea, sharpened with a critical-consumption caveat.

**E3. Boil the Lake — do the complete thing; completeness is cheap with AI.**
`ETHOS.md:34-55`: "When the complete implementation costs minutes more than the shortcut — do the complete thing. Every time." NOTE: directly tensions gobbi P5 (scope-is-a-contract) — surface as a *tension to resolve with the user*, not a clean add.

**E4. Root cause before any fix — Iron Law.**
`/investigate` (`AGENTS.md:32`): "Systematic root-cause debugging. No fixes without investigation." Four phases: investigate, analyze, hypothesize, implement; "Iron Law: no fixes without root cause."

**E5. Adversarial / outside-voice review — a second model that tries to break the work.**
`/codex` (`codex/SKILL.md:25-27`): "Challenge: adversarial mode that tries to break it ... The '200 IQ autistic developer' second opinion." A Codex outside-voice review "surfaced 15+ findings my four Claude reviews missed" — cross-model review catches what same-model review misses.

**E10. Incremental & reversible over big-bang; boring by default.**
`plan-eng-review/SKILL.md:764-784` "Cognitive Patterns": "Incremental over revolutionary — Strangler fig, not big bang. Canary, not global rollout. Refactor, not rewrite," "Reversibility preference — Feature flags, A/B tests ... Make the cost of being wrong low," "Make the change easy, then make the easy change — Refactor first, implement second. Never structural + behavioral changes simultaneously."

**E14. Plain builder voice — no filler, no AI vocabulary.**
`SKILL.md:435-439` Voice: "Direct, concrete, builder-to-builder. Name the file, function, command, and user-visible impact. No filler. No em dashes. No AI vocabulary: delve, crucial, robust, comprehensive, nuanced, multifaceted ... End with what to do." (Strongly matches gobbi P7 — plain/literal — and adds a concrete banned-word list + "end with what to do.")

---

## CANDIDATE PRINCIPLES — with gap analysis vs gobbi's 7

| # | Candidate principle | Supported by | gobbi status |
|---|---|---|---|
| C1 | **Verify before claiming done — fresh evidence, never "should pass."** | superpowers D5; gstack E6 | **RE-ADD.** Matches removed "Verification Is a Hard Gate." Both tools make this an Iron Law. Strongest re-add candidate. |
| C2 | **Root cause before any fix — no symptom patches; after 3 fails, question the architecture.** | superpowers D6; gstack E4 | **PARTIAL GAP.** gobbi P1 has the 3-strike rule, but neither the current 7 nor P1 state "no fix without root-cause investigation first" as a standalone discipline. Both tools elevate it to an Iron Law. |
| C3 | **Producer ≠ evaluator; the reviewer gets constructed context, not session history.** | superpowers D7; gstack E5 | **RE-ADD.** Matches removed "Single Perspective per Agent." Both tools depend on it. Strong re-add candidate. |
| C4 | **Change only with a real trigger — no speculative/theoretical fixes.** | superpowers D13; gstack E15 | **RE-ADD.** Matches removed "Change Only With a Real Trigger." superpowers bans it near-verbatim. |
| C5 | **No metric-gaming — drive the property, not the number; AI-slop is a measurable defect.** | gstack E7; superpowers D4/D9 | **RE-ADD (partial).** Matches removed "Improve the Property, Not the Metric." |
| C6 | **Test-first (TDD): no production code without a failing test you watched fail.** | superpowers D4; gstack E3/E6 | **GAP.** Not in gobbi's 7 at all. May be too implementation-specific for a *general* principle. |
| C14 | **Boil the Lake — do the complete thing because completeness is now cheap.** | gstack E3 | **GAP, but CONFLICTS with gobbi P5.** Directly tensions Scope-Is-a-Contract. Present as a *tension to resolve with the user*, not a clean add. |

### Re-add candidates ranked (honest read)

The two tools, *independently*, both elevate to **Iron Laws** exactly the disciplines gobbi just removed:

1. **C1 — Verification before completion** (removed P7): Iron Law in superpowers, the core of gstack's verification loop. **Strongest re-add.**
2. **C3 — Producer ≠ evaluator / constructed reviewer context** (removed P2): structurally load-bearing in both tools' review topology. gobbi's own evaluation sub-phase still relies on it. **Strong re-add.**
3. **C4 — Change only with a real trigger** (removed P10): superpowers bans speculative PRs near-verbatim. **Moderate re-add.**
4. **C5 — Don't game the metric / AI-slop is a defect** (removed P11): present in both as anti-slop + anti-fake-coverage. **Moderate re-add.**

---

## Per-source confidence

| Source | Read depth | Confidence |
|---|---|---|
| superpowers CLAUDE.md | full body | HIGH |
| superpowers brainstorming / TDD / verification / systematic-debugging / writing-plans / requesting+receiving-code-review / executing-plans / subagent-driven / writing-skills(partial) | full or near-full bodies | HIGH |
| gstack ETHOS.md, AGENTS.md, careful/SKILL.md | full bodies | HIGH |
| gstack SKILL.md (Voice, Completion Protocol, Model-patch, Plan-mode) | full bodies of those sections | HIGH |
| gstack plan-eng-review / review / codex / investigate | targeted grep excerpts, not full bodies | MEDIUM |
| gstack docs/ON_THE_LOC_CONTROVERSY.md, docs/skills.md | grep excerpts | MEDIUM |

## Concerns / honest caveats

1. **One genuine philosophical conflict surfaced.** gstack's **Boil the Lake** (C14: do the complete thing, always do more) directly opposes gobbi's **P5 Scope-Is-a-Contract** and the removed **P10**. This was not resolved — it is a decision for the user. Do not adopt C14 without confronting that tension explicitly.

2. **One workflow conflict.** superpowers' **D11 continuous-execution** ("don't check in between tasks; progress summaries waste the partner's time") tensions gobbi's "user in the loop at each transition." Both are defensible; they trade interactivity for throughput.

3. **I did not read every superpowers skill** (4 of 14 unopened: finishing-a-development-branch, dispatching-parallel-agents, using-git-worktrees, using-superpowers). Their names suggest git/worktree mechanics, not new *behavioral* principles.

4. **gstack reviews read via grep, not full bodies** (review/, codex/, plan-eng-review/ are large generated files). There may be additional disciplines not captured.
