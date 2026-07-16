import LoginForm from "@/components/forms/LoginForm";
import Image from "next/image";

// TODO: When a page redirects to login page, after a successful login, redirect back to the page
export default function LoginPage() {
  return (
    <main className="">
      <section className="mx-auto grid max-w-screen-2xl px-4 md:grid-cols-2">
        <Image
          src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940766/gramel/public/login-page/male-and-female-students_nrj629.jpg"
          alt="Male and female students standing outside a university building"
          className="hidden h-full w-full rounded-2xl object-cover md:block"
          sizes="(min-width: 768px) 50vw, 0"
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
              Welcome Back to <br className="hidden md:block" /> Gramel
              Education
            </h1>
            <p className="mt-2.5 text-center text-[#1E1E1E] md:text-left">
              Access your personalized dashboard to continue your journey. Track
              your applications, upload documents, connect with your advisor,
              and stay updated—right from your account.
            </p>
            <hr className="my-4 bg-[#7F7F7F]" />

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
