# Sub-step C Findings (iter1)

Leader iter 1, Sub-step C (Research). Confirmed internal + external insights for the 3 bundled tasks (T1 worktree-first, T2 matrix + Load-Directives validator, T3 PostToolUse hook + reconstructor). Internal and external insights managed independently per `research/SKILL.md`. **The CP-4.1-β hook contract verification gate is CLOSED — answer + method recorded at § T3 Hook contract verification.**

Loaded skills: `principles`, `mistake`, `orchestration/workflow/ideation.md`, `ideation/SKILL.md`, `research/SKILL.md`, plus reference loads of `git/SKILL.md`, `preparation/SKILL.md`, `orchestration/SKILL.md`, `delegation/SKILL.md`, `gobbi/SKILL.md`, all 5 agent specs, session.template.json, session-start.sh, settings.json. All 7 promoted mistakes re-read.

Develop tip `1829fa3` (unchanged from Sub-step A). Prior session transcript directly inspected at `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` (1675 lines).

External reference promotion list — 12 staged at `sessions/.../ideation/staging/references/` (4 per task).

---

## T1 — Worktree-first architecture (with NEW absorbed)

### Internal insights

**T1-I-1 — The current "session writes always main-tree absolute path" rule is the proxy that exposes the symlink-gap failure.**

- **Source** — `git/SKILL.md:33` ("session writes (notes, mistakes, project memory drafts) MUST use the main tree's absolute path, never the worktree's"); `1829fa3` commit body ("PR #267 added `.gobbi/projects/gobbi/skills/codex/SKILL.md` but the corresponding `.claude/skills/codex/SKILL.md` + `.agents/skills/codex` symlinks were created in main-tree at Preparation-exit promotion and never landed on the worktree branch")
- **Insight** — The rule was authored to prevent the inverse failure (`mistakes/codex-eval-session-write-path-nested-in-worktree.md` — Codex evaluator wrote session staging to `worktrees/.../sessions/...`). It correctly collapses session-memory writes to the main tree but inherits the same default to Preparation-exit promote-now, which needs the **opposite** routing — write to the worktree branch so the PR diff is complete.
- **Why** — T1's worktree-first proposal collapses the two opposing failure modes by changing `cwd` semantics from "main tree at session start, worktree only at Execution" to "worktree from Configuration Step 1." The session-memory survival question (currently solved by always-main-tree) re-opens — Sub-step D must answer it.

**T1-I-2 — Worktree creation is currently bound to Execution start, not Configuration.**

- **Source** — `orchestration/workflow/execution.md:30-50` (executor lifecycle, "Manager's job: spawn a fresh executor agent per task"); `git/SKILL.md:155-162` (Procedure P2 "Create worktree"; "Pass the absolute worktree path to every delegation prompt that operates on this task"); `orchestration/SKILL.md:103` (Configuration Step 1 row 6 — no worktree creation in this row; `git.branch` / `git.worktreePath` left `null` "until `git` creates the worktree").
- **Insight** — Three workflow phases (Ideation / Preparation / Planning) run BEFORE the worktree exists, with `cwd` = main tree. The agents writing during those phases all interpret "write to project memory" relative to the main tree. The first time `cwd` flips is when the executor in Execution runs `cd <worktree-path>` per `git/SKILL.md` P3.
- **Why** — T1 = move the worktree creation step to Configuration Step 1. The relocation is mechanical (a row insertion in the orchestration table + a `git.worktreePath` stamp move earlier in the same row 6). The harder question is what happens to non-feature / read-only sessions — Scope Contract has already locked "uniform for every session," removing that conditional from Sub-step D.

**T1-I-3 — The Preparation narrow-exception promote-now already accepts a sole-writer violation — extending it to commit-on-branch is a strict superset of the same exception.**

- **Source** — `preparation/SKILL.md:62` ("Promotion path: on EVALUATION PASS, copy `sessions/{date}-{session-id}/preparation/staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` … This is a narrow, user-approved exception to the sole-writer rule"); `gobbi/SKILL.md:117` (sole-writer = Wrap-up's MEMORIZATION).
- **Insight** — The Preparation `generate-now` already breaks the "Wrap-up is the sole project-memory writer" rule. The breakage is justified: Planning + Execution need to load the skill in-session. Adding "and also commit it on the worktree branch + commit its symlinks" is the structural completeness of the same exception — currently the file lands on disk but not in the git index. The NEW item (absorbed) is therefore a 2-line addition to `preparation/SKILL.md`'s Promotion path step: `git add <path>` + `git commit -m "..."`. The only complication is what tree the `git add` runs in — answered by T1 (it's the worktree, because Configuration created it).
- **Why** — Anchors NEW absorbed-as-commit-on-branch in the existing exception text. Confirms the symbiotic relationship with T1: if T1 lands, NEW is a small commit. If T1 stalls, NEW is more complex (must route writes between trees explicitly).

**T1-I-4 — The codex-eval-session-write-path-nested-in-worktree mistake reveals the inverse failure mode worktree-first MUST address.**

