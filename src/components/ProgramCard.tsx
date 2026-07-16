import Image from "next/image";
import Link from "next/link";
import { RoundStar } from "@/lib/icons";

interface ProgramCardProps {
  image: string;
  university: string;
  programType: string;
  programTitle: string;
  location: string;
  campusCity: string;
  tuition: string;
  applicationFee: string;
  duration: string;
  intakes: { date: string; rate: string }[];
}

export default function ProgramCard({
  image,
  university,
  programType,
  programTitle,
  location,
  campusCity,
  tuition,
  applicationFee,
  duration,
  intakes,
}: ProgramCardProps) {
  return (
    <article>
      {/* Image container */}
      <div className="relative h-96 lg:h-[30rem]">
        <RoundStar className="absolute top-4 right-4 text-4xl text-[#FFAE00]" />
        <Image
          src={image}
          alt={programTitle}
          className="h-full w-full rounded-2xl object-cover"
          sizes="(max-width: 1024px) 100vw, 70vw"
          width={854}
          height={480}
        />
      </div>
      {/* Content container */}
      <div className="mt-6 sm:p-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="size-11 shrink-0 rounded-full bg-[#D9D9D9]"></div>
            <p className="font-semibold text-[#1E1E1E] md:text-2xl">
              {university}
            </p>
          </div>
          <Link
            href="#"
            className="rounded-[0.625rem] bg-primary px-6 py-4 text-center font-semibold text-white duration-300 hover:bg-primary-300 active:bg-primary max-sm:text-sm"
            prefetch={false}
          >
            Start Application
          </Link>
        </div>
        <p className="my-2.5 text-black">{programType}</p>
        <h4 className="mb-3 font-semibold">{programTitle}</h4>
        <hr className="bg-[#7F7F7F]" />
        <ul className="my-3 space-y-3">
          <li className="flex flex-wrap justify-between gap-1">
            <span>Location:</span>
            <span className="font-semibold">{location}</span>
          </li>
          <li className="flex flex-wrap justify-between gap-1">
            <span>Campus City:</span>
            <span className="font-semibold">{campusCity}</span>
          </li>
          <li className="flex flex-wrap justify-between gap-1">
            <span>Tuition:</span>
            <span className="font-semibold">{tuition}</span>
          </li>
          <li className="flex flex-wrap justify-between gap-1">
            <span>Application fee:</span>
            <span className="font-semibold">{applicationFee}</span>
          </li>
          <li className="flex flex-wrap justify-between gap-1">
            <span>Duration:</span>
            <span className="font-semibold">{duration}</span>
          </li>
        </ul>
        <div className="flex flex-col items-center justify-evenly gap-10 rounded-2xl bg-primary p-6 text-center text-white sm:flex-row sm:gap-3">
          {intakes.map((intake, idx) => (
            <div className="space-y-3" key={idx}>
              <div>{intake.date}</div>
              <div className="text-xs text-[#62A9DC]">Admission rate</div>
              <div className="font-semibold">{intake.rate}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
