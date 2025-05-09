import { NextResponse } from 'next/server';
import { deleteElephant, getElephantById } from '@/lib/db';
import { deleteImage } from '@/lib/blob';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    // Check if user is authenticated (for admin operations)
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get elephant ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Elephant ID is required' },
        { status: 400 }
      );
    }
    
    // Get the elephant to retrieve its blob key
    const elephant = await getElephantById(parseInt(id));
    
    if (!elephant) {
      return NextResponse.json(
        { error: 'Elephant not found' },
        { status: 404 }
      );
    }
    
    // Delete the image from blob storage
    await deleteImage(elephant.blobKey);
    
    // Delete the elephant from the database
    await deleteElephant(parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting elephant:', error);
    return NextResponse.json(
      { error: 'Failed to delete elephant' },
      { status: 500 }
    );
  }
}