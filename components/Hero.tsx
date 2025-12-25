"use client";

import { personalInfo } from "@/lib/data";
import { Button } from "@/components/ui/pixelact-ui/button";
import Image from "next/image";
import { PixelIcon } from "@/components/PixelIcon";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/images/hero-background.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={100}
          unoptimized={true}
          priority={true}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Avatar/Photo */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 overflow-hidden shadow-[var(--pixel-box-shadow)] box-shadow-margin bg-white">
              <Image
                src="/profile.jpg"
                alt="Filip Sokołowski"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="pixel-font text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight leading-relaxed">
            {personalInfo.name}
          </h1>

          <h2 className="pixel-font text-lg md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-6 leading-relaxed">
            {personalInfo.title}
          </h2>

          {/* Location and experience */}
          <div className="flex items-center justify-center gap-6 text-slate-600 dark:text-slate-400 mb-8 flex-wrap pixel-font text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <PixelIcon name="location-pin-solid" width={16} height={16} />
              <span>{personalInfo.location}</span>
            </div>
            <div className="text-xl text-slate-300 dark:text-slate-700">•</div>
            <span className="font-semibold">{personalInfo.experience} of experience</span>
          </div>

          {/* Bio */}
          <p className="pixel-font text-xs md:text-sm text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            {personalInfo.bio}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-base"
              onClick={() => (window.location.href = `mailto:${personalInfo.email}`)}
            >
              <PixelIcon name="envelope-solid" width={20} height={20} />
              Get in Touch
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-base"
              onClick={() => (window.location.href = `tel:${personalInfo.phone}`)}
            >
              <PixelIcon name="phone-ringing-low" variant="regular" width={20} height={20} />
              Call Me
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-200 hover:bg-slate-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin"
            >
              <PixelIcon name="github" variant="brands" width={24} height={24} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-400 hover:bg-blue-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin"
            >
              <PixelIcon name="linkedin" variant="brands" width={24} height={24} />
            </a>
            <a
              href={personalInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-pink-400 hover:bg-pink-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin"
            >
              <PixelIcon name="instagram" variant="brands" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator - pixel art style */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-1 pixel-font text-xs text-slate-600 dark:text-slate-400">
          <span>▼</span>
          <span className="text-[8px]">SCROLL</span>
        </div>
      </div>
    </section>
  );
}
