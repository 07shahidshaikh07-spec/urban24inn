# Project brief (as received, 22 Nov 2026)

Saved verbatim so every later phase can be checked against it.

---

ROLE
You are a senior brand-led web designer and front-end engineer. You are building a real website for two real, neighbouring businesses in India. This is a client deliverable, not a demo. It must look and feel like a studio-crafted site made for these specific businesses, not like generic AI output.

THE BUSINESSES
Both operate from one building (see the attached photo):
1. Dalchini (Marathi script: दालचिनी) is a restaurant on the ground floor. "Dalchini" means cinnamon.
2. Urban 24 Inn is a hotel on the floors above (its name suggests round-the-clock check-in; verify this).
Location: https://share.google/LxweWnezWeU72q72O
Several unrelated restaurants are also called "Dalchini" in India. Do NOT mix them up. Confirm you have the right one by matching the Google listing against the attached photo (the "Urban 24 Inn" signage and the Marathi Dalchini sign). The Marathi signage suggests Maharashtra; confirm the city and area.

PHASE 0: EXPLORE FIRST (do this before designing anything)
- Open the location link in a browser. Extract: exact name, address, phone, hours, rating, review count, categories, photos, menu photos, amenities, price level, and the website/social links if any.
- Read the real Google reviews. Note what guests actually praise (dishes, rooms, service, cleanliness, value, parking, family-friendliness). Use this to decide what the site emphasises.
- Check Instagram, Zomato, Swiggy, Booking.com, MakeMyTrip, Goibibo and Justdial for the menu, prices, room types, amenities and photos.
- Look at 3 to 5 competitors nearby (restaurants and hotels in the same city or area). Note what is generic about them so we can be better.
- Study the attached building photo as the brand source. Sample its real colours: wine/maroon, charcoal grey, glass-blue, warm gold lettering and lighting, white railings, the 3D triangular tile cladding. Note the warm timber interior, the rattan pendant lamps and the hanging greenery.
- Deliver a short Discovery Report: confirmed facts, what is missing, your reading of the audience (families, locals, business travellers, wedding guests, highway or transit travellers, etc.) and a list of questions for me. Stop and ask me if anything critical is unclear. Do not guess business facts.

BRAND AND THEME DIRECTION
- One site, two personalities, one family. They share the building's DNA (maroon, gold, charcoal) but each has its own mood.
- Dalchini: warm, rooted, appetite-driven. Think cinnamon brown, deep maroon, saffron or turmeric accents, cream paper textures, and Devanagari calligraphy as a design feature, not decoration. Food photography leads.
- Urban 24 Inn: modern, calm, trustworthy. Think charcoal, glass-blue, brushed brass, generous whitespace, crisp room photography, and a clear "always open" promise if it is true.
- The home page is a confident gateway: one entry point, two clear paths (Dine / Stay). Each section can have its own page and mood but must clearly belong to the same property.
- Bilingual: English plus Marathi (Devanagari), with a language toggle if I confirm it. Devanagari must be typeset properly, with a real Devanagari-capable font, correct line-height, and no tofu or fallback glyphs.

ANTI-SLOP RULES (strict)
- No purple or blue gradient hero, no glassmorphism cards, no default Inter/Roboto/Poppins-everything look, no "three icon cards in a row" template, no emoji used as icons, no generic stock-photo mosaics, no fake round-number stats, no lorem ipsum, no "Welcome to our website" or "Experience the finest..." copy.
- Pick a deliberate type pairing (a distinctive display face plus a readable text face plus a Devanagari face). Justify each choice in one line.
- Use real photography only: my photos, the Google listing photos I am allowed to use, or clearly marked placeholders. Do not insert random internet or stock images of food or rooms. Do not download photos of identifiable people.
- Copy must sound like a real local business: specific dishes, specific rooms, specific neighbourhood landmarks, plain warm language. Never invent facts, prices, awards, room counts, timings, phone numbers, reviews or testimonials. Anything unconfirmed goes in a TODO list in a content file, never into the live page.
- Motion should be restrained and purposeful (subtle reveals, image parallax, menu transitions) and must respect prefers-reduced-motion.

FUNCTIONAL REQUIREMENTS
- Mobile-first (most visitors will be on phones on 4G). Test at 360, 390, 768 and 1280 widths.
- Sticky, obvious actions: Call, WhatsApp, Directions (Google Maps), Book or Enquire.
- Restaurant: a real menu by category with prices in ₹ and veg/non-veg marks, signature dishes, opening hours, and table enquiry via WhatsApp or a form (no payment gateway).
- Hotel: room types with real amenities and photos, check-in and check-out details, a simple enquiry or availability request via WhatsApp or form, nearby landmarks and how to reach us, policies and FAQ.
- Gallery (building, interior, food, rooms), an embedded map with a clear address, and a Contact section.
- Reviews: show only genuine ones, quoted with attribution and a link to the Google listing. If I do not approve this, show just the rating and a link.
- Local SEO: semantic HTML, proper titles and meta descriptions, Open Graph images, JSON-LD for Restaurant, Hotel and LocalBusiness, a sitemap, and alt text written for people.
- Accessibility: WCAG AA contrast (check the gold on maroon carefully), keyboard navigation, visible focus states and proper headings.
- Performance: AVIF or WebP with responsive sizes, lazy loading, self-hosted fonts with subsetting, and a Lighthouse score of 90 or more on mobile for Performance, Accessibility, Best Practices and SEO.
- Content must be easy for the owner to edit (menu, prices, rooms, hours) via a simple JSON, markdown or CMS file, with a short how-to in the README.

TECH
Prefer a fast static site (for example Astro or Next.js static export) with minimal JavaScript and vanilla CSS or Tailwind. Keep it deployable to Vercel, Netlify or Cloudflare Pages. Explain your choice in one paragraph.

PROCESS
1. Phase 0: Discovery Report (above) plus questions. Wait for my answers.
2. Phase 1: a design direction, as a one-page brief with palette (with hex values sampled from the photo), type pairing, layout concept, tone-of-voice samples and 2 to 3 key screen concepts. Wait for my approval.
3. Phase 2: build the home page and both section pages. Show me early.
4. Phase 3: QA (screenshots at all breakpoints, Lighthouse, accessibility check, Devanagari rendering check, broken-link check, a fact-check of every number and name against its source).
5. Handover: the site, a "needs from owner" checklist (photos, menu, prices, logos, domain), and the README.

If anything is ambiguous, ask me. Do not fill gaps with invented content.
