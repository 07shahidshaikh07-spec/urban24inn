# Needs from the owner

Everything in "Facts to confirm" blocks a fact from going live. The preview shows these items as ordinary text, with no marks, and `/checklist/` on the preview lists each one with its source. The production build leaves them out until they are marked confirmed.

## Facts to confirm

- [ ] **Phone number.** One number for the whole brand: 094230 27178 (on Google and Facebook for the restaurant) or +91 83906 05555 (on the Instagram posters)? The hotel has no public number yet. Until this is confirmed, the live site has no Call button.
- [ ] **WhatsApp number.** Which number takes WhatsApp? The table, room and banquet enquiry forms all open WhatsApp, so they stay off the live site until this is confirmed.
- [ ] **Restaurant hours.** Google says Tuesday to Sunday, 12 noon to 11 PM, closed Mondays; Instagram and Facebook suggest daily. What is the last-order time?
- [ ] **What "24" means.** Is it a 24-hour front desk, 24-hour check-in, or 24-hour stays? Agoda lists a 24-hour desk but also says reception closes at 11:59 PM. This decides whether the site can promise it.
- [ ] **Check-out time.** The booking engine says 10 AM; Agoda says 11 AM.
- [ ] **Rooms.**
  - How many rooms of each type? Booking sites say 18 in total.
  - Bed type, size and in-room amenities for the Deluxe Premium and Luxury rooms.
  - Lift, daily housekeeping, laundry, TVs, work desks, airport transfer: each is listed only by Agoda.
- [ ] **Hotel policies.**
  - ID requirements, including local ID and couples policy.
  - Children and cancellation.
  - Pets: Agoda says pets are allowed; confirm or correct.
  - Smoking, early check-in and late check-out.
- [ ] **Accessibility.** Is there step-free entry or a ramp, and a lift to the rooms?
- [ ] **PIN code.** 413531 (Google, Swiggy) or 413512 (Agoda)? Which landmark do locals use?
- [ ] **Distances** to the railway station, the bus stand and Ganj Golai.
- [ ] **FSSAI licence number** 21525049004900: is it still valid after the rename, and OK to show in the footer?
- [ ] **Typical spend per person** at the restaurant (Google's figure is from 17 people).
- [ ] **The Zomato listing at Shop 12, Ramgir Nagar**, under the old Dalchini name: an old address, or a different business?
- [ ] **Booking.com:** the listing looks inactive. Is that intended?

## Content to send

- [ ] **The dine-in menu card**, photographed or as a PDF, with prices. The site's prices are the restaurant's Swiggy delivery prices until then, and they show only on the preview.
- [ ] **What comes on each thali.** The site's list comes from guest reviews. Is there a veg thali, or an unlimited thali?
- [ ] **Banquet hall:** capacity (seated and standing), floor, AC, catering (veg and non-veg from the restaurant's kitchen?) and parking.
- [ ] **Photos of the banquet hall.** The Banquet page currently shows a free internet photo of another hall, captioned "Representative image". Send 3–5 photos of the real hall, ideally set up for an event, to replace it.
- [ ] **Rooftop bar:** nothing is published beyond "coming soon". When it opens, send its name (if different), opening date, hours and photos. The home page shows a free internet photo of another rooftop lounge, captioned "Representative image", until then.

## Assets

- [ ] **The logo as a vector file** (SVG, PDF or AI). The site uses a cut-out made from the JPG you sent, which is fine on screens but soft if printed large.
- [ ] **New photos after the rebrand.** The dining-room photo still shows the brass दालचिनी letters, and the building photos show the old Dalchini fascia sign. Reshoot the façade and dining room once the new Urban 24 Inn signage is up.
- [ ] **Original files** from the professional shoot: façade, interiors, rooms and bathrooms. The site uses the web-size copies from the booking page.
- [ ] **Food photography.** There is none yet. A short shoot of the thalis, rassa, solkadi and bhakri would let the restaurant page lead with food.

## Decisions

- [ ] **Domain name**, and who owns it (for example urban24inn.com or .in). Then set `SITE_URL` (see the README).
- [ ] **Hosting:** Netlify, Vercel or Cloudflare Pages.
- [ ] **Instagram:** the handle is still @dalchinilatur. Rename it, or start an Urban 24 Inn account? The site links to whichever you choose.
- [ ] **Marathi copy:** a native reader to proofread `src/i18n/ui.ts` and the Marathi fields in `src/content/`.
- [ ] **Reviews:** keep the rating and link only, or add 2–3 short, attributed excerpts?
- [ ] **Who updates the menu and hours** after launch.

## After launch

- [ ] **Google Business Profiles.** The restaurant's profile is still named "Dalchini Restaurant"; the site says so next to its rating. Rename it once the new sign is up, because Google expects the name to match the signage. Add the website, phone and hours to both the restaurant and hotel profiles.
- [ ] Make Swiggy, Zomato, Justdial and Facebook match the new name and the site.
