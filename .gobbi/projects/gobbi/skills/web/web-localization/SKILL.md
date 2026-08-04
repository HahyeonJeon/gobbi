---
name: web-localization
description: "MUST load when choosing or reviewing how a web or Electron surface handles language and region, covering message catalogs, plural and grammatical selection, date, number, and currency formatting, locale negotiation, and right-to-left mirroring."
allowed-tools: Read, Grep, Glob, WebFetch
skill-type: preference
---

# Web Localization

Use this preference skill when a surface's language and region need a judgment rather than a step: where a
user-visible string comes from, how a sentence survives a language whose grammar differs, which locale a
visitor is served, and what changes when the writing direction reverses. It holds for any browser surface,
including an Electron renderer.

Read this before a product ships in one language, not after it needs a second. Localization is the cheapest
of the coverage decisions to take early and the most expensive to take late, because the change site is every
component that renders text, a number, a date, or a direction-dependent layout.

[`html-css-semantics`](../../html-css/html-css-semantics/SKILL.md) owns the `lang` and `dir` attributes and where each is
expressed, and [`html-css-conventions`](../../html-css/html-css-conventions/SKILL.md) owns logical properties and the flow
they drive; this skill decides which language and direction those mechanisms carry. `web-frontend` owns the
ordered browser operation that applies these choices, `web-interface` owns the identity and expression
judgment behind the words, and `web-backend` owns locale-dependent authoritative data. Rules define the
boundary, Preferences select defaults inside it, and a Rule wins every conflict.

## Principles

### A message is a unit of meaning, not a sequence of fragments

Word order, agreement, and where a number sits in a sentence all change between languages, so a sentence
assembled from separately translated pieces is only correct in the language it was assembled for. Give the
translator the whole sentence and the placeholders inside it.

### Plurality is a locale fact, not a two-way choice

English has one plural form, which makes "singular or plural" look like a language-independent shape. It is
not: a locale may select among `zero`, `one`, `two`, `few`, `many`, and `other`, and which of those it uses is
data the runtime holds, per
[`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

### The locale is not the only input to a format

A locale decides presentation, but the value carries its own rules alongside it. A currency fixes its own
fraction digits, a timestamp needs a time zone, and a measurement needs a unit, so none of the three is
recoverable from the language tag.

### Direction is content data, not a global theme

One page can hold both directions at once, as a Hebrew article quoting an English product name does. Treat
direction as a property that travels with a piece of content rather than a switch flipped for the whole
application.

## Rules

- **NEVER build a user-visible sentence by concatenating translated fragments, and NEVER select between a
  singular and a plural string.** Select the form through the locale's plural categories and keep the
  placeholder inside the message, because a language that orders or agrees differently cannot be reassembled
  from English-shaped pieces.

- **MUST source every user-visible string from a catalog under a stable identifier, with the context a
  translator needs to choose a meaning.** A string built in code, embedded in a template without an
  identifier, or supplied only to assistive technology is untranslatable and invisible to the catalog.

- **MUST format every date, time, number, percentage, currency, and list through the `Intl` APIs rather than
  by hand, and pass the currency and time zone explicitly.**
  [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)
  requires `currency` for `style: "currency"` and takes its fraction digits from the ISO 4217 list, and
  [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)
  otherwise defaults `timeZone` to whatever the runtime happens to be set to.

- **MUST negotiate the active locale against a declared, ordered list of supported locales with one defined
  fallback.** Resolve an explicit user choice first and the request's stated language preference second, and
  NEVER infer a language from a country, an IP address, or a time zone.

- **MUST propagate the resolved language and direction to the document and to any element whose content
  differs from it.** `html-css-semantics` owns the attributes and `html-css-conventions` owns the flow they drive; this
  Rule binds only that the negotiated values actually reach them.

- **NEVER hard-code a physical direction, a fixed text width, or an unmirrored direction-dependent asset into
  a localized surface.** Leave room for translated text to grow, decide per asset whether it mirrors, and
  route the layout mechanics to `html-css-conventions`.

## Preferences

### Prefer ICU MessageFormat now and treat MessageFormat 2 as the migration target

**PREFER** ICU MessageFormat 1 for a new catalog, because it is what the established runtimes and translation
tools accept today. Unicode
[MessageFormat 2](https://blogs.igalia.com/compilers/2024/05/06/messageformat-2-0-a-new-standard-for-translatable-messages/)
reached Final Candidate in March 2025 and was refined in LDML 47 and 48, but the TC39
[`Intl.MessageFormat`](https://github.com/tc39/proposal-intl-messageformat) proposal remains at Stage 2 with
no browser implementation, so adopt it early only through a library and with a stated migration reason.

### Prefer one catalog entry per user-visible sentence

**PREFER** one entry covering a whole sentence, including its placeholders, plural selection, and any inline
markup, so a translator can reorder freely inside it. Depart for a genuinely enumerable list, such as a set of
status labels rendered independently, where no entry is ever part of another sentence.

### Prefer loading only the active locale's catalog

**PREFER** shipping one locale's messages per request or per session, because catalogs grow with the product
and a visitor reads one language. Depart for a surface that must render several locales at once, such as a
picker showing each language in its own name, and load only the small set that surface needs.

### Prefer `Intl.Collator` for any list a person reads

**PREFER**
[`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
over the default sort comparison, because code-unit order is not alphabetical order in most languages and the
correct order differs between them — German treats `ä` as a variant of `a` while Swedish treats it as a
separate letter. Depart for an ordering that is not read by a person, such as a stable key order in a cache,
where a locale-independent comparison is the point.

### Prefer `Intl.Segmenter` over splitting text yourself

**PREFER**
[`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
for counting or truncating by grapheme, word, or sentence, since splitting on code units breaks emoji and
combining marks and splitting on spaces finds no words in Japanese or Thai. It is Baseline newly available
since April 2024, so depart to a maintained polyfill when the supported-browser range reaches further back.

### Prefer pseudolocalization from the first sprint that has a catalog

**PREFER** running the interface against a generated pseudolocale that lengthens strings, marks their
boundaries, and reverses direction, because it exposes concatenation, hard-coded text, and overflow before any
translator is engaged. Depart only for a surface with no user-visible text at all.

### Prefer testing one right-to-left locale continuously

**PREFER** keeping at least one right-to-left locale in the routine check set from the point localization
starts, because mirroring defects accumulate invisibly and are cheap to fix one at a time. Depart only when
the declared supported-locale list contains no right-to-left language, and record that as a scope decision
that reopens the moment one is added.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
