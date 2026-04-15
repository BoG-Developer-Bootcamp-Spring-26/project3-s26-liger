
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../server/mongodb/connectDb"
import TrainingLog from '../../../server/mongodb/models/trainingLog'

import { createTrainingLog, deleteTrainingLog, updateTrainingLog, getTrainingLog } from "../../../server/mongodb/actions/trainingLogs";

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
    if (req.method === 'GET') {
     try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Missing user id." });                
        }
        
        const logs = await getTrainingLog(id);
        res.status(200).json({
            logs:logs,
            message: "successfully got logs"
            }); 
        } catch(e) {
            return res.status(500).json({ error: "Server error" });
        }
    }
    
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
    if (req.method === "PUT") {
        try {
            const { id, user, animal, title, date, description, hours } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Missing id." });
            }
            const newLog = updateTrainingLog(id, {user, animal, title, date, description, hours});
            return res.status(200).json({message: "Training replaced successfully!", log: newLog})
        }
        catch (e) {
            return res.status(500).json({ error: "Error replacing training log." });
        }
    }

    if (req.method === "PATCH") {
        try {
            const { id, user, animal, title, date, description, hours } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Missing user id." });
            }

            const newLog = updateTrainingLog(id, {user, animal, title, date, description, hours});
            return res.status(200).json({message: "Training updated successfully!", log: newLog})
        }
        catch (e) {
            return res.status(500).json({ error: "Error updating training log." });
        }
    }

    if (req.method === "DELETE") {
            try {
                const {id}  = req.body;
                if (!id) {
                    return res.status(400).json({error: "Error: missing training log id"});
                }
                const result = await deleteTrainingLog(id);
                
                if (!result) {
                    return res.status(404).json({ error: "Training log not found." });
                }
                return res.status(200).json("Successfully deleted training log");
            }
            catch(e) {
                return res.status(500).json({error: "Error deleting training log."});
            }
        }
    
};

connectDb();

