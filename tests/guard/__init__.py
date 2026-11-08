"""Guard tests. Run from the repository root: python3 -m unittest discover -s tests/guard -t ."""

import sys
from pathlib import Path

GUARD_DIR = Path(__file__).resolve().parents[2] / "scripts" / "guard"
if str(GUARD_DIR) not in sys.path:
    sys.path.insert(0, str(GUARD_DIR))
