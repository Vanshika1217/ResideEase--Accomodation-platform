import { io } from "socket.io-client";

const socket = io("https://backend-resideease.onrender.com", {
  transports: ["websocket"], // force WebSocket only
  withCredentials: true,
});

export default socket;
