// JSON-LD. Machine-readable data uses confirmed facts only, in every build.
import { site, restaurant, rooms } from './site';

const abs = (path: string, base: URL) => new URL(path, base).href;

function address() {
  const a = site.property.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: `${a.street.en}, ${a.road.en}`,
    addressLocality: a.city.en,
    addressRegion: a.region.en,
    addressCountry: 'IN',
    ...(a.postcode.confirmed ? { postalCode: a.postcode.value } : {}),
  };
}
const geo = () => ({ '@type': 'GeoCoordinates', latitude: site.property.geo.lat, longitude: site.property.geo.lng });
const phone = () => (site.contact.phone.confirmed ? { telephone: site.contact.phone.value } : {});
const brandId = (base: URL) => abs('/#urban-24-inn', base);

/** The brand: a hotel that also runs a restaurant and a banquet hall. */
export function hotelLd(base: URL, image?: string) {
  return {
    '@type': ['Hotel', 'LocalBusiness'],
    '@id': brandId(base),
    name: 'Urban 24 Inn',
    alternateName: 'अर्बन 24 इन',
    url: abs('/', base),
    ...(image ? { image } : {}),
    address: address(),
    geo: geo(),
    hasMap: site.links.hotelOnGoogle,
    sameAs: [site.links.instagram],
    ...phone(),
    ...(rooms.checkIn.confirmed ? { checkinTime: rooms.checkIn.value } : {}),
    ...(rooms.checkOut.confirmed ? { checkoutTime: rooms.checkOut.value } : {}),
    ...(rooms.roomCount.confirmed ? { numberOfRooms: rooms.roomCount.value } : {}),
    amenityFeature: rooms.amenities
      .filter((a) => a.confirmed)
      .map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.en, value: true })),
    potentialAction: { '@type': 'ReserveAction', target: site.links.booking },
    department: [{ '@id': abs('/restaurant/#restaurant', base) }, { '@id': abs('/banquet/#banquet', base) }],
  };
}

export function restaurantLd(base: URL, image?: string) {
  const ld: Record<string, unknown> = {
    '@type': 'Restaurant',
    '@id': abs('/restaurant/#restaurant', base),
    name: 'Urban 24 Inn Restaurant',
    url: abs('/restaurant/', base),
    ...(image ? { image } : {}),
    servesCuisine: ['Maharashtrian', 'North Indian', 'Chinese'],
    address: address(),
    geo: geo(),
    hasMap: site.links.restaurantOnGoogle,
    hasMenu: abs('/restaurant/#menu', base),
    parentOrganization: { '@id': brandId(base) },
    ...phone(),
  };
  if (restaurant.hours.confirmed) {
    const names: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
    ld.openingHoursSpecification = restaurant.hours.days
      .filter((d) => !d.closed)
      .map((d) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${names[d.day]}`, opens: d.open, closes: d.close }));
  }
  if (restaurant.priceRange.confirmed) ld.priceRange = '₹₹';
  return ld;
}

export function banquetLd(base: URL, image?: string) {
  return {
    '@type': 'EventVenue',
    '@id': abs('/banquet/#banquet', base),
    name: 'Urban 24 Inn Banquet Hall',
    url: abs('/banquet/', base),
    ...(image ? { image } : {}),
    address: address(),
    geo: geo(),
    parentOrganization: { '@id': brandId(base) },
    ...phone(),
  };
}

export const graph = (...nodes: Record<string, unknown>[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
