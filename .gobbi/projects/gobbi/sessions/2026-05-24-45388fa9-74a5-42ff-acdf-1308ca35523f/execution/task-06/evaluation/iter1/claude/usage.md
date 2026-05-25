# Usage — T06 (commit a8968f8)

## Artifact Summary + Memory reads
See project.md. Consumer = any future agent (any role) reading a skill's Path-conventions section to construct a session-scoped write path inside a spawned subagent.

## Locked Frame (Stage 1)
**S1 — The next consumer constructs a subagent-safe path from the row alone (S-3 golden scenario)**
- [ ] An agent reading the row knows to take {session-id} from the delegation prompt, not the env-var
- [ ] The failure mode (subagent UUID) is communicated so it survives in-doc
**S2 — The instruction is actionable, not just a warning**
- [ ] "do NOT read $CLAUDE_CODE_SESSION_ID" is paired with the positive source ("supplied by the delegation prompt's session-id: field")
**S3 — Backlog Resolution is usable by a future reader deciding whether to reopen f-risk-01**
- [ ] Resolution names mitigation chosen (M2), alternatives rejected (M1/M3 + why), scope (10 files + T03), and exclusion rationale (gobbi)
**S4 (adversarial) — A Codex-run agent is left without a session-id source after the "(or Codex session ID)" parenthetical was dropped**
- [ ] The row is system-agnostic; the {system} bullet still documents claude/codex

**Accessibility/I18n**: not-applicable — agent-facing markdown; scannable bullet structure preserved; no user-facing UI strings.

## Per-scenario per-check results
- S1: YES. Row delivers all three clauses; matches the S-3 golden scenario in idea.md ("constructs subagent-safe paths without re-discovering the subagent-UUID failure mode").
- S2: YES. Positive source + negative disclaimer paired in one sentence.
- S3: YES. Resolution section (backlog lines 61-77) names M2 chosen, M1 (I/O bootstrap dep) + M3 (workflow redesign) rejected with rationale, 10-file scope + T03 cross-ref, gobbi exclusion rationale, and DL-5 codification artifact. Clear for a future maintainer.
- S4: YES. New wording "supplied by the delegation prompt's session-id: field" is system-agnostic — under Codex the manager passes the same field. The dropped "(or the Codex session ID under Codex)" parenthetical is subsumed, and the `{system}` bullet (evaluation/SKILL.md:566, orchestration/workflow/evaluation.md:294) independently documents claude/codex. Coherent.

## Typed findings
None at or above threshold.

## Verdict: PASS

## Low-confidence appendix
- (conf 25) F-USE-LC1: the row says "Claude Code session ID" while the system can be Codex. Pre-existing framing (all prior variants said "Claude Code session ID from..."); the change does not worsen it, and the {system} bullet disambiguates. Not a T06 regression.
