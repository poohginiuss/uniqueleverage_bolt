import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://uniqueleverage.com/FacebookCatalogs/AutoplexMKE.csv', {
      headers: {
        'Accept': 'text/csv',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    return NextResponse.json({ 
      success: true, 
      data: csvText,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 });
  }
}
