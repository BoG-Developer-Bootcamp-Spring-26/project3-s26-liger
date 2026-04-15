import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AnimalCard from "../components/animalCard";
import Sidebar from "@/components/sidebar";

export default function AnimalDashboard() {
  const router = useRouter();
  const { ownerId } = router.query;

  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;

    const fetchAnimals = async () => {
      try {
        const res = await fetch(`/api/animal?id=${ownerId}`);
        const data = await res.json();
        setAnimals(data.animals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [ownerId]);

  if (loading) return <div>Loading...</div>;

  if (animals.length === 0) {
    return (<div>
      <Sidebar></Sidebar>
      <p>You have no animals. Would you like to add some?</p>
      <button>Add Animal</button>
      </div>);
  }

  return (
    <div className="page">
      <Sidebar></Sidebar>
      <p>Animals Dashboard</p>
      {animals.map((animal: any) => (
        <AnimalCard
          key={animal._id}
          name={animal.name}
          breed={animal.breed}
          hours={animal.hoursTrained}
          pfp={animal.profilePicture}
        />
      ))}
    </div>
  );
}