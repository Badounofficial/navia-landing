# Navia — Brand Identity Prompts

## Status: Cleaned up April 9, 2026 — only validated + standby items remain

---

## BRAND IDENTITY SYSTEM

### Strategy: Two logo assets
1. **Wordmark** = "navia" in typography → website, social, print, marketing
2. **Icon mark** = app icon → for app store, favicon, small uses

### Brand colors (VALIDATED):
- Dark navy (--nuit): `#2C2840`
- Violet decorative (--violet): `#7B6EF6`
- Violet text (--violet-dark): `#5347C4` ← accessible on light backgrounds
- Light violet (--violet-mid): `#AFA9EC`
- Lavender: `#EEEDFE`
- Background (--blanc): `#F3F2F7`

---

## ★ WORDMARK — "navia" with lavender dot + arc (VALIDATED + DEPLOYED)

### Status: V1 created in Canva ✓ — integrated in site as inline HTML/CSS/SVG ✓
- Wordmark "navia" in Cormorant Garamond, dark navy #2C2840
- Lavender dot #AFA9EC above the "i"
- Open lavender arc (270°) surrounding the word
- File: `logo-arc.png` (to be saved from Canva export)

### 🔧 REFINEMENT TODO (cosmetic — not blocking)
- [ ] Switch font weight from Regular/Medium to **Light** in Canva
- [ ] Re-export once adjusted

### Also create in Canva:
- **Version A (pure wordmark)**: same text, no arc → `logo.png` (for header, small uses)
- **Version B (with arc)**: current design → `logo-arc.png` (for hero, social, large formats)

**See CANVA-GUIDE.md for step-by-step instructions.**

### Reference prompt (for context — what we're going for):

```
The word "navia" written in an elegant thin serif typeface similar to Cormorant Garamond, all lowercase, in dark navy color #2C2840 on a pure white background. Light font weight, generous letter spacing. The dot above the letter "i" is slightly larger than normal and colored in soft lavender #AFA9EC instead of the dark navy, creating a subtle accent — like a small moon or a gentle presence watching over the word. Everything else is dark navy. No other decoration, no icon, no symbol, no tagline. The feeling is: refined, intentional, every detail matters. Ultra high resolution, 4K, vector-sharp. Horizontal format.
```

---

## ★ APP ICON — Two options to test in Nano Banana (STANDBY — for favicon/app icon phase)

### APP-1 — Gibbous moon (white on lavender)

Almost-full moon = unique, avoids crescent religious association.

```
Minimalist app icon design. A solid pale lavender #EEEDFE filled circle as the background. Inside it, a nearly-full gibbous moon shape in pure white, positioned slightly off-center to the left. The moon is about three-quarters full — a large white circle with a small, soft concave shadow or curve on the right edge in a slightly deeper lavender #D8D5F7, suggesting the shadow phase of the moon. The result is a luminous white moon glowing softly against the lavender sky. Ultra minimal, no craters, no face, no stars, no text. Flat design, no gradients, no 3D. Must be bold and clear at 32x32 pixels. Square format, centered, 4K resolution, pure white outer background.
```

### APP-2 — Stylized "n" (letter as app mark)

The lowercase "n" with its moon-like arch, inside a lavender circle.

```
Minimalist app icon design. A solid pale lavender #EEEDFE filled circle containing a single lowercase letter "n" in violet #7B6EF6. The "n" is in an elegant thin serif typeface with a gracefully exaggerated arch that evokes the curve of a moon. The letter is centered with generous padding inside the circle. Nothing else — no other text, no decoration, no extra shapes. Flat design, no gradients, no shadows. Must be readable and elegant at 32x32 pixels. Square format, centered, 4K resolution, pure white outer background.
```

---

## OG IMAGE (Social sharing preview — 1200x630)

```
Wide minimal banner design for a women's health app. Left-aligned: the word "navia" in an elegant thin serif font, lowercase, dark navy color #2C2840. Above the wordmark, a small abstract logo mark (violet circle with gentle arc). Right side: the phrase "You're never alone on this journey." in thin light gray sans-serif font. Background: very soft gradient from pure white #F9F8FF to pale lavender #EEEDFE, with two large subtle translucent floating circles in soft violet and pale pink #F4C0D1. No photographs, no people, no mockups, no devices. Ultra clean, luxurious, editorial aesthetic. Horizontal format exactly 1200x630 pixels. 4K quality.
```

---

## TIPS FOR NANO BANANA

1. **Run each prompt 3-4 times** — AI gives different results each time
2. **If you get text in the image**, add: `absolutely no text, no letters, no words, no typography anywhere`
3. **If colors are off**, add: `exact hex colors only: #7B6EF6 violet and #EEEDFE lavender`
4. **If too complex**, add: `extremely minimal, maximum 2 visual elements total`
5. **The #1 test**: shrink the result to 32x32 pixels — can you still tell what it is?
6. **For the OG image**, if text rendering is poor, generate just the background and add text in Canva
7. **Resolution**: Always request 4K or "highest resolution possible"
8. **After generating**, upscale if needed at upscale.media (free)

---

## FILE NAMES TO SAVE

After generating, save your chosen files as:
- `logo.png` — wordmark (horizontal, created in Canva)
- `logo-icon.png` — app icon (512x512 minimum)
- `og-image.png` — social preview (1200x630)
- `favicon.png` — same as logo-icon, will be resized
- `apple-touch-icon.png` — same as logo-icon at 180x180

Drop them in this Website/ folder and we'll integrate everything.

---

## DISCARDED DIRECTIONS (for reference)

- **Round 1 — Nurturing figure**: Too generic, resembles accessibility pictogram
- **Round 2 — Abstract marks (arc, bloom, companion dot, embrace loop)**: Explored but not distinctive enough
- **Round 3 — Crescent moon + dot**: Resembles Islamic crescent and star symbol. Branding risk for US market.
- **Round 4 — TYPO-1 pure wordmark (no dot)**: Good but missing the subtle touch that makes it special
