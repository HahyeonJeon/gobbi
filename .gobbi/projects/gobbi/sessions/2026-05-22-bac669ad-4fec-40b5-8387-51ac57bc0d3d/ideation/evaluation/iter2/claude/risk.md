---
perspective: risk
iter: 2
system: claude
artifact: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md
phase: ideation
verdict: PASS
---

## Artifact Summary + Memory reads

(See project.md — same artifact.)

**Memory reads**: Same as project.md. Iter1 risk.md reviewed.

not-applicable (Privacy/PII) — FIX 8 (tilde-form storage) directly addresses the prior concern. Tilde-form prevents absolute path leakage into git-tracked session.json. Low risk confirmed.
not-applicable (License/IP) — No external code borrowed; bash+jq standard tooling. Unchanged.
not-applicable (Cost/budget) — Developer-local; no paid APIs. Unchanged.

---

## Locked Frame (Stage 1)

### Prior-iter open findings inherited

From iter1 Risk:
- **F-RISK-01** (Medium/75, docs-sync) — CCSI in subagent is subagent's own UUID not manager's. Not addressed by any of the 8 FIX entries; disposition check needed.
- **F-RISK-02** (Medium/50, security) — Hook jq shell injection not specified. Not addressed; disposition check needed.
- **F-RISK-03** (Low/75, docs-sync) — CLAUDE_SESSION_ID outside skills scope. Addressed by FIX 1.

### Scenario 1: Rollback path identified
**Attached checklist:**
- [ ] All changes text/file edits — git revert available
- [ ] No irreversible steps

### Scenario 2: Blast radius bounded
**Attached checklist:**
- [ ] Files touched enumerated; no runtime behavior changes (CLI out of scope)
- [ ] tilde-form privacy fix: no absolute $HOME path in session.json

### Scenario 3: Security surface delta
**Attached checklist:**
- [ ] Hook writes only to $CLAUDE_ENV_FILE (controlled by Claude Code)
- [ ] jq extraction escaping strategy addressed or not

### Scenario 4: Irreversible steps gated
**Attached checklist:**
- [ ] No irreversible steps (confirmed)

### Scenario 5: Two-week smell test
**Attached checklist:**
- [ ] No load-bearing future-self promises
- [ ] Deferred items tracked (TS+bun port, CLI stamping)

### Scenario 6: Scope drift check (adversarial)
**Attached checklist:**
- [ ] orchestration/SKILL.md additions are in scope (confirmed by FIX 7)
- [ ] No files in the Design outside the Scope Contract

### Scenario 7: $CLAUDE_SESSION_ID drop has zero callers breaking (adversarial)
**Attached checklist:**
- [ ] All 13 occurrences renamed
- [ ] No CLAUDE_SESSION_ID outside .gobbi/.../skills/ left broken

### Scenario 8: Privacy — tilde-form prevents $HOME leakage (FIX 8)
**Attached checklist:**
- [ ] Tilde-form storage specified
- [ ] Consumer tilde-expand responsibility documented
- [ ] No absolute path examples left in the document that might be copied verbatim

---

## Per-scenario per-check results

### Scenario 1: Rollback
- All text edits, git revert available: **YES** — unchanged.

### Scenario 2: Blast radius
- Enumerated: **YES** — expanded by iter2 (orchestration/SKILL.md line-371 area added). Still bounded.
- No absolute $HOME in session.json: **YES** — FIX 8 confirmed. The absolute-path example in P6 is an illustration, not a stored value.

### Scenario 3: Security surface
- Hook writes to $CLAUDE_ENV_FILE only: **YES** — unchanged.
- jq escaping: **UNCHANGED from iter1** — F-RISK-02 disposition is open (not addressed in FIX 1-8).

### Scenario 4: No irreversible steps
- YES — confirmed.

### Scenario 5: Two-week smell test
- No load-bearing promises: **YES** — TS+bun port and CLI stamping correctly deferred to Deferred section.
- Deferred items tracked: **YES** — unchanged.

### Scenario 6: Scope drift
- orchestration/SKILL.md additions in scope: **YES** — confirmed by FIX 7.
- No out-of-scope files: **YES** — Design A-G targets match Scope Contract.

### Scenario 7: CLAUDE_SESSION_ID drop zero callers broken
- 13 occurrences renamed: **YES** — F-RISK-03 from iter1 was Low/75 and noted that rg scope covers the symlink tree. FIX 1 removes CLAUDE_SESSION_ID from the hook export, so no new reference point created.
- F-RISK-03 disposition: **addressed** — the symlink coverage concern was addressed implicitly by the out-of-scope note and verified in iter1.

### Scenario 8: Privacy — tilde-form (FIX 8)
- Tilde-form specified: **YES** — P6 decisions at line 293 specify the tilde-substitution procedure. Exit criterion 7 requires tilde form.
- Consumer responsibility documented: **YES** — P7 decisions (line 299) specify "tilde-expand $HOME on read."
- No verbatim absolute-path examples: **YES** — the absolute path `/home/jeonhh0061/...` appears only as the "before" illustration in P6, immediately followed by the tilde form. Not a copy risk.

---

## Typed findings

### F-RISK-01 (inherited from iter1)

```yaml
finding-id: risk-01-session-id-in-evaluation-skill-path-conventions
type: assumption_risk
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
```

Not addressed in the iter2 FIX 1-8 set. The finding about CCSI in a subagent being the subagent's own UUID (not the manager's) remains a documentation gap: the renamed path conventions text will reference $CLAUDE_CODE_SESSION_ID in a context where that var's value is the SUBAGENT's UUID, not the session directory name. The artifact does not address this semantic gap. Disposition remains open.

---

### F-RISK-02 (inherited from iter1)

```yaml
finding-id: risk-02-hook-jq-shell-injection-not-addressed
type: assumption_risk
domain: security
disposition: open
confidence: 50
severity: Medium
```

Not addressed in any of the 8 FIX entries. The hook contract (line 210-221) does not specify how values are escaped before being written as `export VAR=value` lines to $CLAUDE_ENV_FILE. Confidence 50 (Claude Code controls stdin so exploitation path is constrained). Disposition remains open.

---

### F-RISK-03 (inherited from iter1)

```yaml
finding-id: risk-03-session-id-outside-skills-scope
type: assumption_risk
domain: docs-sync
disposition: addressed
confidence: 75
severity: Low
```

FIX 1 removes CLAUDE_SESSION_ID from the hook export, eliminating the potential for new CLAUDE_SESSION_ID references to appear. The exit criterion scope covers .gobbi/projects/gobbi/skills/ which covers the symlink tree. Addressed.

---

## Low-confidence appendix

(None.)
