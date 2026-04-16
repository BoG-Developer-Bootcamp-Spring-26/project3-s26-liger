import { TrainingLogCard } from "../components/trainingLogCard";
import { Sidebar } from "../components/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";


export default function AllUsers() {
    const [users, setUsers] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [lastUser, setLastUser] = useState('start');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const limit = 8;


  useEffect(() => {
    const fetchUser = async() =>{
        try {
            const res = await fetch("/api/me");
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
            } else {
                router.push('/login');
            }
        }
        catch(e) {
            console.error(e);
        }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
        return;
    }
     if (!user.isAdmin) {
        router.push('/training');   
    }

     const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/admin/users?cursor=${lastUser}&limit=${limit}`);
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

  if (!users || users.length === 0) {
    return(
    <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-users" user={user.fullName} isAdmin={user.isAdmin}/>
        <div className="flex flex-col flex-1 px-6">
        <div className="header">
                <h1>All Users</h1>      
            </div>
            <hr></hr>
        <div>
            <p className="margins-10px">There are no users.</p>
        </div>
        </div>
    </div>

    );
  }

  return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-users" user={user.fullName} isAdmin={user.isAdmin}/>
        <div className="flex flex-1 flex-col items-center gap-4 py-8">

            <div className="header justify-between items-center">
                <h1>All users</h1>
                
            </div>
            {users.map((u: any) => (
                <p>{u.fullName}</p>
            ))}
            <div className="flex items-end justify-center">
                <button onClick={() => {if(page > 1){setPage(page - 1)}}}> ← </button>
                <p> {page} </p>
                <button onClick={() => { if (users.length === limit) setPage(page + 1)}}> → </button>
        </div>
        </div>
        
        </div>
    );
}