import { TrainingLogCard } from "../components/trainingLogCard";
import { Sidebar } from "../components/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CreateNewButton from "@/components/createNew";

export default function Trainings() {
    const [logs, setLogs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

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
    return(
    <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="trainings" user={user.fullName} isAdmin={user.isAdmin}/>
        
        <div className="flex flex-col flex-1 px-6">
        <div className="header">
                <p style={{fontSize:'20px'}}>Training Logs</p>
                <CreateNewButton currentPage="training"></CreateNewButton>
            </div>
            <hr></hr>
        <div>
            <p className="margins-10px">You have no training logs.</p>
        </div>
        </div>
    </div>

    );
  }

  return(
        <div className="flex flex-row h-screen w-screen">
        <Sidebar currentPage="trainings" user={user.fullName} isAdmin={user.isAdmin}/>
        <div className="flex flex-col flex-1 px-6">
            <div className="header">
                <p style={{fontSize:'20px'}}>Training Logs</p>
                <CreateNewButton currentPage="training"></CreateNewButton>
            </div>
        <hr></hr>
            <div className="flex flex-col items-center gap-4 py-8">
                {logs.map((log: any) => (
                    <TrainingLogCard
                        user={user.fullName}
                        animal={log.animal.name}
                        breed = {log.animal.breed}
                        title={log.title}
                        date={log.date}
                        description={log.description}
                        hours={log.hours}
                    />
                ))}
                </div>
        </div>
        </div>
    );
}