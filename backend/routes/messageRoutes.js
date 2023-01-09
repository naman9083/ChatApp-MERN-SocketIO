const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/AuthMiddleWare");
const router = express.Router();



router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,getMessages);
// @desc    Fetch all messages
// @route   GET /api/chat
// @access  Public
module.exports = router;
