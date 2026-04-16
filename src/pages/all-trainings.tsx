import { TrainingLogCard } from "../components/trainingLogCard";
import { Sidebar } from "../components/sidebar";
import { TitleBar } from "../components/titlebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AllTrainings() {
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lastLog, setLastLog] = useState("start");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const limit = 4;

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
      router.push("/trainings");
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `/api/admin/training?cursor=${lastLog}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          setLogs(data.traininglogs || []);
          setLoading(false);
          if (data.traininglogs?.length > 0) {
            setLastLog(data.traininglogs[data.traininglogs.length - 1]._id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
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
          currentPage="all-trainings"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />
        <div className="flex flex-col flex-1">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">All training</h1>
          </div>
          <hr className="border-[#615E5E66] w-full border" />

          {!logs || logs.length === 0 ? (
            <div>
              <p className="m-3">There are no training logs.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              {logs
                .filter((log: any) => {
                  if (!searchText) {
                    return true;
                  }
                  return log.title
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                })
                .map((log: any) => (
                  <TrainingLogCard
                    key={log._id}
                    user={user.fullName}
                    animal={log.animal.name}
                    breed={log.animal.breed}
                    title={log.title}
                    date={log.date}
                    description={log.description}
                    hours={log.hours}
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
                if (logs.length === limit) setPage(page + 1);
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
