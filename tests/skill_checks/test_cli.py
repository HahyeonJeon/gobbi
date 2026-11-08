from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

from skill_checks.checks import CHECKS

from . import SCRIPTS
from .fixtures import CHECK_SKILLS, SKILLS, SkillCase, skill

ENVELOPE_KEYS = {"tool", "command", "ok", "exit", "result", "error"}
# The guard's failure-id regex, which reads this tool's stderr the same way.
FAILURE_ID = re.compile(r"^ERROR (\S+ \S+ .*?)(?: \[L\d+\])?$", re.MULTILINE)
GOBBI_SKILLS = ".gobbi/projects/demo/skills"
HAS_GIT = shutil.which("git") is not None


def run(
    *args: str, cwd: Path | None = None, script: Path = CHECK_SKILLS, env: dict[str, str] | None = None
) -> tuple[int, dict, str]:
    command = [sys.executable, str(script), *args]
    completed = subprocess.run(command, capture_output=True, text=True, cwd=cwd, env=env)
    lines = completed.stdout.splitlines()
    assert len(lines) == 1, f"stdout is not one line: {completed.stdout!r}"
    return completed.returncode, json.loads(lines[0]), completed.stderr


class CommandLineTest(SkillCase):
    def test_default_skills_are_every_gobbi_project_skills_directory(self):
        root = self.project(
            {".gobbi/projects/other/skills/gamma/SKILL.md": skill("gamma", "domain")}, skills=GOBBI_SKILLS
        )
        code, envelope, stderr = run("--root", str(root))
        self.assertEqual(code, 0, stderr)
        self.assertEqual(set(envelope), ENVELOPE_KEYS)
        self.assertEqual(
            (envelope["tool"], envelope["command"], envelope["ok"], envelope["exit"]),
            ("check_skills", "check", True, 0),
        )
        result = envelope["result"]
        self.assertEqual(result["skills"], [GOBBI_SKILLS, ".gobbi/projects/other/skills"])
        self.assertEqual([row["id"] for row in result["checks"]], [check.id for check in CHECKS])
        self.assertIn("0 error(s)", stderr)

    def test_findings_exit_1_with_one_line_each_and_a_line_free_id(self):
        long_lines = "\n".join(f"word {'x' * 120} {n}" for n in range(20))
        root = self.project({f"{SKILLS}/alpha/notes.md": f"# Notes\n\n{long_lines}\n"})
        code, envelope, stderr = run("--root", str(root), "--skills", str(root / SKILLS))
        self.assertEqual(code, 1)
        self.assertFalse(envelope["ok"])
        ids = FAILURE_ID.findall(stderr)
        self.assertEqual(len(ids), 20)
        self.assertEqual(len(envelope["result"]["findings"]), 20)
        self.assertEqual(ids[0], f"line-length {SKILLS}/alpha/notes.md line is 127 characters (max 115)")
        self.assertIn(f"ERROR line-length {SKILLS}/alpha/notes.md line is 127 characters (max 115) [L3]", stderr)

    def test_advisory_findings_are_notes_and_do_not_fail(self):
        root = self.project({f"{SKILLS}/alpha/notes.md": "# Notes\n\n- **MUST keep the boundary.** Because.\n"})
        code, envelope, stderr = run("--root", str(root), "--skills", str(root / SKILLS))
        self.assertEqual(code, 0, stderr)
        self.assertIn("NOTE rule-leads", stderr)
        self.assertTrue(envelope["result"]["findings"][0]["advisory"])

    def test_options_and_only(self):
        notes = f"# Notes\n\n{('word ' * 24).rstrip()}\n\nThis is VERY loud.\n"
        root = self.project({f"{SKILLS}/alpha/notes.md": notes})
        skills = ("--root", str(root), "--skills", str(root / SKILLS))
        code, envelope, _ = run(*skills, "--only", "line-length", "--only", "all-caps")
        self.assertEqual(code, 1)
        self.assertEqual([row["id"] for row in envelope["result"]["checks"]], ["line-length", "all-caps"])
        code, _, stderr = run(*skills, "--max-line", "120", "--allow-caps", "VERY")
        self.assertEqual(code, 0, stderr)

    def test_crashed_check_exits_3_and_other_checks_still_report(self):
        root = self.project({f"{SKILLS}/alpha/broken.md": b"\xff\xfe not utf-8\n"})
        skills = ("--root", str(root), "--skills", str(root / SKILLS))
        code, envelope, stderr = run(*skills, "--only", "line-length", "--only", "frontmatter")
        self.assertEqual(code, 3)
        rows = {row["id"]: row for row in envelope["result"]["checks"]}
        self.assertTrue(rows["line-length"]["crashed"])
        self.assertFalse(rows["frontmatter"]["crashed"])
        self.assertIn("check-crashed UnicodeDecodeError", stderr)

    def test_usage_errors_exit_2_in_the_envelope(self):
        root = self.project()
        outside = self.tree({"skills/x.md": "x"})
        cases = {
            "unknown check": (("--root", str(root), "--only", "nope"), "unknown-check"),
            "no skills directory": (("--root", str(root)), "no-skills"),
            "missing skills": (("--root", str(root), "--skills", str(root / "gone")), "bad-skills"),
            "skills outside the root": (("--root", str(root), "--skills", str(outside / "skills")), "bad-skills"),
            "root is not a directory": (("--root", str(root / "README.md")), "bad-root"),
            "max line": (("--root", str(root), "--skills", str(root / SKILLS), "--max-line", "0"), "usage"),
            "bad argument": (("--frobnicate",), "usage"),
        }
        for label, (args, error_code) in cases.items():
            with self.subTest(label):
                code, envelope, _ = run(*args)
                self.assertEqual((code, envelope["error"]["code"], envelope["result"]), (2, error_code, None))

    def test_root_defaults_to_the_working_directory_outside_git(self):
        root = self.project(skills=GOBBI_SKILLS)
        outside_git = {**os.environ, "GIT_CEILING_DIRECTORIES": str(root.resolve().parent)}
        code, envelope, stderr = run(cwd=root, env=outside_git)
        self.assertEqual(code, 0, stderr)
        self.assertEqual(Path(envelope["result"]["root"]), root.resolve())

    @unittest.skipUnless(HAS_GIT, "git is required")
    def test_root_defaults_to_the_git_top_level(self):
        root = self.project(skills=GOBBI_SKILLS)
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True, capture_output=True)
        code, envelope, stderr = run(cwd=root / GOBBI_SKILLS / "alpha")
        self.assertEqual(code, 0, stderr)
        self.assertEqual(envelope["result"]["skills"], [GOBBI_SKILLS])

    def test_runs_from_any_copy_without_writing_bytecode(self):
        copy = self.tree({})
        shutil.copytree(SCRIPTS, copy / "scripts", ignore=shutil.ignore_patterns("__pycache__"))
        root = self.project(skills=GOBBI_SKILLS)
        code, _, stderr = run("--root", str(root), script=copy / "scripts" / CHECK_SKILLS.name)
        self.assertEqual(code, 0, stderr)
        self.assertEqual(list(copy.rglob("__pycache__")), [])


if __name__ == "__main__":
    unittest.main()
