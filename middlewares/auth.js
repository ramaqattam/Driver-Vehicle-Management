import jwt from "jsonwebtoken";
import User from "../models/user.js";

const { JWT_SECRET } = process.env;

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    let { _id } = jwt.verify(token, JWT_SECRET);

    let user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Request is not authorized" });
    }
    if (user.status !== "active") {
      return res.status(401).json({ message: "User is not active" });
    }
    req.user = user;
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "Request is not authorized" });
  }

  next();
};
