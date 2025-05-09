import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is authenticated (for admin operations)
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get storage metrics
    const { blobs } = await list();

    // Organize blobs by element
    const blobsByElement: Record<string, { count: number, size: number }> = {};
    
    for (const blob of blobs) {
      const elementSymbol = blob.pathname.split('-')[0]; // Extract element symbol from filename
      
      if (!blobsByElement[elementSymbol]) {
        blobsByElement[elementSymbol] = { count: 0, size: 0 };
      }
      
      blobsByElement[elementSymbol].count += 1;
      blobsByElement[elementSymbol].size += blob.size;
    }

    return NextResponse.json({
      // totalBlobs: totalCount,
      // totalSize: formatBytes(totalSize),
      blobsByElement,
    });
  } catch (error) {
    console.error('Error fetching storage usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage usage' },
      { status: 500 }
    );
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