- **Source** — `mistakes/codex-eval-session-write-path-nested-in-worktree.md:19-44` (Codex evaluator wrote to `.gobbi/projects/gobbi/worktrees/feat/env-var-audit-sessionstart-hook/.gobbi/projects/gobbi/sessions/...`); the fix was to enforce "session writes MUST use the absolute main-tree path" in evaluator delegation prompts.
- **Insight** — Under worktree-first, the evaluator's `cwd` will be the worktree from Configuration Step 1. If the session memory directory is **also** in the worktree (the worktree branch absorbs the session dir on merge), the evaluator's relative path construction is correct by default — no special "use the main-tree absolute path" instruction needed. Alternatively, if session memory remains in the main tree, the worktree-first agents need an inverse instruction. The four answers to Sub-step D session-survival design question (a/b/c/d in the brief) each carry a different version of this routing rule.
- **Why** — The mistake is the canonical example of what worktree-first must NOT replicate. The Sub-step D answer to (a/b/c/d) directly determines whether the manager passes "use absolute main-tree path" or "use worktree-relative path" in evaluator delegations.

**T1-I-5 — Session writes from the manager already use main-tree absolute paths today (template + `session-start.sh` + session.template.json `transcriptPath`).**

- **Source** — `gobbi/SKILL.md:39` ("`CLAUDE_TRANSCRIPT_PATH` … also stamped as tilde-form path in `session.json.transcriptPath` by the manager during Configuration Step 1 row 6"); `session.template.json:11` (`transcriptPath: null` field); empirically `session.json.transcriptPath = "~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36...jsonl"` for prior session.
- **Insight** — The transcript file IS in the user's home dir (`~/.claude/projects/<host-path>/`), entirely outside the worktree. This means transcript survival is automatic — worktree removal doesn't touch it. Only the `.gobbi/projects/<name>/sessions/{date}-{session-id}/` tree is at issue. So the survival design question (Sub-step D) is specifically about that tree, not about transcripts.
- **Why** — Narrows the design question. The session dir contains: rawdata (drafts, transcripts-as-jsonl), staging (references, decisions, etc.), evaluation/, artifacts/, session.json, state.json, settings.json. Of these, only the .jsonl transcripts could conceivably be regenerated; everything else is the durable record. The (a/b/c/d) options must each say what happens to this tree.

### External insights

**T1-E-1 — Claude Code's official worktree pattern is exactly what T1 generalizes — runtime-aligned.**

- **Source** — https://code.claude.com/docs/en/worktrees (accessed 2026-05-23)
- **Insight** — Claude Code provides native `-w` flag + subagent `isolation: worktree` frontmatter for per-session worktree isolation. The official framing matches T1: "edits in one session never touch files in another." The docs also explicitly call out the filesystem-only nature of isolation: "Git worktrees isolate your files, but they don't isolate your database, environment variables, or running services" — meaning cross-session state (e.g., session memory) is the project's problem to solve, not the runtime's.
- **Why** — Confirms T1's direction is the runtime-recommended one, not a project-local invention. The "filesystem-only" caveat is exactly the seed of the Sub-step D session-memory-survival design question.

**T1-E-2 — Community-validated worktree rules: scope by module, rebase not merge, commit at session boundaries.**

- **Source** — https://www.mindstudio.ai/blog/parallel-agentic-development-claude-code-worktrees (accessed 2026-05-23)
- **Insight** — Three production rules emerged from parallel-Claude-Code practice: (1) scope worktrees by module (not by task); (2) rebase not merge; (3) **commit at session boundaries — uncommitted changes are the only state that does not survive a session reset.** Two-to-three parallel sessions is the sustainable ceiling.
- **Why** — Rule (3) maps directly to T1's commit-on-branch step (NEW absorbed): "uncommitted = unrecovered." The discipline is canonical at the broader community level — gobbi's NEW absorbed-as-commit-step is community-aligned. Rule (1) is the counter-position to the user's Scope Contract choice ("uniform for every session" rather than "by module"). Surfacing it documents what the user is implicitly choosing.

**T1-E-3 — Jujutsu jj workspace is the cross-VCS prior art for "one isolated working surface per sub-agent."**

- **Source** — https://www.joshualyman.com/2026/02/demystifying-jujutsu-jj-workspaces/ (accessed 2026-05-23)
- **Insight** — jj workspaces are revision-anchored (not branch-anchored) working copies, which the community frames as "an ideal unit of isolation for sub-agent driven development: one workspace per parallel task." The framing is identical to T1 in direction, with one architectural difference: jj's workspace is anchored at the *revision* level, so the workspace can move freely between branches without re-creation. Plugin ecosystems (`jasagiri/claude-jj-worktree`, `kawaz/jj-worktree`) intercept `git worktree` calls and convert to jj workspace operations.
- **Why** — Cross-VCS validation that T1 is the right direction. The shim ecosystem suggests T1's spec should be at the abstraction level "isolated working surface per session," not "git worktree at this path" — leaves room for jj substitution and future primitives. Practical answer: keep T1's spec phrased at the "git worktree (P2 unchanged)" level for clarity, but document at the boundary why this isn't fundamentally git-specific.

**T1-E-4 — The shim pattern proves the discipline travels at the agent boundary, not the git boundary.**

- **Source** — https://github.com/jasagiri/claude-jj-worktree + https://github.com/kawaz/jj-worktree (both accessed 2026-05-23)
- **Insight** — Open-source plugins implement a transparent layer-substitution: the calling surface (`git worktree add`) stays unchanged; the underlying primitive swaps to `jj workspace`. The discipline ("every session gets its own isolated working copy") lives at the Claude Code agent boundary, not at the git boundary.
- **Why** — Tells T1 where to place the discipline. The right anchor is Configuration Step 1 (the gobbi orchestration boundary), not the git skill (which is the implementation primitive). The git skill's P2 stays as-is; what changes is the trigger point for P2 (from Execution start to Configuration Step 1).

