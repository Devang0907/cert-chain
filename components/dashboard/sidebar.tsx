"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Award, 
  Share2, 
  Building2, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { connected, publicKey } = useWallet();
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!connected || !publicKey) return;

      try {
        const response = await fetch(`/api/users?wallet=${publicKey.toString()}`);
        if (response.ok) {
          const userData = await response.json();
          if (userData) {
            setUserRole(userData.role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, [connected, publicKey]);

  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "My Certificates",
        href: "/dashboard/certificates",
        icon: <Award className="h-5 w-5" />,
      },
    ];

    if (userRole === 'STUDENT') {
      return [
        ...baseItems,
        {
          title: "Share",
          href: "/dashboard/share",
          icon: <Share2 className="h-5 w-5" />,
        },
        {
          title: "Institutions",
          href: "/dashboard/institutions",
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    } else if (userRole === 'INSTITUTION') {
      return [
        ...baseItems,
        {
          title: "Issue Certificate",
          href: "/dashboard/issue",
          icon: <Plus className="h-5 w-5" />,
        },
        {
          title: "Recipients",
          href: "/dashboard/recipients",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    }
  };

  const navItems = getNavItems();
  
  return (
    <aside className={cn(
      "bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center border-b px-4">
          <Link href="/" className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "space-x-2"
          )}>
            <GraduationCap className="h-6 w-6 text-primary" />
            {!collapsed && <span className="font-bold text-lg">CertiChain</span>}
          </Link>
        </div>
        
        <div className="flex-1 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center h-10 mx-2 px-4 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === item.href && "bg-accent text-accent-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </div>
        
        <div className="border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" />: (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}