"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  FileKey, 
  QrCode, 
  GraduationCap,
  Key,
  RefreshCw,
  Eye,
  Clock
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-10 w-10 text-blue-500" />,
    title: "Tamper-Proof Credentials",
    description: "Certificates stored on Solana blockchain cannot be altered or forged, ensuring authenticity."
  },
  {
    icon: <FileKey className="h-10 w-10 text-purple-500" />,
    title: "Encrypted Metadata",
    description: "Sensitive information is securely encrypted and stored on Arweave with permission-based access."
  },
  {
    icon: <QrCode className="h-10 w-10 text-green-500" />,
    title: "Instant Verification",
    description: "Employers can verify certificates instantly via QR code or public wallet address."
  },
  {
    icon: <Key className="h-10 w-10 text-amber-500" />,
    title: "Selective Disclosure",
    description: "Students control which parts of their credentials are visible to specific parties."
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-red-500" />,
    title: "Revocable Access",
    description: "Access to private credential data can be granted or revoked at any time."
  },
  {
    icon: <Eye className="h-10 w-10 text-teal-500" />,
    title: "Transparent History",
    description: "Complete audit trail of certificate issuance and verification is publicly available."
  }
];

export default function LandingFeatures() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure, Verifiable Academic Credentials</h2>
          <p className="text-lg text-muted-foreground">
            CertiChain leverages blockchain technology to transform how educational achievements are issued, 
            shared, and verified, creating a trustless ecosystem for academic credentials.
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
              className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}