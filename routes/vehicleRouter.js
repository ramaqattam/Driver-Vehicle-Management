import express from "express";
import { auth } from "../middlewares/auth.js";
import { internal } from "../middlewares/internal.js";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicle,
  getVehiclesWithDrivers,
  updateVehicle,
  getVehiclesWithExpiredLicense,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", [auth, internal], getAllVehicle);

router.get("/vehicles-with-drivers", [auth, internal], getVehiclesWithDrivers);

router.get("/expired-license", [auth, internal], getVehiclesWithExpiredLicense);

router.post("/", [auth, internal], createVehicle);

router.patch("/:id", [auth, internal], updateVehicle);

router.delete("/:id", [auth, internal], deleteVehicle);

export default router;
