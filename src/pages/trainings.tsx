import { TrainingLogCard } from "../components/trainingLogCard";

export default function Trainings() {
    return(
        <div className="flex flex-col items-center gap-4 py-8">
            <TrainingLogCard
                user="Long Lam"
                animal="Lucy"
                breed = "Golden Retriever"
                title="Complete sit lessons"
                date={new Date("2024-06-01")}
                description="Lucy finishes the sit lessons very well today. Should give her a treat."
                hours={20}
            />
        </div>
    );
}