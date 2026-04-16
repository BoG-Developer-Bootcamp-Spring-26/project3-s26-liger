type Props = {
  name: string;
  breed: string;
  hours: number;
  animalpfp: string;
  ownerName?: string;
};

export default function AnimalCard({
  name,
  breed,
  hours,
  animalpfp,
  ownerName = "",
}: Props) {
  const animalInitial = name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-3xl bg-white shadow-[0_6px_14px_rgba(0,0,0,0.12)]">
      <img
        src={animalpfp}
        alt={`${name} profile`}
        className="h-44 w-full object-cover object-top"
      />

      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-red text-2xl font-bold leading-none text-white">
          {animalInitial}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xl font-bold leading-tight text-[#200404]">
            {name} - {breed}
          </p>
          <p className="mt-0.5 truncate text-base text-[#8B8B8B]">
            {ownerName ? (
              <>
                <span className="font-semibold text-[#737373]">
                  {ownerName}
                </span>
                <span className="mx-2">•</span>
              </>
            ) : null}
            Trained: {hours} hours
          </p>
        </div>
      </div>
    </div>
  );
}
