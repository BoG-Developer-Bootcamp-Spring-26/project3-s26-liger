import { Sidebar } from "../components/sidebar";

export default function AllUsers() {
    return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-users" user="Long Lam" isAdmin={true}/>
        <div className="flex flex-1 items-center">
            display all users here
        </div>
        </div>
    );
}