# Innovative-stance research: agent-principles

Sources confirmed and cloned locally:
- `obra/superpowers` — https://github.com/obra/superpowers (clone at `/tmp/research/superpowers`)
- `garrytan/gstack` — https://github.com/garrytan/gstack (clone at `/tmp/research/gstack`)

Both projects are mature (gstack alone: 964-line skill template, 776-line CLAUDE.md, 23+ specialist skills; superpowers: 14 core skills with adversarial pressure-tested copy and a 94%-PR-rejection bar). Substrate is plenty thick to support an innovative reading.

---

## Vocabulary discovered (anti-patterns these projects named)

These are the *terms-of-art* the projects coined or borrowed. Names are how culture is transmitted; once a failure mode has a name, agents and humans can both refer to it.

| Term | Source | Meaning | Why it's powerful |
|---|---|---|---|
| **Slop** / "AI slop" / "slop PR" | superpowers `CLAUDE.md:7-9`, gstack `review/SKILL.md` slop-scan | AI-generated work that *looks* plausible but is fabricated, low-quality, or unmotivated. Maintainers close such PRs "within hours, often with public comments like 'This pull request is slop that's made of lies.'" | Names the failure mode every agent produces by default. Once named, you can build a tool against it (gstack ships `slop-scan`, a static analyzer for code-shape slop). |
| **Tool of embarrassment** | superpowers `CLAUDE.md:9` | An agent that ships low-quality work isn't "being helpful" — it's making its human partner look bad. | Reframes "helpful" from `did the thing` to `protected the partner's reputation`. Inverts the agent's loss function. |
| **Your human partner** (NOT "the user") | superpowers `CLAUDE.md:9, 13-19, 95, 99` — explicitly called out as "deliberate, not interchangeable" | The person on the other side of the conversation. The repo refuses PRs that rewrite this to "user". | Theatrical/relational frame: a partner can be embarrassed, disappointed, defended. A "user" can only be served. The word choice changes accountability. |
| **Spray-and-pray PR** | superpowers `CLAUDE.md:43-45` | An agent pointed at an issue list and told to "fix things," batching unrelated work. "Each PR requires genuine understanding of the problem… PRs that are part of an obvious batch will be closed." | Names the dominant failure mode of issue-tracker farming agents. |
| **Speculative / theoretical fix** | superpowers `CLAUDE.md:47-49` | "My review agent flagged this" or "this could theoretically cause issues" — a fix without a real problem report. Closed on sight. | Forces agents to attach a *witness* to every change. Without a witness, no commit. |
| **Boil the Lake** vs. **boil the ocean** | gstack `ETHOS.md:34-56` | "AI makes the marginal cost of completeness near-zero. When the complete implementation costs minutes more than the shortcut — do the complete thing." Lake = full coverage of *this* module; ocean = full rewrite of *the system*. | Inverts the human-era heuristic "ship the 80%". Concrete, vivid, decision-shaped. |
| **Eureka moment / 11-out-of-10** | gstack `ETHOS.md:90-101` | A first-principles observation discovered by *first* searching prior art, then noticing why everyone is wrong. "Zig while others zag." | Treats novelty as a *consequence* of being well-read, not a starting move. |
| **Drive-by edits** | gstack `README.md:258` | Unrelated changes a `/review` is supposed to catch. | Concrete paired anti-pattern to the lake-boiling principle: complete the thing you came for, don't *also* edit five orthogonal files. |
| **Confusion Protocol** | gstack `learn/SKILL.md:619-621`, `landing-report/SKILL.md:617`, `scrape/SKILL.md:617` (boilerplated into many skill preambles) | "For high-stakes ambiguity (architecture, data model, destructive scope, missing context), STOP. Name it in one sentence, present 2-3 options with tradeoffs, and ask. Do not use for routine coding or obvious changes." | A *named* protocol the agent invokes by name; lifts an ad-hoc instinct ("ask when uncertain") into a callable subroutine with explicit precondition (high-stakes only). |
| **Iron Law** | superpowers TDD/debugging/verification skills, e.g. `test-driven-development/SKILL.md:31`, `systematic-debugging/SKILL.md:16`, `verification-before-completion/SKILL.md:16` | A single all-caps absolute rule per skill. Examples: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST", "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST", "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE". | One unmissable line per skill. Scrollable, quotable, non-negotiable. The rest of the skill is *commentary on the iron law*. |
| **Red Flags table** | superpowers `using-superpowers/SKILL.md:78-95`, brainstorming, debugging | A two-column table: thought the agent is *about to think* → reality. E.g. "I need more context first" → "Skill check comes BEFORE clarifying questions." Repo policy explicitly forbids modifying these without eval evidence (`CLAUDE.md:95`). | Pressure-tested rationalizations, not principles. Catches the agent at the moment of self-deception. The table format is itself a discipline pattern: enumerated, scannable, refutable. |
| **Rationalization list** | superpowers — corollary of Red Flags | Specific phrases agents say to themselves to skip discipline ("just this once," "I'm confident," "linter passed ≠ compiled"). | Treats agent self-talk as the surface of behavior. Patches at the language layer. |
| **HARD-GATE / SUBAGENT-STOP** | superpowers `brainstorming/SKILL.md:12-14`, `using-superpowers/SKILL.md:6-16` | XML-like sentinel tags wrapping non-negotiable rules: "Do NOT invoke any implementation skill, write any code… until you have presented a design and the user has approved it." | Visually distinguishes *gates* from *guidance*. The agent learns "this isn't advice, this is fence-line." |
| **Two-stage review** | superpowers `subagent-driven-development/SKILL.md` | Spec compliance review → THEN code quality review. Sequence enforced: starting code-quality before spec is "a critical error." | Decomposes "review" into two questions an agent will otherwise blur: did you build the right thing, and did you build it well? |
| **Fresh-context subagent** | superpowers `dispatching-parallel-agents/SKILL.md`, `subagent-driven-development/SKILL.md` | Subagents "should never inherit your session's context or history — you construct exactly what they need." | Frames context inheritance as *contamination*, not *helpfulness*. Forces explicit prompt construction. |
| **Iron Man suit** | gstack `ETHOS.md:121` (borrowed from Karpathy) | "Great AI products augment the user, not replace them. The human stays at the center." | Frames the agent as *exoskeleton* not *replacement*. Cooperative, not autonomous. |
| **Merchants of complexity** | gstack `ETHOS.md:124` (borrowed from Simon Willison) | Agents that, when humans remove themselves from the loop, accumulate complexity invisibly. | Names the long-term decay mode of unattended agents. |
| **Generation–verification loop** | gstack `ETHOS.md:128-130` | "AI generates recommendations. The user verifies and decides. The AI never skips the verification step because it's confident." | A *loop topology*, not a rule. The agent has only one half of the loop; verification is structurally on the user's side. |
| **My Assessment column** anti-pattern | gstack `ETHOS.md:140-141` | Don't frame your assessment as a settled fact in a "My Assessment" column when presenting options. Present both sides; let the user fill in the assessment. | Names a UI/presentation failure mode unique to AI: rendering opinion as data. |
| **Specificity is the only currency** | gstack `office-hours/SKILL.md:918-919` | "Vague answers get pushed. 'Enterprises in healthcare' is not a customer. You need a name, a role, a company, a reason." | Reframes vagueness as *poverty* — you literally cannot transact in vagueness. |
| **Telemetry: TDD for skills** / "watch it fail" | superpowers `writing-skills/SKILL.md:11-46` | Skills are written by running a baseline scenario, *watching the agent fail*, then writing the skill to address that exact rationalization, then re-running until the agent complies. RED-GREEN-REFACTOR for documentation. | Skills are not prose — they are code. The author maintains them like code. |
| **DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT** | gstack `learn/SKILL.md:674-682` | Four-state completion vocabulary an agent must use to report. | Eliminates the "I think it's done?" failure mode. The agent has to pick a state. |
| **Plan mode safe operations** | gstack `SKILL.md:104-112` | Specific list of operations allowed in plan mode because *they inform the plan* (browser, code review, writes to plan file). | Distinguishes "thinking with hands" from "doing". Innovative because most plan-mode docs are pure prohibitions. |

