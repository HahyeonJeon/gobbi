import os
import unittest

import mirror
from repo import Repo

from ..skill_checks.fixtures import skill
from .fixtures import HAS_GIT, SKILLS, GuardCase

PACKAGE_SKILLS = "plugins/gobbi/skills"
WRITABLE = ("plugins/gobbi/skills", "plugins/gobbi/agents", "plugins/gobbi/runtimes")


class RewriteLinksTest(unittest.TestCase):
    def test_longest_prefix_first_and_only_relative_agent_links(self):
        text = (
            "[a](../../agents/claude/manager.md) [b](../../agents/codex/manager.toml) "
            "[c](../../skills/git/SKILL.md) [d](agents/claude/x.md) [e](../../agents/README.md)"
        )
        self.assertEqual(
            mirror.rewrite_links(text),
            "[a](../../agents/manager.md) [b](../../runtimes/codex/manager.toml) "
            "[c](../../skills/git/SKILL.md) [d](agents/claude/x.md) [e](../../agents/README.md)",
        )


@unittest.skipUnless(HAS_GIT, "git is required")
class DriftTest(GuardCase):
    def kinds(self, root) -> list[str]:
        return [f"{finding.message} {finding.path}" for finding in mirror.drift(Repo(root))]

    def test_clean_projection(self):
        self.assertEqual(self.kinds(self.gobbi()), [])

    def test_each_kind_of_difference(self):
        root = self.gobbi(
            {
                f"{SKILLS}/alpha/new.md": "new",
                f"{PACKAGE_SKILLS}/beta/SKILL.md": "edited",
                f"{PACKAGE_SKILLS}/stray.md": "stray",
            }
        )
        os.chmod(root / f"{PACKAGE_SKILLS}/alpha/SKILL.md", 0o755)
        self.assertEqual(
            self.kinds(root),
            [
                f"mode-differs {PACKAGE_SKILLS}/alpha/SKILL.md",
                f"missing-in-package {PACKAGE_SKILLS}/alpha/new.md",
                f"content-differs {PACKAGE_SKILLS}/beta/SKILL.md",
                f"unexpected-in-package {PACKAGE_SKILLS}/stray.md",
            ],
        )

    def test_rewritten_file_differs_only_by_its_links(self):
        source = "Role: [manager](../../agents/claude/manager.md)\n"
        root = self.gobbi({f"{SKILLS}/gobbi/SKILL.md": source, f"{PACKAGE_SKILLS}/gobbi/SKILL.md": source})
        self.assertEqual(self.kinds(root), [f"content-differs {PACKAGE_SKILLS}/gobbi/SKILL.md"])
        Repo(root).apply(mirror.plan(Repo(root)), WRITABLE)
        self.assertEqual(
            (root / f"{PACKAGE_SKILLS}/gobbi/SKILL.md").read_text(), "Role: [manager](../../agents/manager.md)\n"
        )
        self.assertEqual(self.kinds(root), [])


@unittest.skipUnless(HAS_GIT, "git is required")
class CodexPolicyTest(GuardCase):
    USER_ONLY = skill("alpha").replace("skill-type:", "disable-model-invocation: true\nskill-type:")

    def kinds(self, root) -> list[str]:
        return [f"{finding.message} {finding.path}" for finding in mirror.drift(Repo(root))]

    def test_user_only_skill_gets_the_policy_in_the_package_only(self):
        root = self.gobbi({f"{SKILLS}/alpha/SKILL.md": self.USER_ONLY})
        policy = f"{PACKAGE_SKILLS}/alpha/{mirror.CODEX_POLICY}"
        self.assertIn(f"missing-in-package {policy}", self.kinds(root))
        Repo(root).apply(mirror.plan(Repo(root)), WRITABLE)
        self.assertEqual((root / policy).read_bytes(), mirror.CODEX_USER_ONLY)
        self.assertEqual(self.kinds(root), [])

    def test_policy_goes_when_the_skill_is_no_longer_user_only(self):
        root = self.gobbi({f"{PACKAGE_SKILLS}/alpha/{mirror.CODEX_POLICY}": mirror.CODEX_USER_ONLY})
        self.assertEqual(self.kinds(root), [f"unexpected-in-package {PACKAGE_SKILLS}/alpha/{mirror.CODEX_POLICY}"])

    def test_canonical_policy_file_is_a_finding(self):
        canonical = f"{SKILLS}/alpha/{mirror.CODEX_POLICY}"
        root = self.gobbi(
            {
                f"{SKILLS}/alpha/SKILL.md": self.USER_ONLY,
                canonical: mirror.CODEX_USER_ONLY,
                f"{PACKAGE_SKILLS}/alpha/SKILL.md": self.USER_ONLY,
                f"{PACKAGE_SKILLS}/alpha/{mirror.CODEX_POLICY}": mirror.CODEX_USER_ONLY,
            }
        )
        self.assertEqual(
            self.kinds(root), [f"generated-in-package: use disable-model-invocation in SKILL.md {canonical}"]
        )


@unittest.skipUnless(HAS_GIT, "git is required")
class SyncRoundTripTest(GuardCase):
    def test_drift_then_sync_then_clean(self):
        root = self.gobbi({f"{SKILLS}/alpha/run.sh": "#!/bin/sh\n", f"{PACKAGE_SKILLS}/stray/x.md": "x"})
        os.chmod(root / f"{SKILLS}/alpha/run.sh", 0o755)
        (root / f"{PACKAGE_SKILLS}/beta/SKILL.md").unlink()
        os.symlink("../alpha/SKILL.md", root / f"{PACKAGE_SKILLS}/beta/SKILL.md")
        os.symlink("../alpha", root / f"{PACKAGE_SKILLS}/planted")
        manifest = root / "plugins/gobbi/.claude-plugin/plugin.json"
        before = manifest.read_bytes()

        Repo(root).apply(mirror.plan(Repo(root)), WRITABLE)

        self.assertEqual(self.messages(mirror.drift, root), [])
        self.assertEqual(manifest.read_bytes(), before)
        self.assertTrue(os.access(root / f"{PACKAGE_SKILLS}/alpha/run.sh", os.X_OK))
        self.assertFalse((root / f"{PACKAGE_SKILLS}/beta/SKILL.md").is_symlink())
        self.assertFalse(os.path.lexists(root / f"{PACKAGE_SKILLS}/planted"))
        self.assertFalse((root / f"{PACKAGE_SKILLS}/stray").exists())


if __name__ == "__main__":
    unittest.main()
