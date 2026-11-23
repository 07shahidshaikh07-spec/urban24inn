# Urban 24 Inn

Website for **Urban 24 Inn** at Yashraj Arcade, Ausa Road, Latur: a Maharashtrian veg and non-veg restaurant on the ground floor, rooms, a banquet hall and, coming soon, a rooftop bar. One brand, one building. English and Marathi, mobile-first, static.

- Brief: [docs/00-brief.md](docs/00-brief.md)
- Research and open questions: [docs/01-discovery-report.md](docs/01-discovery-report.md) (written before the rebrand, when the restaurant traded as Dalchini)
- Design system and motion: [docs/02-design-notes.md](docs/02-design-notes.md)
- What the owner still needs to send: [docs/needs-from-owner.md](docs/needs-from-owner.md)
- QA screenshots: [docs/qa/](docs/qa/)

## Status

This is a **preview build**. The owner has not yet confirmed several facts: the phone and WhatsApp numbers, restaurant hours, dine-in prices, thali contents, check-out time, room details and the banquet hall's details. The site handles this with two builds:

| Command | What you get |
|---|---|
| `npm run build:draft` | Preview. Unconfirmed facts are shown as ordinary text, with no marks, and the pages are `noindex`. An owner checklist at `/checklist/` (not linked from the site) lists every open fact and its source. |
| `npm run build` | Production. Every unconfirmed fact is removed automatically, as the brief requires. Nothing invented ever reaches the live site. |

What production looks like until the numbers are confirmed:

- **No Call or WhatsApp buttons.**
- **No enquiry forms.** The table and banquet sections show the address and a directions button instead.
- **Booking still works:** the Stayflexi link is confirmed.

Defaults used until the owner decides otherwise:

- **Language:** English by default, with a full Marathi version under `/mr/`.
- **Reviews:** the Google rating with a link only, no quoted reviews.
- **Booking:** "Book" opens the hotel's Stayflexi booking page; the booking bar fills in the chosen dates and guests. The site shows no room prices.
- **Rooftop bar:** a "coming soon" section on the home page, no page yet.

## Why Astro

Astro builds plain HTML pages and sends no JavaScript unless a page asks for it. That suits a 4G-first local site, where speed and search visibility matter more than app-like features.

- **Images:** its image pipeline turns the photos into responsive AVIF and WebP at build time.
- **Page transitions:** its client router allows custom transitions between pages without a framework.
- **Hosting:** the output is static files, so it deploys to Netlify, Vercel or Cloudflare Pages with no server.
- **Motion:** GSAP (free for commercial use since 2025, including ScrollTrigger, SplitText and Flip) plus Lenis smooth scrolling. Each page loads only its own motion code.

## Run it

Requires Node 22 or newer.

```bash
npm install
npm run dev            # http://localhost:4321, draft mode (to-confirm marks visible)
npm run build:draft    # preview build into dist/
npm run build          # production build into dist/ (unconfirmed facts stripped)
npm run preview        # serve dist/
npm run check:links    # every internal link, anchor and asset in dist/ must exist
npm run check:photos   # no photo may appear twice on the same page
npm test               # content integrity, live-site wording and WhatsApp message tests
```

QA helpers (use the installed Chrome):

```bash
node scripts/serve-dist.mjs dist 4500                                  # serve with Brotli/gzip like a real host
npx lighthouse http://localhost:4500/ --form-factor=mobile --view      # mobile Lighthouse
node scripts/qa-screens.mjs http://localhost:4500 qa-out               # screenshots at 360/390/768/1280
node scripts/qa-screens.mjs http://localhost:4500 qa-out --reduced-motion
```

## Editing content (for the owner or whoever maintains the site)

All facts live in four JSON files in `src/content/`. You don't need to touch any code.

| File | What's in it |
|---|---|
| `site.json` | Brand name, address, map links, phone and WhatsApp numbers, Instagram, booking link, Google ratings, FSSAI number, the four services |
| `rooms.json` | Check-in and check-out, rooms, meal plans, amenities, landmarks, FAQ |
| `restaurant.json` | Hours, typical spend, parking, "what to order", thali contents, the full menu |
| `banquet.json` | Occasions, hall details (capacity, floor, AC, catering), parking |

Rules:

1. **Text in two languages** looks like `{ "en": "Mutton thali", "mr": "मटण थाळी" }`. Change both.
2. **Facts carry a flag**: `"confirmed": true` shows on the live site; `"confirmed": false` shows only on the preview, with a dashed mark. When the owner confirms something, correct the value and set `"confirmed": true`.
3. **Menu prices** are in rupees, as plain numbers: `"price": 430`. The whole price list goes live when `menu.prices.confirmed` is `true`, so update every price from the menu card first. The current numbers are Swiggy delivery prices.
4. **Add a dish:** copy a line inside the right category, for example `{ "en": "Chicken Sukka", "mr": "चिकन सुक्का", "veg": false, "price": 360 }`.
5. **Hours:** one line per day, either `{ "day": "mon", "closed": true }` or `{ "day": "tue", "open": "12:00", "close": "23:00" }` (24-hour times).
6. **Phone numbers:** `value` is what the phone dials (`+919423027178`); `display` is what people read (`094230 27178`). WhatsApp numbers are digits only, with country code (`918390605555`).
7. **The rooftop bar:** `services.unwind.status` in `site.json` is `"coming-soon"`. When it opens, its details and a page need adding; ask the developer.
8. **New photo:**
   - Put the file in `src/assets/photos/`.
   - Add it to `src/lib/photos.ts` with alt text in both languages, describing what a person would see.
   - Use its id in a room's `photos` list or in a page.

