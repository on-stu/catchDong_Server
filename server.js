const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  origins: ["*"],

  // optional, useful for custom headers
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST",
      "Access-Control-Allow-Headers": "my-custom-header",
      "Access-Control-Allow-Credentials": true,
    });
    res.end();
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
