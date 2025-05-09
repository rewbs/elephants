import { NextResponse } from 'next/server';
import { getAllElephants, getElephantsByElement } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const elementSymbol = searchParams.get('element');
    
    // Either get elephants for a specific element or all elephants
    const elephants = elementSymbol 
      ? await getElephantsByElement(elementSymbol)
      : await getAllElephants();
    
    return NextResponse.json(elephants);
  } catch (error) {
    console.error('Error fetching elephants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch elephants' },
      { status: 500 }
    );
  }
}