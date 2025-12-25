import { personalInfo } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/pixelact-ui/card";
import Image from "next/image";

export default function About() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <Image
          src="/images/pixel-brain.png"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1920px"
          quality={100}
          unoptimized={true}
          priority={false}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="pixel-font text-2xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-50 leading-relaxed">
            About Me
          </h2>

          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                {personalInfo.bio}
              </p>
            </CardContent>
          </Card>

          {/* Fun facts grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center p-6 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="pixel-font text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {personalInfo.experience}
                </div>
                <div className="pixel-font text-xs text-slate-600 dark:text-slate-400">
                  Professional Experience
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="pixel-font text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  6+
                </div>
                <div className="pixel-font text-xs text-slate-600 dark:text-slate-400">
                  Major Companies
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="pixel-font text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  20+
                </div>
                <div className="pixel-font text-xs text-slate-600 dark:text-slate-400">
                  Technologies Mastered
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
