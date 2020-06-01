const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const tokenForUser = (user) => {
  const timeStamp = new Date().getDate();
  return jwt.sign({ sub: user._id, iat: timeStamp }, process.env.JWT_SECRET);
};
exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        status: "fail",
        message: "Email and Password is Required",
      });
    }

    // 1) see if user exists
    const user = await User.findOne({ email });
    //  2) if exists return error
    if (user) {
      return res.status(422).json({
        status: "fail",
        message: "User already exists",
      });
    }
    // 3) if not create and save user
    const newUser = await User.create(req.body);

    res.status(200).json({
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) check if email  and password exists
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        error: " Please provide email and password!",
      });
    }

    // 2) check if user exists && password is correct
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        error: " Incorrect Email or Password",
      });
    }
    // 3)
    const token = tokenForUser(user);
    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      status: "fail",
      errorMessage: "You are not authorized",
    });
  }

  // 3
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4
  const freshUser = await User.findById(decoded.sub);

  // 4(a)
  if (!freshUser) {
    return res.status(401).json({
      status: "fail",
      errorMessage: "This user no longer exists",
    });
  }

  // 5
  req.user = freshUser;

  next();
};
