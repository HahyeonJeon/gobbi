import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

from checks import CHECKS

from .fixtures import GUARD, HAS_GIT, SKILLS, GuardCase

ENVELOPE_KEYS = {"tool", "command", "ok", "exit", "result", "error"}
# The guard's failure-id regex from Gobbi's verification.json (design §5.1).
FAILURE_ID = re.compile(r"^ERROR (\S+ \S+ .*?)(?: \[L\d+\])?$", re.MULTILINE)


def run(*args: str, cwd: Path | None = None) -> tuple[int, dict, str]:
    completed = subprocess.run([sys.executable, str(GUARD), *args], capture_output=True, text=True, cwd=cwd)
    lines = completed.stdout.splitlines()
    assert len(lines) == 1, f"stdout is not one line: {completed.stdout!r}"
    return completed.returncode, json.loads(lines[0]), completed.stderr


@unittest.skipUnless(HAS_GIT, "git is required")
class CommandLineTest(GuardCase):
    def test_clean_tree_checks_clean(self):
        code, envelope, stderr = run("check", "--root", str(self.gobbi()))
        self.assertEqual(code, 0, stderr)
        self.assertEqual(set(envelope), ENVELOPE_KEYS)
        self.assertEqual(
            (envelope["tool"], envelope["command"], envelope["ok"], envelope["exit"]), ("guard", "check", True, 0)
        )
        self.assertEqual([row["id"] for row in envelope["result"]["checks"]], [check.id for check in CHECKS])
        self.assertIn("0 error(s)", stderr)

    def test_findings_exit_1_with_one_line_each(self):
        root = self.gobbi({f"{SKILLS}/alpha/SKILL.md": "no frontmatter\n"})
        code, envelope, stderr = run("check", "--only", "frontmatter", "--root", str(root))
        self.assertEqual(code, 1)
        self.assertFalse(envelope["ok"])
        self.assertEqual(envelope["result"]["findings"][0]["check"], "frontmatter")
        self.assertIn(f"ERROR frontmatter {SKILLS}/alpha/SKILL.md no frontmatter [L1]", stderr)

    def test_every_finding_reaches_stderr_and_yields_a_line_free_id(self):
        long_lines = "\n".join(f"word {'x' * 120} {n}" for n in range(20))
        root = self.gobbi({f"{SKILLS}/alpha/notes.md": f"# Notes\n\n{long_lines}\n"})
        code, envelope, stderr = run("check", "--only", "line-length", "--root", str(root))
        self.assertEqual(code, 1)
        ids = FAILURE_ID.findall(stderr)
        self.assertEqual(len(ids), 20)
        self.assertEqual(len(envelope["result"]["findings"]), 20)
        self.assertTrue(all("[L" not in failure_id for failure_id in ids))
        self.assertEqual(ids[0], f"line-length {SKILLS}/alpha/notes.md line is 127 characters (max 115)")

    def test_advisory_findings_are_notes_and_do_not_fail(self):
        rule = "- **MUST keep the boundary.** Because it is safe.\n"
        root = self.gobbi({f"{SKILLS}/alpha/notes.md": f"# Notes\n\n{rule}"})
        code, envelope, stderr = run("check", "--only", "rule-leads", "--root", str(root))
        self.assertEqual(code, 0)
        self.assertIn("NOTE rule-leads", stderr)
        self.assertTrue(envelope["result"]["findings"][0]["advisory"])

    def test_crashed_check_exits_3_and_other_checks_still_report(self):
        root = self.gobbi({f"{SKILLS}/alpha/broken.md": b"\xff\xfe not utf-8\n"})
        code, envelope, stderr = run("check", "--only", "line-length", "--only", "versions", "--root", str(root))
        self.assertEqual(code, 3)
        rows = {row["id"]: row for row in envelope["result"]["checks"]}
        self.assertTrue(rows["line-length"]["crashed"])
        self.assertFalse(rows["versions"]["crashed"])
        self.assertIn("check-crashed UnicodeDecodeError", stderr)
        self.assertIn("Traceback", stderr)

    def test_unknown_check_exits_2(self):
        code, envelope, _ = run("check", "--only", "nope", "--root", str(self.gobbi()))
        self.assertEqual(code, 2)
        self.assertEqual(envelope["error"]["code"], "unknown-check")
        self.assertIsNone(envelope["result"])

    def test_outside_a_gobbi_checkout_exits_2(self):
        code, envelope, _ = run("check", "--root", str(self.tree({"x.txt": "x"})))
        self.assertEqual((code, envelope["error"]["code"]), (2, "not-gobbi-repo"))

    def test_bad_arguments_exit_2_in_the_envelope(self):
        code, envelope, _ = run("frobnicate")
        self.assertEqual((code, envelope["error"]["code"], envelope["command"]), (2, "usage", None))

    def test_root_defaults_to_the_working_directory(self):
        root = self.gobbi()
        code, _, _ = run("check", "--only", "versions", cwd=root / SKILLS)
        self.assertEqual(code, 0)

    def test_list_names_every_check(self):
        code, envelope, _ = run("list")
        self.assertEqual(code, 0)
        rows = envelope["result"]["checks"]
        self.assertEqual([row["id"] for row in rows], [check.id for check in CHECKS])
        self.assertEqual([row["id"] for row in rows if row["advisory"]], ["rule-leads"])

    def test_sync_reports_actions_and_check_is_then_clean(self):
        root = self.gobbi({"plugins/gobbi/skills/alpha/SKILL.md": "stale\n", "AGENTS.md": "## Principles\n"})
        code, envelope, _ = run("sync", "--root", str(root))
        self.assertEqual(code, 1)  # AGENTS.md has no block pair: sync cannot fix that
        self.assertEqual(
            envelope["result"]["actions"], [{"op": "write", "path": "plugins/gobbi/skills/alpha/SKILL.md"}]
        )
        self.assertEqual(envelope["result"]["problems"][0]["path"], "AGENTS.md")
        code, _, stderr = run("check", "--only", "mirror", "--root", str(root))
        self.assertEqual(code, 0, stderr)

    def test_sync_on_a_clean_tree_does_nothing(self):
        code, envelope, _ = run("sync", "--root", str(self.gobbi()))
        self.assertEqual((code, envelope["result"]["actions"]), (0, []))


if __name__ == "__main__":
    unittest.main()
