# Risk Perspective — Memory-System Redesign (iter1, claude)

## Artifact Summary + Memory reads

(See project.md for full summary — shared across perspectives.)

not-applicable (Privacy/data retention): No PII or sensitive data is touched.
not-applicable (License/IP): No external code borrowed.
not-applicable (Security): No security surface affected.

## Locked Frame (Stage 1)

**S1: Rollback path identified for each irreversible step**
- git mv is used for all moves (reversible via git). ✓
- No physical deletes. ✓
- But: adding P13 to principles/SKILL.md is a propagation to a MUST-LOAD skill — can this be rolled back cleanly?

**S2: Blast radius bounded**
- §7 enumerates 12 logical targets. Each edit is named.
- The ×2 dual-tree mirror doubles the physical count. ✓ (explicitly called out)
- 17 templates + 140-file migration. Size is acknowledged.

**S3: Dual-tree mirror drift trap — the highest-risk point**
- The design explicitly calls out the mirror trap at §7 intro and cites the relevant mistake file.
- Each edit in §7 should be ×2. Are any edits that require mirror sync missed?

**S4: Principled change to MUST-LOAD skills has cascading effect**
- principles/SKILL.md and CLAUDE.md are MUST-LOAD at session start, resume, /clear, compaction.
- Adding P13 to these creates an immediate behavioral change in every future agent.
- Is there a "try before committing" path? The change is somewhat irreversible since every session immediately loads P13.

**S5: The memory-rules.md sibling changes what memorization/SKILL.md teaches (adversarial)**
- Currently, memorization/SKILL.md is the single source for the frontmatter schema (its §Templates section).
- After migration, some content moves to memorization/rules.md.
- If any agent loads only memorization/SKILL.md (not the new sibling), it will have incomplete information.
- Is there a MUST-LOAD directive update needed for the new sibling?

**S6: Rules frontmatter change (RATIFY-2) — will adding frontmatter to rules/stub-redirect-format.md break Claude's loading of that rule?**
- The rule currently has NO frontmatter (as designed). Adding base frontmatter changes the document structure.
- Claude reads rules by loading the file — frontmatter at the top might affect parsing.

**S7: Cost/budget impact (Coverage Matrix: Performance + Risk)**
- Migration of ~140 files + 12 skill edits + 17 template edits in one session = very high token volume.
- Stated as "may warrant its own session" for category A.

**S8: Two-week smell test**
- The design relies on Planning to decompose the per-file routing in Category A.
- If Planning decomposes Category A without seeing the per-type specs, the file routing will be guesswork.

---

## Per-scenario per-check results

| Scenario | Result | Evidence |
|---|---|---|
| S1: Rollback path for each irreversible step | PASS | All changes are git mv or text edits; P13 is the only "behavioral-propagating" change; rollback is a git revert |
| S2: Blast radius bounded | PASS | §7 enumerates 12 targets + ×2 mirror = 24 physical; 17 templates; migration 140 files. Acknowledged |
| S3: Dual-tree mirror fully covered | PASS | §7 intro explicitly calls this out; each ×2 entry is marked; mistake file cited |
| S4: P13 as MUST-LOAD behavioral change | PARTIAL | See F-RISK-01 |
| S5: Rules.md sibling requires MUST-LOAD update | FAIL | See F-RISK-02 |
| S6: Rules file frontmatter change | PASS | Adding frontmatter to a markdown file doesn't break loading; the file is read as text |
| S7: Cost/budget | PASS (acknowledged) | Scale acknowledged; "may warrant own session" for Category A |
| S8: Two-week smell test | PASS | Design is specific enough; Category A routing heuristic is the gap (see F-PERF-01) |

---

## Typed findings

### F-RISK-01 — The memorization/rules.md sibling requires all existing memorization load-directives to be updated

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** High
- **Evidence:** The design creates a new consolidated `memorization/rules.md` sibling that will contain the naming convention, frontmatter standard, and structure rules currently scattered or absent. §7 #5 says "cross-reference `memorization/rules.md`" in memorization/SKILL.md. But: (1) the delegation/SKILL.md templates that include Load Directives for memorization currently load only `memorization/SKILL.md`. (2) The principle "load before work" agents follow will now miss the new sibling unless load-directives in every delegation template are updated. (3) §7 propagation plan does NOT include `delegation/SKILL.md` or the delegation templates as targets, even though they contain memorization load directives. Agents that load `memorization/SKILL.md` without also loading `memorization/rules.md` will have incomplete information — they'll miss the naming/frontmatter standard.
- **Why it matters:** If the naming/frontmatter standard moves to `memorization/rules.md` but no load-directive update is made to delegation/SKILL.md and its templates, future agents will follow the incomplete standard in `memorization/SKILL.md` and produce non-compliant files. The very problem the design is solving (frontmatter drift, naming inconsistency) will recur in the next session.
- **Suggested direction:** Add `delegation/SKILL.md` (and any per-role delegation templates) to §7 propagation targets, with the change: "add `memorization/rules.md` to the memorization load directives block." This is a high-blast-radius omission.

### F-RISK-02 — P13's reliance on the missing `_claude` skill creates a dependency on a FLAG item

- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** Principle #13 text (§6): "Procedure step 3: Check the blast radius. If the doc is mirrored (workspace `.claude/skills/` ↔ project `.gobbi/projects/{name}/skills/` — see the dual-tree mirror trap), the CRUD plan MUST list BOTH copies." And §6 anti-rationalization: "I know what this doc is for. (then writing the 2-line spec costs nothing)". The P13 text also references a `.claude/` docs standard: the Anti-rationalizations section says "CRUD is the change-scoping lens; prose changes have blast radius too" — and the Delineation from P8 section implies there's a docs writing standard the principle builds on. §6 note in §11 [FLAG-2]: "The `claude` documentation-standard skill is missing: CLAUDE.md links `skills/claude/SKILL.md`... but no such directory exists." P13 cites this standard indirectly. If P13 is added to `principles/SKILL.md` before the missing `_claude` skill is created, P13's reference to "the `.claude/` standard" will point to a phantom.
- **Why it matters:** P13 will be a MUST-LOAD principle in every session, including sub-agent delegation prompts. If P13 references a standard that doesn't exist, agents following P13's "check the blast radius" step will hit a dead reference. The risk is low-probability (the reference is indirect) but the principle being wrong at inception is worse than the original docs being incomplete.
- **Suggested direction:** Either (a) scope P13 to reference only the specific behaviors ("list BOTH copies in the CRUD plan") without citing the missing `_claude` skill, or (b) make FLAG-2 resolution a prerequisite for P13 deployment. The current text in §6 already avoids an explicit `_claude` citation — it only cites the mirror trap — so this may be lower risk than it appears.

---

## Low-confidence appendix

- (Confidence 25): The rules/stub-redirect-format.md says "See `_claude/SKILL.md` for the broader docs writing standard" (line 75). After RATIFY-2 adds base frontmatter to this file, the `_claude/SKILL.md` reference in its Related section will remain a dead link (FLAG-3). This is acknowledged in §11 [FLAG-3] as out of scope. Flagged for awareness but not a finding since it's explicitly deferred.

---

## Per-perspective verdict: REVISE

Rationale: F-RISK-01 is High/75 — the propagation plan misses `delegation/SKILL.md` as a load-directive update target. High finding at confidence 75 → REVISE.
