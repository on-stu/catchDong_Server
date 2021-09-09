const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("welcome");
  });

  socket.on("send draw", (data) => {
    const { offsetX, offsetY, isDrawing, roomId } = data;
    const sendingData = {
      offsetX,
      offsetY,
      isDrawing,
    };
    socket.to(roomId).emit("receive draw", sendingData);
  });
});

server.listen(PORT, () => console.log("Server is running on ", PORT, "port"));
