'use client'

import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
});

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />

      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-20 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

            {/* Left Content (50%) */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
                  Creative Developer
                </h2>
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  Designing <br />
                  <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Digital</span> <br />
                  Experiences.
                </h1>
              </div>

              <p className={`text-lg md:text-xl max-w-md leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                I bridge the gap between complex code and intuitive design, building fast,
                accessible, and beautiful web applications.
              </p>

              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>03+</span>
                  <span className="text-xs uppercase tracking-widest text-neutral-500">Years Exp</span>
                </div>
                <div className="w-px h-12 bg-neutral-800" />
                <div className="flex flex-col">
                  <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>15+</span>
                  <span className="text-xs uppercase tracking-widest text-neutral-500">Projects</span>
                </div>
              </div>
            </div>

            {/* Right Content - Lanyard (50%) */}
            <div className="w-full lg:w-1/2 h-[500px] md:h-[600px] relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl opacity-50" />

              {/* Lanyard Container with 20% size increase and subtle outline */}
              <div className="relative w-full h-full scale-[1.2] transform-gpu transition-transform duration-700 hover:scale-[1.25]">
                <div className="w-full h-full p-4 rounded-3xl border border-white/5 backdrop-blur-[2px]">
                  {/* Transparent 3D Lanyard component */}
                  <Lanyard />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* My Story / Philosophy Section */}
        <section className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 max-w-7xl">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 p-8 md:p-16 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-200'} backdrop-blur-xl`}>
            <div className="md:col-span-2 space-y-6">
              <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`}>My Philosophy</h3>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                I believe that every line of code should serve a purpose and every pixel should contribute to the story.
                In a world of noise, I strive for minimalist, high-performance solutions that put the user first.
                Whether it's a 3D interface or a clean static site, I focus on the intersection of aesthetics and utility.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`}>Core Stack</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind', 'Node.js'].map((tech) => (
                  <span key={tech} className={`px-4 py-2 rounded-xl text-sm font-medium ${theme === 'dark' ? 'bg-neutral-800 text-purple-400' : 'bg-amber-50 text-amber-900'}`}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}