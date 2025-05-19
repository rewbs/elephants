'use client';

import React, { useState, useEffect } from 'react';
import ElementCard from '@/components/ElementCard';
import ElementModal from '@/components/ElementModal';
import Legend from '@/components/Legend';
import AdminPanel from '@/components/AdminPanel';
import { Element, ElementWithImage, ElephantImagesMap, ElephantImage } from '@/types/types';
import { useToast } from '@/components/Toast';

// Import the data and utilities
import periodicTableData from '@/data/periodic-table.json';
import { Elephant } from '@prisma/client';

function Home() {
  const { showToast } = useToast();
  const [selectedElement, setSelectedElement] = useState<ElementWithImage | null>(null);
  const [elements, setElements] = useState<ElementWithImage[]>([]);
  const [completionCount, setCompletionCount] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [preselectedElement, setPreselectedElement] = useState<string>('');
  const [elephantsByElement, setElephantsByElement] = useState<Record<string, ElephantImage[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all elephants from the API
        const response = await fetch('/api/elephants');
        if (!response.ok) {
          throw new Error('Failed to fetch elephants');
        }
        const elephantsData = await response.json() as Elephant[];
        
        // Group elephants by element
        const elephantMap: Record<string, ElephantImage[]> = {};
        
        elephantsData.forEach(elephant => {
          if (!elephantMap[elephant.elementSymbol]) {
            elephantMap[elephant.elementSymbol] = [];
          }
          
          elephantMap[elephant.elementSymbol].push({
            imageUrl: elephant.imageUrl,
            caption: elephant.caption,
            id: elephant.id,
            blobKey: elephant.blobKey,
            createdAt: elephant.createdAt,
          });
        });
        
        setElephantsByElement(elephantMap);
        
        // Add the elephants to the elements data
        const elementsWithImages = (periodicTableData as Element[]).map(element => {
          const elementElephants = elephantMap[element.symbol] || [];
          
          return {
            ...element,
            elephants: elementElephants,
          };
        });
        
        setElements(elementsWithImages);
        setTotalElements(elementsWithImages.length);
        
        // Count unique elements that have elephants
        const elementsWithElephants = Object.keys(elephantMap).length;
        setCompletionCount(elementsWithElephants);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to handle element click
  const handleElementClick = (element: ElementWithImage) => {
    setSelectedElement(element);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedElement(null);
  };
  
  // Function to open admin panel with a pre-selected element
  const handleAddElephant = (elementSymbol: string) => {
    setPreselectedElement(elementSymbol);
    setIsAdminPanelOpen(true);
  };
  
  // Function to delete an elephant
  const handleDeleteElephant = async (id: number) => {
    try {
      const response = await fetch(`/api/elephants/delete?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete elephant');
      }
      
      // Success! Now update our state
      const updatedElephantsByElement = { ...elephantsByElement };
      
      // Find which element the deleted elephant belongs to
      let elementSymbol = '';
      
      // Iterate through all elements to find and remove the deleted elephant
      Object.keys(updatedElephantsByElement).forEach((symbol) => {
        const index = updatedElephantsByElement[symbol].findIndex(
          (elephant) => elephant.id === id
        );
        
        if (index !== -1) {
          elementSymbol = symbol;
          // Remove the elephant from the array
          updatedElephantsByElement[symbol].splice(index, 1);
          
          // If no more elephants for this element, remove the element key
          if (updatedElephantsByElement[symbol].length === 0) {
            delete updatedElephantsByElement[symbol];
          }
        }
      });
      
      // Update the elephants state
      setElephantsByElement(updatedElephantsByElement);
      
      // Update elements with the updated elephant list
      const updatedElements = elements.map((element) => {
        if (element.symbol === elementSymbol) {
          return {
            ...element,
            elephants: updatedElephantsByElement[elementSymbol] || [],
          };
        }
        return element;
      });
      
      setElements(updatedElements);
      
      // Update completion count
      const uniqueElementsWithElephants = Object.keys(updatedElephantsByElement).length;
      setCompletionCount(uniqueElementsWithElephants);
      
      // If we deleted the currently selected elephant, close the modal
      if (selectedElement && selectedElement.symbol === elementSymbol) {
        if (!updatedElephantsByElement[elementSymbol] || updatedElephantsByElement[elementSymbol].length === 0) {
          setSelectedElement(null);
        } else {
          // Update the selected element with the new list of elephants
          setSelectedElement({
            ...selectedElement,
            elephants: updatedElephantsByElement[elementSymbol] || [],
          });
        }
      }
      showToast('Elephant deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting elephant:', error);
      showToast('Failed to delete elephant. Please try again.', 'error');
    }
  };

  // Function to save a new elephant
  const handleSaveElephant = async (symbol: string, file: File, caption: string) => {
    try {
      // Create FormData to send to the upload API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('elementSymbol', symbol);
      formData.append('caption', caption);
      
      // Upload the elephant via the API
      const response = await fetch('/api/elephants/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload elephant');
      }
      
      const newElephant = await response.json();
      
      // Update local state with the new elephant
      const updatedElephantsByElement = { ...elephantsByElement };
      
      if (!updatedElephantsByElement[symbol]) {
        updatedElephantsByElement[symbol] = [];
      }
      
      updatedElephantsByElement[symbol].push({
        imageUrl: newElephant.imageUrl,
        caption: newElephant.caption,
      });
      
      setElephantsByElement(updatedElephantsByElement);
      
      // Update elements with the new elephant
      const updatedElements = elements.map(element => {
        if (element.symbol === symbol) {
          return {
            ...element,
            elephants: updatedElephantsByElement[symbol],
          };
        }
        return element;
      });
      
      setElements(updatedElements);
      
      // Update completion count if this is a new element with elephants
      const uniqueElementsWithElephants = Object.keys(updatedElephantsByElement).length;
      setCompletionCount(uniqueElementsWithElephants);
      
      setIsAdminPanelOpen(false);
      
      showToast('Elephant saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving elephant:', error);
      showToast('Failed to save elephant. Please try again.', 'error');
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-bounce p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
          <img src="/elephant-icon.svg" alt="Loading" className="w-16 h-16 filter brightness-0 invert" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto xl:px-40 py-8 min-w-full">
      <div className="relative mb-12 text-center">
        <img src="/elephant-icon.svg" alt="Elephant icon" className="absolute left-1/2 -translate-x-1/2 -top-16 w-32 h-32 opacity-10" />
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Periodic Table of the Elephants
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Click on an element to view its corresponding elephant.
        </p>
        
        <div className="text-center mt-4">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full px-6 py-3 shadow-sm">
            <span className="font-medium text-lg">{completionCount}</span> of <span className="font-medium text-lg">{totalElements}</span> elements have elephants 
            <span className="ml-2 text-yellow-500">✨</span>
          </div>
        </div>
      </div>
      <div className="text-center my-4">
        <button
          onClick={() => setIsAdminPanelOpen(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <img src="/elephant-icon.svg" alt="Elephant icon" className="w-6 h-6 mr-2 filter brightness-0 invert" />
          Add New Elephant
        </button>
      </div>      

      <Legend />
      
      <div className="overflow-x-auto pb-4">
        <div className="grid-container my-8">
          {grid.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((element, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`h-16 sm:h-20 md:h-24 element-cell ${!element ? 'bg-transparent' : ''}`}
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
      </div>
      
      {selectedElement && (
        <ElementModal 
          element={selectedElement} 
          onClose={handleCloseModal}
          onDeleteElephant={handleDeleteElephant}
          onAddElephant={handleAddElephant}
          isAdmin={true}
        />
      )}
      
      <AdminPanel 
        elements={elements}
        elephantsByElement={elephantsByElement}
        onSaveElephant={handleSaveElephant}
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        preselectedElement={preselectedElement}
      />
    </div>
  );
}

export default Home;