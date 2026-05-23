---
perspective: project
iter: 3
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

**What**: Repair the gobbi env-var contract: rename `$CLAUDE_SESSION_ID` (13 occurrences, 12 files), create `.claude/hooks/session-start.sh` (bash+jq, `jq -r @sh` shell-safe serialization), register hook in `.claude/settings.json`, add tilde-form `transcriptPath` to `session.json` schema + `session.template.json` + `orchestration/SKILL.md` (Step 1 row 6 + line-371 area), and rewrite `gobbi/SKILL.md § Session env vars arrive automatically`.

**Why**: Empirically verified defects during `/gobbi` bootstrap: `$CLAUDE_SESSION_ID` returns UNSET at runtime; `$CLAUDE_CODE_SESSION_ID` returns real UUID; no hooks block in `.claude/settings.json`.

**How**: Tasks A-G decomposition. Iter3 applies 3 surgical fixes: FIX A (stamping mechanism disambiguation), FIX B (absolute path removed from P6 example), FIX C (`jq -r @sh` shell-safe serialization specified in hook contract + success criterion 4).

**Scope Contract**: § Scope Contract within this artifact.

**Memory reads**:
- iter3 artifact (idea.md)
- iter2/claude/project.md, iter2/codex/project.md
- iter2/claude/overall.md, iter2/codex/overall.md
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` (not applicable)
- `.gobbi/projects/gobbi/mistakes/README.md` (post-reset placeholder; no applicable mistakes)

---

## Locked Frame (Stage 1)

### Inherited prior-iter open findings (from iter2 Claude/Project)

- **F-PROJ-01** (Low/50, counterfactual) — "do nothing" argument weak. Iter2 verdict: PASS, not driving REVISE.
- **F-PROJ-02** (Low/50, features-dir overlap check) — features/ dir not searched. Not driving REVISE.

### Scenario 1: Root cause is real, not a symptom
**Attached checklist:**
- [x] Why terminates at cause that, if absent, obviates the work (UNSET var, missing hook)
- [x] Prior attempts noted ("gobbi/SKILL.md § Session env vars arrive automatically" was speculative)
- [x] No scope drift between framed problem and design

### Scenario 2: Scope Contract sharp enough for Executor refusal
**Attached checklist:**
- [x] In-scope / Out-of-scope enumerated; no "etc." phrasing
- [x] Backlog routing for deferred items (TS+bun port, CLI automation, docs-vs-empirical rationalization)

### Scenario 3: "Why now?" trigger is concrete
**Attached checklist:**
- [x] Named trigger: specific bash commands, specific session ID, specific return values
- [x] Success criteria verifiable (rg returns empty, file exists, stamps non-null)

### Scenario 4: Counterfactual taken seriously (adversarial)
**Attached checklist:**
- [x] Counterfactual present ("without the rename + hook + schema field: skills lie about reality")
- [~] The counterfactual is brief; a strong steel-man could argue "skill docs rarely executed literally." Low/50 concern only.

### Scenario 5: Adjacent feature/scope overlap checked
**Attached checklist:**
- [~] No explicit search of `.gobbi/projects/gobbi/features/` noted. Low concern given no active env-var feature exists per context.

### Scenario 6: Stamping mechanism disambiguation (FIX A — iter3-specific)
**Attached checklist:**
- [x] § Stamping mechanism disambiguation added
- [x] "Manager-agent stamping IS in-scope" vs "CLI automation is deferred" stated explicitly
- [x] Exit criterion 7 contains no ambiguity
- [x] Out-of-Scope, Pre-resolved, Deferred bullets updated to specify CLI-automation-only deferral

---

## Per-scenario per-check results

All iter2 Project checklist items: same results as iter2 (PASS). FIX A adds clarifying disambiguation. No new scope drift introduced by iter3 changes.

**F-PROJ-01 disposition**: open (no change — Low/50, not driving verdict).
**F-PROJ-02 disposition**: open (no change — Low/50, not driving verdict).

---

## Typed findings

No new Project-perspective findings introduced by iter3. FIX A applies cleanly: the disambiguation section clearly separates manager-agent stamping (in-scope) from CLI automation (deferred).

---

## Low-confidence appendix

- F-PROJ-01 (Low/50): "do nothing" counterfactual could be stronger — existing skill docs almost certainly never executed literally by automated agents (only by human-prompted agents), so the real blast radius is narrower than described. Does not rise to REVISE.
- F-PROJ-02 (Low/50): no features-dir search documented. Not blocking.
