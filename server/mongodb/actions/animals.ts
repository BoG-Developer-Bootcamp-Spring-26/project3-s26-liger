import Animal from "../models/animal";
import "../models/user";
import { AnimalData } from "../../../src/types/types";
import { Types } from "mongoose";

export async function createAnimal(animalData: AnimalData) {
  const animal = new Animal(animalData);
  await animal.save();
}

export async function getAnimal(animalId: string) {
  const animal = Animal.findById(animalId);
  return animal;
}

export async function updateAnimal(animalId: string, newData: AnimalData) {
  const animal = Animal.findByIdAndUpdate(animalId, newData);
  return animal;
}

export async function deleteAnimal(animalId: string) {
  return await Animal.findByIdAndDelete(animalId);
}

export async function getAnimalByOwner(ownerId: string) {
  return await Animal.find({ owner: ownerId });
}

// admin function - paginated
// cursor is the last id of the previous page's object.
// if getting 1st page, use cursor = start
// limit is number of objects you want returned in your page
// sorted from oldest to newest entries
export async function getAllAnimals(cursor: string, limit: number) {
  if (cursor === "start") {
    // get 1st page
    return Animal.find().limit(limit).sort({ _id: 1 }).populate("owner");
  }

  if (cursor !== "start" && !Types.ObjectId.isValid(cursor)) {
    throw new Error("Invalid cursor!");
  }

  const animals = await Animal.find({
    _id: { $gt: new Types.ObjectId(cursor) }, // convert string to ObjectId
  })
    .limit(limit)
    .sort({ _id: 1 })
    .populate("owner");
  return animals;
}
