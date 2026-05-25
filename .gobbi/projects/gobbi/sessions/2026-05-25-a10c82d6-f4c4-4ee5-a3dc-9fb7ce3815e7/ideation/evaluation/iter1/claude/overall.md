# Overall (Stage 3) — Memory-System Redesign (iter1, claude)

## Cross-perspective tensions

**Project REVISE + Usage REVISE + Risk REVISE** — all three converge on the same root: the `gobbi-install` skill doesn't exist and the design claims it does. This is a single factual error that radiates into Project (wrong feature-skill map), Usage (Planner gap), and Aesthetics (false ✓ checkmark). Fixing F-PROJ-01 resolves F-USAGE-01 and F-AES-01 as a side effect.

**Structure REVISE (F-STR-02, 4 template types without specs)** is independently important and not a downstream effect of F-PROJ-01. This is a separate gap: the design's scope says "13 per-type specs" but 4 more types have templates without specs.

**Risk REVISE (F-RISK-01, delegation load-directive gap)** is also independent. The propagation plan misses `delegation/SKILL.md` as a target. This is a blast-radius omission that will cause recurrence of the problem being solved.

**Consistency (F-CONS-04, dual-status field)** is medium but orthogonal — the base `status` field + type-specific lifecycle extensions (like `decision_status`) overlap without resolution.

**Tension between Structure F-STR-04 and Consistency F-CONS-01** — both identify the same plans naming inconsistency (project-level bare slug vs date-prefixed rule) from different angles. One finding, two perspectives. Count as one remediation.

---

## Karpathy failure mode checks

| Mode | Present? | Evidence |
|---|---|---|
| **Wrong assumptions** | YES (one) | The design assumes `gobbi-install` is a skill in `.claude/skills/` — it is not. The 18-skill math is built on this faulty premise. |
| **Overcomplexity** | NO | The design is appropriately specified for its scope. The 13 per-type specs are each 6 fields (Purpose/Boundary/Scope/Naming/Frontmatter/CRUD). No over-engineering detected. The memorization/rules.md sibling is justified (single consolidated home > scattered or absent). |
| **Orthogonal edits** | NO | All sections address the same problem (memory system redesign). §7 propagation + §8 migration are necessary consequences of the design, not separate concerns bundled in. P13 is directly motivated by the audit findings. |
| **Imperative-over-declarative** | PARTIAL | The migration plan (§8) is primarily strategic (categorize, size, sequence) and delegates the per-file decomposition to Planning. This is correct. One note: the temporal split table (§4.2) states the rule declaratively ("date-prefix these types") which is the right framing. No imperative-over-declarative violation found. |

---

## Cross-cutting findings

### F-OVR-01 — The gobbi-install question is the single highest-priority fix

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Three perspectives (Project/Usage/Aesthetics) converge on the same root: the design's claim that `install-runtime` owns `gobbi-install + interview (2 skills)` is factually wrong. Confirmed: no `gobbi-install/SKILL.md` exists in `.claude/skills/`. The actual `.claude/skills/` count is 17 (not 18) if `_claude` workspace skill is excluded. If `_claude` is counted as the 18th, then `install-runtime` should own only `interview` (1 skill), and the total is still 18 if `_claude` correctly maps to `project-memory`.
- **Why it matters:** This is the one fix that unlocks Planning. RATIFY-1 (the only remaining user gate) should happen AFTER the user clarifies whether `gobbi-install` is a planned new skill to create, or whether `install-runtime` simply owns `interview`. All downstream planning tasks for `install-runtime` depend on this.
- **Suggested direction:** The design should present the user with a clear choice: (1) Treat `gobbi-install` as a skill TO BE CREATED as part of this migration (add to §8 cat E with a brief scope), or (2) Revise `install-runtime` to own `interview` only (1 skill); the CLI tool's behavioral knowledge lives in `gobbi/SKILL.md` or future. This choice should be bundled with [RATIFY-1].

### F-OVR-02 — Propagation plan misses delegation/SKILL.md (load-directive update needed for memorization/rules.md)

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** High
- **Evidence:** F-RISK-01 (Risk perspective). The design creates `memorization/rules.md` as a new consolidated rules doc. Future agents must load this doc to have the naming/frontmatter standard. But §7 propagation plan doesn't include `delegation/SKILL.md` (or delegation templates) as targets. Load directives in delegation templates currently load `memorization/SKILL.md`. Without updating these to also load `memorization/rules.md`, the new consolidated doc will be invisible to agents following the standard delegation flow.
- **Why it matters:** The very drift the design is solving — agents not following the naming/frontmatter standard — will recur immediately in the next session if agents don't load the new rules doc.
- **Suggested direction:** Add `delegation/SKILL.md` + `delegation/templates/*.md` to §7 as propagation targets. Change: "Add `memorization/rules.md` to the memorization load directive block in each template." This is the enforcement mechanism for the standard — without it, the standard is advisory-only.

---

## Preserve list

The following elements are done well and must not be broken by REVISE iterations:

1. **The 13 per-type specs with hard boundaries (§2)** — the Purpose/Hard-boundary/Scope/Naming/Frontmatter/CRUD structure is clean and consistent. The boundary decision rules (mistakes vs rules vs learnings, decisions vs design, reviews vs reports) are sharp. These should not be touched.

2. **The temporal split table (§4.2)** — the date-prefixed / bare-slug split is a genuine research-grounded decision (10 naming principles from diverse sources). Keep as-is.

3. **Principle #13 text (§6)** — the full text of P13 is well-formed: Iron Law, Why, 4-step procedure, P8 delineation, anti-rationalizations, mechanism. This is the best-quality section of the design and should not be revised.

4. **The dual-tree mirror warning in §7** — explicitly calling out the ×2 physical copies and citing the executor-mirror-path mistake. This is exactly the kind of blast-radius awareness the design should model.

5. **The RATIFY-1 granularity question** — correctly surfaced as the user's decision. The recommendation (7 features as listed) is defensible and the alternative (split guardrails) is honestly characterized.

6. **The archive typed-subdir resolution** — correctly resolves the memory-map flat-slug vs design-doc typed-subdir contradiction by citing the higher-authority source (the design doc + live tree).

7. **The [RATIFY-7] going-forward-only resolution** — correctly scopes session cleanup to going-forward enforcement. Prevents a retro-sweep that would have wasted session budget on low-value closed sessions.

---

## Overall verdict: REVISE

**Two High findings (confidence ≥ 50):**
- F-PROJ-01 / F-OVR-01 (gobbi-install skill doesn't exist, design claims it does): High/100
- F-RISK-01 / F-OVR-02 (delegation/SKILL.md missing from propagation plan): High/75
- F-USAGE-01 (no migration task for gobbi-install skill): High/100

By threshold rules: any High with confidence ≥ 50 → REVISE. Three such findings present.

The remediation is focused: (1) resolve the gobbi-install question (one user decision, ideally bundled with RATIFY-1); (2) add delegation/SKILL.md to the §7 propagation targets. Neither requires redesigning the core 13-type specs, the naming standard, the frontmatter base, or Principle #13. The design is structurally sound and well-grounded; it needs two concrete fixes and three medium-priority clarifications (F-STR-02, F-CONS-04, F-STR-04/F-CONS-01).
