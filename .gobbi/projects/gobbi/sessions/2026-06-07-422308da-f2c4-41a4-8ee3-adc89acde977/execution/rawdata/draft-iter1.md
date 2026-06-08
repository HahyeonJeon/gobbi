---
type: rawdata
artifact_type: change-summary
loop: execution
iter: 1
session: 422308da-f2c4-41a4-8ee3-adc89acde977
project: gobbi
feature: workflow
status: draft
created_at: 2026-06-08
---

# Execution work-log — Harden Auto-mode evaluation discipline (docs-only, T1–T4)

STATUS: DONE
Branch: claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977
Base: c8a8654. Three commits added (one per in-scope file). T4 verification-only (no commit).

## Commits

| Task | File | SHA | Subject |
|---|---|---|---|
| T1 | `workflow/evaluation.md` | 5e8e39d | docs(orchestration): mode-split evaluation.md routine-triage escalations + label safety gates |
| T2 | `auto-mode.md` | 594b654 | docs(orchestration): add auto-mode.md §7 Evaluation discipline + cross-links |
| T3 | `.claude/CLAUDE.md` | 9524ce9 | docs(principles): reconcile CLAUDE.md Evaluation blockquote to mode-split |

Each commit carries `AI-Provenance-Record: gobbi://session/422308da-f2c4-41a4-8ee3-adc89acde977/task/<id>`. No `Co-Authored-By`. No push, no PR (manager owns those). All git ops run via `git -C <worktree-abs>` per executor-cwd-reset mistake.

## T1 — evaluation.md (canonical `.gobbi/...` path; mirror symlink reflects automatically)

