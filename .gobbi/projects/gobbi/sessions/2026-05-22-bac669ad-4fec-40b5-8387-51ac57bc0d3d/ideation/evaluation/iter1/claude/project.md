---
perspective: project
iter: 1
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

**What**: Repair the env-var contract in gobbi's skill docs: rename `$CLAUDE_SESSION_ID` (13 occurrences across 12 skill files) to `$CLAUDE_CODE_SESSION_ID`, create `.claude/hooks/session-start.sh` (bash+jq) to persist the 7 hook-only vars + 3 passthroughs to `$CLAUDE_ENV_FILE`, register the hook in `.claude/settings.json`, add top-level `transcriptPath` to `session.json` and its template, and rewrite `gobbi/SKILL.md § Session env vars arrive automatically`.

**Why**: Empirically verified defects found during the `/gobbi` bootstrap of session `2026-05-22-bac669ad-...`: `$CLAUDE_SESSION_ID` returns UNSET in runtime; `$CLAUDE_CODE_SESSION_ID` returns the real UUID; `.claude/settings.json` has no hooks block; `$CLAUDE_TRANSCRIPT_PATH` is empty in subagent contexts.

**How**: Task A-G decomposition — hook script, settings.json registration, gobbi/SKILL.md rewrite, bulk rename across other 11 files, template + orchestration/SKILL.md update, CLAUDE_TRANSCRIPT_PATH rewording, verification pass.

**Scope Contract source**: artifact itself (§ Scope Contract, line ~289).

**Downstream consumers**: Preparation Loop (confirms file inventory / line-number accuracy), Planning Loop (decomposes A-G tasks), Execution Loop (implements edits), future sessions whose agents read skill docs.

**Memory reads**:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md` — single rule file; not applicable to this scope.
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/README.md` — post-reset placeholder; no applicable mistakes.
- Verified live file grep: `rg -n 'CLAUDE_SESSION_ID'` — 13 hits confirmed, across 12 distinct files.
- Verified `rg -n 'CLAUDE_TRANSCRIPT_PATH'` — 9 hits confirmed across 6 skill files plus `gobbi/SKILL.md:56` (not a rename target).
- Verified `.claude/settings.json` — no hooks block confirmed.
- Verified `session.template.json` — no top-level `transcriptPath` confirmed (only at agent-level inside `agents[]`).

---

## Locked Frame (Stage 1)

### Scenario 1: Root cause analysis is real, not a symptom
**Attached checklist:**
- [ ] Defects have concrete witness evidence (not speculative)
- [ ] "Why now?" terminates at an empirically observed failure, not at "it would be nice"
- [ ] Prior attempts (or their absence) are documented

### Scenario 2: Scope Contract is sharp enough to refuse out-of-scope tasks
**Attached checklist:**
- [ ] In-Scope lists specific files/paths, not broad categories
- [ ] Out-of-Scope explicitly enumerates exclusions with rationale
- [ ] Decisions Locked provides a clear executor guide
- [ ] Success Criteria are verifiable (commands, file-existence checks)

### Scenario 3: "Why now?" answer names a concrete trigger
**Attached checklist:**
- [ ] Trigger is a session-specific empirical observation, not generic technical debt
- [ ] The trigger citation is reproducible by Preparation

### Scenario 4: Counterfactual (steel-man "do nothing") was taken seriously (adversarial)
**Attached checklist:**
- [ ] An argument for NOT doing this change is addressed
- [ ] The rejection rationale is stated

### Scenario 5: No silent scope overlap with an existing active feature
**Attached checklist:**
- [ ] `.gobbi/projects/gobbi/features/` was checked for active feature named `env-var-audit` or related
- [ ] No adjacent feature absorbed by this scope without explicit split/merge

### Scenario 6: Hypothesis / testability criteria are stated
**Attached checklist:**
- [ ] Success criteria are observation-level (runnable commands, file checks)
- [ ] Exit criteria are directly verifiable by the next session

### Scenario 7: Prior-art search was real, not nominal
**Attached checklist:**
- [ ] Claude Code changelog/docs cross-checked by the sub-agent
- [ ] Negative results (what was searched and not found) are recorded or inferrable

---

## Per-scenario per-check results

### Scenario 1: Root cause — real witnesses

- Defects have concrete witness evidence: **YES** — `echo "${CLAUDE_SESSION_ID-UNSET}"` → `UNSET`; `$CLAUDE_CODE_SESSION_ID` → actual UUID; `jq '.hooks // "NO_HOOKS_BLOCK"'` → `"NO_HOOKS_BLOCK"`. All verified by the author during live session and confirmed by grep.
- "Why now?" terminates at empirically observed failure: **YES** — the bootstrap itself failed; path conventions in skill docs break in production.
- Prior attempts documented: **YES (implicitly)** — artifact states skills were set up during a prior pre-reset build that used an old model of env-var delivery; this is the first post-reset session to verify empirically.

