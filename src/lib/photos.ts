import type { ImageMetadata } from 'astro';
import type { L10n } from './site';

import facadeFront from '../assets/photos/facade-front.jpg';
import facadeSide from '../assets/photos/facade-side.jpg';
import buildingEvening from '../assets/photos/building-evening.webp';
import dalchiniDining from '../assets/photos/dalchini-dining.jpg';
import bath1 from '../assets/photos/bath-1.jpg';
import bath2 from '../assets/photos/bath-2.jpg';
import deluxe1 from '../assets/photos/deluxe-premium-1.jpg';
import deluxe2 from '../assets/photos/deluxe-premium-2.jpg';
import luxury1 from '../assets/photos/luxury-1.png';
import luxury2 from '../assets/photos/luxury-2.jpg';
import luxury3 from '../assets/photos/luxury-3.jpg';
import luxury4 from '../assets/photos/luxury-4.jpg';
import banquetPlaceholder from '../assets/photos/banquet-placeholder.jpg';
import rooftopPlaceholder from '../assets/photos/rooftop-placeholder.jpg';

export interface Photo { src: ImageMetadata; alt: L10n; credit: string; placeholder?: boolean }

const HOTEL = "Urban 24 Inn's booking page (owner's photos)";
const CLIENT = 'Photo supplied by the client';

export const photos = {
  'facade-front': {
    src: facadeFront,
    credit: HOTEL,
    alt: {
      en: 'Urban 24 Inn on a clear day: blue glass floors above the restaurant’s maroon fascia at Yashraj Arcade.',
      mr: 'स्वच्छ दिवशी अर्बन 24 इन: यशराज आर्केडमध्ये रेस्टॉरंटच्या लाल फलकावर निळ्या काचेचे मजले.',
    },
  },
  'facade-side': {
    src: facadeSide,
    credit: HOTEL,
    alt: {
      en: 'The building from the side, with rows of hotel windows above the restaurant.',
      mr: 'बाजूने दिसणारी इमारत — रेस्टॉरंटच्या वर हॉटेलच्या खिडक्यांच्या रांगा.',
    },
  },
  'building-portrait': {
    src: buildingEvening,
    credit: CLIENT,
    alt: {
      en: 'Urban 24 Inn from the front: blue glass floors above the maroon fascia, with the restaurant lit up on the ground floor.',
      mr: 'समोरून दिसणारी अर्बन 24 इन — लाल फलकावर निळ्या काचेचे मजले आणि तळमजल्यावर उजळलेलं रेस्टॉरंट.',
    },
  },
  'dalchini-dining': {
    src: dalchiniDining,
    credit: HOTEL,
    alt: {
      en: 'The restaurant’s dining room: plants and brass lettering on a timber shelf, green dining chairs beyond.',
      mr: 'रेस्टॉरंटचं दालन: लाकडी शेल्फवर झाडं आणि पितळी अक्षरं, पलीकडे हिरव्या खुर्च्या.',
    },
  },
  'bath-1': {
    src: bath1,
    credit: HOTEL,
    alt: {
      en: 'A bathroom with grey stone-look walls, a black granite counter and a wall-mounted shower.',
      mr: 'राखाडी दगडासारख्या भिंती, काळा ग्रॅनाइट काउंटर आणि शॉवर असलेलं बाथरूम.',
    },
  },
  'bath-2': {
    src: bath2,
    credit: HOTEL,
    alt: {
      en: 'A bathroom with an overhead shower, a mirror and a granite vanity under a timber ceiling.',
      mr: 'वरून पडणारा शॉवर, आरसा आणि लाकडी छताखाली ग्रॅनाइट वॉशबेसिन असलेलं बाथरूम.',
    },
  },
  'deluxe-premium-1': {
    src: deluxe1,
    credit: HOTEL,
    alt: {
      en: 'Deluxe Premium Room: a large bed with navy cushions under a window, timber panels and wall lamps.',
      mr: 'डिलक्स प्रीमियम रूम: खिडकीखाली निळ्या उशांचा मोठा बेड, लाकडी पॅनेल आणि भिंतीवरचे दिवे.',
    },
  },
  'deluxe-premium-2': {
    src: deluxe2,
    credit: HOTEL,
    alt: {
      en: 'Deluxe Premium Room seen from the door: the bed, a tall timber-framed mirror and the air conditioner.',
      mr: 'दारातून दिसणारी डिलक्स प्रीमियम रूम: बेड, लाकडी चौकटीचा उंच आरसा आणि एसी.',
    },
  },
  'luxury-1': {
    src: luxury1,
    credit: HOTEL,
    alt: {
      en: 'Luxury Room: the bed with a navy throw, framed art above it and a full-length mirror.',
      mr: 'लक्झरी रूम: निळ्या चादरीचा बेड, वर फ्रेम केलेलं चित्र आणि पूर्ण उंचीचा आरसा.',
    },
  },
  'luxury-2': {
    src: luxury2,
    credit: HOTEL,
    alt: {
      en: 'Luxury Room: a TV on a timber wall above a long white desk, next to the room door.',
      mr: 'लक्झरी रूम: खोलीच्या दाराजवळ, लांब पांढऱ्या डेस्कवर लाकडी भिंतीवर टीव्ही.',
    },
  },
  'luxury-3': {
    src: luxury3,
    credit: HOTEL,
    alt: {
      en: 'Luxury Room: the bed faces a window with trees outside, lamps glowing on either side.',
      mr: 'लक्झरी रूम: बाहेर झाडं दिसणाऱ्या खिडकीसमोर बेड, दोन्ही बाजूंना दिवे.',
    },
  },
  'luxury-4': {
    src: luxury4,
    credit: HOTEL,
    alt: {
      en: 'Luxury Room: a timber-framed mirror, the TV wall and the desk by the door.',
      mr: 'लक्झरी रूम: लाकडी चौकटीचा आरसा, टीव्हीची भिंत आणि दाराजवळचा डेस्क.',
    },
  },
  // PLACEHOLDER, not Urban 24 Inn's hall. The client asked for an internet photo until they send
  // photos of their own hall; replace this file and entry then. Free under the Unsplash License.
  'banquet-placeholder': {
    src: banquetPlaceholder,
    credit: 'Omar Rodriguez on Unsplash (unsplash.com/photos/XYuNwlYtfLI), Unsplash License. Placeholder.',
    placeholder: true,
    alt: {
      en: 'A representative photo of a grand hall: gold arches, chandeliers and a patterned carpet.',
      mr: 'भव्य हॉलचं प्रातिनिधिक छायाचित्र: सोनेरी कमानी, झुंबरं आणि नक्षीदार गालिचा.',
    },
  },
  // PLACEHOLDER, not Urban 24 Inn's roof: the rooftop bar is not open yet. The client asked for an
  // internet photo for now; replace it with the real terrace once it opens. Free under the Unsplash License.
  'rooftop-placeholder': {
    src: rooftopPlaceholder,
    credit: 'Brands&People on Unsplash (unsplash.com/photos/en-u6xqnbsg), Unsplash License. Placeholder.',
    placeholder: true,
    alt: {
      en: 'A representative photo of a rooftop lounge at night: lanterns, low sofas and city lights.',
      mr: 'रात्रीच्या रूफटॉप लाउंजचं प्रातिनिधिक छायाचित्र: कंदील, बैठे सोफे आणि शहराचे दिवे.',
    },
  },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;
