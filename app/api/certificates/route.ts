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
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';
import * as anchor from '@project-serum/anchor';
import Arweave from 'arweave';

// Initialize connections
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
const arweave = new Arweave({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

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

    if (recipient?.email) {
      // Send email notification
      await fetch(process.env.EMAIL_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient.email,
          template: 'certificate_issued',
          data
        })
      });
    }

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

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Validate wallet address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    if (!recipient || !issuer || !issuer.institution) {
      return NextResponse.json({ error: 'Invalid recipient or issuer' }, { status: 400 });
    }

    if (issuer.role !== UserRole.INSTITUTION) {
      return NextResponse.json({ error: 'Issuer must be an institution' }, { status: 403 });
    }

    // Check if institution matches
    if (issuer.institution.id !== institutionId) {
      return NextResponse.json({ error: 'Issuer does not belong to specified institution' }, { status: 403 });
    }

    // 1. Upload metadata to Arweave
    const metadataTransaction = await arweave.createTransaction({
      data: JSON.stringify({
        name: title,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        properties: {
          type,
          issuer: issuer.institution.name,
          recipient: recipient.name,
          issueDate: new Date().toISOString(),
          expiryDate: expiryDate || null
        }
      })
    });

    await arweave.transactions.sign(metadataTransaction);
    await arweave.transactions.post(metadataTransaction);
    const metadataUri = `https://arweave.net/${metadataTransaction.id}`;

    // 2. Mint NFT on Solana
    const mintKeypair = Keypair.generate();
    const mintAuthority = new PublicKey(issuerWallet);
    const recipientPublicKey = new PublicKey(recipientWallet);

    const createMintTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: mintAuthority,
        newAccountPubkey: mintKeypair.publicKey,
        space: 82,
        lamports: await connection.getMinimumBalanceForRentExemption(82),
        programId: SystemProgram.programId
      }),
      createCreateMetadataAccountV3Instruction({
        metadata: mintKeypair.publicKey,
        mint: mintKeypair.publicKey,
        mintAuthority: mintAuthority,
        payer: mintAuthority,
        updateAuthority: mintAuthority,
        data: {
          name: title,
          symbol: 'CERT',
          uri: metadataUri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null
        }
      })
    );

    const mintTxId = await sendAndConfirmTransaction(
      connection,
      createMintTx,
      [mintKeypair]
    );

    // Create certificate with transaction
    const certificate = await prisma.$transaction(async (tx) => {
      // Create the certificate
      const cert = await tx.certificate.create({
        data: {
          title,
          type,
          metadata: {
            ...metadata,
            arweaveUri: metadataUri,
            solanaTransaction: mintTxId
          },
          mintAddress: mintKeypair.publicKey.toString(),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          recipientId: recipient.id,
          issuerId: issuer.id,
          institutionId: issuer.institution.id,
        },
        include: {
          institution: true,
          recipient: true,
          issuer: true,
        },
      });

      // Update recipient and issuer certificate counts
      await Promise.all([
        tx.user.update({
          where: { id: recipient.id },
          data: { 
            receivedCertificates: { connect: { id: cert.id } }
          }
        }),
        tx.user.update({
          where: { id: issuer.id },
          data: { 
            issuedCertificates: { connect: { id: cert.id } }
          }
        })
      ]);

      return cert;
    });

    // 3. Send notifications
    await sendNotifications(recipient.id, 'CERTIFICATE_ISSUED', {
      certificateId: certificate.id,
      title: certificate.title,
      issuer: issuer.institution.name
    });

    // 4. Track analytics
    await trackAnalytics('certificate_issued', {
      certificateId: certificate.id,
      issuerId: issuer.id,
      recipientId: recipient.id,
      institutionId: institutionId,
      type: type
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}