### Design questions (for Sub-step D)

**T1-DQ-1 — Session-memory survival under worktree removal.** Four candidate answers per the brief:
- (a) Wrap-up promotes session dir to main tree before worktree removal.
- (b) Session dir lives in main tree; worktree-side reads via absolute path.
- (c) Session dir lives in worktree; PR absorbs it on merge (session memory ships in the squash).
- (d) Hybrid — ephemeral artifacts in worktree, durable artifacts mirrored to main tree.

  Internal anchor: T1-I-1, T1-I-4, T1-I-5. External anchor: T1-E-1 (Claude Code docs explicitly defer cross-session state to the project), T1-E-2 (rule 3 — commit-at-session-boundaries). Each option implies a different routing rule for the (now-inverted-default) "use main tree absolute path" rule in `git/SKILL.md:33`.

**T1-DQ-2 — Configuration Step 1 row order.** Insert worktree creation as which row in `orchestration/SKILL.md:96-105`? Before or after the existing row 6 (session.json stamp)?

  Internal anchor: T1-I-2. The new ordering must produce a valid `git.worktreePath` to stamp during the same row 6, so worktree creation must complete before row 6 — i.e., a new row 5.5 (or row 5 promoted ahead, with state.json initialized later). Mechanism deferred to Execution.

**T1-DQ-3 — NEW absorbed: which commit message / footer trailer convention does the Preparation `generate-now` commit follow?**

  Internal anchor: T1-I-3 + `git/SKILL.md:57-60` (`AI-Provenance-Record:` trailer mandatory for AI-authored commits). The committer is the manager (or a manager-proxied executor). Existing conventions cover this — no new convention required, but the design must say it.

---

## T2 — Matrix + Load-Directives validator

### Internal insights

**T2-I-1 — The implicit role × phase × required-skills information is currently scattered across at least four locations.**

- **Source** — `gobbi/SKILL.md:21-30` (Session Bootstrap Order step 1 — manager's 6 core skills); `delegation/SKILL.md:30-101` (Load Directives 4-tier block, the canonical template); `.claude/agents/{leader,executor,evaluator,assistant,manager}.md` (each role's "Before You Start" + "Load per phase" sections); each individual loop skill's "Inputs" or "Loaded skills" sections (e.g., `ideation/SKILL.md`, `preparation/SKILL.md`).
- **Insight** — The information IS in the codebase but it is distributed. A reader assembling the canonical answer to "what does an assistant load in MEMORIZATION" must read at least three files (`agents/assistant.md` § "Before You Start" + § "Lifecycle phase ownership", `delegation/SKILL.md` Load Directives Block, `memorization/SKILL.md`). No single file has the matrix.
- **Why** — T2's deliverable IS the matrix that collapses these four locations into one canonical reference. Sub-step D must decide which file owns the matrix.

**T2-I-2 — Delegation prompts are hand-authored, not templated — Load Directives are reconstructed each dispatch.**

