import mongoose from "mongoose";

const Schema = mongoose.Schema;

const validateString = (value) => /^[A-Za-z\s]{2,50}$/.test(value);

const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      validate: {
        validator: validateString,
        message:
          "Must be between 2 and 50 characters, containing only letters and spaces.",
      },
    },
    city: {
      type: String,
      required: true,
      validate: {
        validator: validateString,
        message:
          "Must be between 2 and 50 characters, containing only letters and spaces.",
      },
    },
    state: {
      type: String,
      required: true,
      validate: {
        validator: validateString,
        message:
          "Must be between 2 and 50 characters, containing only letters and spaces.",
      },
    },
    zipCode: {
      type: String,
      required: true,
      match: [
        /^\d{5}$/i,
        "Please enter a valid 5-digit ZIP Code (e.g., 10395)",
      ],
    },
    country: {
      type: String,
      required: true,
      validate: {
        validator: validateString,
        message:
          "Must be between 2 and 50 characters, containing only letters and spaces.",
      },
    },
  },
  {
    _id: false,
  }
);

export default addressSchema;
