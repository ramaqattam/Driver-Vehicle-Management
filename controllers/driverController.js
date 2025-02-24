import { generateDriverToken } from "../utils/jwt.js";
import { encryptPassword } from "../utils/bcrypt.js";
import Driver from "../models/driver.js";
import Vehicle from "../models/vehicle.js";


export const createDriver = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      licenseNumber,
      licenseStatus,
      licenseExpiry,
      nationality,
      languages,
      employeeId,
      birthday,
    } = req.body;

    let requiredFields = {
      name,
      username,
      password,
      licenseNumber,
      licenseStatus,
      licenseExpiry,
      nationality,
      languages,
      employeeId,
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

    let profileImage = req.files['profileImage'] ? req.files['profileImage'][0].path : null;
    let licenseImage = req.files['licenseImage'] ? req.files['licenseImage'][0].path : null;

    let hashedPassword = await encryptPassword(password);
    const newDriver = new Driver({
      name,
      username,
      password: hashedPassword,
      profileImage,
      licenseNumber,
      licenseImage,
      licenseStatus,
      licenseExpiry,
      nationality,
      languages,
      employeeId,
      birthday,
    });
    let savedDriver = await newDriver.save();

    const token = generateDriverToken(savedDriver);
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getAllDriver = async (req, res) => {
  try {
    const users = await Driver.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    let id = req.params.id;
    const updates = req.body;

    let driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "driver not found" });
    }

    if (updates.password) {
      updates.password = await encryptPassword(updates.password);
    }

    if (req.files['profileImage']) {
      updates.profileImage = req.files['profileImage'][0].path;
    }
    if (req.files['licenseImage']) {
      updates.licenseImage = req.files['licenseImage'][0].path;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.status(200).json(updatedDriver);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const deleteDriver = async (req, res) => {
  try {
    const id = req.params.id;
    let driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await Driver.findByIdAndDelete(id);

    return res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:  "internal server error" });
  }
};

export const getDriversWithVehicles = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("vehicles");
    return res.status(200).json(drivers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getAvailableDrivers = async (req, res) => {
  const {
    nationality,
    language,
    make,
    model,
    category,
    color,
    serviceType,
    numberOfSeats,
  } = req.query;

  try {
    const vehicles = await Vehicle.find({
      available: true,
      licenseStatus: "valid",
      make,
      model,
      category,
      color,
      serviceType,
      numberOfSeats,
    }).populate({
      path: "driver",
      match: { nationality, language, licenseStatus: "valid" },
    });

    let activeDrivers = [];
    vehicles.forEach(function (vehicle) {
      if (vehicle.driver) {
        activeDrivers.push(vehicle.driver);
      }
    });

    res.status(200).json(activeDrivers);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const getDriversWithExpiredLicense = async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredDrivers = await Driver.find({
      licenseExpiry: { $lt: currentDate },
    });

    return res.status(200).json(expiredDrivers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getDriversWithExpiredVehicleLicense = async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredVehicles = await Vehicle.find({
      licenseExpiry: { $lt: currentDate },
    }).populate("driver");

    const driversWithExpiredVehicles = expiredVehicles
      .map((vehicle) => vehicle.driver)
      .filter(Boolean);

    return res.status(200).json(driversWithExpiredVehicles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
