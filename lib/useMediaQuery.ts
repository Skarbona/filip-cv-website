import { useCallback, useSyncExternalStore } from "react";

function canMatch() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

/** True while the media query matches. Always false during static rendering. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatch()) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => canMatch() && window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
