"use client";
import { useState, useEffect } from "react";
import AnimalCard from "../components/animalCard";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";
import { useRouter } from "next/router";

export default function AllAnimals() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 6;
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [lastAnimalId, setLastAnimal] = useState("start");
  const [page, setPage] = useState(1);
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
    if (!user.isAdmin) {
      router.push("/animals");
    }
    const fetchAnimals = async () => {
      try {
        const res = await fetch(
          `/api/admin/animals/?cursor=${lastAnimalId}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          setAnimals(data.animals || []);
          setLoading(false);
          if (data.animals?.length > 0) {
            setLastAnimal(data.animals[data.animals.length - 1]._id);
          }
        } else {
          const error = await res.json();
          console.log(error.message);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnimals();
  }, [user, page]);

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
          currentPage="all-animals"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />

        <div className="flex flex-col flex-1">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">All animals</h1>
          </div>

          <hr className="border-[#615E5E66] w-full border" />
          {!animals || animals.length === 0 ? (
            <div>
              <p className="m-3">There are no animals.</p>
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
                    ownerName={animal.owner.fullName}
                  />
                ))}
            </div>
          )}

          <div className="flex items-end justify-center pb-5">
            <button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            >
              ←
            </button>
            <p className="mx-3">{page}</p>
            <button
              onClick={() => {
                if (animals.length === limit) setPage(page + 1);
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
