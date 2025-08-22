//Define the endpoint of the application and also map them to the specific controller method,

import express from "express";
//Importing from the userController all routing export function!
import {
  create,
  getAllUserById,
  getAllUsers,
  remove,
  update,
} from "../controller/userController.js";

//Import Auth middleware
import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

//Routing Path!
route.post("/users", authMiddleware, create);
route.get("/users", authMiddleware, getAllUsers);
route.get("/users/:id", authMiddleware, getAllUserById);
route.put("/users/:id", authMiddleware, update);
route.delete("/users/:id", authMiddleware, remove);

export default route;
