import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatBox } from "@/components/chat/ChatBox";

export function ChatComponents() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isLoggedIn, user } = useSelector((state) => state.user);

  if (!isLoggedIn) return null;

  return (
    <>
      <ChatButton 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        unreadCount={unreadCount}
        isOpen={isChatOpen}
      />
      {isChatOpen && (
        <ChatBox 
          onClose={() => setIsChatOpen(false)}
          currentUser={user}
        />
      )}
    </>
  );
}