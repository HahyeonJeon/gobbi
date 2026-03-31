# Scenario 01: _discuss — Vague Prompt Handling

Tests whether an agent loaded with _discuss correctly handles a deliberately vague user request by pushing for specificity rather than accepting the request at face value.

---

## Context

The user is working on an existing web application with a React frontend and Node.js backend. The application has been in production for several months. The agent has been loaded with _discuss and is in discussion mode. No other context about the application's current problems, performance metrics, or priorities has been provided.

---

## Input

> "Make the app better."

The agent should treat this as a user message delivered via AskUserQuestion interaction. No follow-up context is provided unless the evaluator is also assessing multi-turn behavior, in which case the evaluator provides deliberately vague follow-up answers like "you know, just... better" or "faster and stuff" to test whether the agent continues pushing for precision.

---

## Expected Behavior

The agent using _discuss should:

- **Refuse to accept the vague requirement.** The agent must not start planning or executing based on "make the app better." It must recognize this as insufficiently specific and enter discussion mode.

- **Ask clarifying questions that target specific dimensions.** Questions should address distinct dimensions from _discuss's discussion framework — problem, scope, deliverable, priority, constraints, verification. Each question should narrow one dimension, not ask broad compound questions.

- **Challenge the implicit assumptions.** The prompt assumes the app needs improvement but does not specify what is wrong. The agent should surface this: what is the actual problem? What triggered this request? What happens if nothing changes?

- **Offer concrete options with a recommendation.** Rather than asking open-ended "what do you mean by better?", the agent should propose specific interpretations — performance optimization, UX improvements, code quality, feature additions — and recommend which to investigate first based on typical high-impact areas. The recommendation should have reasoning.

- **Push for measurable specificity.** "Better" is not measurable. The agent should push toward specific metrics, targets, or observable outcomes. Which endpoint is slow? What is the current response time? What target response time would constitute "better"?

---

## Scoring Rubric

Each criterion scored 0-10 by the evaluator agent.

### Clarification Quality (0-10)

Did the agent ask specific, dimension-targeted questions rather than broad open-ended ones?

- **0-2:** Agent accepted the vague prompt or asked only "what do you mean?" without structure
- **3-5:** Agent asked some questions but they were broad, compound, or missed key dimensions
- **6-8:** Agent asked specific questions covering multiple dimensions, each narrowing one thing
- **9-10:** Agent asked precise, well-ordered questions across problem, scope, priority, and verification dimensions — each question made the specification more concrete

### Assumption Challenging (0-10)

Did the agent surface and question the implicit assumptions in "make the app better"?

- **0-2:** Agent treated the request as self-evidently valid and moved to execution planning
- **3-5:** Agent acknowledged vagueness but did not probe the underlying assumptions (why "better"? is there actually a problem? what triggered this?)
- **6-8:** Agent surfaced the key assumption that improvement is needed and questioned what the actual trigger or problem is
- **9-10:** Agent identified multiple implicit assumptions (that the app is insufficient, that improvement is the right framing, that the user knows what "better" means) and challenged each constructively

### Recommendation Strength (0-10)

Did the agent lead with a recommendation rather than just presenting options?

- **0-2:** Agent asked what the user wants without offering any direction
- **3-5:** Agent listed options but without clear recommendation or reasoning
- **6-8:** Agent presented options with a clear recommended option and explained why
- **9-10:** Agent led with a strong, reasoned recommendation, explained the trade-offs of alternatives, and made it easy for the user to either accept or choose differently

### Specificity Push (0-10)

Did the agent reject vague answers and push for precision?

- **0-2:** Agent accepted "better" or similar vague terms as sufficient specification
- **3-5:** Agent asked for more detail but accepted moderately vague answers without further probing
- **6-8:** Agent pushed for specific metrics, targets, or observable outcomes at least once
- **9-10:** Agent consistently pushed vague responses toward measurable specificity — named concrete metrics, asked for current vs target values, refused to proceed until the specification was actionable

---

## Pass Threshold

Average score across all four criteria must be **7 or higher** to pass.

A score of 7+ indicates the agent reliably follows _discuss principles when confronted with vague input. Scores below 7 indicate the skill's guidance is insufficient to prevent the agent from accepting or inadequately challenging vague requirements.
