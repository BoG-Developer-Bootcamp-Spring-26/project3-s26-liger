import TrainingLog from "../models/trainingLog";
import Animal from "../models/animal";
import "../models/user";
import { TrainingLogData } from "../../../src/types/types";
import { Types } from "mongoose";

export async function createTrainingLog(traininglogData: TrainingLogData) {
  const parsedHours = Number(traininglogData.hours);
  if (Number.isNaN(parsedHours)) {
    throw new Error("Invalid hours value");
  }

  const traininglog = new TrainingLog(traininglogData);
  await traininglog.save();

  await applyAnimalHoursDelta(String(traininglog.animal), parsedHours);

  return traininglog;
}

export async function getTrainingLog(traininglogId: string) {
  const trainingLog =
    await TrainingLog.findById(traininglogId).populate("animal");
  return trainingLog;
}

export async function getTrainingLogByUser(userId: string) {
  return await TrainingLog.find({ user: userId })
    .sort({ date: -1 })
    .populate("animal");
}

export async function updateTrainingLog(
  traininglogId: string,
  newData: Partial<TrainingLogData>,
) {
  const existingLog = await TrainingLog.findById(traininglogId);
  if (!existingLog) {
    return null;
  }

  const oldAnimalId = String(existingLog.animal);
  const oldHours = Number(existingLog.hours) || 0;
  const newAnimalId = newData.animal ? String(newData.animal) : oldAnimalId;
  const resolvedHours =
    newData.hours === undefined ? oldHours : Number(newData.hours);

  if (Number.isNaN(resolvedHours)) {
    throw new Error("Invalid hours value");
  }

  const traininglog = await TrainingLog.findByIdAndUpdate(
    traininglogId,
    {
      ...newData,
      animal: newAnimalId,
      hours: resolvedHours,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!traininglog) {
    return null;
  }

  if (oldAnimalId === newAnimalId) {
    await applyAnimalHoursDelta(oldAnimalId, resolvedHours - oldHours);
  } else {
    await applyAnimalHoursDelta(oldAnimalId, -oldHours);
    await applyAnimalHoursDelta(newAnimalId, resolvedHours);
  }

  return traininglog;
}

export async function deleteTrainingLog(traininglogId: string) {
  const deletedLog = await TrainingLog.findByIdAndDelete(traininglogId);

  if (deletedLog) {
    await applyAnimalHoursDelta(
      String(deletedLog.animal),
      -(Number(deletedLog.hours) || 0),
    );
  }

  return deletedLog;
}

// admin function - paginated
// cursor is the last id of the previous page's object.
// if getting 1st page, use cursor = start
// limit is number of objects you want returned in your page
// sorted from oldest to newest entries
export async function getAllTrainingLogs(cursor: string, limit: number) {
  if (cursor === "start") {
    // get 1st page
    return TrainingLog.find()
      .limit(limit)
      .sort({ _id: 1 })
      .populate("animal")
      .populate("user");
  }

  if (cursor !== "start" && !Types.ObjectId.isValid(cursor)) {
    throw new Error("Invalid cursor!");
  }

  const traininglogs = await TrainingLog.find({
    _id: { $gt: new Types.ObjectId(cursor) }, // convert string to ObjectId
  })
    .limit(limit)
    .sort({ _id: 1 })
    .populate("animal")
    .populate("user");
  return traininglogs;
}

async function applyAnimalHoursDelta(animalId: string, delta: number) {
  const animal = await Animal.findById(animalId);
  if (!animal) {
    return;
  }

  const currentHours = Number(animal.hoursTrained) || 0;
  animal.hoursTrained = Math.max(0, currentHours + delta);
  await animal.save();
}
