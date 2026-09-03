#!/usr/bin/env python3
"""Create the public, event-safe card dataset from the private ledger."""

from __future__ import annotations

import json
import shutil
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT.parent / "chansey-ledger"
DB = LEDGER / "chansey.db"
SOURCE_IMAGES = LEDGER / "images"
PUBLIC_IMAGES = ROOT / "public" / "cards"
OUTPUT = ROOT / "app" / "cards-data.json"


def main() -> None:
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    rows = connection.execute(
        """
        SELECT id, species, language, set_name, set_orig, number, variant,
               year, rarity, era, image_key, status, quantity, ordered_quantity,
               binder_page, binder_slot, binder_index
        FROM card_full
        ORDER BY CASE species WHEN 'Chansey' THEN 1 WHEN 'Happiny' THEN 2 ELSE 3 END,
                 year, set_name, number, language, variant
        """
    ).fetchall()
    connection.close()

    cards = []
    image_keys = set()
    for row in rows:
        card = dict(row)
        key = card.pop("image_key")
        card["image"] = f"/cards/{key}.jpg" if key else None
        if key:
            image_keys.add(key)
        cards.append(card)

    OUTPUT.write_text(json.dumps(cards, ensure_ascii=False, separators=(",", ":")))
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    for key in image_keys:
        source = SOURCE_IMAGES / f"{key}.jpg"
        if source.exists():
            shutil.copy2(source, PUBLIC_IMAGES / source.name)

    print(f"wrote {len(cards)} public cards and {len(image_keys)} image references")


if __name__ == "__main__":
    main()
