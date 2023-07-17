import Mission from "../models/mission.model.js";
import createError from "../utils/createError.js";

export const createMission = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only clients can create a mission!"));

  const newMission = new Mission({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedMission = await newMission.save();
    res.status(201).json(savedMission);
  } catch (err) {
    next(err);
  }
};
export const deleteMission = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (mission.userId !== req.userId)
      return next(createError(403, "You can delete only your mission!"));

    await Mission.findByIdAndDelete(req.params.id);
    res.status(200).send("Mission has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getMission = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) next(createError(404, "Mission not found!"));
    res.status(200).send(mission);
  } catch (err) {
    next(err);
  }
};
export const getMissions = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const missions = await Mission.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(missions);
  } catch (err) {
    next(err);
  }
};