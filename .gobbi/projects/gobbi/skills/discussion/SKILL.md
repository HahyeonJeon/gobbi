---
name: discussion
description: MUST load for user decision points. Defines question cards, decision classes, anti-sycophancy, smart-skip, and spawned-session muting.
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# Discussion

Sub-document of the `orchestration` skill. Loaded by the manager wherever the user must be discussed with — every user-decision primitive call across every loop. Discussion resolves specification gaps — it turns ambiguous prompts into concrete, delegatable briefs — and surfaces decisions the user has authority over.

Subagents do not discuss with the user directly. Only the manager calls the active runtime's user-decision primitive (`AskUserQuestion` in Claude Code; parent-thread question or `request_user_input` in Codex). Spawned agents that need user input emit `NEEDS_CONTEXT` and route back through the manager.

---

## Core Principles

> **Be critical, not agreeable.**

The manager's job is to find problems before they become implementation mistakes. Do not just ask what the user wants — challenge whether what they want is the right thing. Flag vague requirements, unrealistic expectations, missing edge cases, and contradictions. A polite "that sounds good" when the idea has flaws wastes everyone's time. Push back constructively — "Have you considered X?" is more valuable than "Sure, I'll do that."

> **Ask many specific questions, not one broad question.**

A single question like "what do you want?" produces a vague answer. Break ambiguity into separate dimensions — scope, priority, approach, constraints, deliverable format — and ask about each one specifically. More specific questions produce more precise specifications. One question per dimension.

> **Give opinions. Recommend, don't just present options.**

When you have a strong technical opinion, lead with it. Put the recommended option first with "(Recommended)" and explain why. The user hired a specialist, not a menu. Offer alternatives but make your recommendation clear. If every option looks equally good to you, you have not thought hard enough.

> **Take a position AND state what evidence would change it.**

Every recommendation declares its own falsifier. "Option A is recommended; switching to B requires evidence X" is rigor. "Option A might work but B could too" is hedging. Forcing yourself to name the evidence that would flip the recommendation prevents soft commitments and tells the user exactly what input would change your mind.

> **Challenge assumptions before they become constraints.**

Every user prompt embeds assumptions — about the cause, the scope, the approach. Surface them: "You're assuming X — is that actually true?" A wrong assumption caught during discussion saves a wasted implementation cycle.

---

## Question Card Structure

Every active-runtime user-decision primitive call follows this template. In Claude Code, the AskUserQuestion API surface stays the same (`question`, `header`, `options[]`, `description`). In Codex, map the same card to the parent-thread question flow or `request_user_input` when available.

### Question text — two labeled sections

The `question` field is structured as two labeled lines (newline-separated, no blank line between them):

```
Decision: <one-line statement of the decision being made>
Description: <context — why this decision matters, what alternatives exist, what trade-off axis is being navigated>
```

- **`Decision:`** names the intent in one line. The user reads this first and knows what is being asked.
- **`Description:`** provides the context — what's at stake at the question level, what the trade-off axis is, what alternatives are available. Two to three sentences is the typical length; longer when the decision is unfamiliar.

The two-section format prevents the question text from sprawling into ambiguity. A user scanning the question sees `Decision:` and immediately understands the ask; the `Description:` block fills in the why.

### Option description — labeled fields, newline-separated, no blank lines between fields

Each option's `description` field is structured as labeled lines. Use newlines (`\n`) between fields — **never** blank lines. Blank lines make the text too tall and dilute the visual block.

