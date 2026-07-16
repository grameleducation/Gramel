import Image from "next/image";
import { ArrowUpRight } from "@/lib/icons";
import { FC } from "react";

interface HelpCard {
  title: string;
  description: string;
}

const helpCards: HelpCard[] = [
  {
    title: "Explore the Right Opportunities",
    description:
      "We help you discover and compare programs across 1,500+ global institutions based on your goals, background, and budget, so you don't waste time or money applying to the wrong schools.",
  },
  {
    title: "Build a Strong Application",
    description:
      "Our expert advisors guide you in preparing all necessary documents, like your Statement of Purpose (SOP), academic records, and recommendation letters—while keeping you on track with important deadlines.",
  },
  {
    title: "Get Visa-Ready with Confidence",
    description:
      "Visa denials can be stressful—but we reduce the risk with complete support. We help you prepare the right documents, practice for interviews, and submit a strong, compliant visa application.",
  },
];

const HelpCardComponent: FC<HelpCard> = ({ title, description }) => (
  <div className="group relative rounded-2xl rounded-tl-4xl bg-[#f0f0f0] p-8 text-[#93969F] duration-300 hover:bg-primary hover:text-white lg:p-12.5">
    {/* bg dot */}
    <div className="absolute top-0 left-0 max-w-full">
      <Image
        src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940937/gramel/public/services-page/bg-dot_q34tbd.jpg"
        width={300}
        height={138}
        alt="Background dot"
        className="h-auto w-full mix-blend-multiply"
      />
    </div>

    {/* Valedictory Cap */}
    <div className="absolute -top-5.5 -left-11">
      <Image
        src="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/light-blue-cap_lz5mtu.png"
        alt="Valedictory Cap"
        width={132}
        height={108}
      />
    </div>

    <div className="float-right mb-15 flex size-16 items-center justify-center rounded-full bg-primary-300 text-white">
      <ArrowUpRight className="size-4" />
    </div>

    <h4 className="clear-both text-2xl font-bold text-primary/90 duration-300 group-hover:text-white">
      {title}
    </h4>

    <p className="mt-4">{description}</p>
  </div>
);

const HowWeHelpGrid: FC = () => (
  <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {helpCards.map((card) => (
      <HelpCardComponent key={card.title} {...card} />
    ))}
  </div>
);

export default HowWeHelpGrid;
