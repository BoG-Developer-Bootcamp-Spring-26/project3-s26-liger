const argon2 = require("argon2");
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
import User from '../../../../server/mongodb/models/user'

import { createUser } from "../../../../server/mongodb/actions/users";

/*
export interface UserData{
    _id?: Types.ObjectId // user's unique identifier
    fullName: string // user's full name
    email: string // user's email
    password: string | null // user's password
    admin: boolean // holds whether or not a user is an admin
}
*/

export default async function handler(req:NextApiRequest, res:NextApiResponse)
{
    if (req.method === 'POST') {
        try {
            const { fullName, email, password, admin } = req.body;
        
            if (!fullName || !password || !email || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const hashedPassword = await argon2.hash(password);
            

            await createUser({
                fullName,
                email, 
                password: hashedPassword,
                admin: false,
            });

            return res.status(200).json({ message: "User created" });
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }   
    }
};

connectDb();

