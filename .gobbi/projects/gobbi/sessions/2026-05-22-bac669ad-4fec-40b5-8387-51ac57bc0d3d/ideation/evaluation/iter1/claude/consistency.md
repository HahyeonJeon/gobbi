---
perspective: consistency
iter: 1
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: REVISE
---

## Artifact Summary + Memory reads

(See project.md; same artifact.)

**Memory reads**: Same as project.md.

---

## Locked Frame (Stage 1)

### Scenario 1: Scope Contract, Framed Problem, and Design describe the same problem
**Attached checklist:**
- [ ] The Scope Contract goal matches the § What description
- [ ] The Design section (hook contract, A-G tasks) solves the problem stated in § Why (skills lie about env vars)

### Scenario 2: Every design decision is consistent with the research insights it cites
**Attached checklist:**
- [ ] The `CLAUDE_CODE_SESSION_ID` claim (v2.1.128+) is backed by the sub-agent research citation
- [ ] The hook-only vs runtime-set classification is consistent throughout the document

### Scenario 3: File inventory is consistent with the Scope Contract and exit criteria
**Attached checklist:**
- [ ] Every file in the P1 inventory is listed in Scope Contract In-Scope
- [ ] Exit criteria reference the same file set as the inventory
- [ ] Count claims (13 occurrences, 12 files, 9 TRANSCRIPT_PATH refs, 6 files) are internally consistent

### Scenario 4: Hook contract table vs P2 decision are consistent
**Attached checklist:**
- [ ] The `session_id` → export name(s) in the table matches the P2 decision text
- [ ] "Hook internal naming" note does not contradict the table

### Scenario 5: session.json schema claim is consistent with existing template
**Attached checklist:**
- [ ] The template at `orchestration/templates/session.template.json` does NOT already have a top-level `transcriptPath` field (addition is needed, not redundant)
- [ ] The `transcriptPath` in `agents[]` (already present) is distinct from the new top-level `transcriptPath`

### Scenario 6: Internal vs external research conflict not silently assumed compatible (adversarial)
**Attached checklist:**
- [ ] The docs-vs-empirical discrepancy for `CLAUDE_PROJECT_DIR`/`CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` is explicitly flagged, not silently resolved
- [ ] The decision to "re-export if present in env" is coherent with the "empirically unset" finding

---

## Per-scenario per-check results

### Scenario 1: Scope Contract matches Framed Problem

- Goal matches description: **YES** — frontmatter description and Scope Contract goal are nearly identical.
- Design solves stated problem: **YES** — each task directly addresses one of the three defects stated in § What intro.

### Scenario 2: Design decisions backed by research

- `CLAUDE_CODE_SESSION_ID` v2.1.128+ claim: **YES** — sub-agent cross-check with Claude Code changelog cited.
- Hook-only vs runtime-set classification consistent: **PARTIALLY** — see F-CONS-01 below.

### Scenario 3: Inventory consistent with Scope Contract / exit criteria

- P1 files in Scope Contract In-Scope: **YES** — ".gobbi/projects/gobbi/skills/**/*.md — all 12 skill files in the P1 inventory."
- Exit criteria reference same file set: **YES** — exit criterion 1 is the same rg command used for inventory verification.
- Count claims consistent: **YES** — 13 occurrences across 12 files confirmed by live grep. 9 TRANSCRIPT_PATH refs across 6 files confirmed by live grep.

### Scenario 4: Hook contract table vs P2 decisions

- Table matches P2 decision: **NO** — see F-CONS-01.
- "Hook internal naming" note does not contradict table: **NO** — the note acknowledges the asymmetry but does not resolve it. See F-CONS-01.

### Scenario 5: session.json template consistency

- Template does NOT already have top-level `transcriptPath`: **VERIFIED YES** — `python3` check confirms no top-level `transcriptPath` in `session.template.json` (only in `agents[]` array). The addition is needed.
- `transcriptPath` in `agents[]` is distinct: **YES** — per-agent `transcriptPath` tracks the per-agent transcript; the new top-level `transcriptPath` tracks the session-level transcript.

**However**: The P6 decision says "add top-level `transcriptPath` to `session.json`... The manager stamps `transcriptPath` during Configuration step row 6 by reading `$CLAUDE_TRANSCRIPT_PATH` from env (populated by the hook)." But `orchestration/SKILL.md` Step 1 row 6 already says the manager stamps the `agents[]` manager entry's `transcriptPath`. The distinction between what gets stamped at the top level vs the agent level is not made explicit in the artifact. This is a documentation gap rather than a contradiction.

### Scenario 6: Docs-vs-empirical conflict handled

