
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Settings,
  Package,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRole } from "@/types/auth";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
    requiredRole?: UserRole;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const { hasRole } = useAuth();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        // If item requires a role and user doesn't have it, don't show the item
        if (item.requiredRole && !hasRole(item.requiredRole)) {
          return null;
        }
        
        return (
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
        );
      })}
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const sidebarNavItems: {
    title: string;
    href: string;
    icon: React.ReactNode;
    requiredRole?: UserRole;
  }[] = [
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
      requiredRole: "admin"
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      requiredRole: "admin"
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="font-medium">Client Manager</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              {user?.name} ({user?.role})
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
            <div className="px-3 py-2 mt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </aside>
          <div className="flex-1 lg:max-w-5xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
