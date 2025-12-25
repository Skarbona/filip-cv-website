import { consulting } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/pixelact-ui/card";
import { TechBadge } from "@/components/TechBadge";
import { PixelIcon } from "@/components/PixelIcon";
import Image from "next/image";

export default function Consulting() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <Image
          src="/images/pixel-consulting.png"
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
                <PixelIcon name="lightbulb-solid" variant="solid" width={32} height={32} />
              </div>
            </div>
            <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-relaxed">
              Consulting & Advisory
            </h2>
            <p className="pixel-font text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Providing expert guidance on technology strategy and implementation
            </p>
          </div>

          <div className="space-y-6">
            {consulting.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-xl transition-all border-l-4 border-l-purple-500 dark:border-l-purple-400"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-slate-50 mb-1">
                        {project.company}
                      </CardTitle>
                      <CardDescription className="text-lg text-purple-600 dark:text-purple-400 font-semibold">
                        {project.position}
                      </CardDescription>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {project.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {project.description.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-purple-500 dark:text-purple-400 mt-1.5 flex-shrink-0">
                          •
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <TechBadge key={idx} tech={tech} className="text-xs px-3 py-1" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
