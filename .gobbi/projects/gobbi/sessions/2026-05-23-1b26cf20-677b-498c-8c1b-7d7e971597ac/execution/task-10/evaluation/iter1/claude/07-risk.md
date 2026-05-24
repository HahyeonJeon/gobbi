# Perspective: Risk

## Frame execution

### R1 — flock safety claim correctness

- Claim: "concurrent subagent spawns … fire PostToolUse events that arrive interleaved, and the lock guarantees the upserts apply in sequence rather than racing each other into a torn write."
- Mechanism in T07: `( flock -x 9 ... mv -f tmp final ) 9>"$lock_file"`. The lock is acquired before the read, held across read-jq-write, released after `mv`. `mv` within the same filesystem is atomic. So a concurrent process either waits at flock (blocking on the fd-9 exclusive lock) or sees the post-`mv` file. Torn writes are prevented.
- Claim is CORRECT given the implementation. The risk surface T10 should worry about:
  - Process death between flock and mv → tmp file lingers (`$session_json.tmp.$$`); not a torn final file but stale garbage. Not addressed in doc; minor.
  - Lock file is never cleaned up (`$session_json.lock` persists forever). Benign — POSIX advisory locks are released on process exit; the file itself is just a stable lock target. Not worth documenting.
- "The manager does not need to throttle spawns or stagger dispatches" — true given flock + atomic mv. ✓

### R2 — Missed hook event recovery

- Doc claim: "Idempotency and recovery from missed hook events are provided by [reconstruct-agents.sh] … reconciles `agents[]` against ground truth."
- T08 source verification: `# Orphan-report-only: entries already in agents[] that have no transcript match are LISTED on stderr but never deleted or mutated.` — orphans are not removed; they are reported. The doc says "reconciles" which is broadly correct (idempotent upsert + report orphans) but could be read by an adversarial implementer as "deletes stale entries", which is not what T08 does.
- Materiality: low. The cross-link is to the script which carries the actual contract.

### R3 — PostToolUseFailure tokensUsed risk

- Doc: "the same hook, firing on PostToolUseFailure as well, updates `finishedAt` / `tokensUsed` / `endStatus`".
- Reality: on PostToolUseFailure the tier1/tier2 payloads may be empty (no `toolUseResult`); T07's tokens fall back to `0` for all four metrics. The doc implies tokens are populated; downstream consumers computing token usage by summing `agents[*].tokensUsed` could underreport. Worth a one-sentence caveat.

### R4 — Header omission failure mode

- Doc: "Omitting the headers does not break the subagent, but it leaves `session.json.agents[]` entries with `phase` / `iter` / `sub-step` set to `null`."
- Source check: T07 writes `null` for empty header — confirmed. ✓
- "Downstream session-memory queries treat as missing data" — generic; acceptable hand-wave.

### R5 — Template-vs-doc contradiction risk

The F-U-1/F-U-2 contradiction means the operating model is: doc says required headers ship in templates; templates only ship 2 of 4. In high-churn scenarios where the manager rolls a parallel spawn group without manually adding `sub-step`, the `session.json.agents[]` entries collide on `(phase, iter)` and become unanalyzable. Operational risk, Medium.

## New findings

- **F-R-1 [risk / docs-sync, Medium, 75]**: PostToolUseFailure path writes zero token usage but doc implies `tokensUsed` is updated on failure too. Tool that sums per-session token cost from `agents[]` will silently undercount failed spawns. One-line caveat would close the risk.
- **F-R-2 [risk, Low, 75]**: "reconciles `agents[]` against ground truth" could be read as "deletes orphans"; T08 only reports orphans. Mild ambiguity, low risk because the link points to the script.
- **F-R-3 [risk / process, Medium, 75]**: Per CC6 / F-U-1, templates ship 2 of 4 headers; manager dispatching parallel evaluators without `sub-step` produces colliding `(phase, iter, null)` entries — directly defeats the "sub-step disambiguates parallel spawns" purpose stated in the doc table.

## Verdict

REVISE — Two Medium findings each @ 75 confidence (≥50 threshold met) → REVISE.

Note: the safety property the user explicitly asked to validate (flock makes concurrent spawns safe) is CORRECTLY described and matches T07/T08. The risks are around omitted nuance and template contradiction, not the core mechanism.
