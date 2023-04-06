const {User} = require("../models/user");

exports.profile = (req, res) => {
    console.log(req.profile);
    req.profile.hashed_password = undefined;
    console.log(req.profile);
    return res.json(req.profile);
}