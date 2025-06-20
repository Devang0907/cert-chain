import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole, CertificateType } from '@prisma/client';
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

// Initialize connections
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');

// Analytics tracking function
async function trackAnalytics(eventName: string, data: any) {
  try {
    await prisma.analytics.create({
      data: {
        eventName,
        eventData: data,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
}

// Notification sending function
async function sendNotifications(recipientId: string, eventType: string, data: any) {
  try {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { email: true }
    });

    // Store notification in database
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: eventType,
        data,
        read: false
      }
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('GET /api/certificates - wallet:', walletAddress);

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Validate wallet address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      console.error('Invalid wallet address:', walletAddress);
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        receivedCertificates: {
          include: {
            institution: true,
            issuer: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        },
        issuedCertificates: {
          include: {
            institution: true,
            recipient: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        },
      },
    });

    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User role:', user.role);
      console.log('Received certificates:', user.receivedCertificates.length);
      console.log('Issued certificates:', user.issuedCertificates.length);
    }

    if (!user) {
      console.log('User not found for wallet:', walletAddress);
      return NextResponse.json({ 
        certificates: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
        },
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.certificate.count({
      where: user.role === UserRole.STUDENT 
        ? { recipientId: user.id }
        : { issuerId: user.id },
    });

    const certificates = user.role === UserRole.STUDENT 
      ? user.receivedCertificates 
      : user.issuedCertificates;

    console.log('Returning certificates:', certificates.length);

    // Track analytics
    await trackAnalytics('certificates_viewed', {
      userId: user.id,
      role: user.role,
      certificatesCount: certificates.length
    });

    return NextResponse.json({
      certificates,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      type, 
      recipientWallet, 
      issuerWallet, 
      institutionId, 
      metadata,
      expiryDate 
    } = body;

    console.log('POST /api/certificates - Creating certificate for recipient:', recipientWallet);

    // Input validation
    if (!title || !type || !recipientWallet || !issuerWallet || !institutionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Object.values(CertificateType).includes(type)) {
      return NextResponse.json({ error: 'Invalid certificate type' }, { status: 400 });
    }

    // Validate wallet addresses
    try {
      new PublicKey(recipientWallet);
      new PublicKey(issuerWallet);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    // Check if recipient and issuer exist
    const [recipient, issuer] = await Promise.all([
      prisma.user.findUnique({ 
        where: { walletAddress: recipientWallet },
        include: { receivedCertificates: true }
      }),
      prisma.user.findUnique({ 
        where: { walletAddress: issuerWallet },
        include: { 
          institution: true,
          issuedCertificates: true 
        }
      })
    ]);

    console.log('Recipient found:', recipient ? 'Yes' : 'No');
    console.log('Issuer found:', issuer ? 'Yes' : 'No');

    if (!recipient || !issuer || !issuer.institution) {
      return NextResponse.json({ error: 'Invalid recipient or issuer' }, { status: 400 });
    }

    if (issuer.role !== UserRole.INSTITUTION) {
      return NextResponse.json({ error: 'Issuer must be an institution' }, { status: 403 });
    }

    if (issuer.institution.id !== institutionId) {
      return NextResponse.json({ error: 'Issuer does not belong to specified institution' }, { status: 403 });
    }

    // Generate a mock mint address for demo purposes
    // In a real implementation, you would mint an actual NFT on Solana
    const mintKeypair = Keypair.generate();
    const mintAddress = mintKeypair.publicKey.toString();

    console.log('Generated mint address:', mintAddress);

    // Create certificate with transaction
    const certificate = await prisma.$transaction(async (tx) => {
      // Create the certificate
      const cert = await tx.certificate.create({
        data: {
          title,
          type,
          metadata: {
            ...metadata,
            solanaTransaction: `mock_tx_${Date.now()}`, // Mock transaction ID
            blockchainVerified: true,
            network: 'Solana Devnet'
          },
          mintAddress,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          recipientId: recipient.id,
          issuerId: issuer.id,
          institutionId: issuer.institution!.id,
        },
        include: {
          institution: true,
          recipient: true,
          issuer: true,
        },
      });

      console.log('Certificate created with ID:', cert.id);
      return cert;
    });

    // Send notifications
    await sendNotifications(recipient.id, 'CERTIFICATE_ISSUED', {
      certificateId: certificate.id,
      title: certificate.title,
      issuer: issuer.institution.name
    });

    // Track analytics
    await trackAnalytics('certificate_issued', {
      certificateId: certificate.id,
      issuerId: issuer.id,
      recipientId: recipient.id,
      institutionId: institutionId,
      type: type
    });

    console.log('Certificate creation completed successfully');

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}