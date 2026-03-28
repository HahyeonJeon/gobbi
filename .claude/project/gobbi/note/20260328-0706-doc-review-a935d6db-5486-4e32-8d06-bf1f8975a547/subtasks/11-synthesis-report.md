# Documentation Review: Synthesis Report

Comprehensive audit of gobbi's 53 `.claude/` documentation files across two tracks: internal consistency against gobbi-claude standards (Section 1) and comparison with GSD v1/v2 (Section 2).

---

## 1. Executive Summary

Reviewed 53 files across 17 SKILL.md files, 5 agent definitions, 9 design docs, 13 gotcha files, 4 gobbi-claude child docs, and 5 root/project docs. The core documentation is structurally sound — skills follow the principles-over-procedures pattern, agents have clear identities, and the evaluation framework is well-specified. However, the audit found **3 blocking findings** (2 empty stubs, 1 stale design doc with wrong skill names), **8 important findings** (frontmatter mismatches, anti-pattern violations in code blocks, CLAUDE.md referencing deprecated tool names, missing project subdirectory READMEs), and **6 minor findings**. GSD comparison identified 5 prompt-achievable improvements and 3 that need infrastructure work.

---

## 2. Section 1: Internal Consistency Findings

### Blocking

**B1. gobbi-hack/SKILL.md is empty (0 bytes)**
- File: `.claude/skills/gobbi-hack/SKILL.md`
- Standard violated: Every SKILL.md must have frontmatter (name, description, allowed-tools) and content (gobbi-claude/skills.md)
- Evidence: `wc -l` returns 0. The file is referenced in gobbi/SKILL.md skill map as "User override layer. Patch files that modify core skill behavior without touching core files." and described extensively in design/hacks.md, but the skill itself is completely unimplemented.
- Remediation: Write SKILL.md with frontmatter and content describing how the hack system works operationally — how patches are loaded, how to generate them, and what constraints apply. The design doc (hacks.md) has the design; the skill needs the agent-facing operational guidance.

**B2. gobbi-planner.md is empty (0 bytes)**
- File: `.claude/agents/gobbi-planner.md`
- Standard violated: Every agent definition must have frontmatter (name, description, tools) and a "Before You Start" section (gobbi-claude/agents.md)
- Evidence: `wc -l` returns 0. The agent is listed in design/agents.md and design/architecture.md as part of the agent roster. The gobbi-plan skill exists and is fully written, but the planner agent that uses it has no definition.
- Remediation: Write agent definition with identity, tools, "Before You Start" section, lifecycle, quality expectations, and out-of-scope boundaries. Model on gobbi-pi.md structure.

**B3. distribution.md references renamed/non-existent skills**
- File: `.claude/project/gobbi/design/distribution.md`
- Standard violated: No stale references to removed code or outdated architecture (gobbi-claude/project.md anti-pattern)
- Evidence: Lines 100, 107-108 reference `gobbi-orchestrate/`, `gobbi-task/`, and `gobbi-task-evaluation/` — these skills were renamed to `gobbi-orchestration/`, `gobbi-execution/`, and `gobbi-execution-evaluation/`. The file also lists agent filenames as `orchestrator.md`, `planner.md`, `executor.md`, `evaluator.md` (lines 94-97) — the actual files are `gobbi-pi.md`, `gobbi-planner.md`, `gobbi-evaluator-positive.md`, `gobbi-evaluator-moderate.md`, `gobbi-evaluator-critical.md`.
- Remediation: Update the "What Gets Installed" tree to match actual file names. This is the most stale document in the project.

---

### Important

**I1. Frontmatter `name` does not match directory name in 3 skills**
- Files: `gobbi-claude/SKILL.md` (name: `claude`), `gobbi-delegation/SKILL.md` (name: `delegate`), `gobbi-execution/SKILL.md` (name: `task`)
- Standard violated: gobbi-claude/skills.md states "Required: `name` (matches directory)"
- Evidence: `gobbi-plan/SKILL.md` also uses `name: plan` instead of `gobbi-plan`, but the gobbi-claude standard says "matches directory" which would require `gobbi-plan`. However, gobbi-execution's mismatch is the most severe — directory is `gobbi-execution` but name is `task`, a completely different word reflecting pre-rename state.
- Remediation: Decide on naming convention (with or without `gobbi-` prefix) and apply consistently. At minimum, `gobbi-execution` must not be named `task`.

