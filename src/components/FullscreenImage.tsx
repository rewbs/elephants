import React, { useEffect } from 'react';
import Image from 'next/image';

interface FullscreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ src, alt, onClose }) => {
  // Handle escape key and other keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on any key press
      onClose();
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      <div className="relative w-full h-full">
        <Image 
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-25 hover:bg-opacity-40 rounded-full p-2 text-white z-10"
        onClick={onClose}
        aria-label="Close fullscreen image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default FullscreenImage;