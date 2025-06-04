import { DashboardOverview } from "@/components/dashboard/overview";
import { CertificatesList } from "@/components/dashboard/certificates-list";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RoleCheck } from "@/components/dashboard/role-check";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <RoleCheck />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardOverview />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CertificatesList />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}