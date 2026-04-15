import { Sidebar } from "../components/sidebar";

export default function AllTrainings() {
    return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-trainings" user="Long Lam" isAdmin={true}/>
        <div className="flex flex-1 items-center">
            display all trainings here
        </div>
        </div>
    );
}