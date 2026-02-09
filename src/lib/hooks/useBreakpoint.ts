"use client";

import { useState, useEffect } from "react";

/**
 * Reads a CSS custom property breakpoint value (e.g. --breakpoint-lg)
 * and returns whether the viewport matches `min-width: <value>`.
 *
 * Breakpoints are defined in globals.css @theme, sourced from
 * @rte-ds/core design tokens ($breakpoints-*).
 */
export function useBreakpoint(
  breakpointVar: `--breakpoint-${string}`,
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(breakpointVar)
      .trim();

    if (!value) return;

    const mql = window.matchMedia(`(min-width: ${value})`);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpointVar]);

  return matches;
}
