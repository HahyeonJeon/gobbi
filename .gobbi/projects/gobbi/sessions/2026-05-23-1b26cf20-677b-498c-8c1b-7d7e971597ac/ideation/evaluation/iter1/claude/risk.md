# Risk — iter1 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0. The artifact is an Ideation draft for docs + 2 shell scripts. Blast radius is the workflow's session-foundation layer; reversibility is high (docs / hook are revertable); no security boundary added.

### Memory reads — see `project.md`.

## Stage 1 — Locked Frame

### Scenarios (Risk)

**S-R-1: If implemented and wrong, rollback path is identified** (seed)
- [a] Rollback path stated for each irreversible step (or "no irreversible steps" confirmed)
- [b] Rollback doesn't require perfect team coordination

**S-R-2: Blast radius bounded** (seed)
- [a] Affected files / modules / consumers enumerated
- [b] Backwards-compat impact stated for any external interface

**S-R-3: Security surface not silently expanded** (seed)
- [a] Security delta is `none` or explicitly described
- [b] Each new untrusted-input path has validation strategy

**S-R-4: Irreversible steps gated** (seed)
- [a] Each irreversible step explicitly flagged
- [b] Each carries explicit "go/no-go" decision point

**S-R-5: Two-week smell test** (seed)
- [a] Design avoids load-bearing future-self promises
- [b] Maintenance burden named, not denied

**S-R-6: Scope drift — design touches files outside Scope Contract** (seed, adversarial)
- [a] Diff Scope Contract against Design — no out-of-contract file/module mention
- [b] Out-of-scope changes either re-scoped or backlogged

**S-R-7: Concurrency / race-condition surface** (seed)
- [a] Shared mutable state identified (or "none")
- [b] Synchronization decision per shared-state surface

**S-R-8: Privacy / data retention** (Coverage Matrix)
- not-applicable: no new PII or sensitive data surface

**S-R-9: License / IP risk** (Coverage Matrix)
- not-applicable: no new external code, no borrowed code from outside the project (community-blog citations are reference-only)

**S-R-10: Cost / budget impact** (Coverage Matrix)
- [a] Recurring-cost dimensions (paid API, infra, storage) named with order-of-magnitude estimates
- [b] Cost-runaway scenario identified

**S-R-11: Hook script writes to a shared file (`session.json`) — concurrent-write risk** (NEW, adversarial)
- [a] Atomic write strategy specified (temp + mv) and verified
- [b] Concurrent Task spawns + their hook fires don't race on `session.json`

**S-R-12: NEW absorbed — sole-writer rule further broken; downstream invariants** (NEW)
- [a] Wrap-up's sole-writer rule for project memory survives the extension
- [b] Promotion-vs-commit ordering is unambiguous

## Stage 2 — Findings

### S-R-1 results
- [a] PASS — Docs edits + shell-script additions are revertable. T1 docs edits revert by `git revert`. T3 hook can be deactivated by removing the `.claude/settings.json` block. No DB migration, no public-API change.
- [b] PASS — Rollback does not require coordination; manager can disable hooks unilaterally.

### S-R-2 results
- [a] PASS — § Cross-task observations § "Files touched" (lines 309–321) enumerates ~10 doc edits + 2 scripts + 1 settings edit + 1 backlog item. Bounded.
- [b] PASS — No external interface (no API, no client contract). Only internal session-foundation behavior.

