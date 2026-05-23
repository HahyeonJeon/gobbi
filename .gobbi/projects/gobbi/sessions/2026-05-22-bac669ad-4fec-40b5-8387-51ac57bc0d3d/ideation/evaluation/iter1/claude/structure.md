---
perspective: structure
iter: 1
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

(See project.md; same artifact.)

**Memory reads**: Same as project.md.

---

## Locked Frame (Stage 1)

### Scenario 1: Task decomposition is acyclic with one concern per task
**Attached checklist:**
- [ ] Tasks A-G do not require re-doing a prior task (no circular dependency)
- [ ] Each task has one primary file or file set as its target
- [ ] Tasks can be done in sequence without rework

### Scenario 2: Directional design decisions name library/framework/pattern explicitly
**Attached checklist:**
- [ ] Hook: bash+jq named with rationale
- [ ] settings.json format: JSON block structure described
- [ ] session.json schema: field type (`string | null`) stated

### Scenario 3: Boring-by-default holds — no novel pattern where existing suffices
**Attached checklist:**
- [ ] No new abstraction introduced (no new skill, no new agent, no new template)
- [ ] Any deviation from the existing pattern spends an innovation token with rationale

### Scenario 4: Two-week smell test — structure legible without leader's transcript
**Attached checklist:**
- [ ] The hook contract section is self-contained
- [ ] The P1-P7 decision labels are stable and will make sense to a Planner 2 weeks later

### Scenario 5: Testability is a first-class concern (adversarial)
**Attached checklist:**
- [ ] Each Task has a concrete verification step
- [ ] Task G (verification pass) is explicitly a separate task, not merged into prior tasks

### Scenario 6: Decomposition introduces shared-state hub (adversarial)
**Attached checklist:**
- [ ] No "catch-all" task that touches many files without focus
- [ ] Task D (bulk rename) and Task C (gobbi/SKILL.md rewrite) are separate tasks, not collapsed

---

## Per-scenario per-check results

### Scenario 1: Task decomposition acyclic

- Tasks do not require re-doing a prior task: **YES** — A (hook script) → B (settings.json) → C (gobbi/SKILL.md focused edit) → D (bulk rename) → E (template) → F (CLAUDE_TRANSCRIPT_PATH reword) → G (verification). No circular dependency.
- Each task has one primary target: **YES** — A: one new file; B: one JSON edit; C: one focused skill file; D: 11 remaining files; E: template + orchestration/SKILL.md; F: 6 skill files; G: read-only verification.
- Tasks can be done in sequence without rework: **YES** — Task C and D both touch different parts of skill docs; E and F are orthogonal.

### Scenario 2: Design decisions explicit

- Hook: bash+jq named with rationale: **YES** — "deferred per user answer" for TS+bun noted. Rationale is "user lock," not agent discretion.
- settings.json format: **YES** — matcher string `"startup|resume|clear|compact"` specified.
- session.json field type: **YES** — `transcriptPath: string | null` stated.

### Scenario 3: Boring-by-default

- No new abstraction: **YES** — no new skill, agent, or template introduced.
- Deviations justified: **YES (partial)** — exporting `CLAUDE_SESSION_ID` inside the hook for "in-hook consumer compatibility" is a non-obvious behavior; it is documented but the rationale ("other hooks Claude Code may run") is thin. Low severity.

### Scenario 4: Two-week smell test

- Hook contract section self-contained: **YES** — § Hook contract gives stdin fields, output vars, failure mode, idempotency.
- P1-P7 labels stable: **YES** — stable letter codes; each labeled in both the decisions log and Scope Contract.

### Scenario 5: Testability

- Each task has concrete verification: **YES** — Task G explicitly runs `rg`, `jq`, `test -x` checks.
- Task G is a separate task: **YES** — Task 7 (G) is separated from implementation tasks.

### Scenario 6: No shared-state hub

- No catch-all task: **YES** — Task D covers a defined set (11 files × 1 pattern); not open-ended.
- C and D separate: **YES** — confirmed in candidate decomposition.

---

## Typed findings

### F-STR-01

```yaml
finding-id: str-01-hook-internal-session-id-export
type: design_flaw
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
```

**Evidence**: § Hook contract table (line ~191) says `session_id` → `CLAUDE_SESSION_ID` AND `CLAUDE_CODE_SESSION_ID`. § P2 decisions (line ~223) says "`CLAUDE_SESSION_ID` is NOT exported under its old name as the canonical." § P2 note (line ~224) then says "inside the hook script itself, the stdin field `session_id` is still also exported as `CLAUDE_SESSION_ID` for in-hook consumer compatibility." These three statements create an inconsistency: the hook contract table implies both names are exported as a pair, but the decisions log first denies it then re-allows it with an asymmetric justification. An Executor reading these sections will implement inconsistently depending on which section they weight.

**Why it matters**: If the Executor follows the Hook contract table, they export `CLAUDE_SESSION_ID` from the hook to `$CLAUDE_ENV_FILE`. If they follow the P2 decision "is NOT exported under its old name," they don't. The actual behavior (export only `CLAUDE_CODE_SESSION_ID` to the env file, plus `CLAUDE_SESSION_ID` for in-hook use only) is buried in a parenthetical note that contradicts the table. This is a rework trigger during Execution.

**Suggested direction**: Planning should resolve the exact hook behavior and make the contract table + decision text agree. One clear sentence: either (a) the hook writes only `CLAUDE_CODE_SESSION_ID` to `$CLAUDE_ENV_FILE`, or (b) it writes both. In-hook-only behavior vs env-file behavior should use different terminology.

---

### F-STR-02

```yaml
finding-id: str-02-p3-vars-count-terminology
type: design_flaw
domain: docs-sync
disposition: open
confidence: 100
severity: Low
```

**Evidence**: P3 decision (§ Decisions Log line ~229) reads: "#### P3 — All 10 hook-only vars persisted via hook (locked)." The Scope Contract In-Scope line (line ~302) reads: "P3 — hook persists all 10 hook-only vars + 3 passthroughs." The `gobbi/SKILL.md` table has 10 rows total: 7 hook-only vars + 3 env-passthrough vars. The 3 passthrough vars (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`) are NOT hook-only — they are runtime passthroughs. Calling them "hook-only vars" in P3 is a terminology error; the section title says "10 hook-only" but then adds "+ 3 passthroughs" as if the passthrough vars are a 4th category on top of an existing 10.

**Why it matters**: An Executor reading "All 10 hook-only vars" may count 10 vars in the stdin JSON (there are only 7 from stdin), get confused, and either under-export or over-export. The correct framing is "7 hook-only vars + 3 env-passthrough vars = 10 total vars exported."

**Suggested direction**: Rename P3 heading to "All 7 hook-only vars + 3 env-passthrough vars persisted via hook" and update the Scope Contract In-Scope item to match.

---

## Low-confidence appendix

(None.)
