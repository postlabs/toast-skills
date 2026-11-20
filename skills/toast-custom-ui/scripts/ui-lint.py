"""ui-lint: check a piece / sealed atom / page source against TASTE.md and the see-it rubric.

    python ui-lint.py <atom.js | folder> [--json]

Finds what code can show before any picture is taken. Each finding has a rule (T1-T7 =
TASTE.md rules, R* = see-it-loop.md rubric), a severity (major | minor | info), a line and
the evidence. Exit code 1 when any major is found, so it can gate a ship.

What it cannot see (score those on the capture): real alignment, contrast on the actual
surface, overlap, truncation with live data, how the window bar looks.
"""
import json
import re
import sys
from pathlib import Path

CSS_COLOR = re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)")
FONT_SIZE = re.compile(r"font-size\s*:\s*([0-9.]+)px")
FONT_WEIGHT = re.compile(r"font-weight\s*:\s*([0-9]+|bold|bolder)")
FONT_FAMILY = re.compile(r"font-family\s*:\s*([^;}\"'`]+)")
FONT_SHORT = re.compile(r"\bfont\s*:\s*([^;}\"'`]+)")
CHEVRON = re.compile(r"chevron|caret|arrow-(?:down|up|right|left)|[▾▸▴◂›‹»«⌄⌃]|M\s*[0-9.]+\s+[0-9.]+l\s*[0-9.]+\s+[0-9.]+\s+[0-9.]+\s+-[0-9.]+", re.I)
GLYPH_BUTTON_NAMES = re.compile(r"\b(expand|collapse|more|kebab|dots|ellipsis|grip|drag)\s*:\s*['\"`]<svg", re.I)
DRAMA = re.compile(r"box-shadow\s*:\s*0\s+0\s+[0-9]+px|text-shadow|filter\s*:\s*drop-shadow|glow|linear-gradient|radial-gradient|@keyframes|animation\s*:", re.I)
SHARE_BAR = re.compile(r"(?:width|right)\s*:\s*\$\{[^}]*(?:share|pct|ratio|amount|percent|frac)[^}]*\}", re.I)
VIS_HIDDEN = re.compile(r"visibility\s*:\s*hidden")
CARD_RULE = re.compile(r"([.#][\w-]+)[^{]*\{([^}]*)\}")
PLURAL = re.compile(r"\$\{[^}]+\}\s*(files|lines|items|folders|rows|results)\b")
SYSTEM_FONTS = re.compile(r"system-ui|-apple-system|Segoe|Arial|Helvetica|Roboto|sans-serif|Inter\b", re.I)


def var_spans(text):
    """Spans of var(--x, fallback) and ${v('--x', fallback)} so colours inside them are allowed."""
    spans = []
    for m in re.finditer(r"var\(--[\w-]+\s*,", text):
        depth, i = 1, m.end()
        while i < len(text) and depth:
            depth += {"(": 1, ")": -1}.get(text[i], 0)
            i += 1
        spans.append((m.start(), i))
    # token helpers: v('--x', '#fallback'), tok("--x", ...)
    for m in re.finditer(r"\w+\(\s*['\"]--[\w-]+['\"]\s*,", text):
        depth, i = 1, m.end()
        while i < len(text) and depth:
            depth += {"(": 1, ")": -1}.get(text[i], 0)
            i += 1
        spans.append((m.start(), i))
    return spans


def strip_comments(text):
    """Blank out // and /* */ comments, keeping offsets and line numbers."""
    def blank(m):
        return re.sub(r"[^\n]", " ", m.group(0))
    text = re.sub(r"/\*.*?\*/", blank, text, flags=re.S)
    # a // that is not part of a URL (https://) starts a comment
    return re.sub(r"(?m)(^|[^:])//[^\n]*", lambda m: m.group(1) + " " * (len(m.group(0)) - len(m.group(1))), text)


