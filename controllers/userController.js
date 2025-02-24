import { generateToken } from "../utils/jwt.js";
import { encryptPassword, comparePassword } from "../utils/bcrypt.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { status: "active" },
      "firstName lastName role profileImage"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      phoneNumber,
      address,
    } = req.body;
    let requiredFields = {
      firstName,
      lastName,
      password,
      phoneNumber,
      address,
    };
    let missingFields = [];

    for (let key in requiredFields) {
      if (!requiredFields[key]) {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `missing fields: ${missingFields.join(", ")}` });
    }

    let profileImage = req.file ? req.file.path : null;
    let hashedPassword = await encryptPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      phoneNumber,
      profileImage,
      address,
    });

    let savedUser = await newUser.save();

    const token = generateToken(savedUser);
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    let requiredFields = { phoneNumber, password };
    let missingFields = [];

    for (let key in requiredFields) {
      if (!requiredFields[key]) {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `missing fields: ${missingFields.join(", ")}` });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "user is not active" });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      address,
      preferences,
    } = req.body;
    if (
      !firstName &&
      !lastName &&
      !password &&
      !address &&
      !preferences &&
      !req.file
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const updatedFields = {
      firstName,
      lastName,
      address,
      preferences,
    };

    if (password) {
      const newHashedPassword = await encryptPassword(password);
      updatedFields.password = newHashedPassword;
    }

    if (req.file) {
      updatedFields.profileImage = req.file.path;
    }

    for (let key in updatedFields) {
      if (updatedFields[key]) {
        user[key] = updatedFields[key];
      }
    }

    const updatedUser = await user.save();
    console.log(updatedUser);

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let deletedUserId;
    if (req.user.role === "admin" || req.user.role === "manager") {
      const { id } = req.body;
      deletedUserId = id;
    } else {
      deletedUserId = req.user._id;
    }

    const user = await User.findById(deletedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "User is not active" });
    }

    user.status = "deleted";
    await user.save();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    if (user.status !== "pending" && user.status !== "suspended" && user.status !== "deleted") {
      return res.status(400).json({ message: "User is already active" });
    }
    user.status = "active";
    await user.save();
    return res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"inernal server error" });
  }
}

