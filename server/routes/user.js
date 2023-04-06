const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleWare } = require("../controllers/auth");
const { profile } = require("../controllers/user");

router.get("/profile", requireSignin,authMiddleWare, profile);

module.exports = router;