# Architecture

## System Structure

Gobbi is a skill-based system. All behavior is defined in `.claude/skills/gobbi-*/` directories. The orchestrator (CLAUDE.md) is the single entry point that routes user intent to the right skills and agents.

```
.claude/
├── CLAUDE.md                        # Entry point — core principles and workflow
├── settings.local.json              # Permissions
├── agents/                          # Agent definitions
│   ├── gobbi-pi.md                        # Principal Investigator — R&D specialist
│   ├── gobbi-evaluator-positive.md        # Positive-stance evaluator
│   ├── gobbi-evaluator-moderate.md        # Moderate-stance evaluator
│   ├── gobbi-evaluator-critical.md        # Critical-stance evaluator
│   └── gobbi-planner.md                   # Planner agent
├── project/                         # Project state managed by gobbi
│   └── design/                      # Design docs (this directory)
└── skills/
    ├── gobbi/                       # Entry point skill — principles and skill map
    ├── gobbi-orchestration/         # Core: workflow coordination, phase transitions
    ├── gobbi-claude/                # Core: .claude/ documentation standard
    ├── gobbi-gotcha/                # Core: cross-project mistake recording
    ├── gobbi-discuss/               # Workflow: structured critical discussion
    ├── gobbi-ideation/              # Workflow: idea refinement through discussion
    ├── gobbi-ideation-evaluation/   # Evaluation: ideation quality gate
    ├── gobbi-plan/                  # Workflow: task decomposition
    ├── gobbi-plan-evaluation/       # Evaluation: plan quality gate
    ├── gobbi-delegation/            # Workflow: handing off work to subagents
    ├── gobbi-execution/             # Workflow: task execution guide
    ├── gobbi-execution-evaluation/  # Evaluation: execution quality gate
    ├── gobbi-evaluation/            # Evaluation: framework and 3-stance model
    ├── gobbi-note/                  # Workflow: recording decisions and outcomes
    ├── gobbi-collection/            # Workflow: persisting workflow trail
    ├── gobbi-notification/          # Utils: Claude Code notification config
    └── gobbi-hack/                  # Utils: user override layer
```

## Skill Map

### Core Skills (always loaded)

| Skill | Purpose |
|-------|---------|
| `gobbi` | Entry point. Core principles and skill map. Loaded at session start. |
| `gobbi-orchestration` | Workflow coordinator. Routes through steps and phases. |
| `gobbi-claude` | `.claude/` doc authoring standard. Loaded before writing any docs. |
| `gobbi-gotcha` | Cross-project gotcha recording. Loaded by all agents before work. |

### Workflow Skills (loaded per step)

| Skill | Purpose | When Loaded |
|-------|---------|-------------|
| `gobbi-discuss` | Critical structured discussion via AskUserQuestion | Every discussion point |
| `gobbi-ideation` | Idea refinement through discussion points | Step 1: Ideation Loop |
| `gobbi-plan` | Task decomposition and ordering | Step 2: Plan Loop |
| `gobbi-delegation` | Handing off work to subagents with context | Step 3: Execution |
| `gobbi-execution` | Task execution guide for agents | Subagents during execution |
| `gobbi-note` | Recording decisions and outcomes | Every step |
| `gobbi-collection` | Persisting workflow trail to work directory | Step 4: Collection |

### Evaluation Skills (loaded during evaluation)

| Skill | Purpose |
|-------|---------|
| `gobbi-evaluation` | Evaluation framework — 3-stance model, quality gate flow |
| `gobbi-ideation-evaluation` | Stage-specific criteria for ideation output |
| `gobbi-plan-evaluation` | Stage-specific criteria for plan output |
| `gobbi-execution-evaluation` | Stage-specific criteria for execution output |

### Utility Skills

| Skill | Purpose |
|-------|---------|
| `gobbi-hack` | User patch files that overlay core behavior |
| `gobbi-notification` | Configure Claude Code notifications |

## Layer Model

```
┌─────────────────────────────┐
│  User conversation          │  User just talks naturally
├─────────────────────────────┤
│  CLAUDE.md (entry point)    │  Core principles, workflow definition
├─────────────────────────────┤
│  Orchestrator               │  Routes through steps, spawns agents
├─────────────────────────────┤
│  Agents                     │  PI, 3 Evaluators, Planner, Executors
├─────────────────────────────┤
│  Hack layer (gobbi-hack/)   │  Patch overrides checked first
├─────────────────────────────┤
│  Skills (gobbi-*/)          │  Domain knowledge loaded per step
├─────────────────────────────┤
│  Claude Code primitives     │  Agent tool, TaskCreate, AskUserQuestion, hooks, worktrees
└─────────────────────────────┘
```

## CLAUDE.md Management

Gobbi uses marker-bounded sections in CLAUDE.md:

```markdown
<!-- gobbi:start -->
... gobbi-managed content (principles, workflow, agents) ...
<!-- gobbi:end -->

# User's own sections below
...
```

User owns everything outside the markers. Gobbi regenerates its sections from project state and configuration. User customizations to gobbi behavior go through the hack system, not direct CLAUDE.md edits.