### Scenario 2: Scope Contract sharpness

- In-Scope lists specific files/paths: **YES** — full inventory table with file paths and line numbers.
- Out-of-Scope explicitly enumerates exclusions: **YES** — `.claude/agents/`, `plugins/`, `packages/cli/src/`, TS+bun port all explicitly excluded with rationale.
- Decisions Locked provides executor guide: **YES** — P1–P7 each have a one-paragraph decision block.
- Success Criteria are verifiable: **YES** — 8 numbered criteria including runnable rg/jq/test commands.

### Scenario 3: Trigger is concrete

- Session-specific empirical observation: **YES** — session `bac669ad-...` boot commands are cited verbatim.
- Reproducible by Preparation: **YES** — the greps are standard shell commands; Preparation can re-run them.

### Scenario 4: Counterfactual

- Argument for NOT doing this addressed: **PARTIAL** — the artifact cites the downstream consequences of not doing this (skills lie about reality, memorization silently logs Critical findings) but does not explicitly steelman "acceptable to keep the broken state." This is LOW severity; the failure modes are sufficiently concrete that the counterfactual is obvious.
- Rejection rationale stated: **YES** — "Every skill that says 'from $CLAUDE_SESSION_ID' is unactionable; the var is empty in 100% of subagent contexts."

### Scenario 5: No scope overlap

- `features/` checked: **NO explicit citation** — the artifact does not cite a grep of `.gobbi/projects/gobbi/features/`. However, the post-reset condition means the features directory is essentially empty; the artifact notes "no contradiction with any project rule."
- **Finding**: Not a critical gap given the post-reset state, but the Prior-art search anti-pattern applies (no explicit negative result recorded). Confidence 50, Severity Low.

### Scenario 6: Hypothesis / testability

- Criteria are observation-level: **YES** — all 8 success criteria are runnable shell commands or file-existence checks.
- Exit criteria verifiable by next session: **YES** — `rg 'CLAUDE_SESSION_ID'` returns empty, `.claude/hooks/session-start.sh` executable, etc.

### Scenario 7: Prior-art search

- Claude Code changelog cross-checked: **YES** — sub-agent dispatched to `claude-code-guide`, confirmed `CLAUDE_CODE_SESSION_ID` as of v2.1.128+ (week 19 May 2026 changelog).
- Negative results: **YES** — the docs-vs-empirical discrepancy for `CLAUDE_PROJECT_DIR`/`CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` is noted explicitly with a plan to flag it in the new sub-section.

---

## Typed findings

### F-PROJ-01

```yaml
finding-id: proj-01-counterfactual-weak
type: checklist_gap
domain: process
disposition: open
confidence: 50
severity: Low
```

**Evidence**: § Why does not contain a structured steel-man for "do nothing." The strongest argument against the change (e.g., "the env vars work fine in the main session; only subagents need them; subagents can just re-read session.json") is not presented. The motivation section presents consequences, not a counterfactual argument.

**Why it matters**: Preparation Loop and Planning Loop skip the steel-man check; if the root cause is misdiagnosed, the 8-task plan may be addressing a symptom. The actual trigger (skills document a var that doesn't exist) is real, but the absence of a counterfactual discussion means no one explicitly asked "is there a cheaper fix?"

**Suggested direction**: In Preparation or Planning, explicitly note the cheapest alternative and why it was rejected (e.g., "we could just delete the skill references instead of adding a hook; rejected because the hook provides positive value beyond just fixing the references").

---

### F-PROJ-02

```yaml
finding-id: proj-02-features-dir-not-checked
type: checklist_gap
domain: process
disposition: open
confidence: 50
severity: Low
```

**Evidence**: The artifact does not cite a scan of `.gobbi/projects/gobbi/features/` for any existing `env-var-audit` or related feature directory that might overlap this scope. The How section says "no contradiction with any project rule" but does not mention the feature overlap check required by the Project evaluation seed scenario.

**Why it matters**: The post-reset condition makes this a low-probability issue, but the discipline of recording "feature overlap: checked, found none" is missing. A future evaluator re-running the frame cannot distinguish "checked and clean" from "not checked."

**Suggested direction**: Add a one-line negative result ("no existing feature for env-var work found under features/") in the Preparation confirmations.

---

## Low-confidence appendix

(None — all findings at confidence ≥ 50 are reported above.)