---

## Mechanisms (not rules) that enforce discipline

Both projects have learned that rules in markdown rot. They invest heavily in *mechanisms*. This is the most important pattern for gobbi to study.

| Mechanism | Source | What it prevents | Why it works |
|---|---|---|---|
| **SessionStart hook injects `using-superpowers` content** | `superpowers/hooks/session-start` (file, not directory): bash script that reads `skills/using-superpowers/SKILL.md`, JSON-escapes it, and emits it as `additionalContext` for Claude Code, Cursor, and Copilot CLI. Wrapped in `<EXTREMELY_IMPORTANT>` tag with literal text "You have superpowers." | The agent forgetting to load the bootstrap. Repo policy: **a real harness integration must auto-trigger `brainstorming` on the input "Let's make a react todo list"**, with a transcript in the PR (`CLAUDE.md:73-86`). If `brainstorming` does not auto-trigger, the integration is fake. | Skill loading is moved out of the agent's discretion. The *test* of integration is behavioral, not configuration. |
| **`HARD-GATE` / `SUBAGENT-STOP` XML tags** | superpowers `brainstorming/SKILL.md:12`, `using-superpowers/SKILL.md:6-16` | Agents reading skills as *suggestions*. | The tag visually and tokenly distinguishes "fence-line" from "advice." |
| **The `Skill` tool — never `Read`** | superpowers `using-superpowers/SKILL.md:30` ("Never use the Read tool on skill files") | Stale skills (cached versions, old conventions). | Forces fresh load via the harness's skill API; the agent cannot pretend to have already loaded it. |
| **`slop-scan` static analyzer** | gstack `CLAUDE.md:23-24, 379-431` | Specific code-shape slop (empty catches around file ops, redundant `return await`, untyped exception swallowing). | Catches AI-shaped sloppiness that lints don't. Accompanied by a *what NOT to fix* list — refusing to game the tool. |
| **`slop-scan.config.json` exemption rule** | gstack `CLAUDE.md:404-411` | Agents adding fake comments to bypass slop-scan. | The config explicitly enumerates which patterns are correct ("Chrome extensions crash entirely on uncaught errors. If the catch logs and continues, that IS the right pattern"). |
| **Adversarial pressure tests** | superpowers `CLAUDE.md:90-95`, blog post (Jesse Vincent) | Skills that *say* the right thing but break under pressure (time, sunk cost, social proof). | Cialdini-style influence pressure tests *applied to LLMs*. Skills are evaluated by their failure rate under deliberate manipulation, not by reading. |
| **94% PR rejection rate displayed prominently** | superpowers `CLAUDE.md:7` | Agents proceeding optimistically. | Framed loss aversion: the agent is told the prior probability that its work is bad. |
| **Workflow gates with announce string** | superpowers `using-superpowers/SKILL.md:56` ("Announce: 'Using [skill] to [purpose]'") | Silent skill use that the user can't audit. | The agent must say the skill name out loud, creating a log. |
| **`feature-prompted-*` marker files** | gstack `SKILL.md:120-141` | Pestering the user with the same one-time prompt. | One-time decisions are persisted as filesystem markers, not as inferred state. |
| **`gstack-question-preference` registry** | gstack `SKILL.md:654-672` | Per-question tuning of `AskUserQuestion`. The agent looks up `AUTO_DECIDE` vs `ASK_NORMALLY` per question ID before asking. | Lets the *user* tune which questions are routine ("auto-decide recommended") vs. high-stakes. The friction is per-question, not per-skill. |
| **User-origin gate (profile-poisoning defense)** | gstack `SKILL.md:665-672` | Tool output, file contents, or PR text containing `tune: never-ask` to silently change the user's preferences. | Writes the tune event ONLY when `tune:` appears in the user's *own current chat message*. A real prompt-injection defense surfaced into doc-level rules. |
| **`/freeze` and `/guard`** | gstack `freeze/`, `guard/` skill dirs | Edits outside an explicitly-scoped directory. "Hard block, not just a warning." | Treats scope as a runtime constraint, not a prompt request. |
| **Continuous Checkpoint Mode** with `[gstack-context]` block | gstack `learn/SKILL.md:625-646`, `SKILL.md` checkpoint section | Lost context, lost decisions, lost "tried-and-failed" history. | Auto-commits with `WIP:` prefix carry a structured `Decisions / Remaining / Tried` block; `/context-restore` parses it; `/ship` squashes WIP into clean commits. Memory is persisted by *commit*, not by note file. |
| **`SPAWNED_SESSION` flag** | gstack `SKILL.md:266-271` | A subagent inside an orchestrator session asking interactive questions to a user that doesn't exist. | When the env var is set: skip AskUserQuestion, auto-choose the recommended option, end with a structured completion report. Subagents become well-behaved by *environment detection*, not by prompt. |
| **STATUS report template** | gstack `learn/SKILL.md:674-682` | "I think it's done?" / silent uncertainty. | Four-state vocabulary (DONE, DONE_WITH_CONCERNS, BLOCKED, NEEDS_CONTEXT) plus required fields STATUS/REASON/ATTEMPTED/RECOMMENDATION. |
| **gstack telemetry → improvements** | gstack `SKILL.md:46-67` | Skills that drift from real-world usage. | Per-skill usage events get logged, opt-in. The project closes the loop between agent behavior and skill content. |
| **Two-schema AJV / golden fixtures** | superpowers `test/fixtures/golden/` | Skill drift across hosts (Claude/Codex/Factory). | Golden snapshots of compiled skill output per host. Skills are tested like compilers. |

