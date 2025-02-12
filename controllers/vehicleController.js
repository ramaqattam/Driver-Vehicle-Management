import { generateToken } from "../utils/jwt.js";
import { encryptPassword } from "../utils/bcrypt.js";
import Vehicle from "../models/vehicle.js";
import Driver from "../models/driver.js";


export const createVehicle = async (req, res) => {
    try {
        const { operationalID, password, licenseExpiry, daysUntilInspectionExpiry, licenseStatus } = req.body;
        let requiredFields = { operationalID, password, licenseExpiry, daysUntilInspectionExpiry, licenseStatus };
        let missingFields = [];

        for (let key in requiredFields) {
            if (!requiredFields[key]) {
                missingFields.push(key);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `missing fields: ${missingFields.join(", ")}` });
        }

        let hashedPassword = await encryptPassword(password);
        const newVehicle = new Vehicle({
            name,
            operationalID,
            password: hashedPassword,
            serviceType,
            make,
            model,
            makeYear,
            category,
            plateNumber: "",
            color,
            features: [],
            licenseExpiry,
            daysUntilInspectionExpiry,
            licenseStatus,
            numberOfSeats,
            available,
            driver: driverId
        });

        const token = generateToken(savedVehicle);
        let savedVehicle = await newVehicle.save();
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
}

export const getAllVehicle = async (req, res) => {
    try {
        const users = await Vehicle.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
}










export const getVehiclesWithDrivers = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('driver');
        return res.status(200).json(vehicles);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};