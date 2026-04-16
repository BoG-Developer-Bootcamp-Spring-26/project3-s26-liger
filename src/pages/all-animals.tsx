import { TitleBar } from "@/components/titlebar";
import { Sidebar } from "../components/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AllAnimals() {
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok && data.user.isAdmin) {
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
        const res = await fetch(`/api/animal?id=${user.userId}`);
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

  if (!animals || animals.length === 0) {
    return (
      <div className="flex flex-col h-screen w-screen">
        <TitleBar searchText={searchText} setSearchText={setSearchText} />
        <div className="flex flex-row h-screen w-screen">
          <Sidebar
            currentPage={"all-animals"}
            user={user.fullName}
            isAdmin={user.isAdmin}
          ></Sidebar>
          <div className="flex flex-1 flex-col w-full ">
            <div className="flex flex-1 flex-col gap-4 py-8 w-full ">
              <p className="color-[#7C7171]">All animals</p>
              <hr className="border-1 border-[#C0BFBF] w-full mb-2" />
            </div>
            <div className="flex flex-2 flex-col items-center gap-4 py-8">
              <p>There are no animals in the database.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar searchText={searchText} setSearchText={setSearchText} />
      <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-animals" user="Long Lam" isAdmin={true} />
        <div className="flex flex-1 items-center">display all animals here</div>
      </div>
    </div>
  );
}
