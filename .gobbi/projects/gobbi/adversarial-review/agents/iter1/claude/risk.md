# Risk Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md`. Risk = blast radius if these agent definitions are wrong, reversibility of the refactor, security surface, rollback, two-week smell test.

## Memory reads

- `agents/*.md` (full)
- prompt context (refactor branch `refactor/257-skills-agents-rules`)
- `delegation/SKILL.md`, `evaluation/SKILL.md`
- `ls .gobbi/projects/gobbi/skills/` (mistake skill confirmed absent — see consistency.md F-C-05)

## Locked Frame (Stage 1)

### S-R-1: Rollback path identified
- [ ] If the new taxonomy proves wrong, can the v0.4 agents be restored? Are they archived rather than deleted?
- [ ] Rollback does not require perfect coordination

### S-R-2: Blast radius enumerated
- [ ] Files affected listed (every skill, every workflow doc, every plugin agent that references the old names)
- [ ] Backwards-compat impact stated

### S-R-3: Security surface delta
- [ ] Tool surfaces in frontmatter are minimum-privilege
- [ ] Manager `tools: "*"` is justified
- [ ] Leader `Write` access is gated by policy — policy is enforceable

### S-R-4 (adversarial): Scope drift — the bundle touches more than the 5 files
- [ ] Bundle does not silently change adjacent skills
- [ ] Status enum changes ripple-checked against delegation/SKILL.md

### S-R-5: Concurrency / race surface
- [ ] Parallel subagent spawns (research, evaluation) don't share mutable state
- [ ] Memorization writes are sequenced (no two memorizers competing)

### S-R-6: Privacy / data retention (Coverage Matrix Risk+Consistency)
- not-applicable: agent definition files contain no PII; session memory rules live elsewhere

### S-R-7: License / IP (Coverage Matrix Risk+Consistency)
- not-applicable: roles defined in-house; no external borrowed text

### S-R-8: Cost / budget impact (Coverage Matrix Performance+Risk)
- covered in performance.md F-Pf-01/F-Pf-02

### S-R-9: Two-week smell test
- [ ] In two weeks, will a maintainer regret these definitions? Are there load-bearing future-self promises?
- [ ] Are there "we'll improve this later" hooks?

### S-R-10 (adversarial): Manager fragility — single point of failure
- [ ] If the manager misroutes (e.g., omitted phase per F-P-06), is there recovery?
- [ ] Can a subagent self-escalate when miscategorized?

### S-R-11 (adversarial): Self-evaluation hole — Principle 2 violation surface
- [ ] Where can the manager produce output and then evaluate it (small edits exception)?
- [ ] Where can a leader's research feed an evaluator without an independence break?

### S-R-12: Mandatory skill load failure mode
- [ ] What happens if a referenced skill (e.g., `mistake`) does not exist? Hard fail? Silent skip?

## Per-scenario per-check results (Stage 2)

### S-R-1
- (a) Rollback path: **NOT IN BUNDLE** — prompt notes v0.4 agents are retired (`.claude/agents/` contains `__pi.toml`/`__executor.toml`/etc. per gitStatus). Whether they are deletable vs archived isn't stated in the bundle. Branch `refactor/257-skills-agents-rules` is the witness; git revert is the rollback. **Acceptable for a branch-based refactor**
- (b) Coordination-free rollback: **YES** — git revert works for one developer

### S-R-2
- (a) Files affected: **NOT ENUMERATED in bundle** — must be inferred from grep across the repo. The bundle does not warn readers about ripple targets → **F-R-01** (Medium)
- (b) Backcompat: **N/A** — solo-user per memory `feedback_solo_user_context`

### S-R-3
- (a) Min-privilege tools: **MOSTLY** — assistant good (R-only), evaluator good (R-only), executor has Write+Edit (needed), leader has Write (policy-gated — see F-S-02), manager has `tools: "*"` which is everything
- (b) Manager `tools: "*"`: **HALF-JUSTIFIED** — manager.md:15 "trivial single-file reads… single-line edits… workflow bookkeeping" requires a narrower set. `*` is broader than the stated need → **F-R-02** (Medium)
- (c) Leader Write policy enforceable: **NO** — see F-S-02; only post-hoc evaluator catches violations

