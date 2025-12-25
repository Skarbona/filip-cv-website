import { keyAchievements } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/pixelact-ui/card";
import { PixelIcon } from "@/components/PixelIcon";
import Image from "next/image";

export default function Achievements() {
  const getCompanyColor = (company?: string) => {
    switch (company) {
      case "Mercor":
        return {
          border: "border-l-purple-500 dark:border-l-purple-400",
          badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
          badgeText: "text-purple-600 dark:text-purple-400",
        };
      case "UBS":
        return {
          border: "border-l-red-500 dark:border-l-red-400",
          badge: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
          badgeText: "text-red-600 dark:text-red-400",
        };
      case "Beeline":
        return {
          border: "border-l-green-500 dark:border-l-green-400",
          badge: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
          badgeText: "text-green-600 dark:text-green-400",
        };
      case "Toptal":
        return {
          border: "border-l-teal-500 dark:border-l-teal-400",
          badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
          badgeText: "text-teal-600 dark:text-teal-400",
        };
      case "Notch":
        return {
          border: "border-l-orange-500 dark:border-l-orange-400",
          badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
          badgeText: "text-orange-600 dark:text-orange-400",
        };
      default:
        return {
          border: "border-l-blue-500 dark:border-l-blue-400",
          badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
          badgeText: "text-blue-600 dark:text-blue-400",
        };
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <Image
          src="/images/pixel-network.png"
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
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 shadow-[var(--pixel-box-shadow)] box-shadow-margin">
                <PixelIcon name="trophy-solid" variant="solid" width={32} height={32} />
              </div>
            </div>
            <h2 className="pixel-font text-2xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-50 leading-relaxed">
              Key Achievements
            </h2>
            <p className="pixel-font text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Highlights of my professional journey and impact on projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyAchievements.map((achievement, index) => {
              const colors = getCompanyColor(achievement.company);
              return (
                <Card
                  key={achievement.id}
                  className={`hover:shadow-xl transition-all hover:-translate-y-1 border-l-4 ${colors.border}`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold shadow-[var(--pixel-box-shadow)] box-shadow-margin ${colors.badge}`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl text-slate-900 dark:text-slate-50">
                            {achievement.title}
                          </CardTitle>
                          {achievement.company && (
                            <span
                              className={`text-xs font-bold pixel-font ${colors.badgeText} ml-2`}
                            >
                              {achievement.company}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
