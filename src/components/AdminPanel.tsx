import React, { useState } from 'react';
import { Element, ElephantImage } from '@/types/types';

interface AdminPanelProps {
  elements: Element[];
  onSaveElephant: (symbol: string, elephant: ElephantImage) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  elements, 
  onSaveElephant, 
  isOpen, 
  onClose 
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter out elements that already have elephants (would be implemented with a full database)
  const availableElements = elements;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSymbol || !imageUrl || !caption) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Save new elephant
    onSaveElephant(selectedSymbol, { imageUrl, caption });
    
    // Reset form
    setSelectedSymbol('');
    setImageUrl('');
    setCaption('');
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Elephant</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="element" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Element
            </label>
            <select
              id="element"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select an element</option>
              {availableElements.map((element) => (
                <option key={element.symbol} value={element.symbol}>
                  {element.name} ({element.symbol})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-gray-300 py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Hydrogen Elephant - The Lightest Pachyderm"
              className="w-full rounded-md border border-gray-300 py-2 px-3 bg-white dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Elephant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;