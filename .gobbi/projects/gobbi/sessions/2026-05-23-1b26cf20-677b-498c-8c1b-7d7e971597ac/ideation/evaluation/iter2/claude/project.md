# Project — iter2 Claude

## Stage 0 — Artifact Summary

**Target**: `rawdata/draft-iter2.md` (502 lines) — iter2 of Ideation draft for feature `session-foundations-bundle-b`. Inherits Scope Contract, Framed Problem, Research Insights, Scenarios from iter1 verbatim and adds: 7 fix-decisions (F-1…F-7), D-3-5 (flock serialization), D-3-3-resolver, D-3-6 (correlation key), and updates D-1 (branch name), D-3 (trailer + rollback), D-3-3 (PostToolUseFailure citation), D-3-4 (input/result side split).

**W/W/H gate** — PASS. What/Why/How preserved from iter1 (which itself passed the W/W/H gate). iter2 changes are surgical additions, not framing changes.

**Memory reads**:
- `principles` skill (Iron Laws 6, 7, 11)
- `mistake` skill + 4 cited mistakes
- `evaluation/SKILL.md` 4-stage procedure + Finding schema
- `ideation/SKILL.md` § Sub-step D
- All 16 iter1 evaluation files (`evaluation/iter1/{claude,codex}/*.md`)
- `.claude/skills/git/conventions.md` lines 12–66 + 100–165 (full Branch Naming + Commit Trailers)
- `.claude/settings.json` (verified no `PostToolUseFailure` block, expected — would be added by T3)
- `.claude/hooks/session-start.sh` (79 lines; no `flock` precedent — D-3-5 is new pattern)
- Transcript `~/.claude/projects/.../7ea62d36-...jsonl` line 165 (verified `tool_use_id` + `tool_use.id` correlation)
- `.gobbi/project.json` — **DOES NOT EXIST** (verified `ls`)
- `staging/references/claude-code-{posttooluse-hook-schema,hooks-12-lifecycle-events}.md` (PostToolUseFailure ONLY appears in community-blog ref, not official-docs ref)

## Stage 1 — Locked Frame

### Scenarios (Project)

**S-P-1 (carry-forward)** — Root cause / prior witness / no scope drift — iter1 PASS, no iter2 change.

**S-P-2 (carry-forward)** — Scope Contract sharp + backlogged — iter1 PASS, no iter2 change.

**S-P-3 (carry-forward)** — Success criteria observable — needs iter2 re-check on E-5 / D-3-5 smoke test.

**S-P-4 (carry-forward)** — Counterfactual taken seriously — iter1 P3 surfaced steel-man gap; iter2 added explicit paragraph (lines 114–115). Verify.

**S-P-5 (carry-forward)** — Re-framing defensible — iter1 PASS.

**S-P-6 (carry-forward)** — Adjacent feature overlap — iter1 PASS.

**S-P-7 (carry-forward)** — Assumption ledger — iter1 P2 said `PostToolUseFailure` not in official docs; iter2 F-3 claims WebFetch'd verification. Verify.

**S-P-8 (carry-forward)** — Hypothesis / falsifying signal — iter1 PARTIAL; iter2 added smoke tests for E-5 / D-3-5 / D-3-3-resolver / D-3-6.

**S-P-9 (carry-forward)** — Prior art real — iter1 PASS.

**S-P-10 (carry-forward, adversarial)** — Citation discipline. iter1 P1/FAIL (invented `loop/` trailer). iter2 claims fix with re-citation of `git/conventions.md:118`. Verify whole-file scan.

**S-P-11 (NEW iter2, adversarial)** — Branch name `session/{date}-{ssid-short}` (D-1, F-4) is consistent with the canonical branch-naming regex at `git/conventions.md:22`.
- [a] Branch name shape passes the regex.
- [b] Branch prefix `session/` exists in the documented prefix registry (`git/conventions.md:42-54`).

**S-P-12 (NEW iter2, adversarial)** — Resolver precondition: `.gobbi/project.json` referenced in D-3-3-resolver step (i) exists in the project today.
- [a] If the file does not exist, the design depends on a not-yet-existing file → assumption_risk.

**S-P-13 (NEW iter2)** — F-3 official-doc citation: the URL `https://code.claude.com/docs/en/hooks` actually contains `PostToolUseFailure`.
- [a] Independent fetch confirms or refutes the leader's WebFetch claim.

## Stage 2 — Findings

### S-P-1…S-P-9 (carry-forward) — Re-walked; no NEW project-domain regressions in iter2 surgical edits.

### S-P-10 (citation discipline)

**iter1 P1 (invented `loop/` segment) — addressed.**
Whole-file grep of `draft-iter2.md` for `loop/preparation/promote-now`: only one occurrence at line 488 inside F-2 fix-decision audit text (clearly marked "(invented iter1)"). All 6 normative references (G-1 scenario line 210, T1-I-T1.d line 266, D-3 line 310, D-3 rationale line 312, validation line 315, F-2 line 488) use canonical `task/{task-id}`. F-2 explicitly cites `git/conventions.md:118` and the example `2026-05-20-abc123/task/03-add-cache-layer`. Independent re-read of `git/conventions.md:118` confirms the row reads exactly `gobbi://session/{session-id}/task/{task-id}` and example `task/03-add-cache-layer`. **Fix is real.**

