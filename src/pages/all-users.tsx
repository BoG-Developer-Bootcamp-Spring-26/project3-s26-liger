import { Sidebar } from "../components/sidebar";
import { TitleBar } from "../components/titlebar";
import UserCard from "../components/userCard";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>(["start"]);
  const [hasNextPage, setHasNextPage] = useState(false);
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
        const currentCursor = cursorHistory[page - 1] ?? "start";
        const res = await fetch(
          `/api/admin/users?cursor=${currentCursor}&limit=${limit}`,
        );
        if (res.ok) {
          const data = await res.json();
          const userList = data.users || [];
          setUsers(userList);
          setLoading(false);
          const canGoNext = userList.length === limit;
          setHasNextPage(canGoNext);
          if (canGoNext) {
            const nextCursor = userList[userList.length - 1]._id;
            setCursorHistory((prev) => {
              if (prev[page] === nextCursor) {
                return prev;
              }
              const updated = prev.slice(0, page);
              updated.push(nextCursor);
              return updated;
            });
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
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">All users</h1>
          </div>
          <hr className="border-[#615E5E66] w-full border" />

          <div className="flex-1 overflow-y-auto">
            {!users || users.length === 0 ? (
              <div>
                <p className="m-3">There are no users.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    <UserCard
                      key={u._id}
                      fullName={u.fullName}
                      isAdmin={u.admin}
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
