import { useEffect, useState } from 'react';

/**
 * Suivi du défilement en une seule écoute (requestAnimationFrame) :
 * - progression de lecture (0 → 1)
 * - section actuellement visible (pour surligner le menu)
 */
export function useScrollState(sectionIds: readonly string[]) {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(y);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);

      // La section active est la dernière dont le haut a dépassé le tiers de l'écran.
      const marker = y + window.innerHeight * 0.33;
      let current: string | null = null;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= marker) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return { progress, scrollY, active };
}
