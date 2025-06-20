import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find the share record
    const share = await prisma.share.findUnique({
      where: { token },
      include: {
        certificate: {
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
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }

    // Check if share has expired
    if (share.expiryDate && new Date() > share.expiryDate) {
      return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
    }

    // Update access timestamp
    await prisma.share.update({
      where: { id: share.id },
      data: { accessedAt: new Date() },
    });

    // Prepare certificate data based on privacy settings
    const certificateData = {
      ...share.certificate,
      metadata: share.includePrivate 
        ? share.certificate.metadata 
        : {
            ...share.certificate.metadata,
            // Remove sensitive fields if not including private data
            attributes: share.certificate.metadata?.attributes?.filter((attr: any) => !attr.encrypted)
          }
    };

    return NextResponse.json({
      valid: true,
      certificate: certificateData,
      sharedBy: share.user,
      shareInfo: {
        createdAt: share.createdAt,
        accessedAt: share.accessedAt,
        includePrivate: share.includePrivate,
      },
    });
  } catch (error) {
    console.error('Error verifying share:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}