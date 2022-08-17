const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET
  );
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide Email And Password");
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Please Provide Valid Credintials");
  }
  const isPassed = await bcrypt.compare(password, user.password);

  if (!isPassed) {
    throw new UnauthenticatedError("Please Provide Valid Credintials");
  }
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET
  );
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
