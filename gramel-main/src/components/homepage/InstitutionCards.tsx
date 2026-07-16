import Image from "next/image";
import type { Institution } from "@/data/institutions";

export default function InstitutionCards({
  institutions,
}: {
  institutions: Institution[];
}) {
  return (
    <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {institutions.map((institution) => (
        <InstitutionCard key={institution.university} {...institution} />
      ))}
    </div>
  );
}

function InstitutionCard({ image, alt, university, description }: Institution) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl transition-shadow duration-300 hover:shadow-xl">
      <button className="absolute top-4 left-4 z-10 rounded-2xl bg-black/40 p-4 py-3 text-white">
        Featured
      </button>
      <div className="relative aspect-[414/352] w-full overflow-hidden rounded-t-3xl">
        <Image
          src={image}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="scale-100 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="grow rounded-b-3xl bg-primary p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-full bg-[#D9D9D9]"></div>
          <p className="text-lg md:text-[1.375rem]">{university}</p>
        </div>
        <p className="mt-2 pt-6 text-lg md:pt-10 md:text-[1.375rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
