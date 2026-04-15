import Image from 'next/image';
import Link from 'next/link';
import { SidebarPage } from './sidebarPage';
// icon image imports
import activeAllAnimalsLogo from '../../public/images/activeAllAnimalsLogo.png';
import activeAllTrainingsLogo from '../../public/images/activeAllTrainingLogo.png';
import activeAllUsersLogo from '../../public/images/activeAllUsersLogo.png';
import activeAnimalsLogo from '../../public/images/activeAnimalsLogo.png';
import activeTrainingLogs from '../../public/images/activeTrainingLogo.png';
import inactiveAllAnimalsLogo from '../../public/images/inactiveAllAnimalsLogo.png';
import inactiveAllTrainingsLogo from '../../public/images/inactiveAllTrainingLogo.png';
import inactiveAllUsersLogo from '../../public/images/inactiveAllUsersLogo.png';
import inactiveAnimalLogo from '../../public/images/inactiveAnimalLogo.png';
import inactiveTrainingLogs from '../../public/images/inactiveTrainingLogs.png';
import logoutLogo from '../../public/images/logoutLogo.png';

type Props = {
	currentPage: string,
    user: string, // user name
    isAdmin: boolean // whether user is admin or not
};

export const Sidebar = ({ currentPage, user, isAdmin }: Props) => {
	return <div className="flex flex-col h-full w-56 pt-4 pb-2 px-5 shadow">
        <div>
            <SidebarPage
                unselectedImageSrc={inactiveTrainingLogs}
                selectedImageSrc={activeTrainingLogs}
                altText="trainings logo"
                pageName="Training logs"
                href="/trainings"
                isSelected={currentPage === "trainings"}
            />
            <SidebarPage
                unselectedImageSrc={inactiveAnimalLogo}
                selectedImageSrc={activeAnimalsLogo}
                altText="animals logo"
                pageName="Animals"
                href="/animals"
                isSelected={currentPage === "animals"}
            />
        </div>

        { isAdmin? (<div>
            <hr className="border-1 border-[#C0BFBF]"/>
            <p className="text-[#565252] font-medium mx-3 mt-3 mb-1">Admin access</p>
            <SidebarPage
                unselectedImageSrc={inactiveAllTrainingsLogo}
                selectedImageSrc={activeAllTrainingsLogo}
                altText="all trainings logo"
                pageName="All training"
                href="/all-trainings"
                isSelected={currentPage === "all-trainings"}    
            /> 
            <SidebarPage
                unselectedImageSrc={inactiveAllAnimalsLogo}
                selectedImageSrc={activeAllAnimalsLogo}
                altText="all animals logo"
                pageName="All animals"
                href="/all-animals"
                isSelected={currentPage === "all-animals"}
            />
            <SidebarPage
                unselectedImageSrc={inactiveAllUsersLogo}
                selectedImageSrc={activeAllUsersLogo}
                altText="all users logo"
                pageName="All users"
                href="/all-users"
                isSelected={currentPage === "all-users"}
            />
        </div>): (<div />)}

        <div className="mt-auto">
        <hr className="border-1 border-[#C0BFBF] w-full mb-2"/>
        <div className="flex flex-row items-center">
            <div className="rounded-full h-9 w-9 text-2xl text-center p-0.5 font-bold bg-primary-red text-white mr-3">
                {user.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <p className="text-[#565252] font-bold">{user}</p>
                <p className="text-[#565252] text-sm ">
                    { isAdmin ? "Admin" : "User"}
                </p>
            </div>
            <div className="ml-auto">
                <Link href="/login" onClick={() => {
                    fetch("/api/users/logout", {
                        method: "POST",
                    });
                }}>
                    <Image src={logoutLogo} alt="logout logo" className="self-center h-5 w-auto"/>
                </Link>
            </div>
        </div>
        </div>
    </div>
};