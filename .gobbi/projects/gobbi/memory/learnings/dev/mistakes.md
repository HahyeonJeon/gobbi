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
