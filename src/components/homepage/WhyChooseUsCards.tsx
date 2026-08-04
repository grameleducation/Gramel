"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyChooseUsCards() {
  return (
    <div className="mx-auto mt-10 grid max-w-md gap-4 md:mt-16 md:max-w-none md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <WhyChooseUsCard
        index={0}
        title="Admissions"
        description="Our support doesn't stop at the application. We help with offer letter follow-ups, visa guidance, accommodation support, and pre-departure readiness."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/why-choose-us-image-3_czpn0o.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/deep-blue-cap_spvnqe.png"
        backgroundColor="bg-primary-300"
      />

      <WhyChooseUsCard
        index={1}
        title="Scholarships"
        description="We provide advisory services on securing scholarships for exceptional students where such opportunities are available."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/why-choose-us-image-1_b6pgdf.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/light-blue-cap_lz5mtu.png"
        backgroundColor="bg-[#1e1e1e]"
      />

      <WhyChooseUsCard
        index={2}
        title="Trusted Study Abroad Agency in Nigeria"
        description="Based right here in Abuja, our study abroad agents understand the Nigerian student journey firsthand, pairing local, in-person support with our global partner network."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977463/gramel/public/home/gallery-student-2_dmsu3k.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/deep-blue-cap_spvnqe.png"
        backgroundColor="bg-primary"
      />
    </div>
  );
}

interface WhyChooseUsCardProps {
  index: number;
  title: string;
  description: string;
  mainImage: string;
  capImage?: string;
  backgroundColor: string;
}

function WhyChooseUsCard({
  index,
  title,
  description,
  mainImage,
  capImage,
  backgroundColor,
}: WhyChooseUsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className={`flex h-full flex-col rounded-2xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${backgroundColor}`}
    >
      <div className="flex flex-col">
        <h4 className="text-2xl leading-tight font-semibold">
          {title}
        </h4>
        <p className="mt-3 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex grow items-end pt-8">
        {/* image container */}
        <div className="relative aspect-[324/276] w-full overflow-visible rounded-2xl">
          {capImage && (
            <div className="absolute -top-6 -left-12 z-10 w-28">
              <Image
                src={capImage}
                alt="Valedictory Cap"
                width={132}
                height={108}
              />
            </div>
          )}
          {/* Main Image */}
          <Image
            src={mainImage}
            alt="Smiling Student"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="rounded-2xl rounded-tl-[2.25rem] object-cover"
          />
        </div>
      </div>
    </motion.article>
  );
}
