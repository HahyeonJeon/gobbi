<!-- Body-only fallback: render this content for a pull request; it is not repository configuration. -->
<!-- Title: use `<type>(<optional-scope>)!: <description>` from the Git skill. -->

## Summary

{State the outcome and why it matters.}

## Changes

- `{Changed area}` — {State the observable effect.}

{Repeat for each material changed area.}

## Verification

| Check | Result |
|---|---|
| `{Exact check}` | `{Result and material evidence}` |

{Repeat for each required or targeted check. When no automated check applies, state the manual or rendered
review and its result, or give the exact reason no check was run.}

## Issues

{Use `Closes #<number>` only when merge should close the issue. Use `Refs #<number>` for a non-closing
reference, or write `None`.}

## Risks

{State compatibility, migration, rollout, or recovery concerns, or `None`.}
