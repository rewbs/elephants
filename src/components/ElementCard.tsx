import React from 'react';
import { ElementWithImage } from '@/types/types';

interface ElementCardProps {
  element: ElementWithImage;
  onClick: (element: ElementWithImage) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const { symbol, name, atomicNumber, category, elephants } = element;

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

  const hasElephants = elephants && elephants.length > 0;
  const elephantCount = elephants?.length || 0;
  const firstElephantImage = hasElephants ? elephants[0].imageUrl : null;

  return (
    <div 
      className={`element ${getCategoryClass(category)} ${hasElephants ? 'ring-2 ring-yellow-400 dark:ring-yellow-500 overflow-hidden' : ''}`}
      onClick={() => onClick(element)}
    >
      {/* Background elephant image */}
      {hasElephants && firstElephantImage && (
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full opacity-60 mix-blend-overlay"
            style={{
              backgroundImage: `url(${firstElephantImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(0.6) contrast(0.8)'
            }}
          />
        </div>
      )}
      
      {/* Atomic number */}
      <div className="absolute top-1 left-1 text-xs md:text-sm z-10">{atomicNumber}</div>
      
      {/* Main element content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <div className="element-symbol text-base sm:text-xl md:text-2xl font-bold">{symbol}</div>
        <div className="element-name text-xs">{name}</div>
      </div>
      
      {/* Elephant count indicator */}
      {hasElephants && (
        <div className="absolute bottom-1 right-1 flex items-center z-10">
          <img src="/elephant-icon.svg" alt="Elephant icon" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          {elephantCount > 1 && (
            <span className="text-xs font-bold bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center -ml-1 -mt-2">
              {elephantCount > 9 ? '9+' : elephantCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ElementCard;