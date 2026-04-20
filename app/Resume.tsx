'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const Resume = () => {
  const { theme } = useTheme();

  return (
    <section className={`py-32 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'} border-t border-neutral-200 dark:border-white/5`}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`p-12 md:p-24 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-12 ${theme === 'dark' ? 'bg-neutral-900/60 border-white/5' : 'bg-white border-neutral-200'} backdrop-blur-3xl shadow-2xl overflow-hidden relative`}>
          
          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center md:text-left">
            <h2 className={`text-5xl md:text-7xl font-black ${theme === 'dark' ? 'text-white' : 'text-neutral-900'} tracking-tighter`}>
              My Career <br /> In One Page.
            </h2>
            <p className={`text-xl max-w-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Explore my professional journey, detailed skills, and educational background in a concise document.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <a 
              href="/RESUME.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`px-10 py-5 rounded-2xl font-bold text-center transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-black'}`}
            >
              Download PDF
            </a>
            <Link 
              href="/resume" 
              className={`px-10 py-5 rounded-2xl font-bold text-center border transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-neutral-200 text-neutral-900 hover:bg-neutral-50'}`}
            >
              Interactive Version
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
