import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const institutions = await prisma.institution.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        administrators: true,
        certificates: true,
      },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, website, adminWalletAddress } = body;

    const institution = await prisma.institution.create({
      data: {
        name,
        website,
        administrators: {
          connect: {
            walletAddress: adminWalletAddress,
          },
        },
      },
      include: {
        administrators: true,
      },
    });

    return NextResponse.json(institution);
  } catch (error) {
    console.error('Error creating institution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}