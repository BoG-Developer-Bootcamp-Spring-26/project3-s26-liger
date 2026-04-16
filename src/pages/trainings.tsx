import { TrainingLogCard } from "../components/trainingLogCard";
import { Sidebar } from "../components/sidebar";
import { TitleBar } from "../components/titlebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CreateNewButton from "@/components/createNew";

export default function Trainings() {
  const [logs, setLogs] = useState<any>(null);
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
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/users/training?userId=${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
  }, [user]);

  if (loading) return <div></div>;

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col h-screen w-screen">
        <TitleBar
          isSearchable={true}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div className="flex flex-row h-screen w-screen">
          <Sidebar
            currentPage="trainings"
            user={user.fullName}
            isAdmin={user.isAdmin}
          />

          <div className="flex flex-col flex-1">
            <div className="header">
              <h1 className="text-lg font-medium text-[#7C7171]">
                Training logs
              </h1>
              <CreateNewButton currentPage="training"></CreateNewButton>
            </div>
            <hr className="border-[#615E5E66] w-full border" />
            <div className="flex flex-col items-center gap-4 ">
              <p className="m-3">You have no training logs.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar
        isSearchable={true}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div className="flex flex-row h-screen w-screen">
        <Sidebar
          currentPage="trainings"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />

        <div className="flex flex-col flex-1">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">
              Training logs
            </h1>
            <CreateNewButton currentPage="training"></CreateNewButton>
          </div>
          <hr className="border-[#615E5E66] w-full border" />
          <div className="pt-3 flex flex-col items-center gap-4">
            {searchText === ""
              ? logs.map((log: any) => (
                  <TrainingLogCard
                    id={log._id}
                    user={user.fullName}
                    animal={log.animal.name}
                    breed={log.animal.breed}
                    title={log.title}
                    date={log.date}
                    description={log.description}
                    hours={log.hours}
                    onClick={(id: string) => router.push(`/trainings/${id}`)}
                    isEditable={true}
                  />
                ))
              : logs
                  .filter((log: any) =>
                    log.title.toLowerCase().includes(searchText.toLowerCase()),
                  )
                  .map((log: any) => (
                    <TrainingLogCard
                      id={log._id}
                      user={user.fullName}
                      animal={log.animal.name}
                      breed={log.animal.breed}
                      title={log.title}
                      date={log.date}
                      description={log.description}
                      hours={log.hours}
                      onClick={(id: string) => router.push(`/trainings/${id}`)}
                      isEditable={true}
                    />
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
}
