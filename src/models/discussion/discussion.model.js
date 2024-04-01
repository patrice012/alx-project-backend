const mongoose = require("mongoose");
const Profile = require("../profile/profile.model");

const DiscussionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    senderId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
    },

    sender: {
      type: String,
    },

    receiverId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
    },

    receiver: {
      type: String,
    },

    lastMessage: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

DiscussionSchema.index({ created_at: -1 });


DiscussionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object._id = _id;
  return object;
});


DiscussionSchema.pre("save", async function (next) {
  try {
    if (!this["name"]) {
      this["name"] = `${this["senderId"]}-${this["receiverId"]}-chat`;
      this["sender"] = (
        await Profile.findOne({ userId: this["senderId"] }).lean(true)
      )?.name;
      this["receiver"] = (
        await Profile.findOne({ userId: this["receiverId"] }).lean(true)
      )?.name;
    }
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;
