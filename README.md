# SVG Avatar Builder

An SVG-based avatar builder with selectable parts, color palettes, and a compact configuration string you can save and reuse.

This README explains where to add and update values, how to extend the editor with new options, and how to run the project.

## Run
- `npm start` – start dev server at http://localhost:3000
- `npm run build` – production build into `build/`

## Key Files (where to edit)
- `src/components/AvatarBuilder.tsx` – Main editor UI: tabs, lists, and save button.
- `src/components/Avatar.tsx` – Renders SVG layers based on configuration; applies recoloring.
- `src/lib/avatar.ts` – `AvatarConfig` type and helpers: `buildAvatarString`, `parseAvatarString` (string format lives here).
- `src/lib/assetContexts.ts` – Centralized Webpack `require.context` for loading SVG assets by folder/name pattern.
- `src/styles/palette.ts` – Default color palettes for skin/clothing/hair/background.
- `src/styles/theme.css` – Theme variables (colors, radii, shadows, spacing) and utility classes for reuse.
- `src/components/ColumnPager.tsx` + `ColumnPager.css` – Horizontal column scroller with dots (one dot per 6 items; hidden if only one).
- `src/components/HorizontalScroller.tsx` – Simple horizontal scroller (no dots).
- `src/components/common/{Tile,Swatch,Tabs}.tsx` (+ CSS) – Reusable UI components.

## Update Existing Values

1) Palettes (colors)
- File: `src/styles/palette.ts`
- Edit arrays: `SKIN_COLORS`, `CLOTH_COLORS`, `HAIR_COLORS`, `BG_COLORS`.
- New values appear automatically in the UI wherever used.

2) Theme variables and utilities
- File: `src/styles/theme.css`
- Tweak global CSS variables (`--panel`, `--ink`, `--primary`, `--muted`, etc.), spacing (`--space`), radii (`--r-md`), and shadows (`--shadow`).
- Utility classes available for reuse: `.u-shadow-1/.u-shadow-2`, `.u-r-md`, `.u-gap`, `.u-bg-panel`, `.u-primary`, etc.

3) Scroller behavior and dots
- File: `src/components/ColumnPager.tsx`
- Visible columns per page: prop `columnsVisible` (default 3 → 6 tiles).
- Dots: one per visible window; dots hidden when there is only one.

## Add More Avatar Editing Options

Two common paths:

A. Add items to existing categories (Face/Hair/Clothing/Details)
- Drop new SVGs under `src/Assets` in the relevant folder, following existing naming patterns.
- Loading is handled via `src/lib/assetContexts.ts` using Webpack regexes. Keep names consistent so they are auto‑discovered:
  - Face: `Assets/2_Face/Face_{n}.svg` (e.g. `Face_9.svg`).
  - Hair 0/1: `Assets/1_Hair_0/Hair_{NNN}_0.svg`, `Assets/14_Hair_1/Hair_{NNN}_1.svg` (3‑digit IDs, e.g. `Hair_003_0.svg`).
  - Clothing 0/1: `Assets/4_Clothing_0/Clothing_{n}_0.svg`, `Assets/9_Clothing_1/Clothing_{n}_1.svg`.
  - FaceTexture/Center/Right/Left/Glasses: per the regex in `assetContexts.ts`.
- `AvatarBuilder.tsx` extracts numeric IDs with `extractNumbers(...)`. Any correctly named file appears automatically in the UI.

B. Add a new category (e.g., Eyes/Nose/Mouth)
1. Assets
   - Create a folder under `src/Assets` and follow a predictable naming pattern (e.g. `Eyes_{n}.svg`).
2. Loading (Webpack context)
   - Add a new export in `src/lib/assetContexts.ts`, e.g.:
     `export const eyesCtx = require.context('../Assets/10_Eyes', false, /\.\/Eyes_\d+\.svg$/);`
3. Rendering (layer)
   - In `src/components/Avatar.tsx`, add a `getEyesUrl` helper if needed and include the layer in the `layers` stack at the correct order.
   - If recoloring is needed, add a color replacement in `useColorized` similar to hair/body/skin.
4. UI (picker)
   - In `src/components/AvatarBuilder.tsx`, build an options list and render `Tile`s inside a `ColumnPager` section.
   - Use `setNumeric`/`toggleNumeric` to update the new value in `AvatarConfig`.
5. Save string
   - Ensure the new field appears in `buildAvatarString` and is parsed in `parseAvatarString` (both in `src/lib/avatar.ts`).

## Save String Order
`buildAvatarString` produces the following CSV:
`bgColor, bodyColor, skinColor, faceType, hairType, clothingType, faceTexture, centerClothing, rightClothing, leftClothing, eyes, nose, mouth, glasses`

The “Save Changes” button stores the value in `localStorage` and copies a ready‑to‑paste `AVATAR_STRING` snippet to the clipboard.

## Tips
- Adding new colors? Update both `palette.ts` and, if needed, theme variables in `theme.css` for contrast/shadows.
- Repeated spacing/radius/shadow? Prefer the utilities from `theme.css` over ad‑hoc CSS.
- Scrolling: tune wheel sensitivity/threshold in `ColumnPager.tsx` if needed.