**I2. gobbi-notification/SKILL.md at 335 lines with 10 code blocks**
- File: `.claude/skills/gobbi-notification/SKILL.md`
- Standard violated: Must stay under 500 lines (passes), should target under 200 (fails at 335). Must avoid code examples (gobbi-claude anti-pattern).
- Evidence: Contains JSON config examples (lines 196-207, 243-323), bash script content (lines 167-179), and shell commands. This is 10 code blocks total.
- Classification: **Exception candidate** rather than pure violation. gobbi-notification is a utility skill that configures infrastructure (hooks, scripts, settings.json). The code blocks serve as templates for what gobbi writes into the user's project, not as examples for agents to mimic in their own work. The distinction is: notification code blocks are the *deliverable specification*, not *implementation guidance*.
- Remediation: Consider decomposing into hierarchy — SKILL.md covers the mental model and setup flow, child docs cover channel-specific configs and hook script specs. This would bring SKILL.md under 200 lines while keeping code blocks in focused child docs.

**I3. gobbi-collection/SKILL.md and gobbi-note/SKILL.md contain directory tree code blocks**
- Files: `.claude/skills/gobbi-collection/SKILL.md` (2 code blocks), `.claude/skills/gobbi-note/SKILL.md` (4 code blocks)
- Standard violated: Must avoid code examples (gobbi-claude anti-pattern)
- Evidence: Both files use markdown code blocks to show directory structures and README templates. gobbi-note also has an example README table.
- Classification: **Should-avoid violation**. Directory tree diagrams are borderline — they describe structure, not implementation code. The README table example in gobbi-note is the more concerning pattern (agents may copy the exact table format rather than adapting).
- Remediation: Convert directory trees to descriptive text or tables. Remove the README table example and describe the required fields instead.

**I4. CLAUDE.md references `TodoWrite` — deprecated tool name**
- File: `.claude/CLAUDE.md` (line 37)
- Standard violated: Internal consistency — the rest of gobbi uses `TaskCreate`/`TaskUpdate` (gobbi-orchestration/SKILL.md line 15)
- Evidence: CLAUDE.md says "track them with TodoWrite" while gobbi-orchestration says "create a checklist using TaskCreate". `TodoWrite` is a deprecated Claude Code tool name; the current tool is `TaskCreate`/`TaskUpdate`/`TaskGet`/`TaskList`.
- Remediation: Replace `TodoWrite` with `TaskCreate` in CLAUDE.md. Also update design/state.md line 47 which references "Claude Code's TodoWrite".

**I5. hacks.md references renamed skills**
- File: `.claude/project/gobbi/design/hacks.md`
- Standard violated: No stale references (gobbi-claude/project.md anti-pattern)
- Evidence: Lines 55-60 reference `gobbi-orchestrate` and `gobbi-task-evaluation` in the isolation model code block. These were renamed to `gobbi-orchestration` and `gobbi-execution-evaluation`.
- Remediation: Update the code block to use current skill names.

**I6. design/architecture.md contains code blocks showing directory trees**
- File: `.claude/project/gobbi/design/architecture.md`
- Standard violated: Should avoid code blocks in docs (gobbi-claude anti-pattern)
- Evidence: 6 code block markers — directory tree (lines 7-37), layer model ASCII art (lines 79-96), and CLAUDE.md management markers (lines 100-111).
- Classification: **Should-avoid violation** for design docs. Architecture docs benefit from visual structure, but the anti-pattern risk is real for the CLAUDE.md marker example (agents may copy it literally).
- Remediation: Keep directory tree and layer model (structural diagrams, low mimicry risk). Convert the CLAUDE.md marker example to descriptive text.

**I7. Project subdirectories referenced in README.md don't have READMEs**
- Files: `.claude/project/gobbi/rules/`, `.claude/project/gobbi/gotchas/`, `.claude/project/gobbi/reference/`, `.claude/project/gobbi/docs/`
- Standard violated: "Every directory has a README.md as entry point" (gobbi-claude/project.md)
- Evidence: All four directories exist but are empty — no README.md files. The project README.md links to them as if they contain content.
- Remediation: Either add minimal README.md files explaining the directory purpose (even if empty of content), or remove the directories and links until they have content. Empty directories with no README violate the stated standard.

