import SignUpForm from "@/components/forms/SignUpForm";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <main className="">
      <section className="mx-auto grid max-w-screen-2xl px-4 md:grid-cols-2">
        <Image
          src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754941818/gramel/public/signup-page/africa-female-student_ov9hms.jpg"
          alt="Africa female student posed with backpack and books"
          className="hidden h-full w-full rounded-2xl object-cover md:block"
          sizes="(min-width: 768px) 50vw, 0vw"
          width={720}
          height={992}
          priority
        />

        <div className="py-12 md:pl-4">
          <div className="py-12.5 lg:px-8 xl:px-16">
            <Image
              src="/gramel-education-logo.png"
              alt="Gramel Education logo"
              className="hidden h-auto w-32 md:block"
              sizes="(max-width: 768px) 0, 8rem"
              width={185}
              height={72}
            />

            <h1 className="mt-4 text-center text-3xl font-bold text-primary md:text-left lg:text-4xl xl:text-5xl">
              Start Your Journey with Gramel Education
            </h1>
            <p className="mt-2.5 text-center text-[#1E1E1E] md:text-left">
              Create your free account to access thousands of international
              programs, track your applications, and get personalized guidance
              on everything from scholarships to visa support.
            </p>

            <hr className="my-4 bg-[#7F7F7F]" />

            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
}
