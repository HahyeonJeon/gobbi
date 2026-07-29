# Document structure

## Use this child when

The work changes a full document shell, metadata, syntax, parsing-sensitive
markup, fragments, templates, or transformed HTML. Apply parent rules
[`HTML-2`](SKILL.md#html-2--preserve-language-meaning-and-the-accessibility-floor),
[`HTML-3`](SKILL.md#html-3--respect-trust-transform-and-runtime-boundaries),
and
[`HTML-4`](SKILL.md#html-4--verify-the-artifact-the-user-agent-consumes).

## Detail

Start full HTML documents with the intended HTML syntax and a standards-mode
doctype. Provide one document element, head, body, useful title, declared
encoding early enough for reliable detection, and correct document `lang` and
`dir`. Add viewport or application metadata only when the product contract
needs it. Treat `base` as a document-wide URL semantic change, not a shortcut.

Design regions and heading relationships from the content. A `section` needs a
real thematic grouping; `div` remains appropriate when no element has the
intended meaning. Do not infer a reliable user-facing outline from sectioning
elements alone.

Respect content models, required ancestors, transparent models, and prohibited
nested interaction. Browser recovery can reparent, insert, or discard nodes.
Therefore compare source intent with the parsed DOM for tables, forms,
formatting elements, templates, and other recovery-sensitive structures.

For fragments, record the insertion context: identical bytes can parse
differently under different context elements. For shadow or template content,
distinguish inert template contents, instantiated trees, and the final
accessibility exposure.

Generated documents use the parent four-link chain. A directly authored
document records “no transform.” Repair the authoring source or generator, not
the emitted file.

## Evidence

- exact authored source or source identity;
- transform identity or explicit “no transform”;
- emitted digest when transformed;
- conformance result with tool/version/configuration;
- parsed tree for recovery-sensitive regions; and
- document title, encoding, language/direction, landmarks, and heading review.

See scenarios
[`H-S03`](scenarios.md#h-s03--generated-invalid-table-recovery) and
[`H-S08`](scenarios.md#h-s08--direct-source-document) and checks
[`H-C07`](checklists.md#h-c07--source-and-transform-identity) and
[`H-C08`](checklists.md#h-c08--parsed-structure).
