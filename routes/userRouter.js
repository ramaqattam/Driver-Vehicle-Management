import express from "express";
import {
  getAllUsers,
  signIn,
  signUp,
  updateUser,
  deleteUser,
  activateUser,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import {internal} from "../middlewares/internal.js";
import { uploadProfileImage } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", [auth], getAllUsers);

router.post("/signup", uploadProfileImage, signUp);

router.post("/signin", signIn);

router.patch("/:userId", [auth, uploadProfileImage], updateUser);

router.patch("/activate/:userId", [auth, internal], activateUser);

router.delete("/:userId", [auth], deleteUser);

export default router;
