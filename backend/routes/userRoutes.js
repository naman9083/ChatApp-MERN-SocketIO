const express = require("express");
const { register, authUser, allUsers } = require("../controllers/userController");
const { protect } = require("../middleware/AuthMiddleWare");
const router = express.Router();

router.route('/').post(register).get(protect,allUsers);;
router.post('/login',authUser);


module.exports = router;