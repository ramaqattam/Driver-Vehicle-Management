import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};
