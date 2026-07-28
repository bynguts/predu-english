# Design Specification - Mobile Responsive View for PreE-du English
**Date:** 2026-07-28  
**Status:** Approved by user  

## 1. Overview
The goal is to implement a complete, robust, and clean mobile responsive view for the interactive English teaching modules on screen widths ≤ 768px. The desktop/laptop view (used by class facilitators with projectors) must remain completely untouched.

## 2. Layout & Stacking (Grid Structure)
- Desktop has a 2-column sidebar layout (`300px minmax(0, 1fr)`).
- On mobile (≤ 768px), `.lesson-shell` changes to a 1-column grid layout.
- Use `display: contents` on `.lesson-coach-panel` to unwrap its children into the main `.lesson-shell` grid parent.
- Re-order the elements vertically using CSS `order` properties:
  - `.lesson-coach-card` (Mimo Coach): `order: 1` (Top)
  - `.lesson-stage-panel` (Main Content / Games): `order: 2` (Middle)
  - `.lesson-module-note` (Module Description Info): `order: 3` (Bottom)

## 3. Compact Horizontal Mimo Coach Card
- On mobile, Mimo (the cat) and the speech bubble are arranged side-by-side (horizontal row layout) instead of vertically stacked.
- `.lesson-coach-heading` (small title label) is hidden to save vertical space.
- Scale down the mascot SVG to `74px` width and `81px` height.
- Set the speech bubble to `position: relative`, full height/width, and reset absolute top/left translations.
- Hide the default downward-pointing arrow. Add a left-pointing arrow pointing from the speech bubble to Mimo's head.

## 4. Responsive Grid & Sizing Adjustments for Games
- **Alphabet Grid:** Display in 2 columns (instead of fluid width grid), remove hardcoded `332px` min-height, and scale down emoji size.
- **Vowel Grid:** Convert from 5 columns to 2 columns (with centered odd element) to prevent horizontal overflow.
- **Word Builder:** Shrink puzzle slot cards and letter buttons from `64px` (`w-16 h-16`) to `44px` (`w-11 h-11`) to fit mobile layouts. Scale down the central hint emoji from `8xl` to `4xl`.
- **Sentence Builder:** Reduce word chip padding and font size for better wrapping.
- **Quiz Options:** Change 2-column choices into a 1-column stack on screen sizes ≤ 560px for easier tapping.
- **Page Container:** Reduce general page margins (`.lesson-page`) to maximize usable game space.
