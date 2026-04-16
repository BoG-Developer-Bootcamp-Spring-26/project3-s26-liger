import Icon from '@mdi/react';
import { mdiCircleSmall } from '@mdi/js';
import Image from 'next/image';
import trainingLogCardEditButton from '../../public/images/trainingLogCardEditButton.png';

type Props = {
    user: string // user name
    animal: string // animal name
    breed: string // animal breed
    title: string // title of training log
    date: Date // date of training log
    description: string // description of training log
    hours: number // number of hours the training log records
};

export const TrainingLogCard = ({ user, animal, breed, title, date, description, hours }: Props) => {
    const parsedDate = new Date(date);

    const day = parsedDate.getDate();
    const month = parsedDate.toLocaleString("default", { month: "short" });
    const year = parsedDate.getFullYear();

	return <div className="flex w-6/7 rounded-xl bg-white drop-shadow font-heebo">
        <div className="flex font-oswald flex-col items-center w-1/10 bg-[#070A52D9] text-white py-4 px-2 rounded-l-xl gap-1">
            <h2 className="font-medium text-3xl">{day}</h2>
            <h3 className="text-base text-center">{month} - {year}</h3>
        </div>
        <div className = "mx-3 my-1">
            <div className = "flex items-center">
                <h2 className="font-bold text-[#260101] text-xl ">{title}</h2>
                <Icon path={mdiCircleSmall} size={0.75} color={"#888888"} />
                <p className = "text-xs text-[#999999]">{hours} hours</p>
            </div>
            
            <h3 className="text-xs text-[#999999] mt-0.5">{user} - {breed} - {animal}</h3>
            <p className="text-xs mt-3 ">{description}</p>
        </div>
        <div className = "flex items-center absolute right-4 top-1/4">
        <Image src={trainingLogCardEditButton} alt="edit button" className="self-center h-12 w-12 cursor-pointer"/>
        </div>
    </div>
};
