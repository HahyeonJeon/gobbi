# Preparation Evaluation — RISK perspective (Claude, iter1)

## Artifact Summary + Memory reads
Same as project.md. Risk lens = what breaks if Preparation is wrong: Wrap-up sole-writer contract, staging path correctness, RE-IDEATE triggers missed, deferred items lost, slug collisions. Plus the task's adversarial focus: does Option C actually hold together, and is the re-sync trigger concrete?

## Locked Frame (Stage 1)
- Scenario: No Preparation write went to project memory (sole-writer contract).
- Scenario: Every RE-IDEATE trigger caught or ruled out.
- Scenario: Deferred items not silently lost.
- Scenario: Staged slugs do not collide with existing project skills.
- Task-adversarial: Option C coherence + fire-once + double-fire caveat adequately specified; re-sync trigger concrete.

## Per-scenario per-check results
- **Sole-writer contract:** PASS. All outputs are under `sessions/.../preparation/staging/` and `rawdata/`. Verified `find` shows no Preparation write to `.gobbi/projects/gobbi/skills/`, `features/`, `mistakes/`, or `rules/`. The report explicitly states "No project memory is written here" (line 6).
- **RE-IDEATE triggers:** PASS. "zero re-ideate triggers" (line 18); "Re-ideate escalations: none" (line 170). Sub-step A confirms the Ideation output is contradiction-free. Each of the 5 items is a missing-direction (resolvable), not an unworkable premise.
- **Deferred items not lost:** PASS. Each "Out of scope gaps" entry has a destination; backlogs verified present under `ideation/staging/backlogs/feature/`.
- **Slug collisions:** PASS / N/A. No skills staged this loop; 18-skill packaging is a materialization into `plugins/gobbi/`, not a `.gobbi/.../skills/` write.

### Task-adversarial assessment
**Does Option C hold together?** YES — and I verified the load-bearing safety claim directly.
- The 3 Planning obligations (coherence, fire-exactly-once, double-fire caveat) are named in both the report (line 94) and the staged decision (lines 33-37).
- Coherence is folded into the SAME re-materialize trigger as the skills/agents drift gate (staged decision line 35) — strong design move.
- **Double-fire safety claim VERIFIED:** the report asserts the double-fire is "bounded by flock + upsert-by-id ... NOT data corruption." I checked the actual script: `post-tool-use-agents.sh` line 220 implements `flock -x 9` on `$session_json.lock` (D-3-5, serialized read-modify-write + atomic mv), and the header (lines 3-7, D-3-2) confirms upsert-by-id keyed on `tool_use_id`. So the guard claim is TRUE — Option C's accepted double-fire genuinely degrades to latency/log-noise, not corruption. The user's ratification rests on a real guarantee.
- Fire-exactly-once keying on `hook_event_name` correctly handles the single-script/two-events case — verified (settings.json: one script `post-tool-use-agents.sh` backs both PostToolUse + PostToolUseFailure, matcher `Task|Agent`).

**Is the re-sync trigger concrete?** YES. Names the exact source paths (`.gobbi/projects/gobbi/skills/`, `agents/*.md`, `.claude/hooks/*.sh`) → re-materialize `plugins/gobbi/{skills,agents,hooks}/` same commit. Mechanically checkable. Gate direction-pinned, mechanism deferred — appropriate.

## Typed findings

### R-1 — Load-bearing double-fire safety claim ships UNCITED; the guard is real (verified) but the report did not substantiate it
- **Type:** assumption_risk · **Domain:** process · **Disposition:** open · **Confidence:** 75 · **Severity:** Low
- **Evidence:** Item 3 (line 94) + staged decision (line 37) assert double-fire is "bounded by `flock` + upsert-by-id to latency/log-noise, NOT data corruption" — with NO citation to the script lines that implement those guards. I verified independently: `post-tool-use-agents.sh:220` (`flock -x 9`) and header D-3-2/D-3-5 confirm the guards EXIST. So the claim is true — but the report stated a safety-critical property without evidence, against Iron Law 7 (no completion/safety claims without fresh verification evidence) and the project's own evidence-citation discipline (every claim traces to a sha/file:line).
- **Why it matters:** The user ratified Option C accepting the double-fire BECAUSE it was claimed bounded. Had the guards been absent, the user would have ratified a corruption risk on an unverified premise. The claim happens to be correct, so the residual risk is low — but the verification GAP is a process defect that the report's otherwise-rigorous evidence trail (every prior-art claim cites a sha) makes conspicuous by omission.
- **Suggested direction:** Planning should cite `post-tool-use-agents.sh:220` (flock) + D-3-2 (upsert-by-id) in the DD-8 obligations so the double-fire-acceptability premise is auditable, not asserted.

## Must-preserve
- Sole-writer contract cleanly honored — preserve.
- Folding hooks.json↔settings.json coherence into the SAME drift gate as skills/agents — elegant risk reduction; preserve.
- Concrete path-named re-sync trigger pre-empts the recurring mirror-repair failure (PR #260→#261, #258) — preserve.
- The double-fire degradation guarantee is real (flock + upsert-by-id) — Option C is safe to lock.

## Verdict: PASS
R-1 downgraded to Low after direct verification confirmed the flock + upsert-by-id guards exist in the live script. The safety premise is sound; only its citation was missing. No Critical/High risk findings; Option C holds together and the re-sync trigger is concrete.

## Low-confidence appendix
- None. R-1 was resolved from 50→75 confidence by reading `post-tool-use-agents.sh` directly; severity dropped Medium→Low because the verified guards make the residual risk negligible.
