import { he } from "date-fns/locale";
import { Message, ChatRoom, UserStatus } from "../types";
import userService from "./user.service";
import authService from "./auth.service";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const users = await userService.getUsers({});

const rooms = await fetch(`${baseUrl}/chat-room`).then(res => res.json()) as ChatRoom[];

// Generate direct message rooms for each user pair
users.forEach((user, i) => {
  users.slice(i + 1).forEach(otherUser => {
    const dmRoomId = `dm-${user.id}-${otherUser.id}`;
    rooms.push({
      id: dmRoomId,
      name: `${user.UserProfile?.name} & ${otherUser.UserProfile?.name}`,
      createdBy: user.id,
      createdAt: new Date(Date.now() - 3600000 * 100).toISOString(),
      members: [user.id, otherUser.id],
      isDirectMessage: true
    });
  });
});

let userStatuses: UserStatus[] = users.map(user => ({
  userId: user.id,
  status: Math.random() > 0.3 ? 'online' : 'offline',
  lastSeen: new Date().toISOString()
}));

export const ChatService = {
  // Get messages for a specific room or direct conversation
  getMessages: async (roomId?: string, userId?: number, otherUserId?: number): Promise<Message[]> => {
    const response = await fetch(`${baseUrl}/message/${roomId ? `room/${roomId}` : `users/${userId}/${otherUserId}`}`, {
      method: 'GET',
      headers: authService.getAuthHeaders()
    });
    return response.json();
  },

  // Send a new message
  sendMessage: async (message: Omit<Message, 'timestamp' | 'isRead'>): Promise<Message> => {
    const response = await fetch(`${baseUrl}/message`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        isRead: false
      })
    });
    return response.json();
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]): Promise<boolean> => {
    const response = await fetch(`${baseUrl}/message/read`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ messageIds })
    });
    return response.ok;
  },

  // Get all chat rooms
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await fetch(`${baseUrl}/chat-room`, {
      method: 'GET',
      headers: authService.getAuthHeaders()
    });
    return response.json();
  },

  // Create a new chat room
  createRoom: async (room: Omit<ChatRoom, 'createdAt'>): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(room)
    });
    return response.json();
  },

  // Add members to a room
  addRoomMembers: async (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room/${roomId}/add-members`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ memberIds })
    });
    return response.json();
  },

  // Remove members from a room
  removeRoomMembers: async (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room/${roomId}/remove-members`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ memberIds })
    });
    return response.json(); 
  },

  // Get user statuses
  getUserStatuses: (): Promise<UserStatus[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...userStatuses]);
      }, 200);
    });
  },

  // Update user status
  updateUserStatus: (userId: number, status: 'online' | 'offline' | 'away' | 'busy'): Promise<UserStatus> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = userStatuses.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
          // Create new status if it doesn't exist
          const newStatus: UserStatus = {
            userId,
            status,
            lastSeen: new Date().toISOString()
          };

          userStatuses = [...userStatuses, newStatus];

          // This is where you would emit a socket.io event
          // socket.emit('user_status_changed', newStatus);

          resolve(newStatus);
          return;
        }

        const updatedStatus: UserStatus = {
          ...userStatuses[userIndex],
          status,
          lastSeen: new Date().toISOString()
        };

        userStatuses = [
          ...userStatuses.slice(0, userIndex),
          updatedStatus,
          ...userStatuses.slice(userIndex + 1)
        ];

        // This is where you would emit a socket.io event
        // socket.emit('user_status_changed', updatedStatus);

        resolve(updatedStatus);
      }, 200);
    });
  },

  // Get direct message room ID for two users
  getDirectMessageRoomId: (userId1: number, userId2: number): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sort user IDs to ensure consistent room ID
        const [smallerId, largerId] = [userId1, userId2].sort((a, b) => a - b);
        const dmRoomId = `dm-${smallerId}-${largerId}`;

        const room = rooms.find(r => r.id === dmRoomId);
        resolve(room ? room.id : null);
      }, 100);
    });
  }
};