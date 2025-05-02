
import { Building, Home, List, PlusSquare } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-brand-700" />
          <h1 className="text-xl font-bold">ClientNexus</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive("/") && "bg-brand-50 text-brand-700 font-medium"
                )}>
                  <a href="/">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive("/clients") && "bg-brand-50 text-brand-700 font-medium"
                )}>
                  <a href="/clients">
                    <List className="h-5 w-5" />
                    <span>Client List</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={cn(
                  isActive("/clients/new") && "bg-brand-50 text-brand-700 font-medium"
                )}>
                  <a href="/clients/new">
                    <PlusSquare className="h-5 w-5" />
                    <span>Add New Client</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-3">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
