import mongoose from "mongoose";

const Schema = mongoose.Schema;

const driverSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
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
                message: (props) => `${props.value} is not a valid URL!`,
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
                message: (props) => `${props.value} is not a valid URL!`,
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