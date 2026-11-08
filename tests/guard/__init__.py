"""Guard tests. Run from the repository root: python3 -m unittest discover -s tests/guard -t ."""

import sys
from pathlib import Path

from .. import skill_checks  # noqa: F401 - puts the shared skill checks on sys.path, as guard.py does

GUARD_DIR = Path(__file__).resolve().parents[2] / "scripts" / "guard"
if str(GUARD_DIR) not in sys.path:
    sys.path.insert(0, str(GUARD_DIR))
