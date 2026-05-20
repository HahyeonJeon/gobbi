# Aesthetics Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

Seed scenarios from ideation/evaluation.md Aesthetics, applied to the documentation artifacts under review:

1. **A new reader understands each skill from the file alone** — no need to load adjacent files first.
2. **Naming is accurate** — section names match content; no surprises.
3. **Project conventions followed** — heading style, blockquote-bold-principle pattern (per `__gobbi-convention.md`), backtick-formatted paths/commands.
4. **Every section earns its place** — no filler, no `TBD`/`TODO`.
5. **(adversarial)** — A skim leaves a wrong impression (headlines or first paragraphs that mislead).

Adversarial scenario: present (scenario 5).

## Per-scenario per-check results

**Scenario 1 — Self-evidence:** gobbi/SKILL.md opens with a clear identity statement ("You are the manager of this gobbi session"). principles/SKILL.md opens with "Canonical behavioral discipline for every gobbi agent." git/SKILL.md opens with "Git and GitHub workflow." All three answer "what is this?" in the first paragraph. **PASS.**

**Scenario 2 — Naming accuracy:** Spot-checked. `Session Bootstrap Order` describes what follows (numbered boot steps). `Forbidden Operations` lists forbidden ops. `Core Principles` (in git) reflects principle-level statements. **PASS.**

**Scenario 3 — Project conventions:**
- Blockquote-bold-principle pattern per `__gobbi-convention.md` § Formatting Rules: used in gobbi/SKILL.md "## Core Principles" (line 158+) and git/SKILL.md "## Core Principles" (line 39+). **PASS.**
- Backtick paths/commands: spot-checked — `gh`, `git`, `$CLAUDE_ENV_FILE`, `.gobbi/projects/{name}/sessions/...`, etc. all backticked. **PASS.**
- No `gobbi-` prefix on internal skills, single `_` for hidden, double `__` for internal — all 3 targets have no prefix (gobbi is interface-tier; git and principles are user-facing categories under v0.5.0 skill tree). **PASS** per the convention as currently scoped.

**Scenario 4 — Filler check:** Grep for `TBD`/`TODO`/`...` in the four files:
- principles/SKILL.md line 307: "Future work: a Red Flags table per principle..." — this is a deferred-work note, not a placeholder. Documented as A-A-01 below.
- No other `TODO` / `TBD` / `???` found.
- "Future work" sits at the document's tail as an acknowledged improvement vector. Borderline acceptable for a v0.5.0 release skill.

**Scenario 5 (adversarial) — Skim trap:**
- gobbi/SKILL.md table at line 110 ("Agent Taxonomy") lists "manager" with "Root session agent. Not Task-spawnable; this is the behavioral spec for the main agent." Clear.
- git/SKILL.md table at line 93 ("Role Boundaries"): manager creates worktrees, subagent commits in them. Headlines match the rule.
- principles/SKILL.md "Iron Law:" lines all phrased as imperative caps — consistent. **PASS.**

## Typed findings

### A-A-01 — principles/SKILL.md line 307 carries an explicit "Future work" tail

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: principles/SKILL.md line 307: "Future work: a Red Flags table per principle, listing the named rationalizations from each principle in scannable tabular form." This is an in-doc deferred-work marker in a v0.5.0 release skill. In project conventions, deferred work should live in `.gobbi/projects/<name>/backlogs/` or as a tracked issue, not as a paragraph in the skill itself. Two cross-perspective findings already flag this content (S-S-01 Structure: missing index; P-Perf-01 Performance: tabulate anti-rationalizations) — converging signal.
- **Remediation**: Either (a) implement the Red Flags table inline (closes S-S-01 too), or (b) move the deferred-work note to a backlog entry and remove the tail.

### A-A-02 — Mixed em-dash / en-dash usage across the three skills

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 25
- **Severity**: Low
- **Evidence**: All three files use em-dash (`—`) for parenthetical phrasing — consistent and readable. Spot-checked, no en-dash misuse found. **No finding** in this category once verified; included for completeness in case future authors mix styles.
- **Remediation**: None needed; keep em-dash convention.

### A-A-03 — gobbi/SKILL.md frontmatter says "MUST load at session start, session resume, after /clear, and after compaction" — uses bare slashes vs the convention's backticks

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md line 3 (frontmatter description): "...after /clear, and after compaction". `__gobbi-convention.md` § Formatting Rules states "Use backtick formatting (inline code) for command names — e.g., `gh`, `git`, `jq`". `/clear` is a Claude Code slash-command — by extension, command-like and a candidate for backticking. Currently not backticked in either gobbi/SKILL.md or `.claude/CLAUDE.md`. This is a project-wide micro-inconsistency, not local to Batch 4.
- **Remediation**: Either backtick `/clear` and `/compact` everywhere they appear, or accept the bare slash form and document it as an exception to the convention (slash-commands as plain text rather than code).

## Low-confidence appendix

- **L-A-01 (confidence 25)**: principles/SKILL.md uses both "agent" (singular, behavioral subject) and "every gobbi agent" (collective) throughout. No drift detected, but the term is overloaded — "agent" could mean role-spec, runtime, or the literal entity invoking the LLM. Likely false-positive (style preference).

## Verdict

**PASS** — All 3 in-scope findings are Low severity; none Critical, none High. Aesthetics is clean modulo the deferred-work tail.