### S-P-11 (NEW — branch naming regex)

**S-P-11.a — FAIL.** `git/conventions.md:22` regex is `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$`. The leader's chosen branch shape `session/{date}-{ssid-short}` (D-1, F-4, validation regex `session/[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}`) starts with `session/` — **NOT in the type registry** at lines 40–54 (`feat / fix / hotfix / chore / docs / refactor / test / ci / perf / build / style` — eleven prefixes, none being `session`). The proposed branch name FAILS the regex shape-check.

**S-P-11.b — FAIL.** The prefix registry at `git/conventions.md:42-54` enumerates eleven type prefixes; `session/` is absent. To use `session/`, the design must either (i) extend `conventions.md` (adds an out-of-scope surface to the contract that is not flagged), or (ii) choose a prefix from the registry (e.g., `chore/session-<ssid-short>`).

This is the EXACT same shape as iter1 P1 — claim of conformance to a `git/conventions.md` source where the source does not support the claim. Per `mistakes/leader-iter2-verification-claim-without-evidence.md`, this pattern was already flagged. iter2's F-4 fix introduces a NEW citation-discipline failure while addressing a different one (F-2). **Karpathy orthogonal-edits mode confirmed.**

Note also the regex's per-character class `[a-z0-9]` (lowercase only). The session id is hex `[a-f0-9]` — passes; but the date includes the literal `-` separator after a 4-digit year. The regex `([a-z0-9]+(-[a-z0-9]+)*)` accepts `-`-separated hyphen runs. So if `session/` were allowed, `session/2026-05-23-1b26cf20` would otherwise be slug-shape-valid. The blocker is purely the prefix-registry violation.

### S-P-12 (NEW — resolver precondition)

**S-P-12.a — FAIL.** `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns `No such file or directory`. The D-3-3-resolver step (i) "Read `$cwd/.gobbi/project.json` and extract the `name` field if the file exists" is therefore a future-state precondition, not a present-state read. The fallback step (ii) (scan `$cwd/.gobbi/projects/` for a single directory) is the ONLY path that resolves today; the project has one directory (`gobbi/`) under `.gobbi/projects/`, so the fallback resolves correctly. However:

- The design narrates step (i) as the "preferred" path, but in practice (i) NEVER fires until some other workstream creates `project.json`. This is fine for graceful degradation BUT not flagged as a known future-state precondition.
- If a future session adds a second project directory under `.gobbi/projects/` (uncommon but allowed), the fallback (ii) fails with `n=2` and the resolver exits non-zero — silent regression unless `project.json` is also created.

**Disposition**: not blocking (the (ii) fallback works today and the (i) precondition is gracefully optional), but the design SHOULD acknowledge that `project.json` does not yet exist and (i) is dormant. assumption_risk Medium.

### S-P-13 (NEW — F-3 PostToolUseFailure official-doc verification)

**S-P-13.a — UNVERIFIED.** Independent fetch to `https://code.claude.com/docs/en/hooks` was blocked by the auto-mode network policy ("destination not in trusted Environment list"). I cannot independently confirm the leader's WebFetch result. The staged reference `claude-code-posttooluse-hook-schema.md` (the OFFICIAL-docs reference T3-E-1) STILL does not mention `PostToolUseFailure` — only `claude-code-hooks-12-lifecycle-events.md` (the COMMUNITY `claudefa.st` blog) mentions it. The iter2 F-3 fix-decision claims the leader fetched the official page and confirmed presence; but per `mistakes/leader-iter2-verification-claim-without-evidence.md` (cited in this evaluator's brief), claims of fresh verification without artifact (no quote, no screenshot, no fetch log) cannot be trusted.

The T3-E-5 insight (line 194) says "PostToolUseFailure IS officially documented … (fetched 2026-05-23 via WebFetch — see Decisions Log iter2 fix-decision F-3 for the verbatim takeaway)." F-3 itself (line 490) says "WebFetch of `https://code.claude.com/docs/en/hooks` on 2026-05-23. Result: `PostToolUseFailure` IS officially documented as a shell-command-supported hook event (one of 31 documented events; explicitly listed in the doc with decision-control behavior)." There is no verbatim quote. **Cannot independently verify.** Downgrade to assumption_risk; the design SHOULD include the fallback design (PostToolUse-only registration with reconstructor handling failures) regardless.

### Typed findings

