"use client";
import { useRouter } from "next/navigation";
import createNewLogo from "../../public/images/createNewLogo.png";
import Image from "next/image";
export default function CreateNewButton({
  currentPage,
}: {
  currentPage: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (currentPage === "animals") {
      router.push("/create-animal");
    }
    if (currentPage === "training") {
      router.push("/create-log");
    }
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <button className="flex flex-row">
        <Image
          src={createNewLogo}
          alt="create button"
          className="self-center h-4 w-auto"
        ></Image>
        <p className="ml-1 text-[#7C7171] font-medium">Create new </p>
      </button>
    </div>
  );
}
