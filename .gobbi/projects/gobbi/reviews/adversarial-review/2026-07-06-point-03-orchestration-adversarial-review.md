---
name: point-03-orchestration-adversarial-review
description: 3-way adversarial review of the orchestration skill — scripts refactor, agent-teams currency, and completeness gaps (incl. the Codex runtime matrix).
type: reviews
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [evaluation]
keywords: [orchestration, adversarial-review, scripts, shell-lib, codex-runtime-matrix, agent-teams-currency, completeness, configuration-doc]
author: claude
review_kind: adversarial-review
subject: orchestration/scripts/*.sh + record/scripts/*.sh + agent-teams.md + workflow/*.md (completeness)
verdict: needs-attention
---

# Point 3 — Orchestration adversarial review

## Point (verbatim user text)

> Point3 is the last point. Let's do adversarial-review about orchestration skill.
> 1. I think the scripts look messy and hard-coded. We need to make them clearer.
> 2. Validate agent-teams.md contains latest information and other utility descriptions like how to show teammates in claude code session UI. Consider other useful helpers.
> 3. Completeness of orchestration based on the scenarios and checklists including dual-system with codex.

## Session context

- **Mode:** Chat-mode review. **Implementation is DEFERRED** — this is the review + change-set.
- **3-way investigation:** `leader` (Claude, this producer, read all 11 scripts in full) + independent frozen `codex` proposal (879L, independently fetched the Claude Code docs) + a `claude-code-guide` currency report (`working/research/agent-teams-currency-report.md`) that owns 3.2's ground-truth. The producer SELECT-integrated (never blend), and **verified Codex's line anchors against the files** (as in Point 2). Cross-system record in § Cross-system reconciliation + `working/reconciliation-iter1.md`.
- **Verdict `needs-attention`:** the design is directionally strong; the weak spots are the implementation surface — a real dual-system correctness contradiction (#1), a fail-open in a verification gate, script duplication, stale Agent Teams docs, and completeness gaps. All fixable.

## Decisions locked

**User decisions (locked this session):**
1. **Codex runtime = ADOPT Codex's runtime matrix (priority #1 — silent dual-system loss).** One authoritative Codex-runtime section reconciling `codex/SKILL.md` + `workflow/production.md` + `workflow/evaluation.md`: **foreground under the host cap / background + file-poll above the host cap / assistant-wrapper ONLY if it validates the contracted output files SAME-TURN (files-as-truth)**. Mark the superseded foreground-`timeout 1200` guidance. Resolves C-HIGH-2 + C-HIGH-3.
2. **Scripts = FULL refactor.** `scripts/lib/common.sh` (strict-mode `set -euo pipefail`, `require_cmd`, shared path-resolution, `die`/`usage`) + `record-map.manifest.json` single-source (scaffold + verify + doc all consume it — fixes the S-HIGH-4 "drift-gate verifies its own twin" gap) + externalized fixtures (retire the S-HIGH-5 frozen FAMILY_B baseline) + a `--self-test` smoke suite.

**Priority order (user-confirmed, Codex's):** 1 runtime matrix → 2 shell lib + manifest → 3 Agent Teams refresh → 4 scenario suite.

---

## Findings 3.1 — Scripts (ADVERSARIAL) — change-set A (lib) + B (manifest) + fixtures

11 scripts, 2,835 lines. The user's "messy + hard-coded" read is CORRECT. Both systems converged on the systemic story; anchors verified.

### The systemic patterns (ranked)

| ID | Finding | Evidence (file:line, verified) | Sev | Fix |
|---|---|---|---|---|
| S-HIGH-1 | **Not fail-closed** — 9 scripts `set -uo pipefail` (no `-e`); a guard that continues after a failed `cd`/`grep`/subst can report a false PASS | all check-scripts (`check-merge:127`, `validate-integration-log:65`, `agent-token-usage:28`, etc.); only scaffold/init/verify use `-euo` | High | Standardize `set -euo pipefail` + explicit `|| true` on intentional-nonzero; `require_cmd`. **Nuance (leader):** the accumulator check-scripts legitimately continue-on-VIOLATION — apply `-e` with care so a `grep` no-match (exit 1) doesn't abort a scan mid-loop |
| S-HIGH-2 / M4 | **Portability: 3 audit gates are bash-4-mandatory + GNU-only** | `declare -A` (check-merge:366, check-skill-mistakes:145, check-residual-vocab:195), `mapfile` (check-merge:452), `realpath -m` (check-merge:304), `flock` (reconcile:206) | High | `require_bash_4` + `require_cmd`; document "GNU coreutils + bash≥4" OR replace GNU-only calls. Runtime materializers + validate-integration-log + check-markdown-links are bash-3.2-safe (two tiers) |
| **C-BUG-1 (leader-only)** | **`canon()` is FAIL-OPEN** — `realpath -m 2>/dev/null` returns EMPTY on failure → all Family-1/1b/1c path checks silently compare empty keys → gate prints "REF-INTEGRITY OK" with checks disabled | `check-merge-ref-integrity.sh:304` | High | Probe `realpath -m` at startup + fail-CLOSED (exit 2), or a portable canon fallback. **A verification gate must fail closed** — Codex's S-HIGH-1/2 touch the general class; this is the specific silent-false-pass mechanism |
| S-HIGH-3 (Codex-only) | **`agent-token-usage.sh` null totals** — `map(.x//0)\|add` returns `null` over an empty array → null token fields flow into `reconcile:159` | `agent-token-usage.sh:54-59,62-67` | High | `add // 0` on every aggregate + fixtures (empty transcript / no-usage / all-sidechain) |
| **AGENT-TOKEN bug #2 (leader-only, DISTINCT)** | **`main_filter` built but never injected** — line 42 builds the filter string, but the jq is copy-pasted into two branches instead of interpolating it (dead string + duplicated pipeline) | `agent-token-usage.sh:42,54-68` | Med | one jq with the filter interpolated; delete the dead string. **BOTH agent-token bugs are real and distinct** — Codex's null-total + leader's dead-filter |
| S-HIGH-4 | **record-tree contract triple-copied** — the drift-gate builds its baseline from its OWN twin of the scaffold array, not the SSOT | scaffold:116-126 ≡ verify:61-66; verify:90-109 re-creates the subtree | High | `record-map.manifest.json` single source (scaffold + verify + doc consume it) |
| S-HIGH-5 | **`check-residual-vocab.sh` embeds a frozen migration baseline** — 26 hardcoded carriers + 147 "MEASURED" lines the header says to "regenerate after any edit"; both families are COMPLETED migrations (D18 memorization-rename + #310/#312 `_shared`) | check-residual-vocab:157-186,188-201 | High | Externalize to `fixtures/residual-vocab-family-b.tsv` + a `--regenerate` mode, OR **RETIRE** if migrations confirmed complete (leader recommends confirm→retire) |
| S-MED-1 | verify-record-map doc checks are weak `grep -qF` anywhere-in-prose | verify:70-81 | Med | parse a generated fenced manifest block, not arbitrary prose |
| **S-MED-2 (leader CONCEDES)** | `validate-integration-log.sh` `\b` word-boundary is GNU-only ERE — BSD/macOS grep doesn't support it, breaking the names-both-sides heuristic | validate-integration-log:70-71,123-124 | Med | `(^\|[^[:alnum:]_])(...)([^[:alnum:]_]\|$)` explicit boundaries |
| **S-MED-3 (leader CONCEDES)** | `check-markdown-links.sh` `find -type f` (no `-L`) skips symlinked mirror docs; the `]\([^)]*\)` parser breaks on link titles + nested parens | check-markdown-links:57,81-86 | Med | decide canonical-vs-mirror scope; `find -L` if mirrors; document/parse the supported subset + fixtures |
| S-MED-4 | self-location + repo-root `../../..` duplicated + fragile across ~7 scripts (inconsistent var names + `$0` vs `${BASH_SOURCE[0]}`) | check-skill-mistakes:86-89, check-residual-vocab:97-101, check-workflow-mirror:60-63,81-83, init:70-72, verify:27-29, reconcile:76-78 | Med | shared `script_dir`/`project_dir`/`repo_root` helpers with marker validation |
| S-MED-5 | reconcile brittle option-parse + undeclared deps (`jq`/`flock`/`tail`) | reconcile:52,60-62,206 | Med | `require_cmd jq flock grep tail` + explicit `[ $# -ge 2 ]` option branches |
| S-LOW-1 | init-record-map hardcodes the README body in code | init:93-103 | Low | `templates/session-readme.template.md` |

Also duplication (leader H2, verified in the full read): **`slugify()` VERBATIM-duplicated** (check-merge:309-313 ≡ check-skill-mistakes:98-102); `trim()` defined ≥3×; `log`/`usage`/`add`+accumulator idiom everywhere → the `lib/common.sh` exports these too.

### The divergence I had to resolve (leader "clean" vs Codex "MEDIUM") — CONCEDED

My iter1 draft called `check-markdown-links.sh` + `validate-integration-log.sh` "clean (counter-evidence)." **I verified against the files: Codex is right on BOTH (S-MED-2, S-MED-3); I concede.** My "clean" checked the systemic patterns + happy-path correctness + bash-3.2-safety, but did NOT stress-test the `\b` regex portability or the markdown-parser edge cases + symlink walking. The nuance that SURVIVES: their internal algorithms are still high-quality and bash-3.2-safe — but "no findings" was wrong.

### Refactor-not-rewrite guardrail (leader-only, load-bearing)

The gates' ALGORITHMS are high-quality and MUST be preserved: `check-merge`'s rules.md-parsing self-test (anti-drift, fail-closed on class-set drift); `validate-integration-log`'s escaped-pipe COLUMN discipline (COD-STRUCT-1 — reads field $4, never a body grep); `check-skill-mistakes`'s `## Archived`-boundary handling. **Do NOT flatten the necessarily-complex `reconcile-session-metadata.sh`** (flock RMW + the documented codex-preserve "erasure bug" guard) into "simpler" code — its complexity is inherent to correct metadata reconciliation. The refactor extracts the shared lib + retires dead weight; it preserves the defensive logic.

---

## Findings 3.2 — agent-teams.md currency + structural (3 sources merged)

Merges the leader's structural review (S1-S5) + the `claude-code-guide` currency report + Codex's AT-* (which independently fetched the docs — **triple-confirmed** where all three agree). Change-set D. Currency version numbers should be re-verified against live docs at implementation (all three sources caveat this); the DIRECTION is high-confidence.

| ID | Finding (agent-teams.md) | Sources | Fix |
|---|---|---|---|
| CUR-1 | **min version `v2.1.32` stale** (current ~v2.1.199; docs baseline v2.1.178) — misses ~6 versions | currency + AT-HIGH-1 | version matrix (v2.1.178/179/186/198/199) + "re-check the experimental docs before editing" |
| CUR-2 | **lifecycle wrong: `TeamCreate`/`TeamDelete` REMOVED (v2.1.178); setup/cleanup is AUTOMATIC** — contradicts the doc's "manager creates the team → cleans up the team" (`:113-114,123`) | currency + AT-HIGH-2 | rewrite: team forms on first-teammate-spawn; Claude Code owns cleanup at session exit; Gobbi triggers formation + requests graceful shutdown only |
| CUR-3 | **`Shift+Down` (`:141`) is WRONG** — Up/Down select, **Enter** opens the teammate's transcript, Escape interrupts, `x` stops, **Ctrl+T** toggles the task list | leader S2 (flagged) + currency + AT-MED-1 | replace the keybindings |
| CUR-4 | **teammateMode: default is now `in-process` not `auto` (v2.1.179); 4 modes not 3** (added `iterm2`, v2.1.186) | currency + AT-MED-1 | update the display-mode table |
| CUR-5 | **the direct 3.2 ask (show teammates in UI) is thin + split** — answerable now: an **agent panel** below the prompt shows teammate rows (name+status); idle-row collapse (>3 → one row, v2.1.199); split-pane = one pane per teammate | leader S2 + currency MISSING-1 | add a consolidated "Teammate UI + helpers" section (panel, keybindings, Ctrl+T, command locality: plain-text/skills→viewed teammate, `/model`/`/fast`→lead, `/effort`→viewed teammate; effort inheritance) |
| CUR-6 | **SendMessage interface + trust model undocumented** — message types (`message`/`broadcast`/`shutdown_request`/`plan_approval_response`); available even under a tight `tools` allowlist; **trust: the receiver is told the message is from "another Claude session", NOT the user; teammates can't approve permission prompts for each other** | currency MISSING-2 + AT-MED-2/3 | add the SendMessage + trust subsection |
| CUR-7 | **native-capability vs Gobbi-policy table** (native any-to-any messaging / shared task list / direct operator→teammate / lead auto-approves plans → Gobbi: manager-mediated / manager-owned / steering-only / Always-Ask still routes) | AT-MED-3 (leader S3 partial) | add the table |
| CUR-8 (gobbi-critical) | **an in-process teammate CANNOT spawn background subagents** | currency MISSING-4 | add to limitations |
| CUR-9 (confirmed-current) | the subagent-def-as-teammate `skills`/`mcpServers`-not-auto-loaded caveat is ALREADY in the doc (`:95-99`) — correct; ADD that `SendMessage`+task tools stay available under a restrictive `tools` allowlist | AT-MED-2 | small addition |
| CUR-10 | teammate death is a rule, not a **recovery checklist** (leader S3/G2) | AT-MED-5 + leader | add a liveness/replacement checklist (hidden-idle vs dead; re-prime from `working/`+`outputs/`+`state.json`; record `continuationOf`) |
| S4/S5 (leader) | hooks table (`:131-139`) points nowhere; **dead link `:187` → `mistakes/skills-mirror-symlinks-not-copies.md` (absent)** | leader | add a pointer; fold the dead link into the cross-point cleanup |

---

## Findings 3.3 — Completeness (ADVERSARIAL) — change-set E

Codex was **more thorough** on completeness (it found the structural gaps the leader flagged only as verify-against-child-docs). Taken with anchors verified.

| ID | Gap | Evidence (verified) | Sev |
|---|---|---|---|
| **C-HIGH-1** | **No `workflow/configuration.md`** — the 8 other loops each have a workflow child doc; Configuration (fresh/resume/`/compact`/`/clear`/worktree/mode — the highest-risk paths) has none | `ls workflow/*.md` → 8 docs, no configuration.md (confirmed absent) | High |
| **C-HIGH-2** | **Codex-runtime doc↔mistake CONTRADICTION (the #1 locked fix)** — `codex/SKILL.md:152-153` + `production.md:30` mandate foreground-blocking `timeout ≥ 1200s`, but `mistakes/codex/codex-exec-timeout-exceeds-bash-cap.md` says the Claude Code Bash ~10-min cap KILLS the foreground run → long runs MUST background. `codex/SKILL.md:181` itself already acknowledges backgrounding (internal inconsistency). **Verified in full** — the mistake even anticipated this review | codex/SKILL.md:152-153,181; production.md:30; the mistake file (whole) | High |
| **C-HIGH-3** | **assistant-wrapper guidance internally inconsistent** — `codex/SKILL.md:297` says the wrapper resolves the tradeoff; `codex/mistakes.md` says a wrapper failed to persist files and the fix was manager-run-direct-foreground + validate; no doc states which supersedes | codex/SKILL.md:297,327-384; codex/mistakes.md:59-67,92-99 | High |
| C-HIGH-4 | **proposer source-read-only not mechanically enforced** — proposer runs `workspace-write`; prompt-only "don't touch source" is insufficient; no post-proposer `git diff` gate in production.md | codex/SKILL.md:157-179; the 2 proposer mistakes; production.md:116-124 | High |
| C-MED-1 | producer DONE-handshake before freeze/spawn not explicit (idle ≠ DONE) | production.md:36-44 + the handshake mistake | Med |
| C-MED-2 | evaluator degraded-mode scenario coverage thin (timeout/7-of-8/no-VERDICT/retry/both-fail/cost-cap/independence-leak) | evaluation.md:180-219 | Med |
| C-MED-3 | no-gh/PR-deferred needs a Wrap-up/Git finalization checklist | wrap-up.md:43-48 | Med |
| C-MED-4 | concurrent-session + orphan-cleanup scenario suite missing (leader G1) | git mistakes; record.md:216-221 | Med |
| C-MED-5 | RECORD value-telemetry needs degraded-production cases (single vs degraded-dual; per-task degraded roll-up) | record.md:69-91; production.md:88-99; execution.md:83-85 | Med |

**The Codex runtime matrix (adopted — locked decision 1):**

| Runtime / workload | Launch mode | Completion signal |
|---|---|---|
| Native Codex shell, under host cap | foreground `timeout <cap>` | process exit + file validation |
| Claude Code Bash, under ~10 min | foreground, timeout BELOW the host cap | file validation before reporting |
| Claude Code Bash, may exceed host cap | background, explicit PID, `< /dev/null` | poll output file for closing marker; ignore detached exit code |
| Assistant wrapper | ONLY if it blocks/polls until contracted output files pass validation | files-as-truth, never "started" |

Invariant (state first in codex/SKILL.md): **the entity that reports DONE must have read + validated the contracted output files in the same turn.** Add: a missing proposer is not a safety gate, but an UNVALIDATED proposer completion IS a process failure.

Leader's proposed checklists (C4/C5/G1/G2 from iter1) map onto Codex's change-set E scenario families — take the union.

---

## Cross-system reconciliation (dual-system record)

Full per-delta log: `working/reconciliation-iter1.md`. The dual-system + 3-way process paid off — each party caught what the others missed:

**Codex found (leader missed / under-framed) → took-codex, anchors verified:**
- **C-HIGH-1 (no `workflow/configuration.md`)** — leader only flagged G3 "config-time failure, verify-against-child-docs"; Codex found the bigger structural gap.
- **C-HIGH-2 (the timeout doc↔mistake contradiction)** — the #1 finding; leader's iter1 C4 flagged "codex-exec preflight" but not the concrete doc contradiction. Verified in full (my first grep used wrong patterns; the file confirms it).
- **S-HIGH-3 (agent-token null-total)** — a real jq bug distinct from the leader's.
- The full completeness scenario families (C-MED-1..5) + the runtime matrix + the architecture (lib/common.sh + manifest + fixtures + smoke) + AT-* currency (independently fetched docs → corroborates the currency report).

**Leader found (Codex missed) → kept-own:**
- **agent-token bug #2** (`main_filter` built-but-never-injected) — DISTINCT from Codex's null-total; BOTH in the doc.
- **C-BUG-1** (`canon()` fail-OPEN) — the specific silent-false-pass mechanism; Codex's S-HIGH-1/2 touch the general fail-closed/realpath class but not this.
- The **refactor-not-rewrite guardrail** (don't flatten `reconcile`'s flock+codex-preserve guard) — a load-bearing constraint on change-set A.
- The **cross-point dead-xref consolidation** (S5 + B12 + Points 1/2 dangling xrefs → ONE follow-up).

**Divergence resolved (leader CONCEDES):** the leader's "clean" verdict on `check-markdown-links.sh` + `validate-integration-log.sh` was INCOMPLETE — Codex's S-MED-2 (`\b` non-portable) + S-MED-3 (symlink-blind find + limited parser) are correct, verified against the files. Kept the surviving nuance (their algorithms are sound + bash-3.2-safe) but corrected "no findings."

**Currency triple-confirmed:** leader S1-S5 (structural) + the claude-code-guide report + Codex AT-* agree on the stale items (Shift+Down, teammateMode default, v2.1.32, TeamCreate/Delete-removed).

**No major divergence requiring user adjudication** beyond the two forks the user already locked (runtime matrix; full refactor).

---

## Implementation plan (Codex's prioritized change-sets A-E)

Priority order (user-locked): **C → A → B → D → E.**

- **Change-set C (PRIORITY 1) — Codex runtime contract.** Reconcile `codex/SKILL.md` + `production.md` + `evaluation.md` to the runtime matrix; mark the foreground-`timeout 1200` guidance superseded; state the files-as-truth DONE invariant; add the proposer source-read-only post-`git diff` gate (C-HIGH-4). Verify: `grep 'timeout 1200'` — every use has host-cap context; `grep` wrapper-recommendations — each states the same-turn file-validation invariant.
- **Change-set A (PRIORITY 2) — shell foundation.** `scripts/lib/common.sh` (strict-mode, `require_cmd`, `require_bash_4`, shared path-resolution + `slugify`/`trim`/`die`/`usage`/accumulator/tempdir-trap); source it in all 11; **FIX C-BUG-1 (canon fail-closed)**, S-HIGH-3 (`add // 0`), agent-token bug #2 (inject the filter), S-HIGH-1 (fail-closed with the accumulator nuance), S-HIGH-2/M4 (bash-4 guard). **Preserve** the self-tests + column discipline + reconcile's flock guard.
- **Change-set B (PRIORITY 3) — record-map manifest.** `record-map.manifest.json` (loop dirs, staging vocab, working dirs, task regex, pass-only rule); scaffold + verify + record-map.md all consume it (fixes S-HIGH-4); externalize/retire check-residual-vocab's baseline (S-HIGH-5).
- **Change-set D (PRIORITY 4) — Agent Teams refresh.** CUR-1..10 + S4/S5; native-vs-policy table; liveness/replacement + token checklists. Verify: `grep v2.1.32|TeamCreate|TeamDelete|Shift+Down|"auto" (default)` → removed/contextualized.
- **Change-set E (PRIORITY 5) — scenario suite.** Add `workflow/configuration.md` (C-HIGH-1) + scenario families across evaluation/production/record/wrap-up (C-MED-1..5 + leader C4/C5/G1/G2): fresh/resume/compact/clear, concurrent sessions, no-gh/PR-deferred, worktree orphan/bulk cleanup, teammate death, Codex proposer degraded, evaluator failure/fallback, wrapper hang/timeout, cross-tree source-write, producer DONE-handshake + freeze.

**Coordination:** these are largely NEW files + doc edits, low collision with Points 1/2 (which touch chat-mode.md + workflow/*.md caps/compaction). Change-set E's edits to workflow/{evaluation,record,production}.md should sequence AFTER Point 2's compaction of those same docs (or fold in) — flag for planning.

---

## Verification plan

- **Scripts smoke suite** (change-set A): each script `--help` + self-test/check mode + a planted missing-dependency test; `check-merge --self-test`; `verify-record-map --check` with planted doc-drift + scaffold-drift; empty/no-usage/all-sidechain transcript fixtures for agent-token; malformed-integration-log + broken-link fixtures.
- **C-BUG-1:** run check-merge in a PATH without GNU `realpath` → must exit 2 (fail-closed), not "REF-INTEGRITY OK".
- **Runtime matrix (C):** `grep 'timeout 1200'` across codex/SKILL.md + production.md → every use host-cap-qualified; the superseded foreground guidance is marked.
- **Currency (D):** the grep list above; confirm `.claude/settings.json` still ships `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` + `teammateMode`; re-verify version numbers against live docs.
- **Completeness (E):** `workflow/configuration.md` exists with the fresh/resume/compact/clear + worktree + mode scenarios; each new scenario states manager action + output files + session.json fields + RECORD routing.

## Out-of-scope / cross-point follow-ups

1. **Dead mistake-xref cleanup (cross-point):** fold S5/CUR (agent-teams.md:187) + B12 (Point 2's `manager-skipped-dual-system-eval.md` + `skills-mirror-symlinks-not-copies.md`) + Points 1/2 dangling xrefs into ONE combined "create-or-repoint dead mistake references" follow-up.
2. **Change-set E ↔ Point 2 sequencing** on workflow/{evaluation,record,production}.md (compaction vs scenario-add).

## Open items for the implementer

- **C-HIGH-2/3 runtime matrix** is the #1 correctness item — land change-set C first; a manager following the current foreground-`timeout 1200` guidance in Claude Code hits the known-bad invocation and silently loses dual-system.
- **C-BUG-1 fail-closed** — a verification gate that fail-opens on a missing tool is worse than a loud failure.
- **Refactor-not-rewrite** — change-set A must preserve the self-tests, escaped-pipe column discipline, and reconcile's flock+codex-preserve guard.
- **Currency numbers** re-verify against live Claude Code docs at implementation (experimental feature, all 3 sources caveat this).
- **check-residual-vocab retire-vs-externalize (S-HIGH-5)** — confirm the memorization→memory (D18) + `_shared` (#310/#312) migrations are complete before retiring.
