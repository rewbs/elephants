'use client';

import { useEffect } from 'react';

export default function OrientationHandler() {
  useEffect(() => {
    // Set initial scroll position to center the table horizontally on mobile
    const setInitialScroll = () => {
      if (window.innerWidth < 768) {
        const container = document.querySelector('.overflow-x-auto');
        if (container) {
          // Optional: scroll to a specific position to show content better
          // Commented out as default behavior may be better
          // container.scrollLeft = 150;
        }
      }
    };

    // Set initial scroll after a short delay to ensure content is rendered
    const timer = setTimeout(setInitialScroll, 300);
    
    // Clean up
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // This component doesn't render anything
  return null;
}