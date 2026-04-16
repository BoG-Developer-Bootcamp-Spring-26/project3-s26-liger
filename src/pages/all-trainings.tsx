import { TrainingLogCard } from "../components/trainingLogCard";
import { Sidebar } from "../components/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";


export default function AllTrainings() {
    const [logs, setLogs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [lastLog, setLastLog] = useState('start');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const limit = 4;


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
        const res = await fetch(`/api/admin/training?cursor=${lastLog}&limit=${limit}`);
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

  if (!logs || logs.length === 0) {
    return(
    <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-trainings" user={user.fullName} isAdmin={user.isAdmin}/>
        <div className="flex flex-col flex-1 px-6">
        <div className="header">
                <h1>All Training Logs</h1>      
            </div>
            <hr></hr>
        <div>
            <p className="margins-10px">There are no training logs.</p>
        </div>
        </div>
    </div>

    );
  }

  return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="all-trainings" user={user.fullName} isAdmin={user.isAdmin}/>
        <div className="flex flex-1 flex-col items-center gap-4 py-8">
            <div className="header justify-between items-center">
                <h1>All Training Logs</h1>
                
            </div>
            {logs.map((log: any) => (
                <TrainingLogCard
                    user={user.fullName}
                    animal={log.animal.name}
                    breed = {log.animal.breed}
                    title={log.title}
                    date={log.date}
                    description={log.description}
                    hours={log.hoursTrained}
                />
            ))}
        </div>
        <div className="flex items-end justify-center">
                <button onClick={() => {if(page > 1){setPage(page - 1)}}}> ← </button>
                <p> {page} </p>
                <button onClick={() => { if (logs.length === limit) setPage(page + 1)}}> → </button>
        </div>
        </div>
    );
}