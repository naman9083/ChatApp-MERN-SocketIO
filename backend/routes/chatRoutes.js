const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroupChat,
  addToGroupChat,
} = require("../controllers/chatController");
const { protect } = require("../middleware/AuthMiddleWare");
const router = express.Router();
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/addToGroup").put(protect, addToGroupChat);
router.route("/removeFromGroup").put(protect, removeFromGroupChat);

module.exports = router;
  



//GUI for react-chat-app