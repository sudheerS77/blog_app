const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/secret", requireSignin, (req, res) => {
    return res.json({
        user: req.user
    })
});

module.exports = router;