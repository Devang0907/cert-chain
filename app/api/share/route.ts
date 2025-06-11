import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes, createHash } from 'crypto';

// Generate secure share token
function generateShareToken(): string {
  const token = randomBytes(32).toString('hex');
  return createHash('sha256').update(token).digest('hex');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const shares = await prisma.share.findMany({
      where: { userId },
      include: {
        certificate: {
          include: {
            institution: true,
            recipient: {
              select: {
                name: true,
                email: true,
                walletAddress: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(shares);
  } catch (error) {
    console.error('Error fetching shares:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, certificateId, email, expiryDays, includePrivate } = body;

    if (!userId || !certificateId) {
      return NextResponse.json({ error: 'User ID and certificate ID are required' }, { status: 400 });
    }

    // Validate certificate ownership
    const certificate = await prisma.certificate.findFirst({
      where: {
        id: certificateId,
        OR: [
          { recipientId: userId },
          { issuerId: userId },
        ],
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found or access denied' }, { status: 403 });
    }

    // Generate secure share token
    const token = generateShareToken();

    // Calculate expiry date
    const expiryDate = expiryDays 
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      : null;

    // Create share record
    const share = await prisma.share.create({
      data: {
        userId,
        certificateId,
        token,
        email,
        expiryDate,
        includePrivate,
      },
      include: {
        certificate: {
          include: {
            institution: true,
            recipient: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // If email is provided, send share notification
    if (email) {
      // In a real app, integrate with your email service
      // await sendShareEmail(email, share);
      
      // Create notification for recipient
      await prisma.notification.create({
        data: {
          userId,
          type: 'CERTIFICATE_SHARED',
          data: {
            shareId: share.id,
            certificateId: certificateId,
            recipientEmail: email,
          },
        },
      });
    }

    return NextResponse.json({
      ...share,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${share.token}`,
    });
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!shareId || !userId) {
      return NextResponse.json({ error: 'Share ID and user ID are required' }, { status: 400 });
    }

    // Verify ownership and delete share
    const share = await prisma.share.deleteMany({
      where: {
        id: shareId,
        userId,
      },
    });

    if (share.count === 0) {
      return NextResponse.json({ error: 'Share not found or access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting share:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}