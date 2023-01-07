const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("No user id provided");
    return res.status(400).send("No user id provided");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "-password",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chat = {
      chatName: "sender",
      users: [req.user._id, userId],
      isGroupChat: false,
    };
    try {
      const newChat = await Chat.create(chat);
      const FullChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (chats) => {
        const fullChats = await User.populate(chats, {
          path: "latestMessage.sender",
          select: "-password",
        });
        res.status(200).send(fullChats);
      });
  } catch (error) {
    res.status(400).send(error);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    console.log("No chat name provided");
    return res.status(400).send("No chat name provided");
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send("Please select at least 2 users");
  }
  users.push(req.user._id);
  try {
    const newChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const FullChat = await Chat.findOne({ _id: newChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400).send(error);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send("Chat not found");
  } else {
    res.status(200).send(updatedChat);
  }
});
const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");

  if (!chat) {
    res.status(404).send("Chat not found");
  } else {
    res.status(200).send(chat);
  }


});
const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");
  if (!chat) {
    res.status(404).send("Chat not found");
  } else {
    res.status(200).send(chat);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroupChat,
  removeFromGroupChat,
};
