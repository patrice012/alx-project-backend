const mongoose = require("mongoose");
const Message = require("../messages/message.model");

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

    receiverId: {
      type: mongoose.ObjectId,
      ref: "User",
      require: true,
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



DiscussionSchema.pre("save", async function (next) {
  try {
    if (!this["name"]) {
      this["name"] = `${this["senderId"]}-${"receiverId"}-chat`;
    }
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

DiscussionSchema.post("findOneAndDelete", async function () {
  try {
    const id = this.getQuery()["_id"].toString();
    await Message.deleteMany({ discussionId: id });
  } catch (error) {
    console.log(error);
  }
});


// DiscussionSchema.post("deleteMany", async function () {
//   try {
//     const id = this.getQuery()["_id"].toString();
//     await Message.deleteMany({ discussionId: id });
//   } catch (error) {
//     console.log(error);
//   }
// });

const DiscussionModel = mongoose.model("Discussion", DiscussionSchema);
module.exports = DiscussionModel;
