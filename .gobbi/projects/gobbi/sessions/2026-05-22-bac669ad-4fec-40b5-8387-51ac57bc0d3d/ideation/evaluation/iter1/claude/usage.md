---
perspective: usage
iter: 1
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: REVISE
---

## Artifact Summary + Memory reads

(See project.md; same artifact.)

**Memory reads**: Same as project.md.

not-applicable (Accessibility/I18n) — This is a developer-facing docs + bash hook change with no user-facing strings or UI components. No a11y or i18n concerns arise.

not-applicable (Observability at 3am) — The hook writes env vars; failure is surfaced via the rewritten warning in gobbi/SKILL.md when the session bootstrap runs and finds `$CLAUDE_CODE_SESSION_ID` absent. The observability surface is adequate for a single-developer local tool.

---

## Locked Frame (Stage 1)

### Scenario 1: Planner can produce a task list without going back to user
**Attached checklist:**
- [ ] Every directional decision has enough specificity to start implementation (no "we'll figure it out later")
- [ ] Scenarios are concrete enough for Planning to map 1:1 to tasks
- [ ] The A-G candidate decomposition is specific enough to be a direct Planning input

### Scenario 2: Executor reads each scenario and knows which file to change
**Attached checklist:**
- [ ] Each task in A-G names specific files or file patterns
- [ ] Any ambiguous edit (e.g., "reword to cite session.json.transcriptPath as primary source") has enough context to implement

### Scenario 3: Future-self at 3am understands what was built and why
**Attached checklist:**
- [ ] The hook contract is self-contained enough to implement without re-reading the discussion log
- [ ] The Why section is written for a reader who has forgotten the session context

### Scenario 4: Failure modes communicated match what the implementation will exhibit
**Attached checklist:**
- [ ] Hook failure mode (CLAUDE_ENV_FILE unset/unwritable) is documented
- [ ] What happens on next-session bootstrap if the hook never fired is documented

### Scenario 5: Consumer reads the artifact and forms wrong mental model (adversarial)
**Attached checklist:**
- [ ] The "subagents don't inherit env vars" problem is clearly stated as the motivating problem for `transcriptPath` in `session.json`
- [ ] The distinction between "hook populates env at session start" vs "subagent in a new process inherits nothing" is explicit

### Scenario 6: Planner encounters the `gobbi/SKILL.md:56` addendum — knows what to do
**Attached checklist:**
- [ ] The inventory addendum note at § Open questions is actionable for Planning (not ambiguous)
- [ ] Planning will correctly treat line 56 as "in editing scope but not a rename target"

---

## Per-scenario per-check results

### Scenario 1: Planner produces task list without going back to user

- Decisions specific enough: **YES** — P1-P7 are locked with specific files, line numbers, and exact behavior.
- A-G decomposition direct Planning input: **YES** — 7 tasks with named targets.
- No "we'll figure it out later": **YES** — the hook contract (stdin fields, export names, idempotency) is specified in the artifact; no design decisions left open.

### Scenario 2: Executor knows which file to change

- Each task names files: **YES** — Task A (.claude/hooks/session-start.sh), Task B (.claude/settings.json), Task C (gobbi/SKILL.md lines named), Task D (11 files in inventory), Task E (session.template.json + orchestration/SKILL.md), Task F (6 files named), Task G (verification commands named).
- Ambiguous "reword" edits: **PARTIAL concern** — P7 says "reword to cite the manager-stamped `session.json.transcriptPath` field (or `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env)." The exact wording is not specified; an Executor must draft the replacement text. This is appropriate for an Ideation artifact (exact wording belongs in Execution), but a Planner may want to know whether this is a "change one sentence" or "rewrite the whole subsection" edit. The artifact says "9 references across 6 files" which implies small targeted rewrites, not section-level rewrites. Confidence 50 this is adequate.

### Scenario 3: Future-self at 3am

- Hook contract self-contained: **YES** — stdin fields, exported names, failure mode, idempotency all documented.
- Why section for reader who forgot context: **YES** — empirical evidence cited explicitly.

### Scenario 4: Failure modes

- Hook failure (CLAUDE_ENV_FILE unset): **YES** — documented in § Hook contract.
- What happens if hook never fired: **PARTIAL** — the artifact says the rewritten line-66 warning will surface the issue, but does not say what the user sees in the warning or what the remediation path is. The current line-66 says "verify SessionStart hook registration" (which the user can't do, because the hook doesn't exist). The new line-66 should say "your install is broken" with a concrete fix. This is a design matter for Execution, but its absence from the Ideation contract is a gap.

### Scenario 5: Consumer forms wrong mental model (adversarial)

