import User from "../models/user";
import { UserData } from "../../../src/types/types";
import { Types } from "mongoose";

export async function createUser(userData: UserData) {
    const user = new User(userData);
    await user.save();
}

export async function getUser(userId: string) {
    const user = User.findById(userId);
    return user;

}

export async function updateUser(userId: string, newData: UserData) {
    const user = User.findByIdAndUpdate(userId, newData);
    return user;
}

export async function deleteUser(userId: string) {
    await User.findByIdAndDelete(userId);

}

// admin functions - all paginated
// cursor is the last id of the previous page's object.
// if getting 1st page, use cursor = start
// limit is number of objects you want returned in your page
// sorted from oldest to newest entries
export async function getAllUsers(cursor: string, limit: number) {
    if (cursor === "start") {
        // get 1st page
        return User.find().limit(limit).sort({ _id: 1 });
      }

      if (cursor !== "start" && !Types.ObjectId.isValid(cursor)) {
        throw new Error("Invalid cursor!");
      }

      const users = await User.find({
        _id: { $gt: new Types.ObjectId(cursor) } // convert string to ObjectId
      })
        .limit(limit)
        .sort({ _id: 1 });
    return users;
}