import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ElementWithImage } from '@/types/types';
import FullscreenImage from './FullscreenImage';

interface ElementModalProps {
  element: ElementWithImage | null;
  onClose: () => void;
  onDeleteElephant?: (id: number) => Promise<void>;
}

const ElementModal: React.FC<ElementModalProps> = ({ element, onClose, onDeleteElephant }) => {
  if (!element) return null;
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Scroll the modal into view when it opens
  useEffect(() => {
    if (modalRef.current) {
      // Scroll to the modal with a slight delay to ensure proper rendering
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  // Create a CSS class based on the category
  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'nonmetal': return 'bg-nonmetal';
      case 'noble-gas': return 'bg-noble-gas';
      case 'alkali-metal': return 'bg-alkali-metal';
      case 'alkaline-earth-metal': return 'bg-alkaline-earth-metal';
      case 'metalloid': return 'bg-metalloid';
      case 'post-transition-metal': return 'bg-post-transition-metal';
      case 'transition-metal': return 'bg-transition-metal';
      case 'halogen': return 'bg-halogen';
      case 'actinide': return 'bg-actinide';
      case 'lanthanide': return 'bg-lanthanide';
      default: return 'bg-gray-200';
    }
  };

  const hasElephants = element.elephants && element.elephants.length > 0;
  const elephants = element.elephants || [];
  const activeElephant = hasElephants ? elephants[activeIndex] : null;

  const nextElephant = () => {
    setActiveIndex((prev) => (prev + 1) % elephants.length);
  };

  const prevElephant = () => {
    setActiveIndex((prev) => (prev - 1 + elephants.length) % elephants.length);
  };

  return (
    <>
      {/* Fullscreen image viewer */}
      {fullscreenImage && (
        <FullscreenImage 
          src={fullscreenImage} 
          alt={activeElephant?.caption || "Elephant Image"} 
          onClose={() => setFullscreenImage(null)} 
        />
      )}
    
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75 p-4 overflow-y-auto" onClick={onClose}>
        <div 
          ref={modalRef}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 my-4 md:my-10 overflow-y-auto relative"
          style={{ maxHeight: 'calc(100vh - 32px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button at top right for easier mobile access */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-full"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col gap-6 pt-4">
          {/* Elephant image carousel - Displayed prominently when available */}
          {hasElephants && (
            <div className="w-full">
              <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
                {/* Carousel navigation buttons */}
                {elephants.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        prevElephant();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
                      aria-label="Previous elephant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        nextElephant();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
                      aria-label="Next elephant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Current elephant image - clickable for fullscreen */}
                <div 
                  className="absolute inset-0 cursor-pointer z-[1] group"
                  onClick={(e) => {
                    // Ensure we don't trigger fullscreen if clicking on the nav buttons
                    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
                      e.stopPropagation();
                      setFullscreenImage(activeElephant!.imageUrl);
                    }
                  }}
                  title="Click to view fullscreen"
                >
                  {/* Expand icon that appears on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black bg-opacity-50 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </div>
                </div>
                <Image 
                  src={activeElephant!.imageUrl}
                  alt={activeElephant!.caption}
                  fill
                  className="object-cover"
                />
                
                {/* Image counter for multiple elephants */}
                {elephants.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                    {activeIndex + 1} / {elephants.length}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-center mt-3 mb-1">
                {activeElephant!.caption}
              </h2>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Element: {element.name} ({element.symbol})</span>
                
                {onDeleteElephant && activeElephant?.id && (
                  <button
                    onClick={() => {
                      const elephantId = activeElephant.id!;
                      if (window.confirm('Are you sure you want to delete this elephant?')) {
                        onDeleteElephant(elephantId);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded bg-red-50 hover:bg-red-100 flex items-center"
                    title="Delete this elephant"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
              
              {/* Thumbnail navigation for multiple elephants */}
              {elephants.length > 1 && (
                <div className="flex justify-center mt-4 gap-2 overflow-x-auto py-2">
                  {elephants.map((elephant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-16 w-16 rounded-md overflow-hidden border-2 ${idx === activeIndex ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <div 
                        className="absolute inset-0 z-10" 
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImage(elephant.imageUrl);
                        }}
                      />
                      <Image 
                        src={elephant.imageUrl}
                        alt={elephant.caption}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Element information section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {element.name} <span className="text-gray-500">({element.symbol})</span>
              </h2>
              <div className="mb-4">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getCategoryClass(element.category)} text-gray-900`}>
                  {element.category.replace('-', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Atomic Number</h3>
                  <p className="text-lg">{element.atomicNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Atomic Mass</h3>
                  <p className="text-lg">{element.atomicMass}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</h3>
                  <p className="text-lg">{element.group}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Period</h3>
                  <p className="text-lg">{element.period}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Block</h3>
                  <p className="text-lg">{element.block}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Electron Configuration</h3>
                  <p className="text-lg">{element.electronConfiguration}</p>
                </div>
              </div>
            </div>
            
            {/* Placeholder for missing elephants */}
            {!hasElephants && (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Elephant Not Yet Discovered</h3>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  This element's elephant is still waiting to be discovered. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 sticky bottom-0 pb-2 pt-2 bg-white dark:bg-gray-800 flex justify-center md:justify-end w-full">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full md:w-auto"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ElementModal;