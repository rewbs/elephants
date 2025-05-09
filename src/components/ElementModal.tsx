import React from 'react';
import Image from 'next/image';
import { ElementWithImage } from '@/types/types';

interface ElementModalProps {
  element: ElementWithImage | null;
  onClose: () => void;
}

const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  if (!element) return null;

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

  const hasElephant = !!element.elephant;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          {/* Elephant image section - Displayed prominently when available */}
          {hasElephant && (
            <div className="w-full">
              <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
                <Image 
                  src={element.elephant!.imageUrl}
                  alt={element.elephant!.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-center mt-3 mb-1">
                {element.elephant!.caption}
              </h2>
              <div className="flex justify-center">
                <span className="text-sm text-gray-500">Element: {element.name} ({element.symbol})</span>
              </div>
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
            {!hasElephant && (
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
        
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementModal;