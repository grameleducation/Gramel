import { FC } from "react";
import {
  AirplaneTilt,
  FileArchive,
  Planet,
  Student,
  Translate,
  UserSound,
} from "@/lib/icons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Service {
  icon: FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Student,
    title: "Admissions",
    href: "international-admissions",
    description:
      "Getting into the right school starts with the right application. From program selection to document review, we streamline every step through our network of trusted global partners, giving you access to over 1,500 institutions worldwide.",
  },
  {
    icon: FileArchive,
    title: "Document Verification",
    href: "document-verification",
    description:
      "A strong application lives or dies by its paperwork. We polish your Statement of Purpose, recommendation letters, and every supporting document until your file is impossible to overlook.",
  },
  {
    icon: Planet,
    title: "Scholarships",
    href: "scholarships",
    description:
      "Tuition shouldn't be the reason you don't go. Our team hunts down merit-based and need-based scholarships that match your profile, then helps you build an application that wins them.",
  },
  {
    icon: AirplaneTilt,
    title: "Visa Assistance",
    href: "visa-assistance",
    description:
      "One denied visa can derail an entire admission. Our experts turn a complex, high-stakes process into a clear checklist—right documents, correct forms, and interview practice that builds real confidence.",
  },
  {
    icon: Translate,
    title: "Language Proficiency Tests",
    href: "language-proficiency-tests",
    description:
      "IELTS, TOEFL, or another proficiency exam standing between you and your offer letter? We handle registration, prep, and strategy so you walk in ready to hit your target score.",
  },
  {
    icon: UserSound,
    title: "Advisory Services",
    href: "advisory-services",
    description:
      "Not sure where to even begin? One-on-one advisory sessions give you a clear, personalized roadmap—program selection, funding strategy, and career pathway—so every decision moves you forward.",
  },
];

function ServiceCard({ icon: Icon, title, description, href }: Service) {
  return (
    <Link
      href={`/services/${href}`}
      className="group grid grid-rows-[auto_auto_1fr_auto] rounded-2xl bg-[#F2F5FF] p-6 text-[#93969F] transition-colors duration-200 hover:bg-primary hover:text-white"
      prefetch={false}
    >
      <Icon className="mb-4 inline-block size-12 text-primary group-hover:text-white" />
      <h3 className="mb-2 text-xl font-semibold text-[#1e1e1e] group-hover:text-inherit">
        {title}
      </h3>
      <p className="text-sm leading-relaxed">{description}</p>

      {/* read more */}
      <div className="mt-4 flex w-max items-center gap-2 text-primary group-hover:text-white hover:underline">
        <p className="text-sm">View Details</p>
        <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}

function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </div>
  );
}

export default ServicesGrid;
