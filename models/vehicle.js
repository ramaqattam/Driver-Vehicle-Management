import mongoose from "mongoose";

const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, "name must be at least 2 characters long."],
      maxlength: [50,"name must be at most 50 characters long."],
      trim: true,
    },
    operationalID: {
      type: String,
      unique: true,
      required: true,
      minlength: [5, " operationalID must be at least 5 characters long."],
    },
    serviceType: {
      type: String,
      enum: ["sedan", "SUV", "truck"],
    },
    make: {
      type: String,
    },
    model: {
      type: String,
      minlength: [2, "the name of model must be at least 2 characters long."],
      maxlength: [50,"the name of model must be at most 50 characters long."],
    },
    makeYear: {
      type: Number,
      max: [new Date().getFullYear(), "The year of manufacture cannot exceed the current year."],
    },
    category: {
      type: String,
      enum: ["luxury", "economy"],
    },
    plateNumber: {
      type: String,
      unique: true,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    daysUntilInspectionExpiry: {
      type: Number,
      required: true,
    },
    licenseStatus: {
      type: String,
      enum: ["valid", "expired"],
      required: true,
    },
    numberOfSeats: {
      type: Number,
    },
    available: {
      type: Boolean,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      unique: true,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
