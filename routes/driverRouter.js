import express from "express";
import {
  getAllDriver,
  updateDriver,
  deleteDriver,
  createDriver,
  getDriversWithVehicles,
  getAvailableDrivers,
  getDriversWithExpiredLicense,
  getDriversWithExpiredVehicleLicense,
} from "../controllers/driverController.js";
import { auth } from "../middlewares/auth.js";
import { internal } from "../middlewares/internal.js";
import { uploadDriverImages } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", [auth, internal], getAllDriver);

router.get("/withVehicles", [auth, internal], getDriversWithVehicles);

router.get("/available", [auth, internal], getAvailableDrivers);

router.get("/expired-license", [auth, internal], getDriversWithExpiredLicense);

router.get(
  "/expired-vehicle-license",
  [auth, internal],
  getDriversWithExpiredVehicleLicense
);

router.post("/", [auth, internal, uploadDriverImages], createDriver);

router.patch("/:id", [auth, internal, uploadDriverImages], updateDriver);

router.delete("/:id", [auth, internal], deleteDriver);

export default router;
