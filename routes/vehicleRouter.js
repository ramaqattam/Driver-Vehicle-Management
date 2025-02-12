import express from "express";

import { auth } from "../middlewares/auth.js";
import { internal } from "../middlewares/internal.js";
import {
    createVehicle,
    deleteVehicle,
    getAllVehicle,
    getVehiclesWithDrivers,
    updateVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", [auth, internal], getAllVehicle);

router.get("/withDrivers", [auth, internal], getVehiclesWithDrivers);

router.post("/", [auth, internal], createVehicle);

router.patch("/:id", [auth, internal], updateVehicle);

router.delete("/:id", [auth, internal], deleteVehicle);

export default router;