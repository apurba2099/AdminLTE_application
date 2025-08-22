//its used for structure for data and interaction for database
import mongoose from "mongoose"; //for mongo db interaction

//In MongoDB with Mongoose, a schema is like a blueprint for your data.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);
export default User;
