import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
  }

  connect() {
    if (!this.socket) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available for socket connection');
        return;
      }

      this.socket = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.socket.connect();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            this.socket.connect();
          }, this.reconnectDelay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.reconnectAttempts = 0;
    }
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  // Unsubscribe from events
  unsubscribe(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export default socketService; 