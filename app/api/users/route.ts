import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, role, name, email, institutionId } = body;

    // Validate input
    if (!walletAddress || !role) {
      return NextResponse.json(
        { error: "Wallet address and role are required" },
        { status: 400 }
      );
    }

    // Validate wallet address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // If role is INSTITUTION, validate institutionId
    if (role === UserRole.INSTITUTION && !institutionId) {
      return NextResponse.json(
        { error: "Institution ID is required for institution role" },
        { status: 400 }
      );
    }

    // Check if email is unique if provided
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.walletAddress !== walletAddress) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Create or update user with transaction
    const user = await prisma.$transaction(async (tx) => {
      const userData = {
        role,
        ...(name && { name }),
        ...(email && { email }),
        ...(institutionId && { institutionId }),
      };

      const user = await tx.user.upsert({
        where: { walletAddress },
        update: userData,
        create: {
          walletAddress,
          ...userData,
        },
        include: {
          issuedCertificates: true,
          receivedCertificates: true,
          institution: true,
        },
      });

      // If institution role, ensure institution exists
      if (role === UserRole.INSTITUTION && institutionId) {
        const institution = await tx.institution.findUnique({
          where: { id: institutionId },
        });
        if (!institution) {
          throw new Error("Institution not found");
        }
        await tx.institution.update({
          where: { id: institutionId },
          data: {
            administrators: {
              connect: { id: user.id },
            },
          },
        });
      }

      return user;
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error creating/updating user:", error);
    if (error.message === "Institution not found") {
      return NextResponse.json(
        { error: "Invalid Institution ID" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    const email = searchParams.get('email');

    if (!walletAddress && !email) {
      return NextResponse.json({ error: 'Wallet address or email is required' }, { status: 400 });
    }

    // Validate wallet address if provided
    if (walletAddress) {
      try {
        new PublicKey(walletAddress);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { walletAddress: walletAddress || undefined },
          { email: email || undefined }
        ]
      },
      include: {
        issuedCertificates: {
          include: {
            institution: true,
            recipient: true,
          }
        },
        receivedCertificates: {
          include: {
            institution: true,
            issuer: true,
          }
        },
        institution: true,
      },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    // Remove sensitive information
    const sanitizedUser = {
      ...user,
      email: user.email, // Only include if it matches the requesting user
      issuedCertificates: user.issuedCertificates.map(cert => ({
        ...cert,
        metadata: undefined // Remove private metadata
      })),
      receivedCertificates: user.receivedCertificates.map(cert => ({
        ...cert,
        metadata: undefined // Remove private metadata
      }))
    };

    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}