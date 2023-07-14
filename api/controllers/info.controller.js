import createError from "../utils/createError.js";
import User from "../models/user.model.js";

export const modifyInfo = async (req, res, next) => {
  const { username, email, img, country, phone, desc } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(req.userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    // Update the user's information
    user.username = username;
    user.email = email;
    user.img = img;
    user.country = country;
    user.phone = phone;
    user.desc = desc;

    // Save the updated user
    await user.save();

    res.status(200).send("User information updated successfully");
  } catch (err) {
    next(err);
  }
};
