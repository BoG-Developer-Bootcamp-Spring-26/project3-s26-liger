import { useState, useEffect } from "react";
import AnimalCard from "../components/animalCard";
import { Sidebar } from "@/components/sidebar";
import CreateNewButton from "@/components/createNew";
import { TitleBar } from "@/components/titlebar";
import { useRouter } from "next/router";

export default function AnimalDashboard() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchAnimals = async () => {
      try {
        const res = await fetch(`/api/users/animal?ownerId=${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          setAnimals(data.animals || []);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnimals();
  }, [user]);

  if (loading) return <div></div>;

  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar
        isSearchable={true}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div className="flex flex-row h-screen w-screen">
        <Sidebar
          currentPage="animals"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />

        <div className="flex flex-col flex-1">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">Animals</h1>
            <CreateNewButton currentPage="animals"></CreateNewButton>
          </div>

          <hr className="border-[#615E5E66] w-full border" />

          {!animals || animals.length === 0 ? (
            <div>
              <p className="m-3">You have no animals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 py-8 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {animals
                .filter((animal: any) => {
                  if (!searchText) {
                    return true;
                  }
                  const query = searchText.toLowerCase();
                  return (
                    animal.name.toLowerCase().includes(query) ||
                    animal.breed.toLowerCase().includes(query)
                  );
                })
                .map((animal: any) => (
                  <AnimalCard
                    key={animal._id}
                    name={animal.name}
                    breed={animal.breed}
                    hours={animal.hoursTrained}
                    animalpfp={animal.profilePicture}
                    ownerName={user.fullName}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
