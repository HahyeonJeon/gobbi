---
name: interview
description: MUST load when the manager runs a structured Socratic interview with the user to concretize project understanding, populate project memory, and generate project-specific skills. Activates via `/gobbi interview` or via Configuration auto-recommendation when project memory is sparse.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Interview

Skill for the **manager** conducting a structured Socratic interview with the user (the project's client) to concretize project understanding, populate project memory, and generate project-specific skills.

The Interview skill is **manager-direct** — the manager owns user-facing AskUserQuestion exchanges. The `leader` is spawned occasionally during waves for codebase / git / reference research, but the dialogue itself is between manager and user.

**Goals**:
1. Concretize what the project and its features actually are (not what the user claims they are)
2. Generate project memory artifacts under `.gobbi/projects/{project-name}/` (README, design, decisions, features, mistakes, references)
3. Generate project-specific skills under `.gobbi/projects/{project-name}/skills/{skill-name}/SKILL.md` that codify the conventions, quality bars, and patterns surfaced during the interview

The Interview skill is **not** part of the standard 6-step workflow (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up). It runs alongside as a discovery / bootstrap pass — once or repeatedly across a project's lifetime — to keep project memory rich enough that downstream workflows can operate on solid context.

---

## Memory Access Matrix

The agent in the manager role conducting the interview MUST observe these tier boundaries. The access mode depends on whether the project is in **bootstrap mode** (project memory empty) or **mature mode** (project memory already exists).

**Bootstrap detection** (3-tier — mirrors `orchestration/SKILL.md` § Step 1 row 7):

| Tier | Condition | Interview mode |
|---|---|---|
| **Empty** | No `README.md`, no `design/`, no `features/` directory with content | Bootstrap mode — direct project-memory writes apply |
| **Sparse** | Has `README.md` OR a skeleton `design/`, but no `features/` directory with content | Bootstrap mode — treat as empty for write-access purposes; direct writes apply |
| **Mature** | Has `features/` directory with content | Mature mode — staging-only writes; Wrap-up promotes |

| Memory tier | Path root | Bootstrap mode | Mature mode |
|---|---|---|---|
| **Session memory — interview rawdata** | `sessions/{date}-{session-id}/interview/rawdata/` | **READ + WRITE** | **READ + WRITE** |
| **Session memory — interview staging** | `sessions/{date}-{session-id}/interview/staging/` | **WRITE** (not used — bootstrap writes direct) | **WRITE** — mature-mode wave outputs staged here for Wrap-up promotion |
| **Session memory — interview artifacts** | `sessions/{date}-{session-id}/interview/` | **WRITE** — final session summary | **WRITE** — final session summary |
| **Project memory — bootstrap targets** | `.gobbi/projects/{project-name}/{README.md,design/,decisions/,features/{feature-name}/,mistakes/,references/,backlogs/}` | **WRITE** — direct write to project memory; bootstrap exception to Wrap-up sole-writer rule | **FORBIDDEN** — mature reruns write to session staging only; Wrap-up promotes |
| **Project memory — skills** | `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | **WRITE** — skills generated at wave close when user approves | **FORBIDDEN** — skill updates stage at `sessions/{date}-{session-id}/interview/staging/skills/{slug}/SKILL.md`; Wrap-up promotes |
| **Workspace codebase** | The repository under analysis | **READ-ONLY** | **READ-ONLY** |

**Why bootstrap mode can write project memory directly**: the standard workflow's staging → Wrap-up promotion model exists because Ideation / Planning / Execution loops write speculatively and may be reverted by REVISE. Bootstrap interview is different — it captures user-confirmed facts via AskUserQuestion exchanges. Each output is gated by user confirmation at the wave's intermediate summary. There is no REVISE loop to invalidate the writes. Mature mode does not share this property — existing project memory may already be referenced by ongoing workflows, so speculative writes would create divergence.

**Delete semantics**: the interview NEVER deletes any file. Supersession (when re-running surfaces newer information) is recorded via `supersedes:` frontmatter on the new file; the old file has its `status:` flipped to `superseded` + `superseded_by:` added. Once a project-memory artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

---

## Mature-project rerun

When interview runs on a project whose memory already exists (mature mode), the manager:

1. **Reads existing project memory** at `.gobbi/projects/{project-name}/` at session start — notes what is already covered.
2. **Runs all 5 waves** — waves whose content is already captured are run as validation passes, not rewrite passes.
3. **Writes wave outputs to session staging**, not directly to project memory:
   - New or updated project facts → `sessions/{date}-{session-id}/interview/staging/decisions/{slug}.md`
   - New or updated feature entries → `sessions/{date}-{session-id}/interview/staging/features/{feature-name}/README.md`
   - New or updated mistakes → `sessions/{date}-{session-id}/interview/staging/mistakes/{slug}.md`
   - New or updated skills (user-approved) → `sessions/{date}-{session-id}/interview/staging/skills/{slug}/SKILL.md`
4. **Marks superseded items** in staging frontmatter: `supersedes: [<path-to-existing-project-memory-file>]`
5. **Defers project-memory promotion to Wrap-up** — the normal staging → Wrap-up promotion route applies, same as any other workflow loop.

The staging path for mature-mode interview outputs is `sessions/{date}-{session-id}/interview/staging/`. Wrap-up reads this at promotion time via the standard routing table in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md).

---

## Trigger

The Interview skill activates two ways:

1. **Explicit invocation** — the user runs `/gobbi interview` (or asks "let's do a project interview"). Always honored.
2. **Auto-recommendation from Configuration** — during the workflow's Configuration step, the manager applies the 3-tier detection from `orchestration/SKILL.md` § Step 1 row 7. **Empty tier** (no `README.md`, no `design/`, no `features/` with content): AskUserQuestion "Project memory is empty — run a project interview before starting work?" **Sparse tier** (has `README.md` or skeleton `design/` but no `features/` with content): AskUserQuestion "Your project memory looks sparse. Run `/gobbi interview` to flesh out the basics, or continue to Ideation?" **Mature tier**: no auto-recommendation. The user decides; if accepted, the interview runs to completion before Configuration resumes.

The Interview skill always runs **Full mode** — all 5 waves. The user can halt mid-flight, but there are no short modes. If a wave's content is already captured (re-running on a mature project), the manager confirms with the user and skips wave-specific Output writes for already-covered items while still validating coverage.

---

## Core Principles

> **Specificity is the only currency.**

"Enterprises in healthcare" is not a target user; "Sarah at Acme Corp who reports to the CTO and gets fired if patient data leaks" is. The first answer the user gives is usually polished; real answers come after the second or third question on the same point. Push twice.

> **Interest ≠ demand.**

Stated preferences, waitlists, and "users love it" claims are not evidence. Behavior — what the user (or their users) actually does when no one is watching — is the evidence. Probe for it.

> **One question per turn.**

The manager asks one focused question via AskUserQuestion. Stacked questions ("what's the tech stack, scale targets, and security model?") fragment user attention and dilute answers.

> **Take positions; state what evidence would change your mind.**

The manager does not hedge ("that's interesting," "you might want to consider"). When a user's answer suggests a flaw or risk, the manager names it explicitly and states what additional evidence would resolve the concern. Anti-sycophancy applies per the `discussion` skill's banned-phrase list.

> **Track assumptions verified vs unverified.**

Every wave's intermediate summary distinguishes confirmed facts from working assumptions. Unverified assumptions become questions in a later wave, not silent inputs.

> **Never invent inputs.**

If a user cannot answer a question or the answer is "I don't know," the manager records this in `decisions/{date}-unknowns.md` as an explicit gap. The manager does not fabricate plausible answers to keep the interview flowing.

---

## The Four Analytical Lenses

Every question is asked through one of four lenses. The manager varies lenses across questions within each wave to ensure the project is examined from multiple angles.

| Lens | Asks | Example question shape |
|---|---|---|
| **Strategic** | What's the goal? What's the priority? What does success look like? | "If you had to pick one feature to ship in 30 days, which one and why?" |
| **Systemic** | How do the parts fit? Where is coupling? What's the lifecycle? | "When this feature changes, what else has to change with it?" |
| **Psychological** | Who actually uses this? What do they want vs say they want? Where's the friction? | "Have you watched someone use this without your help? What surprised you?" |
| **Devil's advocate** | What if this is wrong? What's the strongest argument against this approach? | "If a competitor shipped the opposite of what you're building, who'd switch?" |

The manager rotates lenses naturally — strictly cycling all four every wave is too mechanical; rotating two or three per wave is appropriate. The point is that the interview is not a single-angle questionnaire.

---

## 5-Wave Procedure

The manager runs the user through five waves in order. Each wave has a focus, target output domains, typical lens emphasis, and an optional skill-codification offer at its close. All AskUserQuestion calls follow the [`discussion` skill's Question Card template](../discussion/SKILL.md#question-card-structure).

### Wave 1 — Project Identity (What / Why)

**Lens emphasis**: Strategic + Psychological

**Question targets**:
- What does the project do, in one sentence?
- Who is the target user / consumer?
- What value does it deliver that the user can't get elsewhere?
- What is the project **not**? (negative scope — what would be off-mission?)
- What lifecycle stage? (greenfield / early / production / mature / legacy / sunset)
- What's the strongest evidence the target user genuinely wants this?

**Output domain**:
- `.gobbi/projects/{project-name}/README.md` (project overview — written by the manager from interview answers; includes canonical metadata: name, one-line description, target user, lifecycle stage)

**Wave close**:
- Intermediate summary: facts confirmed / working assumptions / open questions
- Skill-codification offer: typically none at Wave 1 (Identity rarely produces standalone skills; it informs later waves)

### Wave 2 — Tech Stack + Conventions

**Lens emphasis**: Systemic + Devil's advocate

**Question targets**:
- Languages, frameworks, runtime, build tools
- Directory structure and module boundaries
- Naming conventions (files, types, functions, vars)
- Dependency philosophy (zero-dep ethos? heavy library use? specific banned categories?)
- Code style (formatter, linter, JSDoc/comment density)
- Code review / PR practices

**Leader spawn (optional)** — the manager spawns a leader to read `package.json`, `tsconfig.json`, `pyproject.toml`, etc., and the top-level directory structure, then return a fact sheet. The manager presents this to the user to confirm or refute.

**Output domain**:
- `.gobbi/projects/{project-name}/design/architecture.md` (high-level module map + responsibility per directory)
- `.gobbi/projects/{project-name}/decisions/{date}-tech-stack.md`
- `.gobbi/projects/{project-name}/decisions/{date}-conventions.md`

**Wave close**:
- Intermediate summary
- Skill-codification offer — typical candidates:
  - `{project-name}-{language}-conventions` (e.g., `{project-name}-typescript-conventions`)
  - `{project-name}-build-system`
  - `{project-name}-directory-layout`

  The manager runs AskUserQuestion for each candidate: "Codify this as a skill?" If yes, the manager stamps the skill from [`templates/project-skill.md`](templates/project-skill.md) using the interview content.

### Wave 3 — Constraints + Quality Bar

**Lens emphasis**: Devil's advocate + Systemic

**Question targets**:
- Performance requirements (latency, throughput, memory, binary size)
- Security policy (auth, data handling, secrets management, supply chain)
- Regulatory constraints (HIPAA, GDPR, SOC2, etc.)
- Test coverage expectations (TDD? coverage threshold? property tests? E2E?)
- PR / review bar (who reviews? how strict?)
- Deployment + rollback expectations
- Quality NFRs the user holds the project to but hasn't written down

**Leader spawn (optional)** — leader inspects CI config, test config, security-related files for current state.

**Output domain**:
- `.gobbi/projects/{project-name}/decisions/{date}-{slug}.md` (one decision record per substantive constraint)

**Wave close**:
- Intermediate summary
- Skill-codification offer — typical candidates:
  - `{project-name}-testing` (the project's specific test patterns)
  - `{project-name}-security` (project-specific threat model + policies)
  - `{project-name}-pr-conventions` (review checklist)

### Wave 4 — Features + Roadmap

**Lens emphasis**: Strategic + Psychological

**Question targets**:
- What features exist today? (each gets a one-line description)
- Which features are stable / in-progress / planned / abandoned?
- What's the near-term priority (next quarter)?
- What's explicitly **not** planned (negative roadmap)?
- Who's working on what (if there's a team) or what's the user's solo capacity?
- What features have shipped that you'd reverse if you could?

**Leader spawn (optional)** — leader runs `git log`, scans `features/` directory if present, and produces a chronological feature / work summary.

**Output domain**:
- `.gobbi/projects/{project-name}/features/{feature-name}/README.md` — one per identified feature (manager stamps from [`memorization/templates/feature-readme.md`](../memorization/templates/feature-readme.md))
- `.gobbi/projects/{project-name}/backlogs/{slug}.md` — deferred / planned features
- `.gobbi/projects/{project-name}/decisions/{date}-roadmap-priority.md`

**Wave close**:
- Intermediate summary
- Skill-codification offer — typical candidates:
  - `{project-name}-feature-glossary` (lightweight skill mapping feature names → 1-line descriptions + entry-point paths)

### Wave 5 — Project-specific Patterns + Mistakes

**Lens emphasis**: Devil's advocate + Systemic

**Question targets**:
- Common bugs / failure modes that recur in this project
- Anti-patterns specific to this project (things that look like good ideas but break here)
- Idioms unique to this codebase (patterns that look weird but are intentional)
- What do newcomers reliably get wrong?
- What's the most expensive bug in project history? What was the root cause?
- What hides in places no one looks?

**Leader spawn (optional)** — leader reviews recent bug-fix commits (`git log --grep=fix`) and existing `mistakes/` to surface patterns.

**Output domain**:
- `.gobbi/projects/{project-name}/mistakes/{slug}.md` (one per surfaced trap, per the [mistakes template](../memorization/templates/mistakes.md))
- `.gobbi/projects/{project-name}/references/{slug}.md` (external sources mentioned during interview)

**Wave close**:
- Intermediate summary
- Skill-codification offer — typical candidates:
  - `{project-name}-idioms` (project-specific patterns)
  - `{project-name}-mistakes` (only if the mistakes are dense enough to warrant a separate skill beyond individual `mistakes/{slug}.md` files)

---

## Inter-wave structure

After each wave, the manager produces an **intermediate summary** with three sections:

```markdown
## Wave N Summary

### Facts confirmed
- {bulleted, traceable to user answers}

### Working assumptions
- {bulleted, the manager's interpretation that the user has not explicitly confirmed}

### Open questions
- {bulleted, gaps the user could not answer or that need deeper probing in a later wave}
```

The intermediate summary is presented to the user via AskUserQuestion (per the [`discussion` skill's Question Card template](../discussion/SKILL.md#question-card-structure)): "Does this summary match your understanding? If not, what's wrong?" The user confirms or corrects before the next wave begins.

---

## Final Output

When all 5 waves complete, the manager writes a **session summary** to `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/interview/interview.md`:

```markdown
## Interview Summary

### Date / Session
{date} / {session-id}

### Project state at start
{terse — was project memory empty? partial?}

### Artifacts produced
- {list of every file the interview created or substantially updated}

### Skills generated
- {list of project-specific skills generated this interview, with one-line purpose each}

### Open questions
{aggregated from all wave intermediate summaries — what the user could not answer}

### Decisions log
{key choices the user made via AskUserQuestion during the interview — e.g., scope of negative roadmap, security policy approval, agreed conventions}
```

The summary is descriptive, not prescriptive. No "next action" is proposed — the user decides what to do next; the interview's job is discovery, not direction.

---

## Project-specific skill generation

When the user approves a skill codification at a wave close, the manager:

1. Picks a slug (e.g., `{project-name}-typescript-conventions`)
2. Creates `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md`
3. Stamps the file from [`templates/project-skill.md`](templates/project-skill.md), filling in:
   - Frontmatter (name, description, allowed-tools)
   - Purpose section (from interview wave content)
   - Conventions / Rules section (from user's stated rules)
   - Examples section (from real files in the codebase the leader surfaced during research)
   - Anti-patterns section (from "what newcomers get wrong" answers if present)
   - Constraints section (mandatory rules the skill enforces)
4. Confirms the new skill location with the user

The new skill is then loadable by downstream workflows (Ideation / Preparation / Planning / Execution loops) when they touch the project area the skill covers.

---

## Output paths

The interview writes both session-scoped audit files and project-scoped baseline files. The project-scoped writes are the exception to "only Wrap-up writes to project memory" — see § Memory Access Matrix.

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — Claude Code session ID supplied by the delegation prompt's `session-id:` header field (the parent session's id). Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's.
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug surfaced during Wave 4
- `{slug}` — kebab-case slug for the specific artifact

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/interview/rawdata/transcript.jsonl` | manager | transcript window for the interview |
| `sessions/{date}-{session-id}/interview/rawdata/wave-{n}-summary.md` | manager | per wave intermediate summary (5 files) |
| `sessions/{date}-{session-id}/interview/interview.md` | manager | final session summary |
| `.gobbi/projects/{project-name}/README.md` | manager (Wave 1) | project overview |
| `.gobbi/projects/{project-name}/design/architecture.md` | manager (Wave 2) | high-level module map |
| `.gobbi/projects/{project-name}/decisions/{date}-{slug}.md` | manager (Waves 2-4) | per decision record |
| `.gobbi/projects/{project-name}/decisions/{date}-unknowns.md` | manager (any wave) | explicit gaps where the user could not answer |
| `.gobbi/projects/{project-name}/features/{feature-name}/README.md` | manager (Wave 4) | one per identified feature |
| `.gobbi/projects/{project-name}/backlogs/{slug}.md` | manager (Wave 4) | deferred / planned features |
| `.gobbi/projects/{project-name}/mistakes/{slug}.md` | manager (Wave 5) | one per surfaced trap |
| `.gobbi/projects/{project-name}/references/{slug}.md` | manager (Wave 5) | external sources mentioned during interview |
| `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | manager (any wave close) | per approved skill-codification offer |

---

## Constraints

- **MUST never accept the first answer when the user hedges** — push twice. First answers are polished; real answers come after additional probing.
- **MUST never write code or implementation artifacts during the interview** — output is project memory + skills only.
- **MUST never skip waves**. If a wave's content is already partially captured, the manager validates coverage but still runs the wave.
- **MUST vary analytical lenses** across questions within a wave — strictly using one lens for all questions in a wave dilutes coverage.
- **MUST stamp the full skill template** when the user approves a skill codification — never leave skeleton files with TODOs.
- **MUST present intermediate summaries** to the user via AskUserQuestion at each wave close, using the Question Card template.
- **MUST record "don't know" as an open question** in `decisions/{date}-unknowns.md` rather than fabricating an answer.
- **MUST halt the interview if the user requests it** — the user can drop out mid-flight; the manager records the wave reached and the open items.
- **MUST follow the `discussion` skill's anti-sycophancy and Question Card discipline** on every AskUserQuestion call.
- **MUST never delete project-memory files** — supersession via frontmatter only; terminal artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
