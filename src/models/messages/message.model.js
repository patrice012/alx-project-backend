const mongoose = require("mongoose");

const Discussion = require("../discussion/discussion.model");

const MessageSchema = new mongoose.Schema(
  {
    typeOf: {
      type: String,
      enum: ["text", "docs", "img", "file"],
      require: true,
    },
    message: {
      type: String,
    },
    reactions: {
      type: Array,
    },

    senderId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
    },

    receiverId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
    },

    discussionId: {
      type: mongoose.ObjectId,
      ref: "Discussion",
      require: true,
    },

    isView: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PUBLISH", "PENDING"],
      default: "PENDING",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


MessageSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});


/* create discussion if not exits before saving the message */
MessageSchema.pre("save", async function (next) {
  const senderId = this["senderId"];
  const receiverId = this["receiverId"];
  const discussionId = this["discussionId"];

  try {
    if (!discussionId) {
      const disc = await Discussion.create({ senderId, receiverId });
      this["discussionId"] = disc["_id"];
    } else if (discussionId) {
      const disc = await Discussion.findOne({ _id: discussionId });
      if (!disc) {
        const disc = await Discussion.create({ senderId, receiverId });
        this["discussionId"] = disc["_id"];
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
