const http = require("http");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const socketIO = require("socket.io");
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hey!! The API is working Properly.");
});

let users = [{}];

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("Congratulation connection circuit is established");
  socket.on("joined", (data) => {
    users[socket.id] = data.user;
    console.log(`${data.user} has joined the chat`);
    socket.broadcast.emit("userjoined", {
      user: "Admin",
      message: `${data.user} has joined the chat`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the Chat  ${data.user}`,
    });
  });

  socket.on("dissconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left the chat`,
    });
    console.log(`${users[socket.id]} has left`);
  });

  socket.on("message", (data) => {
    console.log(data);
    io.emit("sendmessage", {
      user: users[data.infoid],
      message: data.info,
      id: data.infoid,
    });
  });
  //socket.emit("welcome", { user: "Admin", message: "Welcome to the Chat" });
  // socket.broadcast.emit("userjoined", {
  //   user: "Admin",
  //   message: "User has joined",
  // });
});

server.listen(PORT, () => {
  console.log("Server has been started");
});