def inside(pos, spans):
    return any(a <= pos < b for a, b in spans)


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def lint(path: Path):
    raw_text = path.read_text(encoding="utf-8", errors="replace")
    text = strip_comments(raw_text)
    out = []

    def add(rule, sev, pos, msg):
        ln = line_of(text, pos) if pos is not None else None
        src = raw_text.splitlines()[ln - 1].strip()[:140] if ln else ""
        out.append({"rule": rule, "severity": sev, "file": path.name, "line": ln, "message": msg, "source": src})

    # T3 / R3: app font, inherited
    # A sealed frame cannot inherit: it pins the worn look's font, Pretendard by default.
    frame_pin = re.compile(r"^\s*['\"]?(var\(\s*--type-family-sans|pretendard)", re.I)
    for m in FONT_FAMILY.finditer(text):
        val = m.group(1)
        if "inherit" not in val and not frame_pin.search(val):
            add("T3", "major", m.start(), f"font-family '{val.strip()}' — inherit the app font (font: inherit), or in a frame pin var(--type-family-sans, Pretendard, system-ui, sans-serif)")
    for m in FONT_SHORT.finditer(text):
        val = m.group(1)
        if "inherit" not in val and SYSTEM_FONTS.search(val):
            add("T3", "major", m.start(), f"font shorthand names a font ('{val.strip()[:40]}') — use font: inherit")
    if not re.search(r"font\s*:\s*inherit|font-family\s*:\s*inherit", text):
        add("T3", "minor", None, "no 'font: inherit' anywhere — confirm the root inherits the app font")

    # T3: two type sizes, weights 400/500/600
    sizes = sorted({float(s) for s in FONT_SIZE.findall(text)})
    extra = [s for s in sizes if s not in (12.0, 13.0)]
    if len(sizes) > 2 or extra:
        pos = next((m.start() for m in FONT_SIZE.finditer(text) if float(m.group(1)) in extra), None)
        add("T3", "major" if len(sizes) > 3 else "minor", pos,
            f"type sizes {sizes} — two sizes: 13px body, 12px meta" + (" (title 14px allowed once)" if 14.0 in sizes else ""))
    weights = [(m.group(1), m.start()) for m in FONT_WEIGHT.finditer(text)]
    odd = [(w, p) for w, p in weights if w not in ("400", "500", "600")]
    for w, p in odd:
        add("T3", "minor", p, f"font-weight {w} — use 400, 500 for names, 600 only for the window title")
    w600 = [p for w, p in weights if w in ("600", "bold", "bolder")]
    if len(w600) > 1:
        add("T3", "minor", w600[1], f"{len(w600)} rules at weight 600 — only the window title takes 600")

    # T2: no chevrons; icons are fine
    for m in CHEVRON.finditer(text):
        add("T2", "major", m.start(), f"chevron/caret glyph '{m.group(0)[:20]}' — remove it; use a clear icon from the app's set, or a word if no icon reads")
    for m in GLYPH_BUTTON_NAMES.finditer(text):
        add("T2", "minor", m.start(), f"'{m.group(1)}' control is a grip/kebab/dots glyph — use a clear icon or put it in the right-click menu")

    # R4: tokens, not raw colours
    spans = var_spans(text)
    raw = [m for m in CSS_COLOR.finditer(text) if not inside(m.start(), spans)]
    # ignore colours in object literals of file-type palettes etc. only if they are in JS maps: still report, as info
    for m in raw[:12]:
        ln_txt = text.splitlines()[line_of(text, m.start()) - 1]
        sev = "info" if re.search(r"^\s*['\"]?[\w.-]+['\"]?\s*:\s*['\"]#", ln_txt) else "minor"
        add("R4", sev, m.start(), f"raw colour {m.group(0)} outside a token — use var(--token, {m.group(0)})")
    if len(raw) > 12:
        add("R4", "minor", raw[12].start(), f"... and {len(raw) - 12} more raw colours")

    # T5: no drama
    for m in DRAMA.finditer(text):
        add("T5", "minor", m.start(), f"'{m.group(0)[:30]}' — glows, gradients and animation only when they carry the decision")
    for m in SHARE_BAR.finditer(text):
        add("T5", "major", m.start(), "proportional share bar — reads as selection; drop it or label it")
    if re.search(r"\.[\w-]*bar\b[^{]*\{[^}]*position\s*:\s*absolute", text):
        m = re.search(r"\.[\w-]*bar\b[^{]*\{[^}]*position\s*:\s*absolute", text)
        add("T5", "major", m.start(), "absolutely placed bar behind rows — a share bar reads as selection (TASTE 5: no share bars); drop it")

    # T6 / R5: card inside a card — rules that draw a filled, rounded, bordered/shadowed box
    cards = []
    for m in CARD_RULE.finditer(text):
        sel, body = m.group(1), m.group(2)
        has_fill = re.search(r"background(?:-color)?\s*:", body) and "transparent" not in body.split("background", 1)[1][:40]
        has_round = re.search(r"border-radius\s*:\s*(?:[6-9]|[1-9][0-9])px", body)
        has_edge = re.search(r"\bborder\s*:\s*1px|box-shadow", body)
        is_popup = re.search(r"position\s*:\s*(?:fixed|absolute)", body)
        if has_fill and has_round and has_edge and not is_popup:
            cards.append((sel, m.start()))
    for sel, pos in cards:
        add("T6", "major", pos, f"'{sel}' draws a filled, rounded, bordered box — inside a card window that is a card in a card")

    # R7: hidden controls that still take space shift columns
    for m in VIS_HIDDEN.finditer(text):
        add("R7", "minor", m.start(), "visibility:hidden keeps its width — if only some rows have it, columns shift; position it absolutely or give every row the slot")

    # R14 / T4: plurals and repeated units
    seen_units = set()
    for m in PLURAL.finditer(text):
        if m.group(1) in seen_units:
            continue
        seen_units.add(m.group(1))
        add("R14", "minor", m.start(), f"'${{n}} {m.group(1)}' — '1 {m.group(1)}' reads wrong; pluralise or drop the unit (T4: no repeated units per row)")
    if re.search(r"toLocaleString\(\)", text) and not re.search(r"compact|[kKM]['\"`]|1e3|1e6|1000000", text):
        m = re.search(r"toLocaleString\(\)", text)
        add("T4", "minor", m.start(), "exact grouped numbers on rows — short numbers (877k, 1.5M), exact in the hover title")

    # R10: empty / loading / error states
    for state, pat in (("empty", r"empty|no (?:files|items|results)|nothing"), ("loading", r"loading|reading|scanning|aria-busy"), ("error", r"error|failed|couldn")):
        if not re.search(pat, text, re.I):
            add("R10", "minor", None, f"no {state} state found in the code")

    # R9: truncation
    if re.search(r"text-overflow\s*:\s*ellipsis", text) and not re.search(r"\.title\s*=|title=|setAttribute\(['\"]title", text):
        add("R9", "minor", None, "ellipsis without a title attribute — the cut text cannot be read")

    return out


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    target = Path(argv[1])
    files = [target] if target.is_file() else sorted(
        p for p in target.rglob("*") if p.suffix in (".js", ".css", ".html", ".tsx", ".jsx") and "node_modules" not in p.parts)
    findings = [f for p in files for f in lint(p)]
    if "--json" in argv:
        print(json.dumps(findings, ensure_ascii=False, indent=1))
    else:
        order = {"major": 0, "minor": 1, "info": 2}
        for f in sorted(findings, key=lambda f: (order[f["severity"]], f["rule"], f["line"] or 0)):
            loc = f"{f['file']}:{f['line']}" if f["line"] else f["file"]
            print(f"{f['severity']:5} {f['rule']:4} {loc:18} {f['message']}")
        n = {s: sum(f["severity"] == s for f in findings) for s in order}
        print(f"-- {n['major']} major, {n['minor']} minor, {n['info']} info in {len(files)} file(s)")
    return 1 if any(f["severity"] == "major" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
