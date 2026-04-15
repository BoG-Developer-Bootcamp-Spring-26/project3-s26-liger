import { useState, useEffect } from "react";
import Login from "./login";
import Trainings from './trainings'
export default function Home() {
  // check if logged in
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const checkPastUser = async() => {
      const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok) {
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
    }
    checkPastUser();
  }, [])

  if (!loggedIn) {
    return (
      <Login/>
    );
  } else {
    return (<Trainings/>);
  }
  
  
}