- "Subagents don't inherit env vars" clearly stated: **YES** — line 27 explicitly states "only the hook-firing session has it; subagents in the same workflow do not."
- Hook-at-startup vs subagent-in-new-process distinction: **YES** — explicit in § Why Motivation (after the change: "The 7 hook-only vars are persisted... subagents and follow-up shell commands actually see them").

### Scenario 6: Planner handles `gobbi/SKILL.md:56` addendum

- Addendum actionable: **CONCERN** — the Open questions note says "Planning should treat the P4 table edit as covering rows 55 + 56 (rename row 55 only; leave row 56 untouched but in the same editing scope)." This is correct but buries a critical nuance at the very end of the document. A Planner doing a quick pass through the document may miss that line 56 (`CLAUDE_TRANSCRIPT_PATH` row) must NOT be renamed, while line 55 (`CLAUDE_SESSION_ID` row) must be. See F-USAGE-01.

---

## Typed findings

### F-USAGE-01

```yaml
finding-id: usage-01-gobbi-line56-buried-constraint
type: design_flaw
domain: docs-sync
disposition: open
confidence: 75
severity: High
```

**Evidence**: The inventory table in § P1 (line ~37) lists rows 1 and 2 of `gobbi/SKILL.md` as targets: row 1 is line 55 (`CLAUDE_SESSION_ID` → rename) and row 2 is line 66 (warning paragraph → rewrite). Row 56 (`CLAUDE_TRANSCRIPT_PATH`) is NOT in the P1 rename inventory. However, it lives in the same table at line 56, immediately adjacent to line 55. The only place where the constraint "leave row 56 untouched" is stated is in the § Open questions addendum note at the very end of the document (line ~346).

A Planner building Task C ("rename rows 1+2 + rewrite line-51 paragraph + line-66 warning + insert sub-section") will naturally look at the P4 section for scope. P4 (line ~62-67) says "rename row 1 of the env-var table from `CLAUDE_SESSION_ID` to `CLAUDE_CODE_SESSION_ID`" and "keep `CLAUDE_TRANSCRIPT_PATH` (no rename) — the var name remains correct." The phrase "keep... (no rename)" is present in P4. However, it is easy for an Executor to miss the "no rename" qualifier in P4 (it's a parenthetical clause) and rename both lines 55 and 56.

If line 56 is incorrectly renamed, `CLAUDE_TRANSCRIPT_PATH` → some broken name appears in `gobbi/SKILL.md`, which would be a semantic error because `CLAUDE_TRANSCRIPT_PATH` is the correct name for the transcript path env var.

**Why it matters**: An accidental rename of line 56 would introduce a new error while fixing existing ones. The constraint is real and correct, but its placement at the end of the document (§ Open questions) rather than prominently in the P4 section creates a consumer-failure trap.

**Suggested direction**: Move the "row 56 untouched" note into the P4 section body where it belongs, not in § Open questions. Planning should include a specific "do NOT rename CLAUDE_TRANSCRIPT_PATH" guard in Task C.

---

### F-USAGE-02

```yaml
finding-id: usage-02-new-line66-warning-content-unspecified
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 50
severity: Medium
```

**Evidence**: P4 says "reword the 'workflow cannot proceed' warning: trigger now `$CLAUDE_CODE_SESSION_ID` absent." The current line 66 says "verify the SessionStart hook registration" (which is misdirection since the hook doesn't exist). The artifact does not specify the exact replacement text, including what user action is expected. An Executor must draft the warning text from scratch. While exact wording is typically Execution's job, the artifact should at minimum say what the warning should tell the user to do (e.g., "reinstall gobbi" or "check that `.claude/hooks/session-start.sh` is present and `.claude/settings.json` has the hooks block").

**Why it matters**: If the Executor writes a vague new warning, the user still has no remediation path. The warning's value is the remediation instruction, which should be contractually locked at Ideation.

**Suggested direction**: Add to P4: "The new warning should tell the user: (a) what to check (`.claude/hooks/session-start.sh` exists and is executable, `.claude/settings.json` has `hooks.SessionStart` pointing to it), and (b) what the consequence is if absent (`$CLAUDE_TRANSCRIPT_PATH` will be empty; memorization will fall back to `session.json.transcriptPath`)."

---

## Low-confidence appendix

- **F-USAGE-03 (confidence: 25)**: The artifact does not specify whether the `transcriptPath` field in `session.json` is stamped by the CLI (`packages/cli/src/`) or purely through a docs-only contract in `orchestration/SKILL.md`. It explicitly defers CLI implementation to a future session. This means the field will exist in `session.json` post-merge but will always be `null` until the CLI implements the stamping. Skills that reference `session.json.transcriptPath` will find `null` in all sessions immediately post-merge. Whether this is acceptable depends on whether skills are designed to tolerate `null` gracefully. The artifact does not address this transition period. Confidence 25 because the artifact explicitly deferred this and the user locked the scope.
