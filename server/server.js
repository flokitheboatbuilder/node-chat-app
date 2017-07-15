const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const {generateMessage} = require("./utils/message");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("new user connected");

  socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app !!"));
  socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined !"));

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("this is from the server");
  });

  socket.on("disconnect", (socket) => {
    console.log("user was disconnected");
  });
});

server.listen(port, () => {
  console.log(`app server started on ${port}`);
});
