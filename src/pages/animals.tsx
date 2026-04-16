import { useState, useEffect } from "react";
import AnimalCard from "../components/animalCard";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/router";

export default function AnimalDashboard() {

  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async() =>{
        try {
            const res = await fetch("/api/me");
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
            } else {
              router.push('/login');
            }
        }
        catch(e) {
            console.error(e);
        }
    }
    fetchUser();
  }, []);

 
   

  useEffect(() => {
    if (!user) {
        return;
    }
     const fetchAnimals = async () => {
      try {
        const res = await fetch(`/api/animal?id=${user.userId}`);
        if (res.ok) {
            const data = await res.json();
            setAnimals(data.animals || []);
            setLoading(false);
        }
      } catch (e) {
        console.error(e);
      } 
    };
  fetchAnimals();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  if (!animals || animals.length === 0) {
    return (
    <div className="flex flex-row h-screen w-screen">
      <Sidebar currentPage={"animals"} user={user.fullName} isAdmin={user.isAdmin}></Sidebar>
      <div className="flex flex-1 flex-col items-center gap-4 py-8">
        <p>You have no animals. Would you like to add some?</p>
      </div>
      </div>
      );
  }

  return (
    <div className="flex flex-row h-screen w-screen">
      <Sidebar currentPage={"animals"} user={user.fullName} isAdmin={user.isAdmin}></Sidebar>
      
      <div className="flex flex-col flex-1 px-6">
        <div className="header justify-between items-center">
            <h1>Animals</h1>
            <button >Create New</button>
        </div>
        
        <hr></hr>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-8">
            {animals.map((animal: any) => (
            <AnimalCard
            key={animal._id}
            name={animal.name}
            breed={animal.breed}
            hours={animal.hoursTrained}
            animalpfp={animal.profilePicture}
            userpfp={""}
            />
        ))}
        </div>
      </div>
      

      
    </div>
  );
}