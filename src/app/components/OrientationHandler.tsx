'use client';

import { useEffect } from 'react';

export default function OrientationHandler() {
  useEffect(() => {
    // Function to handle screen orientation changes
    const handleOrientationChange = () => {
      // Get the orientation type
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      
      // Select the notification element
      const noticeElement = document.querySelector('.mobile-notice');
      
      // Show/hide the notification based on orientation
      if (noticeElement) {
        if (isPortrait && window.innerWidth < 768) {
          noticeElement.classList.remove('hidden');
        } else {
          noticeElement.classList.add('hidden');
        }
      }
    };

    // Set initial orientation state
    handleOrientationChange();
    
    // Add event listener for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    
    // Try to force landscape if supported
    if (screen.orientation && screen.orientation.lock) {
      try {
        screen.orientation.lock('landscape').catch(() => {
          console.log('Orientation lock not supported or permission denied');
        });
      } catch (error) {
        console.log('Orientation API not supported');
      }
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}