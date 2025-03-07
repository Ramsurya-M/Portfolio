import { BackgroundLinesDemo } from '@/components/ui/BackgroundLinesDemo'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { SparklesText } from '@/components/magicui/sparkles-text'
import "./page.css"
import Contact from './Contact'
import Certificate from './Certificate'
import About from './About'
import LogoCarousel from './Carousal'
import SkillsPage from './Skill'
import Resume from './Resume'

export default function Home() {
  return (
    <main>
      <Navbar/>
      <BackgroundLinesDemo/>
      <LogoCarousel/>
      <About/>
      <SkillsPage/>
      <Resume/>
      <Certificate/>
      <SparklesText className='text-center spark' text=" Made with ❤️ by Ramsurya" />
      <Contact/>
      <Footer/>
    </main>
  )
}