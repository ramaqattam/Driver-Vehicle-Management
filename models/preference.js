import mongoose from "mongoose";

const Schema = mongoose.Schema;

const preferenceSchema = new Schema(
  {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    language: {
      type: String,
      enum: ["en", "fr", "es"],
      default: "en",
    },
  },
  {
    _id: false,
  }
);

export default preferenceSchema;