**I8. 10 of 13 gotcha files are empty (0 bytes)**
- Files: `gobbi-gotcha/gobbi-collection.md`, `gobbi-delegation.md`, `gobbi-discuss.md`, `gobbi-evaluation.md`, `gobbi-execution.md`, `gobbi-hack.md`, `gobbi-ideation.md`, `gobbi-note.md`, `gobbi-notification.md`, `gobbi-plan.md`
- Standard violated: Not a standard violation per se — empty gotcha files are placeholder stubs for future entries.
- Classification: **Empty stubs** — functional but cosmetic. The SKILL.md index lists all 13 files, and agents will Read them and find nothing, which is harmless. However, having 10 empty files alongside 3 populated ones could confuse agents about whether they should expect content.
- Remediation: Either add a one-line "No gotchas recorded yet." to each empty file, or remove the empty files and let agents create them when the first gotcha is recorded. The gotcha SKILL.md index would need updating either way.

---

### Minor

**M1. gobbi-plan/SKILL.md references EnterPlanMode/ExitPlanMode — non-existent tools**
- File: `.claude/skills/gobbi-plan/SKILL.md`
- Evidence: Lines 15, 17, 27, 31, 82, 84 reference `EnterPlanMode` and `ExitPlanMode`. These are not real Claude Code tools. Claude Code has `plan` mode but not explicit mode-switch tools.
- Remediation: Replace with actual Claude Code planning mechanism or remove the mode-switch references and describe planning as a structural approach (explore with read-only tools, then present plan for approval).

**M2. Inconsistent skill naming in gobbi-claude/skills.md example list**
- File: `.claude/skills/gobbi-claude/skills.md`
- Evidence: Line 21 lists example skills including `orchestrate`, `eye`, `git` — these don't match actual gobbi skill names (`gobbi-orchestration`, not `orchestrate`). The list is meant as generic examples, but mixing real and hypothetical names creates ambiguity.
- Remediation: Either use all actual gobbi skill names or all clearly hypothetical names.

**M3. gobbi-evaluation/SKILL.md has `Agent` in allowed-tools but evaluators are read-only**
- File: `.claude/skills/gobbi-evaluation/SKILL.md`
- Evidence: `allowed-tools: Read, Grep, Glob, Bash, Agent, AskUserQuestion`. The evaluation skill is loaded by the orchestrator (which needs Agent to spawn evaluator agents), not by evaluators themselves. This is technically correct but the tool scope appears broader than needed for evaluation.
- Remediation: This is likely correct — the orchestrator loads this skill to know HOW to run evaluation, including spawning agents. No change needed, but a comment in the frontmatter would clarify intent.

**M4. GOBBI.md and CLAUDE.md partially duplicate core principles**
- Files: `.claude/GOBBI.md`, `.claude/CLAUDE.md`
- Evidence: Both files state principles about discussion-first, detail, and adaptive workflow. GOBBI.md adds "No study required" and "Adaptive flow"; CLAUDE.md adds the full ideate-evaluate-improve cycle and gotcha principle.
- Remediation: GOBBI.md serves as the project identity doc (loaded by users/agents to understand what gobbi IS), while CLAUDE.md serves as the operational mandate (loaded every session). The overlap on "discuss first" and "detail" is minor but should be noted. Consider having GOBBI.md reference CLAUDE.md for operational details instead of restating them.

**M5. gobbi/SKILL.md description says "Loads agent principles and skill map" but doesn't actually load them**
- File: `.claude/skills/gobbi/SKILL.md`
- Evidence: The description says it "loads agent principles and skill map" but the body says "You must load gobbi-orchestration, gobbi-gotcha, and gobbi-claude skills immediately after this skill." The loading is a directive to the agent, not automatic. The description implies automatic loading.
- Remediation: Adjust description to "Entry point for the gobbi harness. MUST load at session start, session resume, and after compaction. Directs loading of orchestration, gotcha, and claude skills."

**M6. Design docs lack a README.md index**
- File: `.claude/project/gobbi/design/` (directory)
- Standard violated: "Every directory has a README.md as entry point" (gobbi-claude/project.md)
- Evidence: The design/ directory has 9 .md files but no README.md to index them. The project README.md links to "design/" but agents navigating into the directory must read all files to understand what's available.
- Remediation: Add README.md listing each design doc with a one-line description.

---

### Compliant

The following files pass the gobbi-claude standards with no findings:

