import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Example API route
    const data = {
      message: 'Hello from API',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
