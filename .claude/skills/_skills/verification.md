# Skill Verification

Concepts and evaluation agents for verifying skill quality — trigger accuracy, output quality, improvement loops, and blind comparison. Loaded from _skills SKILL.md.

---

## Trigger Testing

Trigger testing checks whether a skill's `description` frontmatter accurately identifies prompts that should load it and correctly rejects prompts that shouldn't. The description is the skill's contract with the auto-invocation system — if it's wrong, the skill either misfires on unrelated tasks or fails to load when needed.

A good trigger description balances precision and recall. Too narrow and the skill misses legitimate use cases — an agent working on a related task won't get the knowledge it needs. Too broad and the skill loads for unrelated tasks — polluting context and competing with more relevant skills. The test is: for any given prompt, would a reasonable person agree that this skill is relevant?

Edge cases matter most. Clear hits and clear misses are easy to get right. The hard cases are prompts that seem related but shouldn't trigger the skill, or prompts phrased unusually that should. These edge cases reveal whether the description captures the skill's actual domain or just its most obvious use case.

---

## Two-Track Verification

Skill verification has two complementary tracks that answer different questions at different costs. Understanding which question you need to answer determines which track to use.

**Script-based trigger testing** answers a narrow, binary question: does this skill's description accurately identify prompts that should load it, and correctly exclude prompts that shouldn't? The `__benchmark/scripts/trigger-test.py` script tests this with LLM-powered classification — it needs an `ANTHROPIC_API_KEY` and the `anthropic` Python package, but nothing else. The signal it produces is reproducible, cheap, and focused. Run it when iterating on a description: the feedback loop is tight enough to try several variants and see which produces better precision and recall.

**Agent-based holistic verification** answers a broader, harder question: when this skill loads, does it help agents make good decisions? The `_skills-evaluator` agent — loaded with different `_skills-evaluation-{perspective}` skills — assesses trigger accuracy and output quality together. It can judge teaching effectiveness, mental model clarity, and anti-pattern compliance in ways no script can. This track is expensive (multiple agent calls per cycle), non-deterministic (results vary across runs), and requires more context to set up. It's the right tool for full quality assessment, not for rapid description tuning.

**The decision rule is:** trigger accuracy is a prerequisite, not the goal. If the description is wrong, no amount of content quality matters — the skill never loads. Fix the description first, cheaply, with the script. Once trigger accuracy is solid, use agents to assess whether the skill's content actually produces good outcomes. For a skill approaching shipping, both tracks together provide the most confidence: the script confirms the description is precise, and agents confirm the content is effective.

The tracks are not substitutes — each covers blind spots the other has. A high-precision description measured by the script can still be attached to content that teaches the wrong mental model. Agent-based verification catches that. Conversely, agent evaluation alone may miss subtle trigger edge cases that only emerge with systematic prompt sampling.

---

## Output Quality Evaluation

Output quality measures whether a skill, once loaded, actually helps the agent make good decisions. A skill can have perfect trigger accuracy and still produce poor outcomes if its content doesn't teach the right mental model.

Dimensions for evaluating output quality:

- **Mental model accuracy** — Does the skill teach how things work and why, or does it just list rules? An agent that understands the mental model adapts to novel situations. An agent that memorized rules breaks when the situation doesn't match.
- **Sufficient context** — Does the skill give the agent enough context to make decisions without reading every child doc? The parent should provide the mental model; children provide depth. An agent shouldn't need to read three files to understand the basics.
- **Anti-pattern compliance** — Does the skill follow _claude writing principles? No code examples, no BAD/GOOD blocks, no step-by-step recipes in teaching content. These anti-patterns cause agents to mimic instead of reason.
- **Actionable specificity** — Are principles specific enough to guide behavior, or so abstract that an agent can't derive concrete actions? "Write good documentation" is too vague. "Each file opens with purpose and scope so agents know whether to read further" is actionable.

---

## Improvement Loop

Skill verification follows gobbi's standard cycle: grade, analyze, improve, re-grade. This is a user-driven loop — the orchestrator suggests next steps, but the user decides when to iterate and when to stop.

**Grade** — Spawn `_skills-evaluator` loaded with the relevant `_skills-evaluation-{perspective}` skill(s) to test the skill against sample prompts. The evaluator assesses trigger accuracy (did the right prompts load the skill?) and output quality (did the skill guide the agent well?). Grading produces structured results with scores and observations.

**Analyze** — Spawn `_skills-evaluator` loaded with the overall perspective skill to synthesize grading results into prioritized improvements. It identifies patterns across multiple grading results — recurring trigger failures, consistent output quality gaps, systematic weaknesses — and produces a ranked list of what to fix first.

**Improve** — Apply the highest-priority improvements to the skill. Focus on one or two changes per iteration rather than rewriting everything. Small, targeted changes are easier to verify than broad rewrites.

**Re-grade** — Run the evaluator again after improvements to verify they helped and didn't regress other areas. A fix to trigger accuracy shouldn't degrade output quality. A content improvement shouldn't break the trigger description.

**Compare (optional)** — Spawn `_skills-evaluator` with instructions for blind A/B comparison of the old vs new version. Comparison is most valuable when changes are substantial or when grading alone doesn't clearly show whether the new version is better. See the blind comparison protocol below.

---

## Blind Comparison Protocol

Blind comparison removes provenance bias — the tendency to favor the version you know is "new" or "improved." The protocol is simple: the invoker (user or orchestrator) takes two skill versions, randomly assigns them as Version A and Version B without labeling which is current vs candidate, and presents both to the comparator.

The comparator sees the full content of both versions. No anonymization of the text is needed — the comparator just doesn't know which is current and which is the candidate replacement. It evaluates both on the same dimensions (trigger accuracy, output quality, teaching effectiveness) and declares a preference with reasoning.

After the comparator delivers its verdict, the invoker maps A/B back to current/candidate to interpret the result. If the comparator preferred the candidate, the improvement is validated. If it preferred the current version, the changes may have introduced regressions worth investigating.

---

## Evaluation Agent

One agent executes skill verification across all verification roles:

**_skills-evaluator** is loaded with different `_skills-evaluation-{perspective}` skills depending on the evaluation focus. For grading, load the perspective skills relevant to the skill domain being assessed. For analysis, load `_skills-evaluation-overall` to synthesize results into prioritized improvements. For blind comparison, load the perspective skills and instruct the agent to evaluate both versions without provenance labels. The data flow is: grading results and comparison verdicts are synthesized by the evaluator into prioritized recommendations.

---

## Cost and Reproducibility

Agent-based evaluation is expensive and non-deterministic. Each verification cycle involves multiple agent calls — grading, analysis, and optionally comparison — each of which costs tokens and may produce slightly different results on repeated runs. This trade-off is accepted because agents can assess nuanced qualities (teaching effectiveness, mental model clarity) that scripts cannot, keeping the workflow Claude Code native for holistic assessment.

For skills where trigger testing is the primary concern — newly written skills, or skills whose descriptions are actively being refined — the `__benchmark/scripts/trigger-test.py` script provides a lighter-weight alternative. It costs a small number of API calls rather than multiple `_skills-evaluator` sessions, and its output (precision, recall, F1) is directly comparable across runs. Use the script to stabilize the description, then bring in the evaluator agent once the trigger surface is correct and the question shifts to output quality.

For skills where trigger testing needs to be highly reproducible regardless of which track is used, maintain a list of test prompts that can be reused across iterations. Consistent inputs improve comparability even when agent evaluation introduces variance. The test prompt list also serves as documentation of the skill's intended trigger surface.
