'use client';

import React from 'react';
import Link from 'next/link';

const Resume = () => {
  return (
    <section id="resume" className="py-16 lg:py-32 bg-[#fffcf8] dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="p-12 md:p-24 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-white border-neutral-200 dark:bg-neutral-900/60 dark:border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden relative">

          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tighter">
              My Career <br /> In One Page.
            </h2>
            <p className="text-xl max-w-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Explore my professional journey, detailed skills, and educational background in a concise document.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <a
              href="/RESUME.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-2xl font-bold text-center transition-all duration-300 hover:scale-105 bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Download PDF
            </a>
            <Link
              href="/resume"
              className="px-10 py-5 rounded-2xl font-bold text-center border transition-all duration-300 hover:scale-105 border-neutral-200 text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
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
