import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";
import arrowDownLogo from "../../public/images/arrowDownLogo.png";

type Animal = {
  _id: string;
  name: string;
  breed: string;
};

type FormData = {
  title: string;
  animal: string;
  hours: string;
  description: string;
};

const initialForm: FormData = {
  title: "",
  animal: "",
  hours: "",
  description: "",
};

export default function CreateLogPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<FormData>(initialForm);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const userRes = await fetch("/api/me");
        const data = await userRes.json();

        if (!userRes.ok) {
          router.push("/login");
          return;
        }

        setUser(data.user);

        const animalsRes = await fetch(
          `/api/users/animal?ownerId=${data.user.userId}`,
        );

        if (animalsRes.ok) {
          const animalsData = await animalsRes.json();
          const animalList = animalsData.animals ?? [];
          setAnimals(animalList);

          if (animalList.length > 0) {
            setForm((prev) => ({ ...prev, animal: animalList[0]._id }));
          }
        }
      } catch (e) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

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

    const parsedHours = Number(form.hours);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.animal.trim() ||
      Number.isNaN(parsedHours)
    ) {
      setErrorMessage("Please fill all fields with valid values.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.userId,
          animal: form.animal,
          title: form.title.trim(),
          date: new Date().toISOString(),
          description: form.description.trim(),
          hours: parsedHours,
        }),
      });

      if (res.ok) {
        router.push("/trainings");
        return;
      }

      const data = await res.json();
      setErrorMessage(data.error || "Failed to create training log.");
    } catch (e) {
      setErrorMessage("Failed to create training log.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div></div>;

  return (
    <div className="flex h-screen w-screen flex-col">
      <TitleBar isSearchable={false} />
      <div className="flex w-screen flex-1 flex-row">
        <Sidebar
          currentPage="trainings"
          user={user.fullName}
          isAdmin={user.isAdmin}
        />

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="header">
            <h1 className="text-lg font-medium text-[#7C7171]">
              Training logs
            </h1>
          </div>
          <hr className="w-full border border-[#615E5E66]" />

          <div className="mx-auto mt-5 w-full max-w-[590px] pb-5 text-[#2D2A2A]">
            <label className="mb-1 block text-lg font-semibold">Title</label>
            <input
              value={form.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              placeholder="Title"
              className="mb-3 h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            <label className="mb-1 block text-lg font-semibold">
              Select Animal
            </label>
            <div className="relative mb-3">
              <select
                value={form.animal}
                onChange={(e) => onFieldChange("animal", e.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-[#C0BFBF] bg-white px-3 pr-14 text-lg focus:outline-none"
              >
                {animals.length === 0 ? (
                  <option value="">No animals found</option>
                ) : (
                  animals.map((animal) => (
                    <option key={animal._id} value={animal._id}>
                      {animal.name} - {animal.breed}
                    </option>
                  ))
                )}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <Image
                  src={arrowDownLogo}
                  alt="dropdown arrow"
                  className="h-7 w-7 object-contain"
                />
              </div>
            </div>

            <label className="mb-1 block text-lg font-semibold">
              Total hours trained
            </label>
            <input
              value={form.hours}
              onChange={(e) => onFieldChange("hours", e.target.value)}
              placeholder="20"
              className="mb-3 h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
            />

            <label className="mb-1 block text-lg font-semibold">Note</label>
            <textarea
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Note"
              className="h-28 w-full resize-none rounded-md border border-[#C0BFBF] p-3 text-lg focus:outline-none"
            />

            {errorMessage ? (
              <p className="mt-3 text-sm font-medium text-[#D21312]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-7 flex gap-5">
              <button
                onClick={() => router.push("/trainings")}
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
