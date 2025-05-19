import React, { useState } from 'react';
import { Story as StoryType } from '@/types/types';

interface StoryProps {
  story: StoryType;
  onDelete?: (storyId: number) => Promise<void>;
  isAdmin?: boolean;
}

const Story: React.FC<StoryProps> = ({ story, onDelete, isAdmin = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Format the story content with proper paragraph breaks
  const formattedContent = story.content
    .split('\n\n')
    .filter(paragraph => paragraph.trim() !== '')
    .map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
    ));
  
  // Format the date if available
  const formattedDate = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;
  
  const handleDelete = async () => {
    if (!onDelete || !story.id) return;
    
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        setIsDeleting(true);
        await onDelete(story.id);
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete the story');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
        {formattedContent}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        {formattedDate && (
          <span>Generated on {formattedDate}</span>
        )}
        
        {isAdmin && onDelete && story.id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 flex items-center"
            aria-label="Delete story"
          >
            {isDeleting ? 'Deleting...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Story;