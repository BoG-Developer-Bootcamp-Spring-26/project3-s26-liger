
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../../server/mongodb/connectDb"
import Animal from '../../../../server/mongodb/models/animal'
import User from '../../../../server/mongodb/models/user'
import { 
  createAnimal, 
  getAnimal, 
  updateAnimal, 
  deleteAnimal, 
  getAllAnimals 
} from "../../../../server/mongodb/actions/animals";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
   
    if (req.method === 'POST') {
        try {
            const { name, breed, owner, hoursTrained, profilePicture } = req.body;
        
            if (!name || !breed || !owner || !hoursTrained) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const user = await User.findById(owner);
            if (!user) {
                return res.status(400).json({ error: "Owner not found" });
            }
            
            const animal = await createAnimal({
                name,
                breed,
                owner,
                hoursTrained,
                profilePicture
            });

            return res.status(200).json({ message: "Animal created" });
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }   
    }
};
connectDb();



