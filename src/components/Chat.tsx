'use client';

import { FormEvent, useEffect, useState } from "react";
import messageService from "../services/message.service";
import { userService } from "@/services/user.service";

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

  useEffect(() => {
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

    fetchMessages();
  }, []);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    const receiverId = formData.get("receiverId");

    if (typeof message === "string" && typeof receiverId === "string") {
      await messageService.createMessage({
        content: message,
        receiverId: Number.parseInt(receiverId),
      });
    }
  }

  return (
    <div style={{ color: 'black' }}>
      messages: {messages.length}
      <ul>
        {messages.map((message) => (
          <li key={message.id} style={{ color: 'black' }}>
            From: {users.find(user => user.id === message.senderId)?.username || 'Unknown'} To: {users.find(user => user.id === message.receiverId)?.username || 'Unknown'}: {message.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        Send Message To:
        <select name="receiverId" style={{ color: 'black' }}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <input type="text" name="message" placeholder="Type your message..." className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'black' }} />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Send</button>
      </form>
    </div>
  );
}

export default Chat;