---

## Cross-source disagreements

This is where the user's draft can be sharpened by argument, not by averaging.

### 1. Should the user always be asked, or sometimes auto-decided?

- **superpowers** is *closer to user-always*: gates are HARD; user must approve design before any implementation skill runs (`brainstorming/SKILL.md:12-14`); subagents auto-decide only when explicitly dispatched as such.
- **gstack** ships a *per-question tuning system*: `gstack-question-preference` lets the user mark specific question IDs as `AUTO_DECIDE`. Routine questions become silent; high-stakes ones still ask. (`SKILL.md:654-672`)

**Argue:** gstack is right *for solo developers running long sessions*; superpowers is right *for community plugins where the partner's reputation is on the line*. Gobbi is solo-user (per memory: `feedback_solo_user_context`). The user has explicitly said external-user concerns are out of scope — so gstack's per-question AUTO_DECIDE/ASK_NORMALLY pattern is the better fit and resolves a tension in the user's draft principle 7 (which says "use AskUserQuestion to discuss critically" but is silent about question fatigue).

### 2. Skills are *prose* vs. skills are *code*

- **superpowers** treats skills as code that must be tested adversarially before merge (`writing-skills/SKILL.md`, `CLAUDE.md:90-95`). PRs that "comply" with Anthropic's published guidance are rejected without eval evidence — even Anthropic's docs are not authoritative against the project's pressure-test results.
- **gstack** generates SKILL.md from `.tmpl` templates per host, with model overlays patched in (`SKILL.md.tmpl`, `model-overlays/claude.md`, `bun run gen:skill-docs --host codex`). Skills are *built artifacts*.

**Argue:** Both reject the "skills are documentation" frame. Superpowers' move (RED-GREEN-REFACTOR for skills) is the more transferable insight; gstack's templating is a build-system optimization. **Gobbi should adopt the superpowers stance:** every skill must have a recorded failure scenario it was written to fix.

### 3. Where does scope discipline come from?

- **superpowers** uses words and gates: HARD-GATE, "Do NOT invoke any implementation skill," explicit "do not include unrelated changes" PR policy.
- **gstack** uses *enforcement*: `/freeze` and `/guard` literally block edits outside scope; `/review` mechanically diffs the plan against the changes and flags items in the diff that don't match a plan item as "SCOPE CREEP" (`review/SKILL.md:814, 989`).

**Argue:** Gstack's mechanical review wins. Words rot; a script that diffs the plan against the diff doesn't. Gobbi's principle 4 ("treat user as client; contract-bound scope only") should be paired with a `/review`-style mechanism, not just a rule.

### 4. Brainstorm-first vs. context-first

- **superpowers** auto-triggers `brainstorming` for "Let's make a react todo list" *before any code is written or any context is read* (`CLAUDE.md:73-86`).
- **gstack** `/office-hours` runs Phase 1 = Context Gathering (`office-hours/SKILL.md:828-844`): read CLAUDE.md, run `git log`, map the codebase via Grep/Glob, list prior design docs *before* the YC questions.

