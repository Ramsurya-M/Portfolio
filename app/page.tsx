'use client';

import { BackgroundLinesDemo } from '@/components/ui/BackgroundLinesDemo'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { SparklesText } from '@/components/magicui/sparkles-text'
import "./page.css"
import Contact from './Contact'
import About from './About'
import LogoCarousel from './Carousal'
import SkillsPage from './Skill'
import Resume from './Resume'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 bg-[#fffcf8] dark:bg-[#050505]">

      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[1000px] bg-gradient-to-b from-amber-500/5 to-transparent dark:from-purple-500/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)] pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />
        {/* Added padding to prevent content from being hidden under the fixed Navbar */}
        <div className="pt-16">
          <BackgroundLinesDemo />
          <LogoCarousel />
          <About />
          <SkillsPage />
          <Resume />
          <div className="py-12 border-t border-neutral-200 dark:border-white/5">
            <SparklesText className="text-center opacity-70" text="Made with ❤️ by Ramsurya" />
          </div>
        </div>
        <Contact />
        <Footer />
      </div>
    </main>
  )
}