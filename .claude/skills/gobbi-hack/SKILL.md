---
name: gobbi-hack
description: User override layer. Create, validate, and manage patch files that modify core skill behavior without touching core files. Use when the user wants to customize gobbi behavior.
allowed-tools: Read, Grep, Glob, Bash, Write, AskUserQuestion
---

# Hack

User customization layer for gobbi. Patches in this directory modify core skill behavior at load time without touching core files, so gobbi updates never conflict with user customizations.

---

## Core Principle

> **Users customize through patches, never through core file edits.**

All user-facing behavioral changes live as patch files in this directory. Core skill files are never modified by users. This separation is what makes gobbi safely updatable — new core versions apply cleanly because user modifications exist in a parallel layer.

> **Patches are generated through conversation, never written manually.**

The user describes intent, the agent reads the target skill, generates the patch, and the user reviews. This follows gobbi's principle that users describe what they want, not how to implement it.

> **Every patch must justify its existence.**

A patch without a rationale is a patch that future sessions cannot evaluate for relevance. The rationale explains why the change exists so agents can determine whether it still applies.

---

## What Patches Are

Patches are markdown files with the `.patch.md` extension, each targeting a specific core skill. When a core skill loads, gobbi checks this directory for patches targeting that skill and applies their modifications on top of the core behavior.

Each patch contains frontmatter identifying its target and priority, a Modification section describing the behavioral change, and a Rationale section explaining why it exists. Read existing patches in this directory for the current format.

---

## Patch Frontmatter

Every patch declares four frontmatter fields:

| Field | Purpose |
|-------|---------|
| **name** | Identifies the patch — descriptive of the change, not the target |
| **description** | Single line explaining the behavioral modification |
| **target** | Which core skill this patch modifies — must be an existing skill |
| **priority** | Numeric load order when multiple patches target the same skill — higher values load later and can override earlier patches |

---

## Generating Patches

The agent drives patch creation, not the user. When a user wants to change gobbi behavior, the agent must understand the target skill before generating anything. Read the target skill thoroughly — a patch that misunderstands the core behavior will produce unpredictable results.

Discuss with the user to clarify the exact behavioral change. A vague customization request produces a vague patch. The user confirms or adjusts before the patch is written.

---

## Validation

Before writing any patch, the agent must verify all of the following:

| Check | Why |
|-------|-----|
| **Target skill exists** | A patch targeting a nonexistent skill is dead weight |
| **No conflicts with existing patches** | Two patches modifying the same behavior on the same target create ambiguity — resolve with the user before writing |
| **Does not contradict a gotcha** | Gotchas record hard-won corrections — a patch that reverses one reintroduces a known mistake |
| **Does not weaken a quality gate** | Evaluation criteria, verification requirements, and scope boundaries exist for a reason — patches that relax them degrade output quality |

If any check fails, discuss with the user before proceeding. Never silently write a patch that fails validation.

---

## Managing Patches

The agent manages the full lifecycle of patches through conversation:

| Operation | Approach |
|-----------|----------|
| **List active patches** | Scan this directory for all `.patch.md` files and summarize their targets and effects |
| **Disable a patch** | Move the file to the `disabled/` subdirectory — preserves the patch for potential reactivation |
| **Update a patch** | User describes the change, agent reads the current patch and target skill, regenerates through the same conversation-and-review flow as creation |
| **Resolve conflicts** | When patches overlap on the same target, present the conflict to the user and ask which takes priority |

---

## Constraints

- Never modify core skill files to accommodate a user customization — that is what patches exist for
- Never write a patch without reading the target skill first
- Never skip user review of a generated patch
- Never create patches that duplicate what a gotcha already corrects — gotchas apply universally, patches are opt-in overrides
- Patch files live directly in this directory — no nested subdirectories except `disabled/`
