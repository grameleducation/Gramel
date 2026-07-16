import Image from "next/image";
import Link from "next/link";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function CTASection({
  title = "Your Future Starts Now \nLet Gramel Education Be Your Guide",
  description = "Whether you're just exploring your options or ready to apply, our expert advisors are here to support you every step of the way, from school selection to visa approval. Thousands of students trust us to make their international dreams a reality. You can too.",
  buttonText = "Book a Free Consultation",
  buttonLink = "/contact",
}: CTASectionProps) {
  return (
    <section className="mx-auto max-w-screen-2xl px-6 md:px-12 xl:px-20">
      <div className="relative rounded-3xl bg-[#1E1E1E] p-8 text-center text-white lg:p-16 lg:pb-10">
        <Image
          src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977287/gramel/public/home/cta-bg-image_ikrtm8.jpg"
          alt=""
          width={1280}
          height={400}
          className="absolute top-0 left-0 h-full w-full rounded-2xl object-cover"
        />
        <div className="relative">
          <h2 className="mx-auto mb-6 max-w-4xl text-2xl leading-tight font-semibold lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mb-12 max-w-[65.5rem] lg:text-lg">
            {description}
          </p>
          <Link
            href={buttonLink}
            className="mx-auto block max-w-max rounded-2xl bg-white px-8 py-3 font-semibold text-neutral-500 duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-lg"
            prefetch={false}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
