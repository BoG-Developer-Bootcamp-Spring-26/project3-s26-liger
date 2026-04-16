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
        const res = await fetch(`/api/training?id=${user.userId}`);
        const data = await res.json();
        setLogs(data.logs || []);
        setLoading(false);
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
            <div className="flex flex-col items-center gap-4 ">
              <p className="m-3">You have no training logs.</p>
              <TrainingLogCard
                id={"exampleId"}
                user={user.fullName}
                animal={"Example animal"}
                breed={"Example breed"}
                title={"Example training log"}
                date={new Date()}
                description={
                  "This is an example training log. Create your own!"
                }
                hours={0}
                onClick={(id: string) => router.push(`/trainings/${id}`)}
              />
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
        <div className="flex flex-1 flex-col items-center gap-4 py-8">
          <div className="header justify-between items-center">
            <h1 className="text-2xl font-bold text-[#7C7171]">Training Logs</h1>
            <CreateNewButton currentPage="training"></CreateNewButton>
          </div>
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
                  hours={log.hoursTrained}
                  onClick={(id: string) => router.push(`/trainings/${id}`)}
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
                    hours={log.hoursTrained}
                    onClick={(id: string) => router.push(`/trainings/${id}`)}
                  />
                ))}
        </div>
      </div>
    </div>
  );
}
