'use client';

import React from 'react';

const Contact = () => {
  return (
    <div id="contact" className="py-16 lg:py-32 bg-[#fffcf8] dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center space-y-8">

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-amber-600 dark:text-purple-500">
              Available for Work
            </h2>
            <h3 className="text-6xl md:text-8xl font-black text-neutral-900 dark:text-white tracking-tighter">
              Let&apos;s Build <br /> Something Great.
            </h3>
          </div>

          <div className="flex flex-col items-center gap-6">
            <a
              href="mailto:ramsurya2614@gmail.com"
              className="text-2xl md:text-4xl font-medium decoration-purple-500 underline-offset-8 hover:underline transition-all text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            >
              ramsurya2614@gmail.com
            </a>
            <a
              href="mailto:ramsurya2614@zohomail.in"
              className="text-2xl md:text-4xl font-medium decoration-purple-500 underline-offset-8 hover:underline transition-all text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            >
              ramsurya2614@zohomail.in
            </a>

            <div className="flex gap-4">
              <a
                href="https://github.com/Ramsurya-M"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-bold border transition-all border-neutral-200 text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ramsurya2614/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-bold border transition-all border-neutral-200 text-neutral-900 hover:bg-neutral-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;