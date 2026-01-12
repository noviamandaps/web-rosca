'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Slider } from '@/lib/data';

interface HeroBannerProps {
  slides: Slider[];
}

export function HeroBanner({ slides }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center text-brand-white px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest mb-4">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-sm md:text-base tracking-wider mb-8 max-w-md">
                {slide.subtitle}
              </p>
            )}
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-widest hover:gap-4 transition-all duration-300"
            >
              {slide.ctaText}
              <span className="text-lg">&rarr;</span>
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-brand-white w-8' : 'bg-brand-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
