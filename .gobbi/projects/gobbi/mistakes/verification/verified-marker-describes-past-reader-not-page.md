---
name: verified-marker-describes-past-reader-not-page
description: A VERIFIED marker on a frozen research artifact claims something about the reader who checked it, not a property of the source page itself — the page can move on or the read can have been wrong.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification]
keywords: [verified-marker, quotation-fidelity, transcription-error, welded-quotation, elision]
author: claude
priority: high
domain: verification
related: [verify-dont-assert-taught-facts, reresolve-release-state-at-authoring-time]
---

# A VERIFIED marker is a claim about a past reader, not about the page

## What happened

A quotation-fidelity sweep across one skill's research and design artifacts found eight defects
across five distinct classes, every one behind a marker that read VERIFIED: a fabricated quote
that does not appear on the cited react.dev page at all; a transcription error inside an
otherwise-real quotation; added punctuation that changes the quoted sentence's grammar; an
unmarked mid-sentence elision that silently drops a clause; and — the most dangerous instance — a
quotation that welds two non-adjacent sentences from the same source page into what reads as one
continuous quotation. The welded quotation is the one that survives casual review indefinitely: it
cites a real page, every word in it appears somewhere on that page, and it reads grammatically —
nothing about it looks wrong until someone opens the source and checks sentence adjacency.

## Why it happens

A VERIFIED marker records that someone, at some point, checked the claim against a source and
found it accurate. It does not, and cannot, assert that the check happened correctly, that the
source has not changed since, or that the transcription performed at read time was faithful. Once
a marker exists, every later reader treats the marked claim as settled and stops re-checking it —
that is the marker's whole purpose — so a transcription slip made at the moment of marking
survives unchallenged for exactly as long as the marker itself lasts. A welded quotation is the
sharpest case: joining two true, adjacent-seeming sentences from the same page produces a string
that is locally accurate at the word level while being globally false about what the source
actually says in sequence, and nothing in the marking process checks sequence, only content.

## Correct approach

Treat a VERIFIED marker as evidence that a check happened, not as evidence that the checked
content is correct today. Before relying on a marked quotation for a new artifact, re-open the
cited source and confirm: the quoted string is a single contiguous excerpt (never two excerpts
joined without an explicit ellipsis marker), the excerpt is complete or its elision is marked, and
punctuation matches exactly. Do this per quotation, not per source page — a page can supply one
faithful quotation and one welded one, and marking the page VERIFIED does not distinguish them.
When authoring a new quotation from a source, extract it programmatically or copy it in one
selection rather than composing it from two remembered fragments of the same page.

## How to detect

Any quotation whose two halves could plausibly come from different places on the same page — a
subject clause and a consequence clause that read naturally together but were not read as
verified to be adjacent. A VERIFIED marker attached to a claim with no re-check date, on a source
that is itself fast-moving (documentation that gets revised) or long (a page with many similar
sentences an author could conflate). A sweep that checks "does this text appear on the source
page" using fuzzy or word-level matching rather than exact contiguous-substring matching will pass
a welded quotation — the detection method itself must test contiguity, not just word presence.

## Related

- [[verify-dont-assert-taught-facts]] — the general family: an observed-plausible claim is not a
  verified one; this trap is the specific case where the claim already carries a VERIFIED label
- [[reresolve-release-state-at-authoring-time]] — sibling trap from the same incident family: a
  marker (VERIFIED) or a claim (a package's release channel) can go stale between when it was
  checked and when it is used, and the marker gives no signal that this happened
