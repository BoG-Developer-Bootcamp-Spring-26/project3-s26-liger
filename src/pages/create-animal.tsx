import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";

type FormData = {
  name: string;
  breed: string;
  hoursTrained: string;
  profilePicture: string;
};

const initialForm: FormData = {
  name: "",
  breed: "",
  hoursTrained: "",
  profilePicture:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhgFrGQCL3wPCNMDd60yqsmjhJxQZN2dmGEMT4jNiQlH0Eu2iu",
};

export default function CreateAnimalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<FormData>(initialForm);

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
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (authLoading || !user) {
    return <div></div>;
  }

  const onFieldChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    const parsedHours = Number(form.hoursTrained);
    if (!form.name.trim() || !form.breed.trim() || Number.isNaN(parsedHours)) {
      setErrorMessage("Please fill all required fields with valid values.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/animal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          breed: form.breed.trim(),
          owner: user.userId,
          hoursTrained: parsedHours,
          profilePicture: form.profilePicture.trim(),
        }),
      });

      if (res.ok) {
        router.push("/animals");
        return;
      }

      const data = await res.json();
      setErrorMessage(data.error || "Failed to create animal.");
    } catch (e) {
      setErrorMessage("Failed to create animal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <TitleBar isSearchable={false} />
      <div className="flex w-screen flex-1 flex-row">
        <Sidebar
          currentPage="animals"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">Animals</h1>
          </div>
          <hr className="w-full border border-[#615E5E66]" />

          <div className="mx-auto mt-5 w-full max-w-[590px] pb-5 text-[#2D2A2A]">
            <label className="mb-1 block text-lg font-semibold">
              Animal Name
            </label>
            <input
              value={form.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Name"
              className="mb-3 h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            <label className="mb-1 block text-lg font-semibold">Breed</label>
            <input
              value={form.breed}
              onChange={(e) => onFieldChange("breed", e.target.value)}
              placeholder="Breed"
              className="mb-3 h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            <label className="mb-1 block text-lg font-semibold">
              Total hours trained
            </label>
            <input
              value={form.hoursTrained}
              onChange={(e) => onFieldChange("hoursTrained", e.target.value)}
              placeholder="100"
              className="mb-3 h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            <label className="mb-1 block text-lg font-semibold">
              Animal picture link
            </label>
            <input
              value={form.profilePicture}
              onChange={(e) => onFieldChange("profilePicture", e.target.value)}
              placeholder="https://..."
              className="h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            {errorMessage ? (
              <p className="mt-3 text-sm font-medium text-[#D21312]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-7 flex gap-5">
              <button
                onClick={() => router.push("/animals")}
                className="h-10 w-[118px] rounded-md border border-[#D21312] text-lg font-semibold text-[#D21312]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-10 w-[118px] rounded-md bg-[#D21312] text-lg font-semibold text-white disabled:opacity-70"
              >
                {saving ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
