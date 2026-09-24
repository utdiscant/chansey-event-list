#!/usr/bin/env python3
"""Create the public, event-safe card dataset.

Since 24 September 2026 the source is the Card Hub (../hub/hub.db), not ../chansey-ledger/chansey.db.
The export and its public allowlist live in ../hub/scripts/export_chansey_public.py.
"""

import subprocess
import sys
from pathlib import Path

HUB_EXPORT = Path(__file__).resolve().parents[2] / "hub" / "scripts" / "export_chansey_public.py"

if __name__ == "__main__":
    sys.exit(subprocess.call([sys.executable, str(HUB_EXPORT), *sys.argv[1:]]))
