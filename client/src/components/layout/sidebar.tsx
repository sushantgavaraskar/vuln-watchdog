import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Folder,
  Bell,
  User,
  Settings,
  Home,
  Upload,
  TrendingUp,
  Users
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Scan Files", href: "/scan", icon: Upload },
  { name: "Vulnerabilities", href: "/vulnerabilities", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const userNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Team", href: "/team", icon: Users },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn("flex h-full w-64 flex-col bg-gradient-card border-r border-security", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-security">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-security">VulnWatch</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </h3>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-smooth",
                    isActive && "bg-primary/10 text-primary shadow-glow"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User Navigation */}
        <div className="mt-8 space-y-1">
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </h3>
          {userNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-smooth",
                    isActive && "bg-primary/10 text-primary shadow-glow"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}