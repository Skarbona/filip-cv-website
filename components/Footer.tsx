import { personalInfo } from "@/lib/data";
import { PixelIcon } from "@/components/PixelIcon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="pixel-font text-lg font-bold text-white mb-4 leading-relaxed">
                {personalInfo.name}
              </h3>
              <p className="pixel-font text-slate-400 text-xs leading-relaxed">
                {personalInfo.title} with {personalInfo.experience} of experience in building
                exceptional web applications.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="pixel-font text-base font-semibold text-white mb-4 leading-relaxed">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs pixel-font">
                <li>
                  <a href="#about" className="hover:text-blue-400 transition-colors cursor-pointer">
                    About Me
                  </a>
                </li>
                <li>
                  <a href="#achievements" className="hover:text-blue-400 transition-colors cursor-pointer">
                    Achievements
                  </a>
                </li>
                <li>
                  <a href="#experience" className="hover:text-blue-400 transition-colors cursor-pointer">
                    Experience
                  </a>
                </li>
                <li>
                  <a href="#skills" className="hover:text-blue-400 transition-colors cursor-pointer">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-400 transition-colors cursor-pointer">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="pixel-font text-base font-semibold text-white mb-4 leading-relaxed">
                Follow Me
              </h4>
              <div className="flex gap-4">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-200 hover:bg-slate-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin cursor-pointer"
                >
                  <PixelIcon name="github" variant="brands" width={20} height={20} />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-400 hover:bg-blue-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin cursor-pointer"
                >
                  <PixelIcon name="linkedin" variant="brands" width={20} height={20} />
                </a>
                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-400 hover:bg-pink-600 transition-colors shadow-[var(--pixel-box-shadow)] box-shadow-margin cursor-pointer"
                >
                  <PixelIcon name="instagram" variant="brands" width={20} height={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-8">
            {/* GDPR Compliance */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400 leading-relaxed pixel-font">
                <strong className="text-slate-300 pixel-font">GDPR Compliance:</strong> I agree to
                the processing of personal data provided in this document for realising the
                recruitment process pursuant to the Personal Data Protection Act of 10 May 2018
                (Journal of Laws 2018, item 1000) and in agreement with Regulation (EU) 2016/679 of
                the European Parliament and of the Council of 27 April 2016 on the protection of
                natural persons with regard to the processing of personal data and on the free
                movement of such data, and repealing Directive 95/46/EC (General Data Protection
                Regulation).
              </p>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 pixel-font">
              <p>
                © {currentYear} {personalInfo.name}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
