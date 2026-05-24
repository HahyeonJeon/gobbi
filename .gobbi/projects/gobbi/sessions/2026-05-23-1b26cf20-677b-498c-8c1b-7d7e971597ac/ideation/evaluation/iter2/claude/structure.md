# Structure — iter2 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0. Target adds D-3-5 (flock), D-3-3-resolver, D-3-6 (correlation key). Memory reads: same as project.md + transcript line 165 inspection.

## Stage 1 — Locked Frame

### Scenarios (Structure)

**S-S-1 (carry)** — Components have clear ownership — iter1 PASS.
**S-S-2 (carry)** — Data flow acyclic + testable — iter1 PARTIAL (resolver + correlation); iter2 D-3-3-resolver + D-3-6 address.
**S-S-3 (carry, adversarial)** — No hidden shared-state hub — iter1 FAIL (no flock); iter2 D-3-5 addresses.
**S-S-4 (carry)** — Boring-by-default — iter1 PASS; verify D-3-5 doesn't add new dep.
**S-S-5 (carry)** — Worktree-first bootstrap testable — iter1 PARTIAL (COD-PROJ-001 branch-naming gap); iter2 F-4 attempts but introduces NEW issue (see project.md P1).
**S-S-6 (NEW iter2, adversarial)** — D-3-5 flock primitive matches the precedent stack (bash + jq via `session-start.sh`).
  - [a] `flock(1)` is present in the precedent shell environment.
  - [b] D-3-5 lock-acquisition pattern matches POSIX `flock(2)` semantics for read-modify-write.
**S-S-7 (NEW iter2)** — D-3-6 correlation jq paths match empirical transcript shape.
  - [a] `.message.content[]? | select(.type == "tool_use" and .id == $tool_use_id)` works on actual line 164.
  - [b] `.message.content[]?.tool_use_id == $tool_use_id` works on actual line 165 (tool_result line).

## Stage 2 — Findings

### S-S-1…S-S-5 — Re-walked.

**S-S-2 (resolver/correlation)** — D-3-3-resolver (line 359) and D-3-6 (line 395) materially address the iter1 COD-STRUCT-001 + COD-STRUCT-003 gaps. Resolver algorithm is explicit (precedence, fallbacks, negative cases). Correlation key has exact jq paths. The disposition of iter1 COD-STRUCT-001 and COD-STRUCT-003 is now **addressed**, subject to the project.md P3 caveat (`.gobbi/project.json` not-yet-existing — graceful but unflagged).

**S-S-3 (flock / lost-update)** — D-3-5 (line 388) explicitly serializes hook AND reconstructor via POSIX `flock -x` on `session.json`. Pattern: `exec {fd}>>"$session_json"; flock -x "$fd"` then read-modify-write, release on process exit. iter1 R1 / COD-STRUCT-002 disposition: **addressed.**

**S-S-5 (branch-naming precondition)** — F-4's `session/`-prefixed branch name FAILS the branch-name regex; see project.md P1 — same finding from Structure lens.

### S-S-6 (NEW — flock precedent)

**S-S-6.a — PASS.** `flock(1)` is part of util-linux on Linux and Homebrew util-linux on macOS; the precedent stack (bash + jq) already runs on these hosts per `session-start.sh`. D-3-1 rationale (line 336) acknowledges "Bash's native `flock(1)` is available on every Linux/macOS host" — accurate.

**S-S-6.b — PARTIAL.** D-3-5 narrates `exec {fd}>>"$session_json"; flock -x "$fd"` — correct shape. However:

1. The `>>` append-only redirect opens the file in O_APPEND mode. After acquiring the lock, the script reads the file via `jq` (separate process opens a fresh fd) and writes via temp+mv. The lock IS held on the original fd until the script exits — correct. But the rewrite via `mv` (atomic rename) REPLACES the file; the next hook fire opens the NEW inode. flock semantics: locks are on the open-file-description tied to the inode. After atomic mv, the new inode has no lock — but the NEXT hook fires AFTER the mv completes, so the lock on the OLD inode is irrelevant; the new hook opens the new file, acquires its own lock. Correct.

2. **Risk**: if hook A acquires lock on old-inode-fd, hook B opens the new path and obtains a fresh inode fd, B also acquires lock (different inode). If A's read-then-mv is still in flight, B's read sees A's last-committed state (which is the old file content if A hasn't mv'd yet, or the new file content if A has). The race window between A's `mv` and A's `flock` release is non-zero. **Subtle but real**: standard `flock + mv` does NOT serialize when the lock target IS the file being replaced. Production lock-files for this pattern typically use a sidecar `session.json.lock` file. Worth surfacing.

### S-S-7 (NEW — correlation key empirical match)

**S-S-7.a — PASS.** Empirical transcript line 165 (spot-checked via `sed -n 163,166p`): the leader's `Agent` tool_use line includes `"type":"tool_use","id":"toolu_0194Ri52Lv1m6JpxT1nXBNbf","name":"Agent","input":{...}` inside `message.content[]`. jq path `.message.content[]? | select(.type == "tool_use" and .id == $tool_use_id)` matches. Correct.

