import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Heebo } from "next/font/google";
import { TitleBar } from "@/components/titlebar";

const heebo = Heebo({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = async () => {
    try {
      const res = await fetch(`/api/users/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);

        return;
      }
      // redirect to dashboard on success

      router.push("/trainings");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Decorative bottom-left quarter circle (shared size) */}
      <div className="pointer-events-none absolute bottom-[-198px] left-[-182px] h-[395px] w-[360px] rounded-full bg-[#ED2B2A]" />
      <TitleBar isSearchable={false} />

      <main className="flex justify-center px-6 pt-[115px]">
        <div className="w-[700px] origin-top scale-[0.92] px-4">
          <h1
            className={`${heebo.className} text-center text-[64px] font-bold leading-none text-black`}
          >
            Login
          </h1>

          <form
            className="mt-[40px] w-full"
            onSubmit={(e) => {
              e.preventDefault();
              tryLogin();
            }}
          >
            <div className="flex w-full flex-col gap-[26px]">
              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="email"
                  name="email"
                  id="efield"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="password"
                  name="password"
                  id="pfield"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className={`${heebo.className} mt-[10px] h-[70px] w-full rounded-[20px] bg-primary-red text-center text-[40px] font-medium leading-none text-white`}
              >
                Log in
              </button>

              <div
                className={`${heebo.className} mt-[14px] text-center text-[25px] font-light leading-none text-black`}
              >
                Don&apos;t have an account?{" "}
                <Link href="/create-account" className="font-medium">
                  Sign up
                </Link>
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