### S-R-3 results
- [a] PASS — § Adversarial sections (line 207, 230) explicitly declare "Not security-sensitive" for both T1 (path-routing change, no untrusted-input boundary) and T3 (hook reads its own session's transcript; writes its own session.json; no untrusted-input). Verified: the hook's stdin comes from Claude Code, the transcript comes from `$CLAUDE_TRANSCRIPT_PATH` which is the user's own home directory. No external input crosses any boundary new to T3.
- [b] N/A.

### S-R-4 results
- [a] PASS — `git worktree add` is not irreversible (worktree can be removed and re-created). Session-memory commits land on the worktree branch (revertable via PR amendment). No irreversible step.
- [b] N/A.

### S-R-5 results
- [a] PARTIAL — Two "future self" promises: (i) `status` field deferred to backlog (D-3-3 + checklist item 7) — explicit, named, backlog item exists; (ii) "factor to a sourced helper only if iter2 evaluation demands" (D-3-2, line 240) — deferred to a future evaluation cycle without a tracking item. The first is a clean defer; the second is a "we'll see" promise (Goodhart-risk: if iter2 evaluation passes, the DRY violation persists indefinitely).
- [b] PASS — Maintenance burden of T1 (every session creates a worktree + branch + at-least-one commit) is named in E-2 ("This is heavier than the prior 'main-tree direct' path"). T3's maintenance burden (hook script + reconstructor + structured-header convention) is named in § Implementation checklist.

### S-R-6 results (adversarial)
- [a] PASS — Diff against Scope Contract: every file touched is in the In-Scope item list or is a backlog promotion. No `packages/` code, no `_typescript`/`_bun` skill changes, no test code. § Cross-task observations 4 (line 309) explicitly calls out "no `packages/` code (matches Sub-step A observation 6)."
- [b] PASS — Out-of-scope items (Codex CI, Auto-mode silence, chat-mode, etc.) are routed to backlog files.

### S-R-7 results
- [a] PARTIAL — `session.json.agents[]` is the shared mutable state. Multiple Task spawns can complete in parallel → multiple PostToolUse hooks fire concurrently → all write to the same `session.json`. The atomic-write strategy (D-3-2 G-2 step 6: "Writes the merged agents[] back to session.json atomically (temp file + mv)") protects against partial writes BUT does not protect against lost updates (hook A reads session.json, hook B reads session.json, A writes, B writes — A's update is lost). **No lock file, no read-modify-write atomic loop, no jq -s '.merge' semantics.**
- [b] FAIL — Synchronization decision is silently absent for the multi-hook concurrent case. Acknowledged at idempotency level (E-2: hook fires twice for same `tool_use_id`) but not at parallel-hook level (two different `tool_use_id`s firing within the same temp+mv window).

### S-R-11 results (NEW adversarial)
- [a] PARTIAL — "atomic write (temp + mv)" is specified for the reconstructor (D-3-2 G-2 step 6) but not explicitly for the hook (G-1 step 6 says "Upserts into `session.json.agents[]`" without atomicity language). Whether the hook does the same temp+mv is implicit.
- [b] FAIL — same as S-R-7 [b].

### S-R-12 results (NEW)
- [a] PASS — NEW absorbed extends the existing narrow exception; doesn't introduce a second sole-writer violation. Promotion-then-commit is the same action surface as today.
- [b] PARTIAL — D-3 specifies "runs as closing step of Preparation EXIT promote-now" — order is: copy file → `git add` → `git commit`. Unambiguous AT D-3 level. But for the case where promotion FAILS halfway (file copy succeeds, git add fails): no rollback specified (would leave the file copied but not committed → next session reads a generated skill not in the worktree branch).

### S-R-10 results (Coverage Matrix — Cost)
- [a] PARTIAL — T3 hook fires on every Task completion → invokes `jq` + reads transcript + writes session.json. CPU cost is real but bounded (sub-second per fire). API/infra cost: zero (no network call). Storage cost: per-iteration session-memory commit adds ~KB to develop's history per session.
- [b] PASS — No cost-runaway scenario: hook can't go viral (it's bounded by the manager's Task spawn count, which is rate-limited by Claude Code's permission system).

### Typed findings

```yaml
finding-id: R1-iter1
type: design_flaw
domain: process
disposition: open
confidence: 75
severity: High
surfaced-by: claude
```
**R1 — Concurrent hook fires can lose updates to `session.json` (lost-update race); atomic write protects partial writes but not concurrent reads-modify-writes.** When two Task spawns complete in close succession, both PostToolUse hooks fire and each reads `session.json`, modifies in-memory `agents[]`, writes back. If hook A reads before hook B writes, hook A's write overwrites hook B's append. The draft mentions "atomic write (temp + mv)" only for reconstructor (D-3-2); for the hook itself, atomicity is only against partial-write torn-state (D-3-1 inherits session-start.sh patterns) — NOT against concurrent appenders. Evidence: draft G-1 step 6, D-3-2 G-2 step 6, F-1 line 218. Suggested direction: specify either (i) lock file (`flock` on session.json) before read-modify-write, OR (ii) reconstructor as the canonical writer with hook only enqueueing entries to a per-fire append-only file that reconstructor consumes, OR (iii) document "Claude Code serializes hook fires; concurrent races impossible" with a citation to the Claude Code hook execution model.

```yaml
finding-id: R2-iter1
type: design_flaw
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**R2 — Partial promotion failure (file-copy succeeds, `git add` or `git commit` fails) leaves the worktree in an inconsistent state with no specified rollback.** D-3 specifies copy → `git add` → `git commit`. If commit fails (e.g., gitignore conflict, no staged changes, signing failure), the file is copied but the worktree branch doesn't reflect it. The next time the manager loads the skill, it works in-session but the PR diff is incomplete — re-creating exactly the `1829fa3` failure mode T1 is designed to prevent. Evidence: draft D-3 (line 278), Implementation checklist T1-I-T1.d. Suggested direction: specify rollback — if commit fails, the manager removes the copied file from the worktree AND surfaces to user via AskUserQuestion before promoting.

```yaml
finding-id: R3-iter1
type: assumption_risk
domain: process
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**R3 — "Factor to a sourced helper only if iter2 evaluation demands" is a Goodhart-flag deferral (D-3-2 implementation note, draft line 240).** If iter2 evaluation passes without flagging the DRY violation (the inline jq snippets duplicated between hook and reconstructor), the deferral becomes indefinite. This is the "metric-as-target" anti-pattern: the evaluation deciding whether to factor is the same evaluation that would notice the divergence later. Evidence: draft line 240. Suggested direction: either factor now (one extra file: `.claude/scripts/lib/extract-agent-fields.sh`), or open a tracked backlog item for "DRY review of agents[] extraction logic after next jq change."

```yaml
finding-id: R4-iter1
type: scenario_gap
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**R4 — No scenario covers "abort during per-iteration session-memory commit" — partial commits can leave the worktree branch in a state where some session-memory deltas are committed and some aren't.** E-3 (line 198) covers abort-before-merge but not abort-mid-commit. If the per-iteration MEMORIZATION commit is interrupted (network glitch, OOM, SIGKILL), the worktree branch holds a partial state. Evidence: draft E-3 scenario. Suggested direction: add E-3.5 — "Per-iteration commit interrupted mid-flight; recovery via `git status` inside worktree on next session resume."

### Low-confidence appendix
- (none above 25)

## Verdict
**REVISE** — R1 (lost-update race on session.json) is a High-severity Risk finding at Confidence 75 — the hook design assumes serialization that isn't documented. R2/R3/R4 are Medium issues. R1 alone qualifies for REVISE per the per-perspective threshold rules (any High ≥ 50 → REVISE).
