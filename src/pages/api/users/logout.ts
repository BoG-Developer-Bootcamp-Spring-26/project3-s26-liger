import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
const cookie = require("cookie");

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse) {
        if (req.method === 'POST') {
            res.setHeader('Set-Cookie', cookie.stringifySetCookie({
                name: 'jwt',
                value: '',
                maxAge: 0,
                path: '/',
              }));
            
              res.status(200).json({ message: 'Logged out' });
        } else {
            res.status(500).json({
                message: "Method not allowed. Only POST requests are supported."
            });
        }
};
connectDb();