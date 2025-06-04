import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    const mintAddress = searchParams.get('mint');

    if (!certificateId && !mintAddress) {
      return NextResponse.json({ error: 'Certificate ID or mint address is required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { id: certificateId },
          { mintAddress },
        ],
      },
      include: {
        institution: true,
        recipient: {
          select: {
            name: true,
            walletAddress: true,
          },
        },
        issuer: {
          select: {
            name: true,
            walletAddress: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      certificate,
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}