- Discrepancy explicitly flagged: **YES** — the artifact explicitly flags "docs claim runtime-set, empirical check shows them unset in Bash subshells" for `CLAUDE_PROJECT_DIR`/`CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA`.
- "Re-export if present in env" coherent with "empirically unset": **YES** — the hook re-exports them IF they are already in env (silent skip if unset), which gracefully handles both the docs claim and the empirical unset case.

---

## Typed findings

### F-CONS-01

```yaml
finding-id: cons-01-hook-contract-vs-decision-inconsistency
type: design_flaw
domain: docs-sync
disposition: open
confidence: 100
severity: High
```

**Evidence** (three contradictory statements, verified by close reading):

**Statement A** — § Hook contract table (line ~191):
`| session_id | CLAUDE_SESSION_ID AND CLAUDE_CODE_SESSION_ID |`
→ Implies BOTH names are written to `$CLAUDE_ENV_FILE`.

**Statement B** — § P2 decisions (line ~223):
"`CLAUDE_SESSION_ID` is NOT exported under its old name as the canonical (the name is dropped in P1); instead the hook exports `CLAUDE_CODE_SESSION_ID=$session_id`"
→ Implies ONLY `CLAUDE_CODE_SESSION_ID` is written.

**Statement C** — § P2 note (line ~224):
"*inside the hook script itself*, the stdin field `session_id` is still also exported as `CLAUDE_SESSION_ID` for in-hook consumer compatibility (other hooks Claude Code may run)"
→ Implies `CLAUDE_SESSION_ID` IS exported but only for "in-hook" use (not to `$CLAUDE_ENV_FILE`?).

Statement A says both names go to `$CLAUDE_ENV_FILE`. Statement B says only `CLAUDE_CODE_SESSION_ID` goes there. Statement C attempts to reconcile by introducing "in-hook consumer compatibility" as a third category — but does NOT clarify whether this means: (a) the hook exports `CLAUDE_SESSION_ID` to `$CLAUDE_ENV_FILE` anyway (contradicts B), or (b) "in-hook" means available inside the bash script's own env during execution (which would be true automatically, no explicit export needed).

Additionally, exit criterion 1 says `rg -n 'CLAUDE_SESSION_ID' .gobbi/projects/gobbi/skills/` returns empty. If the hook writes `CLAUDE_SESSION_ID` to `$CLAUDE_ENV_FILE`, then downstream skill consumers COULD use it — but the P1 rename is removing all references to it. This creates an orphaned export: the hook sets a var that no skill references. Is this intentional? The artifact does not say.

**Why it matters**: An Executor implementing Task A (write the hook script) faces three incompatible directives. Whichever they choose, the other two are violated. This is a guaranteed Execution-phase rework trigger.

**Suggested direction**: Planning must resolve this before Task A is assigned. The cleanest resolution: (a) the hook writes ONLY `CLAUDE_CODE_SESSION_ID` to `$CLAUDE_ENV_FILE` (no `CLAUDE_SESSION_ID` at all, because P1 drops the name); (b) "in-hook consumer compatibility" means the bash variable `$session_id` is available in the script — not that a separate `export CLAUDE_SESSION_ID` is issued. Update the hook contract table and the P2 note to reflect this. The "Note on hook-internal naming" should be removed as it introduces confusion.

---

### F-CONS-02

```yaml
finding-id: cons-02-transcript-path-in-p7-exit-criterion-5-gap
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
```

**Evidence**: Exit criterion 5 says "Next-session bootstrap (manually triggered or naturally on `/clear`): `$CLAUDE_TRANSCRIPT_PATH` is present in env (proves the hook fires)." This criterion verifies the hook fires and sets `$CLAUDE_TRANSCRIPT_PATH`. But exit criterion 6 says "session.template.json parses as JSON and has `'transcriptPath': null` at top level." Exit criterion 7 says "New session.json files carry a populated `transcriptPath` once the manager stamps it."

Criterion 7 is unverifiable by Execution because the CLI stamping of `transcriptPath` is explicitly deferred to a future session (P6 decision). So after this session's PR merges, `session.json` will have `transcriptPath: null` perpetually (the field is in the template, but nothing stamps it). Exit criterion 7 cannot be met by this session's work.

The consistency violation: the artifact's Success Criteria (§ How) include a criterion (criterion 7) that cannot be satisfied by the defined scope (which excludes CLI implementation).

**Why it matters**: If Planning locks on criterion 7 as a completion gate, the session cannot pass. If Planning ignores it, a user reading the success criteria will expect criterion 7 to be met at session end and find it is not.

**Suggested direction**: Move criterion 7 to the Deferred section (alongside the CLI implementation note) and revise exit criterion 6 to say "session.template.json carries `transcriptPath: null` at top level (the field is introduced but stamping is CLI-deferred — see Deferred section)."

---

## Low-confidence appendix

(None.)
