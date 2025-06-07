import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import AppRoutes from '@/routes';
import { Toaster } from "sonner";
import { ChatComponents } from './components/chat/ChatComponents';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <Provider store={store}>
      <AppRoutes />
      <ChatComponents />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: 'bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100',
          style: {
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '8px',
          },
          success: {
            className: 'bg-green-500 text-white',
          },
          error: {
            className: 'bg-red-500 text-white',
          },
        }}
      />
    </Provider>
  );
}

export default App;
