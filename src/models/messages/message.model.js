const mongoose = require("mongoose");

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

    senderName: {
      type: String,
    },

    receiverId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
    },

    receiverName: {
      type: String,
    },

    isView: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PUBLISH", "PENDING"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);

MessageModel.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = MessageModel;
