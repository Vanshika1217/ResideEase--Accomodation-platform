import { io } from "socket.io-client";

const socket = io("https://backend-resideease.onrender.com", {
  transports: ["polling", "websocket"], // fallback-safe
});

export default socket;
