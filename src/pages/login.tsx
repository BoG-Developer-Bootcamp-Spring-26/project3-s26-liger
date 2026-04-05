import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const tryLogin = async () =>{
        try {
            const res = await fetch("/api/users/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }
            // redirect to dashboard on success
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Server error");
        }
    }
    return <div>
        <h3>Login</h3>
        <form onSubmit={(e) => { e.preventDefault(); tryLogin();}}>
            <div>
            <label>Username
                <input type="email" name="email" id="efield" value={email} 
                onChange={(e) => setEmail(e.target.value)} required/>
            </label>
            
            <label> Password
                <input type="password" name="password" id="pfield" value={password} 
                onChange={(e) => setPassword(e.target.value)} required/>
            </label> 
            </div>
             <button type="submit">Log in</button>
        </form>
       
        {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
} 