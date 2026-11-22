"""shot-check: measure a capture so the scorer judges numbers, not impressions.

    python shot-check.py <shot.png> [--json]

Reports:
  blank      one flat colour (capture failed / nothing painted) -> never score it
  frame      transparent margin (black edge) an OS-level window capture leaves around a card
  surfaces   fill bands top to bottom (dominant colour per row, merged) -> more than one
             body fill under the window bar is a card inside a card (one surface)
  insets     where the fill changes walking in from the left edge at mid-height -> a panel
             inset inside the window shows as an extra edge (R5/R6)
  right_edges  right ends of text runs per row band -> numbers that should share one
             column but end at different x (R7)
Needs Pillow.
"""
import json
import sys
from collections import Counter

from PIL import Image


def close(a, b, tol=6):
    return all(abs(x - y) <= tol for x, y in zip(a, b, strict=False))


def dominant(px, y, x0, x1, step=2):
    c = Counter(px[x, y][:3] for x in range(x0, x1, step))
    return c.most_common(1)[0][0]


def main(path, as_json=False):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    px = im.load()
    rep = {"file": path, "size": [W, H]}

    sample = {px[x, y] for x in range(0, W, max(1, W // 40)) for y in range(0, H, max(1, H // 40))}
    rep["blank"] = len(sample) <= 1

    # transparent margin: black columns/rows at the edges
    def black_run(coords):
        n = 0
        for c in coords:
            if px[c] == (0, 0, 0):
                n += 1
            else:
                break
        return n
    rep["frame"] = {"left": black_run([(x, H // 2) for x in range(W)]), "top": black_run([(W // 2, y) for y in range(H)]),
                    "note": "black margin = transparent window area, not a flaw"}
    fl, ft = rep["frame"]["left"], rep["frame"]["top"]

    # surfaces: dominant fill per row across the middle 80 %, merged into bands >= 16 px
    x0, x1 = fl + int(W * 0.1), W - fl - int(W * 0.1)
    bands = []
    for y in range(ft, H - ft):
        d = dominant(px, y, x0, x1)
        if bands and close(bands[-1]["fill"], d):
            bands[-1]["to"] = y
        else:
            bands.append({"fill": d, "from": y, "to": y})
    bands = [b for b in bands if b["to"] - b["from"] >= 15]
    merged = []
    for b in bands:
        if merged and close(merged[-1]["fill"], b["fill"]):
            merged[-1]["to"] = b["to"]
        else:
            merged.append(dict(b))
    fills = []
    for b in merged:
        if not any(close(f, b["fill"]) for f in fills):
            fills.append(b["fill"])
    rep["surfaces"] = {"bands": [{"fill": list(b["fill"]), "y": [b["from"], b["to"]]} for b in merged],
                       "distinct_fills": len(fills)}

    # insets: fill changes walking right from the frame at several heights
    # insets: vertical edges near the left side that run down most of the body (a panel's
    # side), not icons or text that change colour on one row only
    rows = list(range(int(H * 0.2), int(H * 0.8), 4))
    edges = []
    for x in range(fl + 13, min(W - 1, fl + 80)):  # the first 12 px are the window's own border/shadow
        hits = sum(1 for y in rows if not close(px[x - 1, y], px[x, y], 1) and close(px[x, y], px[min(W - 1, x + 3), y], 1))
        if hits >= 0.7 * len(rows):
            edges.append(x - fl)
    insets = {"edges": edges}
    rep["insets_from_left"] = edges

    # right ends of text lines on the right half: max over each text line's rows
    lines, cur = [], None
    for y in range(ft + 40, H - ft):
        bg = dominant(px, y, W // 2, W - fl - 20, 3)
        end = None
        for x in range(W - fl - 20, W // 2, -1):
            if sum(abs(p - q) for p, q in zip(px[x, y], bg, strict=False)) > 150:
                end = x
                break
        if end is None:
            if cur:
                lines.append(cur)
            cur = None
        else:
            cur = max(cur or 0, end)
    if cur:
        lines.append(cur)
    groups = []
    for e in sorted(lines):
        if groups and e - groups[-1][-1] <= 3:
            groups[-1].append(e)
        else:
            groups.append([e])
    common = [max(g) for g in groups if len(g) >= 3]
    rep["right_edges"] = common
    rep["right_edges_note"] = "x where 3+ text lines end; two close values = a column that does not line up (R7)"

    flags = []
    if rep["blank"]:
        flags.append("BLANK capture: retry with -WaitMs; do not score")
    if rep["surfaces"]["distinct_fills"] > 2:
        flags.append(f"{rep['surfaces']['distinct_fills']} distinct fills top to bottom: card inside a card, or a full-width highlight/share bar (T6/R5, T5)")
    if edges:
        flags.append(f"a vertical surface edge {edges} px in from the window side: an inset panel inside the window (T6/R5)")
    if len(common) > 1 and min(b - a for a, b in zip(common, common[1:], strict=False)) < 60:
        flags.append(f"right edges at {common}: column misaligned? (R7)")
    rep["flags"] = flags

    if as_json:
        print(json.dumps(rep, indent=1))
    else:
        print(f"{path}  {W}x{H}  blank={rep['blank']}  frame={fl},{ft}")
        print("surfaces:", "  ".join(f"{tuple(b['fill'])}@{b['y'][0]}-{b['y'][1]}" for b in rep["surfaces"]["bands"]))
        print("insets from left:", insets)
        print("right edges:", rep["right_edges"])
        for f in flags:
            print("FLAG", f)
    return 1 if flags else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1], "--json" in sys.argv))
