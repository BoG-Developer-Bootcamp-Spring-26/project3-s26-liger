import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { TitleBar } from "@/components/titlebar";
import arrowDownLogo from "../../../public/images/arrowDownLogo.png";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Animal = {
  _id: string;
  name: string;
  breed: string;
};

type FormData = {
  title: string;
  animal: string;
  hours: string;
  month: string;
  day: string;
  year: string;
  description: string;
};

const initialForm: FormData = {
  title: "",
  animal: "",
  hours: "",
  month: "January",
  day: "",
  year: "",
  description: "",
};

export default function TrainingLogPage() {
  const router = useRouter();
  const { trainingLogId } = router.query;
  const [form, setForm] = useState<FormData>(initialForm);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    if (!user || typeof trainingLogId !== "string") {
      return;
    }
    const fetchPageData = async () => {
      try {
        const [logRes, animalsRes] = await Promise.all([
          fetch(`/api/training/${trainingLogId}`),
          fetch(`/api/animal?id=${user.userId}`),
        ]);

        if (!logRes.ok) {
          router.push("/trainings");
          return;
        }

        const log = await logRes.json();
        const logDate = log.date ? new Date(log.date) : new Date();
        const animalId =
          typeof log.animal === "string" ? log.animal : (log.animal?._id ?? "");

        setForm({
          title: log.title ?? "",
          animal: animalId,
          hours: String(log.hours ?? ""),
          month: MONTHS[logDate.getMonth()] ?? "January",
          day: String(logDate.getDate()),
          year: String(logDate.getFullYear()),
          description: log.description ?? "",
        });

        if (animalsRes.ok) {
          const animalData = await animalsRes.json();
          setAnimals(animalData.animals ?? []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [trainingLogId, user]);

  const onFieldChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!trainingLogId || typeof trainingLogId !== "string" || !user) {
      return;
    }

    const monthIndex = MONTHS.indexOf(form.month);
    const parsedHours = Number(form.hours);
    const parsedDay = Number(form.day);
    const parsedYear = Number(form.year);

    if (
      !form.title ||
      !form.animal ||
      !form.description ||
      Number.isNaN(parsedHours) ||
      Number.isNaN(parsedDay) ||
      Number.isNaN(parsedYear) ||
      monthIndex < 0
    ) {
      return;
    }

    const parsedDate = new Date(parsedYear, monthIndex, parsedDay);

    setSaving(true);
    try {
      const res = await fetch(`/api/training/${trainingLogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.userId,
          animal: form.animal,
          title: form.title,
          date: parsedDate.toISOString(),
          description: form.description,
          hours: parsedHours,
        }),
      });

      if (res.ok) {
        router.push("/trainings");
      }
    } catch (e) {
      console.error(e);
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
          <hr className="border-[#615E5E66] w-full border" />

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
                <option value="">Select Animal</option>
                {animals.map((animal) => (
                  <option key={animal._id} value={animal._id}>
                    {animal.name} - {animal.breed}
                  </option>
                ))}
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

            <div className="mb-3 grid grid-cols-[1.2fr_0.8fr_1fr] gap-3.5">
              <div>
                <label className="mb-1 block text-lg font-semibold">
                  Month
                </label>
                <div className="relative">
                  <select
                    value={form.month}
                    onChange={(e) => onFieldChange("month", e.target.value)}
                    className="h-11 w-full appearance-none rounded-md border border-[#C0BFBF] bg-white px-3 pr-14 text-lg focus:outline-none"
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <Image
                      src={arrowDownLogo}
                      alt="dropdown arrow"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-lg font-semibold">Date</label>
                <input
                  value={form.day}
                  onChange={(e) => onFieldChange("day", e.target.value)}
                  placeholder="20"
                  className="h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-lg font-semibold">Year</label>
                <input
                  value={form.year}
                  onChange={(e) => onFieldChange("year", e.target.value)}
                  placeholder="2023"
                  className="h-11 w-full rounded-md border border-[#C0BFBF] px-3 text-lg focus:outline-none"
                />
              </div>
            </div>

            <label className="mb-1 block text-lg font-semibold">Note</label>
            <textarea
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Note"
              className="h-28 w-full resize-none rounded-md border border-[#C0BFBF] p-3 text-lg focus:outline-none"
            />

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
