import { experience } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/pixelact-ui/card";
import { PixelIcon } from "@/components/PixelIcon";
import { TechBadge } from "@/components/TechBadge";

export default function Experience() {
  const getCompanyColor = (company: string) => {
    switch (company) {
      case "Notch":
        return {
          border: "border-l-orange-500 dark:border-l-orange-400",
          text: "text-orange-600 dark:text-orange-400",
          bullet: "text-orange-500 dark:text-orange-400",
        };
      case "Toptal":
        return {
          border: "border-l-teal-500 dark:border-l-teal-400",
          text: "text-teal-600 dark:text-teal-400",
          bullet: "text-teal-500 dark:text-teal-400",
        };
      case "Beeline":
        return {
          border: "border-l-green-500 dark:border-l-green-400",
          text: "text-green-600 dark:text-green-400",
          bullet: "text-green-500 dark:text-green-400",
        };
      case "UBS":
        return {
          border: "border-l-red-500 dark:border-l-red-400",
          text: "text-red-600 dark:text-red-400",
          bullet: "text-red-500 dark:text-red-400",
        };
      case "Sofomo":
        return {
          border: "border-l-indigo-500 dark:border-l-indigo-400",
          text: "text-indigo-600 dark:text-indigo-400",
          bullet: "text-indigo-500 dark:text-indigo-400",
        };
      case "Chili IT Expert Filip Sokolowski":
        return {
          border: "border-l-pink-500 dark:border-l-pink-400",
          text: "text-pink-600 dark:text-pink-400",
          bullet: "text-pink-500 dark:text-pink-400",
        };
      default:
        return {
          border: "border-l-blue-500 dark:border-l-blue-400",
          text: "text-blue-600 dark:text-blue-400",
          bullet: "text-blue-500 dark:text-blue-400",
        };
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                <PixelIcon name="user-solid" variant="solid" width={32} height={32} />
              </div>
            </div>
            <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-relaxed">
              Professional Experience
            </h2>
            <p className="pixel-font text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A journey through innovation, leadership, and technical excellence
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {experience.map((job) => {
              const colors = getCompanyColor(job.company);
              return (
                <Card
                  key={job.id}
                  className={`hover:shadow-xl transition-all border-l-4 ${colors.border}`}
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                      <div>
                        <CardTitle className="text-2xl text-slate-900 dark:text-slate-50 mb-1">
                          {job.company}
                        </CardTitle>
                        <CardDescription className={`text-lg font-semibold ${colors.text}`}>
                          {job.position}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {job.period}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-500">
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {job.description.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                        >
                          <span className={`${colors.bullet} mt-1.5 flex-shrink-0`}>•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech, idx) => (
                        <TechBadge key={idx} tech={tech} className="text-xs px-3 py-1" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
