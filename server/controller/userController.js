//for handling for the request and for processing the data and generating the responses

import User from "../model/userModel.js";

//POST
//***That's a controller function for your Create Post/api/user route.***
export const create = async (req, res) => {
  try {
    // Add userId from the authenticated user
    const newUser = new User({
      ...req.body,
      userId: req.userId, // This comes from authMiddleware
    });

    const { email } = newUser;

    // Check if this user already has data with this email
    const userExist = await User.findOne({ email, userId: req.userId });

    //If user exist
    if (userExist) {
      return res
        .status(400)
        .json({ message: "You already have data with this email!" });
    }

    //If user does'not exist
    const saveData = await newUser.save();

    //FOR TOASTER MESSAGE and PostMan json output to json:message = user create successfullly
    res.status(200).json({ message: "User Data Created Successfully!✅" });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

//GET
//***That's a controller function for your GET /api/user route.***
export const getAllUsers = async (req, res) => {
  try {
    // Only get data belonging to the authenticated user
    const userData = await User.find({ userId: req.userId });

    //if not found! like guard clause!
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "No data found for this user!" });
    }

    // if found the data which retrive from the database
    //Sending data!
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

//GET
//***That's a controller function for your GET by there User ID /api/user/:id route.***
export const getAllUserById = async (req, res) => {
  try {
    const id = req.params.id;
    // Only allow access to user's own data
    const userExist = await User.findOne({ _id: id, userId: req.userId });

    //User Exist or not
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Data not found or access denied!" });
    }

    //IF it found!
    //Sending data!
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

//PUT
// *** Controller function for updating a user by ID (PUT /api/users/:id) ***
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    // Only allow updating user's own data
    const userExist = await User.findOne({ _id: id, userId: req.userId });

    //IF User Not Exist or not owned by current user
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Data not found or access denied!" });
    }

    //IF it found!
    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true, //Its basically specify that the function should return updated document rather than the original one!
    });

    //FOR TOASTER MESSAGE and PostMan json output to json:message = user update successfullly
    res.status(200).json({ message: "User Data Updated Successfully!✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE
// *** Controller function for Deleting data user by ID (PUT /api/users/:id) ***
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    // Only allow deleting user's own data
    const userExist = await User.findOne({ _id: id, userId: req.userId });

    //IF not delete user or not found!
    if (!userExist) {
      return res
        .status(404)
        .json({ message: "Data not found or access denied!" });
    }

    //If got the User
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User data deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
