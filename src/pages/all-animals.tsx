import { useState, useEffect } from "react";
import AnimalCard from "../components/animalCard";
import { Sidebar } from "@/components/sidebar";
import CreateNewButton from "@/components/createNew";

export default function AllAnimals() {
    const [animals, setAllAnimals] = useState<any>(null);
    return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-animals" user="Long Lam" isAdmin={true}/>
        <div className="flex flex-1 items-center">
            display all animals here
        </div>
        </div>
    );
}