import Image from "next/image";
import appLogo from "../../public/images/appLogo.png";
import searchLogo from "../../public/images/searchLogo.png";

type Props = {
  isSearchable?: boolean;
  searchText?: string;
  setSearchText?: (newSearchText: string) => void;
};

export const TitleBar = ({
  isSearchable = false,
  searchText = "",
  setSearchText = () => {},
}: Props) => {
  return (
    <div className="flex flex-row w-screen items-center p-3 pl-8 shadow-[0_2px_2px_0_rgba(0,0,0,0.25)]">
      <Image src={appLogo} alt="app logo" className="h-7 w-auto" />
      <p className="ml-2 text-3xl font-medium font-oswald">Progress</p>

      {isSearchable ? (
        <div className="flex flex-row border-1 border-gray-500 rounded-xl ml-20 w-3/7">
          <Image
            src={searchLogo}
            alt="search logo"
            className="h-5 w-5 m-3 ml-4"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 font-bold text-lg focus:outline-none"
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
