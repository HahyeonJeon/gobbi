# Distribution

## Installation Methods

Gobbi provides two installation paths:

### 1. Git-Based Install

For users who want to understand what they're installing or manage updates manually.

```bash
# Clone gobbi
git clone <gobbi-repo> /tmp/gobbi

# Copy .claude/ skills into your project
cp -r /tmp/gobbi/.claude/skills/gobbi-* your-project/.claude/skills/
cp -r /tmp/gobbi/.claude/agents/* your-project/.claude/agents/
```

Updates: Pull from gobbi repo and re-copy. User's `gobbi-hack/` directory is never overwritten because it's not in the source repo's core files.

### 2. npx Installer

For users who want one-command setup.

```bash
npx gobbi init
```

The installer:
1. Copies gobbi skill files into `.claude/skills/gobbi-*/`
2. Copies agent definitions into `.claude/agents/`
3. Initializes `.claude/project/` structure
4. Adds gobbi's marker-bounded sections to CLAUDE.md (creating it if needed, preserving existing content)
5. Configures `settings.local.json` with required permissions

```bash
npx gobbi update
```

Updates core skills without touching:
- `gobbi-hack/` (user customizations)
- `.claude/project/` (project state)
- User-owned sections of CLAUDE.md

## CLAUDE.md Management

Gobbi manages specific sections of CLAUDE.md using markers:

```markdown
<!-- gobbi:start -->
## Gobbi Harness

[Gobbi-managed content: workflow instructions, agent roster, skill references]

<!-- gobbi:end -->

## Project-Specific Instructions

[User-owned content below the markers]
```

### What Gobbi Manages in CLAUDE.md
- Entry point instructions (how gobbi's single-entry-point works)
- Agent roster (which agents are available)
- Skill references (which skills exist)
- Core principles reminder
- Hack patch summary (what overrides are active)

### What the User Owns
- Project-specific conventions
- Tech stack information
- Domain-specific rules
- Team preferences

### Regeneration

Gobbi can regenerate its CLAUDE.md sections at any time:
- After installing new skills
- After adding/modifying hack patches
- After adding new agent definitions
- On `npx gobbi update`

User content outside the markers is never touched.

## What Gets Installed

```
your-project/
└── .claude/
    ├── CLAUDE.md                    # Gobbi sections added/updated
    ├── settings.local.json          # Permissions configured
    ├── agents/
    │   ├── gobbi-pi.md
    │   ├── gobbi-planner.md
    │   ├── gobbi-evaluator-positive.md
    │   ├── gobbi-evaluator-moderate.md
    │   └── gobbi-evaluator-critical.md
    ├── project/                     # Initialized empty structure
    └── skills/
        ├── gobbi/                   # Project skill template
        ├── gobbi-orchestration/     # Core skill
        ├── gobbi-claude/            # Core skill
        ├── gobbi-gotcha/            # Core skill
        ├── gobbi-discuss/           # Core skill
        ├── gobbi-ideation/          # Core skill
        ├── gobbi-ideation-evaluation/
        ├── gobbi-plan/              # Core skill
        ├── gobbi-plan-evaluation/
        ├── gobbi-delegation/        # Core skill
        ├── gobbi-execution/         # Core skill
        ├── gobbi-execution-evaluation/
        ├── gobbi-evaluation/        # Core skill
        ├── gobbi-note/              # Core skill
        ├── gobbi-collection/        # Core skill
        ├── gobbi-notification/      # Core skill
        └── gobbi-hack/              # User overrides (empty on install)
```

## Versioning

- Gobbi follows semver
- Core skill files include a version marker in frontmatter
- `npx gobbi update` shows what changed between versions
- Breaking changes to skill interfaces are documented in release notes
