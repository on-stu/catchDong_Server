const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://catchdong.netlify.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
app.use(cors());

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
