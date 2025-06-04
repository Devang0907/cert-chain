"use client";

import { CertificatesList } from "@/components/dashboard/certificates-list";

export default function CertificatesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      <CertificatesList />
    </div>
  );
}