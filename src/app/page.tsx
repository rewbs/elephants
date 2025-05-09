'use client';

import React, { useState, useEffect } from 'react';
import ElementCard from '@/components/ElementCard';
import ElementModal from '@/components/ElementModal';
import Legend from '@/components/Legend';
import AdminPanel from '@/components/AdminPanel';
import { Element, ElementWithImage, ElephantImagesMap, ElephantImage } from '@/types/types';

// Import the data
import periodicTableData from '@/data/periodic-table.json';
import elephantImagesData from '@/data/element-images.json';

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<ElementWithImage | null>(null);
  const [elements, setElements] = useState<ElementWithImage[]>([]);
  const [completionCount, setCompletionCount] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [elephantImages, setElephantImages] = useState<ElephantImagesMap>({} as ElephantImagesMap);

  useEffect(() => {
    // Initialize elephant images from the data file
    setElephantImages(elephantImagesData as ElephantImagesMap);
    
    // Add the elephants to the elements data
    const elementsWithImages = (periodicTableData as Element[]).map(element => {
      const elephantData = (elephantImagesData as ElephantImagesMap)[element.symbol];
      return {
        ...element,
        elephant: elephantData
      };
    });
    
    setElements(elementsWithImages);
    setTotalElements(elementsWithImages.length);
    setCompletionCount(Object.keys(elephantImagesData).length);
  }, []);

  // Function to handle element click
  const handleElementClick = (element: ElementWithImage) => {
    setSelectedElement(element);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedElement(null);
  };

  // Function to save a new elephant
  const handleSaveElephant = (symbol: string, elephant: ElephantImage) => {
    // In a real app, this would save to a database
    // For now, we'll just update the state
    
    // Update elephant images map
    const updatedElephantImages = {
      ...elephantImages,
      [symbol]: elephant
    };
    setElephantImages(updatedElephantImages);
    
    // Update elements with the new elephant
    const updatedElements = elements.map(element => {
      if (element.symbol === symbol) {
        return {
          ...element,
          elephant
        };
      }
      return element;
    });
    
    setElements(updatedElements);
    setCompletionCount(Object.keys(updatedElephantImages).length);
    setIsAdminPanelOpen(false);
    
    // Show a message that would typically save the data
    alert('Elephant saved successfully! In a real app, this would update the database.');
  };

  // Create a grid with placeholders for empty positions
  const renderPeriodicTable = () => {
    const grid: (ElementWithImage | null)[][] = Array(10).fill(null).map(() => Array(18).fill(null));
    
    // Place elements in the grid
    elements.forEach(element => {
      const row = element.yPos - 1;
      const col = element.xPos - 1;
      
      if (row >= 0 && row < 10 && col >= 0 && col < 18) {
        grid[row][col] = element;
      }
    });
    
    return grid;
  };

  const grid = renderPeriodicTable();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Periodic Table of the Elephants</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
        Click on an element to view its corresponding elephant.
      </p>
      
      <div className="text-center mb-6">
        <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <span className="font-medium">{completionCount}</span> of <span className="font-medium">{totalElements}</span> elephants discovered 
          <span className="ml-2 text-yellow-500">✨</span>
        </div>
      </div>
      
      <Legend />
      
      <div className="grid-container my-8">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((element, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className={`h-16 sm:h-20 ${!element ? 'bg-transparent' : ''}`}
                style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 1 }}
              >
                {element && (
                  <ElementCard 
                    element={element} 
                    onClick={handleElementClick} 
                  />
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-center my-8">
        <button
          onClick={() => setIsAdminPanelOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <span className="mr-2">🐘</span>
          Add New Elephant
        </button>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          In a real app, this would be protected by admin authentication.
        </p>
      </div>
      
      {selectedElement && (
        <ElementModal 
          element={selectedElement} 
          onClose={handleCloseModal} 
        />
      )}
      
      <AdminPanel 
        elements={elements}
        onSaveElephant={handleSaveElephant}
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );
}