"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    description:
      "I had no idea where to start with my school applications until I found Gramel Education. They helped me choose the right program, secure a scholarship, and guided me through the entire visa process. Now I'm studying in Toronto and loving every moment!",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/janet-doris_e5gatj.jpg",
    alt: "young african american woman toothy smiling",
    name: "Janet Doris",
    role: "International Student",
  },
  {
    description:
      "Gramel Education is the reason I'm now studying Data Science in London. They took the time to understand my career goals and matched me with the perfect school. The best part? I didn't pay a dime for consultation! The team was always available for guidance at every step.",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977288/gramel/public/home/ifeanyi-a_qupsu1.jpg",
    alt: "portrait of a student front",
    name: "Ifeanyi A.",
    role: "International Student",
  },
  {
    description:
      "Thanks to Gramel Education, I secured a low-interest student loan that made my studies in New York possible. They also reviewed all my documents and prepped me for the embassy interview. I now mentor others trying to study abroad and I always point them to Gramel.",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977282/gramel/public/home/amina-busari_jh5sxl.jpg",
    alt: "medium shot beautiful woman with braids",
    name: "Amina Busari",
    role: "International Student",
  },
  {
    description:
      "I had no idea where to start with my school applications until I found Gramel Education. They helped me choose the right program, secure a scholarship, and guided me through the entire visa process. Now I'm studying in Toronto and loving every moment!",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977281/gramel/public/home/janet-doris_e5gatj.jpg",
    alt: "young african american woman toothy smiling",
    name: "Janet Doris",
    role: "International Student",
  },
  {
    description:
      "Gramel Education is the reason I'm now studying Data Science in London. They took the time to understand my career goals and matched me with the perfect school. The best part? I didn't pay a dime for consultation! The team was always available for guidance at every step.",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977288/gramel/public/home/ifeanyi-a_qupsu1.jpg",
    alt: "portrait of a student front",
    name: "Ifeanyi A.",
    role: "International Student",
  },
  {
    description:
      "Thanks to Gramel Education, I secured a low-interest student loan that made my studies in New York possible. They also reviewed all my documents and prepped me for the embassy interview. I now mentor others trying to study abroad and I always point them to Gramel.",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977282/gramel/public/home/amina-busari_jh5sxl.jpg",
    alt: "medium shot beautiful woman with braids",
    name: "Amina Busari",
    role: "International Student",
  },
];

export default function TestimonialsCards() {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={4}
      loop
      grabCursor
      breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      initialSlide={2}
      centeredSlides
      speed={1000}
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      pagination={{ clickable: true }}
    >
      {testimonials.map((t, i) => (
        <SwiperSlide key={i} className="px-2">
          <div className="my-10 rounded-lg bg-white p-6 text-gray-600 shadow-lg">
            <p>&apos;{t.description}&apos;</p>
            <div className="mt-4 flex items-center">
              <Image
                src={t.image}
                alt={t.alt}
                className="size-12 rounded-full object-cover"
                width={48}
                height={48}
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
