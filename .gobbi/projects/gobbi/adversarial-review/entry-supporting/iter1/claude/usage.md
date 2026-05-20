# Usage Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

Consumers of these three skills: (a) the manager at session start, (b) every subagent at delegation-load, (c) the human maintainer auditing the system, (d) a future contributor adapting the skills.

Seed scenarios (from ideation/evaluation.md Usage):

1. **The manager produces a session-start plan without going back to the user** — gobbi/SKILL.md gives the full bootstrap procedure with no ambiguity.
2. **A subagent reads principles + git and knows what's required** — Load Directives + status enum are unambiguous.
3. **A maintainer at 3am understands what was decided and why** — historical context (e.g., AI-Provenance-Record vs Co-Authored-By rationale) is in the doc.
4. **Failure modes communicated match implementation reality** — git's "fall back to Direct commit" path is concrete.
5. **(adversarial)** — A consumer reads the artifact and forms the wrong mental model (overloaded terms, missing context, untrained jargon).
6. **Accessibility/I18n** (Coverage Matrix: Usage) — skill files use scannable headings; not-applicable for i18n on internal-tooling docs.
7. **Observability** (Coverage Matrix: Structure + Usage) — a maintainer can diagnose a failed session from logs alone? The skills do not directly define logging contracts (that's a runtime concern), but each procedure has explicit "surface to user" failure paths.

Adversarial scenario: present (scenario 5).

## Per-scenario per-check results

**Scenario 1 — Manager session-start independence:** gobbi/SKILL.md prescribes 6 steps with clear inputs/outputs. Step 4 has explicit Question 1 (4 options) and Question 2 (2 options + sub-question for base branch). No ambiguity that would force a clarifying question to the user. **PASS.**

**Scenario 2 — Subagent load:** delegation/SKILL.md (cross-referenced) provides the load template. principles is mandatory; git is loaded when relevant. Status enum at gobbi/SKILL.md line 118 is unambiguous. **PASS.**

**Scenario 3 — 3am maintainer:**
- AI-Provenance rationale: conventions.md line 103 cites the Microsoft Copilot Co-Authored-By controversy as the historical witness. **PASS.**
- Worktree rationale: git/SKILL.md "Every task gets its own worktree" (line 41) explains isolation invariant. **PASS.**
- 12 principles: each has Why + Anti-rationalizations + Mechanism. **PASS.**

**Scenario 4 — Failure modes match implementation:** git/SKILL.md § Failure Modes and Recovery (line 226+) lists 7 failure paths with recovery references to procedures P6/P7. Each Critical prereq has a fallback (Direct commit). **PASS.**

**Scenario 5 (adversarial) — Mental model trap:**
- "manager" is used as both role-spec (an agents/manager.md file) and runtime entity. Disambiguated in gobbi/SKILL.md line 9 ("You are the manager of this gobbi session"). **PASS.**
- "subagent" appears 30+ times across git/SKILL.md; never defined inline. Cross-referenced via 5-role taxonomy table (gobbi/SKILL.md line 110). Acceptable.
- See U-U-01 below for one nontrivial term overload.

**Scenario 6 — Accessibility:** All three files use H2/H3 headings, ordered lists, tables — screen-reader-friendly. **PASS.**

**Scenario 7 — Observability:** Skills define "surface to user via AskUserQuestion" failure paths but not runtime telemetry. Telemetry lives in `session.json` (per `.claude/CLAUDE.md`, out of scope). For scope here, not-applicable. **N/A.**

## Typed findings

### U-U-01 — "Wrap-up" vs "Wrap-up Loop" vs "Wrap-up's MEMORIZATION" — overloaded reference

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: gobbi/SKILL.md uses three distinct constructs:
  - Line 100: "Wrap-up Loop body" — the loop name
  - Line 102: "Wrap-up's MEMORIZATION is the sole writer to project memory" — a sub-phase
  - Line 174: "Interview is the documented exception (bootstrap discovery writes directly to project memory)"
  - Line 194: "Project memory ... is written only by Wrap-up's MEMORIZATION (and by Interview during bootstrap)"
  - Line 210: "MUST run Wrap-up before closing the session — project memory is updated only via Wrap-up's promotion pass"
  
  A new reader sees "Wrap-up" sometimes meaning "the entire 6th step", sometimes "the MEMORIZATION sub-phase of that step", sometimes "the promotion pass within MEMORIZATION". The relationships are: Wrap-up Loop ⊃ MEMORIZATION sub-phase ⊃ promotion pass. Two are conflated in line 210 ("MUST run Wrap-up" + "project memory updated only via Wrap-up's promotion pass" — fine, but skimmable as redundant).
  
  Additionally: line 172 "**All writes are session-scoped until Wrap-up**" — "Wrap-up" here means the Loop. Consistent if reader internalizes the hierarchy, but skim-confusing.
  
- **Remediation**: Add one-line glossary in gobbi/SKILL.md (e.g., near the Workflow Overview table) clarifying: "Wrap-up = the 6th workflow step; Wrap-up's MEMORIZATION = the sub-phase that promotes session staging to project memory; Wrap-up's promotion pass = the deterministic mapping inside MEMORIZATION." Alternatively, consistently use the full form everywhere (more verbose but unambiguous).

### U-U-02 — git/SKILL.md "Forbidden Operations" `git stash` rule is worktree-scoped but Direct-commit mode has no worktree

- **Type**: general
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: git/SKILL.md § Forbidden Operations row "`git stash` inside a worktree" — but gobbi has two git workflow modes (gobbi/SKILL.md line 70+: Direct commit OR Git workflow worktree+PR). In Direct commit mode, work happens in the main working tree, not a worktree. Is `git stash` forbidden there? The skill is silent. A subagent operating in Direct commit mode might reasonably reach for `git stash` to context-switch and lose work the same way; the underlying anti-pattern (stash is forgettable, lossy) applies regardless of mode.
- **Remediation**: Either (a) generalize the Forbidden Operations row to "`git stash` for context-switches across delegation boundaries" with the existing worktree clarification as a sub-bullet, or (b) state explicitly that the rule is worktree-specific and `git stash` in Direct commit mode is acceptable (with rationale). Pick one.

### U-U-03 — gobbi/SKILL.md does not explain what happens after the user picks "Skip evaluation" mid-session

- **Type**: general
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: gobbi/SKILL.md Q1 option 3: "Skip evaluation — skip the evaluation question; never spawn evaluators unless you explicitly request one." But: when the user picks Skip, then mid-session decides one specific loop merits evaluation, *how* do they request it? Is there a slash-command? An ad-hoc AskUserQuestion? The skill is silent. Cross-referenced orchestration/SKILL.md line 190: "In both modes, the manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'`)" — implies the mode is the gate. Per-loop opt-in requires the manager to surface it manually.
- **Remediation**: Add one sentence to Q1 option 3 wording: "...unless you explicitly request one (the manager will treat 'please evaluate' as a per-loop override and spawn evaluators for that loop only)."

## Low-confidence appendix

- **L-U-01 (confidence 25)**: gobbi/SKILL.md line 65 ("Always evaluate") and line 67 ("Let manager decide") — the latter has no recommended-option label. Per Discussion skill, every Question Card should have exactly one (Recommended). Q1's recommended option is "Ask each time" (line 64). Confirmed: Q1 has exactly one Recommended. Q2 (line 71) likewise. **No finding** — included for completeness. Possibly false-positive.

## Verdict

**PASS** — 3 in-scope findings (2 Medium, 1 Low); none Critical, none High. Usage is good; U-U-01 is the most worth addressing.
