import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  FileText, 
  Menu,
  Milk,
  Truck,
  Warehouse
} from "lucide-react";
import { navigationConfig } from "../../config/nav-config";
import { PermissionGuard } from "@/components/common/PermissionGuard";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const navigation = navigationConfig[
    user?.role?.name || 'farmer'
  ] || [];

  const navigationWithCurrent = navigation.map(item => ({
    ...item,
    current: item.href === location.pathname
  }));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-background border border-border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>
      
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full border-r border-sidebar-border transition-all duration-300 ease-in-out",
        // Solid background for mobile, sidebar background for desktop
        "bg-white dark:bg-black lg:bg-sidebar-background",
        // Desktop behavior
        "hidden lg:block",
        collapsed ? "lg:w-16" : "lg:w-64",
        // Mobile behavior
        mobileOpen ? "block w-64 shadow-xl" : "hidden"
      )}>
        {/* Logo and brand */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 bg-sidebar-primary rounded-lg">
            <div className="p-3 bg-primary rounded-xl">
              <Warehouse className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          {(!collapsed || mobileOpen) && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Dairy Farmers</h1>
              <p className="text-sm text-sidebar-foreground/60">Inventory Solution</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationWithCurrent?.map((item) => {
            const Icon = item.icon;
            return (
              <PermissionGuard 
                key={item.name}
                permissions={item.permission}
                fallback={null}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    item.current && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                    collapsed && !mobileOpen && "justify-center px-2"
                  )}
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <a href={item.href}>
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {(!collapsed || mobileOpen) && <span>{item.name}</span>}
                  </a>
                </Button>
              </PermissionGuard>
            );
          })}
        </nav>

        {/* Collapse toggle - only on desktop */}
        <div className="hidden lg:block absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content spacer - only on desktop */}
      <div className={cn("hidden lg:block transition-all duration-300", collapsed ? "lg:ml-16" : "lg:ml-64")} />
    </>
  );
} 