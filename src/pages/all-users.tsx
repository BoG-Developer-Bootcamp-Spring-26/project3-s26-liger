import { Sidebar } from "../components/sidebar";
import { TitleBar } from "../components/titlebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [lastUser, setLastUser] = useState("start");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const limit = 8;

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
    }

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `/api/admin/users?cursor=${lastUser}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
          setLoading(false);
          if (data.users?.length > 0) {
            setLastUser(data.users[data.users.length - 1]._id);
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
          currentPage="all-users"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />
        <div className="flex flex-col flex-1">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">All users</h1>
          </div>
          <hr className="border-[#615E5E66] w-full border" />

          {!users || users.length === 0 ? (
            <div>
              <p className="m-3">There are no users.</p>
            </div>
          ) : (
            <div className="px-6 py-5">
              {users
                .filter((u: any) => {
                  if (!searchText) {
                    return true;
                  }
                  return u.fullName
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                })
                .map((u: any) => (
                  <p key={u._id} className="mb-2">
                    {u.fullName}
                  </p>
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
                if (users.length === limit) setPage(page + 1);
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