**Skills (fully compliant):**
- `gobbi-orchestration/SKILL.md` — Clear principles, constraints section, no code blocks, 129 lines
- `gobbi-discuss/SKILL.md` — Principles-first, AskUserQuestion-driven, 68 lines
- `gobbi-ideation/SKILL.md` — Discussion points as menu, not procedure, 95 lines
- `gobbi-evaluation/SKILL.md` — 3-stance model well-specified, 112 lines
- `gobbi-ideation-evaluation/SKILL.md` — Criteria-based, stance-specific focus, 61 lines
- `gobbi-plan-evaluation/SKILL.md` — Criteria-based, stance-specific focus, 59 lines
- `gobbi-execution-evaluation/SKILL.md` — Criteria-based, stance-specific focus, 62 lines
- `gobbi-gotcha/SKILL.md` — Clear structure, where/when/how, 75 lines

**Agents (fully compliant):**
- `gobbi-pi.md` — Identity-first, "Before You Start" section, lifecycle, out of scope, 81 lines
- `gobbi-evaluator-positive.md` — Clear stance, lifecycle, verdicts, 60 lines
- `gobbi-evaluator-moderate.md` — Clear stance, lifecycle, verdicts, 61 lines
- `gobbi-evaluator-critical.md` — Clear stance, lifecycle, verdicts, 67 lines

**Gotcha files (populated, compliant):**
- `gobbi-gotcha/gobbi-claude.md` — 3 entries, proper format, 39 lines
- `gobbi-gotcha/gobbi-orchestration.md` — 7 entries, proper format, 87 lines
- `gobbi-gotcha/gobbi-system.md` — 2 entries, proper format, 27 lines

**gobbi-claude child docs (fully compliant):**
- `gobbi-claude/skills.md` — Clear categories, patterns, anti-patterns, checklist
- `gobbi-claude/agents.md` — Identity-first, lifecycle, review checklist
- `gobbi-claude/rules.md` — Verifiability emphasis, anti-patterns
- `gobbi-claude/project.md` — Directory structure, naming, lifecycle

**Design docs (compliant, noting code blocks as should-avoid):**
- `design/workflow.md` — Clean, matches orchestration skill
- `design/evaluation.md` — Matches evaluation skill
- `design/agents.md` — Matches agent definitions
- `design/state.md` — Clear state categories
- `design/vision.md` — Concise differentiators
- `design/gsd-analysis.md` — Thorough adopt/adapt/reject analysis

---

## 3. Section 2: GSD Comparison Findings

### Dimension 1: State and Context Engineering

**Sub-topics analyzed:** Session continuity, context budget management, state persistence, handoff mechanisms.

**Key gaps:**

1. **No explicit context budget management** (needs-infrastructure)
   - GSD monitors context usage (10-15% orchestrator target) and triggers compaction or agent spawning when context fills. Gobbi has no equivalent mechanism.
   - Current state: Gobbi relies on Claude Code's built-in compaction. The PostCompact hook (`reload-gobbi.sh`) reloads gobbi after compaction, but there's no proactive context monitoring.
   - Gap severity: Medium. Context rot is acknowledged as GSD's core insight and gobbi adopts fresh-context-per-agent, but has no instrumentation to detect when context is getting heavy.
   - Improvement: A hack patch or hook that monitors token usage and triggers early compaction or warns the orchestrator. Needs Claude Code to expose context usage metrics (not currently available via hooks).

2. **No formal handoff mechanism for session breaks** (prompt-achievable)
   - GSD uses HANDOFF.json for session continuity. Gobbi's design/state.md describes a "context" category that should be "Updated at significant milestones... reflects current state, not history" but no skill or agent actually implements writing or reading this context file.
   - Current state: The work trail (notes) partially serves this purpose, but there's no explicit "where we are right now" document that a new session reads first.
   - Gap severity: Low-medium. The note system preserves history, but a resuming session must reconstruct current state from multiple note files rather than reading one context summary.
   - Improvement: Add a `context.md` write step to gobbi-collection that summarizes current project state. The orchestrator reads it on session start.

