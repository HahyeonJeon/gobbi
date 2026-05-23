---
perspective: project
iter: 2
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

**What**: Repair the env-var contract in gobbi's skill docs: rename `$CLAUDE_SESSION_ID` (13 occurrences, 12 files) to `$CLAUDE_CODE_SESSION_ID`, create `.claude/hooks/session-start.sh` (bash+jq) to persist the 7 hook-only vars + new `CLAUDE_HOOK_SOURCE` + 3 passthroughs, register the hook in `.claude/settings.json`, add tilde-form `transcriptPath` to `session.json` schema, `session.template.json`, and two locations in `orchestration/SKILL.md`, and rewrite `gobbi/SKILL.md § Session env vars arrive automatically`.

**Why**: Empirically verified defects during `/gobbi` bootstrap of session `2026-05-22-bac669ad-...`: `$CLAUDE_SESSION_ID` returns UNSET at runtime; `$CLAUDE_CODE_SESSION_ID` returns the real UUID; `.claude/settings.json` has no hooks block; `$CLAUDE_TRANSCRIPT_PATH` empty in subagent contexts.

**How**: Tasks A-G decomposition (hook, settings registration, gobbi/SKILL.md rewrite, bulk rename, template + orchestration/SKILL.md update, TRANSCRIPT_PATH rewording, verification pass).

**Scope Contract source**: artifact itself (§ Scope Contract).

**Downstream consumers**: Preparation Loop, Planning Loop, Execution Loop, future session agents.

**Memory reads** (this iter):
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md` (iter2)
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/claude/project.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` (not applicable)
- `.gobbi/projects/gobbi/mistakes/README.md` (post-reset placeholder; no applicable mistakes)
- `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md`
- `.claude/settings.json` (no hooks block confirmed)

---

## Locked Frame (Stage 1)

### Prior-iter open findings inherited

From iter1 Claude/Project: F-PROJ-01 (counterfactual weak, confidence 50, Low) and F-PROJ-02 (features-dir not checked, confidence 50, Low) — both confidence 50 / Low, both remain to be disposition-checked.

### Scenario 1: Root cause is real, not a symptom
**Attached checklist:**
- [ ] Defects have concrete witness evidence
- [ ] "Why now?" terminates at an empirically observed failure
- [ ] Prior attempts documented

### Scenario 2: Scope Contract sharpness
**Attached checklist:**
- [ ] In-Scope lists specific files/paths
- [ ] Out-of-Scope explicitly enumerates exclusions with rationale
- [ ] Decisions Locked provide executor guide
- [ ] Success Criteria are verifiable

### Scenario 3: "Why now?" answer is concrete
**Attached checklist:**
- [ ] Session-specific empirical observation cited
- [ ] Trigger reproducible by Preparation

### Scenario 4: Counterfactual taken seriously (adversarial)
**Attached checklist:**
- [ ] Argument for NOT doing this change addressed
- [ ] Rejection rationale stated

### Scenario 5: No silent scope overlap (adversarial)
**Attached checklist:**
- [ ] features/ checked for overlap
- [ ] No adjacent feature absorbed without explicit split/merge

### Scenario 6: Hypothesis / testability criteria stated
**Attached checklist:**
- [ ] Success criteria are observation-level (runnable commands)
- [ ] Exit criteria directly verifiable

### Scenario 7: Prior-art search was real
**Attached checklist:**
- [ ] Claude Code changelog/docs cross-checked
- [ ] Negative results recorded

---

## Per-scenario per-check results

### Scenario 1: Root cause — real witnesses
- Concrete witnesses: **YES** — empirical checks at bootstrap cited verbatim; unchanged from iter1.
- Why now: **YES** — unchanged.
- Prior attempts: **YES** — unchanged.

### Scenario 2: Scope Contract sharpness
- Specific files/paths: **YES** — expanded by iter2 to include orchestration/SKILL.md line-371 area and tilde-form storage. All still specific.
- Out-of-Scope enumerated: **YES** — unchanged.
- Decisions Locked: **YES** — P1-P7 all carry iter2 annotations.
- Success criteria verifiable: **YES** — 8 runnable criteria; criterion 7 now asserts tilde-form stamping happens this session (see consistency perspective for the related finding).

### Scenario 3: Concrete trigger
- Session-specific: **YES** — unchanged.
- Reproducible: **YES** — unchanged.

### Scenario 4: Counterfactual
- Argument addressed: **PARTIAL** — same as iter1; no structured steel-man added. F-PROJ-01 disposition: open (not addressed in iter2).
- Rejection rationale: **YES** — unchanged.

### Scenario 5: Scope overlap
- features/ checked: **NO explicit citation** — same as iter1. F-PROJ-02 disposition: open (not addressed in iter2).

### Scenario 6: Testability
- Criteria observation-level: **YES** — 8 verifiable criteria; iter2 adds CLAUDE_HOOK_SOURCE to criterion 5.
- Verifiable by next session: **YES** — unchanged.

### Scenario 7: Prior-art search
- Changelog cross-checked: **YES** — now references v2.1.132 (FIX 6 applied).
- Negative results: **YES** — docs-vs-empirical discrepancy noted.

---

## Typed findings

### F-PROJ-01 (inherited from iter1)

```yaml
finding-id: proj-01-counterfactual-weak
type: checklist_gap
domain: process
disposition: open
confidence: 50
severity: Low
```

No change in iter2; the artifact does not add a steel-man argument. Disposition remains open.

### F-PROJ-02 (inherited from iter1)

```yaml
finding-id: proj-02-features-dir-not-checked
type: checklist_gap
domain: process
disposition: open
confidence: 50
severity: Low
```

No change in iter2. Disposition remains open.

---

## Low-confidence appendix

(None — F-PROJ-01 and F-PROJ-02 are both confidence 50, reported above.)
