import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChatButton({ 
  onClick, 
  unreadCount = 0, 
  isOpen = false,
  className 
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90",
        "transition-transform duration-200 ease-in-out",
        isOpen && "rotate-180",
        className
      )}
      size="icon"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
    >
      <div className="relative">
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-3 -right-3 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium"
                variant="destructive"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </>
        )}
      </div>
    </Button>
  );
}