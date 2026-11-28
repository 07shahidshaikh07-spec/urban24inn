# Design notes

## The idea: one brand, four verbs

Everything in the building now trades as **Urban 24 Inn**: rooms, the restaurant, the banquet hall and, soon, a rooftop bar. The site is built around four verbs, one for each service. The client's order is restaurant, rooms, banquet hall, rooftop bar, and every list on the site follows it (header, doors, chapters, footer). The verbs appear in the intro, the hero headline and the badge:

| Verb | Marathi | Service | Page |
|---|---|---|---|
| Dine | जेवा | Restaurant, ground floor | `/restaurant/` |
| Stay | राहा | Rooms (the lodge) | `/rooms/` |
| Celebrate | साजरा करा | Banquet hall | `/banquet/` |
| Unwind | निवांत व्हा | Rooftop bar, **coming soon** | A section on the home page (`/#rooftop`), not a page yet |

The home page wears the logo's own colours. Each inner page keeps the logo's espresso and gold for its frame (header, footer, buttons, transitions) and adds one accent that suits the service. That way every page reads as the same brand but has its own mood.

## Palette

Taken from the client's new logo (November 2026): olive green lettering `#384806`, a saffron leaf sprig `#E8A818` and a cream ground `#FCF8ED`. Deep olive is the dark colour, saffron the metallic accent, cream the light surface. (The CSS token names `--esp-*` and `--gold-*` date from the earlier espresso-and-gold theme; their values are now olive and saffron.) Every text pairing passes WCAG AA:

