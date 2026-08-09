# Design Tips

## Keep lifecycle guidance with a focused owner

**Context:** A language-skill family appears to lack lifecycle coverage.

**Tip:** Add a focused lifecycle owner only when the concern has its own load trigger and outcome. Otherwise,
improve the current owner. Do not turn non-universal security, observability, concurrency, operations,
deployment, or native delivery into baseline Python policy.

**Application:** Map the concern to existing owner boundaries first. Ask for an explicit scope decision when it
needs independent authority, evidence, or recovery behavior.
