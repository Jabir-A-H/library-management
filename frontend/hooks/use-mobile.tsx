/**
 * useIsMobile - React hook to detect if the viewport is mobile-sized.
 *
 * @returns {boolean} True if the viewport width is less than MOBILE_BREAKPOINT, else false.
 *
 * Usage:
 *   const isMobile = useIsMobile();
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  // State: true if mobile, false if not, undefined initially (SSR safe)
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange);
    setIsMobile(mql.matches);
    return () => {
      mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange);
    };
  }, []);

  return Boolean(isMobile);
}
