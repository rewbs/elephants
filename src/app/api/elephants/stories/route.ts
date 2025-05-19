import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

// Schema for request validation
const storySchema = z.object({
  content: z.string(),
  elephantId: z.number()
});

// GET all stories for an elephant
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const elephantId = searchParams.get('elephantId');
  
  if (!elephantId || isNaN(Number(elephantId))) {
    return NextResponse.json({ error: 'Valid elephantId is required' }, { status: 400 });
  }
  
  try {
    const stories = await prisma.story.findMany({
      where: {
        elephantId: Number(elephantId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

// POST to create a new story
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = storySchema.parse(body);
    const { content, elephantId } = validatedData;
    
    // Verify the elephant exists
    const elephant = await prisma.elephant.findUnique({
      where: { id: elephantId }
    });
    
    if (!elephant) {
      return NextResponse.json({ error: 'Elephant not found' }, { status: 404 });
    }
    
    // Create the story in the database
    const story = await prisma.story.create({
      data: {
        content,
        elephantId
      }
    });
    
    // Revalidate the page to update the UI
    revalidatePath('/');
    
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json({ error: 'Failed to save story' }, { status: 500 });
  }
}

// DELETE a story
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get('id');
  
  if (!storyId || isNaN(Number(storyId))) {
    return NextResponse.json({ error: 'Valid story id is required' }, { status: 400 });
  }
  
  try {
    await prisma.story.delete({
      where: {
        id: Number(storyId)
      }
    });
    
    // Revalidate the page to update the UI
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}