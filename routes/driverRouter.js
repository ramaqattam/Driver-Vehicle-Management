import express from "express";
import { getAllDriver,updateDriver, deleteDriver, createDriver,getDriversWithVehicles, getAvailableDrivers} from "../controllers/driverController.js";
import { auth } from "../middlewares/auth.js";
import { internal } from "../middlewares/internal.js";

const router = express.Router();

router.post('/create', createDriver);

router.get('/', [auth, internal] ,getAllDriver); 

router.get('/', [auth, internal] ,createDriver);

router.get('/withVehicles' , [auth, internal] , getDriversWithVehicles);

router.get('/available' , [auth, internal] , getAvailableDrivers);

router.patch('/:id', [auth, internal] , updateDriver);

router.delete('/:id', [auth, internal] , deleteDriver);

export default router;