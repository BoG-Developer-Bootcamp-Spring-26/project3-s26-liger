"use client";
import { useState, useEffect } from "react";
import AnimalCard from "../components/animalCard";
import { Sidebar } from "@/components/sidebar";
import CreateNewButton from "@/components/createNew";
import { useRouter } from "next/router";


export default function AllAnimals() {
    const [animals, setAnimals] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const limit = 6;
      const [user, setUser] = useState<any>(null);
      const router = useRouter();
      const [lastAnimalId, setLastAnimal] = useState('start');
      const [page, setPage] = useState(1);
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
        if (!user.isAdmin) {
            router.push('/animal');
            
        }
         const fetchAnimals = async () => {
          try {
            const res = await fetch(`/api/admin/animals/?cursor=${lastAnimalId}&limit=${limit}`);
            if (res.ok) {
                const data = await res.json();
                setAnimals(data.animals || []);
                setLoading(false);
                if (data.animals?.length > 0) {
                    setLastAnimal(data.animals[data.animals.length - 1]._id);
                }
            } else  {
                const error = await res.json();
                console.log(error.message);
            }
          } catch (e) {
            console.error(e);
          } 
        };
      fetchAnimals();
      }, [user, page]);
    
      if (loading) return <div></div>;
    
      if (!animals || animals.length === 0) {
        return (
         <div className="flex flex-row h-screen w-screen">
                <Sidebar currentPage="all-animals" user={user.fullName} isAdmin={user.isAdmin}/>
                <div className="flex flex-col flex-1 px-6">
                <div className="header">
                        <h1>All animals</h1>
                        
                    </div>
                    <hr></hr>
                <div>
                    <p className="margins-10px">There are no animals.</p>
                </div>
                </div>
            </div>
          );
      }

      return (
        <div className="flex flex-row h-screen w-screen">
          <Sidebar currentPage={"all-animals"} user={user.fullName} isAdmin={user.isAdmin}></Sidebar>
          
          <div className="flex flex-col flex-1 px-6">
            <div className="header">
                <p style={{fontSize:'20px'}}>All animals</p>
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

            <div className="flex items-end justify-center">
                <button onClick={() => {if(page > 1){setPage(page - 1)}}}> ← </button>
                <p> {page} </p>
                <button onClick={() => { if (animals.length === limit) setPage(page + 1)}}> → </button>
            </div>

          </div>
        </div>
      );
    }