**S-S-7.b — PARTIAL.** D-3-6 (line 399) says tool_result line is matched via `.message.content[]?.tool_use_id == $tool_use_id`. Empirical: the tool_result line in transcript JSONL has `message.content[]` entries with type `"tool_result"` containing a `tool_use_id` field (not `id`). D-3-6's jq path uses `.tool_use_id` which is the tool_result-side correlation field — correct shape. However, D-3-6's third bullet says "find the corresponding `toolUseResult` line later in the file by `tool_use_id` match" — the top-level `toolUseResult` field on the line is a SEPARATE structure from `message.content[].tool_use_id`. The jq paths in D-3-6 bullets 1–2 correctly target both surfaces. Bullet 3's prose conflates "toolUseResult line" with "tool_result content type" — minor language-precision issue but not blocking.

### Typed findings

```yaml
finding-id: S1-iter2
type: design_flaw
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
inherited-from: none (NEW iter2 — D-3-5 subtle race window)
```
**S1 (NEW iter2) — D-3-5 `flock -x` semantics may have a race window when combined with atomic temp+mv replacement of the locked file.** POSIX `flock(2)` locks tie to the open-file-description (inode + fd). When the script `mv`'s a temp file over `session.json`, the new file is a new inode. The lock held on the OLD inode does not protect the NEW inode. Hook B opening `session.json` AFTER hook A's mv sees the new content correctly, but if hook B opens during the (brief) window between A's lock-release and B's flock-acquire on the new inode, AND if a third hook C is simultaneously trying to write, the read-modify-write cycle can still race. Production pattern: use a SIDECAR lock file (e.g., `session.json.lock`) that is not itself replaced by the writer. Evidence: draft D-3-5 (line 388), D-3-1 footnote (line 336). Suggested direction: change D-3-5 to lock on `session.json.lock` (a sidecar that is never `mv`'d), not on `session.json` itself. The lock file is created if absent (touch + chmod), opened with `exec {fd}>>"$lock_file"`, flock'd, then `session.json` is read-modify-written without affecting the lock target.

```yaml
finding-id: S2-iter2
type: checklist_gap
domain: docs-sync
disposition: addressed
confidence: 100
severity: High
surfaced-by: claude
inherited-from: iter1/codex/structure COD-STRUCT-002
```
**S2 (carry-forward) — iter1 COD-STRUCT-002 (lost-update via parallel hooks).** D-3-5 (line 388) adds POSIX `flock -x` serialization. Sub-finding S1 above flags a subtle inode-replacement edge case, but the primary lost-update race documented in iter1 is materially addressed by the lock. Disposition: addressed (with S1 as a refinement-not-blocker).

```yaml
finding-id: S3-iter2
type: design_flaw
domain: process
disposition: addressed
confidence: 100
severity: High
surfaced-by: claude
inherited-from: iter1/codex/structure COD-STRUCT-001
```
**S3 (carry-forward) — iter1 COD-STRUCT-001 (resolver underspecified).** D-3-3-resolver (line 359) provides explicit two-tier project-name precedence + sessions-scan date prefix derivation + negative-case exit semantics. The (i) `.gobbi/project.json` precondition is flagged in project.md P3 but does not block resolution today (fallback (ii) works). Disposition: addressed (with P3 as a refinement-not-blocker).

```yaml
finding-id: S4-iter2
type: checklist_gap
domain: observability
disposition: addressed
confidence: 100
severity: Medium
surfaced-by: claude
inherited-from: iter1/codex/structure COD-STRUCT-003
```
**S4 (carry-forward) — iter1 COD-STRUCT-003 (transcript correlation key contract).** D-3-6 (line 395) provides exact jq paths for both tool_use (line 164) and tool_result (line 165) correlation, validated against empirical transcript shape. Disposition: addressed.

```yaml
finding-id: S5-iter2
type: general
domain: docs-sync
disposition: open
confidence: 50
severity: Low
surfaced-by: claude
inherited-from: none (NEW iter2 — minor language imprecision in D-3-6)
```
**S5 (NEW iter2) — D-3-6 bullet 3 prose conflates `toolUseResult` (top-level field on the tool_result transcript line) with `tool_result` content type (`message.content[].type == "tool_result"`). They are distinct structural surfaces — the jq paths in bullets 1–2 correctly target both, but bullet 3's prose suggests they are one. Low-severity readability issue.** Evidence: draft line 400. Suggested direction: rephrase to "find the matching tool_result content entry via `tool_use_id`, then read the top-level `toolUseResult` field on the same line."

### Low-confidence appendix
- (none above 25)

## Verdict

**REVISE** — S1 is Medium / Confidence 50 (subtle flock-on-locked-file edge case; not a blocker because the primary race is closed). S2/S3/S4 carry-forward iter1 High findings are all addressed. S5 is Low. No NEW High findings from Structure perspective (the High orthogonal-edit regression is filed under Project P1 / Consistency, not Structure). Net: Structure perspective verdict is REVISE on S1 alone (Medium ≥ 50 does not by itself revise; but per inherited High-from-Project P1, the Overall verdict will be FAIL).

Stand-alone Structure verdict: **PASS** with one Medium follow-up (S1).
