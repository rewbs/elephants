import { put, del, list } from '@vercel/blob';

// Upload an image to Vercel Blob storage
export async function uploadImage(file: File, elementSymbol: string): Promise<{ url: string, pathname: string }> {
  try {
    // Generate a unique filename with the element symbol as prefix
    const filename = `${elementSymbol.toLowerCase()}-${Date.now()}-${file.name}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Add randomness to avoid collisions
    });
    
    return blob;
  } catch (error) {
    console.error('Error uploading image to Vercel Blob:', error);
    throw new Error('Failed to upload image');
  }
}

// Delete an image from Vercel Blob storage
export async function deleteImage(pathname: string): Promise<void> {
  try {
    await del(pathname);
  } catch (error) {
    console.error('Error deleting image from Vercel Blob:', error);
    throw new Error('Failed to delete image');
  }
}

// Get blob storage usage
export async function getStorageUsage() {
  try {
    const { blobs, } = await list();
    
    return {
      blobs,
      // totalCount,
      // totalSize,
      // formattedSize: formatBytes(totalSize)
    };
  } catch (error) {
    console.error('Error getting blob storage usage:', error);
    throw new Error('Failed to get storage usage');
  }
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}