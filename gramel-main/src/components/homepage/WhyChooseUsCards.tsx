import Image from "next/image";

export default function WhyChooseUsCards() {
  return (
    <div className="mx-auto mt-10 grid max-w-md gap-4 md:mt-16 md:max-w-none md:grid-cols-2 xl:grid-cols-4 lg:gap-5">
      <WhyChooseUsCard
        title="Complete Financial Support"
        description="We provide comprehensive help with student loans, income share agreements (ISAs), and scholarships—so no matter your financial background, we'll help you find a way."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/why-choose-us-image-1_b6pgdf.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/light-blue-cap_lz5mtu.png"
        backgroundColor="bg-primary"
      />

      <WhyChooseUsCard
        title="Access International Programs"
        description="Our partnership with ApplyBoard gives you access to 1,500+ accredited institutions across Canada, the UK, the US, Australia, and more, right from one easy-to-use platform."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/why-choose-us-image-2_gwrsth.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/light-blue-cap_lz5mtu.png"
        backgroundColor="bg-[#1e1e1e]"
      />

      <WhyChooseUsCard
        title="School Application Support"
        description="Our support doesn't stop at the application. We help with offer letter follow-ups, visa guidance, accommodation support, and pre-departure readiness."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/why-choose-us-image-3_czpn0o.jpg"
        capImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977682/gramel/public/home/deep-blue-cap_spvnqe.png"
        backgroundColor="bg-primary-300"
      />

      <WhyChooseUsCard
        title="Trusted Study Abroad Agents in Nigeria"
        description="Based right here in Abuja, our study abroad agents understand the Nigerian student journey firsthand, pairing local, in-person support with our global partner network."
        mainImage="https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977463/gramel/public/home/gallery-student-2_dmsu3k.jpg"
        backgroundColor="bg-primary"
      />
    </div>
  );
}

interface WhyChooseUsCardProps {
  title: string;
  description: string;
  mainImage: string;
  capImage?: string;
  backgroundColor: string;
}

function WhyChooseUsCard({
  title,
  description,
  mainImage,
  capImage,
  backgroundColor,
}: WhyChooseUsCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl pt-3 text-white transition-transform duration-300 hover:-translate-y-1.5 ${backgroundColor}`}
    >
      <h4 className="pr-5 pl-10 text-2xl leading-normal font-semibold">
        {title}
      </h4>
      <p className="mt-3 px-10 leading-normal">{description}</p>

      <div className={`m-10 mt-6 grow ${capImage ? "pt-10" : ""}`}>
        {/* image container */}
        <div className="relative aspect-[324/276] w-full overflow-visible rounded-2xl">
          {capImage && (
            <div className="absolute -top-4.5 -left-9.5 z-10 w-28">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="rounded-2xl rounded-tl-[2.25rem] object-cover"
          />
        </div>
      </div>
    </article>
  );
}
