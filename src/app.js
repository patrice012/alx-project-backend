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
  findDiscussion,
} = require("./api/websocket/handlers");

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");
  const authHeader = socket?.handshake?.headers?.authorization;

  try {
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
            socket.emit("login", {
              message: "Login successful but failed to join connections rooms",
              error: err,
            });
          });
      })
      .catch((err) => {
        socket.emit("login", {
          message: "Failed to authenticate user",
          error: err,
        });
        socket.disconnect();
      });
  } catch (err) {
    socket.emit("login", {
      message: "Failed to authenticate user",
      error: err,
    });
    socket.disconnect();
  }

  socket.on("userOnline", (data) => {
    // console.log("userOnline", data);
    let user = socket["user"];
    socket.broadcast
      .to(`room-${user.id}`)
      .emit("userOnline", { isOnline: true });
  });

  socket.on("userOffline", (data) => {
    // console.log("userOffline", data);
    let user = socket["user"];
    socket.broadcast
      .to(`room-${user.id}`)
      .emit("userOnline", { isOnline: false });
  });

  // join room
  socket.on("joinChat", (data) => {
    try {
      // console.log("joinChat", data);
      socket.join(data.discussionId);
    } catch (err) {
      socket.emit("joinChat", {
        message: "Failed to join chat room",
        error: err,
      });
    }
  });

  // leave room
  socket.on("leaveChat", (data) => {
    try {
      // console.log("leaveChat", data);
      socket.leave(data.discussionId);
    } catch (err) {
      socket.emit("leaveChat", {
        message: "Failed to leave chat room",
        error: err,
      });
    }
  });

  // typing message
  socket.on("typing", async (data) => {
    try {
      if (data.userId) {
        const user = await getUser(data.userId);
        socket.broadcast
          .to(`${data.discussionId}`)
          .emit("typing", { message: `${user.username} is typing...` });
      } else {
        socket.emit("typing", {
          message: "User not found",
          error: "Please try again later",
        });
      }
    } catch (err) {
      socket.emit("typing", {
        message: "Failed to send typing message",
        error: err,
      });
    }
  });

  socket.on("stopTyping", async (data) => {
    try {
      socket.broadcast
        .to(`${data.discussionId}`)
        .emit("typing", { message: "" });
    } catch (err) {
      socket.emit("typing", {
        message: "Failed to stop typing",
        error: err,
      });
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
      socket.emit("newMessage", {
        newMessage: {},
        message: "Failed to send message",
        error: err,
      });
    }
  });

  // create new discussion
  socket.on("newDiscussion", async (data) => {
    try {
      // console.log("newDiscussion", data);
      if (data.discussionId) {
        const disc = await getDiscussion(data.discussionId);
        socket.emit("newDiscussion", { newDiscussion: disc });
      } else {
        socket.emit("newDiscussion", {
          newDiscussion: {},
          message: "Discussion not found",
          error: "Please try again later",
        });
      }
    } catch (err) {
      socket.emit("newDiscussion", {
        newDiscussion: {},
        message: "Failed to get discussion",
        error: err,
      });
    }
  });

  socket.on("findUserAndStartDiscussion", async (formData) => {
    // console.log("findUserAndStartDiscussion::", formData);
    try {
      const data = formData?.data;
      if (data.senderId) {
        const receiver = await findUser(data);

        if (
          data.senderId.toString() === receiver._id.toString() ||
          socket["user"].id.toString() === receiver._id.toString()
        ) {
          socket.emit("startNewDiscussion", {
            newDiscussion: {},
            message: "Cannot start discussion with yourself",
            error: "Critical Error",
          });
          return;
        }

        if (receiver) {
          try {
            const disc = await findDiscussion({
              senderId: data.senderId,
              receiverId: receiver._id,
            });
            if (disc) {
              socket.emit("startNewDiscussion", {
                newDiscussion: disc,
                message: "Discussion already exists",
              });
              socket.emit("newDiscussion", { newDiscussion: disc });
            } else {
              const disc = await createDiscussion({
                senderId: data.senderId,
                receiverId: receiver._id,
              });
              socket.emit("startNewDiscussion", {
                newDiscussion: disc,
                message: "Discussion created successfully",
              });
              socket.emit("newDiscussion", { newDiscussion: disc });
            }
          } catch (err) {
            socket.emit("startNewDiscussion", {
              newDiscussion: {},
              message: "Failed to create discussion",
              error: err,
            });
          }
        } else {
          socket.emit("startNewDiscussion", {
            newDiscussion: {},
            message: "Receiver not found",
            error: "Cannot find user",
          });
        }
      } else {
        socket.emit("startNewDiscussion", {
          newDiscussion: {},
          message: "Sender not found",
          error: "Cannot find user",
        });
      }
    } catch (err) {
      socket.emit("startNewDiscussion", {
        newDiscussion: {},
        message: "Failed to start discussion",
        error: err,
      });
    }
  });

  socket.on("discussionList", async (data) => {
    console.log("discussionList", data);
    try {
      if (data.userId || socket["user"].id.toString()) {
        const disc = await getUserDiscussionList(
          data.userId || socket["user"].id.toString()
        );
        socket.emit("discussionList", { discussionList: disc || [] });
      } else {
        socket.emit("discussionList", {
          discussionList: [],
          message: "Sender not found",
          error: "Cannot find user",
        });
      }
    } catch (err) {
      // console.log(err);
      socket.emit("discussionList", {
        discussionList: [],
        message: "Failed to get discussion list",
        error: err,
      });
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

        // set as active discussionMessageListso all incoming messages will be sent to this discussion
        socket.emit("activeDiscussion", { discussionId: data.discussionId });

        // get receiver details to display in the chat
        const discussionId = data.discussionId;
        const disc = await getDiscussion(discussionId);

        // send receiver details to the sender
        if (socket["user"].id.toString() === disc.senderId.toString()) {
          const user = await getUser(disc.receiverId);
          socket.emit("loadContactDetail", { contactDetail: user });
        } else if (
          socket["user"].id.toString() === disc.receiverId.toString()
        ) {
          const user = await getUser(disc.senderId);
          socket.emit("loadContactDetail", { contactDetail: user });
        }
      } else {
        socket.emit("discussionMessageList", {
          discussionMessageList: [],
          message: "Discussion not found",
          error: "Please try again later",
        });
      }
    } catch (err) {
      socket.emit("discussionMessageList", {
        discussionMessageList: [],
        message: "Failed to get discussion message list",
        error: err,
      });
    }
  });

  // not used
  socket.on("getOnlineUsers", async (data) => {
    try {
      // console.log("getOnlineUsers", data);
      if (data.userId) {
        const users = await getOnlineUsers(data.userId);
        socket.emit("OnlineUsers", { OnlineUsers: users });
      } else {
        socket.emit("OnlineUsers", {
          OnlineUsers: [],
          message: "Sender not found",
          error: "Cannot find user",
        });
      }
    } catch (err) {
      socket.emit("OnlineUsers", {
        OnlineUsers: [],
        message: "Failed to get online users",
        error: err,
      });
    }
  });

  // when user disconnect from socket then leave the room and disconnect the socket connection
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(socket["user"].id);
  });
});
