import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/userRouter.js";
import driverRoutes from "./routes/driverRouter.js";
import vehicleRoutes from "./routes/vehicleRouter.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is running ..");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
