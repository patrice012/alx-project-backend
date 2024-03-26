const UserModel = require("../../models/user/user.model");
const Profile = require("../../models/profile/profile.model");
const Message = require("../../models/messages/message.model");
const Discussion = require("../../models/discussion/discussion.model");

const createMessage = async (data) => {
  try {
    const message = new Message(data);
    return await message.save();
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (id) => {
  try {
    return await UserModel.findById({ _id: id })
      .select("-password, -__v")
      .lean(true);
  } catch (error) {
    throw new Error(error);
  }
};

const getProfile = async (id) => {
  try {
    return await Profile.findOne({ userId: id });
  } catch (error) {
    throw new Error(error);
  }
};

const getUserDiscussionList = async (id) => {
  try {
    const disc = await Discussion.find({
      $or: [{ senderId: id }, { receiverId: id }],
    })
      .sort({ updated_at: -1 })
      .lean(true);

    return disc;
  } catch (error) {
    throw new Error(error);
  }
};

const getDiscussion = async (id) => {
  try {
    const disc = await Discussion.findOne({ _id: id }).lean(true);
    return disc;
  } catch (error) {
    throw new Error(error);
  }
};

const getOnlineUsers = async (id) => {
  try {
    return await UserModel.find({ _id: { $ne: id } }).lean(true);
  } catch (error) {
    throw new Error(error);
  }
};

const getDiscussionMessageList = async (id) => {
  try {
    const messages = await Message.find({ discussionId: id })
      .sort({ created_at: 1 })
      .lean(true);
    return messages;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getProfile,
  getUser,
  createMessage,
  getDiscussion,
  getUserDiscussionList,
  getOnlineUsers,
  getDiscussionMessageList,
};
