# Web Localization Evaluation Checklist

This reusable unchecked source evaluates one browser or Electron-renderer surface's language and region
handling against the message-integrity, catalog-sourcing, plural-selection, format, locale-negotiation,
propagation, and direction obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-localization`](SKILL.md) preferences, with [`html-semantics`](../../html/html-semantics/SKILL.md) owning
the `lang` and `dir` attributes, [`css-conventions`](../../css/css-conventions/SKILL.md) owning logical
properties and the flow they drive, [`web-frontend`](../web-frontend/SKILL.md) owning the ordered browser
operation that applies these choices, [`web-interface`](../web-interface/SKILL.md) owning the identity and
expression judgment behind the words, and [`web-backend`](../web-backend/SKILL.md) owning locale-dependent
authoritative data. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `WEBLOC`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBLOC-SC-PROJECT-01 — Normal case: the language-and-region judgment stays inside its boundary

A surface needs its language and region decisions taken, and several neighbouring owners hold the mechanisms
those decisions drive. The expected outcome decides which language and direction the mechanisms carry, routes
each mechanism outward, and reaches every change site; a localization decision that also settles an attribute,
a layout property, or an authoritative data question is the failure.

#### Checklist

- [ ] WEBLOC-CK-PROJECT-01-01 — Every question outside the language-and-region judgment is routed to its named owner: the `lang` and `dir` attributes and where each is expressed to `html-semantics`, logical properties and the flow they drive to `css-conventions`, the ordered browser operation to `web-frontend`, identity and wording judgment to `web-interface`, and locale-dependent authoritative data to `web-backend`.
- [ ] WEBLOC-CK-PROJECT-01-02 — The localization decisions are taken while the surface still ships in one language rather than after a second locale is required.
- [ ] WEBLOC-CK-PROJECT-01-03 — Every component that renders text, a number, a date, or a direction-dependent layout is identified as a change site the decisions reach.

### WEBLOC-SC-PROJECT-02 — Rule violation: a user-visible string exists outside the catalog

A string reaches a person from source code, from a template with no identifier, or through an accessible name
that no catalog knows about. The expected outcome sources every user-visible string from the catalog under a
stable identifier; a string a translator can never see is the failure.

#### Checklist

- [ ] WEBLOC-CK-PROJECT-02-01 — Every user-visible string comes from a catalog under a stable identifier.
- [ ] WEBLOC-CK-PROJECT-02-02 — No user-visible string is built in code or embedded in a template without an identifier.
- [ ] WEBLOC-CK-PROJECT-02-03 — A string supplied only to assistive technology is in the catalog on the same terms as visible text.

## Structure

### WEBLOC-SC-STRUCTURE-01 — Normal case: a message is one entry covering a whole sentence

A sentence carries a number, a name, or inline markup, and each piece has a natural place in English. The
expected outcome gives the translator the whole sentence with its placeholders inside it, so word order and
agreement can change; a sentence assembled at runtime from separately translated pieces is the failure.

#### Checklist

- [ ] WEBLOC-CK-STRUCTURE-01-01 — Each user-visible sentence is one catalog entry covering its placeholders, plural selection, and inline markup.
- [ ] WEBLOC-CK-STRUCTURE-01-02 — No user-visible sentence is built by concatenating translated fragments.
- [ ] WEBLOC-CK-STRUCTURE-01-03 — Every placeholder sits inside its message rather than around it, so a translator can reorder it within the sentence.

### WEBLOC-SC-STRUCTURE-02 — Edge case: an enumerable set departs from one entry per sentence

A set of status labels, unit names, or menu items is rendered independently and never appears inside another
sentence, so each becomes its own entry. The expected outcome records that the set is genuinely enumerable; a
sentence fragment justified as an enumerable label is the failure.

#### Checklist

- [ ] WEBLOC-CK-STRUCTURE-02-01 — The departure from one entry per sentence covers a genuinely enumerable set rendered independently.
- [ ] WEBLOC-CK-STRUCTURE-02-02 — No entry in that set is ever part of another sentence.

### WEBLOC-SC-STRUCTURE-03 — Rule violation: plural selection is a two-way branch

A count decides which message a person reads, and the code compares it to one. The expected outcome selects
the form through the locale's plural categories, which a locale may draw from `zero`, `one`, `two`, `few`,
`many`, and `other`; a singular-or-plural branch is the failure.

#### Checklist

- [ ] WEBLOC-CK-STRUCTURE-03-01 — No code selects between a singular string and a plural string.
- [ ] WEBLOC-CK-STRUCTURE-03-02 — Every count-dependent form is selected through the locale's plural categories rather than a comparison against a fixed number.

## Performance

### WEBLOC-SC-PERFORMANCE-01 — Normal case: only the catalogs the surface renders are loaded

Catalogs grow with the product while a visitor reads one language, so shipping every locale costs bytes no one
uses. The expected outcome ships one locale's messages per request or session and widens only where a surface
genuinely renders several at once; every catalog shipped by default is the failure.

#### Checklist

- [ ] WEBLOC-CK-PERFORMANCE-01-01 — One locale's messages are shipped per request or per session.
- [ ] WEBLOC-CK-PERFORMANCE-01-02 — A surface that must render several locales at once loads only the small set that surface needs.

## Aesthetics

### WEBLOC-SC-AESTHETICS-01 — Poor quality: the catalog is complete but unusable by a translator

Every string is extracted and every identifier resolves, yet a translator cannot tell which sense of a word an
entry means or whether an identifier will survive the next edit. The expected outcome carries the context the
choice needs and keeps identifiers stable; a mechanically correct catalog that produces guessed translations
is the failure.

#### Checklist

- [ ] WEBLOC-CK-AESTHETICS-01-01 — Every catalog entry carries the context a translator needs to choose a meaning.
- [ ] WEBLOC-CK-AESTHETICS-01-02 — Every catalog identifier stays stable across a change to the message text it holds.

## Usage

### WEBLOC-SC-USAGE-01 — Normal case: the served locale is negotiated rather than guessed

A visitor arrives and some language must be chosen for them. The expected outcome negotiates against the
declared supported list, honouring an explicit choice first and the stated request preference second; a
language deduced from where the visitor appears to be is the failure.

#### Checklist

- [ ] WEBLOC-CK-USAGE-01-01 — The active locale is negotiated against a declared, ordered list of supported locales with one defined fallback.
- [ ] WEBLOC-CK-USAGE-01-02 — An explicit user choice resolves first.
- [ ] WEBLOC-CK-USAGE-01-03 — The request's stated language preference resolves second.
- [ ] WEBLOC-CK-USAGE-01-04 — No language is inferred from a country, an IP address, or a time zone.

### WEBLOC-SC-USAGE-02 — Normal case: a formatted value carries its own rules alongside the locale

A price, a timestamp, a percentage, or a list is rendered for a person. The expected outcome formats it
through the `Intl` APIs and supplies the inputs the language tag cannot carry; a value formatted by hand, or
one left to whatever currency or time zone the runtime defaults to, is the failure.

#### Checklist

- [ ] WEBLOC-CK-USAGE-02-01 — Every date, time, number, percentage, currency, and list is formatted through the `Intl` APIs rather than by hand.
- [ ] WEBLOC-CK-USAGE-02-02 — The currency and the time zone are passed explicitly rather than left to a default.
- [ ] WEBLOC-CK-USAGE-02-03 — No currency's fraction digits are set by hand rather than taken from the currency itself.

### WEBLOC-SC-USAGE-03 — Normal case: text a person reads is ordered and split by locale rules

A list is sorted and a string is counted or truncated. The expected outcome uses the locale-aware comparison
and segmentation, because code-unit order is not alphabetical order and a code unit is not a character; a
default sort or a split on spaces is the failure.

#### Checklist

- [ ] WEBLOC-CK-USAGE-03-01 — Every list a person reads is ordered through `Intl.Collator` rather than the default sort comparison.
- [ ] WEBLOC-CK-USAGE-03-02 — Every departure from `Intl.Collator` names an ordering that is not read by a person.
- [ ] WEBLOC-CK-USAGE-03-03 — Counting or truncating by grapheme, word, or sentence uses `Intl.Segmenter` rather than code units or spaces.
- [ ] WEBLOC-CK-USAGE-03-04 — Every departure from `Intl.Segmenter` names a supported-browser range reaching before its April 2024 baseline.
- [ ] WEBLOC-CK-USAGE-03-05 — Every departure from `Intl.Segmenter` uses a maintained polyfill.

## Consistency

### WEBLOC-SC-CONSISTENCY-01 — Normal case: the negotiated language and direction reach the content

A locale is resolved, and one page holds content in more than one language or direction. The expected outcome
propagates the resolved values to the document and to any element whose content differs from it, leaving the
attributes and the flow to their owners; a resolved locale that never reaches the markup is the failure.

#### Checklist

- [ ] WEBLOC-CK-CONSISTENCY-01-01 — The resolved language and direction reach the document.
- [ ] WEBLOC-CK-CONSISTENCY-01-02 — Every element whose content differs from the document's language or direction carries its own resolved values.
- [ ] WEBLOC-CK-CONSISTENCY-01-03 — No attribute expression or layout flow mechanic is decided here rather than by `html-semantics` and `css-conventions`.

### WEBLOC-SC-CONSISTENCY-02 — Normal case: one message format the current tooling accepts

A catalog is created and two message formats are available, one supported by today's runtimes and one still
proposed. The expected outcome uses the format the tooling accepts and treats the newer one as a migration
target; an early adoption with no stated reason is the failure.

#### Checklist

- [ ] WEBLOC-CK-CONSISTENCY-02-01 — A new catalog uses ICU MessageFormat 1.
- [ ] WEBLOC-CK-CONSISTENCY-02-02 — Any early adoption of MessageFormat 2 goes through a library.
- [ ] WEBLOC-CK-CONSISTENCY-02-03 — Any early adoption of MessageFormat 2 records its migration reason.

## Risk

### WEBLOC-SC-RISK-01 — Rule violation: a physical direction, width, or asset is hard-coded

A layout pins a side, a container fixes a text width, or a direction-dependent icon ships unmirrored. The
expected outcome leaves room for translated text to grow and decides mirroring per asset; a surface that only
holds together in the source language is the failure.

#### Checklist

- [ ] WEBLOC-CK-RISK-01-01 — No physical direction, fixed text width, or unmirrored direction-dependent asset is hard-coded into a localized surface.
- [ ] WEBLOC-CK-RISK-01-02 — Every direction-dependent asset records the per-asset decision of whether it mirrors.
- [ ] WEBLOC-CK-RISK-01-03 — Translated text has room to grow beyond its source-language length.

### WEBLOC-SC-RISK-02 — Expected failure: the requested locale is not supported

A visitor asks for a language the product does not ship. The expected outcome serves the one defined fallback
from the declared list; falling through to whatever the runtime happens to be set to, or guessing a nearby
language, is the failure.

#### Checklist

- [ ] WEBLOC-CK-RISK-02-01 — A requested locale outside the declared supported list resolves to the one defined fallback.
- [ ] WEBLOC-CK-RISK-02-02 — The fallback is the declared one rather than the runtime's ambient default.
- Also applies: WEBLOC-CK-USAGE-01-04 (no language inferred from country, IP address, or time zone).

### WEBLOC-SC-RISK-03 — Adversarial: the localized surface is only ever exercised in the source language

Every check passes because every check ran in English, so concatenation, hard-coded text, overflow, and
mirroring defects stay invisible until a translator or a right-to-left reader meets them. The expected outcome
exercises the surface against a pseudolocale and a right-to-left locale continuously; a localization claim
resting on the source locale alone is the failure.

#### Checklist

- [ ] WEBLOC-CK-RISK-03-01 — The interface is run against a generated pseudolocale from the first sprint that has a catalog.
- [ ] WEBLOC-CK-RISK-03-02 — At least one right-to-left locale is in the routine check set from the point localization starts.
- [ ] WEBLOC-CK-RISK-03-03 — Any departure from continuous right-to-left testing names a declared supported-locale list containing no right-to-left language.
- [ ] WEBLOC-CK-RISK-03-04 — Any departure from continuous right-to-left testing records that it reopens when a right-to-left language is added.

## Overall

### WEBLOC-SC-OVERALL-01 — Normal case: language and region settled as one contract

A complete localization outcome answers where a string comes from, how a sentence survives a different
grammar, which locale a visitor is served, what a format needs beyond the language tag, and what changes when
the writing direction reverses. The scenario fails when one of those is unanswered, or when the result claims
more locales than it exercised.

#### Checklist

- [ ] WEBLOC-CK-OVERALL-01-01 — The supported-locale list, fallback, catalog, message format, plural handling, format inputs, propagation targets, and direction handling are decided together.
- [ ] WEBLOC-CK-OVERALL-01-02 — No localization claim extends beyond the locales the surface was actually exercised in.
- Also applies: WEBLOC-CK-RISK-03-02 (one right-to-left locale kept in the routine check set).
