import React, { useState, useRef, useEffect } from 'react';
import { Element, ElephantImage } from '@/types/types';

interface AdminPanelProps {
  elements: Element[];
  elephantsByElement: Record<string, ElephantImage[]>;
  onSaveElephant: (symbol: string, file: File, caption: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  elements, 
  elephantsByElement,
  onSaveElephant, 
  isOpen, 
  onClose 
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Scroll the modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Scroll to the modal with a slight delay to ensure proper rendering
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isOpen]);

  // Get all elements, regardless of whether they have elephants
  const availableElements = elements;
  
  // Show existing elephants for the selected element
  const existingElephants = selectedSymbol ? elephantsByElement[selectedSymbol] || [] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setImageFile(file);
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
          break;
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSymbol || !imageFile || !caption) {
      alert('Please fill in all fields and upload an image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save new elephant with file upload
      await onSaveElephant(selectedSymbol, imageFile, caption);
      
      // Reset form
      setSelectedSymbol('');
      setImageFile(null);
      setPreviewUrl(null);
      setCaption('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error saving elephant:', error);
      alert('Failed to save elephant');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md my-4 md:my-10 relative"
        style={{ maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}
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
        
        <h2 className="text-2xl font-bold mb-4 pr-8">Add New Elephant</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" onPaste={handlePaste}>
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
                  {elephantsByElement[element.symbol]?.length ? 
                    ` - ${elephantsByElement[element.symbol].length} elephant(s)` : ''}
                </option>
              ))}
            </select>
          </div>
          
          {existingElephants.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Existing Elephants:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {existingElephants.map((elephant, i) => (
                  <div key={i} className="text-xs border rounded p-2">
                    <img 
                      src={elephant.imageUrl} 
                      alt={elephant.caption}
                      className="w-full h-24 object-cover mb-1 rounded"
                    />
                    <p className="truncate">{elephant.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Or paste an image from clipboard (Ctrl+V/Cmd+V)
              </div>
              {previewUrl && (
                <div className="mt-2 relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full max-h-48 object-contain rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
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
              disabled={isSubmitting || !imageFile}
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