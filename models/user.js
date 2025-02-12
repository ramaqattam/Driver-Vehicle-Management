import mongoose from "mongoose";
import preferenceSchema from "./preference.js";
import addressSchema from "./address.js";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?:\+962|00962)7\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, "User phone number required"],
    },
    role: {
        type: String,
        enum: ["admin", "driver", "manager"],
        required: true,
        default: "driver",
    },
    address: {
        type: addressSchema,
        required: true,
        default: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    },
    status: {
        type: String,
        enum: ["active", "suspended", "deleted", "pending"],
        default: "pending",
    },
    profileImage: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
            },
            message: (props) => `${props.value} is not a valid URL!`,
        },
        default: null,
    },
    preferences: {
        type: preferenceSchema,
        default: {
            notifications: {
                email: true,
                sms: true,
                pushNotifications: true,
            },
            theme: "light",
            language: "en",
        },
    },
    lastLogin: {
        type: Date,
        default: new Date(),
    },
});

const User = mongoose.model("User", userSchema);

export default User;