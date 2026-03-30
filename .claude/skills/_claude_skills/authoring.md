# Skill Authoring

How to write skill content that actually helps agents reason — description craft, instruction writing, content pruning, and failure patterns. Loaded from _claude_skills SKILL.md.

---

## Description Craft

The description field is the skill's contract with the auto-invocation system. It determines whether the skill body ever loads. An agent scanning available skills never reads SKILL.md unless the description signals relevance — everything downstream depends on getting this right.

**How loading works (observed behavior, not documented spec):** The description (~100 words, always loaded) determines whether the skill body is fetched. Once triggered, the full SKILL.md body loads. Bundled non-doc resources (`scripts/`, `references/`) are available on demand but require explicit navigation.

**Write for intent, not inventory.** "Use when creating or reviewing `.claude/skills/` files" frames what the agent is doing. "This skill provides skill authoring guidance" describes the skill's content — the agent already knows that from context. Intent-framing makes the trigger decision easy; inventory-framing makes it uncertain.

**The 1024-character hard limit is a forcing function.** A description that sprawls to fill the limit is usually trying to cover too many cases. A description that fits in 300 characters and still captures the right trigger surface is better. Precision matters more than comprehensiveness.

**Balance precision and recall deliberately.** Too narrow: the skill misses legitimate use cases, leaving agents without relevant knowledge. Too broad: the skill loads for unrelated tasks, polluting context and competing with more relevant skills. The test is whether a reasonable person would agree the skill is relevant for any given prompt that matches the description.

**Stand out among similar skills.** When multiple skills cover adjacent domains, descriptions must differentiate clearly. Agents see the full skill roster — if two descriptions look similar, the wrong skill loads.

---

## Instruction Writing Principles

**Lead with why, not what.** An agent that understands the purpose of a constraint adapts when the situation is novel. An agent that memorized "always do X" breaks when the situation doesn't cleanly fit X. Every instruction is more durable when the reasoning travels with it.

**Respect theory of mind.** The skill is read by an agent that has its own context, task, and reasoning process. Write to that agent's decision-making situation: what does it need to know to make a good call right now? Not: what rule should it memorize for later application? The former produces judgment; the latter produces rule-following.

**Constraints over prescriptions.** Telling an agent what not to do (with a clear boundary and the reasoning behind it) leaves room for judgment within that boundary. Telling an agent what to do gives it a path to follow — but only for situations that match the path. Constraints generalize; prescriptions overfit.

**Constraint overload defeats reasoning.** A skill with twenty constraints teaches agents to prioritize compliance over thinking. When the constraints stack up, agents spend cognitive budget checking rules rather than solving the problem. Fewer, higher-value constraints with clear reasoning beat many shallow constraints.

**Generalize for the real distribution.** Skills are invoked across many different prompts, users, and project contexts. A skill written by testing against five specific prompts will work for those prompts and fail for the rest. Write principles that hold across the space of relevant situations, not just the situations that motivated the skill.

---

## Content Pruning

Skills need iteration after creation. The initial version reflects what the author thought was important — post-deployment evidence reveals what actually helps.

**Prune by evidence, not intuition.** Removing content because it "feels redundant" produces a lighter skill that may work worse. The signals that justify pruning are concrete: benchmark scores that don't improve when a section is present, transcript reviews that show agents ignoring a section entirely, content that duplicates what the codebase already demonstrates.

**Benchmark signal:** If a section's presence or absence doesn't move skill evaluation scores, it's not contributing. Inert content occupies context without producing value — that's a net negative because it dilutes the sections that do contribute.

**Transcript signal:** If agents consistently skip a section in their reasoning (visible in transcript review), the section isn't being integrated. It might be positioned poorly, framed wrong, or genuinely unnecessary. Either fix it or remove it.

**Duplication signal:** If the content is already visible in the codebase, a skill section describing it creates a second source of truth that will drift. Point to the codebase instead.

**Remove wasted effort at the source.** If transcripts show agents spending significant effort on something a skill instruction prompted — and that effort isn't producing value — the instruction is creating waste. Fix the instruction or remove it. Inert effort in agent transcripts is the symptom; an overspecified skill is usually the cause.

---

## Common Failure Patterns

**Skill too abstract to act on.** Principles so high-level they don't constrain anything. "Write clear documentation" could justify any approach. The test: given this skill, would two agents make the same decision in the same situation? If not, the skill isn't specific enough.

**Vague description triggers wrong prompts.** A description that captures the skill's topic but not its trigger surface loads on tangentially related tasks. The agent gets context it didn't need, displacing context it did need. Revisit descriptions whenever a skill is loading for unexpected prompts.

**Description too narrow, misses real use cases.** The inverse: a description that matches only the core case and fails to load for legitimate adjacent situations. Agents work without knowledge they should have, producing output the skill would have improved. Monitor for cases where the skill should have loaded but didn't.

**Constraint overload produces rigid compliance.** A skill with many specific constraints produces agents that check constraints rather than reason. The more constraints, the more the agent's attention goes to compliance rather than the actual problem. Prune to the constraints that carry the most signal.

**Overfitting to test prompts.** Skills refined by testing against the same small set of prompts get sharper for those prompts and weaker for everything else. The description becomes calibrated to the test set; the content becomes optimized for the scenarios used during authoring. Diversity in test scenarios is the only protection.

**Verbose content causes skimming.** A long skill gets skimmed. Key constraints buried in the middle of dense paragraphs are missed. Agents allocate reading effort proportionally — a shorter skill with sharper content gets more careful attention than a long skill where the important parts have to compete with filler.
