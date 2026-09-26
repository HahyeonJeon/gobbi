# Dev Mistakes

## Reusing a fixture across throwaway verification cases

**Context:** Running a sequence of quick verification experiments, such as against a throwaway git
repository, to check different cases of the same behavior.

**Mistake:** An early ignore-rule experiment reported a false failure caused by leftover git index state from
the experiment run just before it. The result looked like a genuine failure until it was reproduced.

**Correction:** Give every verification case its own fresh fixture. Re-running the failed case in a clean
repository reversed the result.

## A link check proves resolution, not correctness

**Context:** Relying on an automated link checker to confirm that a document redirect or reference change is
safe.

**Mistake:** A section was removed from a document, leaving behind a pointer sentence that still linked to the
same file — which still existed, so the link resolved. The checker reported success while every reader who
followed the link landed on a file that no longer held the content it was sent to find.

**Correction:** A link checker verifies that a target exists; it cannot verify that the target still holds
what the link claims. After removing or moving content a link points at, read the destination and confirm it
still says what the link implies, not just that the checker passes.

## Fixing one copy of a duplicated invariant

**Context:** The same literal string, path, or value is duplicated across several files on purpose, so that an
identity or consistency check across them can catch drift.

**Mistake:** Fixing the duplicated value in one copy — such as a shared template — while leaving the other
copies as they were breaks the very identity the check exists to protect, even though the edited copy looks
correct in isolation.

**Correction:** Before changing one copy of a value an identity check depends on, find every other copy the
check compares it against and change them together, or leave all of them alone.

## Joining two identifiers with a delimiter that can appear in them

**Context:** Building a lock key, filename, or cache key from two independent strings.

**Mistake:** Concatenating the strings with `-`, `_`, or `/` lets distinct pairs collide. `prompt/a` and
`prompt_a` became the same key. `(a-b, c)` and `(a, b-c)` did too.

**Correction:** Hash the pair with a separator that cannot appear in the values, such as
`sha256(session + NUL + prompt)`.

## Applying one capability rule to several sources

**Context:** One consumer instruction names more than one checklist or source.

**Mistake:** Applying the instruction to every named source without checking each source's precondition made
an account requirement appear to cover a Documentation source that had no Coverage Account.

**Correction:** Check every named source independently before editing. Apply the rule only where its
precondition holds, and preserve the remaining source as an explicit backlog or limit.

## Validating a template link only from the template directory

**Context:** A template contains a relative link whose final location is chosen when a caller renders it.

**Mistake:** Checking the literal link from the template's own directory proved only that the source template
resolved. The rendered caller-bound artifact could still point to the wrong path.

**Correction:** Parameterize location-dependent links and validate each rendered artifact from its actual
location. A source-template link check is not enough.

## A word that starts with `=` fails in zsh

**Context:** Separator or marker words in shell commands that run under zsh, such as `echo =====`.

**Mistake:** zsh expands a word that starts with `=` to the path of the command named after it. `echo =====`
fails with `===== not found`, and an `&&` chain stops there.

**Correction:** Quote separator words (`echo '-- X --'`) or start them with another character.

## zsh does not word-split an unquoted variable

**Context:** List-driven commands such as `git branch -d $LIST` or `git push origin $(...)` in the Claude Code
Bash tool, whose shell is zsh.

**Mistake:** zsh passes an unquoted variable as one word. Each space-separated list reached Git as one
argument. Every branch delete failed with "branch '<a b c>' not found", and the push stopped on an unmatched
refspec before it connected. No ref changed, but the work did not happen.

**Correction:** Run list-driven Git changes under `bash <<'EOF'` with arrays (`"${A[@]}"`). Record every
branch tip SHA before deleting.

## A single-line grep does not prove a multi-word rename

**Context:** Checking that a multi-word phrase, such as "clear units", is gone after a rename in hard-wrapped
Markdown.

**Mistake:** `git grep -i 'clear unit'` passed, but a design memory file still had "clear" at the end of one
line and "units" at the start of the next. A later review found it.

**Correction:** For a multi-word phrase, also search with a whitespace-spanning pattern, such as
`grep -Pzo -i 'clear\s+units?'` or `rg -U -i 'clear\s+units?'`.
