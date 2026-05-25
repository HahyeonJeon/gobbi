# Usage Perspective — W0-core Execution Evaluation (iter1, claude)

**Lens:** Can an agent actually find, load, and apply rules.md? Is the standard actionable?

---

## Frame (Stage 1)

**Scenario 1:** An agent following a delegation template can load rules.md via its Load Directives.
**Scenario 2:** The symlink resolves from the `.claude/skills/` surface (the agent's normal load path).
**Scenario 3:** A future agent reading rules.md can determine: (a) which naming mode to apply to a given file, (b) what frontmatter to include, (c) where to write a given file type.
**Scenario 4:** The cross-references in rules.md point to real, accessible documents.
**Scenario 5 (adversarial):** The symlink is broken (absolute path, or wrong relative depth).
**Scenario 6 (adversarial):** The delegation wiring instruction is conditional enough that agents omit loading rules.md in exactly the cases it's needed.

---

## Evaluation (Stage 2)

### Scenario 1: Load path via delegation templates

**Checklist:**
- [x] `leader.md` tier 3 Skills: `memorization/rules.md` line present with clear conditional ("mandatory when the delegation writes or evaluates project memory")
- [x] `executor.md`: same, correct
- [x] `assistant.md`: same, correct
- [x] `evaluator.md`: `memorization/rules.md` line present with evaluator-specific condition ("load when evaluating project-memory artifacts against the standard")
- [x] `delegation/SKILL.md`: "Project-memory standard gate" paragraph explains WHY (drift recurs without it) and WHAT (the gate condition)

### Scenario 2: Symlink resolves

**Checklist:**
- [x] `readlink -f` in worktree resolves to the canonical file (verified)
- [x] The symlink depth is correct: 3 levels up from `.claude/skills/memorization/` = worktree root
- [x] The canonical file exists and contains content (131 lines, verified)

### Scenario 3: Rules are actionable

**Checklist:**
- [x] Naming mode determination: temporal split table in §1.2 has clear two-row structure (Date-prefixed / Bare-slug) with all 13 types listed
- [x] Anti-pattern blocklist: 12 forbidden patterns with bad-example + fix columns — directly actionable
- [x] Frontmatter base: YAML block in §2.1 is copy-pasteable
- [x] Scope determination: §3 structure rules list project-only / feature-only / both with explicit type assignment
- [x] Staging-field stripping: §2.3 explicitly names which fields to strip (`mistake-candidate`, `finding-id`, `disposition`, `promoted-from`, `promoted-at`)

### Scenario 4: Cross-references valid

**Checklist:**
- [x] `[memory-map.md](memory-map.md)` — sibling file exists, confirmed by `ls memorization/`
- [x] `[SKILL.md](SKILL.md)` — memorization/SKILL.md exists in same dir
- [x] `[wrap-up/SKILL.md](../wrap-up/SKILL.md)` — wrap-up/SKILL.md exists, confirmed by skill dir listing
- [x] `[evaluation/SKILL.md § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy)` — anchor at line 386, confirmed by grep

**Note:** memory-map.md does NOT yet have a back-reference to rules.md (that update is W0-rest / §7 #3 deferred). This creates a single-direction reference: rules.md → memory-map.md but not the reverse. An agent loading ONLY memory-map.md would not be pointed to rules.md. However, this is a KNOWN DEFERRED item per the commit message and task scope, not an oversight.

### Scenario 5 (adversarial): Broken symlink

Symlink is relative and resolves. PASS.

### Scenario 6 (adversarial): Conditional too loose

**Observation:** The condition "mandatory when the delegation writes or evaluates project memory" is clear but relies on the briefing manager to recognize when a delegation "touches project memory." This is not a gap introduced by the executor — it is the correct design (the alternative, loading rules.md for ALL delegations, would be noise for non-memory tasks).

---

## Finding

**Low / docs-sync / Confidence: 75 / Disposition: open:**
The `memory-map.md` does not yet have a back-reference to rules.md (W0-rest deferred). An agent loading only memory-map.md for naming guidance would not discover the new consolidated rules.md standard. This is correctly deferred per scope decision, but worth flagging for W0-rest priority.

**Verdict contribution: PASS**
