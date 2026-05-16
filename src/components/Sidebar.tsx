"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, Receipt, FileText, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Vehicles", href: "/vehicles", icon: Truck },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null; // Hide sidebar on login page or if not logged in

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">FleetManager</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <div className="mb-4 px-3 flex flex-col">
          <span className="text-sm font-medium truncate">{session.user?.name || 'Admin User'}</span>
          <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => signOut()}>
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
