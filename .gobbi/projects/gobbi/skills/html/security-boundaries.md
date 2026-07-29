# Security boundaries

## Use this child when

Markup contains dynamic or untrusted data, dangerous sinks, URLs, inline
script/style, remote embeds, or Electron privilege seams. Apply parent rule
[`HTML-3`](SKILL.md#html-3--respect-trust-transform-and-runtime-boundaries).

## Detail

Inventory each dynamic value, its trust, and its exact output context: text,
quoted attribute, URL, style, script, or an authored HTML fragment. These
contexts are not interchangeable. Route encoding and sanitization
implementation to the security/framework owner and require evidence for the
actual sink.

Prefer APIs and templates that keep data as data. Treat `innerHTML`,
`outerHTML`, `insertAdjacentHTML`, document writing, and equivalent framework
escape hatches as dangerous sinks. An HTML fragment needs a reviewed
sanitization policy; plain text encoding is not a fragment sanitizer.
Sanitization does not authorize unsafe URLs, navigation, or privileged APIs.

Do not place untrusted data into executable script/style contexts, event
handler attributes, or security-sensitive URLs. Do not describe CSP or Trusted
Types as a substitute for correct contextual handling; they are defense layers
owned by security.

In Electron, renderer HTML follows this language contract. Loading remote
content, navigation, window creation, preload exposure, IPC, Node access,
sandbox/context isolation, permissions, and native capability remain with the
Electron/security owner.

## Evidence

- source-to-sink inventory with trust and context;
- named security owner and contextual handling/sanitization decision;
- dangerous-sink search and justified exceptions;
- embed/navigation/runtime boundary decision; and
- emitted bytes plus parsed observation after the security transform.

See scenarios [`H-S05`](scenarios.md#h-s05--remote-embed-boundary) and
[`H-S07`](scenarios.md#h-s07--unsafe-generated-fragment-recovery), plus checks
[`H-C09`](checklists.md#h-c09--trust-and-runtime-routing) and
[`H-C07`](checklists.md#h-c07--source-and-transform-identity).
