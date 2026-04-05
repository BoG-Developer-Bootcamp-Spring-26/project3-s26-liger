const argon2 = require("argon2");
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"

import { createUser, updateUser, deleteUser } from "../../../../server/mongodb/actions/users";
import User from '../../../../server/mongodb/models/user';

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
        
            if (!fullName || !password || !email) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const hashedPassword = await argon2.hash(password);
            

            await createUser({
                fullName,
                email, 
                password: hashedPassword,
                admin: admin,
            });

            return res.status(200).json({ message: "User created" });
        } catch (e) {
            return res.status(500).json({ error: "Server error" });
        }   
    }

    if (req.method === "PUT") {
        try {
            const { id, newName, newEmail, newPassword, admin } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Missing user id." });
            }
            let updateFields : any = {"fullName": newName, "email": newEmail, "admin": admin}
            let hashedPassword = ""
            if (newPassword) {
                hashedPassword = await argon2.hash(newPassword);
                updateFields.password = hashedPassword;
            }
    
            const updatedUser = updateUser(id, updateFields);
            return res.status(200).json({message:"User updated successfully!", user: updatedUser})
        }
        catch (e) {
            return res.status(500).json({ error: "Error replacing user." });
        }
    }
    
    if (req.method === "PATCH") {
        try {
            const { id, fullName, email, password, admin } = req.body;
            if (!id) {
                return res.status(400).json({ error: "Missing user id." });
            }

            let hashedPassword = '';
            if (password) {
                hashedPassword = await argon2.hash(password);
            }

            const updatedUser = updateUser(
                id,
                {fullName, email, "password":hashedPassword, admin}
            );
            return res.status(200).json({message: "User updated successfully!", user: updatedUser})
        }
        catch (e) {
            return res.status(500).json({ error: "Error updating user." });
        }
    }

    if (req.method === "DELETE") {
        try {
            const {id}  = req.body;
            if (!id) {
                return res.status(400).json({error: "Error: missing user id"});
            }
            const result = await deleteUser(id);
            
            if (!result) {
                return res.status(404).json({ error: "User not found." });
            }
            return res.status(200).json("Successfully deleted user");
        }
        catch(e) {
            return res.status(500).json({error: "Error deleting user."});
        }
    }
};

connectDb();

