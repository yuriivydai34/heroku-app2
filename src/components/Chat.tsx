'use client';

import { FormEvent, use, useEffect, useState } from "react";
import messageService from "../services/message.service";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";

import { io, Socket } from "socket.io-client";

type MessageData = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
};

interface UserData {
  id: string;
  username: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/' || '';

const socket: Socket = io(baseUrl, {
  auth: {
    userId: authService.getCurrentUserId()
  }
});

const Chat = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  const [users, setUsers] = useState<UserData[]>([]);
  // Load users for supervisor/associate selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersArr = await userService.getUsers({});
        if (Array.isArray(usersArr)) {
          setUsers(usersArr);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages utility
  const fetchMessages = async () => {
    const response = await messageService.getMessages();
    const mappedMessages: MessageData[] = response.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt,
    }));
    setMessages(mappedMessages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const [messageInput, setMessageInput] = useState("");
  const [receiverInput, setReceiverInput] = useState("");

  // Set default receiver to first user if available
  useEffect(() => {
    if (users.length > 0 && !receiverInput) {
      setReceiverInput(users[0].id);
    }
  }, [users]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('receiveMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receiveMessage');
    };
  }, []);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!messageInput.trim() || !receiverInput) return;
    const message = {
      content: messageInput,
      receiverId: Number.parseInt(receiverInput),
      senderId: authService.getCurrentUserId() || 0,
    }

    // To send a message
    socket.emit('sendMessage', message);

    setMessageInput(""); // Clear input
  }

  return (
    <div style={{ color: 'black' }}>
      повідомлення: {messages.length}
      <ul>
        {messages.map((message, idx) => (
          <li key={idx} style={{ color: 'black' }}>
            From: {users.find(user => user.id === message.senderId)?.username || 'Unknown'} To: {users.find(user => user.id === message.receiverId)?.username || 'Unknown'}: {message.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        Надіслати повідомлення:
        <select
          name="receiverId"
          style={{ color: 'black' }}
          value={receiverInput}
          onChange={e => setReceiverInput(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <textarea
          name="message"
          placeholder="Напишіть повідомлення..."
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }}
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          disabled={!receiverInput || !messageInput.trim()}
        >
          Надіслати
        </button>
      </form>
    </div>
  );
}

export default Chat;