3. **Project gotchas directory exists but has no mechanism to populate it** (prompt-achievable)
   - GSD has per-phase research and learning persistence. Gobbi has cross-project gotchas (gobbi-gotcha/) and references project-specific gotchas in `.claude/project/{name}/gotchas/`, but no skill or agent has instructions for writing project-specific gotchas vs cross-project ones.
   - Current state: gobbi-gotcha SKILL.md mentions the distinction ("Project-specific → `.claude/project/gotchas/{category}.md`") but no workflow step routes gotcha recording to the project directory.
   - Improvement: Add routing logic to gobbi-gotcha — when recording a gotcha, determine if it's project-specific or cross-project and write to the appropriate location.

### Dimension 2: Agent Architecture

**Sub-topics analyzed:** Specialization, dispatch, tool permissions, agent roster.

**Key gaps:**

1. **No dedicated executor agent definition** (prompt-achievable)
   - GSD has specialized executor agents per domain. Gobbi has the gobbi-execution skill but no executor agent definition in `.claude/agents/`. Execution is handled by generic subagents that load the execution skill.
   - Current state: The delegation skill tells the orchestrator to "spawn specialists" but doesn't define what a generic executor looks like.
   - Gap severity: Low. The skill-based approach works — the execution skill teaches any agent how to execute. But a default executor agent definition would provide consistent tool scoping and lifecycle.
   - Improvement: Consider adding `gobbi-executor.md` as a default executor agent, or document that execution agents are intentionally skill-defined rather than agent-defined.

2. **Planner agent is empty** (prompt-achievable, overlaps with B2)
   - GSD has a dedicated planner with specific capabilities. Gobbi's planner agent file exists but is empty.
   - See B2 above. The gobbi-plan skill exists and is complete, but the agent that uses it is undefined.

3. **No model specification on evaluator or planner agents** (prompt-achievable)
   - gobbi-pi specifies `model: opus`. The three evaluator agents and planner agent have no model specification.
   - GSD allows model profiles per agent type. Without model specification, evaluators default to whatever model the session uses, which may be less capable for critical evaluation.
   - Improvement: Consider adding `model:` field to evaluator agents, at least for the critical evaluator where reasoning depth matters most.

### Dimension 3: Quality Gates and Verification

**Sub-topics analyzed:** Verification rigor, plan checking, regression testing, evaluation criteria.

**Key gaps:**

1. **No automated verification step in execution** (needs-infrastructure)
   - GSD runs automated checks (tests, linting, type checking) as part of verification. Gobbi's execution skill says "Do existing tests still pass?" and "Run tests if applicable" but has no mechanism to enforce this.
   - Current state: Verification is advisory — the skill tells agents to check, but nothing enforces it. An agent can skip verification and still report success.
   - Gap severity: Medium. For code-producing tasks, verification without enforcement is aspiration, not a gate.
   - Improvement: Add a PostToolUse hook that runs project test suite after Write/Edit operations. Or add verification as an explicit step in the evaluation skill that evaluators must check for evidence of.

2. **No regression detection across tasks** (needs-infrastructure)
   - GSD tracks what each task changed and can detect when a later task breaks an earlier task's work. Gobbi has no equivalent.
   - Current state: Per-task evaluation catches issues within a task, but cross-task regression (task 5 breaks what task 3 built) is not systematically detected.
   - Improvement: Add a verification step after each wave that runs the full test suite and compares against the pre-wave baseline.

3. **Evaluation criteria don't reference test evidence** (prompt-achievable)
   - gobbi-execution-evaluation asks "Tests pass?" but doesn't require the evaluator to actually see test output. An evaluator could check "yes" based on the subtask doc's claim without verifying.
   - Improvement: Add to execution evaluation criteria: "Evaluator must read test output or verify test commands were run, not rely on the executor's self-report."

### Dimension 4: Workflow Automation and Resilience

**Sub-topics analyzed:** Auto-advance, recovery from failures, stuck detection, error handling.

**Key gaps:**

1. **No stuck detection or timeout mechanism** (needs-infrastructure)
   - GSD detects when agents are stuck (looping, not making progress) and can intervene. Gobbi has no equivalent.
   - Current state: If a subagent gets stuck, the orchestrator waits indefinitely. The 3-revision-cycle limit in evaluation is the closest thing to a circuit breaker.
   - Improvement: Could be partially addressed with a hook that monitors subagent duration and notifies the user if a task exceeds a threshold.

2. **No error recovery strategy** (prompt-achievable)
   - GSD has node repair strategies for when tasks fail. Gobbi's orchestration skill says "After each subtask completes, spawn a separate evaluator" but doesn't address what happens when a subtask crashes, times out, or produces no output.
   - Improvement: Add a "When things go wrong" section to gobbi-orchestration covering: subagent crash recovery, partial output handling, and when to retry vs escalate.