**Argue:** Gstack is right for existing codebases; superpowers is right for greenfield ideation. The user's draft principle 1 ("think + plan before starting") elides this — *think about what?* In a known codebase, codebase first; in a greenfield, problem first. Gobbi already has this captured in `_research` and `_pi`, but the draft principle 1 should be sharpened to name the two modes explicitly.

### 5. TDD as universal vs. TDD as context-dependent

- **superpowers** is dogmatic: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" (`test-driven-development/SKILL.md:31`); rationalizations like "too simple to test" are explicitly named and rejected.
- **gstack** is pragmatic: TDD appears in `/ship` (`test-first /ship`) but `Boil the Lake` says "Tests are the cheapest lake to boil" — TDD is one of many lakes.

**Argue:** Superpowers' dogmatism is *correct for its target* (code that ships to others). For gobbi (solo, internal, schema-and-state-machine heavy), TDD-as-iron-law is worth adopting for state-machine reducers and event handlers; it's overkill for skill markdown files. The user's draft is silent on TDD entirely — this is a gap.

---

## Frames borrowed from outside coding

This is where innovation lives. Both repos import frames from non-coding domains; gobbi's draft is mostly written in coding-domain language and could be sharpened by adopting one.

| Frame | Source | Where used | Why it sharpens |
|---|---|---|---|
| **YC Office Hours** | gstack `office-hours/SKILL.md` | Reframing product ideas before code | Borrows the *founder–investor* dynamic. The agent plays the role of an investor who has heard 1000 pitches; the user is the founder. The investor's job is *not to encourage*, it is to *push for specificity*. Inverts the agent's default sycophancy. |
| **Engineering org chart (CEO / EM / Staff Eng / Designer / SRE / CSO / QA)** | gstack `AGENTS.md`, README.md | All 23 specialists | Borrows the *team* frame. Each role has a *legible mandate* the user already understands. A "CSO skill" isn't abstract — it's "the security person who runs OWASP." |
| **Theatrical / relational ("your human partner")** | superpowers `CLAUDE.md` | Every PR-related instruction | Borrows the *partner / accomplice* frame. A partner can be embarrassed; a user can only be served. Loss aversion gets a relational target. |
| **TDD applied to documentation** | superpowers `writing-skills/SKILL.md:11-46` | Every skill in the repo | Borrows from XP. Treats *behavior under pressure* as the test, *prose* as the production code, *failure to comply* as RED. |
| **Cialdini's Influence — adversarial pressure tests** | Jesse Vincent's blog, superpowers' eval framework | Skill validation | Borrows from social psychology. Tests how skills hold up under sunk-cost, social-proof, and time-pressure manipulation. |
| **Iron Man suit (Karpathy)** | gstack `ETHOS.md:121` | All recommendations | Borrows from product philosophy. Agent = exoskeleton, not autonomous robot. |
| **Generation–verification loop** | gstack `ETHOS.md:128` | Every recommendation flow | Borrows from control theory. Asymmetric: agent generates, user verifies; the loop is the *unit*, not the agent. |
| **Lake / ocean** | gstack `ETHOS.md:34-56` | Completeness decisions | Borrows from "boil the ocean" idiom — *negates* it. Vivid, decision-shaped. |
| **Three Layers of Knowledge (Tried and true / New and popular / First principles)** | gstack `ETHOS.md:67-101` | All search-before-building decisions | Borrows from epistemology / Munger / Buffett. "Mr. Market is either too fearful or too greedy" applied to blog posts. |
| **Compounding (learnings.jsonl across sessions)** | gstack `office-hours/SKILL.md:846-882` | Every skill's preamble | Borrows from finance. Agent gets smarter on *this codebase* over time; the user can see the compounding via "Prior learning applied" annotations. |
| **The Confusion Protocol as a *callable* subroutine** | gstack | Architectural ambiguity | Borrows from telephony / interrupt handlers — uncertainty is escalated to a protocol, not handled inline. |

The user's draft uses the "agent as junior dev" implicit frame ("must find references first," "must work bottom-up"). That's fine, but it's a single frame. Adding the *partner / accomplice* frame and the *generation-verification loop* frame would meaningfully sharpen principles 4 and 7.

---

## Implicit principles (repeated but unlabeled)

Patterns that show up across many docs in both projects but are never *labeled* as a principle. Surfacing them is the highest-leverage move.

### A. "Announce what you're doing before you do it"

Evidence:
- superpowers `using-superpowers/SKILL.md:56`: "Announce: 'Using [skill] to [purpose]'"
- superpowers `writing-plans/SKILL.md:14`: "I'm using the writing-plans skill to create the implementation plan."
- gstack `SKILL.md:118`: "Print 'Running gstack v{to} (just updated!)'"
- gstack DONE/BLOCKED status template

Proposed wording: *"Agents must announce mode transitions out loud. The act of saying 'I'm now in X mode' creates an audit trail and forces the agent to commit to a discrete state."*

### B. "The state of the agent is on disk, not in the prompt"

Evidence:
- gstack `.feature-prompted-*` marker files
- gstack `~/.gstack/sessions/$PPID` touchfiles
- gstack `[gstack-context]` blocks in WIP commits
- gstack `learnings.jsonl` accumulated across sessions
- superpowers' SessionStart hook reading skill content from disk
- gstack's `gstack-question-preference` per-question registry

Proposed wording: *"State that survives compaction must live on disk, not in the conversation. Every one-time decision is a marker file; every cross-session memory is a JSONL append."*

This is *opposite* to gobbi's current heavy reliance on `_note` and per-session SQLite — actually, gobbi has been *moving toward* this with the JSON memory pivot (project_v050_pr_fin_2a_ii). Worth surfacing as a stated principle.

