const mongoose = require("mongoose");
const SingleMessage = require("../models/singleMessage");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");

// @desc		Send message
// @route		POST /messages
// @access		Private
const sendMessage = asyncHandler(async (req, res) => {
  const { content, receiver } = req.body;
  // check for error
  if (!content || !receiver) {
    return res.status(400).json({
      error: "Bad request",
      message: "Server could not process Invalid request",
    });
  }
  // message object
  var newMessage = {
    sender: req.user._id,
    content: content,
    receiver: mongoose.Types.ObjectId(receiver),
  };
  // query DB
  try {
    var message = await SingleMessage.create(newMessage);
    // message = await message.populate("sender", "name image");
    // message = await message.populate("chatId");
    // message = await User.populate(message, {
    //   path: "chatId.users",
    //   select: "name image email",
    // });
    // await Chat.findByIdAndUpdate(chatId, {
    //   latestMessage: message,
    // });
    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error("Server could not process request");
  }
});

// @desc		Fetch all the messages
// @route		GET /message:chatId
// @access		Private
const fetchMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const allMessages = await SingleMessage.find({ $or: [{$and: [{receiver: chatId}, {sender: req.user._id}]}, 
      { $and: [{sender: chatId}, {receiver: req.user._id}]}] })
      .populate("receiver", "name image email")
      .populate("receiver")
      .populate("sender", "name image email")
      .populate("sender");
    res.json(allMessages);
  } catch (err) {
    res.status(400);
    throw new Error("Server could not process request");
  }
});

module.exports = { sendMessage, fetchMessage };
