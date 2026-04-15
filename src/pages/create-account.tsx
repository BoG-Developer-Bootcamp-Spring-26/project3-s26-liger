import Image from "next/image";
import Link from "next/link";
import { Heebo, Oswald } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/router";

const oswald = Oswald({ subsets: ["latin"], weight: ["500"] });
const heebo = Heebo({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default function CreateAccountPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");

  const trySignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, admin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }

      // redirect to dashboard on success
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setError("Server error");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Decorative bottom-left quarter circle (shared size) */}
      <div className="pointer-events-none absolute bottom-[-198px] left-[-182px] h-[395px] w-[360px] rounded-full bg-[#ED2B2A]" />
      <header className="relative h-[102px] w-full bg-white">
        {/* Figma frame is 1728px wide; center it on large screens */}
        <div className="relative mx-auto h-full w-full max-w-[1728px]">
          {/* Logo + title group positioned per Figma */}
          <div className="absolute left-[49px] top-[26px] flex items-center gap-[6px]">
            <Image
              src="/images/applogo.png"
              alt="App logo"
              width={83}
              height={50}
              priority
            />
            <span
              className={`${oswald.className} text-[50px] font-medium leading-none tracking-[-0.025em] text-black`}
            >
              Progress
            </span>
          </div>
        </div>

        {/* Divider + accent lines */}
        <div className="absolute bottom-[1px] left-0 right-0 h-px bg-gray-200" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-purple-500" />
      </header>

      <main className="flex justify-center px-6 pt-[115px]">
        <div className="w-[700px] origin-top scale-[0.92] px-4">
          <h1
            className={`${heebo.className} text-center text-[64px] font-bold leading-none text-black`}
          >
            Create Account
          </h1>

          {/* Form area */}
          <form
            className="mt-[40px] w-full"
            onSubmit={(e) => {
              e.preventDefault();
              trySignup();
            }}
          >
            {/* Inner form group in Figma is 700×367 (full width lines) */}
            <div className="flex w-full flex-col gap-[26px]">
              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </label>

              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </label>

              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </label>

              <label className="mb-[18px] block w-full">
                <input
                  className={`${heebo.className} w-full border-b-[2.5px] border-primary-red bg-transparent pb-[3px] text-[25px] font-light leading-none text-black outline-none placeholder:text-black`}
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </label>

              <label className="-mt-[6px] flex items-center gap-[12px]">
                <input
                  type="checkbox"
                  name="admin"
                  className="relative h-[25px] w-[25px] appearance-none rounded-none border-[2.5px] border-primary-red bg-white align-middle checked:bg-primary-red checked:border-primary-red focus:outline-none after:absolute after:left-[7px] after:top-[3px] after:h-[12px] after:w-[6px] after:rotate-45 after:border-b-[3px] after:border-r-[3px] after:border-white after:content-[''] after:opacity-0 checked:after:opacity-100"
                  checked={admin}
                  onChange={(e) => {
                    setAdmin(e.target.checked);
                    if (error) setError("");
                  }}
                />
                <span
                  className={`${heebo.className} text-[25px] font-light leading-none text-black`}
                >
                  Admin access
                </span>
              </label>

              {error && <p style={{ color: "#D21312" }}>{error}</p>}

              {/* Signup button */}
              <button
                type="submit"
                className={`${heebo.className} mt-[10px] h-[70px] w-full rounded-[20px] bg-primary-red text-center text-[40px] font-medium leading-none text-white`}
              >
                Sign up
              </button>

              {/* Sign in link */}
              <div
                className={`${heebo.className} mt-[14px] text-center text-[25px] font-light leading-none text-black`}
              >
                Already have an account?{" "}
                <Link href="/login" className="font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

