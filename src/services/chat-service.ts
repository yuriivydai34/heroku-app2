import { Message, ChatRoom, UserStatus } from "../types";
import { v4 as uuidv4 } from "uuid";
import { mockUsers } from "../data/mock-users";

// Mock storage for messages, rooms, and user statuses
let messages: Message[] = [
  {
    id: "1",
    content: "Hi there! How's the project going?",
    senderId: 4,
    receiverId: 1,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    isRead: true
  },
  {
    id: "2",
    content: "It's going well. I've completed the documentation.",
    senderId: 1,
    receiverId: 4,
    timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
    isRead: true
  },
  {
    id: "3",
    content: "Great! Let's discuss the next steps.",
    senderId: 4,
    receiverId: 1,
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    isRead: true
  },
  {
    id: "4",
    content: "Team, we need to finalize the UI designs by Friday.",
    senderId: 4,
    roomId: "team-room",
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    isRead: true
  },
  {
    id: "5",
    content: "I'll have the mockups ready by tomorrow.",
    senderId: 2,
    roomId: "team-room",
    timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
    isRead: true
  },
  {
    id: "6",
    content: "I've started testing the new features.",
    senderId: 3,
    roomId: "team-room",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    isRead: true
  }
];

let rooms: ChatRoom[] = [
  {
    id: "team-room",
    name: "Project Team",
    createdBy: 4,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    members: [1, 2, 3, 4, 5]
  },
  {
    id: "dev-room",
    name: "Development",
    createdBy: 1,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    members: [1, 3, 5]
  }
];

// Generate direct message rooms for each user pair
mockUsers.forEach((user, i) => {
  mockUsers.slice(i + 1).forEach(otherUser => {
    const dmRoomId = `dm-${user.id}-${otherUser.id}`;
    rooms.push({
      id: dmRoomId,
      name: `${user.name} & ${otherUser.name}`,
      createdBy: user.id,
      createdAt: new Date(Date.now() - 3600000 * 100).toISOString(),
      members: [user.id, otherUser.id],
      isDirectMessage: true
    });
  });
});

let userStatuses: UserStatus[] = mockUsers.map(user => ({
  userId: user.id,
  status: Math.random() > 0.3 ? 'online' : 'offline',
  lastSeen: new Date().toISOString()
}));

export const ChatService = {
  // Get messages for a specific room or direct conversation
  getMessages: (roomId?: string, userId?: number, otherUserId?: number): Promise<Message[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredMessages: Message[];
        
        if (roomId) {
          // Get room messages
          filteredMessages = messages.filter(m => m.roomId === roomId);
        } else if (userId && otherUserId) {
          // Get direct messages between two users
          filteredMessages = messages.filter(m => 
            (m.senderId === userId && m.receiverId === otherUserId) || 
            (m.senderId === otherUserId && m.receiverId === userId)
          );
        } else {
          filteredMessages = [];
        }
        
        // Sort by timestamp
        filteredMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        resolve([...filteredMessages]);
      }, 300);
    });
  },

  // Send a new message
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        messages = [...messages, newMessage];
        
        // This is where you would emit a socket.io event
        // socket.emit('new_message', newMessage);
        
        resolve(newMessage);
      }, 200);
    });
  },

  // Mark messages as read
  markAsRead: (messageIds: string[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        messages = messages.map(message => 
          messageIds.includes(message.id) 
            ? { ...message, isRead: true } 
            : message
        );
        
        resolve(true);
      }, 200);
    });
  },

  // Get all chat rooms
  getRooms: (): Promise<ChatRoom[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...rooms]);
      }, 300);
    });
  },

  // Create a new chat room
  createRoom: (room: Omit<ChatRoom, 'id' | 'createdAt'>): Promise<ChatRoom> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRoom: ChatRoom = {
          ...room,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };
        
        rooms = [...rooms, newRoom];
        
        // This is where you would emit a socket.io event
        // socket.emit('new_room', newRoom);
        
        resolve(newRoom);
      }, 300);
    });
  },

  // Add members to a room
  addRoomMembers: (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const roomIndex = rooms.findIndex(r => r.id === roomId);
        
        if (roomIndex === -1) {
          reject(new Error(`Room with ID ${roomId} not found`));
          return;
        }
        
        const room = rooms[roomIndex];
        const updatedMembers = [...new Set([...room.members, ...memberIds])];
        
        const updatedRoom: ChatRoom = {
          ...room,
          members: updatedMembers
        };
        
        rooms = [
          ...rooms.slice(0, roomIndex),
          updatedRoom,
          ...rooms.slice(roomIndex + 1)
        ];
        
        // This is where you would emit a socket.io event
        // socket.emit('room_members_updated', { roomId, members: updatedMembers });
        
        resolve(updatedRoom);
      }, 300);
    });
  },

  // Remove members from a room
  removeRoomMembers: (roomId: string, memberIds: number[]): Promise<ChatRoom> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const roomIndex = rooms.findIndex(r => r.id === roomId);
        
        if (roomIndex === -1) {
          reject(new Error(`Room with ID ${roomId} not found`));
          return;
        }
        
        const room = rooms[roomIndex];
        const updatedMembers = room.members.filter(id => !memberIds.includes(id));
        
        const updatedRoom: ChatRoom = {
          ...room,
          members: updatedMembers
        };
        
        rooms = [
          ...rooms.slice(0, roomIndex),
          updatedRoom,
          ...rooms.slice(roomIndex + 1)
        ];
        
        // This is where you would emit a socket.io event
        // socket.emit('room_members_updated', { roomId, members: updatedMembers });
        
        resolve(updatedRoom);
      }, 300);
    });
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