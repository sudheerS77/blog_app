const shortid = require("shortid");
const jwt = require("jsonwebtoken");
var { expressjwt } = require("express-jwt");

//models
const User = require("../models/user");
const user = require("../models/user");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, u) => {
    if (u) {
      return res.status(400).json({
        error: "email is taken",
      });
    }
    const { name, email, password } = req.body;
    const username = shortid.generate();
    const profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, succ) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });

  // return res.status(200).json({
  //   user: { name, email, password },
  // });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with the email does not exist. Please Signup",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email or Password do not match",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expiresIn: "1d" });
    const { _id, username, email, name, role } = user;
    return res.status(200).json({
      token,
      user: { _id, username, email, name, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({message: "signout success"})
}

// exports.requireSignin = expressjwt({
//   secret: process.env.JWT_SECRET, algorithms: ["HS256"]
// });
exports.requireSignin = (req, res, next) => {
  const autheHeader = req.headers['authorization']
  const token = autheHeader && autheHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(400).json({ err })
    req.user = user
    // console.log(user);
    next()
  })
}

exports.authMiddleWare = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, usr) => {
    if (err || !usr) {
      return res.status(400).json({ error: 'User not found' });
    }
    req.profile = usr;
    next();
  })
}

exports.adminMiddleWare = (req, res, next) => {
  const adminId = req.user._id;
  User.findOne({ _id: adminId }).exec((err, usr) => {
    if (err || !usr) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (usr.role != 1) {
      return res.status(400).json({
        error: "Admin resourses. \n Access Denied"
      });      
    }
    req.profile = usr;
    // console.log(usr)
    next();
  })
  
}
