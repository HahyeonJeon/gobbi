# Consistency — T0 iter2 (claude)

**Focus:** set-S consistency, disposition invariant, label wording across docs.

## Verification
- §4.4 table adds `addressed-by | addressed_by` (line 214); §4.5 gate regex adds `addressed[-_]by` (line 240). Both spellings covered, consistent with the existing both-spelling convention for every other S key.
- `disposition` still OMITTED from the gate regex (confirmed: no disposition token in the find/grep line). 41 backlog files carry `disposition:` and are untouched — the conditional-disposition safety invariant (§4.4 prose) preserved.
- mistakes-row wording now consistent with templates/mistakes.md.

## Findings
None blocking. The iter1 CN-1 (`disposition: addressed` data drift) is pre-existing data, out of T0 scope, and §4's conditional logic handles it correctly — unchanged by this delta, not a regression.

VERDICT: PASS
