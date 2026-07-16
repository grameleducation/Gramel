import { FC } from "react";
import {
  AirplaneTilt,
  FileArchive,
  Planet,
  Student,
  Translate,
  MoneyCash,
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
    title: "International Admissions",
    href: "international-admissions",
    description:
      "We help you apply to top universities, colleges, and schools. From program selection to document review, we streamline the process through our partnership with ApplyBoard, giving you access to over 1,500 global institutions.",
  },
  {
    icon: FileArchive,
    title: "Document Verification",
    href: "document-verification",
    description:
      "Writing a strong Statement of Purpose, preparing recommendation letters, and assembling the right documents are key to getting accepted. We provide templates, reviews, and coaching to ensure your application stands out.",
  },
  {
    icon: Planet,
    title: "Scholarships",
    href: "scholarships",
    description:
      "Looking for ways to reduce your tuition? Our team helps you search and apply for merit-based and need-based scholarships that match your academic and personal profile.",
  },
  {
    icon: AirplaneTilt,
    title: "Visa Assistance",
    href: "visa-assistance",
    description:
      "Visa requirements can be complex, but our experts simplify the process. We help you prepare the right documents, fill out visa forms correctly, and even conduct mock interviews to boost your chances of approval.",
  },
  {
    icon: Translate,
    title: "Language Proficiency Tests",
    href: "language-proficiency-tests",
    description:
      "Planning to take a Prometric exam for medical, nursing, or professional certification abroad? We provide full support to help you register, prepare, and succeed.",
  },
  {
    icon: MoneyCash,
    title: "Student Loan",
    href: "student-loan",
    description:
      "We assist with securing local and international education loans. From explaining repayment terms to submitting documentation, we walk you through every step with trusted financial institutions.",
  },
  {
    icon: UserSound,
    title: "Advisory Services",
    href: "advisory-services",
    description:
      "Receive personalized guidance on academic program selection, financial planning, and career pathways to ensure you make informed decisions for your future.",
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
