import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const getRoomUsers = (room) => {
    const sockets = io.sockets.adapter.rooms.get(room) || new Set();
    return [...sockets]
      .map((socketId) => io.sockets.sockets.get(socketId))
      .filter(Boolean)
      .map((socket) => ({
        userName: socket.data?.userName || 'Unknown',
        userId: socket.data?.userId || socket.id,
      }))
  }

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-class", ({ classCode, userName, userId }) => {
      if (!classCode) return;
      socket.join(classCode);
      socket.data = { classCode, userName, userId };

      const users = getRoomUsers(classCode);
      io.to(classCode).emit("room-users", users);

      socket.to(classCode).emit("class-message", {
        userName: "System",
        message: `${userName || 'A user'} joined the chat`,
        time: new Date().toISOString(),
        type: "system",
      });
    });

    socket.on("class-message", ({ classCode, message, userName, senderId }) => {
      if (!classCode || !message || !userName) return;
      const payload = {
        userName,
        senderId,
        message,
        time: new Date().toISOString(),
      };
      io.to(classCode).emit("class-message", payload);
    });

    socket.on("disconnect", () => {
      const { classCode, userName } = socket.data || {};
      if (classCode) {
        const users = getRoomUsers(classCode);
        io.to(classCode).emit("room-users", users);
        io.to(classCode).emit("class-message", {
          userName: "System",
          message: `${userName || 'A user'} left the chat`,
          time: new Date().toISOString(),
          type: "system",
        });
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};
