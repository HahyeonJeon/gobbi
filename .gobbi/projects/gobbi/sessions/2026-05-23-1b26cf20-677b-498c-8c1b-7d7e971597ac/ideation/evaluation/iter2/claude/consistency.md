# Consistency — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md`. Whole-file scan applied per `mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`.

## Stage 1 — Locked Frame

### Scenarios (Consistency)

**S-C-1 (carry)** — Citations resolve to source — iter1 C1/FAIL (invented trailer); iter2 F-2 fix → re-verify whole-file.
**S-C-2 (carry)** — Cross-skill edits propagate — iter1 C2 (delegation/SKILL.md missing); iter2 T1-I-T1.i (line 271) adds delegation edit. Verify.
**S-C-3 (carry)** — Line-number citations precise — iter1 C3 (off-by-1). iter2 re-check.
**S-C-4 (NEW iter2, adversarial)** — F-4 branch name aligned with `git/conventions.md` branch-naming regex.
**S-C-5 (NEW iter2)** — F-1's flock language consistent across D-3-1, D-3-2, D-3-5, T3-I-T3.a, T3-I-T3.b, T3-I-T3.g.
**S-C-6 (NEW iter2)** — F-6 input/result-side disambiguation propagates between D-3-4 narrative and T3-I-3 description.

## Stage 2 — Findings

### S-C-1 (citation discipline)

**iter1 C1 → addressed.** F-2 + D-3 + T1-I-T1.d + G-1 + validation: 6 normative occurrences all use canonical `task/{task-id}`. One audit reference (line 488, F-2 itself) cites the OLD form to explain what was replaced — clearly marked. `git/conventions.md:118` independently re-read and confirmed canonical. Real fix.

### S-C-2 (cross-skill propagation)

**iter1 C2 → addressed.** T1-I-T1.i (line 271) — explicit `grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` validation step with "≤ 1 match, qualified" assertion. The qualified-rule extension now propagates to the delegation surface. Disposition: addressed.

### S-C-3 (line-number citation precision)

iter1 C3 noted `git/SKILL.md:155-162` (actual end 161) and `settings.json:31-39` (actual range 30-40). iter2 D-1 still cites `.claude/settings.json:30-40` (line 298, which is correct now). Citations spot-checked across draft-iter2.md:

- `git/SKILL.md:33` — still cited (D-2 line 303); verified canonical citation.
- `git/SKILL.md:155-161` — cited at line 167 (T1-I-2 footnote); now uses inclusive range that matches actual content.
- `preparation/SKILL.md:62` — cited (D-3 narrative); spot-checked.
- `git/conventions.md:118` — cited multiple places; verified.

Minor improvement on C3. Disposition: addressed.

### S-C-4 (NEW — branch-name regex alignment)

**FAIL.** See project.md P1. F-4 branch name `session/{date}-{ssid-short}` does NOT match the `git/conventions.md:22` regex `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/...`. The prefix `session/` is absent from the 11-prefix type registry at `git/conventions.md:42-54`. This is the same shape as iter1 C1 (citation discipline failure). iter2 fixed C1 but introduced a NEW citation-discipline failure in F-4. **Consistency lens confirms project.md P1 via whole-file scan.**

### S-C-5 (NEW — flock language consistency)

Whole-file grep for `flock`:
- Line 232 (G-1 T3 scenario): "acquires `flock -x` on `session.json` (D-3-5)"
- Line 233 (G-2 T3 scenario): "acquires `flock -x` on `session.json` (D-3-5)"
- Line 241 (E-5 scenario): "With D-3-5 (POSIX `flock -x` on `session.json`), hook B blocks on the lock"
- Line 276 (T3-I-T3.a): "acquires `flock -x <session.json>` per D-3-5 BEFORE read"
- Line 277 (T3-I-T3.b): "acquires `flock -x <session.json>` per D-3-5 BEFORE read"
- Line 282 (T3-I-T3.g): "Document the serialization primitive (`flock -x` on `session.json`)" + "lock file is `session.json` itself" + "opens the file with `exec {fd}>>\"$session_json\"`" + "runs `flock -x \"$fd\"`"
- Line 336 (D-3-1 rationale): "Bash's native `flock(1)` is available on every Linux/macOS host"
- Line 339 (D-3-1 validation): "concurrent-fire smoke test (D-3-5 validation)"
- Line 343 (D-3-2 update): "reconstructor also acquires `flock -x` per D-3-5"
- Line 346 (D-3-2 rationale): "Serialization via D-3-5 ensures reconstructor's verify-and-fix does not race"
- Line 348 (D-3-2 validation): "flock-coordinated double-run with concurrent hook"
- Line 388 (D-3-5 narrative): "POSIX `flock -x` on `session.json`"
- Line 393 (D-3-5 validation): "intentional `kill -9`-ing a hook process mid-run; subsequent hook fire should acquire the lock cleanly (POSIX `flock(2)` releases on process death)"
- Line 417 (D-3-2 validation table): "flock-coordinated double-run"
- Line 421 (D-3-5 validation table): "intentional `kill -9` lock-release test"