### C. "Refuse to game your own tools"

Evidence:
- gstack `CLAUDE.md:402-411` ("What NOT to fix" list for slop-scan — refusing to add bypass comments)
- superpowers `CLAUDE.md:35-37` (refusing "compliance" PRs that reword skills to match Anthropic guidance)
- gstack `CLAUDE.md:430-431` ("Don't chase the number. Fix patterns that represent actual code quality problems.")

Proposed wording: *"When a tool produces a metric, the metric is a signal not a target. Improvements that game the tool without improving the underlying property are forbidden."*

This is Goodhart's law made operational. The user's draft is silent on it. Worth adding given how much gobbi instruments itself.

### D. "Eval evidence is required before changing tested behavior"

Evidence:
- superpowers `CLAUDE.md:90-95`: "Skills are not prose — they are code that shapes agent behavior… Show before/after eval results in your PR. Do not modify carefully-tuned content (Red Flags tables, rationalization lists, "human partner" language) without evidence the change is an improvement"
- superpowers `CLAUDE.md:35-37`: rejecting "compliance" rewrites
- gstack templating + golden fixtures

Proposed wording: *"Behavior-shaping content (skill copy, prompts, hard gates) is tested code. Modifying it requires before/after evidence, not aesthetic argument."*

The user's draft principle 5 (minimalism) is close but not identical. This is specifically about *not* refactoring agent-shaping prose for prettiness.

### E. "Fresh context is the default; inheritance is the exception"

Evidence:
- superpowers `dispatching-parallel-agents/SKILL.md:10` ("They should never inherit your session's context or history")
- superpowers `subagent-driven-development/SKILL.md`
- gstack `SPAWNED_SESSION` env var (subagents detect and adapt)

Proposed wording: *"Subagent context is constructed, not inherited. Every dispatch is a fresh prompt with explicit construction; never a copy of the parent's history."*

The user's draft is silent on this entirely. This is a *huge* gap. Gobbi already does this (research/executor briefs are explicit), but the principle isn't named.

### F. "Witness-bound work" (every change has a real user-experience that motivated it)

Evidence:
- superpowers `CLAUDE.md:47-49` (no speculative or theoretical fixes)
- superpowers `CLAUDE.md:14-15` (verify the partner experienced a specific problem)
- gstack `/office-hours` Phase 1 (real customer, real role, real reason)

Proposed wording: *"Every change must have a witness — a real session, error, or user experience that motivated it. 'Could theoretically' is not a witness."*

Sharpens user's draft principle 5 (minimalism) — minimalism says "don't build extra"; witness-bound work says "don't build at all without a real motivator."

### G. "Mode-switch is a question, not an inference"

Evidence:
- gstack `office-hours/SKILL.md:884-899` (asks startup vs. builder mode rather than inferring)
- gstack `SKILL.md:120-141` (asks one feature-discovery question per session, never silently chooses)
- gstack `SKILL.md:266-271` (`SPAWNED_SESSION` is an explicit env var, not a heuristic)

Proposed wording: *"When the agent's behavior should differ across modes, the mode is asked or signaled explicitly. Never inferred from prompt vibes."*

---

## Compensations for specific weaknesses

What weaknesses do the source projects *explicitly* address, and what *mechanism* (not rule) do they prescribe?

| Weakness | Mechanism (not just rule) | Source |
|---|---|---|
| Agents skip discipline under confidence | Red Flags table — names the exact rationalization phrases agents use; pressure-tested adversarially | superpowers `using-superpowers/SKILL.md:78-95` |
| Agents claim completion without verification | Iron Law + `verification-before-completion` skill that requires fresh command output before any "Great!" / "Done!" | superpowers `verification-before-completion/SKILL.md` |
| Agents add unrelated edits | `/freeze` runtime block + `/review` plan-vs-diff scope-creep detection | gstack `freeze/`, `review/SKILL.md:814` |
| Agents lose context across sessions | `[gstack-context]` block embedded in WIP commits + parsed by `/context-restore` | gstack `learn/SKILL.md:625-646` |
| Agents ask too many or too few questions | Per-question `AUTO_DECIDE` / `ASK_NORMALLY` registry; tunable inline via `tune:` keyword in user message | gstack `SKILL.md:654-672` |
| Agents inherit context that pollutes subagents | Subagents constructed, not forked; `SPAWNED_SESSION` env var changes behavior in subagent | superpowers `dispatching-parallel-agents/SKILL.md`, gstack `SKILL.md:266-271` |
| Agents debug by guessing | Iron Law: "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"; mandatory phases (data flow → pattern → hypothesis → fix); architectural questioning after 3 failed fixes | superpowers `systematic-debugging/SKILL.md` |
| Agents brainstorm into implementation | HARD-GATE: brainstorming's terminal state is `writing-plans`; explicitly forbidden to invoke implementation skills | superpowers `brainstorming/SKILL.md:12, 66` |
| Agents fabricate plausible-looking work ("slop") | `slop-scan` static analyzer + 94%-rejection prior + "tool of embarrassment" framing | superpowers, gstack |
| Agents present opinion as data | "My Assessment column" anti-pattern — present both sides, let user fill in | gstack `ETHOS.md:140-141` |
| Agents agree with other agents and override user | "Two AI models agreeing is signal, not mandate" + present-the-recommendation-and-ask rule | gstack `ETHOS.md:117-141` |
| Agents drift from real workflows | Telemetry → cross-session learnings → "Prior learning applied" surfacing | gstack `office-hours/SKILL.md:846-882` |

---

## Surprising omissions

What both repos *lack* that would be valuable — gobbi can innovate here.

