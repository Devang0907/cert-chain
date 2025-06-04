"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function LandingRoles() {
  const { connected } = useWallet();

  const roles = [
    {
      icon: <Building2 className="h-12 w-12 mb-4 text-blue-500" />,
      title: "For Institutions",
      description: "Issue tamper-proof digital credentials that can be instantly verified worldwide. Reduce administrative overhead and prevent certificate fraud.",
      features: ["Bulk certificate issuance", "Credential templates", "Revocation controls", "Analytics dashboard"],
      cta: "Issue Credentials"
    },
    {
      icon: <GraduationCap className="h-12 w-12 mb-4 text-purple-500" />,
      title: "For Students",
      description: "Own your academic achievements with blockchain-verified credentials that you control. Share selectively with employers and other parties.",
      features: ["Secure wallet storage", "Selective sharing", "Privacy controls", "Permanent records"],
      cta: "Manage Certificates",
      primary: true
    },
    {
      icon: <Briefcase className="h-12 w-12 mb-4 text-green-500" />,
      title: "For Employers",
      description: "Verify academic credentials instantly without contacting institutions. Ensure candidates have the qualifications they claim.",
      features: ["Instant verification", "QR code scanning", "Bulk verification", "Verification API"],
      cta: "Verify Credentials"
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Solutions for Everyone</h2>
          <p className="text-lg text-muted-foreground">
            CertiChain provides tailored solutions for all participants in the educational ecosystem.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-lg ${role.primary ? 'border-2 border-primary' : 'border border-border'}`}
            >
              {role.primary && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 transform rotate-45 translate-x-6 translate-y-3">
                    Popular
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <div className="flex flex-col items-center text-center">
                  {role.icon}
                  <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {connected ? (
                    <Link href="/dashboard">
                      <Button className={`${role.primary ? 'bg-primary' : 'bg-secondary'} w-full`}>
                        {role.cta}
                      </Button>
                    </Link>
                  ) : (
                    <div className="w-full">
                      <WalletMultiButton className="phantom-button-roles w-full" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}