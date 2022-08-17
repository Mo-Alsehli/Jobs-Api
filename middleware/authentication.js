const UnauthenticatedError = require("../errors/index");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
