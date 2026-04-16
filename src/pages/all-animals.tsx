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
  const [cursorHistory, setCursorHistory] = useState<string[]>(["start"]);
  const [hasNextPage, setHasNextPage] = useState(false);
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
        const currentCursor = cursorHistory[page - 1] ?? "start";
        const res = await fetch(
          `/api/admin/animals/?cursor=${currentCursor}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          const animalList = data.animals || [];
          setAnimals(animalList);
          setLoading(false);
          const canGoNext = animalList.length === limit;
          setHasNextPage(canGoNext);
          if (canGoNext) {
            const nextCursor = animalList[animalList.length - 1]._id;
            setCursorHistory((prev) => {
              if (prev[page] === nextCursor) {
                return prev;
              }
              const updated = prev.slice(0, page);
              updated.push(nextCursor);
              return updated;
            });
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

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">All animals</h1>
          </div>

          <hr className="border-[#615E5E66] w-full border" />
          <div className="flex-1 overflow-y-auto">
            {!animals || animals.length === 0 ? (
              <div>
                <p className="m-3">There are no animals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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
          </div>

          <div className="flex shrink-0 items-end justify-center pb-5 pt-2">
            <button
              onClick={() => {
                setPage((prev) => {
                  if (prev > 1) {
                    return prev - 1;
                  }
                  return Math.max(cursorHistory.length - 1, 1);
                });
              }}
            >
              ←
            </button>
            <p className="mx-3">
              {page} / {Math.max(cursorHistory.length, page)}
            </p>
            <button
              onClick={() => {
                setPage((prev) => (hasNextPage ? prev + 1 : 1));
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
