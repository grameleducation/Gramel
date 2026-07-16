"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";

const images = [
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977421/gramel/public/home/gallery-student-1_boitp6.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977463/gramel/public/home/gallery-student-2_dmsu3k.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977497/gramel/public/home/gallery-student-3_s0lbro.jpg", // Default Active
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977496/gramel/public/home/gallery-student-4_c27lh6.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977421/gramel/public/home/gallery-student-5_une3dx.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977421/gramel/public/home/gallery-student-1_boitp6.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977463/gramel/public/home/gallery-student-2_dmsu3k.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977497/gramel/public/home/gallery-student-3_s0lbro.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977496/gramel/public/home/gallery-student-4_c27lh6.jpg",
  "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754977421/gramel/public/home/gallery-student-5_une3dx.jpg",
];

function getSlideClipPath(index: number, activeIndex: number) {
  const realIndex = (i: number) => (i + images.length) % images.length; // handle looping

  switch (index) {
    case realIndex(activeIndex - 2):
      return "polygon(0% 0%, 100% 4%, 100% 96%, 0% 100%)"; // clip-1
    case realIndex(activeIndex - 1):
      return "polygon(0% 4%, 100% 8%, 100% 92%, 0% 96%)"; // clip-2
    case realIndex(activeIndex + 1):
      return "polygon(0% 8%, 100% 4%, 100% 96%, 0% 92%)"; // clip-3
    case realIndex(activeIndex + 2):
      return "polygon(0% 4%, 100% 0%, 100% 100%, 0% 96%)"; // clip-4
    default:
      return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; // default rectangle
  }
}

export default function PolygonGallery() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <div className="relative">
      <Swiper
        initialSlide={2}
        spaceBetween={8}
        slidesPerView={1.25}
        centeredSlides={true}
        loop
        grabCursor
        speed={1000}
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 3.3 },
          1024: { slidesPerView: 4.3, spaceBetween: 16 },
        }}
        className="h-[25.3125rem]"
      >
        {images.map((src, index) => {
          return (
            <SwiperSlide
              key={index}
              className={`overflow-hidden rounded-2xl duration-1000 select-none`}
              style={{
                clipPath: getSlideClipPath(index, activeIndex),
                transitionProperty: "transform, clip-path",
              }}
            >
              <Image
                src={src}
                alt={`Student ${index + 1}`}
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 40vw, 25vw"
                width={305}
                height={405}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* white fading effects on both sides */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-white/70 via-transparent via-10% to-transparent"></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-white/70 via-transparent via-10% to-transparent"></div>
    </div>
  );
}
