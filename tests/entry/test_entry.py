import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ENTRY = Path(__file__).resolve().parents[2] / ".gobbi" / "projects" / "gobbi" / "skills" / "gobbi" / "scripts" / "entry.py"
HAS_GIT = shutil.which("git") is not None

CONFIGURATION = """# Cowork Configuration

| Field | Value |
|---|---|
| Mode | Cowork |
| Normalized slug | demo |
"""


def run(cwd: Path, *args: str) -> tuple[int, dict[str, list[str]]]:
    completed = subprocess.run([sys.executable, str(ENTRY), *args], capture_output=True, text=True, cwd=cwd)
    fields: dict[str, list[str]] = {}
    for line in completed.stdout.splitlines():
        key, _, value = line.partition(": ")
        fields.setdefault(key, []).append(value)
    return completed.returncode, fields


@unittest.skipUnless(HAS_GIT, "git is required")
class EntryTest(unittest.TestCase):
    def repo(self, name: str) -> Path:
        base = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, base, ignore_errors=True)
        root = base / name
        root.mkdir()
        subprocess.run(["git", "init", "-q", "-b", "main", str(root)], check=True)
        return root.resolve()

    def test_prints_the_validated_roots_and_project_key(self):
        root = self.repo("demo-project")
        code, fields = run(root)
        self.assertEqual(code, 0)
        skills = ENTRY.parents[2]
        self.assertEqual(fields["skills_root"], [str(skills)])
        self.assertEqual(fields["agents_root"], [str(skills.parent / "agents")])
        self.assertEqual(fields["project_key"], ["demo-project"])
        self.assertEqual(fields["checkout"], [str(root)])
        self.assertEqual(fields["branch"], ["main"])
        self.assertEqual(fields["dirty"], ["no"])
        self.assertEqual(fields["instructions"], ["none"])
        self.assertEqual(fields["rules"], ["NO_PROJECT_RULES: rules/ absent-or-empty"])
        self.assertEqual(fields["sessions"], ["0"])

    def test_lists_instructions_rules_and_sessions_and_reports_a_dirty_tree(self):
        root = self.repo("demo")
        project = root / ".gobbi" / "projects" / "demo"
        session = project / "sessions" / "2026-01-01-demo-0000"
        session.mkdir(parents=True)
        (session / "configuration.md").write_text(CONFIGURATION, encoding="utf-8")
        (project / "rules").mkdir()
        (project / "rules" / "style.md").write_text("# Style\n", encoding="utf-8")
        (root / "AGENTS.md").write_text("# Agents\n", encoding="utf-8")
        code, fields = run(root, "claude")
        self.assertEqual(code, 0)
        self.assertEqual(fields["dirty"], ["yes"])
        self.assertEqual(fields["instructions"], [str(root / "AGENTS.md")])
        self.assertEqual(fields["rules"], [str(project / "rules" / "style.md")])
        self.assertEqual(fields["sessions"], ["1"])
        self.assertEqual(
            fields["session"], ["Cowork | demo | .gobbi/projects/demo/sessions/2026-01-01-demo-0000/configuration.md"]
        )
        self.assertEqual(fields["runtime"], ["claude"])
        self.assertEqual(fields["runtime_agents_root"], [str(ENTRY.parents[3] / "agents" / "claude")])

    def test_blocks_on_an_invalid_project_key_until_one_is_given(self):
        root = self.repo("Bad_Name")
        code, fields = run(root)
        self.assertEqual(code, 2)
        self.assertIn("project key 'Bad_Name'", fields["blocked"][0])
        code, fields = run(root, "claude", "good-name")
        self.assertEqual(code, 0)
        self.assertEqual(fields["project_key"], ["good-name"])

    def test_lists_every_session_and_marks_an_unreadable_one(self):
        root = self.repo("demo")
        sessions = root / ".gobbi" / "projects" / "demo" / "sessions"
        for number in range(12):
            session = sessions / f"2026-01-01-demo-{number:04d}"
            session.mkdir(parents=True)
            (session / "configuration.md").write_text(CONFIGURATION, encoding="utf-8")
        broken = sessions / "2026-01-01-demo-0000" / "configuration.md"
        broken.unlink()
        broken.mkdir()
        code, fields = run(root)
        self.assertEqual(code, 0)
        self.assertEqual(fields["sessions"], ["12"])
        self.assertEqual(len(fields["session"]), 12)
        self.assertEqual(sum(row.startswith("unreadable | ") for row in fields["session"]), 1)

    def test_leaves_the_repository_unchanged(self):
        root = self.repo("demo")
        (root / "note.txt").write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "add", "note.txt"], cwd=root, check=True)
        (root / "note.txt").write_text("y\n", encoding="utf-8")
        index = root / ".git" / "index"
        before = (index.read_bytes(), index.stat().st_mtime_ns)
        self.assertEqual(run(root)[0], 0)
        self.assertEqual((index.read_bytes(), index.stat().st_mtime_ns), before)

    def test_finds_the_specialist_directory_for_every_runtime_in_both_trees(self):
        root = self.repo("demo")
        gobbi_root = ENTRY.parents[6]
        plugin = gobbi_root / "plugins" / "gobbi" / "skills" / "gobbi" / "scripts" / "entry.py"
        antigravity_plugin = (
            gobbi_root / "plugins" / "antigravity" / "gobbi" / "skills" / "gobbi" / "scripts" / "entry.py"
        )
        cases = (
            (ENTRY, ("antigravity", "claude", "codex", "cursor", "grok")),
            (plugin, ("claude", "codex", "cursor", "grok")),
            (antigravity_plugin, ("antigravity",)),
        )
        for script, runtimes in cases:
            for runtime in runtimes:
                completed = subprocess.run(
                    [sys.executable, str(script), runtime], capture_output=True, text=True, cwd=root
                )
                self.assertEqual(completed.returncode, 0, completed.stdout)
                fields = dict(line.split(": ", 1) for line in completed.stdout.splitlines())
                roles = Path(fields["runtime_agents_root"])
                suffix = ".toml" if runtime == "codex" else ".md"
                self.assertEqual(
                    {p.stem for p in roles.glob(f"*{suffix}")},
                    {"assistant", "leader", "author", "developer", "designer", "reviewer"},
                )

    def test_blocks_mismatched_package_runtime_and_lists_gemini_instructions(self):
        root = self.repo("demo")
        (root / "GEMINI.md").write_text("# Gemini\n", encoding="utf-8")
        code, fields = run(root, "antigravity")
        self.assertEqual(code, 0)
        self.assertEqual(fields["instructions"], [str(root / "GEMINI.md")])
        gobbi_root = ENTRY.parents[6]
        plugin = gobbi_root / "plugins" / "gobbi" / "skills" / "gobbi" / "scripts" / "entry.py"
        antigravity_plugin = (
            gobbi_root / "plugins" / "antigravity" / "gobbi" / "skills" / "gobbi" / "scripts" / "entry.py"
        )
        for script, wrong_runtime in ((plugin, "antigravity"), (antigravity_plugin, "claude")):
            completed = subprocess.run(
                [sys.executable, str(script), wrong_runtime], capture_output=True, text=True, cwd=root
            )
            self.assertEqual(completed.returncode, 2, completed.stdout)
            self.assertIn(f"blocked: no {wrong_runtime} specialist directory", completed.stdout)

    def test_blocks_outside_a_repository_and_on_an_unknown_runtime(self):
        outside = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, outside, ignore_errors=True)
        code, fields = run(outside)
        self.assertEqual(code, 2)
        self.assertIn("blocked", fields)
        code, fields = run(self.repo("demo"), "vim")
        self.assertEqual(code, 2)
        self.assertIn("runtime 'vim'", fields["blocked"][0])


if __name__ == "__main__":
    unittest.main()
