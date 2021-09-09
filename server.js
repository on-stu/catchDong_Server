const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const PORT = 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.emit("welcome", "hello");

  socket.on("message", ({ name, message }) => {
    io.emit("message", { name, message });
  });
});

server.listen(PORT, () => console.log("Server is running on ", PORT, "port"));
