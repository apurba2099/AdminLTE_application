import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js"; // Import auth routes
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors()); //use the cors origin
dotenv.config();

const PORT = process.env.PORT || 7000; // Server port (from .env or defaults to 7000 if not set)
const MONGOURL = process.env.MONGO_URL; // MongoDB connection string (from .env file)

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port :${PORT}`);
    });
  })
  .catch((error) => console.log(error));

//Routes
app.use("/api", route); //User CRUD routes (protected)
app.use("/api/auth", authRoute); //Authentication routes

//Welcome Route
app.get("/", (req, res) => {
  res.json({ messsage: `Welcome to CRUD Auth API! 🚀` });
});
