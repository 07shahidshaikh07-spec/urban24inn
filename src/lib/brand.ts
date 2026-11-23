// The client's logo, cut out of its background into versions for light and dark surfaces.
import lockupLight from '../assets/brand/logo-lockup-light.png';
import lockupDark from '../assets/brand/logo-lockup-dark.png';
import fullLight from '../assets/brand/logo-full-light.png';
import fullDark from '../assets/brand/logo-full-dark.png';
import markLight from '../assets/brand/logo-mark-light.png';
import markDark from '../assets/brand/logo-mark-dark.png';

export const logo = { lockupLight, lockupDark, fullLight, fullDark, markLight, markDark };
export type LogoVariant = keyof typeof logo;
