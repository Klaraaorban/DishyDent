import { useEffect, useRef } from 'react';

// Restrained scroll-reveal: adds `is-visible` once an element enters the viewport.
// No-ops visually when prefers-reduced-motion is set (handled in CSS).
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
