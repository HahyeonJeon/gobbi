# Aesthetics Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md`. Aesthetics here = readability, naming accuracy, convention adherence, polish gaps in the agent definitions themselves.

## Memory reads

- `agents/*.md` (full)
- `rules/__gobbi-convention.md` (naming convention)
- prior project memory note `feedback_path_formatting.md` (path backticking convention)

## Locked Frame (Stage 1)

### S-A-1: Names accurate and self-explanatory
- [ ] "leader" / "executor" / "evaluator" / "assistant" / "manager" — each name maps to a single, unambiguous concept
- [ ] No internal contradictions (same role with different names)

### S-A-2: Formatting follows project conventions
- [ ] Backticks for paths, env vars, command names (per `__gobbi-convention.md`)
- [ ] No emojis
- [ ] Blockquotes hold only the bold principle point per convention

### S-A-3: Section headings consistent across 5 files
- [ ] Same heading hierarchy
- [ ] Same section ordering

### S-A-4 (adversarial): A first-time reader skims and walks away with the wrong impression
- [ ] Each file's first 5 lines accurately summarize the role (no clickbait)
- [ ] The "out of scope" comes before the lifecycle (sets boundaries first)

### S-A-5: No placeholder text
- [ ] No TODO / TBD / XXX / "see below" without a below

## Per-scenario per-check results (Stage 2)

### S-A-1
- (a) Name uniqueness: **MOSTLY** — "leader" in industry parlance is "team lead / people manager" — gobbi uses it for "PI/PM/investigator/proposer". Risk of cold-reader confusion. Adversarial seed #7 confirms → **F-A-01** (Low)
- (b) Internal contradictions: **YES, ONE** — evaluator.md frontmatter line 12 lists 9 perspective names (`project, overall, architecture, performance, aesthetics, usage, consistency, risk, user`) but the canonical 7 in evaluation/SKILL.md are `Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk` (+ Overall as Stage 3). "architecture" ≠ "structure"; "user" ≠ "usage" — terminology drift inside one file relative to its parent skill → **F-A-02** (High)

### S-A-2
- (a) Backticks: **YES** — paths, skill names, env vars all backticked
- (b) No emojis: **YES** (one ❌ symbol in delegation/SKILL.md anti-pattern bullet, but that's outside our 5 files)
- (c) Blockquote convention: **YES** — followed where used

### S-A-3
- (a) Heading hierarchy: **YES** — all 5 use `##` / `###` consistently
- (b) Section ordering: **MOSTLY** — manager has Decision Discipline extra; executor has TypeScript / Codebase Constraints extra. Minor variance acceptable per file's specialty

### S-A-4 (adversarial)
- (a) First-5-lines accurate: **YES** — each file leads with role identity
- (b) "Out of scope" before lifecycle: **YES** — all 5 files

### S-A-5
- (a) No placeholders: **YES** — grep TODO/TBD/XXX = clean

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-A-01** | `assumption_risk` | `docs-sync` | open | 25 | Low | leader.md role name vs industry connotation | Cold operator may misread "leader" as "team lead" rather than "PI/PM investigator". Solo-user context softens; documentation does name it correctly inside the file |
| **F-A-02** | `design_flaw` | `docs-sync` | open | **100** | **High** | evaluator.md:12 perspective list `project/overall/architecture/performance/aesthetics/usage/consistency/risk/user` vs evaluation/SKILL.md:85 fixed 7 `Project/Structure/Performance/Aesthetics/Usage/Consistency/Risk` + Overall | Direct contradiction with the canonical skill. Manager reading evaluator.md will pass "architecture" or "user" as the perspective and the evaluator will fail to load any matching child doc |

## Per-perspective verdict

**REVISE** — F-A-02 (High/100) is a hard contradiction between the evaluator agent file and the evaluation skill. Must be fixed; the perspective vocabulary must match exactly between the two files or the system breaks at the delegation seam. F-A-01 (Low/25) is suppressed to appendix.

## Low-confidence appendix

- F-A-01 (Low/25) — preserved for memorization; cold-operator concern is real but solo-user makes it weak in priority
