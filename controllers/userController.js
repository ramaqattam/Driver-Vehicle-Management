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
        const { firstName, lastName, password, phoneNumber, profileImage, address } =
            req.body;
        let requiredFields = {
            firstName,
            lastName,
            password,
            phoneNumber,
            profileImage,
            address
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

        let hashedPassword = await encryptPassword(password);
        const newUser = new User({
            firstName,
            lastName,
            password: hashedPassword,
            phoneNumber,
            profileImage,
            address
        });

        let savedUser = await newUser.save();

        const token = generateToken(savedUser);
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
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
        await user.save()

        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, password, address, profileImage, preferences } = req.body;
        if (!firstName && !lastName && !password && !address && !profileImage && !preferences) {
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
            profileImage,
            preferences
        }

        if (password) {
            const newHashedPassword = await encryptPassword(password);
            updatedFields.password = newHashedPassword
        }

        for (let key in updatedFields) {
            if (updatedFields[key]) {
                user[key] = updatedFields[key];
            }
        }

        const updatedUser = await user.save();
        console.log(updatedUser)

        const token = generateToken(updatedUser);

        return res.status(200).json({
            message: "User updated successfully",
            token
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