```yaml
finding-id: P1-iter2
type: design_flaw
domain: process
disposition: open
confidence: 100
severity: Critical
surfaced-by: claude
inherited-from: none (NEW iter2 — orthogonal-edit regression introduced by F-4)
```
**P1 (NEW iter2) — F-4 branch name `session/{date}-{ssid-short}` VIOLATES `git/conventions.md:22` regex (prefix `session/` not in the 11-prefix type registry).** D-1 (line 296), F-4 (line 492), validation regex (line 301) all propose `session/`-prefixed branch names. `git/conventions.md:22` regex is `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/...`; `git/conventions.md:42-54` enumerates 11 type prefixes and `session` is not among them. The branch name will FAIL the shape-check validator on the first invocation of git P2 at row 5.5. This is the EXACT same citation-discipline failure pattern as iter1 P1 (claim of conformance to a `git/conventions.md` source that does not support the claim) — see `mistakes/leader-iter2-verification-claim-without-evidence.md`. **Recurrence of a previously-promoted mistake under Iron Law 11 ("NO IMPROVEMENT THAT GAMES THE TOOL") — fixing one citation-discipline finding (F-2) introduced another (F-4).** Evidence: draft lines 296, 301, 492; `git/conventions.md:22, 42-54`. Suggested direction: pick a registry-compliant prefix — e.g., `chore/session-{date-yyyymmdd}-{ssid-short}` (slug `session-{date}-{ssid}` is 26 chars, fits 3-50 length rule). Or extend the registry via a separate Scope Contract addition, but that surfaces a NEW contribution point that wasn't user-locked.

```yaml
finding-id: P2-iter2
type: assumption_risk
domain: process
disposition: open
confidence: 50
severity: High
surfaced-by: claude
inherited-from: iter1/claude/project P2; iter1/codex/project (PostToolUseFailure thread)
```
**P2 (carry-forward, partially-addressed) — F-3 claims `PostToolUseFailure` is officially supported per WebFetch of `https://code.claude.com/docs/en/hooks` (fetched 2026-05-23) but no verbatim quote is preserved.** I attempted independent fetch; auto-mode network policy denied access to `code.claude.com` ("destination not in trusted Environment list"). Cannot independently confirm. The staged OFFICIAL reference `claude-code-posttooluse-hook-schema.md` still does not list `PostToolUseFailure`. The leader's verification claim per `mistakes/leader-iter2-verification-claim-without-evidence.md` requires artifact (quote / fetch log / screenshot) — none preserved. **If `PostToolUseFailure` is misremembered or the page changed, dual registration silently fails on the failed-spawn path — the exact failure mode T3's `status: "failed"` design exists to prevent.** Evidence: draft line 354 (D-3-3 rationale), line 490 (F-3), staged reference inconsistency. Suggested direction: (i) preserve a verbatim quote from the official-doc page in the staged reference (re-stage `claude-code-posttooluse-hook-schema.md` to include the PostToolUseFailure section, OR add a new staged ref capturing the page's "31 documented events" list); (ii) add explicit fallback design (PostToolUse-only registration with reconstructor handling failures via timeout-detect) so the failure mode is recoverable regardless of which event fires.

```yaml
finding-id: P3-iter2
type: assumption_risk
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/structure COD-STRUCT-001 (resolver thread)
```
**P3 (NEW iter2 from S-P-12) — D-3-3-resolver step (i) reads `.gobbi/project.json` which DOES NOT EXIST today.** Verified `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` → `No such file or directory`. The design narrates step (i) as the "preferred" path. The fallback step (ii) (single-directory scan under `.gobbi/projects/`) works today because exactly one project directory exists. But the design does not flag the precondition. **Risk**: if a session creates a second project under `.gobbi/projects/<other>` (e.g., a sub-project for plugin development) without first stamping `project.json`, the resolver fails silently. Evidence: draft line 364, `ls` empirical. Suggested direction: explicitly state in D-3-3-resolver that step (i) is currently a future-state read; step (ii) is the active path; document that `.gobbi/project.json` is a workstream the design assumes will exist (or backlog its creation explicitly).

```yaml
finding-id: P4-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 100
severity: Low
surfaced-by: claude
inherited-from: iter1/claude/project P1; iter1/codex/project (citation thread on trailer)
```
**P4 (iter1 P1 / COD trailer thread — addressed iter2).** F-2 fix-decision (line 488) replaces invented `loop/preparation/promote-now` with canonical `task/{task-id}` where `{task-id}` = `preparation-promote-now-iter{n}`. Whole-file grep of `draft-iter2.md` confirms all 6 normative occurrences use canonical form; only 1 occurrence of the OLD form remains, at line 488 in F-2's audit text where it is explicitly labeled "(invented iter1)". `git/conventions.md:118` independently re-read: confirmed canonical `task/{task-id}` form. **Real fix.**

### Low-confidence appendix
- (none above 25)

## Verdict

**FAIL** — P1 is Critical / Confidence 100 (regex shape-check FAIL on the very first invocation of git P2 at row 5.5). This is a recurrence of the iter1 citation-discipline failure pattern (`mistakes/leader-iter2-verification-claim-without-evidence.md`), introduced ORTHOGONALLY by an iter2 fix (F-4) for a DIFFERENT iter1 finding (COD-PROJ-001). Per `evaluation/SKILL.md` verdict rules, any Critical at confidence ≥ 75 → FAIL. P2 (Confidence 50, High) and P3 (Confidence 75, Medium) compound the verdict.

The iter1 P1 trailer fix (F-2) is real. The iter1 R1 lost-update fix (F-1, D-3-5 flock) is real (Risk perspective will re-verify). But F-4's branch-name choice was not source-grounded against the actual branch-naming regex.
