# Dev Tips

## Follow-surface skill paths are directory or file symlinks, not hardlinks

**Context:** Editing a skill through `.grok/skills/<name>`, `.agents/skills/<name>`,
`.cursor/skills/<name>`, or `.claude/skills/<name>`.

**Tip:** `.grok/skills/<name>`, `.agents/skills/<name>`, and `.cursor/skills/<name>`
are directory symlinks (git mode `120000`) to the canonical skill directory. A Write
through those paths edits the canonical file (same inode). `.claude/skills/<name>/`
is a real directory; `SKILL.md` is a file symlink. A Write that replaces that file
forks a regular copy and leaves the canonical file unchanged. These are not
hardlinks: canonical `delegation/SKILL.md` has `nlink` 1.

**Application:** Edit the canonical path, or confirm the follow path is a directory
symlink before writing. Do not assume a Claude follow-surface Write updates the
canonical skill.

## Prove a generated identifier by running the tool that consumes it

**Context:** Downstream work depends on an identifier a tool generates from content — such as a heading's
anchor slug a link checker will validate later.

**Tip:** Deriving the identifier by hand from the generator's known rule (an awk script's slugify logic, for
example) and being confident in the derivation is weaker than building a small fixture with the real content
and running the actual tool against it. A hand-derivation can be right about the rule and still wrong about an
edge case the rule doesn't obviously cover.

**Application:** When a downstream step depends on a generated identifier, prove the identifier at the point
it is created by running the real consuming tool, not by reasoning about the generation rule alone.
