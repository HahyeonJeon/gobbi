# Wrap-up Evaluation — Consistency (Claude, iter1)

## Artifact Summary + Memory reads
(See project.md.) Consistency lens: does the wrap-up tell one coherent story matching the session's artifacts, and does promoted memory sync with existing memory without silent contradiction?

## Locked Frame (Stage 1)
- **S1 Shipped-claims match artifacts 1:1.**
- **S2 Every staging artifact promoted or explicitly accounted for.**
- **S3 Supersession integrity:** any open/resolved or contradicting pair resolves explicitly + bidirectionally.
- **S4 Cross-references inside handoff/journal resolve.**
- **S5 Mistakes match user corrections; recurring → mistakes.**
- **S6 (adversarial) Cherry-picked drop of an inconvenient staging artifact.**
- **S7 Frontmatter-strip:** promoted files carry no staging-only fields.

## Per-scenario per-check results
- **S1 PASS** — handoff Shipped table's 4 commits all resolve and match commit subjects; journal's "What shipped" lists the same 4 with consistent task mapping (T1/T2-4/T5-6/T7-8). No drift between handoff and journal.
- **S2 PASS** — manifest 25 entries = filesystem 25 staging files, 1:1. staging-inventory.md independently enumerates all 25 with disposition. No silent drops.
- **S3 PASS** — This was the deepest check. Three Ideation "open/proposed" decisions (`...root-path-unnamed`, `...resync-trigger-unnamed`, `...permissions-auto-grant-assumption`, all `status: active` / `decision_status: proposed`) were promoted alongside their Preparation "ratified" resolutions. The manifest deliberately did NOT flip `status: superseded`. Verified this is SOUND, not silent supersession: (a) each RESOLVED file carries a `related:` back-pointer to its open counterpart; (b) each OPEN file carries FORWARD pointers in both its `description` frontmatter ("resolved in Preparation") and body ("OPEN at Ideation close — RESOLVED in Preparation. See `decisions/...resolved.md`"). A zero-context reader landing on either file is told which is authoritative. This is the problem→resolution pattern (an answered open question), not two contradictory authoritative versions. No supersession-integrity gap.
- **S4 PASS** — handoff pointers + journal "Session journal: notes/..." resolve; the cross-doc `related:` pointer in File 17 was rewritten from staging path to project-memory path so it resolves post-promotion.
- **S5 PASS** — the one mistake-candidate (`subagent-wrote-session-memory-to-main-tree-not-worktree`) was DROPPED-as-duplicate; read its body — it is a cwd-reset / worktree-write-path trap whose "How to recognize"/"Corrected approach" overlap directly with the 5 cited existing mistakes (esp. `subagent-relative-write-paths-stray-cd-doesnt-persist.md`). The drop is correct (recurring trap already lessoned), documented, and the candidate even self-notes "Relates to the cwd-reset / wrong-branch mistake family already in project memory." No un-recorded correction; no fabricated mistake.
- **S6 PASS** — no cherry-pick; the only non-promote is the documented duplicate DROP.
- **S7 PASS** — mechanical leak gate (rules.md §4.5 regex, both spellings) run on all 24 promoted files: zero leaks. Spot-checked File 17 (`mistake-candidate: false` stripped, `decision_status`/`supersedes`/`superseded_by`/`related` kept) and File 8 (`loop: ideation` stripped, `outcome` kept). Strips match the manifest's per-file claims exactly.

## Typed findings
None at Critical/High/Medium. Supersession handled via cross-reference rather than status-flip — a defensible interpretation, documented in the manifest.

### F-C1 — Resolved decisions use `related:` linkage instead of `supersedes:`/`superseded_by:`
- **Type:** general · **Domain:** docs-sync · **Disposition:** disputed · **Confidence:** 75 · **Severity:** Low
- **Evidence:** prep `bounded-package-root-and-marketplace-source-resolved.md` carries `supersedes: null` + `related: [...root-path-unnamed.md]` rather than `supersedes: ...root-path-unnamed.md`.
- **Why it matters:** A future maintainer scanning only `supersedes`/`superseded_by` for lineage would not see the open→resolved relationship; they'd find it via `related` + the body forward-pointer instead. Because the open file is a problem-statement (not a wrong claim being corrected), `supersedes` semantics arguably don't apply — `related` is the more accurate field. Disputed: the manifest's rationale is reasonable and the bidirectional links prevent any authority ambiguity.
- **Suggested direction:** Accept as-is. If the user prefers strict supersession bookkeeping for open→resolved decision pairs, that is a convention decision for a separate pass, not a wrap-up defect.

## Low-confidence appendix
(none)

## Verdict: PASS
