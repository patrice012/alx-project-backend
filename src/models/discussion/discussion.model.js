const mongoose = require("mongoose");
// const Message = require("../messages/message.model");
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

    // receiver: {
    //   type: String,
    // },

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

DiscussionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// DiscussionSchema.methods.getMessages = async function () {
//   const disc = this;
//   const messages = await Message.find({ discussionId: disc._id });
//   return messages;
// };

// DiscussionSchema.static.getUnreadDiscussion = async function () {

// }

DiscussionSchema.pre("save", async function (next) {
  try {
    if (!this["name"]) {
      this["name"] = `${this["senderId"]}-${this["receiverId"]}-chat`;
      this["sender"] = (
        await Profile.findOne({ userId: this["senderId"] }).lean(true)
      ).name;
      // this["receiver"] = (
      //   await Profile.findOne({ userId: this["receiverId"] }).lean(true)
      // ).name;
    }
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

// DiscussionSchema.post("findOneAndDelete", async function () {
//   try {
//     const id = this.getQuery()["_id"].toString();
//     await Message.deleteMany({ discussionId: id });
//   } catch (error) {
//     console.log(error);
//   }
// });

// DiscussionSchema.post("deleteMany", async function () {
//   try {
//     const id = this.getQuery()["_id"].toString();
//     await Message.deleteMany({ discussionId: id });
//   } catch (error) {
//     console.log(error);
//   }
// });

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;