15 occurrences. All consistent: `flock -x` on `session.json` using `exec {fd}>>"$session_json"; flock -x "$fd"` pattern. Lock-release-on-process-exit semantics cited correctly. Disposition: addressed.

(Cross-reference S1 from structure.md: there's a subtle race window when the locked file is itself atomically replaced via temp+mv — but the language is internally consistent.)

### S-C-6 (NEW — F-6 input/result-side propagation)

D-3-4 (line 377-381) and T3-I-3 (line 184). T3-I-3 was updated iter2 (per F-6 line 496) to explicitly call out input-side / result-side. Read line 184: "**T3-I-3** — `step / phase / iter / model` are NOT in `toolUseResult` (the result side) — but `model` IS in `tool_input.model` (the input side) and `step / phase / iter / sub-step` ARE in `tool_input.prompt` as structured headers (per the empirical line 164 inspection — the leader prompt's opening lines include "Your phase: <X>", "Your iteration: <n>", "Your sub-step: <Y>"). Source: same empirical inspection. Why: surfaces D-3-4 — hybrid extraction strategy from the INPUT side of the same hook-stdin payload (not from `toolUseResult` which is the result side)."

D-3-4 explanation paragraph (lines 377-381) restates the split. The two sources are aligned. Disposition: addressed.

### Typed findings

```yaml
finding-id: C1-iter2
type: design_flaw
domain: docs-sync
disposition: open
confidence: 100
severity: Critical
surfaced-by: claude
inherited-from: none (NEW iter2 — F-4 introduces regression)
```
**C1 (NEW iter2 — mirrors project.md P1)** — F-4 branch name `session/{date}-{ssid-short}` (D-1 line 296, F-4 line 492, validation regex line 301) fails the `git/conventions.md:22` shape-check regex. The `session/` prefix is not in the 11-prefix type registry (`feat / fix / hotfix / chore / docs / refactor / test / ci / perf / build / style`). This is the SAME shape as iter1 C1 (citation discipline failure on `git/conventions.md`) — fixing C1 (trailer) introduced a new C1-shaped finding in F-4 (branch name). **Recurrence of mistake `leader-iter2-verification-claim-without-evidence.md` under Iron Law 11.** Evidence: draft lines 296, 301, 492; `git/conventions.md:22, 42-54`. Suggested direction: pick registry-compliant prefix — e.g., `chore/session-{date}-{ssid-short}` (slug 26 chars, fits 3-50 rule) — or surface a NEW contribution point to extend the registry (user lock required).

```yaml
finding-id: C2-iter2
type: checklist_gap
domain: docs-sync
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/claude/consistency C2
```
**C2 (carry-forward, addressed)** — T1-I-T1.i (line 271) edits `delegation/SKILL.md` for any hardcoded main-tree-absolute boilerplate; explicit grep validation. Disposition: addressed.

```yaml
finding-id: C3-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 75
severity: Low
surfaced-by: claude
inherited-from: iter1/claude/consistency C3
```
**C3 (carry-forward, addressed)** — Line-number citations spot-checked iter2; minor off-by-1 drift from iter1 resolved.

```yaml
finding-id: C4-iter2
type: general
domain: docs-sync
disposition: addressed
confidence: 75
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/consistency COD-CONS (D-3-4 vs T3-I-3 tension)
```
**C4 (carry-forward, addressed)** — F-6 explicit input/result-side language propagates between D-3-4 and T3-I-3; tension dissolved.

### Low-confidence appendix
- (none above 25)

## Verdict
**FAIL** — C1 is Critical / Confidence 100 (regex shape-check fail; recurrence of iter1 C1 pattern). C2/C3/C4 carry-forwards are all addressed. Whole-file scan was the key — the failure is not surfaceable from step-4-only reading because it spans (D-1 line, F-4 audit, validation regex) and requires comparing to `git/conventions.md:22` regex.
