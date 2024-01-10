import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
const app = express();
// Get the current module file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  //   console.log("dirname = ", __dirname);
  res.sendFile(__dirname + "/index.html");
});
var users = 0;

io.on("connection", (cap_event) => {
  console.log("user connected");
  users++;
  //   setTimeout(() => {
  //     // cap_event.send("hello beta kya kar rha hai");
  //     cap_event.emit("myCustEvent", {
  //       //***custom event  created from server ***
  //       desc: "A custom event from server side",
  //       err: "this as an error message",
  //     });
  //   }, 3000);

  //********  event from client captured on server *******
  //   cap_event.on("myClientSideEvent", (data) => console.log(data.second_msg));
  //   ********************************************************

  // ---------------- BroadCast on every user ---------------------
  //   io.sockets.emit("broadcasting", { message: users + " users connected" });
  //   ********************************************************

  // ---------------- BroadCast on already joined users ---------------------
  cap_event.broadcast.emit("newuserconnect", {
    message: users + " users connected",
  });
  // *************************************************************

  // ---------------- BroadCast on new joined users ---------------------
  cap_event.emit("newuserconnect", {
    message: "hello boss welcome to our group",
  });
  // *************************************************************

  cap_event.on("disconnect", function () {
    // ---------------- BroadCast disconnect message on already joined users
    cap_event.broadcast.emit("newuserconnect", {
      message: users + " users connected",
    });
    // *************************************************************
    users--;
    console.log("user disconnected");
  });
});

// --------------USING NAMESPACE-------------------------------
var cnsp = io.of("/secure"); //admin chat
cnsp.on("connection", (f) => {
  f.emit("secure-conn", { message: "hello guize i am admin chat" });
});

// ------------------------------------------------------------

// %%%%%%%%%%%%%%%%%%%%%%%%% ROOMS %%%%%%%%%%%%%%%%%%%%%%%%%%%%



server.listen(8080, () => console.log("Server listening on 8080"));