1. **No formal evaluation gate between Plan and Execute.** Both repos have planning skills and review skills, but neither has gobbi's *evaluator-as-separate-agent* doctrine ("the agent that creates must never evaluate its own output"). Gobbi's eval-as-separate-agent is genuinely innovative relative to these two. Don't drop it.
2. **No explicit handoff/memorization step.** superpowers `finishing-a-development-branch/SKILL.md` is close, gstack `/context-save` is close, but neither has gobbi's "Memorization → Handoff" phase as named workflow steps. Gobbi's discipline here is stronger.
3. **No explicit mistakes-as-knowledge concept.** Both repos have CHANGELOG and learnings.jsonl, but neither has gobbi's "a correction not recorded is a correction repeated" framing or the dedicated `mistakes/` directory with promote workflow. This is gobbi's signature pattern. Both repos would be stronger if they adopted it.
4. **No multi-perspective evaluation.** Both repos lean on `/codex` (gstack) or `requesting-code-review` (superpowers) — a *single* outside opinion. Gobbi's "2-5 perspectives, Project + Overall always" is more rigorous.
5. **No per-step state machine.** Both repos use *checklists* and *phase markers*. Gobbi's actual state machine (Configuration → Ideation → Plan → Execute → Memorize → Handoff with predicates) is more formal.
6. **Sparse on UI/UX & visual design discipline.** gstack has `/design-review`, `/design-shotgun`, `/plan-design-review`, `/design-html` (a real strength). superpowers has nothing for design. Both completely lack UX-flow design discipline (e.g., interaction sequences, progressive disclosure). The user's draft principle 6 ("agents have weak design skills") is *correct* and addresses a real gap — but the source repos don't show how to fix it for non-visual design (function/class interfaces, API design). This is a place to extend their work, not copy it.
7. **No "stop the line" pattern.** Both have escalation rules ("escalate after 3 failed attempts"), but neither has a Toyota-style explicit stop-the-line where the agent halts the entire workflow on detecting a system-level problem (e.g., bad migration, incoherent spec, contaminated context).

---

## Where user's draft differs from source repos

Going through the user's 7 principles one by one. Stronger / weaker / contradictory / orthogonal — and an argument when contradictory.

### Principle 1: "Agents have a 'dive-in' habit. Must think + plan before starting."

- **Source-repo position: STRONGER.** Both repos enforce this with mechanism, not just rule.
  - superpowers `using-superpowers/SKILL.md:78-95`: a 12-row Red Flags table naming the exact rationalizations agents use to dive in ("This is just a simple question," "I need more context first," "Let me explore the codebase first" → all redirected to skill check).
  - superpowers `brainstorming/SKILL.md:12-14`: HARD-GATE forbidding any implementation skill until design approved.
  - gstack `office-hours/SKILL.md:822`: "HARD GATE: Do NOT invoke any implementation skill, write any code…"
- **Gap in user's draft:** No named anti-rationalizations. The principle is correct but lacks the *vocabulary* to catch the dive-in moment.
- **Recommendation:** Adopt a Red Flags table. Specifically include "I just need to understand the codebase first" and "this is a small change" as named rationalizations.

### Principle 2: "Agents struggle with multi-perspective work. Single perspective at a time, sequential."

- **Source-repo position: ORTHOGONAL.** Neither repo addresses this directly. They do something different — they use **multiple specialists in sequence** (gstack's 23 roles; superpowers' brainstorm → plan → execute) but *each role* is single-perspective by construction. They never say "agents struggle with multi-perspective work as such."
- **Reframe possible:** This principle is really *gobbi's evaluator pattern* in disguise. The single-perspective-sequential rule is well-supported by gstack's `/codex` (one outside opinion at a time) and superpowers' two-stage review (spec, then quality). 
- **Recommendation:** Sharpen the principle to *"Multi-perspective evaluation is sequential and out-of-process. The same agent can only hold one perspective at a time. Multiple perspectives require multiple agents."* This is a real principle the source repos prove by construction.

### Principle 3: "Agents must work bottom-up. Break down, communicate with user step by step."

- **Source-repo position: STRONGER.**
  - superpowers `writing-plans/SKILL.md:36-44`: "Each step is one action (2-5 minutes): Write the failing test - step. Run it to make sure it fails - step. Implement minimal code - step. Run tests - step. Commit - step."
  - superpowers `brainstorming/SKILL.md:75-78`: "Only one question per message - if a topic needs more exploration, break it into multiple questions"
  - gstack `office-hours/SKILL.md:846-906`: explicit numbered phases, AskUserQuestion per phase
- **Gap:** "Bottom-up" is vague. Source repos are concrete: *2-5 minute steps, one question per message, one logical commit per step.*
- **Recommendation:** Replace "bottom-up" with a concrete granularity rule. The user's principle is correct in spirit but underspecified.

### Principle 4: "Agents arbitrarily expand scope. Treat user as client; contract-bound scope only."

- **Source-repo position: STRONGER + DIFFERENT FRAME.**
  - gstack adds the *mechanism* (`/freeze`, `/guard`, `/review` scope-creep detection) — it isn't just a rule, it's enforced.
  - superpowers reframes from "client" to "human partner" and adds the loss-aversion frame ("tool of embarrassment").
  - gstack `ETHOS.md:111-141` reframes again with "User Sovereignty": the agent recommends, the user decides, *always*. Two AIs agreeing is signal, not mandate.
- **The user's "client" frame is weaker than "human partner."** A client is transactional; a partner is relational. A client can fire you; a partner can be embarrassed by you. The latter is a stronger loss function.
- **Recommendation:** Adopt "human partner" framing. Add `/review`-style mechanical scope-creep detection as a paired mechanism. Add the "two-models-agreeing-is-signal-not-mandate" rule explicitly.

