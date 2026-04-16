
import type {NextApiRequest, NextApiResponse} from 'next';
import { getAllAnimals } from "../../../../server/mongodb/actions/animals"
import { AnimalData } from "../../../types/types"
import { connectDb } from "../../../../server/mongodb/connectDb"

type AnimalsData = {
    animals?: AnimalData[];
    message: string;
}

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse<AnimalsData>) {
    if (req.method === 'GET') {
        try {
            // pagination: cursor is the _id of the animal in the page before this
            // limit is limit for how many animals you want to fetch
            const { cursor, limit } = req.query;

            if (!cursor || Array.isArray(cursor)) {
                return res.status(500).json({ 
                    message: 'Cursor is required for pagination to get all animals!' 
                });
            }
            
            const limitNum = Number(limit);
            if (isNaN(limitNum) || !limitNum) {
                return res.status(500).json({ 
                    message: 'Limit must be a number and is required for pagination to get all animals!' 
                });
            }

            const animals = await getAllAnimals(cursor, limitNum);
            res.status(200).json({
                animals: animals,
                message: `Successfully fetched data for all animals!`
            }); // 200 : working as intended, the Good response
        } catch(e) {
            res.status(500).json({
                message: `An error occurred while fetching the data of all animals. ${e}`
            })
        }
    } else {
        res.status(500).json({
            message: "Method not allowed. Only GET requests are supported."
        });
    }
}

connectDb();