# T9b — Conform project-tier docs — execution plan (draft-iter1)

## S-set keys to strip (confirmed in S-set)
- `task` (present as `task: null` in 9 backlog files)
- `slug` (in normalize-path-conventions-h3.md)
- `loop` (in normalize-path-conventions-h3.md)
- `promoted-from` (in normalize-path-conventions-h3.md)
- `promoted-at` (in normalize-path-conventions-h3.md)

## KEEP keys (not in S-set — must NOT strip)
- `anchor_session` — not in S-set enum → KEEP (when in doubt, KEEP)
- `title` — in KEEP list explicitly
- `project` — in KEEP list explicitly
- `disposition` — on backlogs/ → KEEP
- `domain`, `priority`, `project-scope`, `shipped_in` — in KEEP list
- `pr`, `commit`, `stamp-commit`, `loops_completed`, `shipped`, `features_touched` — not in S-set → KEEP

## Files needing changes

### Group A: 9 backlog files with `task: null` to strip
Strip `task: null` from each. Add missing base keys: `name`, `description`, `type`, `scope`, `session`.
Some also missing `tags` (ci-symlink-integrity-check.md, hooks-domain-mistakes-watchlist.md).

Files:
1. backlogs/ci-symlink-integrity-check.md — strip task, add name/description/type/scope/session/tags
2. backlogs/hooks-domain-mistakes-watchlist.md — strip task, add name/description/type/scope/session/tags
3. backlogs/two-surface-collapsing-strategy.md — strip task, add name/description/type/scope/session
4. backlogs/broader-delegation-contract-verifier.md — strip task, add name/description/type/scope/session
5. backlogs/symlink-into-worktree-alternative.md — strip task, add name/description/type/scope/session
6. backlogs/skill-loading-discipline.md — strip task, add name/description/type/scope/session
7. backlogs/auto-mode-silence-vs-always-ask.md — strip task, add name/description/type/scope/session
8. backlogs/codex-ci-integration-for-dual-system-eval.md — strip task, add name/description/type/scope/session
9. backlogs/chat-mode-tiki-taka-redesign.md — strip task, add name/description/type/scope/session

### Group B: normalize-path-conventions-h3.md
Strip: slug, loop, promoted-from, promoted-at
Fix: type: general → type: backlogs
Add: name, description, tags
Keep: disposition, domain, priority, session (already has session), feature, scope

### Group C: 5 README.md placeholders (all-missing frontmatter)
All are bare text "Placeholder..." — add full base frontmatter.
- backlogs/README.md
- decisions/README.md
- design/README.md
- learnings/README.md
- notes/README.md

### Group D: 5 notes files with missing keys
4 older notes files missing name/description/type/scope/created/tags
- 2026-05-22-env-var-audit-sessionstart-hook.md — add name/description/scope/status/created/tags
- 2026-05-22-pre-rebuild-sweep.md — add name/description/type/scope/created
- 2026-05-23-orch-workflow-improvements.md — add name/description/scope/status/created/tags
- 2026-05-24-session-foundations-bundle-b.md — add name/description/type/scope/created
- 2026-05-25-session-foundations-bundle-c-complete.md — add name/description/type/scope/created

## Title check
No cryptic-led titles found — the headline `# Item 1-2 ...` etc are H1 titles, not H2/H3 cryptic coords.
The body H1 titles for backlogs/broader-delegation-contract-verifier.md etc: "Item 1-2 broader re-framing..." and "Item 1-3 alternative..." are conceptual (describing the concept, not a pure session coord).
The task spec says strip title from § frontmatter for de-crypt (§4.1 concept-first titles) but these body H1s already describe the concept. No de-crypt needed for bodies.

## Verification plan
After changes:
1. §4.5 gate = 0 files
2. All 35 docs have 9 base keys
3. disposition preserved on all 13 backlogs (where present)
4. No cryptic H1/H2/H3 titles
5. KEEP keys count = 65 (same as before)
6. git diff only touches 5 project-tier dirs top-level
