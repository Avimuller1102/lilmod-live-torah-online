import { useEffect } from 'react';

const INTERACTIVE_SELECTOR = 'input, textarea, select, button, [role="dialog"], [data-radix-scroll-area-viewport]';

export function useSmoothScroll() {
  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsFinePointer || reduceMotion) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let frame = 0;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const animate = () => {
      currentY += (targetY - currentY) * 0.14;
      window.scrollTo(0, currentY);

      if (Math.abs(targetY - currentY) > 0.35) {
        frame = window.requestAnimationFrame(animate);
      } else {
        currentY = targetY;
        window.scrollTo(0, targetY);
        frame = 0;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey) return;
      if ((event.target as HTMLElement | null)?.closest(INTERACTIVE_SELECTOR)) return;

      event.preventDefault();
      const multiplier = event.deltaMode === 1 ? 18 : 1;
      targetY = Math.max(0, Math.min(maxScroll(), targetY + event.deltaY * multiplier));

      if (!frame) {
        currentY = window.scrollY;
        frame = window.requestAnimationFrame(animate);
      }
    };

    const syncScroll = () => {
      if (!frame) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', syncScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}
