import { FC } from "react";
import {
  Briefcase,
  Wallet,
  Globe,
  Timeline,
  CanvasDollar,
  ListDropdown,
} from "@/lib/icons";

interface ReasonCard {
  icon: FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const reasons: ReasonCard[] = [
  {
    icon: Briefcase,
    title: "Global School Access",
    description:
      "Gain access to over 1,500+ accredited institutions through our partnership with ApplyBoard. From Canada to Australia, the UK to the U.S., we open doors to quality education around the world.",
  },
  {
    icon: Wallet,
    title: "Personalized Guidance",
    description:
      "No two students are the same. That's why we take the time to understand your goals, academic background, and budget, then recommend schools, programs, and funding options that fit YOU.",
  },
  {
    icon: Globe,
    title: "Complete Financial Support",
    description:
      "We don’t just help you apply, we help you afford it. From student loans to scholarship applications, we guide you toward the most sustainable financial options.",
  },
  {
    icon: Timeline,
    title: "End-to-End Application Support",
    description:
      "From crafting the perfect Statement of Purpose to tracking deadlines and following up on offers, we handle the details so you can focus on your future.",
  },
  {
    icon: CanvasDollar,
    title: "Visa & Relocation Assistance",
    description:
      "We provide detailed visa support, mock interviews, and pre-departure planning. With student housing, flight booking, and arrival prep—you’ll never feel lost or alone.",
  },
  {
    icon: ListDropdown,
    title: "Trusted, Transparent & Student-Centered",
    description:
      "We believe in honest advice, clear communication, and putting your success first—always. No hidden fees, no shortcuts—just reliable, experienced support from a team that truly cares.",
  },
];

function ReasonCardComponent({ icon: Icon, title, description }: ReasonCard) {
  return (
    <div className="rounded-[1rem] bg-[#F2F5FF] p-12.5 max-lg:p-8">
      <Icon className="mx-auto mb-[0.625rem] size-8 text-primary-300 sm:mx-0" />
      <h3 className="mb-2 text-center text-2xl font-bold text-primary/90 sm:text-left">
        {title}
      </h3>
      <p className="text-center text-base text-[#93969F] sm:text-left">
        {description}
      </p>
    </div>
  );
}

function WhyChooseUsGrid() {
  return (
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {reasons.map((reason) => (
        <ReasonCardComponent key={reason.title} {...reason} />
      ))}
    </div>
  );
}

export default WhyChooseUsGrid;
