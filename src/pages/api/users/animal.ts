
import type {NextApiRequest, NextApiResponse} from 'next';
import { getAllAnimals, getAnimalByOwner } from "../../../../server/mongodb/actions/animals"
import { AnimalData } from "../../../types/types"
import { connectDb } from "../../../../server/mongodb/connectDb"


export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // pagination: cursor is the _id of the animal in the page before this
            // limit is limit for how many animals you want to fetch
            const { ownerId } = req.query;

            if (!ownerId|| Array.isArray(ownerId)) {
                return res.status(500).json({ 
                    message: 'ownerid needed to get all animals!' 
                });
            }
    
            const animals = await getAnimalByOwner(ownerId);

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