import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type Props = {
    unselectedImageSrc: StaticImageData,
	selectedImageSrc: StaticImageData,
    altText: string,
    pageName: string,
    href: string,
    isSelected: boolean
};

export const SidebarPage = ({ unselectedImageSrc, selectedImageSrc, altText, pageName, href, isSelected }: Props) => {
	return <div className="w-full h-auto mb-1">
        { isSelected ? (
    <Link href={href} className="pointer-events-none cursor-default rounded-lg">
    <div className="flex text-white bg-primary-red rounded-lg py-2 px-4">
        <Image src={selectedImageSrc} alt={altText} className="self-center h-5 w-auto"/>
        <h2 className="font-medium ml-2">{pageName}</h2>
    </div>
    </Link> ) : (
    <Link href={href} className="cursor-pointer rounded-lg">
    <div className="flex rounded-lg py-2 px-4 hover:bg-red-100">
        <Image src={unselectedImageSrc} alt={altText} className="self-center h-5 w-auto"/>
        <h2 className="text-[#565252]  ml-2">{pageName}</h2>
    </div>
    </Link>
    )}
</div>
};
