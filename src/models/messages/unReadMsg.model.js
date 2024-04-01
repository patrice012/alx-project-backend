const mongoose = require("mongoose");

const UnreadMessageSchema = new mongoose.Schema(
  {
    discussionId: String,
    sender: {
      id: String,
      value: Number,
    },
    receiver: {
      id: String,
      value: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const UnreadMessageModel = mongoose.model("UnreadMessage", UnreadMessageSchema);

module.exports = UnreadMessageModel;
