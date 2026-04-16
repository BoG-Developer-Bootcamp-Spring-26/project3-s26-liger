import TrainingLog from "../models/trainingLog";
import "../models/animal";
import { TrainingLogData } from "../../../src/types/types";
import { Types } from "mongoose";

export async function createTrainingLog(traininglogData: TrainingLogData) {
  const traininglog = new TrainingLog(traininglogData);
  await traininglog.save();
}

export async function getTrainingLog(traininglogId: string) {
  const trainingLog =
    await TrainingLog.findById(traininglogId).populate("animal");
  return trainingLog;
}

export async function getTrainingLogByUser(userId: string) {
  return await TrainingLog.find({ user: userId }).populate("animal");
}

export async function updateTrainingLog(
  traininglogId: string,
  newData: TrainingLogData,
) {
  const traininglog = await TrainingLog.findByIdAndUpdate(
    traininglogId,
    newData,
  );
  return traininglog;
}

export async function deleteTrainingLog(traininglogId: string) {
  return await TrainingLog.findByIdAndDelete(traininglogId);
}

// admin function - paginated
// cursor is the last id of the previous page's object.
// if getting 1st page, use cursor = start
// limit is number of objects you want returned in your page
// sorted from oldest to newest entries
export async function getAllTrainingLogs(cursor: string, limit: number) {
  if (cursor === "start") {
    // get 1st page
    return TrainingLog.find().limit(limit).sort({ _id: 1 }).populate("animal");
  }

  if (cursor !== "start" && !Types.ObjectId.isValid(cursor)) {
    throw new Error("Invalid cursor!");
  }

  const traininglogs = await TrainingLog.find({
    _id: { $gt: new Types.ObjectId(cursor) }, // convert string to ObjectId
  })
    .limit(limit)
    .sort({ _id: 1 })
    .populate("animal");
  return traininglogs;
}
