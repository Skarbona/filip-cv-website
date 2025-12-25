import { skills, education } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/pixelact-ui/card";
import { PixelIcon } from "@/components/PixelIcon";
import Image from "next/image";
import { TechBadge } from "@/components/TechBadge";

// Color mapping for soft skills
const softSkillColors: Record<string, string> = {
  "Problem-solving":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "Attention to detail":
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  Responsibility:
    "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  Teamwork:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Flexibility:
    "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  Perseverance:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Leadership:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  Mentoring:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  Communication:
    "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  Collaboration:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  Adaptability:
    "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-800",
  Innovation:
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "Critical thinking":
    "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800",
  "Time management":
    "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-800",
  "Project management":
    "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
};

export default function Skills() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <Image
          src="/images/pixel-server.png"
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
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                <PixelIcon name="code-solid" variant="solid" width={32} height={32} />
              </div>
            </div>
            <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-relaxed">
              Skills & Expertise
            </h2>
            <p className="pixel-font text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A comprehensive toolkit for building modern web applications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Technical Skills */}
            <Card className="hover-pixel-float">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    name="code-solid"
                    variant="solid"
                    width={24}
                    height={24}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <CardTitle className="text-2xl">Technical Skills</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, idx) => (
                    <TechBadge key={idx} tech={skill} className="text-sm px-3 py-1.5" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card className="hover-pixel-float">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    name="heart-solid"
                    variant="solid"
                    width={24}
                    height={24}
                    className="text-pink-600 dark:text-pink-400"
                  />
                  <CardTitle className="text-2xl">Soft Skills</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, idx) => {
                    const colorClass =
                      softSkillColors[skill] ||
                      "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800";
                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center rounded-none shadow-[var(--pixel-box-shadow)] box-shadow-margin border-2 font-medium text-sm px-3 py-1.5 ${colorClass}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="hover-pixel-float">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    name="translate-solid"
                    variant="solid"
                    width={24}
                    height={24}
                    className="text-green-600 dark:text-green-400"
                  />
                  <CardTitle className="text-2xl">Languages</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {skills.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {lang.language}
                      </span>
                      <span className="inline-flex items-center rounded-none shadow-[var(--pixel-box-shadow)] box-shadow-margin border-2 font-medium text-sm px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="hover-pixel-float">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    name="star-solid"
                    variant="solid"
                    width={24}
                    height={24}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                  <CardTitle className="text-2xl">What I Love</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {skills.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-none shadow-[var(--pixel-box-shadow)] box-shadow-margin border-2 font-medium text-sm px-3 py-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Education */}
          <div className="pt-8">
            <Card className="hover-pixel-float">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <PixelIcon
                    name="book-heart-solid"
                    variant="solid"
                    width={24}
                    height={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  <CardTitle className="text-2xl">Education</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
                      {education.degree} in {education.field}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{education.school}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {education.period}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-500">
                      {education.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
