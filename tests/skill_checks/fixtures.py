"""Fixture projects built in code: skills that every check passes, and a case class that removes them."""

from __future__ import annotations

import shutil
import tempfile
import unittest
from collections.abc import Callable, Iterable
from pathlib import Path

from skill_checks.checks import Options
from skill_checks.finding import Finding
from skill_checks.tree import SkillTree

from . import SCRIPTS

CHECK_SKILLS = SCRIPTS / "check_skills.py"
SKILLS = "skills"  # where a fixture project keeps its skills


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


def project_files(skills: str = SKILLS) -> dict[str, str | bytes]:
    """A minimal project: one operation skill and one domain skill under `skills`, and a README."""
    return {
        f"{skills}/alpha/SKILL.md": skill("alpha"),
        f"{skills}/beta/SKILL.md": skill("beta", "domain"),
        "README.md": "# Project\n",
    }


def write_tree(files: dict[str, str | bytes]) -> Path:
    """Write files into a new temporary directory. The caller removes it."""
    root = Path(tempfile.mkdtemp(prefix="skill-checks-test-"))
    for path, content in files.items():
        target = root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            target.write_bytes(content)
        else:
            target.write_text(content, encoding="utf-8")
    return root


class SkillCase(unittest.TestCase):
    """A test case that builds fixture projects and removes them afterwards."""

    def tree(self, files: dict[str, str | bytes]) -> Path:
        root = write_tree(files)
        self.addCleanup(shutil.rmtree, root, ignore_errors=True)
        return root

    def project(self, changes: dict[str, str | bytes | None] | None = None, skills: str = SKILLS) -> Path:
        """A fixture project with files replaced, added, or (with None) removed."""
        files = project_files(skills)
        for path, content in (changes or {}).items():
            if content is None:
                files.pop(path)
            else:
                files[path] = content
        return self.tree(files)

    def messages(
        self,
        run: Callable[[SkillTree, Options], Iterable[Finding]],
        root: Path,
        options: Options | None = None,
    ) -> list[str]:
        """`path message` for each finding a check yields over the project's skills, with default options."""
        found = run(SkillTree(root, (SKILLS,)), Options() if options is None else options)
        return [f"{finding.path} {finding.message}" for finding in found]
