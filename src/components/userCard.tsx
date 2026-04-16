type Props = {
  fullName: string;
  isAdmin: boolean;
  location?: string;
};

export default function UserCard({
  fullName,
  isAdmin,
  location = "Atlanta, Georgia",
}: Props) {
  return (
    <div className="flex w-full max-w-sm items-center rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-red text-2xl font-bold leading-none text-white">
        {fullName.charAt(0).toUpperCase()}
      </div>

      <div className="gap-1 flex flex-col">
        <p className="truncate text-xl font-bold leading-tight text-[#2D0909]">
          {fullName}
        </p>
        <p className="mt-0.5 truncate text-sm text-gray-500">
          <span className="font-semibold text-gray-500">
            {isAdmin ? "Admin" : "User"}
          </span>
          <span className="mx-1">•</span>
          {location}
        </p>
      </div>
    </div>
  );
}
