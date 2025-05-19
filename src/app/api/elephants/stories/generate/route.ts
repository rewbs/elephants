import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

// Set longer max duration for story generation
export const maxDuration = 300; // 5 minutes

// Schema for request validation
const generateStorySchema = z.object({
  elephantId: z.number(),
  elementSymbol: z.string(),
  elementName: z.string(),
  caption: z.string(),
  imageUrl: z.string()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = generateStorySchema.parse(body);
    const { elephantId, elementSymbol, elementName, caption, imageUrl } = validatedData;
    
    // Get OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }
    
    // Fetch element details from the database if needed
    // We're getting basic details from the request, but you could fetch more info here if required
    
    // Create the prompt for story generation
    const prompt = `
    Create a short, fun story (3 paragraphs) about an elephant with a connection to the element ${elementName} (${elementSymbol}). 
    
    Importantly, the elephant is described as: "${caption}". This description is key to the story.
    
    Include some scientific and historical facts about the element ${elementName} like its discoverer, discovery, properties, and industrial uses.
    Make the story educational but suitable for children around 12 years old. The tone should be humorous and/or adventurous.
    Use accessible language but don't shy away from introducing educational terms with clear explanations.
    
    Format the story in 3 paragraphs with appropriate spacing between paragraphs.

    Attached is an image of the elephant to help inspire the story. Ensure details of the image are prominently featured in the story.
    `;
    
    // Call OpenAI API to generate the story
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a storyteller who specializes in educational yet entertaining stories about chemistry for children.'
          },
          {
            role: 'user',
            content: [
              {
                "type": "text",
                "text": prompt
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": imageUrl,
                }
              },
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('OpenAI API error:', errText);
      return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
    }
    
    const data = await aiResponse.json();
    const storyContent = data.choices[0]?.message?.content;
    
    if (!storyContent) {
      return NextResponse.json({ error: 'No story content returned' }, { status: 500 });
    }
    
    // Clean up and format the story content
    const formattedStory = storyContent.trim();
    
    // Return the generated story
    return NextResponse.json({ 
      content: formattedStory,
      elephantId
    });
    
  } catch (error) {
    console.error('Error generating elephant story:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}