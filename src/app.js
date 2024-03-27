const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./config/db");
const { PORT, NODE_ENV, DOMAIN } = require("./config/config");
const router = require("./routes");
const errorHandler = require("./error/error");

const app = express();

// cors
let alloweds = {
  origin: [DOMAIN],
};
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is allowed
      if (alloweds.origin.includes(origin)) {
        callback(null, true);
      } else {
        // callback(new Error("Not allowed by CORS"));
        callback(null, true);
      }
    },
    credentials: true,
    optionSuccessStatus: 200,
  })
);

if (NODE_ENV === "development") {
  // log using Morgan
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

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
    origin: DOMAIN,
    // credentials: true,
  },
});

const {
  verifyUser,
  getUser,
  findUser,
  createMessage,
  getUserDiscussionList,
  getDiscussion,
  getOnlineUsers,
  getDiscussionMessageList,
  createDiscussion,
  getUserConnections,
} = require("./api/websocket/handlers");

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");
  const authHeader = socket?.handshake?.headers?.authorization;

  verifyUser(authHeader)
    .then((user) => {
      socket["user"] = user;
      socket.emit("logged", { user });
      socket.join(user.id);
      socket.join(`room-${user.id}`);

      // make user join all rooms of his connections
      getUserConnections(user.id)
        .then((connections) => {
          connections.forEach((connection) => {
            let roomName = `room-${connection.receiverId}`;
            // check if user is not connected
            socket.join(roomName);
            // if (!socket.rooms[roomName]) {
            // }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log("Error", err);
      socket.emit("login", { error: err });
      socket.disconnect();
    });

  socket.on("userOnline", (data) => {
    // console.log("userOnline", data);
    let user = socket["user"];
    socket.broadcast
      .to(`room-${user.id}`)
      .emit("userOnline", { isOnline: true });
  });

  socket.on("userOffline", (data) => {
    console.log("userOffline", data);
    let user = socket["user"];
    socket.broadcast
      .to(`room-${user.id}`)
      .emit("userOnline", { isOnline: false });
  });

  // join room
  socket.on("joinChat", (data) => {
    socket.join(data.discussionId);
    console.log("User Joined Room: " + data.discussionId);
  });

  // leave room
  socket.on("leaveChat", (data) => {
    socket.leave(data.discussionId);
    console.log("User Left Room: " + data.discussionId);
  });

  // typing message
  socket.on("typing", async (data) => {
    try {
      console.log("typing", data)
      if (data.userId) {
        const user = await getUser(data.userId);
        socket.broadcast
          .to(`${data.discussionId}`)
          .emit("typing", { message: `${user.username} is typing...` });
      } else {
        console.log("Cannot find user");
        // socket.disconnect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("stopTyping", async (data) => {
    try {
      socket.broadcast
        .to(`${data.discussionId}`)
        .emit("typing", { message: "" });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("newDiscussion", async (data) => {
    try {
      console.log("newDiscussion", data);
      if (data.discussionId) {
        const disc = await getDiscussion(data.discussionId);
        socket.emit("newDiscussion", { newDiscussion: disc });
      } else {
        console.log("Discussion not found");
        // socket.disconnsocketect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("findUserAndStartDiscussion", async (formData) => {
    // console.log("findUserAndStartDiscussion::", formData);
    try {
      const data = formData?.data;
      if (data.senderId) {
        const receiver = await findUser(data);

        // console.log(`receiver: ${receiver}`);

        if (receiver) {
          const disc = await createDiscussion({
            senderId: data.senderId,
            receiverId: receiver._id,
          });
          socket.emit("newDiscussion", { newDiscussion: disc });
        }
      } else {
        console.log("Failed to find user");
        // socket.disconnect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("discussionList", async (data) => {
    try {
      // console.log("discussionList", data);
      // get user discussion list
      if (data.userId) {
        const disc = await getUserDiscussionList(data.userId);
        socket.emit("discussionList", { discussionList: disc || [] });
      } else {
        console.log("Discussion not found");
        // socket.disconnect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("discussionMessageList", async (data) => {
    try {
      // get user discussion message list
      if (data.discussionId) {
        const messages = await getDiscussionMessageList(data.discussionId);
        socket.emit("discussionMessageList", {
          discussionMessageList: messages,
        });

        // set as active so all incoming messages will be sent to this discussion
        socket.emit("activeDiscussion", { discussionId: data.discussionId });

        // get receiver details to display in the chat
        const discussionId = data.discussionId;
        const disc = await getDiscussion(discussionId);
        const user = await getUser(disc.receiverId);

        // send receiver details to the sender
        socket.emit("loadContactDetail", { contactDetail: user });
      } else {
        console.log("User not found");
        // socket.disconnect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("getOnlineUsers", async (data) => {
    try {
      console.log("getOnlineUsers", data);
      if (data.userId) {
        const users = await getOnlineUsers(data.userId);
        socket.emit("OnlineUsers", { OnlineUsers: users });
      } else {
        console.log("User not found");
        // socket.disconnect();
      }
    } catch (err) {
      console.log(err);
    }
  });

  // send message
  socket.on("newMessage", async (data) => {
    try {
      const newMessage = await createMessage(data.message);
      // send message to receiver like push notification
      socket.broadcast.emit("newMessage", { newMessage });

      // display the message to the receiver if already in the chat room
      const messages = await getDiscussionMessageList(newMessage.discussionId);
      io.to(newMessage.discussionId).emit("newChatMessage", {
        discussionMessageList: messages,
      });
    } catch (err) {
      console.log(err);
    }
  });

  // when user disconnect from socket then leave the room and disconnect the socket connection
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
