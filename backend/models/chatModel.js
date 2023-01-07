//chatName
//isGroupChat
//users
//_id
//latestMessage

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const chatModel = Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Chat = model("Chat", chatModel);
module.exports = Chat;
