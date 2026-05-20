# Best-stance research: agent-principles

Stance: best-practice. Method: WebFetch on canonical repos + raw markdown URLs. Where wording is in `"quotes"`, it is verbatim from the cited file (subject to WebFetch summarization at edges — flagged where uncertain).

---

## Source 1 — superpowers (obra/superpowers)

- Repo: https://github.com/obra/superpowers
- Author: Jesse Vincent + Prime Radiant
- Top-level discipline files: `README.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`
- Skills dir: `skills/` (14 skills). Most relevant for agent discipline:
  - `using-superpowers/SKILL.md` — meta rules for invoking skills
  - `brainstorming/SKILL.md` — pre-action discipline
  - `writing-plans/SKILL.md` — plan completeness
  - `subagent-driven-development/SKILL.md` — author/reviewer separation
  - `test-driven-development/SKILL.md` — TDD discipline
  - `verification-before-completion/SKILL.md` — proof before done
  - `systematic-debugging/SKILL.md` — root-cause discipline
  - `requesting-code-review/SKILL.md` — review separation
- Project framing (README): "complete software development methodology … built on a set of composable skills and some initial instructions that make sure your agent uses them." Six-stage workflow: Brainstorming → Worktrees → Plan Writing → Subagent-Driven Dev → TDD → Code Review & Branch Finishing.
- Stated foundational philosophy: "Test-Driven Development", "Systematic over ad-hoc", "Complexity reduction", "Evidence over claims".

### Extracted principles (superpowers)

1. **Skills must be invoked, not optimized away.**
   - Source: `skills/using-superpowers/SKILL.md`.
   - "Invoke relevant or requested skills BEFORE any response or action. Even a 1% chance a skill might apply means that you should invoke the skill to check."
   - "If A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT."
   - Red-flag rationalizations explicitly named: `"This is just a simple question"`, `"I need more context first"`, `"I can check files quickly"`. The skill says: questions are tasks, skill checks precede clarifying questions, skills supply the methodology for info gathering.
   - Why strong: encodes the fact that agents will route around process when they think they can. The remedy is a hard rule (1% threshold) plus an explicit list of the rationalizations.

2. **Hard-gate: no implementation before approved design.**
   - Source: `skills/brainstorming/SKILL.md`.
   - "HARD-GATE: Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it."
   - Anti-pattern flagged by name: "This Is Too Simple To Need A Design". The skill says: every project including todos and single-function utilities goes through design review because "Simple projects are where unexamined assumptions cause the most wasted work."
   - Question discipline: ask **one question at a time**, prefer multiple choice.
   - Terminal state of brainstorming is invoking writing-plans — not any other implementation skill.
   - Why strong: directly compensates for the "dive-in" failure mode the user named in draft principle 1. Names the rationalization explicitly.

3. **Plans must be complete; no placeholders.**
   - Source: `skills/writing-plans/SKILL.md`.
   - Tasks decomposed to **2–5 minute steps** following TDD: write failing test → verify failure → implement → verify passing → commit.
   - "Every step contains actual content (code blocks, exact commands, expected output). No 'TBD,' 'add validation,' or 'similar to Task N' placeholders."
   - "All types, functions, and signatures must be defined somewhere in the plan."
   - Plans are written so an unfamiliar engineer can implement without context — i.e., the plan's audience is a fresh subagent.
   - "If a spec spans multiple independent subsystems, break it into separate plans first. Each plan should produce independently testable software."
   - Why strong: maps onto user's draft 3 (bottom-up decomposition) but adds a falsifiable bar — the plan is wrong if any step is vague.

4. **Author ≠ reviewer (structural separation).**
   - Sources: `skills/subagent-driven-development/SKILL.md`, `skills/requesting-code-review/SKILL.md`.
   - "Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration."
   - Subagents "should never inherit your session's context or history — you construct exactly what they need." Reviewers receive "precisely crafted context for evaluation — never your session's history."
   - Two stages: (1) spec compliance, (2) code quality. "Self-review catches issues before handoff" but does not replace independent review.
   - Anti-patterns: skipping review because "it's simple", ignoring Critical issues, "Argue with valid technical feedback". Pushback only with technical reasoning + tests.
   - Why strong: codifies what gobbi already calls "agent that creates must never evaluate itself", with the additional rule that the reviewer must not see the author's session history.

