class WebSocketService {
    constructor() {
      this.ws = null;
      this.subscribers = new Map();
      this.baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
      this.connectListeners = new Set();
      this.disconnectListeners = new Set();
      this.errorListeners = new Set();
    }
  
    connect(userId) {
      const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];

      const wsUrl = new URL(`${this.baseUrl}/ws/chat/${userId}/`);

      if (csrfToken) {
        wsUrl.searchParams.append('X-CSRFToken', csrfToken);
      }

      this.ws = new WebSocket(wsUrl.toString());
      
      this.ws.onopen = () => {
        this.connectListeners.forEach(listener => listener());
      };

      this.ws.onclose = () => {
          this.disconnectListeners.forEach(listener => listener());
      };

      this.ws.onerror = (error) => {
          this.errorListeners.forEach(listener => listener(error));
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifySubscribers(data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
      };
    }

    disconnect() {
      if (this.ws) {
          this.ws.close();
          this.ws = null;
          // Notify disconnect listeners
          this.disconnectListeners.forEach(listener => listener());
      }
    }

    addConnectListener(listener) {
      this.connectListeners.add(listener);
    }

    addDisconnectListener(listener) {
        this.disconnectListeners.add(listener);
    }

    addErrorListener(listener) {
        this.errorListeners.add(listener);
    }

    removeConnectListener(listener) {
        this.connectListeners.delete(listener);
    }

    removeDisconnectListener(listener) {
        this.disconnectListeners.delete(listener);
    }

    removeErrorListener(listener) {
        this.errorListeners.delete(listener);
    }

    subscribe(callback) {
      const id = Math.random().toString(36).slice(2);
      this.subscribers.set(id, callback);
      return id;
    }

    unsubscribe(id) {
        this.subscribers.delete(id);
    }

    notifySubscribers(data) {
      this.subscribers.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
    
    sendMessage(receiverId, text) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const message = {
          type: 'chat_message',
          receiver_id: receiverId,
          text: text
        };
        this.ws.send(JSON.stringify(message));
        return true;
      }
      console.error('WebSocket is not connected');
      return false;
    }
}
  
export const wsService = new WebSocketService();