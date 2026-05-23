# Project Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. Brief contract — does iter2 deliver exactly the 6 surgical fixes the leader's brief mandated?
2. Idea contract — does the iter2 stub satisfy the *locked Idea spec* (which the brief should be aligned to)?
3. Domain-correctness — is the readiness verdict still appropriate after iter2 changes?

## Verification

- `grep -c "^## " staging/skills/codex/SKILL.md` → 8. PASS for brief.
- H2 ordering per leader's brief: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD / Hang + timeout / Use cases / Anti-patterns / Constraints. Stub matches leader-restated order. PASS for brief.
- Frontmatter has `name`, `description`, `when-to-load`. PASS for brief.
- No `allowed-tools:` field. PASS for brief.
- Iter2 draft cites `line 224` lowercase `Path conventions`. PASS for brief.
- Open Concern #4 reclassified as Preparation-resolved. PASS for brief.
- `rawdata/skill-stub-iter1.md` preserved. PASS for brief.

**All 6 leader-brief gates PASS.** But the brief itself may have miscalled the Idea contract. I verified against the locked Ideation artifact.

## Findings

### F-P-01 — Iter2 stub diverges from locked Idea section list (Cost-section regression)
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Critical
- Evidence:
  - Ideation Design A (`ideation/staging/design/item-a-codex-skill-structure.md:15-23`) locks the 8 H2 sections as: 1 When to load / 2 Invocation patterns / 3 Why subagents must use `codex exec` / 4 Sandbox + CWD discipline / 5 Hang + timeout discipline / 6 Use cases / **7 Cost + sandbox budget awareness** / **8 Anti-patterns**.
  - Ideation `idea.md:273` re-locks "Cost + sandbox budget awareness" as a key subsection.
  - Ideation `idea.md:76` acceptance criteria: "...8 H2 sections; ... **cost subsection**".
  - Ideation drafts (`rawdata/draft-iter2.md:356`, `draft-iter3.md:349`) say: "8 H2 sections: (1)...(7) Cost + sandbox budget awareness, (8) Anti-patterns. Plus Constraints block." — Constraints is a **separate block**, not one of the 8 H2 sections.
  - Iter1 ideation eval `iter3/codex/performance.md:28` re-confirmed: "Design A still lists 'Cost + sandbox budget awareness' as section 7".
  - iter2 stub `grep -n "^## "`: section 7 is `## Anti-patterns`, section 8 is `## Constraints`. The locked "## Cost + sandbox budget awareness" section is GONE; iter2 folded it into `## Use cases` as sub-bullets (stub line 104: "Cost + sandbox budget awareness sub-bullet (folded in here, NOT a separate section)").
- Why it matters: Iron Law 4 (Scope is bounded by the contract) — the Idea is the locked contract for Preparation. iter2 silently substituted "Constraints" for "Cost + sandbox budget awareness" in the H2 list. The Idea's acceptance gate `grep -c "^## " ...codex/SKILL.md == 8` will pass arithmetically, but a downstream Idea-checklist audit (`grep "Cost +\|cost subsection"`) will fail. Execution cannot fill a section that does not exist; it would have to either reintroduce the section (re-doing Preparation's structural lock) or violate the Idea spec.
- Suggested direction: re-discuss with user. Options: (a) restore "## Cost + sandbox budget awareness" as locked H2 #7 and demote "Constraints" to a body block as Idea draft-iter3:349 specifies; (b) seek user approval to amend the Idea (replace section 7 with Constraints, fold Cost into Use cases as iter2 did) — this requires returning to Ideation per Principle 5.

### F-P-02 — Frontmatter shape diverges from locked Idea spec
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence:
  - Ideation `rawdata/draft-iter3.md:349` locks frontmatter as `(name, description, allowed-tools)` — NOT `when-to-load:`.
  - Survey of `.gobbi/projects/gobbi/skills/*/SKILL.md` frontmatter shows: every existing project skill uses `name + description + allowed-tools`; NONE use `when-to-load:` as a frontmatter field. ("When to load" is universally a body H2 section.)
  - iter2 stub frontmatter: `name + description + when-to-load` (lines 2-4). `allowed-tools:` REMOVED.
  - Iter1 codex finding mandating `when-to-load` frontmatter (codex/usage.md:42, project.md:50) was itself wrong against the Idea contract.
- Why it matters: Principle 4 + Principle 11 (no improvement that games the tool) — iter2 followed the leader's brief which followed an incorrect iter1 codex finding, producing a frontmatter shape that diverges from both the locked Idea spec and the project convention. Loader compatibility risk: existing skill-loader code (and skill-permissions in `.claude/settings.json` if it gates on `allowed-tools`) may not recognize the new key, and the standard skill discovery pattern uses `allowed-tools` for tool gating.
- Suggested direction: re-instate `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion` per Idea spec; remove `when-to-load:` frontmatter (the "When to load" content already lives in body H2 section #1).

## Must-preserve

- 8 H2 count (arithmetic).
- `name` + `description` frontmatter.
- Stub-as-stub discipline (Execution fills content; Preparation locks shape).
- iter1 stub audit preservation.
- Line-224 lowercase `Path conventions` correction.
- Open Concern #4 reclassification.

## Verdict

REVISE — 1 Critical with Confidence 100 (F-P-01); 1 High with Confidence 100 (F-P-02). Both trace to the leader's brief misciting the Idea contract, which iter2 executed faithfully.
