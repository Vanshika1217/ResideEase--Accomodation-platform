// src/components/ChatComponent.jsx
import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';

const ChatComponent = ({ bookingId, senderId, receiverId, senderName }) => {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const roomId = `${bookingId}`;

  useEffect(() => {
    console.log("📦 ChatComponent Props:", { bookingId, senderId, receiverId, senderName });
  }, []);

  if (!bookingId || !senderId || !receiverId) {
    return (
      <div className="text-red-600 font-semibold">
        ⚠️ Chat cannot be loaded. Missing user or booking info.
      </div>
    );
  }

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://backend-resideease.onrender.com/messages/${bookingId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [bookingId]);

  // Join room and handle incoming messages
  useEffect(() => {
    socket.emit('join_room', roomId);
    console.log("🟢 Joined room:", roomId);

    const handleReceive = (msg) => {
      console.log("📥 Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [roomId]);

  // Send message
  const sendMessage = async () => {
    if (!content.trim()) return;

    const msg = {
      bookingId,
      senderId,
      receiverId,
      senderName,
      content,
    };

    console.log("📤 Sending message:", msg);

    try {
      const saved = await axios.post("https://backend-resideease.onrender.com/messages", msg);

      // Emit to room → all clients including sender will receive via socket
      socket.emit('send_message', saved.data);

      // ❌ Do not append locally here — will be handled in receive_message
      setContent('');
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Chat</h3>

      <div className="bg-gray-100 rounded-lg p-3 mb-2 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 ${msg.senderId === senderId ? 'text-right' : 'text-left'}`}
            >
              <strong>{msg.senderName}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border border-gray-300 p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
