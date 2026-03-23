
import type {NextApiRequest, NextApiResponse} from 'next';
import { getAllUsers } from "../../../../server/mongodb/actions/users"
import { UserData } from "../../../types/types"
import { connectDb } from "../../../../server/mongodb/connectDb"

type UsersData = {
    users?: UserData[];
    message: string;
}

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse<UsersData>) {
    if (req.method === 'GET') {
        try {
            // pagination: cursor is the _id of the user in the page before this
            // limit is limit for how many users you want to fetch
            const { cursor, limit } = req.query;

            if (!cursor || Array.isArray(cursor)) {
                return res.status(500).json({ 
                    message: 'Cursor is required for pagination to get all users!' 
                });
            }

            const limitNum = Number(limit);
            if (isNaN(limitNum)) {
                return res.status(500).json({ 
                    message: 'Limit must be a number and is required for pagination to get all users!' 
                });
            }

            const users = await getAllUsers(cursor, limitNum);
            res.status(200).json({
                users: users,
                message: `Successfully fetched data for all users!`
            }); // 200 : working as intended, the Good response
        } catch(e) {
            res.status(500).json({
                message: `An error occurred while fetching the data of all users. ${e}`
            })
        }
    } else {
        res.status(500).json({
            message: "Method not allowed. Only GET requests are supported."
        });
    }
}

connectDb();