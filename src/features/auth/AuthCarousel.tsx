"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  {
    image: "/slider-1.png",
    title: "Simplifiez vos déclarations CSRD",
    subtitle: "Collectez et gérez vos données",
  },
  {
    image: "/slider-2.png",
    title: "Collaborez avec votre équipe",
    subtitle: "Travaillez ensemble",
  },
  {
    image: "/slider-3.png",
    title: "Suivez vos indicateurs",
    subtitle: "Visualisez et analysez",
  },
];

const AUTOPLAY_INTERVAL = 3000;

export default function AuthCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="flex flex-col items-center h-full pb-10.25 pt-8 px-0 gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold"
          style={{ backgroundColor: "#225082", color: "#e6eef8" }}
        >
          CC
        </div>
        <span
          className="font-semibold text-base"
          style={{
            fontFamily: "var(--font-nunito), Nunito, sans-serif",
            color: "#e6eef8",
          }}
        >
          CSRD collecte
        </span>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center w-117.5 max-w-full">
        <div className="relative w-117.5 h-125">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text + Pagination */}
      <div className="flex flex-col items-center gap-2.5 w-full px-8">
        <p
          className="text-center text-white font-semibold text-[32px] leading-[40px] w-full"
          style={{
            fontFamily: "var(--font-nunito), Nunito, sans-serif",
            letterSpacing: "-1px",
          }}
        >
          {slides[currentSlide].title}
        </p>
        <p
          className="text-center text-white text-base leading-6 w-86 max-w-full min-h-[50px]"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {slides[currentSlide].subtitle}
        </p>

        {/* Pagination dots with connectors */}
        <div className="flex items-center gap-[6px] w-[180px]">
          {slides.map((_, index) => (
            <div key={index} className="contents">
              {/* Dot */}
              <button
                onClick={() => setCurrentSlide(index)}
                className="w-4 h-4 rounded-full border-2 border-solid shrink-0 transition-colors"
                style={{
                  backgroundColor:
                    index <= currentSlide ? "#2964a0" : "#3f4a5a",
                  borderColor: index <= currentSlide ? "#2964a0" : "#3f4a5a",
                }}
                aria-label={`Diapositive ${index + 1}`}
              />
              {/* Connector line */}
              {index < slides.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div
                    className="h-1 w-full rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        index < currentSlide ? "#2964a0" : "#a1a1a0",
                      opacity: index < currentSlide ? 1 : 0.3,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
