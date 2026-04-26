'use client';

import React from 'react';
import IdCard from '@/components/ui/IdCard';

const About = () => {
  return (
    <div id="about" className="py-24 relative overflow-hidden bg-[#fffcf8] dark:bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row items-center gap-16">

        {/* Left Side: Visual */}
        <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <IdCard />
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 space-y-8 order-1 lg:order-2">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600 dark:text-purple-500">
              The Person Behind
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white tracking-tighter">
              Design Focused, <br />
              Code Driven.
            </h3>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 text-center lg:text-left">
            <p>
              I&apos;m Ramsurya, a developer who believes that software should be as beautiful as it is functional.
              My journey in tech is driven by a curiosity for complex systems and a passion for minimalist design.
            </p>
            <p>
              Whether it&apos;s architecting a React application or refining a 3D interface, I focus on performance,
              accessibility, and user delight.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <a
              href="/about"
              className="group flex items-center gap-3 font-bold px-8 py-4 rounded-xl transition-all bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Full Story
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