| Token | Hex | Role | Contrast |
|---|---|---|---|
| esp-950 / esp-900 | `#141A07` / `#1C240A` | Dark olive surfaces, headings on cream | Cream on esp-900: **15.2:1** |
| esp-700 | `#2C3810` | Body text on cream | **11.8:1** |
| gold-400 | `#EAA91C` | Saffron accents and buttons on olive | On esp-900: **7.8:1** |
| gold-700 | `#875B05` | Saffron for text on cream (eyebrows, icons) | **5.6:1** |
| muted (light) | `#596040` | Secondary text on cream | **6.2:1** |
| muted (dark) | `#CDD2B4` | Secondary text on olive | **10.3:1** |
| cream-100 | `#FCF8ED` | Light surfaces (the logo's own ground) | — |
| `--metal` | `#875B05 → #EAA91C → #FDF0CF → #D4920F` | Saffron buttons, seams, progress line | Olive text on it: **6.1:1** at the darkest stop |

Accents kept per page: cinnamon `#A4532B` (restaurant), marigold `#E8962E` (banquet toran and petals) and night `#0D0F14` (rooftop).

Logo files in `src/assets/brand/` are cut from `logo-source-2026-11.jpg`: dark lettering for bright backgrounds, cream lettering for dark ones, with and without "The Family Restaurant", and the leaf sprig alone as the mark (also used for the favicons).

## Photos

- **Text never sits on a photo.** Every hero puts its words on a solid espresso panel, with the photo framed beside it (below it on phones): an arch on the home page, a rounded frame on the inner pages.
- **One photo per point.** Each photo illustrates one thing, and no photo appears twice on a page. `npm run check:photos` fails if one does.

| Point | Photo |
|---|---|
| The building (home hero) | `building-portrait` |
| Stay (home) / Rooms page hero | `luxury-3` / `luxury-1` |
| Deluxe Premium Room | `deluxe-premium-1`, `deluxe-premium-2` |
| Luxury Room | `luxury-1` to `luxury-4` (the Rooms page gallery leaves out the hero photo) |
| Bathrooms | `bath-1`, `bath-2` |
| Restaurant | `dalchini-dining`, the only interior photo |
| Banquet hall (Banquet page) | `banquet-placeholder`, a free Unsplash photo, captioned "Representative image" |
| Rooftop bar (home, 04 Unwind) | `rooftop-placeholder`, a free Unsplash photo, captioned "Representative image" |
| Find us (map placeholder) | `facade-front` |

- **No stand-in photos.** There are no photos of the food or the rooftop yet, so those points use illustrations: the illustrated thali and the night sky. The home page's Celebrate chapter uses the marigold toran.
- **Two exceptions, at the client's request:** the Banquet page hero and the home page's rooftop chapter show free Unsplash photos until the client has photos of their own hall and terrace. Both are captioned "Representative image" so no guest mistakes them for the venue.

## Type

| Face | Role | Why |
|---|---|---|
| **Marcellus** | Display type in English | A flared, inscriptional roman. Its calm capitals sit well next to the logo's lettering and read as hospitality, not as a tech brand. |
| **Mukta** (400 / 600) | Body text in both scripts, buttons, labels | Ek Type's humanist sans, designed in India for English and Devanagari on small screens. |
| **Tiro Devanagari Marathi** | All Marathi display type | Drawn for Marathi spelling conventions, so headings read as Marathi rather than Hindi. |

All three are self-hosted through Fontsource under the SIL Open Font License.

**House style:** every word in a heading starts with a capital letter (CSS `text-transform: capitalize` on headings), as the client asked. Marathi has no capitals, so it is unaffected.

Devanagari gets more line-height (body 1.78, display 1.3). Letter-splitting animations are never applied to Marathi, because they would break conjuncts and vowel signs; Marathi headlines rise line by line instead.

## Motion

The client asked for heavy motion, so the site has plenty. Each piece has a job, though, and none of it hides content from search engines or screen readers.

| Moment | What it does | Trigger |
|---|---|---|
| Intro (home, first visit per session) | The logo rises out of a mask, a gold shine crosses it, the four verbs appear, then two espresso doors part onto the page | Page load, pure CSS, about 2.5 s |
| Page transitions | The doors close on a gold seam with the logo mark while the next page downloads, then open on the new page. A language change draws a gold line instead. | Navigation |
| Phone menu | The same doors slide shut, then the links rise in | Burger button |
| Home hero | "One Address" on a solid espresso panel, with a typed gold second line. "To Dine." holds, the verb is deleted back to "To ", and the next one types in ("Stay.", "Celebrate.", "Unwind."), with a blinking caret. Only one phrase is ever on the line, so nothing can overlap. Marathi is typed whole letter-clusters at a time. The building photo sits in a gold-outlined arch beside it, with a slowly turning badge. | Time, scroll |
| Booking bar | Overlaps the hero. Dates and a guest stepper open the hotel's Stayflexi booking page with the stay filled in. | Form |
| Four doors | Stay, Dine, Celebrate and Unwind under the hero; espresso fills each door from below on hover, the icon tilts and a gold line draws along the bottom | Load, hover, focus |
| Statement | "Check in upstairs, eat downstairs…" fills in word by word, from faint to full, as it scrolls up the screen | Scroll (scrubbed) |
| Leaving the hero | The words lift and fade while the arch eases back | Scroll (scrubbed) |
| Chapter numbers | A gold ring draws itself around 01 to 04 | Scroll |
| Headlines | Words or lines rise out of a mask | Scroll |
| Marquee | The brand line speeds up, reverses and leans with scroll speed | Scroll |
| Room cards | 3D tilt following the mouse | Mouse only |
| Photos | A gold curtain sweeps off each photo while it settles from a zoom, then the photo drifts gently inside its frame | Scroll |
| Gold buttons | A band of light crosses the button on hover | Mouse |
| Room galleries | Swipe on phones, drag with a mouse, arrows, progress line | Touch, drag, click |
| Banquet | A marigold-and-leaf toran sways, petals fall, an arch frame draws itself | Load, CSS |
| Rooftop teaser | A seeded night sky twinkles behind "coming soon" | CSS |
| Rooms page | Check-in and check-out clock hands sweep to the times; meal plans as lift buttons | Scroll, click |
| Restaurant page | "What to order" names slide in from alternate sides; menu tabs and a veg/non-veg filter with a FLIP reflow | Scroll, click |
| Cursor and buttons | A gold ring cursor with labels; magnetic primary buttons | Mouse only |
| Scroll | Lenis smooth scrolling (mouse and trackpad only; phones keep native scrolling) and a gold progress line along the top of the screen | Scroll |

Performance rules:

- Hero entrances are CSS and use transforms only. They start at first paint, so they never delay the largest paint.
- Page scripts load on demand; GSAP and Lenis are the only libraries.
- The verb cycle and marquee pause when off screen. The petals, toran and stars are CSS transform and opacity animations, which the browser runs off the main thread.
- Expensive paint effects are avoided above the fold. For example, the banquet title's glow is a background gradient, not a large blurred text-shadow.
- The last section of each page (Visit) renders only when it nears the screen.

**Reduced motion:** with `prefers-reduced-motion`, every animation and transition switches off: the intro, doors, smooth scrolling, the verb cycle, marquee, petals and reveals. All content stays visible.

## Voice

Plain, specific and local, with no superlatives. A 3.6 rating makes "best in Latur" backfire. Examples from the site:

- "Stay. Dine. Celebrate. Unwind." / "राहा. जेवा. साजरा करा. निवांत व्हा."
- "This opens WhatsApp with your request filled in. Nothing is sent until you tap send."
- "Rooftop bar, coming soon."

## Decisions made without the owner (change any of them in the content files)

- The rooftop bar is a "coming soon" section on the home page, with no page, hours or menu until it opens.
- English is the default language; Marathi lives under `/mr/`.
- Reviews: the Google rating and a link only, no quoted reviews. The restaurant's Google listing is still named "Dalchini Restaurant", so the site says so next to the rating.
- "Book" goes to the hotel's Stayflexi engine, and the site shows no room prices.
- Room names follow the hotel's own booking engine (Deluxe Premium, Luxury).
- The banquet hall has its own page and an enquiry form that opens WhatsApp.