5. **Subagents are scope contracts.**
   - Source: `skills/subagent-driven-development/SKILL.md`.
   - "Subagent gets complete information upfront." Tasks are discrete contracts with clear success criteria — preventing scope creep and reducing clarification loops.
   - Why strong: maps directly onto user's draft 4 (treat user as client; contract scope). Generalizes to: every delegation is a scope contract.

6. **TDD discipline with named rationalizations.**
   - Source: `skills/test-driven-development/SKILL.md`.
   - "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST. … If you didn't watch the test fail, you don't know if it tests the right thing."
   - Named failure modes: skipping verification, testing-after, implementation bias, the "sunk cost trap" ("keep it as reference, write tests first" — flagged as testing-after in disguise; "Delete means delete").
   - "Violating the letter of the rules is violating the spirit of the rules" — answering the rationalization that "it's about spirit not ritual".
   - Why strong: a template for how to write a discipline rule that survives the agent's tendency to rewrite the rule into something easier.

7. **Verification before completion claims.**
   - Source: `skills/verification-before-completion/SKILL.md`.
   - "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE."
   - Gate: IDENTIFY proof command → RUN it freshly → READ full output and exit codes → VERIFY → THEN claim. "Skip any step = lying, not verifying."
   - Anti-patterns named: hedging ("should", "probably", "seems to"); satisfaction expressed before verification; trusting agent success reports without independent confirmation; partial checks (linter passing ≠ compiles); commit without fresh verification.
   - "Evidence before claims, always" — "regardless of fatigue or confidence levels".
   - Why strong: maps to gobbi's `_gobbi-rule` "never skip verification" but adds the exact failure modes (hedge words, partial checks, stale evidence).

8. **Root cause before fix; the dive-in tendency by name.**
   - Source: `skills/systematic-debugging/SKILL.md`.
   - "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."
   - The "dive-in tendency" is named explicitly with the rationalizations the agent uses: "just try this first, then investigate", "I see the problem, let me fix it". Both are violations.
   - "Seeing symptoms ≠ understanding root cause."
   - Triggers for restart: "Just try changing X and see if it works" (guessing), "I don't fully understand but this might work" (incomplete knowledge), "One more fix attempt" (obstinacy).
   - 3-strike rule: after 3 failed fixes, "This is NOT a failed hypothesis—this is wrong architecture." Escalate, don't iterate.
   - Why strong: the most direct documented analog to user's draft principle 1 ("dive-in habit"). The technique — name the rationalization in the agent's own voice — is reusable.

---

## Source 2 — gstack (garrytan/gstack)

