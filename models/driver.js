import mongoose from "mongoose";

const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "name must be at least 2 characters long."],
      maxlength: [50,"name must be at most 50 characters long."],
    },
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: [2, "name must be at least 2 characters long."],
      maxlength: [50,"name must be at most 50 characters long."],
    },
    password: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
        },
        message: "is not a valid URL!",
      },
    },
    birthday: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseImage: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
        },
        message: "is not a valid URL!",
      },
    },
    licenseStatus: {
      type: String,
      enum: ["valid", "expired", "revoked", "suspended"],
      required: true,
      default: "valid",
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    vehicles: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