### Principle 5: "Agents must pursue minimalism. Implement only what's needed. Build when the need is real."

- **Source-repo position: CONTRADICTORY (with gstack), STRONGER (with superpowers).**
  - **Contradicts gstack `ETHOS.md:34-56` directly.** "Boil the Lake" says: *"AI-assisted coding makes the marginal cost of completeness near-zero. When the complete implementation costs minutes more than the shortcut — do the complete thing. Every time."* Anti-pattern explicitly named: *"Choose B — it covers 90% with less code."*
  - **Aligns with superpowers' YAGNI** but YAGNI specifically means *"don't add things you might need someday"*, not *"build a partial version of the thing you came for."*
- **The disagreement is real and important.** It's about *which axis of minimalism*:
  - Minimalism along the *feature* axis: don't build features you don't need (YAGNI, witness-bound work). Both repos agree.
  - Minimalism along the *coverage* axis (do you cover all edge cases of the feature you ARE building): superpowers is silent; gstack says NO, boil the lake.
- **Argue:** Gstack is right *for AI-assisted solo work*; the marginal cost argument is correct. Gobbi's principle 5 conflates the two axes and risks under-completing the feature it builds.
- **Recommendation:** Split principle 5 into two: (5a) "build only the features the user needs" (witness-bound, YAGNI) and (5b) "but build them completely — when AI makes coverage cheap, take it." This resolves the contradiction.

### Principle 6: "Agents have weak design skills (UI/UX, image, video, function/class interface, class design pattern). Must find references first, discuss design direction with user, refine bottom-up."

- **Source-repo position: STRONGER for visual, ABSENT for code-design.**
  - gstack has 4+ design skills (`/design-review`, `/design-shotgun`, `/plan-design-review`, `/design-html`) — far more developed than user's draft.
  - gstack `/plan-design-review` rates *each design dimension 0-10* and explains "what a 10 looks like" — a *forcing function* for design critique.
  - Neither repo has class/interface design discipline. Both default to "follow existing patterns" (superpowers `brainstorming/SKILL.md:101-103`) which is conservative but not innovative.
- **Gap in source repos:** code-shape design (interfaces, abstractions, module boundaries). Both repos elide this.
- **Recommendation:** Keep principle 6 but separate it: visual design discipline borrows gstack's "rate each dimension 0-10, explain what a 10 looks like" pattern; code-shape design borrows superpowers' "isolation and clarity" frame from brainstorming (`SKILL.md:94-99`: "Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers?").

### Principle 7: "User instructions/requirements may be vague or low-quality. Use tools (AskUserQuestion etc.) to discuss critically. Refine and improve requirements. Provide research-backed recommendations during decision points."

- **Source-repo position: STRONGER + ADDS A KEY FRAME.**
  - gstack `office-hours/SKILL.md:918`: *"Specificity is the only currency."* The agent doesn't just refine requirements — it *refuses to transact in vagueness*.
  - gstack `ETHOS.md:111-141`: User Sovereignty + generation-verification loop.
  - superpowers' `brainstorming` runs before any clarifying questions ("Skill check comes BEFORE clarifying questions" — `using-superpowers/SKILL.md:84`).
  - Question fatigue: gstack's per-question AUTO_DECIDE addresses the corollary failure mode.
- **Gap in user's draft:** No mechanism for *which* questions to ask (vs. inferring) or how to escalate. No specificity-as-currency frame.
- **Recommendation:** Adopt "specificity is the only currency" as a sub-principle. Add the per-question tuning concept (some questions are routine and should be auto-decided after the user has tuned them).

---

## Reframes worth offering the user

| Original | Reframe | Cross-domain analogue | Why better |
|---|---|---|---|
| "Treat user as client" (P4) | "Treat user as **human partner**" | Theatrical / accomplice | A partner can be *embarrassed by* you. Loss aversion has a relational target, not a transactional one. Source: superpowers' explicit terminology choice. |
| "Think + plan before starting" (P1) | "Read the **Red Flags** before each turn" | XP / pair programming with a checklist | Names the rationalizations as they happen, not as a general rule. Catches the dive-in *moment*. |
| "Pursue minimalism" (P5) | "**Witness-bound, lake-complete**: every feature must have a real motivator, but build it completely" | Contract: a witness signs the deed, but the deed is fully drafted | Resolves the YAGNI-vs-Boil-the-Lake tension. Two axes, two rules. |
| "Discuss critically with user" (P7) | "**Specificity is the only currency**; recommendation–verification loop" | Investor due diligence; control-theory loop | Refuses to transact in vagueness; structures the agent–user relationship as an asymmetric loop, not a chat. |
| "Multi-perspective work" (P2) | "**Multiple perspectives = multiple agents**, never one agent wearing many hats" | Theatrical: one actor, one role | Makes the principle implementation-shaped. Aligns with gobbi's existing evaluator doctrine. |
| "Bottom-up" (P3) | "**One commit per logical unit, one question per message, 2-5 minute steps**" | XP / Toyota standard work | Concretizes "bottom-up" into measurable cadence rules. |
| "Weak design skills" (P6) | "**Rate each design dimension 0-10; explain what a 10 looks like**" | Olympic judging; rubric-based grading | Forcing function. The agent must produce a *graded* critique, not a vibes-based one. From gstack `/plan-design-review`. |

---

## Hard recommendations

These are the changes I'd argue for after this research. Strong opinions, ready to be challenged in user discussion.

### ADD (principles user did NOT draft but should)

