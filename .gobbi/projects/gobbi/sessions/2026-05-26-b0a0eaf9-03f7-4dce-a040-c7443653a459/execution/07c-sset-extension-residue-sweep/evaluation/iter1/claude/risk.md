# Risk Perspective — T7c (commit 5630aa4)

**Evaluator:** Claude (adversarial). Primary risk: the recurring failure mode where a residue sweep silently strips a legitimate key.

## The CRITICAL risk: legit key stripped
- **Method:** read the diff, not the report (prior T7 eval false-PASSed by trusting claims).
- `git show 5630aa4 --unified=0 -- ':!*memorization/rules.md'` → every `-` line enumerated. Result: 6 iter, 17 loop, 2 scenario, 10 slug, 4 task = 39 deletions. Filtering out the 6 S-keys leaves **ZERO** other deletions.
- Explicit check for protected keys: `grep '^-(related|supersedes|superseded_by|source|design-id|domain|priority|ref_type|base):'` over the diff → NONE deleted.
- Spot-check 3 swept docs: base 9 keys + legit extensions (design-id / verdict / discussion-id) all present post-commit.
- **No legitimate key stripped. The recurring failure mode did NOT recur.** **PASS**

## Other risks
- **Body corruption:** ZERO added lines anywhere in the 31 docs; pure frontmatter deletion. No prose drift. **PASS**
- **Symlink / main-tree edit (mistakes: edit-tool-refuses-symlink-paths, executor-main-tree-edit):** rules.md is a real file in the worktree; all edits on branch `chore/session-2026-05-25-a10c82d6`, not main. **PASS**
- **Supersede-never-delete / design-literal-retire:** No doc files deleted; only frontmatter keys removed from live docs. Archive/ excluded by the gate. No supersede-model violation. **PASS**
- **Regex over-match risk:** Extended gate uses bare words `task|loop|scenario|iter|slug` anchored `^...:`. Checked conformed docs for body-line collisions (`^task:` etc. in prose) → none. `iter:` will not match `iteration:`. Low residual risk only on out-of-scope features. **PASS**

## Findings
None at Risk severity that gate the deliverable. The one latent risk (bare-word regex could match an unrelated future frontmatter key literally named `task`/`loop`/`step`) is Low/Confidence-25 and speculative — noted, not blocking.

## Must-preserve
- The zero-legit-key-stripped property — the entire point of this task.

VERDICT: PASS
