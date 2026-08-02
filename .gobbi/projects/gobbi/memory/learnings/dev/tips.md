# Dev Tips

## Prove a generated identifier by running the tool that consumes it

**Context:** Downstream work depends on an identifier a tool generates from content — such as a heading's
anchor slug a link checker will validate later.

**Tip:** Deriving the identifier by hand from the generator's known rule (an awk script's slugify logic, for
example) and being confident in the derivation is weaker than building a small fixture with the real content
and running the actual tool against it. A hand-derivation can be right about the rule and still wrong about an
edge case the rule doesn't obviously cover.

**Application:** When a downstream step depends on a generated identifier, prove the identifier at the point
it is created by running the real consuming tool, not by reasoning about the generation rule alone.
