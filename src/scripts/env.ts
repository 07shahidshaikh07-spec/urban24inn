const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
const mqDesktop = window.matchMedia('(min-width: 900px)');

/** Motion is allowed unless the visitor asked the OS to reduce it. */
export const motionOK = (): boolean => !mqReduce.matches;
/** Mouse or trackpad (not touch). */
export const fine = (): boolean => mqFine.matches;
export const isDesktop = (): boolean => mqDesktop.matches;

export type Cleanup = () => void;
