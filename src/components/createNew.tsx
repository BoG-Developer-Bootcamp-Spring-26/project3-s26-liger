"use client";
import { useRouter } from "next/navigation";
import createNewLogo from "../../public/images/createNewLogo.png"
import Image from 'next/image';
export default function CreateNewButton({currentPage} : {currentPage: string}) {
    const router = useRouter();
    const handleClick = () => {
        if (currentPage === "animals") {
            router.push('/create-animal');
        }
        if (currentPage === "training") {
            router.push('/create-log');
        }
    }
    return(
        <div>
            <button className="flex flex-row">
            <Image src = {createNewLogo} alt="create button" className="margin-10px"></Image>  Create new 
            </button>
        </div>
    );
    
}