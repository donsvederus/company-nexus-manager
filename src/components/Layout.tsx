import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Settings,
  Package,
  LayoutDashboard,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            location.pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "transparent"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Services",
      href: "/services",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <div className="font-medium">Client Manager</div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-5xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
