---
type: mistakes
skill: skill-writing
description: "Recorded traps for skill-writing — load before doing skill-writing work"
updated: 2026-06-27
---

# Skill-Writing — Mistakes

> Load before any skill-writing work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Planning Asserted Skill Without Verifying

`priority: high` · `domain: process` · `added: 2026-06-13` · `status: active` · `tags: [process, planning, verification]`

**What happened** — During an iter2 REVISE, the planning leader performed a "full re-audit" of required skills to fix a finding (a task missing a required skill). The audit added `claude` to several tasks on the assumption that a `claude` authoring-standard skill existed. In fact the `skills/claude` skill does not exist — it is a known dangling reference. The leader asserted the skill assignment without running `test -e` / `test -f` on each referenced path. The finding was dual-corroborated: the Codex evaluator independently ran `test -e` on three candidate paths and confirmed all absent.
**Why it happens** — The planning leader treated the required-skills audit as a cross-reference exercise (does the skill conceptually fit the task?) rather than a verification exercise (does the skill file exist at the declared path?). The sibling verify-before-assert mistake was even a required-mistake input to this very planning loop — yet the same class of error recurred during the fix for a different cluster. The irony: the mistake was loaded and still repeated. Loading the mistake doc is insufficient; the verification discipline must be explicitly invoked at the point of making an existence claim.
**How to detect** — A planning artifact lists a required skill that is referenced by name but not verified to exist on disk; the planning loop's required-mistakes include the verify-before-assert trap but the leader did not run `test -f` on skill paths during the required-skills section; the Execution manager attempts to inject a Load Directives block with a path that resolves to nothing.
**Correct approach** — Before finalizing any required-skill list in a planning draft, run `test -f <skill-path>` (or `test -e`) on each skill path from the worktree root. For Claude Code the skill path is `$SK/{skill-name}/SKILL.md`; for Codex it is `$WT/.agents/skills/{skill-name}/SKILL.md`. A required skill that fails the existence test must be removed or substituted with one that exists. "Full re-audit" without file-existence verification is not a re-audit.

## Claude Skills Mirror Is Symlink Not Copy

`priority: high` · `domain: docs-sync` · `added: 2026-06-25` · `status: active` · `tags: [docs-sync, links]`

**What happened** — Three Ideation design iterations plus the first Planning draft all modeled `.claude/skills/{skill}` as a byte-identical COPY of the canonical `.gobbi/projects/gobbi/skills/{skill}` — prescribing "edit BOTH trees; verify `diff -q` parity" on every skill change. The model was wrong, and the dual-system EVALUATION caught it before it shipped.
**Why it happens** — Tool-verified, the `.claude/skills/*` entries are git SYMLINKS, not copies: `git ls-files -s` reports mode `120000` (symlink), not `100644`; `readlink` resolves to the same inode as the canonical file. Editing the canonical file updates the mirror path automatically. The byte-copy assumption produces three concrete defects: (1) "edit both" is redundant — a second find-replace on the mirror fails (the change is already there); (2) a `diff -q canonical mirror` guard is VACUOUS — same inode can never differ — false assurance; (3) a full-file `Write` to a mirror path converts the symlink to a regular file (mode `120000` → `100644`), BREAKING the mirror and causing the exact drift the model tried to prevent.
**How to detect** — Any plan or design that says "edit both the canonical and the `.claude` mirror" or "verify byte-identical parity between trees" is built on the wrong model. Before assuming copies, check `git ls-files -s <mirror-path>` for mode `120000`.
**Correct approach** — Edit the CANONICAL `.gobbi/projects/gobbi/skills/...` path ONLY — the mirror symlink reflects it for free. Use `Edit` (in-place), never `Write` (full-replace), and never target the mirror symlink path. Verification is: the canonical edit landed AND the mirror symlink is still intact (`git ls-files -s` still mode `120000`) — NOT a content `diff`.

### Related
- [`../claude-plugin/SKILL.md`](../claude-plugin/SKILL.md) — the `.claude` mirror wiring this trap spans (claude-plugin owns the plugin/symlink layout)

## Scrub Stack Idioms When Adapting To General Doc

`priority: high` · `domain: docs-sync` · `added: 2026-06-24` · `status: active` · `tags: [docs-sync, verification]`

**What happened** — Authoring a language-agnostic `coding` skill child-doc by mirroring gobbi's own `execution` skill child-doc (used as the shape reference) dragged in two kinds of contamination from the source: (1) a JS/TS test idiom — `test.skip` — leaked into a skill whose entire reason to exist is language-neutrality; (2) a present-tense runtime claim — "Loaded alongside execution evaluation" — that asserts a load-both wiring deferred per the scope contract. Both share one root: copying a project-internal doc for its shape inherits its stack-specific tokens and its as-wired-today claims.
**Why it happens** — The executor used the internal doc as a shape template and carried prose across without scrubbing it against the new doc's different contract (language-agnostic; wiring-deferred). A shape reference is for STRUCTURE, not for verbatim phrasing.
**How to detect** — You are authoring a general, reusable, or cross-project doc by mirroring a project-internal one. The source legitimately names a specific language, tool, or framework, or describes the system as it is wired today. Any of those tokens copied across is a leak.
**Correct approach** — When a shape reference is a project-internal doc and the target is general: take the STRUCTURE only, and scrub every carried sentence for (a) language, tool, or framework-specific idioms such as `test.skip`, naming conventions, or named libraries — restate as the language-agnostic property; (b) present-tense wiring or role claims the target's scope defers — restate as intent ("intended to complement…", "wiring deferred"). Grep the finished general doc for the source's stack tokens before declaring done.
**User feedback** — The dual-system evaluators surfaced the contamination. The manager recognized the root as shape-reference overreach — the executor used an internal doc for structure AND for phrasing.