3. **No workflow persistence for crash recovery** (needs-infrastructure)
   - GSD can resume a workflow from the last completed step. Gobbi's notes record what happened, but there's no mechanism to automatically resume a workflow if the session crashes mid-execution.
   - Current state: If a session crashes during Step 3 (execution), a new session must manually determine which subtasks completed and which didn't.
   - Improvement: Write a `progress.md` to the task directory after each subtask completes, listing completed and remaining tasks. The orchestrator checks this on session start.

### Dimension 5: Documentation and Planning Structure

**Sub-topics analyzed:** Doc organization, templates, decomposition methodology, cross-referencing.

**Key gaps:**

1. **Design docs and skills partially duplicate content** (prompt-achievable)
   - design/workflow.md duplicates gobbi-orchestration/SKILL.md content. design/evaluation.md duplicates gobbi-evaluation/SKILL.md content. design/agents.md duplicates agent definitions.
   - Current state: The design docs appear to be the "design phase" artifacts that were later implemented as skills. Both exist without clear relationship.
   - Gap severity: Low-medium. Design docs should describe *why* decisions were made; skills describe *what* to do. Currently both describe *what*.
   - Improvement: Refactor design docs to focus on rationale, trade-offs, and rejected alternatives. Skills handle the operational content. Add a note at the top of each design doc: "This doc explains design decisions. For operational guidance, see [skill name]."

2. **No cross-reference system between docs** (prompt-achievable)
   - GSD uses explicit cross-references between related docs. Gobbi's docs occasionally reference each other but have no systematic cross-referencing.
   - Current state: gobbi-claude establishes "Navigate deeper from here:" as a pattern, but only gobbi-claude/SKILL.md itself uses it. No other multi-file skill or design doc uses this pattern.
   - Improvement: Add "Navigate deeper from here:" tables to gobbi-gotcha/SKILL.md (which has 13 child files) and consider adding "Related:" links between design docs and their corresponding skills.

3. **gobbi-collection and gobbi-note overlap significantly** (prompt-achievable)
   - Both skills describe where notes go, the directory structure, and naming conventions. gobbi-collection says "Load gobbi-note" but then repeats most of gobbi-note's content.
   - Improvement: gobbi-collection should focus on the collection *workflow* (what to do at Step 4) and defer all note-writing details to gobbi-note. Remove the duplicated directory structure from gobbi-collection.

---

## 4. Cross-References

Where Section 1 findings align with Section 2 GSD improvement opportunities:

| S1 Finding | S2 Finding | Connection |
|------------|------------|------------|
| B1: gobbi-hack is empty | S2-D5: GSD config system | gobbi-hack is gobbi's answer to GSD's config.json. The empty skill means gobbi's 3rd differentiator ("safe hacking") is entirely unimplemented. GSD's config system shows what a customization layer needs operationally. |
| B2: gobbi-planner is empty | S2-D2: No executor agent | Both empty agent definitions point to incomplete agent roster. GSD has 18 specialized agents; gobbi's stated "4 core roles" has 2 of 4 undefined. |
| I4: CLAUDE.md references TodoWrite | S2-D4: No workflow persistence | Both relate to state tracking gaps. TodoWrite is deprecated, TaskCreate is current, and neither has persistence beyond the session. GSD persists task state to files. |
| I1: Frontmatter name mismatches | S2-D5: No cross-reference system | Name inconsistency makes cross-referencing harder. If `gobbi-execution` is called `task` in frontmatter, any cross-reference system would need to handle aliases. |
| B3/I5: Stale references in distribution.md/hacks.md | S2-D5: Design docs duplicate skills | The staleness exists because design docs were written during design phase and never updated when skills were renamed during implementation. If design docs focused on rationale (not operational detail), they wouldn't go stale when skill names change. |
| I8: 10 empty gotcha files | S2-D1: No project gotcha routing | Both relate to the gotcha system being partially built. Cross-project gotcha files are mostly empty, and the mechanism for project-specific gotchas is described but not implemented. |

---

## 5. Prioritized Top Findings

Ranked by severity, then actionability, then impact on agent behavior.

