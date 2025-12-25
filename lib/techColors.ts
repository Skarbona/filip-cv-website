// Mapa kolorów dla technologii według ich oficjalnych brandingów
export const techColors: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
  // Frontend Frameworks & Libraries
  "React": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "React Native": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "React Router": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", darkBg: "dark:bg-red-900/30", darkText: "dark:text-red-300", darkBorder: "dark:border-red-800" },
  "Next.js": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200", darkBg: "dark:bg-slate-800/30", darkText: "dark:text-slate-300", darkBorder: "dark:border-slate-700" },
  "Vue": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", darkBg: "dark:bg-emerald-900/30", darkText: "dark:text-emerald-300", darkBorder: "dark:border-emerald-800" },
  
  // Languages
  "JavaScript": { bg: "bg-yellow-100", text: "text-yellow-900", border: "border-yellow-200", darkBg: "dark:bg-yellow-900/30", darkText: "dark:text-yellow-300", darkBorder: "dark:border-yellow-800" },
  "TypeScript": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Node.js": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", darkBg: "dark:bg-green-900/30", darkText: "dark:text-green-300", darkBorder: "dark:border-green-800" },
  
  // State Management
  "Redux": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", darkBg: "dark:bg-purple-900/30", darkText: "dark:text-purple-300", darkBorder: "dark:border-purple-800" },
  "Zustand": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200", darkBg: "dark:bg-amber-900/30", darkText: "dark:text-amber-300", darkBorder: "dark:border-amber-800" },
  
  // API & Data
  "GraphQL": { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200", darkBg: "dark:bg-pink-900/30", darkText: "dark:text-pink-300", darkBorder: "dark:border-pink-800" },
  "REST API": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", darkBg: "dark:bg-cyan-900/30", darkText: "dark:text-cyan-300", darkBorder: "dark:border-cyan-800" },
  "MongoDB": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", darkBg: "dark:bg-green-900/30", darkText: "dark:text-green-300", darkBorder: "dark:border-green-800" },
  "Firebase": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", darkBg: "dark:bg-orange-900/30", darkText: "dark:text-orange-300", darkBorder: "dark:border-orange-800" },
  
  // Testing
  "Jest": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", darkBg: "dark:bg-red-900/30", darkText: "dark:text-red-300", darkBorder: "dark:border-red-800" },
  "Testing Library": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", darkBg: "dark:bg-red-900/30", darkText: "dark:text-red-300", darkBorder: "dark:border-red-800" },
  "WDIO": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", darkBg: "dark:bg-orange-900/30", darkText: "dark:text-orange-300", darkBorder: "dark:border-orange-800" },
  
  // UI & Styling
  "Tailwind CSS": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", darkBg: "dark:bg-cyan-900/30", darkText: "dark:text-cyan-300", darkBorder: "dark:border-cyan-800" },
  "Tailwind": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", darkBg: "dark:bg-cyan-900/30", darkText: "dark:text-cyan-300", darkBorder: "dark:border-cyan-800" },
  "Material UI": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Ant Design": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", darkBg: "dark:bg-red-900/30", darkText: "dark:text-red-300", darkBorder: "dark:border-red-800" },
  "Bootstrap": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", darkBg: "dark:bg-purple-900/30", darkText: "dark:text-purple-300", darkBorder: "dark:border-purple-800" },
  "CSS": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Design System": { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200", darkBg: "dark:bg-violet-900/30", darkText: "dark:text-violet-300", darkBorder: "dark:border-violet-800" },
  
  // Tools & Platforms
  "Storybook": { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200", darkBg: "dark:bg-pink-900/30", darkText: "dark:text-pink-300", darkBorder: "dark:border-pink-800" },
  "Webpack": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Vite": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", darkBg: "dark:bg-purple-900/30", darkText: "dark:text-purple-300", darkBorder: "dark:border-purple-800" },
  "Figma": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", darkBg: "dark:bg-red-900/30", darkText: "dark:text-red-300", darkBorder: "dark:border-red-800" },
  "WordPress": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  
  // Version Control & CI/CD
  "GitHub": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200", darkBg: "dark:bg-slate-800/30", darkText: "dark:text-slate-300", darkBorder: "dark:border-slate-700" },
  "GitLab": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", darkBg: "dark:bg-orange-900/30", darkText: "dark:text-orange-300", darkBorder: "dark:border-orange-800" },
  "CI/CD": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", darkBg: "dark:bg-emerald-900/30", darkText: "dark:text-emerald-300", darkBorder: "dark:border-emerald-800" },
  
  // Project Management
  "Jira": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Confluence": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Nx": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  
  // AI & Tools
  "AI": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", darkBg: "dark:bg-indigo-900/30", darkText: "dark:text-indigo-300", darkBorder: "dark:border-indigo-800" },
  "LLM": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", darkBg: "dark:bg-indigo-900/30", darkText: "dark:text-indigo-300", darkBorder: "dark:border-indigo-800" },
  "AI Tools": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", darkBg: "dark:bg-indigo-900/30", darkText: "dark:text-indigo-300", darkBorder: "dark:border-indigo-800" },
  "ChatGPT Pro": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", darkBg: "dark:bg-emerald-900/30", darkText: "dark:text-emerald-300", darkBorder: "dark:border-emerald-800" },
  "Gemini Pro": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", darkBg: "dark:bg-blue-900/30", darkText: "dark:text-blue-300", darkBorder: "dark:border-blue-800" },
  "Copilot": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200", darkBg: "dark:bg-slate-800/30", darkText: "dark:text-slate-300", darkBorder: "dark:border-slate-700" },
  
  // Architecture & Patterns
  "Microservices": { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-200", darkBg: "dark:bg-teal-900/30", darkText: "dark:text-teal-300", darkBorder: "dark:border-teal-800" },
  "Architecture": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200", darkBg: "dark:bg-slate-800/30", darkText: "dark:text-slate-300", darkBorder: "dark:border-slate-700" },
  
  // Other
  "Leadership": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200", darkBg: "dark:bg-amber-900/30", darkText: "dark:text-amber-300", darkBorder: "dark:border-amber-800" },
  "Consulting": { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200", darkBg: "dark:bg-violet-900/30", darkText: "dark:text-violet-300", darkBorder: "dark:border-violet-800" },
  "Web Technologies": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", darkBg: "dark:bg-cyan-900/30", darkText: "dark:text-cyan-300", darkBorder: "dark:border-cyan-800" },
  "Express": { bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200", darkBg: "dark:bg-slate-800/30", darkText: "dark:text-slate-300", darkBorder: "dark:border-slate-700" },
};

// Funkcja pomocnicza do pobierania kolorów technologii
export function getTechColors(tech: string) {
  return techColors[tech] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    darkBg: "dark:bg-gray-900/30",
    darkText: "dark:text-gray-300",
    darkBorder: "dark:border-gray-800"
  };
}

