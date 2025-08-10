import { useEffect } from "react";

export function useEscapeClose(callback?: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key.toLowerCase());
      if (event.key.toLowerCase() === "escape") {
        callback?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
}
