import React, { useEffect, useState, useRef } from 'react';
import NextImage from 'next/image';

interface FullscreenImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ src, alt, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Handle escape key and other keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';

    // Set initial viewport size
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Handle resize events
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      <div className="w-full h-full max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] relative">
        <NextImage 
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 90vw"
          className="object-contain"
          priority
        />
      </div>
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-25 hover:bg-opacity-40 rounded-full p-2 text-white z-10"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
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