- (a) Sharpened the manager's-job line (line 5) to "**The manager MUST NOT evaluate. It spawns exactly two evaluator subagents (one per system)…**", reinforcing § Spawning the Evaluators ("spawns exactly two evaluator agents in parallel") and citing `mistakes/manager-skipped-dual-system-eval.md`.
- (b) § Degraded-mode policy: added a clarifier — "claude-only" reachable ONLY post-failure, never a pre-evaluation option, never an Auto evaluate-mode choice; the gates here are safety gates interrupting in BOTH modes.
- (c) Mode-split the three ROUTINE-TRIAGE sections, each Chat-branch + Auto-branch (record tag/finding, surface at Wrap-up, no mid-loop interrupt, cite `auto-mode.md §6/§7.3`): § Regression marking (~245), § Stuck detection (~252), § Iteration Caps (~264). Existing behavior preserved as the Chat branch. Stuck + Regression Chat branches note chat-mode.md is silent (cite evaluation.md's own behavior, C1 split-anchor); Iteration Caps Chat branch cites chat-mode.md's "Budget exhausted → escalate to user".
- (d) SAFETY-GATE carve-out: labeled all six sites "interrupts in BOTH modes (NOT mode-split)" with NO behavior edit — same-symptom-different-root-cause (111), Major divergence (note after table @123), any-FAIL (note after table @141), degraded one-fails (200), both-fail (202), cost-budget (203).
- (e) Added the routine-vs-safety framing sentence at the head of § Cross-System Reconciliation, naming both lists (3 routine + 6 safety).
- (f) Reciprocal Cross-references row → "`auto-mode.md` § Evaluation discipline (§7)" by stable section name.
- (g/h) No section header renamed; nothing deleted (header diff HEAD~3..HEAD shows zero header add/remove for this file).

## T2 — auto-mode.md (canonical `.gobbi/...` path)

- Appended `## §7 — Evaluation discipline (Auto Mode)` AFTER §6, IMMEDIATELY BEFORE `## Cross-references`. No renumber of §1–§6.
- §7.1 mandatory/never-a-question (links evaluation.md § Degraded-mode policy; "claude-only" post-failure-only).
- §7.2 manager MUST NOT evaluate; spawns exactly 2; cites `evaluation/SKILL.md` + CLAUDE.md "Evaluation is a mandatory sub-phase" block (NO principle number); cites `mistakes/manager-skipped-dual-system-eval.md`.
- §7.3 auto-iterate on REVISE; no routine triage mid-loop (Iteration Caps + Stuck detection + Regression marking); safety-gate carve-out naming the safety sites; cites §1, §3, §6; CLAUDE.md reference is GENERIC ("Auto-mode counterpart to the Chat-scoped finding-discussion rule in `.claude/CLAUDE.md`").
- §7.4 scannable "manager never" table incl. "silences a dual-system safety gate" NEVER-row.
- Forward pointers: §2 preamble one-liner → §7; §4 `evaluate.mode` row Notes cell → §7; §6 one-line pointer → §7.3.
- Cross-references rows: CLAUDE.md Evaluation block + evaluation.md § Degraded-mode policy + § Iteration Caps + § Stuck detection + § Regression marking.
- Header diff: only §7 + 4 sub-headers ADDED; nothing removed.

## T3 — .claude/CLAUDE.md (real file, edited directly)

- Reconciled ONLY the line-27 Evaluation blockquote to mode-split: Chat = discuss findings with user before improving (user decides address/defer/disagree); Auto = auto-iterate on REVISE up to maxIterations, user reviews full finding set at Wrap-up, only Always-Ask findings + named dual-system safety gates interrupt mid-loop; ends "See `orchestration/auto-mode.md` and `orchestration/chat-mode.md`".
- "never auto-apply" safeguard PRESERVED (inlined as "never auto-applies a finding the user must decide on").
- Line 31 (#295 continued-teammate sentence) UNCHANGED. Diff touches only the Evaluation paragraph.

## T4 — cross-file consistency check (verification pass, no commit)

- (a) PASS — all 5 evaluation.md section names cited in auto-mode.md §7 resolve to real headers (grep: all OK).
- (b) PASS — reciprocal link both directions: auto-mode §7 → evaluation.md sections (a); evaluation.md Cross-references row (line 314) → "`auto-mode.md` § Evaluation discipline (§7)" resolves to the §7 header (auto-mode.md line 275).
- (c) PASS — mutual auto-mode↔CLAUDE.md both directions: auto-mode §7 generic CLAUDE.md references (lines 295/326/362); CLAUDE.md line-27 → `orchestration/auto-mode.md` + `orchestration/chat-mode.md` (both exist).
- (d) PASS — SKILL.md §3/§6 pointer (line 266) still references `auto-mode.md §3` + `auto-mode.md §6` BY NAME; both resolve (no renumber). SKILL.md unedited (git status clean for it).
- (e) PASS — classification EXHAUSTIVE. Grep sweep (AskUserQuestion / escalate to / surface to user / flag for user) returns 11 lines covering 9 escalation sites + 2 already-classified prose references. 3 routine (245 Regression, 252 Stuck, 264 Iteration Caps) mode-split; 6 safety (111 same-symptom-diff-root-cause, 121/123 Major, 139/141 any-FAIL, 200 one-fails, 202 both-fail, 203 cost-budget) labeled. Line 127 is descriptive prose about already-classified major-divergence (not a separate site). No unclassified survivor.
- (f) PASS — chat-mode.md unedited (git status clean); silent on stuck detection/regression marking (grep returns nothing). T1's Stuck + Regression Chat branches cite evaluation.md's own behavior; only Iteration Caps Chat branch cites chat-mode.md.
- (g) PASS — CLAUDE.md line 31 intact ("Continue vs Fresh" present); only line-27 paragraph changed.
- (h) PASS — `git diff --name-only HEAD~3..HEAD` = exactly the 3 in-scope files.
- (i) PASS — no section deleted; section order preserved (header diff: evaluation.md + CLAUDE.md zero header change; auto-mode.md only adds §7).

## Anchor-slug note (verified)

The §7 internal links use the DOUBLE-hyphen em-dash anchor convention established in the repo: `### Step 1 — Workflow Configuration` → `#step-1--workflow-configuration` (SKILL.md line 161; pre-existing in auto-mode.md). So `#7--evaluation-discipline-auto-mode`, `#1--mode-posture`, `#3--always-ask-codification` are correct. evaluation.md targets have no em-dash → single-hyphen slugs, all matching actual headers.

## Out-of-scope observations

None. No adjacent fixes implemented or needed.
