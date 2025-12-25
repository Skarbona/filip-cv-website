"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PixelIcon } from "@/components/PixelIcon";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="default"
          className="fixed bottom-8 right-8 z-50 w-12 h-12 p-0 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Scroll to top"
        >
          <PixelIcon name="arrow-up-solid" width={20} height={20} />
        </Button>
      )}
    </>
  );
}