- **Source** — `delegation/SKILL.md:44-54` (per-role templates at `delegation/templates/{role}.md` — "filled out literally"; "Every `<<slot>>` is replaced with the actual value"); `delegation/SKILL.md:101-107` (no mention of mechanical generation); empirical: the prompt the leader received this session (visible in transcript line 164, ~6,500 lines of prompt text) shows hand-curated Load Directives with task-specific mistakes pre-selected.
- **Insight** — There is no validator anywhere in the dispatch pipeline. The manager constructs the Load Directives block from memory + the per-role template. Memory failures (T2's empirical witness, 3 of 7 mistakes) are exactly what the matrix + validator addresses.
- **Why** — Confirms T2's validator goes at the manager-side pre-dispatch step. If templates were programmatic, the matrix could embed in the template itself; since they aren't, the validator must be a separate manager-invoked check (reading the prompt, parsing tier-3, comparing against the matrix).

**T2-I-3 — Three of the 7 promoted mistakes ARE empirical evidence of the (D+L) composite, with a fourth narrowly avoiding it.**

- **Source** — `mistakes/memorization-delegation-prompts-must-load-memorization-skill.md:29` ("The manager assumed the assistant would load the memorization skill because it was present in the project's skills directory" — (D) docs gap + (L) lazy-load); `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md:36` ("The manager constructed the iter2 revision brief from memory" — pure (L)); `mistakes/leader-iter2-verification-claim-without-evidence.md:23-25` ("substituting one set of non-canonical vocabulary with another" — (L) without checking the canonical source).
- **Insight** — Each mistake's "Corrected approach" is essentially "read the canonical source freshly." T2 provides the canonical source (the matrix) AND a validator that mechanically enforces the read. The artifact that would have prevented `memorization-delegation-prompts-must-load-memorization-skill.md` is a row in the matrix saying `(assistant, memorization) → [principles, mistake, memorization, {loop}/SKILL.md]` AND a validator that fails the dispatch when tier-3 is missing any of those.
- **Why** — Closes the empirical loop: the user-locked (D+L) composite (Scope Contract) is mechanically addressable by T2's matrix + validator combination. No other root cause needs intervention at this layer.

**T2-I-4 — Workspace-level `.claude/settings.json` already permits a per-skill enumeration, suggesting the matrix could be machine-readable.**

- **Source** — `.claude/settings.json:3-25` (permissions.allow lists `Skill(gobbi)`, `Skill(orchestration)`, … for all 16 skills + `Agent(manager)`, `Agent(leader)`, etc.).
- **Insight** — The permissions array is the closest existing thing to a structured skills enumeration. It's flat — no role × phase dimension — but it demonstrates the project already accepts JSON-as-config for skill enumeration. A JSON matrix at `.claude/skills/delegation/required-skills-matrix.json` (or equivalent) is consistent with the existing data shape.
- **Why** — Informs Sub-step D format question: machine-readable JSON (validator-friendly) vs human-readable Markdown table (discoverable from docs). Either works; the JSON option naturally validates against existing JSON-handling utilities. The MD option is more readable; the JSON option is more enforceable.

**T2-I-5 — Six of the 7 promoted mistakes are domain `process`; the validator design must avoid being yet another self-discipline gate.**

- **Source** — `find .gobbi/projects/gobbi/mistakes/ -name '*.md'` reveals 7 files; 6 have `domain: process` in frontmatter (the 7th is `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` with `domain: docs-sync`).
- **Insight** — Process mistakes recur because the discipline is textual ("MUST load," "MUST cite"). T2's validator must move enforcement from textual to mechanical — a script the manager runs before dispatch, not a sentence in `delegation/SKILL.md` that says "the manager verifies." `mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md` is the parallel anti-pattern witness: a documented contract assumption that wasn't mechanically verified.
- **Why** — Directly constrains T2's validator design: mechanical, not textual. Hand-rolled `jq` / `bash` / `node` script at `.claude/scripts/validate-load-directives.sh` (analogous to `session-start.sh` shape) — not a `delegation/SKILL.md` § "self-check" section.

### External insights

**T2-E-1 — RBAC matrix as single source of truth — anti-drift pattern directly applicable.**

- **Source** — https://www.osohq.com/learn/rbac-role-based-access-control (accessed 2026-05-23)
- **Insight** — RBAC literature centers on a role-permission matrix as authoritative single source of truth. The drift problem ("roles drift away from their original purpose; permissions added, rarely removed") is structurally identical to T2's witness pattern. The architectural solution: ONE location every consumer reads from (backend, frontend, microservices, audit logs).
- **Why** — Anchors T2's matrix design pattern in mature prior art. The canonical location = the analogue of the IdP / config file / DB row. Surfaces to Sub-step D the discoverability question: where in the gobbi skill tree does it live so every consumer (manager, leader, executor, evaluator, assistant) reads from it.

**T2-E-2 — commitlint defines the validator-at-pre-dispatch pattern at scale.**

- **Source** — https://commitlint.js.org/guides/local-setup.html + https://github.com/conventional-changelog/commitlint (both accessed 2026-05-23)
- **Insight** — commitlint enforces conventional-commit structure via a `commit-msg` git hook + declarative config (`commitlint.config.js`) with required fields, per-field rules, and a structural validator at the lifecycle anchor point (commit-msg, NOT pre-commit, NOT CI). Husky / `espressif/conventional-precommit-linter` wire the hook to the lifecycle. The pattern: declared schema + declarative rules + validator + lifecycle anchor.
- **Why** — Maps cleanly to T2's pre-dispatch validator. The "lifecycle anchor" answer: pre-dispatch (analogous to commit-msg) — NOT manager's discretion (analogous to user reviewing each commit), NOT CI / post-fact. Schema-as-config (commitlint.config.js → matrix.json / matrix.md) is the canonical separation.

**T2-E-3 — LangGraph deep-agents publishes the "skills catalog in system prompt" pattern.**

- **Source** — https://docs.langchain.com/oss/python/deepagents/skills + https://pessini.medium.com/stop-stuffing-your-system-prompt-build-scalable-agent-skills-in-langgraph-a9856378e8f6 (both accessed 2026-05-23)
- **Insight** — LangGraph's first-class skills system: the system prompt includes a structured catalog (name, description, tags, supporting file names) — small enough to include in every request — and detailed instructions load on demand. The catalog IS the system prompt's enumeration of available skills. This is the architecture gobbi is reaching for: per-skill files at the leaves + a structured catalog at the top.
- **Why** — Provides T2's matrix shape: a table with rows per skill (name + description + tags + file path), plus a join key for role × phase. The catalog is read on every dispatch (just as LangGraph reads it on every request). The matrix is the catalog; the Load Directives Block in each prompt is the per-dispatch selection from the catalog.

**T2-E-4 — AutoGen + LangChain show the auto-validation + auto-retry pattern as the upper-tier enforcement option.**

- **Source** — https://www.truefoundry.com/blog/autogen-vs-langgraph (accessed 2026-05-23)
- **Insight** — AutoGen registers tools with Pydantic schemas; LangChain/LangGraph validate agent outputs against schemas and auto-retry on invalid responses. The architectural pattern: declarative schema + structural validator + auto-correction loop. Stronger than commitlint's "fail with structured error" — the system self-corrects.
- **Why** — Informs T2's design choice between (a) commitlint-style "validator blocks; manager re-authors" and (b) LangChain-style "validator auto-amends prompt + re-dispatches." Both are validated framework-level patterns. For gobbi where the manager is in the same context as the validator, option (a) is the cheaper match — but Sub-step D should surface (b) as an alternative that the user can pick.

### Current implicit role × phase matrix (best empirical reconstruction)

Reconstructed from `delegation/SKILL.md`, the 5 agent specs, the 6 loop skills, and the per-loop MEMORIZATION procedure. Rows = (role, phase). Cells = the canonical tier-3 Skills the dispatch's Load Directives must enumerate. Tier 1 (`principles`) and Tier 2 (project rules) are mandatory for every dispatch and omitted here for brevity. Tier 4 (mistakes) is task-specific and not part of the role × phase matrix.

| Role | Phase | Tier-3 Skills required (canonical, per current docs) |
|---|---|---|
| **manager** | Configuration (Step 1) | `principles`, `orchestration`, `discussion`, `delegation`, `git`, `mistake`, `gobbi` (per `gobbi/SKILL.md:23-28`) |
| **leader** | Ideation DISCUSSION/WORK | `mistake`, `orchestration/workflow/ideation.md`, `ideation/SKILL.md`; load `research/SKILL.md` for Sub-step C |
| **leader** | Preparation DISCUSSION/WORK | `mistake`, `orchestration/workflow/preparation.md`, `preparation/SKILL.md` |
| **leader** | Research (standalone) | `mistake`, `research/SKILL.md` |
| **leader** | Planning DISCUSSION/PLAN_DRAFT | `mistake`, `orchestration/workflow/planning.md`, `planning/SKILL.md` |
| **executor** | Execution WORK | `mistake`, `orchestration/workflow/execution.md`, `execution/SKILL.md`; `git/SKILL.md` if branch work; domain-relevant skills (e.g., `_typescript`, `_bun`) |
| **evaluator** | EVALUATION (any loop) | `mistake`, `evaluation/SKILL.md`, the phase-specific evaluation child doc (e.g., `ideation/evaluation.md`, `execution/evaluation.md`) |
| **assistant** | MEMORIZATION (Ideation / Preparation / Planning / Execution) | `mistake`, **`memorization/SKILL.md`** (hard gate per `delegation/SKILL.md:38-40`), `{loop}/SKILL.md § MEMORIZATION Phase` |
| **assistant** | Wrap-up WORK | `mistake`, `wrap-up/SKILL.md` |
| **assistant** | Wrap-up MEMORIZATION | `mistake`, `wrap-up/SKILL.md`, `memorization/SKILL.md` |
| **assistant** | Lookup mode (read-only) | `mistake` only; domain skills loaded on demand per the brief |

**Gaps / drift this matrix surfaces (Sub-step D input)**:
1. The `_typescript` and `_bun` skills referenced in some mistakes don't exist in `.claude/skills/` (verified earlier). The executor's row above is partially aspirational.
2. There's no canonical name for the "domain skill loaded on demand" position — the matrix should accept variable cells with a "domain skills here" placeholder so the validator only checks the fixed core.
3. The codex skill exists (`mistakes/memorization-delegation-prompts-must-load-memorization-skill.md` is the result of its first Preparation `generate-now`) but isn't yet in any default role's Load Directives. Codex-using dispatches (e.g., codex evaluator) need a per-task addition.

### Design questions (for Sub-step D)

**T2-DQ-1 — Matrix location.** Candidates:
- (a) `gobbi/SKILL.md` § new "Role × Phase Load Matrix" subsection (Session Bootstrap Order's natural extension).
- (b) `delegation/SKILL.md` § new "Required Skills Matrix" subsection (closest to the Load Directives Block — same doc).
- (c) Standalone `delegation/required-skills-matrix.md` (separate file, single purpose).
- (d) Machine-readable `.claude/skills/delegation/required-skills-matrix.json` (validator-friendly).

  Internal anchor: T2-I-1, T2-I-4. External anchor: T2-E-1, T2-E-3. The user must choose the location based on the trade-off readability vs validator-friendliness.

**T2-DQ-2 — Validator location + action.** Three candidate enforcement layers:
- (a) Manager-side pre-dispatch script (canonical, hand-runnable, analogous to commitlint).
- (b) `delegation/SKILL.md` § "Pre-dispatch checklist" textual rule (cheaper, but textual — fails Internal-I-5's mechanical-over-textual constraint).
- (c) Auto-amend mode (validator mutates the prompt — LangChain-style).

  Internal anchor: T2-I-2, T2-I-5. External anchor: T2-E-2, T2-E-4. Recommendation skew (without locking, just for surfacing): (a) is the empirically-validated middle ground; (b) is what's there now and it failed; (c) is upper-tier but heavier to build.

**T2-DQ-3 — Validator scope: tier-3 Skills only, or also tier-2 rules + tier-4 mistakes?**

  Internal anchor: the brief explicitly says "tier-3 mechanically validatable against the matrix." Confirmation question — Sub-step D should confirm with the user that scope stays narrow (tier-3 only), since tier-4 mistakes are task-specific and the matrix can't reasonably enumerate them.

---

## T3 — PostToolUse hook + reconstructor

### Internal insights

**T3-I-1 — `agents[]` is empirically unpopulated in the prior session — 1 entry after 17+ spawns.**

- **Source** — Direct `python3 -c "len(d['agents'])"` on `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/session.json` → returns `1`. The single entry is the manager seed (type `manager`, step `configuration`, phase `null`, tokensUsed all `0`).
- **Insight** — The manager's documented append discipline (`orchestration/SKILL.md:103` row 6 — "The manager appends specialist entries to `agents[]` as the workflow progresses"; § Workflow Metadata "agents update points") never fires in practice. The data-loss rate is ~95% — 16 of 17 spawns lost. This is the empirical witness Scope Contract locked.
- **Why** — Sets the success metric for T3 mechanism (c): ≥ 90% population rate post-fix. Establishes that the failure is not at the schema (template is complete) but at the writer (manager forgets).

**T3-I-2 — The transcript JSONL's `toolUseResult` payload is empirically rich — every `session.json.agents[]` field except `step/phase/iter/model` is satisfiable from it.**

- **Source** — Empirical inspection of `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` line 165 (the `tool_result` line corresponding to the first leader spawn at line 164). The `toolUseResult` top-level field contains: `status, prompt, agentId, agentType, content, totalDurationMs, totalTokens, totalToolUseCount, usage{input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens, cache_creation, ...}, toolStats{readCount, searchCount, bashCount, editFileCount, linesAdded, linesRemoved, otherToolCount}`. The `usage` block precisely matches `tokensUsed.{input, output, cacheRead, cacheCreation}` from session.template.json:39-44.
- **Insight** — Both T3 mechanisms (hook + reconstructor) consume the same authoritative source. The reconstructor reads the transcript file directly; the hook reads the transcript file too (it has `$CLAUDE_TRANSCRIPT_PATH` in its stdin payload — see T3-E-1). The hook does NOT depend on the impoverished public `tool_result` field being adequate, because the hook can route through the transcript.
- **Why** — De-risks Sub-step D. The hook contract verification (CP-4.1-β) doesn't need to resolve "is `tool_result` enough" — the answer is "even if it isn't, `transcript_path` is in the hook payload, and the rich toolUseResult is one `jq` away."

**T3-I-3 — `step`, `phase`, `iter`, `model` are NOT in the toolUseResult — they must come from the delegation prompt OR the tool_use `input.model` field.**

- **Source** — Same empirical inspection. `toolUseResult` has `agentId`, `agentType` (= subagent_type from the dispatch). Line 164's `tool_use.input` has `subagent_type, description, model, prompt`. The `prompt` text starts with structured headers ("Your phase: ideation", "Your iteration: 1", "Your sub-step: C") — visible in the prior leader's prompt and in this very dispatch (line 1 of the brief).
- **Insight** — A reconstructor / hook that wants to populate `step / phase / iter` cleanly must either: (a) parse the prompt text for the structured headers, or (b) rely on a stricter delegation-prompt convention (e.g., a JSON header comment block at the top of every prompt encoding the metadata as data, not prose). Option (a) works on existing prompts; option (b) requires a delegation/SKILL.md edit.
- **Why** — Surfaces a Sub-step D design question. The brief says "schema confirmed sufficient as-is" — confirming. But the *population mechanism* needs to extract step/phase/iter from somewhere, and that somewhere should be made explicit.

**T3-I-4 — `.claude/hooks/session-start.sh` is the precedent — bash-with-jq pattern for hook authoring.**

- **Source** — `.claude/hooks/session-start.sh:1-80` (79-line bash script; uses `set -euo pipefail`; reads stdin JSON via `cat`; processes via `jq -r @sh` for shell-safe export-line emission; appends to `$CLAUDE_ENV_FILE`; passthrough re-exports for env vars).
- **Insight** — The shape is well-established: shebang `#!/usr/bin/env bash`, strict mode, `jq` for JSON parsing, careful quoting (`@sh` operator), explicit guards (writability check + non-empty stdin check), narrow scope (env file mutation only). The T3 PostToolUse hook should clone this shape — bash + jq, single-file, explicit guards.
- **Why** — Locks the authoring convention. Node / Python would be inconsistent with the existing precedent and require additional runtime dependencies. Bash + jq is sufficient (jq is already a hard dependency per session-start.sh).

**T3-I-5 — `.claude/settings.json` hook registration is one-block-per-event; matcher pattern is regex/alternation.**

- **Source** — `.claude/settings.json:31-39` (`SessionStart` block with `matcher: "startup|resume|clear|compact"` and a single hook entry of `type: "command"` + `command: ".claude/hooks/session-start.sh"`).
- **Insight** — Adding T3's PostToolUse registration is a single 5-line block addition to `.claude/settings.json` `hooks.*`. Matcher = `"Task"` (per T3-E-1 — official matcher pattern). Path = `.claude/hooks/post-tool-use-agents.sh` (mirroring the session-start naming). No conflict with the existing SessionStart registration.
- **Why** — Confirms the integration is mechanically low-risk. The registration block is small, the surface area is narrow, and the analogue with the existing SessionStart registration is exact.

### External insights

**T3-E-1 — Official PostToolUse hook input schema includes `tool_name`, `tool_input`, `tool_use_id`, `tool_result`, AND `transcript_path`.**

- **Source** — https://code.claude.com/docs/en/hooks (accessed 2026-05-23)
- **Insight** — Per the official docs, every PostToolUse hook receives common fields (`session_id`, `transcript_path`, `cwd`, `permission_mode`, `effort`, `hook_event_name`, optional `agent_id`/`agent_type` for subagent context) AND tool-specific fields (`tool_name`, `tool_input`, `tool_use_id`, `tool_result`). The `tool_result` shape in the docs example is a basic `{"type": "text", "text": "..."}` — narrower than the rich `toolUseResult` in the transcript. Matcher pattern `"Task"` filters PostToolUse to only fire after Agent (Task) tool calls.
- **Why** — Direct verification of the CP-4.1-β hook contract. The contract: PostToolUse fires + receives `tool_input` (subagent_type, prompt, model, description) + `tool_result` (basic shape per docs) + `transcript_path` (route to rich payload). T3 mechanism (c) is fully supported.

**T3-E-2 — Empirically the transcript JSONL contains a top-level `toolUseResult` field with the full subagent telemetry, including usage tokens.**

- **Source** — Empirical inspection 2026-05-23 of `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` line 165. Method: `python3 -c "import json; obj = json.load(open('<path>')); print(obj['toolUseResult'].keys())"`. Result documented in full at `staging/references/claude-code-transcript-tooluseresult-empirical.md`.
- **Insight** — The hook needs only `tool_use_id` (in its stdin) + `$CLAUDE_TRANSCRIPT_PATH` (in its stdin's common fields) to extract the full subagent telemetry: `jq -r '.toolUseResult | select(.tool_use_id == "<id>") | {agentId, agentType, totalDurationMs, totalTokens, usage}'` (path may need adjustment for actual JSONL structure — `tool_use_id` is matched against the result line's `message.content[].tool_use_id`).
- **Why** — Closes the verification gate. The richness gap between public `tool_result` and empirical `toolUseResult` is real but not blocking — the hook reads the transcript to recover the rich shape.

**T3-E-3 — Claude Agent SDK documents `TaskOutput` interface as `{result, usage: {input_tokens, output_tokens}, total_cost_usd?, duration_ms?}` — the public-API-stable surface.**

- **Source** — https://code.claude.com/docs/en/agent-sdk/hooks (accessed 2026-05-23)
- **Insight** — The SDK's documented `TaskOutput` is narrower than the empirical `toolUseResult` (no cache_read / cache_creation / toolStats / agentId / agentType). This is the **forward-compatibility surface**: future Claude Code versions are guaranteed to expose `result + usage{input_tokens, output_tokens}` from the Task tool; everything else is empirical and could change.
- **Why** — The T3 hook design should treat the SDK surface as the baseline and the transcript as the bonus. Defensive `jq` patterns (`// "fallback"`) ensure the hook survives if the transcript shape changes.

**T3-E-4 — `PostToolUse` (not `SubagentStop`) is the right lifecycle event for shell-command hooks — `SubagentStop` is SDK-only.**

- **Source** — https://claudefa.st/blog/tools/hooks/hooks-guide (accessed 2026-05-23) + the SDK hooks doc.
- **Insight** — `SubagentStop` is documented as a parallel lifecycle event with richer subagent-specific input (`agent_id`, `agent_transcript_path`, `stop_hook_active`). However, `SubagentStop` is **SDK-only** (Python + TypeScript SDK callbacks) — it does NOT work as a shell-command hook via `.claude/settings.json` `hooks.*`. Gobbi uses shell-command hooks (`session-start.sh`); switching to SDK would be a heavier architecture change.
- **Why** — Eliminates a candidate alternative. `PostToolUse` + matcher `"Task"` is the right choice for shell-command-hook continuity. `SubagentStop` is deferred / out of scope.

### Hook contract verification (METHOD + RESULT)

**Question (per CP-4.1-β)**: Does the Claude Code PostToolUse hook receive (a) tool_use input JSON only, (b) tool_result JSON only, or (c) both? Is the `<usage>` block parseable from the result payload?

**Method**:
1. **Official documentation** — fetched https://code.claude.com/docs/en/hooks and https://code.claude.com/docs/en/agent-sdk/hooks via WebFetch (both accessed 2026-05-23).
2. **Empirical transcript inspection** — read `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl` lines 164-165 (a real Agent tool_use + tool_result pair from the prior session), extracted with `python3 -c "import json; ..."`.
3. **Cross-reference** — secondary sources (TaskOutput interface description in agent-SDK + community blog at claudefa.st/blog/tools/hooks/hooks-guide).

**Result — CLOSED**:

The PostToolUse hook **receives both tool_input AND tool_result**, along with common fields including `transcript_path`, `session_id`, and `agent_id`/`agent_type` when applicable.

- `tool_input` contains the dispatch parameters (`subagent_type`, `description`, `model`, `prompt` for Task / Agent tool calls).
- `tool_result` contains the result/output. Per the official docs, the `tool_result` example is a basic `{"type": "text", "text": "..."}` — the documented public shape.
- **Empirically** the transcript captures **more** than the documented public surface: a top-level `toolUseResult` field with full `{status, prompt, agentId, agentType, content, totalDurationMs, totalTokens, totalToolUseCount, usage{input_tokens, cache_creation_input_tokens, cache_read_input_tokens, output_tokens, ...}, toolStats}`. The hook can read this via `$CLAUDE_TRANSCRIPT_PATH` (which IS in the hook's stdin payload).
- Token usage IS parseable — empirically as `toolUseResult.usage.{input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens}`; per the SDK as `TaskOutput.usage.{input_tokens, output_tokens}` (narrower public-stable subset).
- v2.1.119+ adds `duration_ms` directly to the hook input.
- Matcher pattern `"Task"` is the correct filter for "fire after every Agent spawn."

**Verdict**: T3 mechanism (c) — PostToolUse hook + shell-script reconstructor — is **fully supported by the verified contract**. Sub-step D can proceed to lock the T3 design.

**Caveat for Sub-step D**: the rich `toolUseResult` is empirical (currently observable but not in the documented public API). The hook script should:
1. Prefer the rich transcript payload (full telemetry).
2. Fall back to the documented `tool_result` shape when transcript fields are absent.
3. Use defensive `jq // "fallback"` patterns throughout (per the precedent in `session-start.sh`'s `if .field != null` guards).

### Design questions (for Sub-step D)

**T3-DQ-1 — Hook authoring stack: bash+jq, jq-heavy bash, or node.**

  Internal anchor: T3-I-4 (`session-start.sh` is bash+jq). Recommendation skew: bash+jq for consistency with the existing hook. Reconstructor at `.claude/scripts/reconstruct-agents.sh` similarly bash+jq. Both files clone the strict-mode + guard pattern from `session-start.sh`.

**T3-DQ-2 — Reconstructor algorithm: scan-and-replace, append-only, or verify-and-fix.**

  Internal anchor: T3-I-1 (the empirical state is 1 entry where there should be N+1 — so the reconstructor must FILL, not replace). T3-E-2 (the transcript is the authoritative source). Three candidates:
  - (a) Scan-and-replace: read transcript, generate fresh agents[] from scratch, overwrite.
  - (b) Append-only: read existing session.json.agents[], find missing entries by `agentId`, append them in transcript-chronological order.
  - (c) Verify-and-fix: enumerate transcript-discoverable spawns; for each, upsert into agents[] keyed by `id`; report any session.json entry whose `id` is NOT in the transcript (orphan).
  
  Recommendation skew: (c) — robust to both empty-and-rebuild and partial-population scenarios; idempotent.

**T3-DQ-3 — Hook scope: only successful Agent calls (PostToolUse), or also failed (PostToolUseFailure)?**

  Internal anchor: T3-E-4 mentions `PostToolUseFailure` as the failed-tool parallel. Sub-step D must decide whether the hook fires on failure too — if yes, agents[] entries get a `status: "failed"` (extending the template's implicit happy-path assumption).

**T3-DQ-4 — Where does the hook get `step / phase / iter / model`?**

  Internal anchor: T3-I-3. Three candidates:
  - (a) Parse the prompt text for structured headers (`grep -E "Your phase:" $tool_input.prompt`).
  - (b) Require delegation prompts to include a JSON header block at the top (extends `delegation/SKILL.md`).
  - (c) Extract from `tool_input.model` (model) + parse prompt for step/phase/iter (a + c hybrid).

  Recommendation skew: (c) — minimal change, leverages existing headers visible in this very brief.

---

## Cross-cutting observations

1. **T1 and T2 share a single deep structural problem: implicit conventions that fail silently.**
   - T1's empirical witness (symlink gap) = an implicit convention that `cwd` flips at Execution start was never made explicit until it failed.
   - T2's empirical witnesses (3 mistakes) = an implicit convention that "every loop skill documents its own load requirements" failed silently when the manager didn't read each loop skill before dispatching.
   - The fix shape for both is the same: make the implicit explicit (T1: explicit worktree at Configuration Step 1; T2: explicit matrix at a discoverable path).

2. **T2 and T3 share a writer-discipline failure with the same mechanical-over-textual fix.**
   - T2: manager forgets to append `memorization/SKILL.md` → mechanical pre-dispatch validator.
   - T3: manager forgets to append agents[] entries → mechanical PostToolUse hook.
   - Both replace "MUST do X" textual rules with a script the runtime invokes. The pattern is consistent and should be called out in Sub-step D design rationale.

3. **The transcript JSONL is the single biggest empirical asset gobbi has and is currently under-utilized.**
   - It contains: every tool_use + tool_result pair with full delegation prompts, every subagent's full output, every token-usage block, every tool stats counter (read/write/bash counts), every subagent's `agentId` + `agentType`.
   - T3 directly leverages it (hook + reconstructor).
   - T2 could also leverage it (the validator could verify Load Directives compliance against the prompt text in transcript line 164, post-fact — but the user-locked scope is pre-dispatch only).
   - Future opportunity (out of scope this session — flag for cross-cutting backlog): a session-wide "telemetry skill" that reads the transcript and produces per-session reports.

4. **One previously-undiscussed constraint surfaced: empirical-vs-documented Claude Code schema drift.**
   - The transcript's `toolUseResult` is richer than the documented `TaskOutput` (T3-E-2 vs T3-E-3).
   - Implication: any tooling gobbi builds against the empirical shape risks breaking on future Claude Code versions.
   - Mitigation already encoded in the verification result: defensive `jq` patterns, prefer rich-then-fallback, document the dependency.
   - This is NOT a Scope Contract change — just a Sub-step D constraint to record explicitly.

5. **No new framing-overturning evidence emerged.**
   - The Scope Contract (worktree-first uniform; (D+L) composite; (c) hook + reconstructor; hook contract verified BEFORE Sub-step D) holds.
   - All design questions surfaced above are inside-the-Scope-Contract decisions for Sub-step D — none requires re-opening Sub-step A or B.

6. **One narrow new mistake-candidate worth recording as Memorization input (not stage now — Memorization-phase action)**:
   - The leader's empirical inspection of the prior session's transcript was the right move per Principle 1 (think before acting) and Principle 7 (no completion claims without fresh verification evidence). The default at Sub-step C entry would have been to consult only the docs; the Iron-Law-compliant move was to verify against the empirical transcript. This is a positive pattern, not a mistake — but the inverse (a leader citing the docs without empirical verification) is the recurrent pattern across the 3 process mistakes. Surfacing for the assistant to consider during MEMORIZATION.

7. **Read-only verification — no scope drift in the staged references.**
   - 12 reference files staged. Each addresses one of the 12 confirmed external insights (4 per task). No file addresses an out-of-scope item (no Codex-CI / Auto-mode silence / chat-mode redesign / etc.).
