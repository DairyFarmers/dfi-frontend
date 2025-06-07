import { useState, useEffect, useRef } from "react";
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { wsService } from "@/services/websocket";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export function ChatMessages({ 
  user, 
  onBack, 
  currentUser 
}) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const [wsConnected, setWsConnected] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['chats', user.id, 'history'],
    queryFn: async () => {
      const { data } = await api.get(`/api/v1/chats/${user.id}/history/`);
      return data || [];
    },
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, 
    refetchInterval: 12000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: () => {
      toast.error('Failed to load chat history');
    }
  });

  useEffect(() => {
    const handleConnect = () => {
        console.log('WebSocket connected successfully');
        setWsConnected(true);
    };

    const handleDisconnect = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
    };

    const handleError = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
    };

    // Add listeners
    wsService.addConnectListener(handleConnect);
    wsService.addDisconnectListener(handleDisconnect);
    wsService.addErrorListener(handleError);

    // Connect to WebSocket
    wsService.connect(currentUser.id);

    // Cleanup listeners on unmount
    return () => {
        wsService.removeConnectListener(handleConnect);
        wsService.removeDisconnectListener(handleDisconnect);
        wsService.removeErrorListener(handleError);
        wsService.disconnect();
    };
  }, [currentUser.id]);

  useEffect(() => {
    const subscriptionId = wsService.subscribe((data) => {
      if (data.type === 'chat_message') {
        const isRelevantMessage = 
          (data.sender.id === user.id && data.receiver.id === currentUser.id) ||
          (data.sender.id === currentUser.id && data.receiver.id === user.id);

        if (isRelevantMessage) {          
          queryClient.setQueryData(['chats', user.id, 'history'], (old) => {
            const currentMessages = old || [];
            // Avoid duplicate messages
            if (!currentMessages.find(m => m.id === data.id)) {
              return [...currentMessages, data];
            }
            return currentMessages;
          });

          // Mark message as read if we're the receiver
          if (data.receiver.id === currentUser.id) {
            api.post(`/api/v1/chats/${data.id}/mark_read/`);
          }

          // Scroll to bottom for new messages
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    });

    return () => wsService.unsubscribe(subscriptionId);
  }, [user.id, currentUser.id, queryClient]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !wsConnected) {
      if (!wsConnected) toast.error('Connecting to chat service...');
      return;
    }

    const messageText = message.trim();
    const sent = wsService.sendMessage(user.id, messageText);
    
    if (sent) {
      const newMessage = {
        id: `temp-${Date.now()}`,
        type: 'chat_message',
        text: messageText,
        sender: currentUser,
        receiver: user,
        timestamp: new Date().toISOString(),
        is_read: false
      };

      // Optimistically update the UI
      queryClient.setQueryData(['chats', user.id, 'history'], (old) => {
        const currentMessages = old || [];
        return [...currentMessages, newMessage];
      });

      setMessage("");
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="flex h-[500px] flex-col">
      <div className="flex items-center gap-3 border-b p-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user?.first_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user?.first_name}</p>
          <p className="text-xs text-muted-foreground">{user?.role_name}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender.id === currentUser?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender.id === currentUser.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="mt-1 text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            disabled={!message.trim()}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}