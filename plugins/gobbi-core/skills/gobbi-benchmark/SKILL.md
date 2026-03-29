---
name: gobbi-benchmark
description: Skill benchmarking methodology — evaluate how well a skill performs against realistic scenarios. Use when measuring skill quality, comparing before/after changes, or tracking skill reliability over time.
allowed-tools: Read, Grep, Glob, Bash, Agent, AskUserQuestion
---

# Gobbi Benchmark Skill

Methodology for measuring how well skills perform. Benchmarks test a skill against realistic scenarios with structured scoring rubrics, then track results over time to detect improvement or regression.

**Navigate deeper from here:**

| Resource | Location | Covers |
|----------|----------|--------|
| Benchmark scenarios | `benchmarks/` subdirectory | One file per scenario, named `scenario-NN-{skill}-{description}.md` |

---

## Core Principles

> **Benchmarks measure trends, not exact scores.**

LLM output is non-deterministic. The same skill with the same input will produce different outputs across runs. A single benchmark run tells you very little. Multiple runs reveal a distribution, and comparing distributions before and after a skill change reveals whether the change helped, hurt, or had no measurable effect. Treat individual scores as samples, not verdicts.

> **Each benchmark run is expensive. Use them intentionally.**

A single scenario run involves at minimum two agent calls — one to execute the skill against the test input, one to evaluate the output against the rubric. Variance measurement multiplies this by the number of runs. Delta tracking doubles it again (before and after). This is not something to run on every change or in automated CI. V1 is manual-trigger only: the orchestrator runs benchmarks on explicit request, for specific scenarios, with a clear reason.

> **Scenarios are the unit of measurement. One scenario tests one skill behavior.**

Each scenario is a self-contained test case: a defined input, expected behavior criteria, a scoring rubric, and a pass threshold. Scenarios are narrow — they test specific capabilities of a skill, not the skill as a whole. A skill's overall quality is the aggregate pattern across its scenarios.

> **Evaluation drives scoring. The evaluator agent scores, not the executor.**

The agent under test never scores itself. The orchestrator spawns the executor with the skill loaded and the test input, captures the output, then spawns a separate evaluator agent with the rubric to score independently. This mirrors gobbi-evaluation's separation principle — the entity that creates must never evaluate its own output.

---

## Scenario Anatomy

Benchmark scenarios live in the `benchmarks/` subdirectory, named `scenario-NN-{skill}-{description}.md`. Each scenario defines five elements:

**Context** — Background information about the simulated situation. What project is being worked on, what state is the codebase in, what has happened before this interaction. Enough to make the test realistic, not so much that it overwhelms the executor.

**Input** — The exact prompt or task the executor agent receives. This is the stimulus being tested. For discussion skills, this might be a deliberately vague user request. For execution skills, this might be a task with missing constraints.

**Expected behavior** — What the skill should cause the agent to do. Not a single correct output (LLM output varies), but observable behaviors and qualities the output should exhibit. Expressed as criteria the evaluator checks against.

**Scoring rubric** — Structured criteria with a 0-10 scale per criterion. Each criterion targets one dimension of the expected behavior. The evaluator agent scores each criterion independently with a brief justification. Criteria should be specific enough that different evaluators would reach similar scores for the same output.

**Pass threshold** — The minimum acceptable performance. Typically expressed as an average score across all criteria. A scenario passes when the average meets or exceeds this threshold.

Read existing scenarios in `benchmarks/` for the concrete format. The first scenario establishes the structural pattern.

---

## Execution Model

Benchmarking is an agent-orchestrated workflow, not a script. The orchestrator manages the full cycle.

### Single Run

The orchestrator reads a scenario file, spawns an executor agent with the target skill loaded and the scenario's context and input, captures the executor's output, then spawns an evaluator agent with the scenario's rubric and the executor's output. The evaluator scores each criterion and returns a structured result.

### Variance Measurement

Run the same scenario multiple times (typically 3-5 runs) to observe output consistency. The orchestrator collects all scores across runs and reports the mean and spread for each criterion. High variance on a criterion means the skill's guidance for that behavior is not reliable — the agent sometimes follows it, sometimes does not. Low variance with high scores means the skill reliably produces the desired behavior.

### Delta Tracking

Run the same scenarios before and after modifying a skill. Compare the score distributions to determine whether the change improved, regressed, or had no measurable effect on each criterion. Delta tracking is the primary use case for benchmarks — it answers "did this skill change actually help?"

---

## Honest Limitations

**Cost is real.** Each scenario run costs at minimum two agent calls. Variance measurement with 5 runs costs 10 calls per scenario. Delta tracking with variance costs 20 calls per scenario. A skill with 5 scenarios measured for delta with variance costs 100 agent calls. Budget accordingly and run only the scenarios relevant to the change being measured.

**Scores are noisy.** LLM non-determinism means scores will vary between runs even with no skill changes. Small score differences (1-2 points) between before and after may be noise, not signal. Only trust clear trends supported by multiple runs.

**Evaluator subjectivity.** The evaluator agent interpreting the rubric introduces its own variance. Different evaluator runs may score the same output differently. Well-written rubric criteria reduce this variance but cannot eliminate it.

**Scenarios are not coverage.** Having benchmark scenarios does not mean a skill is well-tested. Scenarios test what you thought to test. Skills can fail in ways no scenario anticipated. Benchmarks complement qualitative judgment — they do not replace it.

---

## Relationship to Skill Verification

gobbi-benchmark and gobbi-claude-skills verification (see `gobbi-claude-skills/verification.md`) serve different purposes:

- **Benchmark** measures specific skill behaviors quantitatively — numeric scores, variance, delta tracking. Use benchmarks to answer "did this change improve the skill's performance on this specific behavior?"
- **Verification** assesses holistic skill quality with specialized agents (grader, analyzer, comparator) — trigger accuracy, output quality, blind A/B comparison. Use verification to answer "is this skill well-written and effective overall?"

Benchmark scenarios complement verification agents. Run verification for broad quality assessment. Run benchmarks for targeted measurement of specific behaviors you're actively changing.

---

## Constraints

- Benchmark execution is manual-trigger only — no automated CI, no pre-commit hooks
- The executor agent under test never scores itself — always a separate evaluator agent
- Each scenario tests one skill — cross-skill interaction benchmarks are out of scope for V1
- Scenarios are flat in `benchmarks/` — one level of nesting, consistent with the `scripts/` precedent in gobbi-note
- Benchmark results are ephemeral in V1 — tracked in notes or discussion, not in a persistent store
- Do not benchmark all skills — benchmark the skills you are actively improving, for the behaviors you are actively changing
