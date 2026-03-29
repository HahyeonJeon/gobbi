# Gotcha: gobbi-claude

Mistakes in writing `.claude/` documentation. These cause agents to produce rigid, templated output instead of thinking.

---

### Code examples in .claude/ docs

**Priority:** High

**What happened:** Skills and agent definitions contained Python, TypeScript, YAML, and bash code blocks. Agents copied these examples verbatim into their implementations without adapting to the actual context. The code was used as a template rather than understood as a pattern.

**User feedback:** "Claude docs must not contain code examples — agents blindly copy them instead of thinking."

**Correct approach:** State principles and constraints. Point agents to read existing code in the codebase for patterns. The codebase is the single source of truth — docs that mirror code become stale and misleading.

---

### Step-by-step recipes in teaching docs

**Priority:** High

**What happened:** Skills contained numbered step-by-step procedures (Step 1, Step 2, Step 3). Agents followed the steps rigidly, skipping steps that mattered in context and adding steps that didn't. When the procedure didn't perfectly match the situation, agents either forced the procedure or got stuck.

**User feedback:** Agents should understand the principle and make their own plan, not follow a script. But orchestration flows and agent definitions need ordered sequences — the problem is step-by-step in teaching docs, not step-by-step everywhere.

**Correct approach:** In teaching docs (skills, rules, project docs): describe what needs to be true (principles, constraints, quality gates), not how to get there. Let the agent plan based on the actual task. In orchestration flows and agent definitions: ordered sequences are appropriate when a specific sequence must be followed exactly and deviation causes failure.

---

### BAD/GOOD comparison blocks

**Priority:** Medium

**What happened:** Documentation used BAD/GOOD side-by-side comparison blocks to illustrate patterns. Agents memorized the GOOD block as a mandatory template and applied it even when the context called for a different approach.

**User feedback:** Agents misunderstand or just mimic instead of understanding the principles.

**Correct approach:** State the constraint ("never do X because Y") without showing BAD/GOOD examples. The constraint gives the agent a boundary; the BAD/GOOD gives it a template to copy.
