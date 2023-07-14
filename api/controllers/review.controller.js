import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Mission from "../models/mission.model.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    missionId: req.body.missionId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      missionId: req.body.missionId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this mission!")
      );

    //TODO: check if the user purchased the mission.

    const savedReview = await newReview.save();

    await Mission.findByIdAndUpdate(req.body.missionId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ missionId: req.params.missionId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
