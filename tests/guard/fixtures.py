"""Fixture trees built in code: a minimal Gobbi checkout that every check passes, and helpers to vary it."""

import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from repo import CANONICAL, PACKAGE, Repo

from . import GUARD_DIR

GUARD = GUARD_DIR / "guard.py"
SKILLS = f"{CANONICAL}/skills"
AGENTS = f"{CANONICAL}/agents"
HAS_GIT = shutil.which("git") is not None


def make_tree(files: dict[str, str | bytes], *, git: bool = False, commit: bool = False) -> Path:
    """Write files into a new temporary directory, optionally as a git work tree. The caller removes it."""
    root = Path(tempfile.mkdtemp(prefix="guard-test-"))
    for path, content in files.items():
        target = root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            target.write_bytes(content)
        else:
            target.write_text(content, encoding="utf-8")
    if git or commit:
        _git(root, "init", "-q")
    if commit:
        _git(root, "add", "-A")
        _git(root, "-c", "user.name=guard", "-c", "user.email=guard@example.com", "commit", "-qm", "fixture")
    return root


def skill(name: str, skill_type: str = "operation", body: str | None = None) -> str:
    """A SKILL.md that passes every check for its type."""
    title = name.replace("-", " ").title()
    frontmatter = (
        f'---\nname: {name}\ndescription: "{title} does one thing. Use it when testing."\n'
        f"allowed-tools: Read, Bash(git:*)\nskill-type: {skill_type}\n---\n"
    )
    if body is None:
        body = PROCEDURE if skill_type == "operation" else ""
        if skill_type != "domain":
            body += REFERENCES
    return f"{frontmatter}\n# {title}\n\n{title} is a fixture.\n\n{body}"


PROCEDURE = (
    "## Procedure\n\n"
    "### Phase 1 — Start\n\nBegin the work. Done when it has begun.\n\n"
    "#### 1.1 First step\n\n- one\n- two\n- three\n\n"
    "#### 1.2 Second step\n\n- one\n\n"
    "### Phase 2 — Finish\n\nEnd the work. Done when it has ended.\n\n"
    "#### 2.1 Last step\n\n- one\n\n"
)
REFERENCES = (
    "## References\n\n| Name | Description |\n|---|---|\n| [Guide](../alpha/SKILL.md#alpha) | The guide. |\n"
)
ROLE_BODY = "# Leader\n\nYou lead.\n"
# The principles source is copied into root files, so its one link is absolute.
PRINCIPLES_SOURCE = skill(
    "principles",
    "preference",
    "## References\n\n| Name | Description |\n|---|---|\n| [Spec](https://example.com) | Spec. |\n",
)
BLOCK = "<!-- BEGIN GENERATED PRINCIPLES: .gobbi/projects/gobbi/skills/principles/SKILL.md -->"
BLOCK_END = "<!-- END GENERATED PRINCIPLES -->"
MAPPING = (("skills", "skills"), ("agents/claude", "agents"), ("agents/codex", "runtimes/codex"),
           ("agents/cursor", "runtimes/cursor"), ("agents/grok", "runtimes/grok"))  # fmt: skip


def generated_file(source: str = PRINCIPLES_SOURCE) -> str:
    body = source.split("---\n", 2)[2]
    return "## Principles\n" + BLOCK + "\n\n" + body + BLOCK_END + "\n"


def gobbi_files(version: str = "1.0.0") -> dict[str, str | bytes]:
    """A minimal Gobbi checkout: canonical skills and roles, their package projection, manifests, and blocks."""
    canonical: dict[str, str] = {
        f"{SKILLS}/alpha/SKILL.md": skill("alpha"),
        f"{SKILLS}/beta/SKILL.md": skill("beta", "domain"),
        f"{SKILLS}/principles/SKILL.md": PRINCIPLES_SOURCE,
        f"{AGENTS}/README.md": "# Roles\n",
        f"{AGENTS}/claude/leader.md": f"---\nname: leader\nmodel: a\n---\n\n{ROLE_BODY}",
        f"{AGENTS}/cursor/leader.md": f"---\nname: leader\nmodel: b\n---\n\n{ROLE_BODY}",
        f"{AGENTS}/grok/leader.md": f"---\nname: leader\nmodel: c\n---\n\n{ROLE_BODY}",
        f"{AGENTS}/codex/leader.toml": f"name = \"leader\"\ndeveloper_instructions = '''\n{ROLE_BODY}'''\n",
    }
    files: dict[str, str | bytes] = dict(canonical)
    for path, content in canonical.items():
        relative = path.removeprefix(f"{CANONICAL}/")
        for source, target in MAPPING:
            if relative.startswith(source + "/"):
                files[f"{PACKAGE}/{target}/{relative.removeprefix(source + '/')}"] = content
    plugin = json.dumps({"name": "gobbi", "version": version}) + "\n"
    for runtime in ("claude", "codex", "cursor", "grok"):
        files[f"{PACKAGE}/.{runtime}-plugin/plugin.json"] = plugin
    files[".claude-plugin/marketplace.json"] = (
        json.dumps({"plugins": [{"name": "gobbi", "version": version}]}) + "\n"
    )
    files["README.md"] = (
        f'# Gobbi\n\n<img src="https://img.shields.io/badge/version-{version}-blue" alt="Version {version}">\n\n'
        f"See [the skills](.gobbi/projects/gobbi/skills/alpha/SKILL.md).\n"
    )
    for target in (".claude/CLAUDE.md", ".codex/AGENTS.md", "AGENTS.md"):
        files[target] = generated_file()
    return files


class GuardCase(unittest.TestCase):
    """A test case that builds fixture trees and removes them afterwards."""

    def tree(self, files: dict[str, str | bytes], *, git: bool = True, commit: bool = False) -> Path:
        root = make_tree(files, git=git, commit=commit)
        self.addCleanup(shutil.rmtree, root, ignore_errors=True)
        return root

    def gobbi(self, changes: dict[str, str | bytes | None] | None = None) -> Path:
        """A Gobbi fixture tree with files replaced, added, or (with None) removed."""
        files = gobbi_files()
        for path, content in (changes or {}).items():
            if content is None:
                files.pop(path)
            else:
                files[path] = content
        return self.tree(files)

    def messages(self, run, root: Path) -> list[str]:
        """`path message` for each finding a check function yields on a fresh Repo."""
        return [f"{finding.path} {finding.message}" for finding in run(Repo(root))]


def _git(root: Path, *args: str) -> None:
    subprocess.run(["git", "-C", str(root), *args], check=True, capture_output=True)
