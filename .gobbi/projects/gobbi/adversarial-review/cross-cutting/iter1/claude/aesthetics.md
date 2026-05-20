# Aesthetics Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

Docs aesthetics: readability, naming convention adherence, heading consistency, polish. W/W/H clear.

## Stage 1 — Locked Frame

**S1. Naming convention from `__gobbi-convention.md` rule is honored**
- [ ] No `_` or `__` prefix on user-facing skill names (only `gobbi` is no-prefix per rule)
- [ ] All cross-cutting skills in scope are no-prefix (orchestration/discussion/delegation/evaluation/memorization/research/interview)
- [ ] Per convention rule lines 19-21: only `gobbi` was supposed to be no-prefix; 7 cross-cutting skills are all no-prefix too

**S2. Heading levels are consistent across the 7 skills**
- [ ] Frontmatter present on every SKILL.md
- [ ] Top-level `# {name}` matches frontmatter `name:`
- [ ] H2 sections in semantic order

**S3. (adversarial) Polish gaps that would make a 3am reader stumble**
- [ ] No `TBD` / `TODO` / placeholder strings
- [ ] Tables render correctly (column counts match)
- [ ] Internal anchor links resolve

**S4. Konglish/Korean is not used in the canonical text (Question Card example mixes Korean per discussion/SKILL.md:89-107)**
- [ ] Cross-cutting skills target a global audience
- [ ] Examples reflect the project context appropriately

## Stage 2 — Findings

### F-A-01 — Naming convention violation: 7 cross-cutting skills should be `_`-prefixed per rule

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `rules/__gobbi-convention.md:21`: "Only `gobbi` is an interface skill." Per the rule's three-tier model, system-internal skills loaded by orchestration during workflow should be Hidden tier (`_` prefix). The 7 cross-cutting skills (orchestration / discussion / delegation / evaluation / memorization / research / interview) are all loaded by the system internally — they should be `_orchestration`, `_discussion`, etc.

However, the task brief carryover says "trust the 13-iter work already done" — this rename may already be a deferred decision. Marking confidence 50, severity Medium. Investigation required to determine whether the de-prefixing is intentional in the redesign or a regression.

**Why it matters**: If unintentional, it breaks the visibility tier convention the rule encodes. If intentional, the rule itself should be updated to reflect the new convention.

### F-A-02 — Question Card example in `discussion/SKILL.md` mixes Korean

**Type**: `general` / **Domain**: `i18n` / **Confidence**: 100 / **Severity**: Low / **Disposition**: open

**Evidence**: `discussion/SKILL.md:89-107` example uses Korean (e.g., "5 loop skill 정렬이 끝난..."). For a project-internal docs-set this is fine, but for an open-source ClaudeX tool ("gobbi is an open-source ClaudeX tool" per CLAUDE.md) it limits accessibility to contributors who don't read Korean.

**Why it matters**: Per `_solo_user_context` memory note: "Gobbi is solo-user" — engineering-merit-only. This is intentional. Recording as Low only because future open-source ambition may revisit.

### F-A-03 — Frontmatter `description` length varies significantly across the 7 skills

**Type**: `general` / **Domain**: `aesthetics` / **Confidence**: 75 / **Severity**: Low / **Disposition**: open

**Evidence**:
- `evaluation/SKILL.md:3`: 270 chars
- `memorization/SKILL.md:3`: 245 chars
- `delegation/SKILL.md:3`: 138 chars
- `research/SKILL.md:3`: 195 chars
- `interview/SKILL.md:3`: 217 chars
- `discussion/SKILL.md:3`: 245 chars
- `orchestration/SKILL.md:3`: 158 chars

Range 138-270 chars. The Claude Code skill picker shows these to the model — consistency aids scannability. Minor polish.

### F-A-04 — `principles` reference is sometimes `principles` skill, sometimes `gobbi-principles`

Searched: `gobbi-principles` does NOT appear in scope. Per memory note `pr257_skills_agents_refactor_complete`: "gobbi-principles→principles rename" was deliberate. **Not a finding** — confirmation that the rename is clean.

## Stage 2 Verdict

**PASS** — All in-scope aesthetic issues are Medium or Low. F-A-01 raised at conf 50, severity Medium — does not trigger REVISE threshold (needs conf ≥ 50 + severity High). Polish-grade.

## Low-confidence appendix

- LC-A-1 (conf 25, Low): The mix of em dashes ("—") and ASCII hyphens varies subtly across docs. discussion/SKILL.md:120 bans em dashes as soft connectors *in user-facing AskUserQuestion content*; skill docs themselves can use them. No violation.
