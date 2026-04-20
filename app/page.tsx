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
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { useTheme } from 'next-themes'

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-0 left-0 right-0 h-[1000px] ${theme === 'dark' ? 'bg-gradient-to-b from-purple-500/5 to-transparent' : 'bg-gradient-to-b from-amber-500/5 to-transparent'} pointer-events-none`} />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02),transparent)]'} pointer-events-none`} />
      </div>

      <div className="relative z-10">
        <SmoothCursor />
        <Navbar/>
        <BackgroundLinesDemo/>
        <LogoCarousel/>
        <About/>
        <SkillsPage/>
        <Resume/>
        <div className="py-12 border-t border-neutral-200 dark:border-white/5">
          <SparklesText className="text-center opacity-70" text="Made with ❤️ by Ramsurya" />
        </div>
        <Contact/>
        <Footer/>
      </div>
    </main>
  )
}