"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  FileKey, 
  QrCode, 
  Key,
  RefreshCw,
  Eye,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-12 w-12 text-blue-500" />,
    title: "Tamper-Proof Credentials",
    description: "Certificates stored on Solana blockchain cannot be altered or forged, ensuring authenticity.",
    details: [
      "Immutable blockchain records",
      "Cryptographic verification",
      "Permanent proof of existence",
      "Transparent audit trail"
    ]
  },
  {
    icon: <FileKey className="h-12 w-12 text-purple-500" />,
    title: "Encrypted Metadata",
    description: "Sensitive information is securely encrypted and stored on Arweave with permission-based access.",
    details: [
      "End-to-end encryption",
      "Granular access control",
      "Secure key management",
      "Zero-knowledge proofs"
    ]
  },
  {
    icon: <QrCode className="h-12 w-12 text-green-500" />,
    title: "Instant Verification",
    description: "Employers can verify certificates instantly via QR code or public wallet address.",
    details: [
      "One-click verification",
      "Mobile-friendly QR scanning",
      "Real-time validation",
      "Offline verification support"
    ]
  },
  {
    icon: <Key className="h-12 w-12 text-amber-500" />,
    title: "Selective Disclosure",
    description: "Students control which parts of their credentials are visible to specific parties.",
    details: [
      "Privacy-preserving sharing",
      "Customizable visibility",
      "Time-based access",
      "Revocable permissions"
    ]
  },
  {
    icon: <RefreshCw className="h-12 w-12 text-red-500" />,
    title: "Revocable Access",
    description: "Access to private credential data can be granted or revoked at any time.",
    details: [
      "Dynamic access control",
      "Audit logging",
      "Emergency revocation",
      "Access expiration"
    ]
  },
  {
    icon: <Eye className="h-12 w-12 text-teal-500" />,
    title: "Transparent History",
    description: "Complete audit trail of certificate issuance and verification is publicly available.",
    details: [
      "Verification timestamps",
      "Access history",
      "Chain of custody",
      "Public verifiability"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure, Verifiable Academic Credentials
          </h1>
          <p className="text-xl text-muted-foreground">
            CertiChain leverages blockchain technology to transform how educational 
            achievements are issued, shared, and verified.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}