1. **"Skills are tested code, not prose."** Behavior-shaping content (rules, gates, principles) requires before/after evidence to modify. Source: superpowers `CLAUDE.md:90-99`. Mechanism: keep a `pressure-tests/` adjacent to each agent definition with at least one named scenario where the agent failed before the rule was added.
2. **"Fresh subagent context is the default."** Subagents are constructed, never inherited. No exceptions. Source: superpowers `dispatching-parallel-agents/SKILL.md:10`. Already implicit in gobbi's executor briefs but should be named.
3. **"Witness-bound work."** Every change has a real session, error, or user-experience that motivated it. "Could theoretically" / "the linter might flag" / "for consistency" without a witness is forbidden. Source: superpowers `CLAUDE.md:47-49`.
4. **"Refuse to game your own tools."** When a tool produces a metric (slop-scan, test count, eval pass rate, plan checklist), the metric is signal not target. Source: gstack `CLAUDE.md:402-431`. Goodhart's law made operational.
5. **"State that survives compaction lives on disk."** One-time decisions are marker files; cross-session memory is JSONL append; in-flight context is in commit metadata. Never trust the conversation buffer for state. Source: gstack throughout.
6. **"Two AIs agreeing is signal, not mandate."** When the agent and an evaluator agree on something that changes the user's stated direction, present it and ask. Never act. Source: gstack `ETHOS.md:117-141`.
7. **"Mode-switch is asked or signaled, never inferred."** Source: gstack `office-hours` mode question, `SPAWNED_SESSION` env var.
8. **"Announce mode transitions out loud."** "I'm now using [skill] to [purpose]." Forces commitment to a discrete state; creates an audit trail. Source: superpowers `using-superpowers/SKILL.md:56`.

### REPLACE (where source repos prove a better version)

1. **"Treat user as client"** → **"Your human partner"** with the loss-aversion / embarrassment frame. Source: superpowers `CLAUDE.md`.
2. **"Pursue minimalism"** → split into **(a) witness-bound features** and **(b) lake-complete coverage**. Source: gstack `ETHOS.md` Boil the Lake.
3. **"Discuss critically"** → **"Specificity is the only currency"** + recommendation-verification loop. Source: gstack `office-hours`, `ETHOS.md`.
4. **"Bottom-up"** → **"2-5 minute steps; one question per message; one logical commit per step."** Source: superpowers `writing-plans/SKILL.md:36-44`.
5. **"Multi-perspective work is sequential"** → **"Multiple perspectives = multiple agents (each agent is single-perspective by construction)."** Source: gstack 23-specialist topology + superpowers two-stage review.

### CUT (overlap with existing gobbi-rule or weak)

1. The user's *draft* principle 1 ("dive-in habit, think first") overlaps with the existing `_gobbi-rule` "Study existing code and docs before making changes." Don't restate; instead ADD the **Red Flags table** as the mechanism that makes the existing rule operational.
2. The user's *draft* principle 2 ("multi-perspective sequential") is already partially in `_gobbi-rule` ("Spawn at least 2 evaluator agents with different perspectives"). Don't restate; ADD the **single-perspective-per-agent** corollary.

### MECHANISMS to introduce (not principles, but supporting infrastructure)

1. **Red Flags table** at the top of `_gobbi-rule` — a 10-12 row table of the exact rationalizations gobbi agents use to skip discipline. (Inventory from mistakes.)
2. **Pressure-test scenarios** for the most important rules — file alongside each agent definition.
3. **Plan-vs-diff scope-creep detector** — a script that diffs the implemented changes against plan items and flags anything not in the plan. Source: gstack `/review`.
4. **Per-question AUTO_DECIDE registry** — let the user mark routine questions as "auto-decide recommended option" to manage question fatigue. Source: gstack `gstack-question-preference`.
5. **`SPAWNED_SESSION`-style env var detection** for subagents to drop AskUserQuestion automatically. (Gobbi's orchestrator already does some of this implicitly.)
6. **Iron Law per skill** — every gobbi skill should have one all-caps non-negotiable line at the top. The rest of the skill is commentary on the iron law.
7. **`<HARD-GATE>` / `<SUBAGENT-STOP>` tag convention** — adopt these XML-style sentinels for non-negotiable gates so they're visually distinct from guidance.
8. **Witness field in commits/PRs** — every change must reference a session, error, mistake, or user request. "Refactor for consistency" without a witness is rejected.

---

## What I could NOT find / weakest evidence

Honest accounting:

- I could not confirm `cyrup-ai/gstack` exists; the canonical repo is `garrytan/gstack`. The user's brief mentioned cyrup-ai as a possibility — I went with garrytan based on search confirmation. If the user means a different gstack, this entire analysis would need re-running.
- I did not pull the full skill content for all 23 gstack skills; I sampled `/office-hours`, `/learn`, `/review` (search-only), and the master `SKILL.md`. Other skills (`/cso`, `/qa`, `/devex-review`) likely contain additional vocabulary and frames not surfaced here.
- I did not study the gstack `CHANGELOG.md` (516KB) or `TODOS.md` (104KB) for *evolution* of principles — the historical emergence of these rules would be a separate research pass and likely reveal more.
- The "94% PR rejection rate" in superpowers `CLAUDE.md:7` is asserted by the project; I have not independently verified the rate from GitHub PR data.
- I did not pull any external Anthropic/Karpathy primary sources beyond what gstack/superpowers cite — the framing of those frames here is filtered through the source repos' interpretation.

The substrate is rich enough to support the recommendations above with confidence. The strongest claim is that *both repos prove discipline patterns are mechanism-bound, not rule-bound* — gobbi's existing rules are good but light on mechanism, and that gap is where the highest-leverage work lies.
