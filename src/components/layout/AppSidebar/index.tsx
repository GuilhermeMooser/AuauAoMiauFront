import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Users, 
  Heart, 
  DollarSign, 
  Settings} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getAuth } from "@/utils/auth";

const mainItems = [
  // { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Animais", url: "/admin/animais", icon: Heart },
  { title: "Adotantes", url: "/admin/adotantes", icon: Users },
  { title: "Termos", url: "/admin/termos", icon: FileText },
];

const adminItems = [
  // { title: "Contabilidade", url: "/contabilidade", icon: DollarSign },
  { title: "Usuários", url: "/admin/usuarios", icon: Settings },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const auth = getAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50";

  const allItems = auth?.user.role.name === 'Administrador' 
    ? [...mainItems, ...adminItems] 
    : mainItems;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">Do Auau ao Miau</h2>
                <p className="text-xs text-sidebar-foreground/70">Sistema ONG</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}