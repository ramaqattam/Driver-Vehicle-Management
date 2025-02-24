import Vehicle from "../models/vehicle.js";
import Driver from "../models/driver.js";

export const createVehicle = async (req, res) => {
  try {
    const {
      name,
      operationalID,
      serviceType,
      make,
      model,
      makeYear,
      category,
      plateNumber,
      color,
      features,
      licenseExpiry,
      daysUntilInspectionExpiry,
      licenseStatus,
      numberOfSeats,
      available,
      driverId,
    } = req.body;
    let requiredFields = {
      operationalID,
      licenseExpiry,
      daysUntilInspectionExpiry,
      licenseStatus,
      plateNumber,
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

    if (driverId) {
      const driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
    }

    const existingVehicle = await Vehicle.findOne({
      $or: [{ operationalID }, { plateNumber }],
    });
    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "Operational ID or Plate Number already exists" });
    }

    const newVehicle = new Vehicle({
      name,
      operationalID,
      serviceType,
      make,
      model,
      makeYear,
      category,
      plateNumber,
      color,
      features,
      licenseExpiry,
      daysUntilInspectionExpiry,
      licenseStatus,
      numberOfSeats,
      available,
      driver: driverId,
    });

    let savedVehicle = await newVehicle.save();
    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: savedVehicle,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getAllVehicle = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    return res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "vehicle not found" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return res.status(200).json(updatedVehicle);
  } catch (error) {
    return res.status(500).json({ message: "internal server error " });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await Vehicle.findByIdAndDelete(id);

    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error " });
  }
};

export const getVehiclesWithDrivers = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("driver");
    return res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error " });
  }
};

export const getVehiclesWithExpiredLicense = async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredVehicles = await Vehicle.find({
      licenseExpiry: { $lt: currentDate },
    }).populate("driver");

    return res.status(200).json(expiredVehicles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error " });
  }
};
