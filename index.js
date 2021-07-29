const express = require("express"); //import express
const http = require("http");
const path = require("path");
const cluster = require("cluster");
const { cpus } = require("os");
const socket = require("socket.io");
const { isUuid } = require("uuidv4");
require("dotenv").config(); //using .env file

var app = express();
const server = http.createServer(app);
const io = socket(server);
var id = 500;
const numOfCpus = cpus().length;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
  //   console.log(process.pid);
});
app.get("/:callid", (req, res) => {
  isUuid(req.params.callid)
    ? res.render("call", { callID: req.params.callid })
    : res.status(404).render("error");
});
app.get("*", (req, res) => {
  res.status(404).render("error");
});

io.on("connection", (socketio) => {
  socketio.on("join-room", (callID, user, id) => {
    // console.log(callID, user)
    socketio.join(callID);
    socketio.emit("message", {
      user: null,
      id: id,
      message: `Hi ${user}, Welcome to ByteCall`,
    }); //Welcome message for us
    socketio.to(callID).broadcast.emit("connected-user", {
      user: user,
      id: id,
      message: `${user} joined the meeting!`,
    });
    socketio.on("chatting", (msg) => {
      // console.log(msg)
      io.to(callID).emit("message", msg);
    });
    socketio.on("disconnect", () => {
      io.to(callID).emit("disconnect-user", {
        user: user,
        id: id,
        message: `${user} just disconnected!`,
      });
    });
  });
});

const PORT = process.env.PORT || 3000; //configure port like (localhost:3000)
if (cluster.isMaster) {
  for (let cpu = 0; cpu < numOfCpus; cpu++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
  cluster.on("disconnect", () => {
    cluster.fork();
  });
} else {
  server.listen(PORT, () => {
    console.log(`Server started at: http://127.0.0.1:${PORT}`);
  });
}
