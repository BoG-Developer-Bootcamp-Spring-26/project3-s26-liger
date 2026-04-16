
import type {NextApiRequest, NextApiResponse} from 'next';
import { TrainingLogData } from "../../../types/types"
import { connectDb } from "../../../../server/mongodb/connectDb"
import { getTrainingLogByUser } from "../../../../server/mongodb/actions/trainingLogs";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { userId } = req.query;
            if (!userId || Array.isArray(userId)) {
                return res.status(500).json({ 
                    message: 'user id required' 
                });
            }

            const traininglogs = await getTrainingLogByUser(userId);
            res.status(200).json({
                logs: traininglogs,
                message: `fetched training data from this user`
            }); 
            console.log(traininglogs);
        } catch(e) {
            res.status(500).json({
                message: `An error occurred while fetching the data of all trainings. ${e}`
            })
        }
    } else {
        res.status(500).json({
            message: "Method not allowed. Only GET requests are supported."
        });
    }
}
connectDb();