'use client'

import React from 'react'
import Navbar from '../Navbar'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import IdCard from '@/components/ui/IdCard'

const About = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f0a05]' : 'bg-[#fff9f0]'}`}>
      <Navbar />
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-orange-900/[0.03]' : 'bg-grid-orange-900/[0.02]'}`} />
      
      <main className="container relative mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Content on left */}
          <div className="lg:w-2/3">
            <h1 className={`text-7xl font-bold mb-8 ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600'} [text-shadow:_0_0_20px_rgb(245_158_11_/_0.3)] animate-fade-in-up animate-delay-100`}>
              About Me
            </h1>
            <div className={`h-1 w-40 ${theme === 'dark' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-orange-400 to-amber-500'} rounded-full mb-12 animate-scale-in`}></div>
            
            <div className={`${theme === 'dark' ? 'bg-black/40' : 'bg-white/90'} rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] p-12 backdrop-blur-xl border ${theme === 'dark' ? 'border-amber-500/30' : 'border-amber-400/30'} animate-fade-in-up animate-delay-200`}>
              <div className="space-y-12">
                <section className={`p-8 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'hover:bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70' : 'hover:bg-gradient-to-br from-white via-amber-50/90 to-white'} hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] animate-fade-in-up animate-delay-300`}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-400/20'} flex items-center justify-center mr-4`}>
                      <span className="text-2xl">👨‍💻</span>
                    </div>
                    <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                      Who I Am
                    </h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    I am a passionate software developer with an insatiable curiosity for modern web technologies.
                    My journey in tech is a continuous adventure, driven by the thrill of solving complex problems
                    and creating solutions that make a difference in people's lives.
                  </p>
                </section>
                
                {/* Similar structure for "What I Do" and "My Goals" sections */}
                <section className={`p-8 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'hover:bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70' : 'hover:bg-gradient-to-br from-white via-blue-50/90 to-white'} hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]`}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-400/20'} flex items-center justify-center mr-4`}>
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      What I Do
                    </h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    I craft elegant and responsive web applications using cutting-edge technologies
                    like React, Next.js, and TypeScript. My passion lies in architecting clean, efficient,
                    and scalable solutions that deliver exceptional user experiences.
                  </p>
                </section>

                <section className={`p-8 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'hover:bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70' : 'hover:bg-gradient-to-br from-white via-blue-50/90 to-white'} hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]`}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-400/20'} flex items-center justify-center mr-4`}>
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      My Goals
                    </h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    In this ever-evolving tech landscape, I thrive on continuous learning and growth.
                    I'm committed to mastering new technologies and best practices, always pushing the
                    boundaries of what's possible.
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Profile on right */}
          <div className="lg:w-1/3 lg:sticky lg:top-28">
            <div className="relative w-full aspect-square max-w-xs mx-auto group">
                <IdCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About
