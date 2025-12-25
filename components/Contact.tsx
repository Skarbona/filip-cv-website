"use client";

import { personalInfo } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/pixelact-ui/card";
import { Button } from "@/components/ui/pixelact-ui/button";
import { PixelIcon } from "@/components/PixelIcon";
import Image from "next/image";

export default function Contact() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image
          src="/images/pixel-coding.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={100}
          unoptimized={true}
          priority={false}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-relaxed">
              Get In Touch
            </h2>
            <p className="pixel-font text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              I&apos;m always open to discussing new opportunities, collaborations, or just having a
              chat about technology
            </p>
          </div>

          <Card className="mb-12">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                    <PixelIcon name="envelope-solid" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="pixel-font text-l font-semibold text-slate-900 dark:text-slate-50 mb-1 leading-relaxed">
                      Email
                    </h3>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-l"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 flex-shrink-0 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                    <PixelIcon name="phone-ringing-low" variant="regular" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="pixel-font text-l font-semibold text-slate-900 dark:text-slate-50 mb-1 leading-relaxed">
                      Phone
                    </h3>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-green-600 dark:text-green-400 hover:underline text-l"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 flex-shrink-0 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                    <PixelIcon name="location-pin-solid" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="pixel-font text-l font-semibold text-slate-900 dark:text-slate-50 mb-1 leading-relaxed">
                      Location
                    </h3>
                    <p className="pixel-font text-slate-600 dark:text-slate-400 text-l">
                      {personalInfo.location} • B2B Remote Contract
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="pixel-font mt-16 text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-50">
              Connect With Me
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="text-base"
                onClick={() => window.open(personalInfo.github, "_blank")}
              >
                <PixelIcon name="github" variant="brands" width={20} height={20} />
                GitHub
                <PixelIcon name="external-link-solid" width={16} height={16} />
              </Button>

              <Button
                size="lg"
                className="text-base"
                onClick={() => window.open(personalInfo.linkedin, "_blank")}
              >
                <PixelIcon name="linkedin" variant="brands" width={20} height={20} />
                LinkedIn
                <PixelIcon name="external-link-solid" width={16} height={16} />
              </Button>

              <Button
                size="lg"
                className="text-base"
                onClick={() => window.open(personalInfo.instagram, "_blank")}
              >
                <PixelIcon name="instagram" variant="brands" width={20} height={20} />
                Instagram
                <PixelIcon name="external-link-solid" width={16} height={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
