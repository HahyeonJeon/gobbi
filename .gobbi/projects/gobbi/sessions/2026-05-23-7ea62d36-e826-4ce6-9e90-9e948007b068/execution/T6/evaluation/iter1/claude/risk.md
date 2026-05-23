# Risk — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Risk — blast radius, reversibility, security surface, rollback.

- **S-R-1** Reversibility: a docs skill content fill is rollback-trivial (`git revert bcfaab2`) — no DB / data / dep impact.
- **S-R-2** Sandbox/security guidance in Section 7 + Section 4 is correct and least-privilege.
- **S-R-3** Anti-patterns address the failure modes that previously hit production (this session has 3 documented failure modes per the decision-record witness section).
- **S-R-4 (adversarial)** Could a misreading of this skill cause an agent to do something WORSE than no-skill?
- **S-R-5** Supply-chain / dependency risk on Codex CLI itself (new tool in the agent's loop).
- **S-R-6** Cost runaway risk — does the skill defuse the runaway scenarios it warns about?

## Stage 2 — Per-check evidence

- S-R-1 ✓ Two files changed (codex/SKILL.md + gobbi/SKILL.md row). Rollback is `git revert bcfaab2` — trivial.
- S-R-2 ✓ Section 4 mode table explicitly lists `read-only` as default, `workspace-write` as opt-in for writes, `danger-full-access` "never as default; user-explicit only". Constraints lines 376 + 384 reinforce.
- S-R-3 The 3 failure modes in the decision-record:
  - `codex:codex-rescue` fire-and-forget → Anti-pattern 2 ✓
  - `codex exec` sandbox project-root detection → Anti-pattern 4 ✓
  - `codex exec` background Bash + notification timing → Anti-pattern 3 ✓
  All three failure modes are wired into anti-patterns. ✓
- S-R-4 Reading-failure-mode check:
  - A reader who reads only Section 2(a) and skips Section 4 might run codex from a worktree without `--cd` — but Section 2(a) example block at lines 36-42 inlines `--cd /playinganalytics/git/gobbi`. Mitigated.
  - A reader who tries to spawn `codex:codex-rescue` from an executor — Section 2(b) line 58 + Section 3 table + Anti-pattern 1 all surface the constraint. Triple-redundant.
  - A reader who runs `codex exec` without `timeout 600` — Section 2(a) example includes timeout; Section 5 explains why; Constraints line 378 makes it MUST; Anti-pattern 6 surfaces it. Quadruple-redundant.
- S-R-5 The skill does not address dependency-supply-chain risk explicitly — codex CLI is an external tool; the skill mentions `~/.codex/config.toml` and `/codex:setup` but does not address vendor-trust or version-pinning.
- S-R-6 Cost runaway: Section 7 timeout bound (10 min default with user approval to raise) + Constraints line 378 MUST. Effort + model defaults preserved. ✓

## New findings

### F-R-01 — Dependency-supply-chain consideration on Codex CLI not addressed
- Type: `general` | Domain: `dependency` | Disposition: `open` | Confidence: 50 | Severity: Low
- Evidence: `grep -n 'version\|pinning\|supply\|trust' SKILL.md` returns no hits in a supply-chain context. The skill assumes codex CLI is trusted infrastructure but does not state which version is supported / tested / required.
- Why it matters: Low priority; gobbi is solo-user (memorized) so external supply-chain is less acute. But future-self may upgrade Codex and break the guidance — the skill should state a version anchor or a "this guidance is current as of codex CLI v…".
- Suggested direction: Optional. Add a "Compatibility" footnote stating the Codex CLI minor version this guidance was validated against.

### F-R-02 — `danger-full-access` mention without surrounding caution
- Type: `general` | Domain: `security` | Disposition: `open` | Confidence: 50 | Severity: Low
- Evidence: Section 4 mode table line 134 and Section 7 line 338 mention `danger-full-access` with "never as default" framing — adequate. The Constraints block reinforces with NEVER. ✓ Actually upon re-reading this is sufficient; the framing is consistent.
- Downgrade to suppressed (confidence 0 — false positive).

## Verdict
- Critical/≥75: 0; High/≥50: 0
- **Risk verdict: PASS.**
