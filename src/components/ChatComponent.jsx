// src/components/ChatComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import axios from 'axios';

const ChatComponent = ({ bookingId, senderId, receiverId, senderName }) => {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const roomId = `${bookingId}`;
  const messagesEndRef = useRef(null); // For auto-scroll

  // ✅ Log props once
  useEffect(() => {
    console.log("📦 ChatComponent Props:", { bookingId, senderId, receiverId, senderName });
  }, [bookingId, senderId, receiverId, senderName]);

  // ✅ Safety check
  if (!bookingId || !senderId || !receiverId) {
    return (
      <div className="text-red-600 font-semibold">
        ⚠️ Chat cannot be loaded. Missing user or booking info.
      </div>
    );
  }

  // ✅ Fetch past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://backend-resideease.onrender.com/messages/${bookingId}`);
        setMessages(res.data);
        console.log("📬 Initial messages:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [bookingId]);

  // ✅ Join socket room and handle real-time messages
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

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ✅ Send message handler
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
      socket.emit('send_message', saved.data); // all clients will receive
      setContent('');
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Chat</h3>

      <div className="bg-gray-100 rounded-lg p-3 mb-2 max-h-64 overflow-y-auto" style={{ minHeight: '150px' }}>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 ${msg.senderId?.toString() === senderId?.toString() ? 'text-right' : 'text-left'}`}
            >
              <strong>{msg.senderName}:</strong> {msg.content}
            </div>
          ))
        )}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
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
