import { BackgroundLinesDemo } from '@/components/ui/BackgroundLinesDemo'
import React from 'react'
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

export default function Home() {
  return (
    <main>
      <SmoothCursor />
      <Navbar/>
      <BackgroundLinesDemo/>
      <LogoCarousel/>
      <About/>
      <SkillsPage/>
      <Resume/>
      <SparklesText className='text-center spark' text=" Made with ❤️ by Ramsurya" />
      <Contact/>
      <Footer/>
    </main>
  )
}