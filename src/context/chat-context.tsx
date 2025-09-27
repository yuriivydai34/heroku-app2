import React from "react";
import { Message, ChatRoom, UserStatus, UploadedFile } from "../types";
import { ChatService } from "../services/chat-service";
import { useFileContext } from "./file-context";

interface ChatContextType {
  messages: Message[];
  rooms: ChatRoom[];
  userStatuses: UserStatus[];
  activeRoomId: string | null;
  activeDirectUserId: number | null;
  unreadCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, files?: UploadedFile[]) => Promise<Message>;
  fetchMessages: (roomId?: string, otherUserId?: number) => Promise<void>;
  fetchRooms: () => Promise<void>;
  fetchUserStatuses: () => Promise<void>;
  createRoom: (name: string, members: number[]) => Promise<ChatRoom>;
  setActiveRoom: (roomId: string | null) => void;
  setActiveDirectUser: (userId: number | null) => void;
  getUnreadCount: (roomId: string) => number;
  markMessagesAsRead: (messageIds: string[]) => Promise<void>;
  getCurrentUserId: () => number;
}

const ChatContext = React.createContext<ChatContextType>({
  messages: [],
  rooms: [],
  userStatuses: [],
  activeRoomId: null,
  activeDirectUserId: null,
  unreadCounts: {},
  loading: false,
  error: null,
  sendMessage: async () => ({} as Message),
  fetchMessages: async () => {},
  fetchRooms: async () => {},
  fetchUserStatuses: async () => {},
  createRoom: async () => ({} as ChatRoom),
  setActiveRoom: () => {},
  setActiveDirectUser: () => {},
  getUnreadCount: () => 0,
  markMessagesAsRead: async () => {},
  getCurrentUserId: () => 1,
});

export const useChatContext = () => React.useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [userStatuses, setUserStatuses] = React.useState<UserStatus[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [activeDirectUserId, setActiveDirectUserId] = React.useState<number | null>(null);
  const [unreadCounts, setUnreadCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const { selectedFiles, clearSelectedFiles } = useFileContext();
  
  // For demo purposes, we'll use a fixed current user ID
  const currentUserId = 1; // John Doe
  
  const fetchMessages = React.useCallback(async (roomId?: string, otherUserId?: number) => {
    setLoading(true);
    setError(null);
    try {
      let fetchedMessages: Message[] = [];
      
      if (roomId) {
        fetchedMessages = await ChatService.getMessages(roomId);
      } else if (otherUserId) {
        fetchedMessages = await ChatService.getMessages(undefined, currentUserId, otherUserId);
      }
      
      setMessages(fetchedMessages);
      
      // Mark messages as read
      const unreadMessageIds = fetchedMessages
        .filter(m => !m.isRead && m.senderId !== currentUserId)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        await ChatService.markAsRead(unreadMessageIds);
      }
      
      // Update unread counts
      calculateUnreadCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);
  
  const fetchRooms = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRooms = await ChatService.getRooms();
      setRooms(fetchedRooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchUserStatuses = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedStatuses = await ChatService.getUserStatuses();
      setUserStatuses(fetchedStatuses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user statuses");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const sendMessage = React.useCallback(async (content: string, files?: UploadedFile[]): Promise<Message> => {
    setLoading(true);
    setError(null);
    try {
      let newMessage: Omit<Message, 'id' | 'timestamp' | 'isRead'>;
      
      if (activeRoomId) {
        newMessage = {
          content,
          senderId: currentUserId,
          roomId: activeRoomId,
          files
        };
      } else if (activeDirectUserId) {
        newMessage = {
          content,
          senderId: currentUserId,
          receiverId: activeDirectUserId,
          files
        };
      } else {
        throw new Error("No active conversation selected");
      }
      
      const sentMessage = await ChatService.sendMessage(newMessage);
      setMessages(prev => [...prev, sentMessage]);
      
      // Clear selected files after sending
      clearSelectedFiles();
      
      return sentMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activeRoomId, activeDirectUserId, currentUserId, clearSelectedFiles]);
  
  const createRoom = React.useCallback(async (name: string, members: number[]): Promise<ChatRoom> => {
    setLoading(true);
    setError(null);
    try {
      // Always include current user in the room
      const allMembers = [...new Set([...members, currentUserId])];
      
      const newRoom = await ChatService.createRoom({
        name,
        createdBy: currentUserId,
        members: allMembers
      });
      
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);
  
  const setActiveRoom = React.useCallback((roomId: string | null) => {
    setActiveRoomId(roomId);
    setActiveDirectUserId(null);
    
    if (roomId) {
      fetchMessages(roomId);
    } else {
      setMessages([]);
    }
  }, [fetchMessages]);
  
  const setActiveDirectUser = React.useCallback(async (userId: number | null) => {
    setActiveDirectUserId(userId);
    setActiveRoomId(null);
    
    if (userId) {
      // Check if a direct message room already exists
      const dmRoomId = await ChatService.getDirectMessageRoomId(currentUserId, userId);
      
      if (dmRoomId) {
        setActiveRoomId(dmRoomId);
        fetchMessages(dmRoomId);
      } else {
        // If no DM room exists, fetch direct messages
        fetchMessages(undefined, userId);
      }
    } else {
      setMessages([]);
    }
  }, [currentUserId, fetchMessages]);
  
  const calculateUnreadCounts = React.useCallback(async () => {
    try {
      const allRooms = await ChatService.getRooms();
      const counts: Record<string, number> = {};
      
      // For each room, get messages and count unread ones
      for (const room of allRooms) {
        const roomMessages = await ChatService.getMessages(room.id);
        counts[room.id] = roomMessages.filter(m => !m.isRead && m.senderId !== currentUserId).length;
      }
      
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Failed to calculate unread counts:", error);
    }
  }, [currentUserId]);
  
  const getUnreadCount = React.useCallback((roomId: string): number => {
    return unreadCounts[roomId] || 0;
  }, [unreadCounts]);
  
  const markMessagesAsRead = React.useCallback(async (messageIds: string[]): Promise<void> => {
    try {
      await ChatService.markAsRead(messageIds);
      
      // Update local messages
      setMessages(prev => 
        prev.map(message => 
          messageIds.includes(message.id) 
            ? { ...message, isRead: true } 
            : message
        )
      );
      
      // Update unread counts
      calculateUnreadCounts();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  }, [calculateUnreadCounts]);
  
  const getCurrentUserId = React.useCallback(() => {
    return currentUserId;
  }, [currentUserId]);
  
  // Initialize data
  React.useEffect(() => {
    fetchRooms();
    fetchUserStatuses();
    calculateUnreadCounts();
    
    // In a real app, you would set up socket.io listeners here
    // socket.on('new_message', handleNewMessage);
    // socket.on('message_read', handleMessageRead);
    // socket.on('user_status_changed', handleUserStatusChanged);
    
    // return () => {
    //   socket.off('new_message', handleNewMessage);
    //   socket.off('message_read', handleMessageRead);
    //   socket.off('user_status_changed', handleUserStatusChanged);
    // };
  }, [fetchRooms, fetchUserStatuses, calculateUnreadCounts]);
  
  const value = {
    messages,
    rooms,
    userStatuses,
    activeRoomId,
    activeDirectUserId,
    unreadCounts,
    loading,
    error,
    sendMessage,
    fetchMessages,
    fetchRooms,
    fetchUserStatuses,
    createRoom,
    setActiveRoom,
    setActiveDirectUser,
    getUnreadCount,
    markMessagesAsRead,
    getCurrentUserId
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};