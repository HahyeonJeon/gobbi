# Ideation iter1 — Risk perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Risk-specific reads: `.gobbi/projects/gobbi/mistakes/{executor-rationalized-failing-verification-gate, session-dir-naming-convention-uses-date-prefix, manager-mispec-grep-c-for-occurrence-count}.md`, `.claude/skills/git/SKILL.md` (Forbidden Operations gate per Q-G).

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` § Risk. Updates:

- **scenario_gap S-RSK-NEW-1** (adversarial): "Project mistake files (`.gobbi/projects/gobbi/mistakes/{...}.md`) reference `session_id: c676684d-...` in frontmatter; that session dir is being deleted. Verify the mistakes survive (they're in `mistakes/`, which is in the survivor set? NO — Q-A places `mistakes/` in the PLACEHOLDER list)."
- **scenario_gap S-RSK-NEW-2** (adversarial): "Per `executor-rationalized-failing-verification-gate.md`, Plan-defined verification gates that fail must not be rationalized. The artifact's D2 has 15 gates — any ambiguity in gate semantics (per F-S-01/F-U-01) invites the rationalization anti-pattern."

Cross-cutting:
- Privacy: `not-applicable` (no PII surface).
- License/IP: covered — LICENSE retained per Q7; deleting `packages/` doesn't affect license compliance.
- Cost: covered in Performance.

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Rollback path identified | Pre-reset tag covers it | YES | Q-F tag at `487fc35` + `git checkout pre-reset-2026-05-21` recovery |
| Blast radius bounded | Files/consumers enumerated | PARTIAL — see F-R-01 |
| Security surface delta | None or described | YES — explicit "no new untrusted input path" |
| Irreversible steps gated | Each flagged | YES — Q-F provides reversibility via tag |
| 2-week smell test | Maintenance debt named | YES (D8 captures CLI regenerator follow-up) |
| Scope-drift check | Design touches only Scope Contract files | YES — Out-of-Scope is explicit |
| Concurrency surface | Shared mutable state | YES — bare-UUID sequencing addresses CLI race |
| **S-RSK-NEW-1 mistakes survival** | All 3 project mistakes survive the sweep | **NO** — see F-R-02 |
| **S-RSK-NEW-2 verification gate honesty** | No D2 gate is ambiguous enough to invite rationalization | **NO** — see F-R-03 |

## Typed findings

### F-R-01 — Blast radius enumeration omits the `.codex/` symlink-target dependency

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Verified `git ls-files .codex/` returns 7 entries; `.codex/{agents,hooks,project,rules,skills}` are tracked **symlinks** pointing into `.claude/{agents,hooks,project,rules,skills}`. Artifact's Q-D deletes `.claude/project/gobbi/`. The `.codex/project` symlink target (`.claude/project/`) survives (parent dir intact, only `gobbi/` subdir deleted). After `git rm -r .codex/`, the symlinks vanish anyway — so no broken-symlink residue. **However**, the artifact doesn't note that `.codex/` is a symlink farm into `.claude/` — its blast-radius enumeration implies a normal tracked tree.
- **Why it matters**: Minor — outcome is unchanged. But Risk perspective requires *understanding* the surface being touched.
- **Suggested direction**: add a one-line note in Item 5 (Scope Contract line 26): "`.codex/{agents,hooks,project,rules,skills}` are tracked symlinks into `.claude/`; `git rm -r .codex/` removes the symlinks (targets in `.claude/` survive)."

### F-R-02 — Mistake files cited as "load-bearing" reference a deleted session-id; provenance is broken

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: The three mistakes the artifact relies on (lines 357–358):
  - `executor-rationalized-failing-verification-gate.md` — frontmatter: `session_id: c676684d-4d54-48c0-bd61-10855c60a42a`
  - `session-dir-naming-convention-uses-date-prefix.md` — same `session_id: c676684d-...`
  - `manager-mispec-grep-c-for-occurrence-count.md` — same `session_id: c676684d-...`
  - Verified by `head -10` on each file.
  
  These three files live under `.gobbi/projects/gobbi/mistakes/` — which Q-A places in the **PLACEHOLDER** list (line 31). After the sweep, `mistakes/README.md` exists; the three files do NOT. The three mistake files are currently *untracked* per `git status --short` lines 11–13 ("`?? .gobbi/projects/gobbi/mistakes/...`") — they were promoted in the prior session but never staged. Stage C's bullet 2 says `git rm -r <subdir>/*` PLUS `rm -rf <subdir>/*` to catch untracked stragglers. **So all three mistake files will be deleted** by the sweep, despite being cited as load-bearing inputs.
- **Why it matters**: Critical to the user's intent and the rebuild project. The three mistakes encode this session's hardest-won learnings:
  - "session dir naming uses date-prefix" — affects every future session bootstrap
  - "executor rationalized failing verification gate" — Iron Law 11 anti-pattern documentation
  - "manager mispec grep -c" — Plan-spec verification discipline
  
  Per CLAUDE.md mandate "A correction not recorded is a correction repeated across sessions." Per Iron Law 10 (witness-bound work): these are the witnesses. Deleting them invalidates the audit trail for three real corrections that just happened today.
  
  The same risk applies to today's untracked files in git status: 2 untracked feature dirs (`gobbi-install/`, `orchestration-docs/`), 1 new backlog (`concurrent-init-lock.md`), 1 new note (`pr-262-entry-point-sop.md`), and the `gotchas/` dir. All evaporate. The artifact's I8 explicitly accepts this — but the Risk perspective must call it out as a Critical-scoped policy decision the user should re-confirm given that the artifact also cites these mistakes as load-bearing.
- **Suggested direction**: surface this to the user as a Q-H decision before iter2: "The three project mistakes promoted by the c676684d session and cited as load-bearing inputs to THIS session's Ideation will be deleted by Stage C's placeholder reset of `mistakes/`. Confirm options: (a) accept deletion — they served their purpose in iter1's draft; (b) move the three files into the survivor set by amending Q-A to add `mistakes/` to the KEEP CONTENT list; (c) re-promote them after the sweep from this session's Wrap-up." The current artifact silently picks (a) without flagging the contradiction.

### F-R-03 — D2 gate #11 (`grep -E ... wc -l → 0`) and gate #15 (`grep -c ... → 1`) are at risk of repeating the recently-promoted `manager-mispec-grep-c` mistake pattern

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: D2 line 307: "`git ls-remote --tags origin | grep -c 'refs/tags/pre-reset-2026-05-21$'` → 1." The `$` anchor ensures one tag = one line, so `grep -c` is correct here (verified mentally: each tag entry is its own line). D2 line 303: "`grep -E '^sessions/$|^project/note/$' .gobbi/.gitignore` → empty" — uses content match, no `-c`, ok. D2 line 309 explicitly notes "Use `grep -o … | wc -l` for occurrence counts where lines might collide (per `manager-mispec-grep-c-for-occurrence-count.md`)." So the artifact has *cited* the mistake. But two of the 15 gates use `wc -l` patterns:
  - #1 line 293: `find .claude/{skills,agents} -xtype l | wc -l → 0` (correct — one symlink per line)
  - #2 line 294: `ls .gobbi/projects/gobbi/sessions/ | wc -l → 1` (correct — one entry per line)
  - #4 line 296: `git worktree list | wc -l → 1` (correct — one worktree per line)
  
  All three are line-count semantics, not occurrence-count, so they're safe. The artifact's gate selection looks defensible. **However**, F-S-01 (Stage D↔E ambiguity) is exactly the kind of spec ambiguity that, per `executor-rationalized-failing-verification-gate.md`, the executor must NEEDS_CONTEXT rather than rationalize. The mistake's discipline applies to the Plan-spec → executor handoff that follows iter1.
- **Why it matters**: The artifact correctly cites the mistake and avoids the `grep -c` pitfall in D2 — good. But it does NOT re-apply the deeper lesson ("specify gates that the executor cannot rationalize") to its own spec ambiguity (F-S-01/F-U-01). Without remediation, iter2's Plan inherits the F-S-01 ambiguity and the executor faces exactly the choice that produced the `executor-rationalized-failing-verification-gate.md` mistake.
- **Suggested direction**: in iter2, re-state the F-S-01 / F-U-01 spec gaps with concrete gates (e.g., specific commit SHA recorded in session.json before bare-UUID delete).

### F-R-04 — `git push origin pre-reset-2026-05-21` is irreversible without admin coordination if the tag name needs to change

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Stage 0 line 206 pushes the tag to origin. Tags pushed to origin require `git push origin :refs/tags/<name>` to delete (forbidden ops per `git/SKILL.md`). User pre-authorized the tag via Q-F. Solo-user repo, no team coordination needed.
- **Why it matters**: Reversibility risk in a multi-user repo; for gobbi (solo-user per `feedback_solo_user_context.md`) this is `not-applicable`.
- **Suggested direction**: none — `not-applicable` per solo-user.

## Low-confidence appendix

(none)

## Must-preserve list

- Pre-reset tag Q-F is excellent reversibility design.
- Q-G pre-authorization of `-D` for the two non-ancestor branches removes a class of mid-execution AskUserQuestion interrupts.
- Stage F's "`git worktree remove` BEFORE `git branch -d/-D`" invariant is correct (git refuses to delete a branch with a registered worktree).

## Verdict

FAIL — F-R-02 is High/100, but consider the Critical-tier severity: the three mistakes are witnesses for Iron Law 10, deleted invalidates the audit trail. Calibrating: F-R-02 is borderline Critical (it breaks the gobbi-specific `mistake` skill's promotion → next-session-load contract). Marking **High/100 → REVISE** per the strict threshold rule. If the user re-confirms (a) "delete them, they served their purpose" then this finding becomes `disputed` in iter2 and the verdict can move to PASS. Final per-perspective verdict: **REVISE**.
