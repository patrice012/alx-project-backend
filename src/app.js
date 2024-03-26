const express = require("express");
const morgan = require("morgan");
// const cors = require("cors");
const db = require("./config/db");
const { PORT } = require("./config/config");
const router = require("./routes");
const errorHandler = require("./error/error");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// log using Morgan
app.use(morgan("dev"));

// connect to DB
db.connect();

// routes
app.use("/api/v1", router);

app.all("/*", (req, res) => {
  res.status(404).json({ error: "invalid endpoint." });
});

// Error Handler Middleware
app.use(errorHandler);

// open port
const port = PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

const {
  getUser,
  createMessage,
  getUserDiscussionList,
  getDiscussion,
  getOnlineUsers,
  getDiscussionMessageList,
} = require("./api/websocket/handlers");

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (data) => {
    socket.join(data.userId);
    socket.emit("connected");
    // socket.broadcast.emit("connected");
  });

  socket.on("userOnline", (data) => {
    console.log("userOnline", data);
    socket.emit("userOnline", { isOnline: true });
  });

  socket.on("userOffline", (data) => {
    console.log("userOffline", data);
    socket.emit("userOnline", { isOnline: false });
  });
  // // join room
  // socket.on("join chat", (room) => {
  //   socket.join(room);
  //   console.log("User Joined Room: " + room);
  // });

  // typing message
  socket.on("typing", async (data) => {
    if (data.userName) socket.broadcast.emit(`${data.userName} is typing...`);
    else if (data.userId) {
      const user = await getUser(data.userId);
      socket.emit("typing", `${user.username} is typing...`);
      // socket.broadcast.emit("typing", `${user.username} is typing...`);
    } else {
      console.log("User not found");
      // socket.disconnect();
    }
  });

  socket.on("stopTyping", async (data) => {
    socket.emit("typing", "");
    // socket.broadcast.emit("userTyping", "");
  });

  socket.on("newDiscussion", async (data) => {
    console.log("newDiscussion", data);
    if (data.discussionId) {
      const disc = await getDiscussion(data.discussionId);
      // const user = await getUserDiscussionList(data.userId);
      socket.emit("newDiscussion", { newDiscussion: disc });
    } else {
      console.log("User not found");
      // socket.disconnect();
    }
  });

  socket.on("discussionList", async (data) => {
    console.log("discussionList", data);
    if (data.userId) {
      const disc = await getUserDiscussionList(data.userId);
      console.log(`discussionList: ${disc}`);
      // socket.to(data.userId).emit("discussionList", { discussionList: disc });
      socket.emit("discussionList", { discussionList: disc || [] });
    } else {
      console.log("User not found");
      // socket.disconnect();
    }
  });

  socket.on("discussionMessageList", async (data) => {
    console.log("discussionMessageList", data);
    if (data.discussionId) {
      const messages = await getDiscussionMessageList(data.discussionId);
      socket.emit("discussionMessageList", { discussionMessageList: messages });
    } else {
      console.log("User not found");
      // socket.disconnect();
    }
  });

  socket.on("getOnlineUsers", async (data) => {
    console.log("getOnlineUsers", data);
    if (data.userId) {
      const users = await getOnlineUsers(data.userId);
      socket.to(data.userId).emit("OnlineUsers", { OnlineUsers: users });
    } else {
      console.log("User not found");
      // socket.disconnect();
    }
  });

  // // stop typing message
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // send message
  socket.on("newMessage", async (data) => {
    console.log("newMessage", data);
    const newMessage = await createMessage(data.message);
    console.log(`newMessage: ${newMessage}`);
    socket.emit("newMessage", { newMessage });
    socket.emit("discussionNewMessage", { newMessage });
    // socket.in(user._id).emit("message recieved", newMessageRecieved);
  });

  // when user disconnect from socket then leave the room and disconnect the socket connection
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// module.exports = io;
