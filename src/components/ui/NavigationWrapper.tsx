"use client";

import {
  useKeyboardNavigation,
  PAGE_ORDER,
} from "@/hooks/useKeyboardNavigation";
import NavigationButton from "./NavigationButton";

export default function NavigationButtons() {
  const { showNavigation, currentPageIndex } = useKeyboardNavigation();
  if (!showNavigation) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <NavigationButton
        direction="previous"
        href={PAGE_ORDER[currentPageIndex - 1]}
      />
      <NavigationButton
        direction="next"
        href={PAGE_ORDER[currentPageIndex + 1]}
      />
    </div>
  );
}