| Rank | ID | Severity | Actionability | Finding | Impact |
|------|-----|----------|--------------|---------|--------|
| 1 | B1 | Blocking | Prompt-achievable | gobbi-hack/SKILL.md is empty — gobbi's 3rd differentiator unimplemented | Agents have no guidance for the hack system; users cannot customize behavior |
| 2 | B2 | Blocking | Prompt-achievable | gobbi-planner.md is empty — planner agent undefined | Orchestrator cannot dispatch planning tasks to a defined agent |
| 3 | B3 | Blocking | Prompt-achievable | distribution.md references 3+ renamed skills and wrong agent filenames | Any agent reading distribution.md gets wrong file paths and skill names |
| 4 | I1 | Important | Prompt-achievable | 3 SKILL.md files have frontmatter `name` not matching directory | Auto-invocation and skill loading may fail; `gobbi-execution` named `task` is most confusing |
| 5 | I4 | Important | Prompt-achievable | CLAUDE.md references TodoWrite (deprecated) instead of TaskCreate | Every session loads CLAUDE.md; agents may try to call a non-existent tool |
| 6 | I5 | Important | Prompt-achievable | hacks.md references renamed skills in code examples | Agents generating hack patches would target non-existent skills |
| 7 | I7 | Important | Prompt-achievable | 4 project subdirectories have no README.md | Violates gobbi-claude standard; agents navigating project/ find empty directories |
| 8 | S2-D4.2 | Important | Prompt-achievable | No error recovery strategy in orchestration | Subagent failures have no defined handling — orchestrator behavior undefined |
| 9 | I2 | Important | Prompt-achievable | gobbi-notification at 335 lines with 10 code blocks | Exception candidate, but decomposition into hierarchy would improve it |
| 10 | S2-D1.2 | Important | Prompt-achievable | No session handoff mechanism despite design doc describing one | Session resume relies on manual reconstruction from notes |
| 11 | M1 | Minor | Prompt-achievable | gobbi-plan references non-existent EnterPlanMode/ExitPlanMode tools | Agents may try to call these tools and fail |
| 12 | S2-D3.1 | Medium | Needs-infrastructure | No automated test verification in execution | Verification is advisory only, no enforcement |
| 13 | S2-D1.1 | Medium | Needs-infrastructure | No context budget monitoring | Gobbi acknowledges context rot but has no detection mechanism |
| 14 | S2-D5.1 | Minor | Prompt-achievable | Design docs and skills duplicate operational content | Maintenance burden; design docs go stale (proven by B3/I5) |
| 15 | S2-D5.3 | Minor | Prompt-achievable | gobbi-collection and gobbi-note overlap significantly | Redundant content increases context load without benefit |

---

## 6. Summary Statistics

### Files by Status

| Status | Count | Files |
|--------|-------|-------|
| Compliant | 32 | 8 skills, 4 agents, 3 gotcha files, 4 gobbi-claude children, 6 design docs (content-compliant), GOBBI.md, project README, note README, 4 remaining design docs |
| Violation | 8 | B3 distribution.md, I1 (3 skills), I4 CLAUDE.md, I5 hacks.md, I3 (2 skills with code blocks) |
| Exception candidate | 1 | I2 gobbi-notification/SKILL.md |
| Empty stub | 12 | B1 gobbi-hack/SKILL.md, B2 gobbi-planner.md, I8 (10 empty gotcha files) |
| Stale | 2 | B3 distribution.md, I5 hacks.md |

### Section 1 Findings by Severity

| Severity | Count |
|----------|-------|
| Blocking | 3 |
| Important | 8 |
| Minor | 6 |

### Section 2 Gaps by Feasibility

| Feasibility | Count | Examples |
|-------------|-------|----------|
| Prompt-achievable | 8 | Session handoff, error recovery strategy, evaluation criteria strengthening, doc deduplication, gotcha routing, cross-references |
| Needs infrastructure | 5 | Context budget monitoring, automated test verification, regression detection, stuck detection, workflow crash recovery |

### Total Documentation

| Category | Files | Total Lines |
|----------|-------|-------------|
| SKILL.md files | 17 | 1,739 (including 0-line stub) |
| Agent definitions | 5 | 269 (including 0-line stub) |
| Design docs | 9 | 794 |
| Gotcha files | 13 | 153 (10 empty) |
| gobbi-claude children | 4 | 404 |
| Root docs | 5 | 63 |
| **Total** | **53** | **3,422** |
