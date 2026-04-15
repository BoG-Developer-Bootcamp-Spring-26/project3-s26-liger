import { Sidebar } from "../components/sidebar";

export default function Animals() {
    return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="animals" user="Long Lam" isAdmin={true}/>
        <div className="flex flex-1 items-center">
            display animals here
        </div>
        </div>
    );
}