
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDb } from "../../../server/mongodb/connectDb"
import Animal from '../../../server/mongodb/models/animal'
import User from '../../../server/mongodb/models/user'
import { 
  createAnimal, 
  getAnimal, 
  updateAnimal, 
  deleteAnimal 
} from "../../../server/mongodb/actions/animals";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if (req.method === 'GET') {
            try {
                const { id } = req.query;
    
                if (!id || Array.isArray(id)) {
                    return res.status(500).json({ 
                        message: 'Id is required to fetch animals!' 
                    });
                }
                const animals = await getAnimal(id);
                res.status(200).json({
                    animals: animals,
                    message: `Successfully fetched data for all animals!`
                }); // 200 : working as intended, the Good response
                
            } catch(e) {
                res.status(500).json({
                    message: `An error occurred while fetching the data of all animals. ${e}`
                })
            }
        } 
   
    if (req.method === 'POST') {
        try {
            const { name, breed, owner, hoursTrained, profilePicture } = req.body;
        
            if (!name || !breed || !owner || !hoursTrained) {
                return res.status(400).json({ error: "Missing fields" });
            }
            let pfp = profilePicture;

            if(!profilePicture || profilePicture === "") {
                pfp = "https://www.endcottagevets.co.uk/images/headers/end-cottage-default-int-983.webp";
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
                profilePicture: pfp
            });

            return res.status(200).json({ message: "Animal created" });
        } catch (err) {
            return res.status(500).json({ error: "Server error" });
        }   
    }
    if (req.method === "PUT") {
            try {
                const { id, newName, newBreed, newOwner, newHoursTrained, newProfilePicture  } = req.body;
                let updateFields = await Animal.findById(id);
                if (newName) {
                    updateFields.name = newName;
                }
                if (newBreed) {
                    updateFields.breed = newBreed;
                }
                if (newOwner) {
                    updateFields.owner = newOwner;
                }
                if (newHoursTrained) {
                    updateFields.hoursTrained = newHoursTrained;
                }
                if (newProfilePicture) {
                    updateFields.profilePicture = newProfilePicture;
                } else {
                    updateFields.profilePicture = "https://atlantahumane.org/wp-content/uploads/2025/11/dog-hero.jpg";
                }
                const animal = updateAnimal(id, updateFields); 
                
                return res.status(200).json("Animal updated successfully!")
            }
            catch (e) {
                return res.status(500).json({ error: "Error updating animal." });
            }
    }

    if (req.body === "PATCH") {
        try {
            const { id, name, breed, owner, hoursTrained, profilePicture } = req.body;
        
            if (!id) {
                return res.status(400).json({ error: "Missing animal id." });
            }

            const newAnimal = updateAnimal(id, {name, breed, owner, hoursTrained, profilePicture});
            return res.status(200).json({message: "Animal updated successfully!", animal: newAnimal})
        }
        catch (e) {
            return res.status(500).json({ error: "Error updating animal." });
        }
    }

    if (req.method === "DELETE") {
            try {
                const {id}  = req.body;
                if (!id) {
                    return res.status(400).json({error: "Error: missing animla id"});
                }
                const result = await deleteAnimal(id);
                
                if (!result) {
                    return res.status(404).json({ error: "Animal not found." });
                }
                return res.status(200).json("Successfully deleted animal");
            }
            catch(e) {
                return res.status(500).json({error: "Error deleting animal."});
            }
        }
};
connectDb();



