import mongoose from "mongoose";

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    name: {
        type: String,
    },
    operationalID: {
        type: String,
        unique: true,
        required: true
    },
    serviceType: {
        type: String,
        enum: ['sedan', 'SUV', 'truck']
    },
    make: {
        type: String,
    },
    model: {
        type: String,
    },
    makeYear: {
        type: Number,
    },
    category: {
        type: String,
        enum: ['luxury', 'economy']
    },
    plateNumber: {
        type: String,
        unique: true,
        required: true
    },
    color: {
        type: String,
        default: null
    },
    features: {
        type: [String],
        default: []
    },
    licenseExpiry: {
        type: Date,
        required: true
    },
    daysUntilInspectionExpiry: {
        type: Number,
        required: true
    },
    licenseStatus: {
        type: String,
        enum: ['valid', 'expired'],
        required: true
    },
    numberOfSeats: {
        type: Number,
    },
    available: {
        type: Boolean,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        unique: true
    }
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;