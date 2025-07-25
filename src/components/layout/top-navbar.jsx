import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  MapPin, 
  Box, 
  FileText, 
  User2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useSearch } from '@/hooks/useSearch';

export default function TopNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const logoutLoading = useSelector((state) => state.user.loading);

  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    handleNavigate 
  } = useSearch();
  
  const { 
    data: notifications, refetch: 
    refetchNotifications 
  } = useNotifications();
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const formatRole = (role) => {
    if (typeof role === 'string') {
      return role.replace(/_/g, ' ').toLowerCase();
    }
    if (role?.name) {
      return role.name.replace(/_/g, ' ').toLowerCase();
    }
    return 'user'; // default fallback
  };

  const handleNotify = () => {
    refetchNotifications();
    navigate("/notifications"); 
  };

  const unreadCount = notifications?.data?.stats?.unread_count || 0;

  const handleSettings = () => {
    navigate("/settings");
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Search - hidden on mobile to make room for hamburger menu */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md ml-0 lg:ml-0">
      <Popover>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring w-full"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[400px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    'No results found.'
                  )}
                </CommandEmpty>
                {results?.map((group) => (
                  <CommandGroup key={group.type} heading={group.type}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleNavigate(item)}
                      >
                        <div className="flex items-center">
                          {item.type === 'product' && <Box className="w-4 h-4 mr-2" />}
                          {item.type === 'order' && <FileText className="w-4 h-4 mr-2" />}
                          {item.type === 'customer' && <User2 className="w-4 h-4 mr-2" />}
                          <span>{item.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          {item.subtitle}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Mobile: Just show app title */}
      <div className="md:hidden flex-1 ml-16">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative" 
          onClick={handleNotify}
        >
          <Bell className="h-5 w-5"/>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-auto p-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-foreground">
                  {user?.full_name || user}
                </div>
                {/*
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.is_verified ? "Verified" : "Unverified"}
                </div>
                */}
              </div>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {formatRole(user?.role)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
              disabled={logoutLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 