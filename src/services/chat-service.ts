import { Message, ChatRoom, UserStatus, UserData, MessageRequest } from "@/types";
import authService from "./auth.service";

import { io, Socket } from "socket.io-client";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}`;

export const socket: Socket = io(baseUrl, {
  auth: {
    userId: authService.getCurrentUserId()
  }
});

export const ChatService = {
  // Get messages for a specific room or direct conversation
  getMessages: async (roomId?: string, userId?: number, otherUserId?: number): Promise<Message[]> => {
    const response = await fetch(
      roomId
        ? `${baseUrl}/message/room/${roomId}`
        : `${baseUrl}/message/users/${userId}/${otherUserId}`,
      {
        method: "GET",
        headers: authService.getAuthHeaders(),
      }
    );
    if (!response.ok) return Promise.reject(new Error("Failed to fetch messages"));
    return response.json();
  },

  // Send a new message
  sendMessage: async (message: Omit<MessageRequest, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
    socket.emit('new_message', message); // Emit via socket.io for real-time updates
    
    const response = await fetch(`${baseUrl}/message`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(message)
    });
    if (!response.ok) return Promise.reject(new Error("Failed to send message"));
    return response.json();
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]): Promise<boolean> => {
    const response = await fetch(`${baseUrl}/message/read`, {
      method: "PUT",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ messageIds })
    });
    return response.json();
  },

  // Get all chat rooms
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await fetch(`${baseUrl}/chat-room`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    return response.json();
  },

  // Create a new chat room
  createRoom: async (room: Omit<ChatRoom, 'id' | 'createdAt'>): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(room)
    });
    if (!response.ok) return Promise.reject(new Error("Failed to create room"));
    return response.json();
    // This is where you would emit a socket.io event
    // socket.emit('new_room', newRoom);
  },

  // Add members to a room
  addRoomMembers: async (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room/${roomId}/members`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ memberIds })
    });
    if (!response.ok) return Promise.reject(new Error("Failed to add room members"));

    // This is where you would emit a socket.io event
    // socket.emit('room_members_updated', { roomId, members: updatedMembers });

    return response.json();
  },

  // Remove members from a room
  removeRoomMembers: async (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    const response = await fetch(`${baseUrl}/chat-room/${roomId}/members`, {
      method: "DELETE",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ memberIds })
    });
    if (!response.ok) return Promise.reject(new Error("Failed to remove room members"));

    // This is where you would emit a socket.io event
    // socket.emit('room_members_updated', { roomId, members: updatedMembers });

    return response.json();
  },

  // Get user statuses
  getUserStatuses: async (): Promise<UserStatus[]> => {
    const response = await fetch(`${baseUrl}/users`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    const users: UserData[] = await response.json();
    return users.map(user => ({
      userId: user.id,
      status: user.status,
      lastSeen: new Date().toISOString()
    }));
  },

  // Get direct message room ID for two users
  getDirectMessageRoomId: async (userId1: number, userId2: number): Promise<string | null> => {
    const [smallerId, largerId] = [userId1, userId2].sort((a, b) => a - b);
    const dmRoomId = `dm-${smallerId}-${largerId}`;

    const response = await fetch(`${baseUrl}/chat-room/${dmRoomId}`, {
      method: "GET",
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) return Promise.reject(new Error("Failed to fetch direct message room"));

    let data: any = {};
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    }

    if (data.roomId === dmRoomId) {
      return dmRoomId;
    } else {
      return null;
    }
  }
};