'use client';

import { useEffect } from 'react';

export default function OrientationHandler() {
  useEffect(() => {
    // Function to handle screen orientation changes - minimal now since CSS does most of the work
    const handleOrientationChange = () => {
      // We mainly just need this to handle any future dynamic UI updates based on orientation
    };

    // Set initial orientation state
    handleOrientationChange();
    
    // Add event listener for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    
    // We won't try to force landscape anymore since we're displaying in portrait mode too
    // User can rotate if they want to based on our notification
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}