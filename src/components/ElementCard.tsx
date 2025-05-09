import React from 'react';
import { ElementWithImage } from '@/types/types';

interface ElementCardProps {
  element: ElementWithImage;
  onClick: (element: ElementWithImage) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  const { symbol, name, atomicNumber, category, elephant } = element;

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

  const hasElephant = !!elephant;

  return (
    <div 
      className={`element ${getCategoryClass(category)} ${hasElephant ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}
      onClick={() => onClick(element)}
    >
      <div className="absolute top-1 left-1 text-xs">{atomicNumber}</div>
      <div className="text-lg sm:text-xl font-bold">{symbol}</div>
      <div className="text-xs truncate max-w-full">{name}</div>
      {hasElephant && (
        <div className="absolute bottom-1 right-1 text-xs text-yellow-500">🐘</div>
      )}
    </div>
  );
};

export default ElementCard;