import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, expiryDays, includePrivate, certificateIds } = body;

    // In a real app, this would:
    // 1. Create a share record in the database
    // 2. Generate a secure share token
    // 3. Send an email to the recipient
    // 4. Return the share details

    // Mock response for demonstration
    const shareRecord = {
      id: `share_${Date.now()}`,
      email,
      expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
      includePrivate,
      certificateIds,
      shareUrl: `https://certichain.app/verify/${Date.now()}`,
    };

    return NextResponse.json(shareRecord);
  } catch (error) {
    console.error('Error sharing certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}