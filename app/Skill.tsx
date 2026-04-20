'use client';

import React from 'react';
import { useTheme } from 'next-themes';

const skillCategories = [
  {
    title: "Core Stack",
    skills: ["React.js", "Next.js", "TypeScript", "JavaScript"],
    color: "text-blue-500"
  },
  {
    title: "Styling",
    skills: ["TailwindCSS", "CSS3", "HTML5", "Framer Motion"],
    color: "text-purple-500"
  },
  {
    title: "Architecture",
    skills: ["Git", "GitHub", "npm", "Clean Code"],
    color: "text-orange-500"
  }
];

const SkillsPage = () => {
  const { theme } = useTheme();

  return (
    <div className={`py-24 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'} border-t border-neutral-200 dark:border-white/5`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className={`text-4xl md:text-6xl font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'} tracking-tighter`}>
            Crafted with Precision
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            I leverage modern technologies to build high-performance, scalable, and visually stunning web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div 
              key={category.title}
              className={`p-10 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-neutral-900/40 border-white/5 hover:border-purple-500/30' : 'bg-white border-neutral-200 hover:border-amber-500/30'} backdrop-blur-xl`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`}>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span 
                    key={skill}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide ${theme === 'dark' ? 'bg-neutral-800 text-purple-400' : 'bg-amber-50 text-amber-900'}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
