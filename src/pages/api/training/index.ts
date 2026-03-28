
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
import TrainingLog from '../../../../server/mongodb/models/trainingLog'

import { createTrainingLog } from "../../../../server/mongodb/actions/trainingLogs";

/*
export interface TrainingLogData {
    _id: Types.ObjectId // training log's id
    user: Types.ObjectId // user this training log corresponds to
    animal: Types.ObjectId // animal this training log corresponds to
    title: string // title of training log
    date: Date // date of training log
    description: string // description of training log
    hours: number // number of hours the training log records
}
*/

export default async function handler(req:NextApiRequest, res:NextApiResponse)
{
    if (req.method === 'POST') {
        try {
            const { user, animal, title, date, description, hours } = req.body;
        
            if (!user || !animal || !title || !date || !description || !hours) {
                return res.status(400).json({ error: "Missing fields" });
            }

            

            await createTrainingLog({
                user, 
                animal,
                title,
                date,
                description,
                hours
            });

            return res.status(200).json({ message: "Training Log created" });
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }   
    }
};

connectDb();

