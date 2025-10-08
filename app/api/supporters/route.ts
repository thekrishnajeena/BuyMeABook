import { NextResponse } from 'next/server';

// GET /api/supporters
export async function GET() {
  // Dummy data for testing
  const dummySupporters = [
    { id: 1, name: "Alice", amount: 500 },
    { id: 2, name: "Bob", amount: 1000 },
    { id: 3, name: "Charlie", amount: 250 },
  ];

  return NextResponse.json({
    message: "This is dummy data for testing",
    data: dummySupporters,
  });
}
