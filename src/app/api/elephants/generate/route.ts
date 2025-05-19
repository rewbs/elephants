import { NextResponse } from 'next/server';

export const maxDuration = 300; // seconds

export async function POST(request: Request) {
  try {
    const { prompt, model = 'dall-e-3' } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const enhancedPrompt = `Create a hyperrealistic photograph of an elephant. ${prompt}`;

    const aiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model === 'dall-e-3' ? 'dall-e-3' : 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('OpenAI API error:', errText);
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    const data = await aiResponse.json();
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating elephant image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