- Repo: https://github.com/garrytan/gstack
- Author: Garry Tan
- Top-level discipline files: `CLAUDE.md`, `ETHOS.md`, `SKILL.md`, `AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`
- 23 specialist persona dirs at repo root (each with `SKILL.md`). Most relevant for agent discipline:
  - `ETHOS.md` — three-principle foundation
  - `office-hours/SKILL.md` — brainstorming/forcing-question discipline
  - `plan-eng-review/SKILL.md` — pre-code architecture review
  - `plan-design-review/SKILL.md` — design taste discipline
  - `investigate/SKILL.md` — debug discipline (mirrors superpowers')
  - `review/SKILL.md` — pre-PR review with scope drift check
  - `freeze/SKILL.md` — scope lock as enforced primitive
  - `careful/SKILL.md` — destructive-command guardrails
  - `learn/SKILL.md` — per-project memory

### Extracted principles (gstack)

1. **User Sovereignty (the override-all rule).**
   - Source: `ETHOS.md`.
   - "AI models recommend. Users decide. This is the one rule that overrides all others."
   - Note: "Experienced users actually interrupt Claude *more* frequently, not less." Agent confidence is not user authorization.
   - Why strong: cleanest one-liner the user could borrow. Maps onto `_gobbi-rule` "User Authority" but is sharper — explicitly subordinates *every other rule* to it.

2. **Search Before Building.**
   - Source: `ETHOS.md`, reinforced in `CLAUDE.md`.
   - "The 1000x engineer's first instinct is 'has someone already solved this?'"
   - "Before designing solutions involving concurrency, unfamiliar patterns, or infrastructure, investigate built-in runtime capabilities first. Prize first-principles thinking above all."
   - Three layers: established patterns → current trends → first principles. Real value comes from understanding why conventional approaches fail.
   - Why strong: maps to user's draft principle 6 (find references first, especially for design). gstack's framing — search is a *first instinct*, not a phase — is sharper than "consult references".

3. **Boil the Lake (completeness over shortcuts).**
   - Source: `ETHOS.md`, `plan-eng-review/SKILL.md`.
   - "AI-assisted coding makes the marginal cost of completeness near-zero."
   - "Completeness is cheap. Don't recommend shortcuts when the complete implementation is a lake (achievable) not an ocean (multi-quarter migration)."
   - Plan-eng-review enforces this: "With AI assistance, recommend full test coverage, complete error paths, all edge cases — the marginal cost is near-zero."
   - Why strong: this contradicts and complicates user's draft principle 5 (minimalism / YAGNI). The two principles need to be reconciled — see "Gaps" below. gstack's position is that "what's needed" includes the boring complete version when the cost is low.

4. **The Confusion Protocol — stop and ask when uncertain.**
   - Source: `CLAUDE.md` (per fetched summary).
   - "Architectural decisions are never guessed; Claude stops and asks when uncertain."
   - Reinforced by `investigate`'s 3-strike rule: after 3 failed hypotheses, escalate via AskUserQuestion rather than guessing further.
   - Why strong: matches gobbi's AskUserQuestion-first rule but frames it as a *protocol* triggered by uncertainty signals, not a default mode.

5. **Karpathy's Four Failure Modes are explicitly enforced.**
   - Source: README + workflow skills.
   - The four documented agent failure modes: wrong assumptions, overcomplexity, orthogonal edits (drive-by changes), imperative-over-declarative (vague tasks instead of verifiable goals).
   - Each is wired to a specific skill: `/office-hours` (assumptions), `/review` (overcomplexity + orthogonal edits), `/ship` (imperative→declarative).
   - Why strong: shows that "agents fail at X" can be encoded as "skill Y exists to compensate for X". A model the user could copy.

6. **Iron Law of Investigation.**
   - Source: `investigate/SKILL.md`.
   - "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."
   - Enforced primitives: scope lock (edits restricted to affected directory), 3-strike rule, regression test required, blast radius check (>5 files = ask first).
   - "Recurring bugs in the same area are an architectural smell, not a coincidence."
   - Why strong: nearly verbatim match to superpowers' systematic-debugging principle, suggesting it is community consensus rather than one author's idiosyncrasy.

7. **Scope drift is a checked artifact, not a habit.**
   - Source: `review/SKILL.md` Step 1.5.
   - The review skill explicitly compares stated intent (TODOS.md, PR description, commit messages, plan files) against what files actually changed and flags creep (unrelated changes) or missing requirements.
   - "Read the FULL diff before commenting. … Only flag real problems."
   - Why strong: scope discipline is enforced *as an automated check at the review boundary*, not as goodwill. Maps onto user's draft principle 4.

8. **Scope lock as a runtime primitive.**
   - Source: `freeze/SKILL.md`.
   - The `freeze` skill blocks Edit and Write outside an allowed directory (Read/Bash/Glob/Grep unaffected). State persists in the session, hook checks every edit.
   - Trailing `/` matching prevents `/src` from matching `/src-old`.
   - `guard` = `careful + freeze` combined for high-risk work.
   - Why strong: this is the strongest version of "stay in scope" — it is *enforced*, not requested. Hook-level boundary, not prose discipline. Different from gobbi's prose-based scope rules.

9. **Plan-eng-review encodes the engineering instincts agents lack.**
   - Source: `plan-eng-review/SKILL.md`.
   - Scope-smell heuristics: 8+ files or 2+ new classes triggers a stop-and-ask. "If scope exceeds 8 files or 2+ new classes/services, STOP and ask: is there a simpler path?"
   - Cognitive patterns named: blast radius, "boring by default" ("every company gets three innovation tokens"), systems-over-heroes ("design for tired humans at 3am"), reversibility (feature flags, canaries), essential vs accidental complexity, two-week smell test, own code in production.
   - "One issue = one question. Never combine findings." (Mirrors superpowers' question discipline.)
   - "Even 'obvious' fixes need explicit user sign-off before landing in the plan."
   - Why strong: explicitly the model "agents have weak engineering instincts; here are the ones to check at plan time". Direct analog to user's draft principle 6 generalized beyond design.

10. **Designer's eye review compensates for weak design taste.**
    - Source: `plan-design-review/SKILL.md`.
    - "Every screen should be self-evident. If a user stops to think 'What do I click?', the design has failed." (Krug)
    - "As little design as possible" (Rams) — subtraction default. "If an element doesn't earn its pixels, cut it."
    - "Principled taste" — "'This feels wrong' traces to a broken principle, making design debuggable, not subjective."
    - 7 review passes scoring 0–10 per dimension; visual mockups generated first when scope allows ("showing beats describing").
    - "Each gap = one question to you. Never batch. You decide every trade-off."
    - Aligns design decisions to a project DESIGN.md if it exists; else recommends `/design-consultation` first.
    - Why strong: directly matches user's draft principle 6 (weak design skills, find references, refine bottom-up). gstack's add: ground taste in *named principles* (Krug, Rams) so disagreements become debuggable.

11. **Office Hours / forcing questions for vague ideas.**
    - Source: `office-hours/SKILL.md`.
    - "I take positions, not hedges. Every answer gets a direct opinion and what evidence would change it."
    - "Specificity is non-negotiable." Vague answers are pushed until uncomfortable and concrete.
    - "No sycophancy. I won't say 'that's interesting' or 'there are many ways to think about this.' I'll say whether it works and why."
    - "Comfort is a warning sign. If you're comfortable, I probably haven't pushed hard enough."
    - One question at a time; phases push until answers are evidence-based; output is a design doc, never code.
    - Why strong: matches user's draft principle 7 (vague requirements → critical discussion). gstack's framing — "comfort is a warning sign", "no sycophancy" — is sharper than "ask AskUserQuestion".

12. **Continuous-improvement memory (`/learn`).**
    - Source: `learn/SKILL.md` + integration in `investigate`.
    - Per-project storage of patterns, pitfalls, preferences. Each `/investigate` and each `/review` writes learnings. "Recurring bugs in the same area are an architectural smell, not a coincidence" depends on this memory.
    - Why strong: gobbi already has mistakes; this confirms the pattern is community-standard and worth preserving.

---

## Cross-source patterns

**Both projects emphasize:**

- **No fixes without investigation.** Identical iron-law phrasing: "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST." (`superpowers/skills/systematic-debugging`, `gstack/investigate`).
- **Author ≠ reviewer.** Both enforce structural separation; both prevent reviewer access to author's session history (superpowers explicit, gstack via fresh subagent dispatch).
- **One question at a time, never batch.** Both `superpowers/brainstorming` and `gstack/plan-eng-review` + `plan-design-review` enforce this.
- **Verification produces evidence.** Superpowers names it "fresh verification evidence"; gstack's `/review` and `/qa` require regression tests + reproduction.
- **Scope discipline at delegation boundary.** Subagents get only what they need; reviewers get only the diff.
- **Design / planning is a separate phase, not a sub-step of coding.** Brainstorming/Office-Hours and Writing-Plans/Plan-Eng-Review are gates, not options.
- **Naming the agent's rationalizations defeats them.** Both projects list verbatim the phrases agents use to skip discipline ("just this once", "it's simple", "comfort", "spirit not ritual"). The remedy is to name them.

**Where they differ:**

- **Minimalism vs Boil-the-Lake.** Superpowers cites YAGNI as a core philosophy. gstack rejects shortcuts: "Completeness is cheap." These are not the same stance. Superpowers: only what's needed *now*. gstack: with AI, "needed" expands because the marginal cost dropped.
  - Reconciliation: both agree on no speculation; they disagree on what counts as speculation. gstack treats full test coverage and complete error paths as non-speculative (cheap with AI). Superpowers treats them as scope additions.
- **Scope enforcement mechanism.** Superpowers uses prose discipline + subagent context boundaries. gstack adds a hook-level `freeze` primitive that *blocks* edits outside the allowed directory.
- **Design discipline depth.** gstack has dedicated `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/design-review` (5 design skills). Superpowers has none — design lives inside `brainstorming` only.
- **Workflow shape.** Superpowers is a strict 6-stage pipeline (one path). gstack is a persona library (23 routable skills). Superpowers enforces process; gstack enforces specialization.
- **Codifying engineering instincts.** gstack's `plan-eng-review` names blast-radius / reversibility / boring-by-default / two-week-smell-test as specific cognitive patterns to check. Superpowers leaves this implicit in TDD + plan-writing.
- **Memory.** gstack has explicit `/learn` per-project memory + GBrain. Superpowers has no documented analog (lives in CLAUDE.md edits).

---

## Gaps vs. user's draft (the 7 principles)

| User draft | Direct match | Closest source quote | Gap or addition |
|---|---|---|---|
| 1. Dive-in habit; think+plan first | **Yes, strong** | `systematic-debugging`: "Just try this first, then investigate" / "I see the problem, let me fix it" — both flagged as violations. `brainstorming` HARD-GATE. | Both sources enforce *and* name the rationalizations the agent uses. User's draft should adopt the technique of naming the specific phrases. |
| 2. Multi-perspective work; sequential | **Partial** | Superpowers' two-stage review (spec → quality) is sequential perspectives. gstack's 7-pass design review = sequential. `plan-eng-review`: "One issue = one question. Never combine findings." | Neither source frames this as "multiple perspectives are hard for one agent". They frame it as *one question at a time within a single perspective*. The user's draft is broader and arguably stronger. The pattern they share: never batch evaluations. |
| 3. Bottom-up; break down; communicate step by step | **Strong** | Superpowers' 2–5 minute steps; "If a spec spans multiple independent subsystems, break it into separate plans first." gstack's plan-eng-review scope smells (8+ files, 2+ classes = stop). | Both sources add a concrete *upper bound* (bite-size step duration; file/class count for scope smell). User's draft is missing a falsifiable bound. |
| 4. Treat user as client; contract scope | **Strong** | Superpowers' "Subagent gets complete information upfront" + scope contract framing. gstack's `freeze` hook + `/review` Step 1.5 scope-drift check. ETHOS: "AI models recommend. Users decide." | Sources differ from user's draft by enforcing scope at the *delegation boundary* (subagent context) and at the *review boundary* (drift detection), not just at the human-agent boundary. gstack adds runtime enforcement (`freeze`). User's draft is human-side only. |
| 5. Minimalism / YAGNI | **Conflicted** | Superpowers cites YAGNI. gstack contradicts: "Completeness is cheap … Boil the lake." | The principles disagree. Recommendation: state minimalism as "no speculative work" but accept gstack's add: when the complete version costs minutes more, ship complete. Reframe minimalism as *no speculation*, not *no completeness*. |
| 6. Weak design skills; find refs; discuss; refine | **Strongest in gstack** | `ETHOS`: "has someone already solved this?" `plan-design-review`: principled taste (Krug + Rams), 7-pass review, visual mockups before description, "showing beats describing", "Each gap = one question. Never batch." | gstack offers the most depth. Adds: (a) ground taste in *named principles* so disagreements debug instead of stall; (b) generate visual references early; (c) align to a project `DESIGN.md` (locked decisions) before reviewing. User's draft is missing the "principled taste" hook. |
| 7. Vague requirements; critical discussion via AskUserQuestion | **Strong** | gstack `office-hours`: "I take positions, not hedges", "No sycophancy", "Comfort is a warning sign". Superpowers' brainstorming HARD-GATE + one question at a time. | Both sources go further than the user's draft: they explicitly forbid sycophancy ("that's interesting", "many ways to think") and name comfort as a *failure signal*. User's draft says "discuss critically"; sources say "if you're comfortable you haven't pushed hard enough". |

### Principles in the sources but missing from user's draft

- **Verification before completion claims** (superpowers `verification-before-completion`). Distinct from "verify before reporting done" by being a hard gate with named anti-patterns (hedging language, partial checks, stale evidence). Worth a dedicated principle, not a sub-bullet.
- **3-strike rule / escalation on failure** (gstack `investigate`, superpowers `systematic-debugging`). After N failed attempts, escalate or treat as architecture problem — do not iterate. User's draft has no failure-escalation principle.
- **Search before building** (gstack ETHOS). User's draft principle 6 covers design references; this generalizes it: every problem starts with "has it been solved?" Worth promoting to its own principle.
- **No sycophancy / take positions** (gstack office-hours). Agent should give an opinion, not hedge. Distinct from "discuss critically" because it forbids the specific dodge agents use.
- **Memory of past lessons** (gstack `/learn`, gobbi mistakes). Already present in gobbi's `_gobbi-rule`; worth keeping.

---

## Recommended additions / deletions / merges (best-stance synthesis)

Hard recommendations only:

1. **Keep all 7 user draft principles** — every one has direct support in at least one source. None are wrong.
2. **Add: "No completion claims without fresh verification evidence."** Already in `_gobbi-rule` as "never skip verification" but deserves elevation given how heavily both sources enforce it. Borrow superpowers' anti-pattern list (hedging language, partial checks, stale evidence, satisfaction before verification) so the rule is falsifiable.
3. **Add: "After 3 failed attempts, stop and escalate."** Both sources have this; gobbi has nothing equivalent. Without it, agents grind on broken approaches.
4. **Add: "Search before building."** Promote from a sub-point of design (draft principle 6) to its own principle. Generalizes across design, libraries, infrastructure, debugging.
5. **Reframe principle 5 (minimalism).** Replace "implement only what's needed" with "no speculative work; ship the complete version when complete is cheap." Resolves the gstack vs superpowers tension. The cleaner statement: "build only what's required *now*, but build it completely."
6. **Strengthen principle 1 (dive-in) by naming the rationalizations.** Borrow superpowers' technique: list the verbatim phrases agents use to skip discipline ("just try this first", "I see the problem, let me fix it", "this is too simple", "just this once", "one more attempt"). A rule that names the dodge is harder to dodge.
7. **Strengthen principle 7 (vague requirements) with no-sycophancy clause.** Borrow gstack: forbid "that's interesting", "many ways to think about this"; require taking positions; name comfort as a warning signal.
8. **Strengthen principle 2 (multi-perspective).** Borrow superpowers' two-stage rule (spec compliance, then code quality) and gstack's "one issue = one question, never combine findings" as the falsifiable bar. Reframe from "one perspective at a time" to "never batch evaluations across perspectives".
9. **Strengthen principle 4 (scope contract).** Borrow gstack's enforcement layering: scope contract at delegation boundary (subagent context) + scope-drift check at review boundary. gobbi already has the first; the second is missing.
10. **Strengthen principle 6 (design) with "principled taste".** Borrow gstack's framing: ground taste in named principles (Krug "self-evident screens", Rams "as little design as possible") so design disagreements become debuggable, not subjective. Plus: generate visual references *before* describing.
11. **Do not merge principles.** Each of the 7 + the 4 additions tackles a distinct failure mode. Merging blunts them. Both sources keep their iron laws as separate skills with separate names — that separation is load-bearing.
12. **Adopt the "hard-gate" + "anti-pattern" structure for every principle.** Both sources write each principle as: (a) one absolute rule in caps, (b) the rationalizations the agent uses to bypass it, (c) the verifiable bar. This shape is more durable than prose.

End of best-stance findings.
