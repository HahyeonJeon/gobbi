# Media and embeds

## Use this child when

The work changes images, responsive sources, audio/video/tracks, canvas
fallback, iframes, or embedded documents. Apply parent rules
[`HTML-1`](SKILL.md#html-1--classify-material-features-on-two-independent-axes),
[`HTML-2`](SKILL.md#html-2--preserve-language-meaning-and-the-accessibility-floor),
and
[`HTML-3`](SKILL.md#html-3--respect-trust-transform-and-runtime-boundaries).

## Detail

Give informative images alternatives that serve the same purpose; use an empty
alternative only when the image is truly decorative in context. Complex
graphics need an adjacent or linked equivalent. Image-only links and buttons
need a name that communicates the action. Provide intrinsic dimensions when
known without preventing responsive presentation.

Choose `srcset`, `sizes`, `picture`, and source formats from art-direction,
density, and bandwidth needs. Test the selection algorithm in target viewports;
do not turn every image into responsive markup or lazy-load likely
above-the-fold content by habit.

For audio/video, provide controls appropriate to the outcome, captions and
other tracks where required, transcript or equivalent content where needed,
and a fallback path. Avoid autoplay assumptions; user preference and browser
policy can block it.

Name iframes, minimize permissions, and define fallback and failure behavior.
The security/runtime owner decides remote-content trust, sandbox tokens,
Permissions Policy, referrer policy, navigation, and Electron privilege.
HTML owns accurate markup and observable embed behavior, not the trust
decision.

## Evidence

- alternative decision per non-text item;
- source selection, dimensions, loading priority, and failure cases;
- captions/tracks/controls and target behavior;
- iframe name plus security-owner decision and tested failure boundary; and
- S/D classification for newer media or embed features.

See scenario [`H-S05`](scenarios.md#h-s05--remote-embed-boundary) and checks
[`H-C06`](checklists.md#h-c06--alternatives-interaction-and-state) and
[`H-C09`](checklists.md#h-c09--trust-and-runtime-routing).
