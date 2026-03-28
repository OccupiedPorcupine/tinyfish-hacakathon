import { NextRequest, NextResponse } from 'next/server';
import { generateValidationKitForOpportunity } from '@/lib/tinyfish/client';
import { ValidationKitRequest } from '@/lib/tinyfish/types';

export async function POST(request: NextRequest) {
  try {
    const body: ValidationKitRequest = await request.json();

    // Validate required fields
    if (!body.category || !body.market || !body.painArea || !body.targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields: category, market, painArea, targetAudience' },
        { status: 400 }
      );
    }

    // Generate validation kit
    const kit = await generateValidationKitForOpportunity(body);

    return NextResponse.json(kit);
  } catch (error) {
    console.error('Validation kit generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate validation kit' },
      { status: 500 }
    );
  }
}
