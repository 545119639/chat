const express = require("express");
const io = require("socket.io");

let server = express();
let http = require("http").Server(server);

http.listen(9983);

let userArray = [];
let historyArray = [];
io.listen(http).on("connection", (user) => {
  user.on("name", (str) => {
    user.lastName = str;
    userArray.push(str);
    user.broadcast.emit("user", userArray);
    user.emit("user", userArray);
    user.emit("historyList", historyArray);
  });

  user.on("msg", (str) => {
    user.broadcast.emit("msg", {
      userName: user.lastName,
      timer: new Date().toLocaleTimeString(),
      content: str,
    });
    user.emit("msg", {
      userName: user.lastName,
      timer: new Date().toLocaleTimeString(),
      content: str,
    });
    historyArray.push({
      userName: user.lastName,
      timer: new Date().toLocaleTimeString(),
      content: str,
    });
  });

  user.on("disconnect", () => {
    // user.broadcast.emit("msg", "有人下线了");
    for (let i = 0; i < userArray.length; i++) {
      if (userArray[i] == user.lastName) {
        userArray.splice(i, 1);
      }
    }
    user.broadcast.emit("user", userArray);
    user.emit("user", userArray);
  });
});
