import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { FiMessageCircle } from "react-icons/fi";
import axios from "axios";

const ChatBoxPopup = ({ bookingId, userId, hostId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [hostName, setHostName] = useState("");
  const [userName, setUserName] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const roomId = `${bookingId}_${userId}_${hostId}`;

  // 🔄 Fetch host and user name dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelRes = await axios.get(`https://backend-resideease.onrender.com/accommodations/hotel/${hostId}`);
        setHostName(hotelRes.data.ownerName || "Host");

        const userRes = await axios.get(`https://backend-resideease.onrender.com/users/fetch`);
        const user = userRes.data.find((u) => u._id === userId);
        setUserName(user?.username || "You");
      } catch (err) {
        console.error("Error fetching names:", err);
        setHostName("Host");
        setUserName("You");
      }
    };

    fetchData();
  }, [hostId, userId]);

  useEffect(() => {
    socketRef.current = io("https://backend-resideease.onrender.com");
    socketRef.current.emit("joinRoom", roomId);

    // Only send initial message if names are loaded
    if (hostName) {
      setMessages([
        {
          sender: hostName,
          text: `Hi! I'm ${hostName}. Let me know if you have any queries.`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, hostName]);

  const handleSend = () => {
    if (!newMsg.trim()) return;

    const msgObj = {
      sender: userName,
      text: newMsg,
      time: new Date().toLocaleTimeString(),
    };

    socketRef.current.emit("sendMessage", { roomId, message: msgObj });
    setMessages((prev) => [...prev, msgObj]);
    setNewMsg("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative">
      <button
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        <FiMessageCircle />
        Chat with Host
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white border shadow-xl rounded-lg overflow-hidden z-50">
          <div className="bg-blue-600 text-white px-4 py-2 font-bold">Chat with {hostName}</div>
          <div className="h-64 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded-lg ${
                  msg.sender === userName
                    ? "bg-blue-100 text-right ml-auto w-fit"
                    : "bg-gray-100"
                }`}
              >
                <div className="font-semibold">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500">{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex border-t p-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-2 py-1 border rounded-l"
              placeholder="Type your message..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-r">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxPopup;