### S-R-4 (adversarial)
- (a) Bundle doesn't change adjacent skills: **NOT VERIFIED** — review limited to 5 files; gitStatus shows .claude/settings.json + .codex/AGENTS.md + .codex/config.toml are also modified on this branch. Cannot judge their consistency from the 5 files alone. Flag as scope-drift risk → **F-R-03** (Medium)
- (b) Status enum ripple-check: see F-C-01/F-C-02 — consistency perspective owns this

### S-R-5
- (a) Parallel subagents no shared mutable state: **YES** — delegation/SKILL.md anti-pattern "parallel implementation" forbids overlap; agent files reflect it
- (b) Memorization sequenced: **YES** — manager.md:84 spawns Memorization as a single delegation; no concurrent memorizers

### S-R-9
- (a) Two-week regret: **YES, LIKELY** — F-U-01 ambiguity, F-P-05 missing role, F-C-01 schema mismatch will all surface within hours of first real workflow run. The bundle as written is not ready for production use → **F-R-04** (High)
- (b) Load-bearing future-self promises: **YES** — `agents/evaluation/{perspective}.md` references files that do not exist (F-U-03). Promises a future doc set → **F-R-05** (Medium)

### S-R-10 (adversarial)
- (a) Recovery from misrouting: **NO** — when manager loads the wrong phase doc (F-P-06: Preparation omitted), there is no self-correction mechanism; subagent has no way to say "you should have loaded Preparation". Hard-fail vector → **F-R-06** (High)
- (b) Subagent self-escalate: **PARTIAL** — `NEEDS_CONTEXT` exists but is for missing context, not "you misclassified the phase"; manager has no enum entry meaning "I (the subagent) think you sent me the wrong brief"

### S-R-11 (adversarial)
- (a) Manager self-evaluation: F-P-07 + F-S-02 surface this
- (b) Leader→evaluator independence: leader produces research artifact; evaluator reads it. They are different agents (no Principle 2 break). Acceptable

### S-R-12 (adversarial)
- (a) Missing-skill failure mode: **NOT DEFINED** — every agent file says "Load `mistake` skill" but `mistake` doesn't exist in this worktree (verified). What happens? Each agent silently skips? Hard fails? Manager unsure. **Critical missing failure-mode spec** → **F-R-07** (High)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-R-01** | `general` | `process` | open | 50 | Medium | Bundle does not enumerate ripple targets; gitStatus shows .claude/agents/, .claude/settings.json, .codex/AGENTS.md also touched | Reader cannot audit blast radius from the bundle alone; manual git grep required |
| **F-R-02** | `assumption_risk` | `security` | open | 75 | Medium | manager.md:4 `tools: "*"`; manager.md:15 narrow stated needs (read, single-line edit, bookkeeping) | Privilege creep — manager has tool access far beyond stated need. If manager misbehaves, no tool-level guard |
| **F-R-03** | `general` | `process` | open | 50 | Medium | gitStatus shows .claude/settings.json + .codex/* modified; review scope is 5 files only | Adjacent files may have related but unverified changes; review coverage gap |
| **F-R-04** | `design_flaw` | `process` | open | 75 | High | F-U-01 ambiguity + F-P-05 missing role + F-C-01 schema mismatch + F-C-05 missing skill — all surface on first real run | Two-week test fails immediately. Bundle ships broken |
| **F-R-05** | `assumption_risk` | `docs-sync` | open | 75 | Medium | evaluator.md:39-42 lists 4 evaluation child-doc patterns (`skills/evaluation/{perspective}.md` etc.); only ideation/preparation/planning/execution/wrap-up `evaluation.md` per evaluation/SKILL.md phase-mapping exist — agent-evaluation child docs absent | Evaluator told to load a future doc set that may never exist; manual fallback unspecified |
| **F-R-06** | `design_flaw` | `process` | open | 75 | High | F-P-06 manager phase-table missing Preparation; subagents have no "phase-was-wrong" status | When manager misroutes, system silently does the wrong work; no rescue path |
| **F-R-07** | `design_flaw` | `process` | open | 75 | High | F-C-05 `mistake` skill absent; every agent mandates loading it; no missing-skill behavior defined | Spawned agents will fail at line 1 of their procedure with no recovery rule. Either hard-skip-silently (Iron Law violation) or hard-fail (no fallback) — both bad |

## Per-perspective verdict

**FAIL** — F-R-04, F-R-06, F-R-07 are each High/75 design flaws with concrete two-week-smell-test evidence. F-R-04 alone (combining other findings) sends the bundle's first real run into multiple failure modes. The bundle as written has too many hard-fail paths to ship.

## Low-confidence appendix

(none below threshold)
