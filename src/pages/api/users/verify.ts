import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
import { getUserByEmail } from "../../../../server/mongodb/actions/users"
const argon2 = require('argon2');

type VerifyData = {
    user_id?: string;
    is_admin?: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse<VerifyData>) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email) {
                res.status(500).json({
                    message: "To verify user, email cannot be undefined or empty!"
                })
            }

            if (!password) {
                res.status(500).json({
                    message: "To verify user, password cannot be undefined or empty!"
                })
            }

            const user = await getUserByEmail(email);
            if (!user) {
                res.status(500).json({
                    message: `User info not valid, cannot verify!`
                })
            }

            const isCorrect = await argon2.verify(user.password, password);
            if (!isCorrect) {
                res.status(500).json({
                    message: `User info not valid, cannot verify!`
                })
            }

            res.status(200).json({
                user_id: user._id,
                is_admin: user.admin,
                message: `Successfully verified user!`
            }); // 200 : working as intended, the Good response
        } catch(e) {
            res.status(500).json({
                message: `An error occurred while verifying user. ${e}`
            })
        }
    } else {
        res.status(500).json({
            message: "Method not allowed. Only POST requests are supported."
        });
    }
}

connectDb();