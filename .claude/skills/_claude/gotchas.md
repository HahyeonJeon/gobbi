# Gotcha: _claude

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

---

### Blockquote contains full description instead of just the principle point
---
priority: medium
---

**Priority:** Medium

**What happened:** Core principle sections used blockquotes (`>`) that contained both the bold principle and the full description on the same quoted line. This made the description part of the "principle" visually and semantically, blurring the distinction between the point and its explanation.

**User feedback:** Blockquotes should only hold the bold principle point. The description goes on a separate non-quoted line below.

**Correct approach:** Use `> **Principle statement.**` on its own line. Put the explanation on a separate non-quoted paragraph below. The blockquote highlights the point; the description explains it.

---

### Referencing internal (`__`) names in non-internal docs
---
priority: high
---

**Priority:** High

**What happened:** A hidden skill (`_plan`) referenced an internal agent (`__pi`) by name. Internal names (double underscore prefix) are implementation details for gobbi contributors — they should not appear in hidden or interface tier docs that end users and workflow agents read.

**User feedback:** "Never use internal skills or internal agents like `__pi`."

**Correct approach:** Hidden (`_`) and interface (no prefix) docs must never reference internal (`__`) names. Use generic terms instead — "research agents" not "`__pi`", "validation tooling" not "`__validate`". Internal names leak implementation details and create coupling between tiers that should be independent.

---

### Editing .md files directly instead of editing .json and running json2md
---
priority: high
---

**Priority:** High

**What happened:** When updating `.claude/` documentation, agents edited the `.md` file directly instead of editing the `.json` source file and regenerating with `gobbi docs json2md`. This happened during the CLI migration when updating gotcha files and skill docs. Subagents were also instructed to edit `.md` directly in delegation prompts.

**User feedback:** "You and other agent must edit json and create .md file using gobbi-cli, not directly write the .md files."

**Correct approach:** Always edit the `.json` source file, then run `gobbi docs json2md <path-to-json>` to regenerate the `.md`. Never edit `.md` directly — the next `json2md` run will overwrite the manual change. This applies to all `.claude/` docs except `CLAUDE.md` (which is hand-authored). The orchestrator must include this constraint in every delegation prompt that touches `.claude/` docs.
