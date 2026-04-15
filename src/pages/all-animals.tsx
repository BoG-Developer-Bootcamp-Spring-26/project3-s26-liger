import { Sidebar } from "../components/sidebar";

export default function AllAnimals() {
    return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-animals" user="Long Lam" isAdmin={true}/>
        <div className="flex flex-1 items-center">
            display all animals here
        </div>
        </div>
    );
}