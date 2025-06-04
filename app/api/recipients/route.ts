import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const institutionId = searchParams.get('institution');

    const recipients = await prisma.user.findMany({
      where: {
        role: UserRole.STUDENT,
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { walletAddress: { contains: query, mode: 'insensitive' } },
            ],
          },
          institutionId ? {
            receivedCertificates: {
              some: {
                institutionId,
              },
            },
          } : {},
        ],
      },
      include: {
        receivedCertificates: {
          include: {
            institution: true,
            issuer: true,
          },
        },
      },
    });

    return NextResponse.json(recipients);
  } catch (error) {
    console.error('Error fetching recipients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, email, name } = body;

    const recipient = await prisma.user.upsert({
      where: { walletAddress },
      update: {
        email,
        name,
      },
      create: {
        walletAddress,
        email,
        name,
        role: UserRole.STUDENT,
      },
      include: {
        receivedCertificates: true,
      },
    });

    return NextResponse.json(recipient);
  } catch (error) {
    console.error('Error creating/updating recipient:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}