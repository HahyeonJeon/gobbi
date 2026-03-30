# Project Context Detection

Detect project context at session start and recommend which gobbi skills and gotchas are most relevant. A session that loads the right skills early avoids mid-task discovery of conventions it should have known from the start.

---

## Core Principle

> **Context-aware sessions produce better work. Loading relevant skills before the first task prevents rework caused by late discovery of project conventions.**

An orchestrator that loads every skill wastes context budget on irrelevant knowledge. An orchestrator that loads no project-specific skills misses conventions and makes avoidable mistakes. Project context detection bridges the gap: understand the project, then load only what matters.

> **Returning projects have already been characterized. Do not re-detect what is already documented.**

The `.claude/project/` directory is the primary source of project context. If it contains project documentation from prior sessions, that documentation is richer and more accurate than anything filesystem detection can infer. Detection is a fallback for first encounters, not a replacement for accumulated knowledge.

---

## Detection Priority

### Returning Projects: `.claude/project/` First

The `.claude/project/{project-name}/` directory contains accumulated context from prior sessions — architecture notes, conventions, technology decisions, gotchas. When this directory exists and contains substantive documentation, use it as the primary context source.

What makes project docs "substantive" is a judgment call. A directory with only session notes may not characterize the technology stack. A directory with architecture docs, convention files, or a project skill almost certainly does. Read what exists and assess whether it answers the core question: what technology stack and conventions does this project use?

If `.claude/project/` provides sufficient context, skip filesystem detection entirely. The project docs are the source of truth.

### New Projects: Filesystem Signals

When `.claude/project/` is absent or insufficient, infer project context from the filesystem. The goal is a lightweight scan that produces enough signal to recommend relevant skills — not a comprehensive project audit.

---

## Signal Categories

Detection covers three categories, in order of signal strength:

**Language and runtime** — The strongest signal. A project's primary language determines which gobbi skills and gotchas are relevant. Look for language-specific manifest files, configuration files, and source directories. Most projects have one or two primary languages; identify those rather than cataloging every language present.

**Existing `.claude/` configuration** — If the project already has `.claude/` files (rules, settings, project docs), these reveal what previous sessions established. Existing rules may indicate conventions. Existing project docs may describe architecture. This signal is high-value because it is explicit rather than inferred.

**Frameworks and tools** — Secondary signal that refines the language-level context. A TypeScript project using React has different conventions than one using Express. Framework detection adds specificity but is less critical than identifying the primary language.

---

## Skill Recommendations

Detection produces 2-3 skill recommendations tailored to the project context. The recommendations are session-internal context for the orchestrator — not a user-facing report.

**Match skills to the project's needs, not to a lookup table.** The gobbi skill roster evolves; a static mapping from "TypeScript project" to a fixed skill list would drift. Instead, understand what the project needs (documentation standards? git workflow? execution discipline?) and match to the current skill roster.

**Prioritize skills that prevent common mistakes in this technology stack.** If gotcha files exist for the detected technology domain, those gotchas are high-value recommendations — they represent mistakes that past agents already made in similar contexts.

**Recommend loading order when it matters.** Some skills depend on others being loaded first (noted in their descriptions). When recommending multiple skills, note any ordering constraints.

---

## Integration

This doc describes the optional fourth session-start step in gobbi/SKILL.md. Two modes:

**Auto-detect (default)** — Scan the project and recommend relevant skills. First session on a project uses filesystem detection; returning projects use existing project docs. The orchestrator incorporates recommendations into its session context without requiring user action.

**Skip detection** — Bypass project context detection entirely. Appropriate when the user already knows which skills are needed, or when the project is a gobbi project itself (where all skills are inherently relevant).

---

## Constraints

- Detection must be lightweight — a quick scan, not an exhaustive audit. If detection takes longer than reading a few files, it is doing too much.
- Never generate a user-facing report or summary document. Output is internal orchestrator context only.
- Never modify project files or create `.claude/project/` entries during detection. Detection is read-only. Project documentation is created through normal workflow, not as a detection side effect.
- Skip detection for gobbi's own repository — all gobbi skills are relevant by definition.
- Do not recommend more than 3 skills. Fewer, more relevant recommendations are better than a comprehensive list. If everything seems relevant, the detection is too broad.
- When `.claude/project/` docs exist and are substantive, trust them over filesystem inference. Do not "verify" project docs against the filesystem — they may describe intended architecture, not just current state.
