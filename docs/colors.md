# Master Color Palette

Recommended initial colors used in the Avatar Builder. These are also exported from `src/styles/palette.ts` for use in code, and a subset is mapped into CSS variables in `src/styles/theme.css`.

## Skin
- #f3d8c9
- #e8bda7 (base reference for face replacements)
- #d9a98e
- #c7906f
- #a66a47
- #7f4e2f

## Hair
- #694118 (base reference for hair replacements)
- #3c2415
- #a9744f
- #111111
- #6b8e23
- #9b59b6

## Clothing
- #c2272d (base reference for body replacements)
- #3366cc
- #22aa99
- #ff9900
- #8e44ad
- #2c3e50

## Background
- #ffffff
- #ff44dd
- #ffe680
- #d0f0c0
- #d9e8ff
- #f2f2f2

Notes:
- The base replacement hexes referenced in the SVG recolor logic are: `#e8bda7` (skin) and `#c2272d` (body/clothing), and `#694118` (hair).
- To extend or theme further, update `src/styles/palette.ts` and optionally wire to CSS variables in `src/styles/theme.css`.

