const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageModel = Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message",messageModel);

module.exports = Message;