import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createElephant } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check if user is authenticated (for admin operations)
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the formData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const elementSymbol = formData.get('elementSymbol') as string;
    const caption = formData.get('caption') as string;
    
    if (!file || !elementSymbol) {
      return NextResponse.json(
        { error: 'File and element symbol are required' },
        { status: 400 }
      );
    }

    // Generate a unique filename with element prefix
    const filename = `${elementSymbol}-${Date.now()}-${file.name}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Save elephant to database
    const elephant = await createElephant({
      elementSymbol,
      blobKey: blob.pathname,
      imageUrl: blob.url,
      caption: caption || '',
    });

    return NextResponse.json(elephant);
  } catch (error) {
    console.error('Error uploading elephant:', error);
    return NextResponse.json(
      { error: 'Failed to upload elephant' },
      { status: 500 }
    );
  }
}