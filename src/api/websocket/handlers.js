const UserModel = require("../../models/user/user.model");
const Profile = require("../../models/profile/profile.model");
const Message = require("../../models/messages/message.model");
const Discussion = require("../../models/discussion/discussion.model");
const UnreadMessageModel = require("../../models/messages/unReadMsg.model");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../../config/config");

const verifyUser = async (token) => {
  try {
    const staleAccessTkn = token.split(" ")[1];
    const decodedExpiredAccessTkn = jwt.verify(
      staleAccessTkn,
      ACCESS_TOKEN.secret,
      {
        ignoreExpiration: true,
      }
    );
    const tokenUser = await UserModel.findOne({
      _id: decodedExpiredAccessTkn.userId,
    }).lean(true);
    return {
      id: tokenUser._id,
      username: tokenUser.username,
      email: tokenUser.email,
    };
  } catch (error) {
    throw error;
  }
};

const createMessage = async (data) => {
  try {
    const message = new Message(data);

    const { senderId, receiverId, discussionId } = message;

    const unReadMsg = await UnreadMessageModel.findOne({
      discussionId: discussionId,
    });

    if (unReadMsg) {
      if (senderId.toString() == unReadMsg?.sender?.id.toString()) {
        unReadMsg.receiver.value = unReadMsg.receiver.value + 1;
      } else if (senderId.toString() == unReadMsg?.receiver?.id.toString()) {
        unReadMsg.sender.value = unReadMsg.sender.value + 1;
      }
      await unReadMsg.save();
    } else {
      await UnreadMessageModel.create({
        discussionId: discussionId,
        sender: {
          id: senderId,
          value: 0,
        },
        receiver: {
          id: receiverId,
          value: 1,
        },
      });
    }
    return await message.save();
  } catch (error) {
    console.log(error, "error");
    throw new Error(error);
  }
};

const getUnreadMsg = async (data) => {
  try {
    const { discussionId, userId } = data;
    const msg = await UnreadMessageModel.findOne({
      discussionId: discussionId,
    });
    if (msg) {
      if (msg?.sender.id.toString() == userId.toString()) {
        return msg.sender.value;
      } else if (msg?.receiver?.id.toString() == userId.toString()) {
        return msg.receiver.value;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const resetUnreadMsg = async (data) => {
  try {
    const { discussionId, userId } = data;
    const msg = await UnreadMessageModel.findOne({
      discussionId: discussionId,
    });
    if (msg) {
      if (msg?.sender.id.toString() == userId.toString()) {
        if (msg.sender.value > 0) {
          msg.sender.value = 0;
          msg.save();
        }
        return msg.sender.value;
      } else if (msg?.receiver?.id.toString() == userId.toString()) {
        if (msg.receiver.value > 0) {
          msg.receiver.value = 0;
          msg.save();
        }
        return msg.receiver.value;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUser = async (data) => {
  try {
    if (data.username) {
      return await UserModel.findOne({ username: data.username.trim() })
        .select({ username: 1, email: 1, _id: 1, created_at: 1, updated_at: 1 })
        .lean(true);
    } else if (data.email) {
      return await UserModel.findOne({ email: data.email.trim() })
        .select({ username: 1, email: 1, _id: 1, created_at: 1, updated_at: 1 })
        .lean(true);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (id) => {
  try {
    return await UserModel.findById({ _id: id })
      .select({ username: 1, email: 1, _id: 1, created_at: 1, updated_at: 1 })
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

const findDiscussion = async (data) => {
  try {
    const disc = await Discussion.findOne({
      $or: [
        { senderId: data.senderId, receiverId: data.receiverId },
        { senderId: data.receiverId, receiverId: data.senderId },
      ],
    });
    return disc;
  } catch (error) {
    throw new Error(error);
  }
};

const createDiscussion = async (data) => {
  try {
    const discussion = new Discussion(data);
    return await discussion.save();
  } catch (error) {
    throw new Error(error);
  }
};

const getUserConnections = async (id) => {
  try {
    const disc = await Discussion.find({ senderId: id })
      .select({ receiverId: 1 })
      .sort({ updated_at: -1 })
      .lean(true);
    return disc;
  } catch (error) {
    throw new Error(error);
  }
};

async function updateMessageReactions({ ...props }) {
  try {
    const { msgId, reaction, senderId, receiverId, discId } = props;
    const data = await Message.findOne({ _id: msgId });
    data.reactions = [...data.reactions, reaction];
    await data.save();

    const user = await UserModel.findOne({ _id: receiverId })
      .select(["username"])
      .lean(true);
    const discussion = await Discussion.findOne({ _id: discId });
    discussion.lastMessage = `${user.username} react with ${reaction}`;
    discussion.save();

    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  verifyUser,
  getProfile,
  getUser,
  createMessage,
  getDiscussion,
  getUserDiscussionList,
  getOnlineUsers,
  getDiscussionMessageList,
  findUser,
  createDiscussion,
  getUserConnections,
  findDiscussion,
  updateMessageReactions,
  getUnreadMsg,
  resetUnreadMsg,
};
