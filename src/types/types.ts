import { Types } from 'mongoose';

// typing for model classes
export interface UserData{
    _id?: Types.ObjectId // user's unique identifier
    fullName: string // user's full name
    email: string // user's email
    password: string | null // user's password
    admin: boolean // holds whether or not a user is an admin
}

export interface AnimalData{
  _id?: Types.ObjectId // animal's ID
  name: string // animal's name
  breed: string // animal's breed
  owner: Types.ObjectId // id of the animal's owner
  hoursTrained: number // total number of hours the animal has been trained for
  profilePicture: string | null // url to an image that can be displayed in an <img> tag
}

export interface TrainingLogData {
    _id?: Types.ObjectId // training log's id
    user: Types.ObjectId // user this training log corresponds to
    animal: Types.ObjectId // animal this training log corresponds to
    title: string // title of training log
    date: Date // date of training log
    description: string // description of training log
    hours: number // number of hours the training log records
}