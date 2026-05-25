# Usage Perspective — Memory-System Redesign (iter1, claude)

## Artifact Summary + Memory reads

(See project.md for full summary — shared across perspectives.)

not-applicable (Accessibility/I18n): This is a CLI/docs tool with no user-facing UI. Accessibility and i18n are not applicable to this design.
not-applicable (Observability): Memory file management has no runtime observability concerns.

## Locked Frame (Stage 1)

**S1: Planner produces a task list without going back to the user**
- Every directional decision has enough specificity to start implementation.
- Scenarios are concrete enough for Planning to map 1:1 to tasks.

**S2: Executor reads each scenario and knows what file/module/function to change**
- §7 propagation plan names each file + what changes.
- §8 migration plan categorizes and sizes the work.
- Per-type specs (§2) are specific enough for an Executor to write/edit templates.

**S3: The 4 extra template types (discussions, changelogs, scenarios, checklists) — can Executor align them?**
- §7 #8 says "align all 17 templates" but §2 only specs 13 types.

**S4: The memorization/rules.md vs memorization/templates/rules.md path — will Executor confuse them?**
- Disambiguation note exists in §7 #8 but not in §4 or the template spec section.

**S5: Planner gap — no task scope for creating the gobbi-install skill (if needed)**
- The design claims install-runtime owns "gobbi-install" but if that's a new skill, the migration plan has no task for creating it.

**S6: Consumer borrows the wrong mental model (adversarial)**
- The term "feature" already exists in the codebase with sprint semantics. The design redefines it.
- Does the design explicitly call out that the OLD features/ are sprints, not value-features, and that all agents must now use the new definition?

**S7: The RATIFY-1 gate — what happens if user rejects one of the 7 features?**
- [RATIFY-1] is the only remaining open gate. If user splits guardrails into principles + mistake-learning, what changes?
- The design does not give a "change surface" for the RATIFY-1 options.

---

## Per-scenario per-check results

| Scenario | Result | Evidence |
|---|---|---|
| S1: Planner doesn't need to go back | PARTIAL FAIL | F-PROJ-01 (gobbi-install skill) is unresolved; Planner would need to decide whether to create a new skill or not |
| S2: Executor knows what to change | PASS (mostly) | §7 propagation plan is specific; §8 migration is categorized; §2 per-type specs are concrete |
| S3: 4 extra templates — Executor guidance | PARTIAL FAIL | See F-STR-02 — no spec to align these 4 templates against |
| S4: Path confusion risk for Executor | PARTIAL | Disambiguation note exists but only in §7 #8; see F-STR-03 |
| S5: Planner gap for gobbi-install | FAIL | No migration task for creating the gobbi-install skill even though it's claimed as owned by install-runtime |
| S6: Term "feature" redefinition called out | PASS | §0 and §1.2 explicitly distinguish the new value-feature model from the old sprint-feature model |
| S7: RATIFY-1 change surface | PARTIAL | Design recommends the 7 as listed but doesn't describe what changes if user takes the split option |

---

## Typed findings

### F-USAGE-01 — No migration task for creating the gobbi-install skill that §1.2 claims owns install-runtime

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** §1.2 feature table: "install-runtime owns gobbi-install + interview (2 skills)." §8 migration plan Category E (Standards authoring) lists 12 logical targets and 17 templates but no "create gobbi-install/SKILL.md." Category A (feature re-homing) describes moving sprint-feature files but doesn't mention creating a new skill. The gobbi-install skill doesn't exist. If the design intends the feature to own 2 skills, one of them must be created — but this creation task is absent from both §7 and §8.
- **Why it matters:** A Planner building tasks from this design will have: feature install-runtime claiming 2 skills, but only interview exists. The Planner cannot determine whether to: (a) create a gobbi-install/SKILL.md as part of migration, (b) rename install-runtime to own only interview, or (c) map the install-runtime behavioral content into an existing skill. Without guidance, the Planner will either skip this silently or ask the user — which is exactly what an Ideation artifact should prevent.
- **Suggested direction:** Explicitly address the gobbi-install question: either add a task to §8 Category E to create `gobbi-install/SKILL.md` with a one-line scope statement, or revise §1.2 to show install-runtime owning only interview (1 skill) and note that the install CLI behavioral knowledge lives in gobbi/SKILL.md or a future skill. The user should decide.

### F-USAGE-02 — RATIFY-1 split scenario has no defined change surface

- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** §10 states: "[RATIFY-1]: main lever: granularity (split `guardrails` back into `principles` + a `mistake-learning` feature? is `install-runtime` too broad?)." If the user decides to split guardrails, the design doesn't enumerate what changes: the §1.2 table, the §7 propagation targets, the §1.3 sprint-remapping. The user would ratify a different feature set but have no revised design to hand to Planning.
- **Why it matters:** If RATIFY-1 results in a different feature set, Planning receives a design that still says "7 features" when the user chose 8 or 9. The design should at minimum say "if user splits guardrails into X+Y, then §1.2 table changes as follows: ..." to make the ratification consequential.
- **Suggested direction:** Add a brief change-surface note to [RATIFY-1]: "If guardrails splits: §1.2 table gains 1 row (principles row + mistake-learning row replacing guardrails); §1.3 sprint-remapping reassigns bundle-c guardrails items; total feature count becomes 8. If install-runtime splits: 9 features. All other sections are unaffected." This makes RATIFY-1 a true branch point, not a blank check.

---

## Low-confidence appendix

None.

---

## Per-perspective verdict: REVISE

Rationale: F-USAGE-01 is High/100 (a concrete Planner gap caused by the missing gobbi-install skill). High finding at confidence 100 → REVISE.
