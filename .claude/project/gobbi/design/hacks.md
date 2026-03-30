# Hack System

## Core Principle

Users can customize any gobbi behavior without touching core files. This is gobbi's 3rd differentiator: safe hacking. The core system is never modified by users, so updates to gobbi don't conflict with customizations.

## Mechanism: Patch Files

User customizations are expressed as `.patch.md` files in the `gobbi-hack/` skill directory. Patches describe behavioral modifications that gobbi applies on top of core skills at load time.

### How Patches Work

1. **User describes the change** in natural conversation: "I want planning to always include a security review step"
2. **Gobbi reads the relevant core skill** (e.g., `gobbi-plan/SKILL.md`)
3. **Gobbi generates a patch file** in `gobbi-hack/`: e.g., `gobbi-hack/plan-security-review.patch.md`
4. **User reviews** the generated patch
5. **Gobbi loads patches at runtime** — when loading a core skill, gobbi checks `gobbi-hack/` for applicable patches and applies them

### Patch File Format

```markdown
---
name: plan-security-review
description: Add mandatory security review step to all plans
target: gobbi-plan
priority: 100
---

## Modification

When creating plans, always include a security review task as the final step before verification.
The security review should check for:
- Input validation on all new endpoints
- Authentication/authorization on new routes
- No secrets in code or config files
- SQL injection prevention on new queries

## Rationale

Team policy requires security review on all changes after the Q1 incident.
```

### Patch Properties

- **target:** Which core skill this patch modifies
- **priority:** Load order when multiple patches target the same skill (higher = loaded later)
- **Modification:** What behavioral change to apply
- **Rationale:** Why this change exists (helps gobbi understand context and helps future sessions decide if the patch is still relevant)

## Isolation Model

```
gobbi-hack/                          # User's customizations
├── plan-security-review.patch.md    # Modifies gobbi-plan behavior
├── discuss-skip-trivial.patch.md    # Modifies gobbi-orchestration discussion
└── eval-strict-tests.patch.md       # Modifies gobbi-execution-evaluation criteria

gobbi-plan/                          # Core skill — NEVER modified by user
gobbi-orchestration/                   # Core skill — NEVER modified by user
gobbi-execution-evaluation/               # Core skill — NEVER modified by user
```

Core files and hack files never mix. Gobbi can be updated (new core skill versions) without touching `gobbi-hack/`. User hacks survive updates.

## Generating Patches

The user never needs to write patch files manually. The workflow:

1. User says: "I want to change how gobbi does X"
2. Gobbi discusses: "Currently X works like this. What do you want to change?"
3. User describes the change
4. Gobbi generates the `.patch.md` file in `gobbi-hack/`
5. Gobbi explains what the patch does and how it will affect behavior
6. User confirms or asks for adjustments

This aligns with gobbi's "no study needed" principle — users describe intent, gobbi generates the implementation.

## Patch Validation

When gobbi generates or loads a patch:
- Verify the target skill exists
- Check for conflicts with other patches on the same target
- Warn if the patch contradicts a gotcha
- Warn if the patch weakens a quality gate

## Managing Patches

- **List patches:** Gobbi can summarize all active patches and their effects
- **Disable a patch:** Move to `gobbi-hack/disabled/` or delete
- **Update a patch:** User describes what to change, gobbi regenerates
- **Conflict resolution:** If two patches conflict, gobbi asks the user which takes priority