After editing, run `npm run build:draft` and open `/checklist/` to see what's still unconfirmed.

Interface wording (buttons, headings) lives in `src/i18n/ui.ts`. **The Marathi was drafted for this build and needs a native reader's proofread before launch.**

The logo files are in `src/assets/brand/`: a cut-out of the supplied JPG, in a light version (cream lettering, for dark backgrounds) and a dark version, each as the full logo, the lockup and the mark alone. Replace them with exports from the vector logo when the owner sends it.

## Deploy

1. Set the real domain: `SITE_URL=https://www.your-domain.in`. Canonical URLs, hreflang, Open Graph images and the sitemap all use it. **Until it's set, they point at `https://www.example.com`.**
2. Netlify or Cloudflare Pages: build command `npm run build`, output directory `dist`, add the `SITE_URL` environment variable. `public/_headers` sets long-term caching for hashed assets.
3. Vercel: framework preset Astro, same build command and environment variable.
4. Add the new website to the Google Business Profiles. The restaurant's profile is still named "Dalchini Restaurant"; rename it once the new sign is up. The hotel's profile has no phone number or website yet.

## What's built

| Page | URL | Highlights |
|---|---|---|
| Home | `/`, `/mr/` | **Intro:** the logo rises, a gold shine crosses it, the four verbs appear, then espresso doors part (first visit per session). **Hero:** "One Address" with a typed second line: "To Dine." is deleted back to "To " and "Stay." types in, then "Celebrate." and "Unwind.", with a blinking gold caret. It sits on a solid panel beside the building in a gold arch with a turning badge. **Below:** four doors in the client's order (Restaurant, Rooms, Banquet hall, Rooftop bar); a statement that fills in word by word as you scroll; 01 Dine, 02 Stay, 03 Celebrate and 04 Unwind chapters with gold-curtain photo reveals; a scroll-reactive marquee; map and contact. |
| Restaurant | `/restaurant/`, `/mr/restaurant/` | **Hero:** the title beside the dining-room photo. **Dishes:** "What to order", with names sliding in on scroll. **Menu:** 120+ dishes with veg/non-veg marks, section tabs and an animated filter. **Also:** an illustrated thali whose bowls drop in (preview only until the thali contents are confirmed), a table request over WhatsApp (preview only until the number is confirmed) and the Google rating. |
| Rooms | `/rooms/`, `/mr/rooms/` | **Hero:** the title beside a framed room photo, with the booking bar. **Rooms:** galleries you can swipe or drag. **Plans:** meal plans as lift buttons. **Times:** check-in and check-out clocks whose hands sweep round. **Also:** amenities, bathrooms, FAQ accordions. |
| Banquet hall | `/banquet/`, `/mr/banquet/` | **Hero:** a toran, falling marigold petals, and a hall photo in a gold arch. The photo is a placeholder from Unsplash, captioned "Representative image", until the client sends photos of the hall. **Also:** the occasions, why the building suits family functions, hall details and a WhatsApp enquiry form (both preview only until confirmed). |

Between pages, two espresso doors close on a gold seam with the logo mark while the next page downloads; a language change draws a gold line instead. The phone menu opens with the same doors. Motion respects `prefers-reduced-motion`: every animation, the intro, the doors and smooth scrolling switch off, and all content stays visible.

## QA (23 Nov 2026)

Lighthouse 12, mobile (simulated slow 4G and 4× CPU slowdown), production build served with compression. One run per page, after the redesign:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 1.6 s | 0 |
| `/restaurant/` | 89 | 100 | 100 | 100 | 1.6 s | 0.001 |
| `/rooms/` | 95 | 100 | 100 | 100 | 2.5 s | 0 |
| `/banquet/` | 90 | 100 | 100 | 100 | 3.0 s | 0 |

- **Run-to-run variance:** on the test machine, single runs swing by up to 20 points while OneDrive syncs the project folder and other apps are busy. The same pages scored 91–100 in other runs today. What varies is blocking time; load times (LCP) stay at 1.6–3.0 s.
- **Marathi pages** were not re-measured. They load three Devanagari fonts (about 300 KB), which can push performance below 90; the client chose not to prioritise this.

Other checks:

- **Links:** no broken internal links or anchors in either build (958 in the preview, 917 in production).
- **Photos:** `npm run check:photos` passes; no photo appears twice on a page.
- **Tests:** 12 pass: content integrity, the live site's fallback wording, and the WhatsApp message builder.
- **Phones:** no page scrolls sideways at 360 or 390 px.
- **Screenshots:** every page at 360, 390, 768 and 1280 px, in [docs/qa/](docs/qa/).

**Not checked:**

- Real phones and Safari: only Chrome was tested.
- Screen readers: only Lighthouse's automated accessibility audit has run.
- A proofread of the Marathi copy.

## Licences and credits

- **Fonts:** Marcellus, Mukta and Tiro Devanagari Marathi, all under the SIL Open Font License and self-hosted via Fontsource.
- **Code libraries:** GSAP under its standard no-charge licence; Lenis under MIT.
- **Photos:** Urban 24 Inn's own photo set (from its booking page, used with the client's approval) and the client's façade photo.
- **Placeholders (Unsplash License, not the client's own spaces):** the banquet hall photo by Omar Rodriguez (unsplash.com/photos/XYuNwlYtfLI) and the rooftop lounge photo by Brands&People (unsplash.com/photos/en-u6xqnbsg). Both are captioned "Representative image" on the site. Replace `src/assets/photos/banquet-placeholder.jpg` and `rooftop-placeholder.jpg` when the client's photos arrive.
- **Footer credit:** "Created by Boostimize", linking to instagram.com/boostimize.media.
- **Logo:** supplied by the client.
