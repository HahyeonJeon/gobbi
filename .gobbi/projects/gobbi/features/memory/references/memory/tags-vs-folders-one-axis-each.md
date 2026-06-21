---
name: tags-vs-folders-one-axis-each
description: Folder the single most-stable axis, tag the cross-cutting rest — decides that gobbi's folder namespace encodes only one axis (area).
type: references
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, design]
keywords: [tags-vs-folders, single-axis, hybrid, pkm, taxonomy]
author: claude
title: Tags vs folders — one primary axis as folders, the rest as tags
source: https://www.websnips.in/blog/tagging-vs-folder-organization-notes
accessed: 2026-06-21
ref_type: blog
---

# Tags vs folders — one primary axis as folders, the rest as tags

## Insight

Folders impose ONE hierarchical axis (a note lives in one folder); tags impose MANY non-hierarchical axes. The recommended hybrid: pick the single most-stable axis as the folder hierarchy, and let tags carry the secondary, cross-cutting axes. Forcing a multi-dimensional concept into a single folder tree creates "where does this go?" friction; forcing everything into tags loses browsability.

## Reason

Decides the namespace DIMENSION. gobbi memory files already carry `tags` (controlled) + `keywords` (free) frontmatter — the tag axis exists. So the folder namespace encodes only the ONE most-stable axis (area), and the existing `tags`/`domain` frontmatter keeps carrying the cross-cutting axes — no parallel tag system invented, no multi-folder "where does it go" friction. Invoke when defending area-as-the-single-folder-axis (DP-2).

## Source

- https://www.websnips.in/blog/tagging-vs-folder-organization-notes
- https://www.dsebastien.net/2022-05-17-why-and-how-to-tag-notes-in-your-pkm/

## Excerpt

"Unlike folders, tags do not have a strict hierarchical structure, allowing for more fluid and dynamic organization, as notes can be associated with different tags based on various criteria or perspectives."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored the single-folder-axis (area) decision; tags/domain keep the cross-cutting axes |

## Related

- [[para-fluid-folder-refactor]] — the folder-model basis this axis decision builds on
- [[ddd-organize-by-area-not-by-type]] — the area-axis choice under the load-bearing type dir
