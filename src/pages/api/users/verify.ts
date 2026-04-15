import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
import { getUserByEmail } from "../../../../server/mongodb/actions/users"
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const cookie = require("cookie");

type VerifyData = {
    user_id?: string;
    is_admin?: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse<VerifyData>) {
    await connectDb();
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: "To verify user, email cannot be undefined or empty!"
                })
            }

            if (!password) {
                return res.status(400).json({
                    message: "To verify user, password cannot be undefined or empty!"
                })
            }

            const user = await getUserByEmail(email);
            if (!user) {
                console.log("username wrong");
                return res.status(401).json({
                    message: `User info not valid, cannot verify!`
                })
            }

            const isCorrect = await argon2.verify(user.password, password);

            if (!isCorrect) {
                console.log("password wrong");

                return res.status(401).json({
                    message: `User info not valid, cannot verify!`
                })
            }

            const token = jwt.sign(
                { userId: user._id,
                isAdmin: user.admin,
                fullName: user.fullName
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.setHeader('Set-Cookie', cookie.stringifySetCookie({
                name: 'jwt',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // in seconds, lasts for 7 days
                path: '/',
              }));
            console.log("yay");
            return res.status(200).json({
                user_id: user._id,
                is_admin: user.admin,
                message: `Successfully verified user!`
            }); // 200 : working as intended, the Good response

        } catch(e) {
            return res.status(500).json({
                message: `An error occurred while verifying user. ${e}`
            })
        }
    } else {
        return res.status(500).json({
            message: "Method not allowed. Only POST requests are supported."
        });
    }
};
