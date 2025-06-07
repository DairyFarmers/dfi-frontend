import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { UserSearch } from "./UserSearch";
import { ChatMessages } from "./ChatMessages";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ChatBox({ onClose, currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: activeChats = [] } = useQuery({
    queryKey: ['chats', 'active'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/v1/chats/active_chats/');
        return data || [];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 10000, // Refresh every 10 seconds
    onError: () => {
      toast.error('Failed to fetch active chats');
    }
  });

  return (
    <div className="fixed bottom-20 right-4 w-96 rounded-lg border bg-background shadow-xl">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">Messages</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="chats" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="chats" className="flex-1">Recent Chats</TabsTrigger>
          <TabsTrigger value="search" className="flex-1">Search Users</TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="h-[400px] border-b">
          <ScrollArea className="h-full">
            {activeChats?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No active chats
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {activeChats?.map(chat => (
                  <button
                    key={chat.user.id}
                    onClick={() => setSelectedUser(chat.user)}
                    className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback>{chat.user.first_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{chat.user.first_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.last_message}
                      </p>
                    </div>
                    {chat.unread_count > 0 && (
                      <Badge variant="destructive" className="rounded-full px-2 py-0.5">
                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="search" className="h-[400px] border-b">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <UserSearch 
                query={searchQuery} 
                onSelectUser={setSelectedUser}
                currentUser={currentUser}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <div className="absolute inset-0 bg-background">
          <ChatMessages 
            user={selectedUser} 
            onBack={() => setSelectedUser(null)}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
}