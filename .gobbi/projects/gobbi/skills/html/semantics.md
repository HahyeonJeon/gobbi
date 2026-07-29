# Semantics

## Use this child when

The work changes content models, headings, landmarks, prose, lists, figures,
tables, language/direction, native semantics, or ARIA. Apply parent rule
[`HTML-2`](SKILL.md#html-2--preserve-language-meaning-and-the-accessibility-floor).

## Detail

Choose elements from the meaning of the content, not from default appearance.
Keep heading levels and region names understandable without CSS. Use lists for
collections, figures for self-contained referenced content, and tables for
tabular relationships. Provide table headers and associations that match the
actual data structure; do not use tables for layout.

Set document language and mark meaningful language changes. Set direction from
content requirements, use `dir="auto"` for suitable user-generated isolates,
and use `bdi`/`bdo` only for their defined bidi purposes. Validate locale
expansion, RTL, vertical writing modes, zoom, reflow, and text growth with the
project’s CSS/runtime evidence; HTML owns correct semantics, not visual layout.

Prefer the native element with the required role, name, state, and behavior.
Use ARIA only where
[ARIA in HTML](https://www.w3.org/TR/html-aria/) permits it. Do not add a
redundant or conflicting role, hide focusable content, or expose a promised
state without synchronizing it. A generic element plus `role` does not acquire
keyboard or activation behavior.

Accessible names must be purposeful and non-duplicative. Landmarks need names
when multiple instances would otherwise be ambiguous. Visible text is usually
the most robust name source. Preserve relationships when content is reordered
or generated.

## Evidence

- semantic/content-model review against the current HTML standard;
- heading, landmark, list, figure, and table relationship inspection;
- computed accessible name, role, state, and description where material;
- `lang`/`dir` and mixed-language/bidi cases; and
- keyboard and assistive-technology evidence for custom semantics.

See scenario [`H-S02`](scenarios.md#h-s02--role-only-custom-button) and checks
[`H-C04`](checklists.md#h-c04--native-semantics-and-accessible-relationships)
and [`H-C05`](checklists.md#h-c05--language-direction-and-resilience).