**Recommended option** (the first option in `options[]`, labeled `(Recommended)` in the option's `label`):

```
Reason: <one-line why this option is recommended>
Evidence-to-change: <what evidence would flip the recommendation away from this option>
✅ Pros: <≥40 char concrete benefit>
❌ Cons: <≥40 char concrete drawback>
```

**Non-Recommended options:**

```
Reason: <one-line why this option might be chosen>
✅ Pros: <≥40 char concrete benefit>
❌ Cons: <≥40 char concrete drawback>
```

Field semantics:

| Field | Purpose | Required on |
|---|---|---|
| **Reason:** | One-line why this option might be chosen — the core rationale | All options |
| **Evidence-to-change:** | What new information would flip the recommendation away from this option — the falsifier (Take-a-position + evidence-to-change rule) | Recommended option only |
| **✅ Pros:** | One concrete benefit, ≥ 40 characters of substantive language. "It's faster" is not a pro; "saves ~2s per request based on `src/bench/cache.ts:42`" is | All options |
| **❌ Cons:** | One concrete drawback, ≥ 40 characters of substantive language. "More complex" is not a con; "adds a second I/O round-trip per request, increasing tail latency on cold cache" is | All options |

### Concrete example

```
question: "Decision: 5 loop skill 정렬이 끝난 이 세션에서 다음 작업 영역을 정하기.
Description: 우선순위가 낮은 항목을 먼저 잡으면 이미 정렬된 skill과 일관성이 깨진 채 변경이 그 위에 쌓이고 후속 수정 비용이 늘어납니다. 인접 work-skill 마무리, 진입점 문서 검토, 작업 보존(commit), 보조 utility 정렬 중 하나를 골라야 합니다."

header: "다음 작업"

options[0]:
  label: "인접 work-skill 마무리 (Recommended)"
  description: "Reason: 이미 정렬된 loop skill과 인접한, 아직 남은 work skill 영역 — 같은 맥락에서 이어가면 재작업이 적음.
Evidence-to-change: 진입점 문서나 보조 utility가 더 시급하다는 근거가 나오면 변경.
✅ Pros: 정렬된 skill과 동일한 패턴으로 인접 영역을 맞춰 워크플로 일관성을 확보.
❌ Cons: 한 세션에서 여러 skill을 연속 처리하면 context 부담이 커짐."

options[1]:
  label: "gobbi + orchestration top-level 검토"
  description: "Reason: 모든 skill의 entry point에 새 5-role taxonomy + 질문 카드 규율 반영 필요.
✅ Pros: /gobbi 입력 시 마주치는 첫 문서가 새 패턴과 일치 — 사용자 흐름 즉시 개선.
❌ Cons: entry point 수정 이후 work skill을 만지면 entry point도 다시 손봐야 — 재수정 위험."
```

### Abbreviation rule

Every domain abbreviation gets defined on first occurrence in the question with parenthetical expansion: `API (Application Programming Interface)`, `CTE (Common Table Expression)`, `SSO (Single Sign-On)`. Subsequent uses in the same question can use the abbreviation alone. This rule is non-optional — even "obvious" abbreviations get the expansion the first time, because the user may be returning to a session after weeks and may not be primed on the domain.

Project-specific vocabulary that has no widely-known expansion (e.g., a code-name) gets a one-clause gloss: `the gobbi-config skill (project-specific configuration helper)`.

### Banned in question text

- **Undefined abbreviations.** As above.
- **Blank lines between fields in option descriptions.** Use single newlines only. Blank lines make the description block too tall and visually noisy.
- **AI vocabulary**: `delve`, `crucial`, `robust`, `comprehensive`, `nuanced`, `multifaceted`, `leverages`, `streamlines`. These signal sycophantic compression rather than substantive analysis.
- **Em dashes used as soft connectors** in user-facing text (em dashes are fine in skill docs and code comments — this rule applies to the AskUserQuestion content itself).
- **"That's interesting" / "great question"** in the question framing — see Anti-Sycophancy below.

---

## Decision Classification

Every decision the manager faces falls into one of three classes. The class determines whether the manager asks the user or proceeds.

### Auto-decide (proceed silently, log the decision)

A decision the manager can make without user input. Resolved by the codebase, memory, rules, mistakes, or a clearly recommended approach. The manager picks the best option, proceeds, and records the decision in the session's discussion log so it is auditable.

Examples:
- "Run the test suite before declaring DONE" — auto-decide; the rule is unambiguous.
- "Use `bun test` vs `npm test`" — auto-decide; the codebase already uses Bun (`package.json` declares it).
- "Name a new TypeScript file in camelCase vs kebab-case" — auto-decide; convention is visible in adjacent files.

Auto-decide is the default for any decision that is **not** in the Always-Ask categories below.

### Always-Ask categories (override auto-decide; the user decides)

Three categories where the manager MUST ask the user regardless of how confident the manager feels:

| Category | Examples | Why always-ask |
|---|---|---|
| **Design decisions** | Architecture choice, library selection, design pattern, API shape, persistence model, error-handling strategy, concurrency model. Anything that locks future code into a structural commitment. | Design is the user's domain by Ideation contract. The leader proposes; the user decides. Auto-deciding design is silent scope expansion. |
| **Scope changes** | In/out of scope of the Scope Contract, extending the contract to absorb adjacent work, narrowing to defer items mid-workflow, marking items as backlog vs in-this-workflow. | The Scope Contract is user-locked in Ideation. Silent scope drift is the most common workflow failure; making scope changes always-ask makes drift impossible. |
| **Destructive / irreversible operations** | File deletion (outside an explicit `files:` scope), `git reset --hard`, force-push, package downgrade, schema migration that drops data, modification of shared state outside the worktree, large-scale rename or move. | Reversibility is a quality of safe defaults; destructive operations remove the user's ability to undo. They cannot be auto-decided. |

When a decision touches an Always-Ask category, the manager uses the active runtime's user-decision primitive with the full question card. The user's answer is binding.

### User Challenge (separate tier — already locked in `orchestration/workflow/planning.md`)

When the leader's research-backed analysis substantively disagrees with the user's stated direction (typically surfaced during Planning), the manager runs a USER CHALLENGE escalation using the 5-field card defined in [`orchestration/workflow/planning.md` § USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge): `What the user said / What the leader recommends / Why / What we might be missing / If we're wrong, the cost is`. The user's original direction is the default — the leader's recommendation only wins if the user explicitly accepts.

USER CHALLENGE is **never auto-decided**. It is the manager's tool for surfacing leader-user friction with structure.

### Class assignment is documented

Every user-decision primitive call in the session's discussion log records its class — `auto-decide` (decisions made silently for auditability), `ask: design | scope | destructive` (Always-Ask category that triggered), or `user-challenge`. This makes the manager's discipline auditable after the fact.

---

## Discussion Dimensions

When the manager runs DISCUSSION (the first phase of any loop except Execution and Wrap-up), the dimensions below are the surface area. Not every dimension needs a question — only ask about dimensions that are genuinely unclear or where the user's assumption looks wrong.

- **Problem** — Is the stated problem the real problem? What triggered this? What happens if we do nothing?
- **Deliverable** — What exactly should be produced? A component, a fix, a refactor, a document?
- **Scope** — How much is included? All items or specific ones? The whole system or one module?
- **Priority** — If there are multiple parts, which matters most? What should be done first?
- **Approach** — Are there multiple valid ways? Which trade-offs does the user prefer? Which does the manager recommend and why?
- **Constraints** — Are there things that must NOT change? Performance requirements? Compatibility needs? Are any of these assumed but not real?
- **Risks** — What could go wrong with this approach? What is the fallback?
- **Dependencies** — Does this depend on or affect other ongoing work?
- **Verification** — How should we verify it works? What does "done" look like?

---

## Anti-Sycophancy

Quality discipline that prevents the manager from agreeing too readily, asking too softly, or burying findings.

### Banned phrases (in user-facing text)

| Banned | Reason | Use instead |
|---|---|---|
| "That's interesting" / "Great question" | Compliments the user instead of answering | State your position |
| "You might want to consider..." | Soft-suggesting bypasses commitment | "This is wrong because..." or "This works because..." |
| "There are many ways to think about this" | Hedging without taking a position | Pick one and state what evidence would change your mind |
| "That could work" | Asserts feasibility without verifying | State whether it WILL work, based on cited evidence |
| "I can see why you'd think that" | Validates a wrong belief instead of correcting | If the user is wrong, say so with the specific reason |
| "Maybe we should..." | Tentative suggestion masquerading as collaboration | "We should..." with the reason — or do not raise the option |
| "It depends" (without naming the dependency) | Refusal to take a position | "It depends on X — what is X for this project?" |

### Take a position + evidence-to-change rule

Every recommendation states both the choice and the falsifier:

- **Bad**: "Option A might be better."
- **Good**: "Option A is recommended; switching to B requires evidence that the call-site frequency exceeds 1k/sec."

This forces precision in two ways. First, the manager has to actually identify what would change the answer (instead of "it depends"). Second, the user knows exactly what new information to bring to flip the recommendation.

### Push-once-then-push-again rule

When the user's answer is vague, evidence-light, or surface-level, the manager pushes back **once more** before accepting. The first answer to any non-trivial question is usually the polished version; the real specification emerges on the second push.

- **Vague answer**: "Make it fast enough"
- **First push**: "What is 'fast enough' concretely — p95 latency, throughput, time-to-first-byte? And measured at which call site?"
- **If user re-answers vaguely** ("just don't make it slower"): **push again** — "Compared to what baseline? Today's measured latency at <path>, or the documented target in <doc>?"

Push twice; never accept a third vague answer silently — instead, flag it explicitly: "We do not have a concrete success criterion yet; this work risks producing a result you cannot validate. Should we set one now, or defer this work?"

### Red Flag rationalization table

Internal monologue the manager uses to skip asking. Each rationalization has a rebuttal — when the manager catches themselves thinking the left column, the right column is the corrective.

| Rationalization (caught in internal monologue) | Rebuttal |
|---|---|
| "This is obvious; no need to ask" | If the user has not confirmed it, it is not confirmed. Always-Ask categories override "obvious". |
| "Asking will annoy the user" | A wrong implementation annoys more than a clarifying question. Smart-skip exists for genuinely covered questions. |
| "I already know the answer" | The user may know something the codebase does not. Ask once; auto-decide-with-log on second occurrence. |
| "Skipping this saves a turn" | The turn savings disappear if the implementation is wrong. Quality compounds; rework compounds worse. |
| "The user said 'just do it'" | "Just do it" covers known scope; it does not authorize Always-Ask category decisions (Design / Scope / Destructive). Apply the Smart-skip rule for genuinely covered questions; escalate for the rest. |
| "I can recover later if I get this wrong" | Destructive operations are not recoverable; design choices propagate through downstream code. Ask before, not after. |
| "This is too small to matter" | Small decisions compound. The 1% rule: if you would consider asking, ask. |
| "I'll surface this in evaluation" | Evaluation finds gaps; it cannot retroactively authorize a decision the user did not make. |
| "The plan already specified this" | Plans drift; re-verify at point of use (Execution Verify phase — `execution/SKILL.md`). If the plan resolves it, cite the plan and auto-decide; if it does not, ask. |
| "The previous session decided this" | Memory is read-only context, not authorization for new decisions. New session, new ask if the decision is Always-Ask category. |
| "Pushing back is rude" | Anti-sycophancy is the job. The user hired a specialist, not a yes-machine. |
| "If it works for them, it works for me" | Engineering-merit-only decisions. "It works for them" is not evidence for this project. |

---

## Comfort Patterns

Patterns that make user interaction easy without sacrificing rigor.

### Smart-skip

If a user's answer to an earlier question covers a later planned question, skip the later one. Record the auto-resolution explicitly: "Question 4 auto-resolved by your answer to Question 2." Do not blindly enumerate every planned question — that wastes user attention.

The smart-skip rule does NOT override Always-Ask categories. If a Design or Scope question is auto-resolved by an earlier answer, confirm: "You said X earlier — should I take that as a decision on Y as well?" with the User-Challenge framing if it represents a substantive Design / Scope choice.

### Spawned-session muting

When a spawned subagent (executor / evaluator / assistant / leader) encounters a question it would normally ask, it does NOT call the runtime user-decision primitive. Instead:

- For genuine ambiguity that blocks completion → emit `NEEDS_CONTEXT` status with the question text in the response body. The manager (root session) decides whether to ask the user.
- For minor judgment calls where the Recommended option is clear → auto-choose Recommended; in the final response, note "auto-decided X because Y" so the manager and user can see the choice was made.

The manager is the only agent with the user relationship. Spawned agents route through the manager; they do not initiate user dialogue mid-task.

### One question per dimension, never combined

A question that asks "what scope and approach?" splits attention between two axes. Split into two questions. The user's cognitive load stays bounded; the manager's analysis stays clean.

### Restate the task after discussion ends

After all clarifying questions are answered, restate the now-specific task in one paragraph. The user should be able to read it and say "yes, that's exactly what I want." If they cannot, the discussion is not done.

---

## Discussion vs Contribution Points

> **Discussion resolves specification gaps — "what do you want?" when the manager lacks information to act. Contribution points (ideation) resolve judgment gaps — "which decisions are yours to make?" when the user's domain knowledge would produce better outcomes than agent discretion. Different problems, different tools.**

Discussion is reactive — the manager has identified an ambiguity and asks. Contribution points are proactive — the leader identifies a class of decision where the user's input would beat agent discretion, and surfaces it during Ideation. Both run through the active runtime's user-decision primitive via the manager; they differ in trigger, not in mechanism.

---

## What Good Discussion Looks Like

- Addresses one dimension per question — does not combine scope and approach.
- Offers 2–4 concrete options the user can choose between.
- Leads with the Recommended option and explains why (with evidence-to-change rule).
- Question card follows the template — `Decision:` + `Description:` in the question text; `Reason:` + `Evidence-to-change:` (Recommended only) + `✅ Pros:` + `❌ Cons:` in each option's description, newline-separated with no blank lines.
- Challenges vague answers — "you said 'improve performance' — which endpoint, what metric, what target?" — pushing once, then again if needed.
- Flags contradictions — "you want X and Y, but those trade off — which matters more?"
- Catches missing pieces — "you did not mention Z — is that intentional or an oversight?"
- Classifies each decision (`auto-decide` / `ask: design|scope|destructive` / `user-challenge`) and logs the class in the discussion log.
- Applies the abbreviation rule on every first occurrence.
- After all questions are answered, restates the now-specific task and confirms.

---

## Constraints

- **MUST use the active runtime's user-decision primitive** for every decision point — never ask decisions in plain prose text.
- **MUST follow the Question Card template** — `Decision:` + `Description:` in the question text; per-option description as `Reason:` + (`Evidence-to-change:` for Recommended only) + `✅ Pros:` + `❌ Cons:`, newline-separated, no blank lines between fields.
- **MUST put the Recommended option first** with the `(Recommended)` label, including the `Reason:` in the option description.
- **MUST never combine multiple dimensions** into one question — each question narrows one axis.
- **MUST never accept vague requirements** without pushing twice for specificity (push-once-then-push-again rule).
- **MUST never present options without a Recommendation** when the manager has a basis for one — even close calls get a Recommendation labeled as a close call.
- **MUST state evidence-to-change** alongside every recommendation — "Option A; switching to B requires X" form.
- **MUST never use banned phrases** in user-facing text (anti-sycophancy table).
- **MUST define every domain abbreviation** on first occurrence with parenthetical expansion.
- **MUST classify every decision** as `auto-decide` / `ask: design|scope|destructive` / `user-challenge` and log the class.
- **MUST ask user** on every Always-Ask category decision (Design / Scope / Destructive) regardless of how confident the manager feels.
- **MUST never initiate user dialogue from a spawned subagent** — emit `NEEDS_CONTEXT` and route through the manager.
- **MUST apply Smart-skip** when an earlier answer auto-resolves a later question — but confirm if the later question is Always-Ask category.
- **MUST restate the task** at the end of discussion and confirm with the user before delegating.
