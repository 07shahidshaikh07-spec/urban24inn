import { gsap } from 'gsap';
import { motionOK, type Cleanup } from './env';
import { initCarousels } from './carousel';

/** Rooms page: photo galleries and the check-in / check-out clocks. */
export function initRooms(): Cleanup {
  const offs: Cleanup[] = [initCarousels()];
  const motion = motionOK();

  // Clock dials: the hands sweep round to the check-in and check-out times.
  document.querySelectorAll<HTMLElement>('[data-dial]').forEach((dial) => {
    const [hh, mm] = (dial.dataset.time ?? '12:00').split(':').map(Number);
    const hour = dial.querySelector('[data-hand="h"]');
    const min = dial.querySelector('[data-hand="m"]');
    const hourAngle = (hh % 12) * 30 + mm * 0.5;
    const minAngle = mm * 6;
    if (!motion) {
      gsap.set(hour, { rotation: hourAngle, svgOrigin: '100 100' });
      gsap.set(min, { rotation: minAngle, svgOrigin: '100 100' });
      return;
    }
    gsap.timeline({ scrollTrigger: { trigger: dial, start: 'top 80%', once: true } })
      .fromTo(min, { rotation: 0 }, { rotation: 720 + minAngle, svgOrigin: '100 100', duration: 2.2, ease: 'expo.inOut' })
      .fromTo(hour, { rotation: 0 }, { rotation: 360 + hourAngle, svgOrigin: '100 100', duration: 2.2, ease: 'expo.inOut' }, 0)
      .from(dial.querySelectorAll('.dial__tick'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.03, ease: 'back.out(3)' }, 0);
  });

  return () => offs.forEach((fn) => fn());
}
