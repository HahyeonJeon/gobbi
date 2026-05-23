# Risk Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. Promotion risk — what breaks if the stub is promoted to `.gobbi/projects/gobbi/skills/codex/SKILL.md`?
2. Cascade risk — what does Planning + Execution inherit from these structural mismatches?
3. Loader risk — runtime / permission impact of frontmatter change.
4. Mistake-recurrence risk — does iter2 cleanly avoid the recorded mistake `codex-eval-session-write-path-nested-in-worktree`?

## Verification

- Stub does NOT exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` yet (correct — promotion is at Preparation EXIT).
- Stub content correctly references the mistake file at line 57 (Sandbox + CWD section). PASS.
- Mistake-citation discipline is preserved across iter1 → iter2.

## Findings

### F-R-01 — Promotion-as-shipped risks fail-fast at Idea-checklist audit
- Type: `assumption_risk`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 75
- Severity: High
- Evidence: Idea checklist `idea.md:76` mentions "cost subsection" as an acceptance criterion. Idea Design A lists section 7 explicitly as "Cost + sandbox budget awareness". A Planning auditor running `grep -n "## Cost" .gobbi/projects/gobbi/skills/codex/SKILL.md` after promotion will get 0 hits, suggesting the cost section is missing — even though the content is folded in as sub-bullets. Either Planning must re-discuss with user (delay) or Planning silently accepts the deviation (Iron Law 4 violation propagated downstream).
- Why it matters: cascade risk — a structural mismatch at Preparation propagates into Planning and Execution. Each downstream loop pays the cost of resolving it.
- Suggested direction: fix at Preparation (F-S-01) rather than push the problem into Planning.

### F-R-02 — Frontmatter regression risks loader-time silent failure
- Type: `assumption_risk`
- Domain: `security` (permission gating)
- Disposition: `open`
- Confidence: 50
- Severity: Medium
- Evidence: Skill-loader contract for `allowed-tools:` is not re-verified post-removal. If the loader defaults the missing field to "all tools" (permissive default), removing it silently grants extra tools — opposite of least-privilege. If the loader defaults to "no tools", the codex skill becomes useless at load time. Either way, an untested change to the loader contract.
- Why it matters: silent-failure risk. The skill would still pass `grep`-based audits but fail behaviorally.
- Suggested direction: covered by F-S-03 (re-instate `allowed-tools:`).

### F-R-03 — Mistake-recurrence avoidance check
- Type: `general`
- Domain: `process`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: Stub line 57 + 68 explicitly cite the mistake-file path and re-state the absolute-path mandate. iter2 did not regress this anchor.
- Why it matters: positive — the recorded mistake is preserved as a hard anchor across iterations.

### F-R-04 — Iter1 audit preservation good for trace recovery
- Type: `general`
- Domain: `process`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: `sessions/.../preparation/rawdata/skill-stub-iter1.md` exists. Iter1 stub state recoverable. Iter2 changelog references it.
- Why it matters: positive — process traceability preserved.

## Must-preserve

- Mistake-file anchor at stub line 57 + 68.
- Iter1 audit at `rawdata/skill-stub-iter1.md`.
- Absolute-path mandate language in Sandbox + CWD section.

## Verdict

REVISE — F-R-01 High Confidence 75 (passes revise threshold of Confidence ≥ 50). F-R-02 Medium Confidence 50 supports.
