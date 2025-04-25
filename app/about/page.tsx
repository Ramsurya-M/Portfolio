'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { useTheme } from 'next-themes'
import IdCard from '@/components/ui/IdCard'; // Import the IdCard component
// Import icons if needed, e.g., from react-icons
// import { FaReact, FaCode, FaLightbulb } from 'react-icons/fa'; 

const About = () => {
  const { theme } = useTheme()
  const [isCardVisible, setIsCardVisible] = useState(false); // Keep state
  
  // Keep useEffect to trigger animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCardVisible(true);
    }, 100); 
    return () => clearTimeout(timer); 
  }, []); 

  // Define skill categories and skills
  const skillCategories = [
    { 
      title: "Frontend", 
      skills: ["React", "TypeScript", "TailwindCSS", "HTML5", "CSS3"],
      // icon: FaReact 
    },
    { 
      title: "Tools & Concepts", 
      skills: ["Git", "GitHub", "VS Code", "Sublime", "npm", "Node.js","Trae", "Next.js"],
      // icon: FaLightbulb 
    },
  ];

  return (
    <div id='page1' className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Navbar />
      {/* Adjusted background grid for new gradient background */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} />
      
      {/* Main container */}
      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10 space-y-16 md:space-y-24">
        
        {/* Top Section: Hero Text + ID Card - Added flex-col-reverse */}
        <section className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 items-center"> {/* Changed flex-col to flex-col-reverse */}
          {/* Hero Text (Left on lg, Bottom on sm) */}
          <div className="lg:w-2/3 text-center lg:text-left">
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-red'} leading-tight`}>
              Ramsurya
            </h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto lg:mx-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              A Front-End Developer driven by a passion for creating elegant, efficient, and user-friendly web solutions. Let's explore my approach, skills, and journey.
            </p>
          </div>
          {/* ID Card (Right on lg, Top on sm) */}
          <div className={`lg:w-1/4 flex justify-center lg:justify-end items-center 
                         transition-all duration-1000 ease-out 
                         ${isCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'} `}
          >
             <IdCard />
          </div>
        </section>

        {/* Content Sections Below */}

        {/* Core Values / Philosophy Section */}
        <section> 
          <h2 className={`text-3xl font-bold text-center mb-10 ${theme === 'dark' ? 'text-purple-400' : 'text-amber-700'}`}>Guiding Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"> {/* Centered grid */}
            {/* Value 1 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/60 border border-purple-500/30' : 'bg-white/70 border border-amber-300/50'} backdrop-blur-sm shadow-lg text-center hover:scale-105 transition-transform duration-300`}>
              {/* Optional Icon */}
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Code Craftsmanship</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Writing clean, maintainable, and performant code is fundamental to my process.</p>
            </div>
            {/* Value 2 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/60 border border-blue-500/30' : 'bg-white/70 border border-blue-300/50'} backdrop-blur-sm shadow-lg text-center hover:scale-105 transition-transform duration-300`}>
              {/* Optional Icon */}
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>User Experience Focus</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Designing intuitive interfaces that provide a seamless and enjoyable journey.</p>
            </div>
            {/* Value 3 */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/60 border border-green-500/30' : 'bg-white/70 border border-green-300/50'} backdrop-blur-sm shadow-lg text-center hover:scale-105 transition-transform duration-300`}>
              {/* Optional Icon */}
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Lifelong Learning</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Embracing new technologies and methodologies to stay ahead and deliver cutting-edge solutions.</p>
            </div>
          </div>
        </section>

        {/* Skills Showcase Section */}
        <section> 
          <h2 className={`text-3xl font-bold text-center mb-10 ${theme === 'dark' ? 'text-purple-400' : 'text-amber-700'}`}>Tech Stack</h2>
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-black/30 border border-gray-700/50' : 'bg-white/60 border border-gray-300/50'} backdrop-blur-md shadow-xl max-w-5xl mx-auto`}> {/* Centered container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skillCategories.map((category) => (
                <div key={category.title}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {/* {category.icon && <category.icon className="text-purple-400" />} */}
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-amber-100 text-amber-800'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey/Experience Snippet */}
        <section className="text-center max-w-4xl mx-auto"> {/* Centered text block */}
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-amber-700'}`}>My Developer Journey</h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> 
            For over one years, I&apos;ve navigated the dynamic world of web development... {/* Shortened for brevity */}
          </p>
          {/* Add links to projects or contact if desired */}
        </section>
          
        {/* Social Media Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-amber-700'}`}>Connect With Me</h2>
          <div className="flex justify-center items-center gap-6 md:gap-8">
            {/* Replace '#' with your actual profile links and consider using icons */}
            <a href="https://www.linkedin.com/in/ramsurya2614/" target="_blank" rel="noopener noreferrer" className={`text-lg ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
              LinkedIn {/* Replace with <FaLinkedin /> icon if desired */}
            </a>
            <a href="https://github.com/Ramsurya-M" target="_blank" rel="noopener noreferrer" className={`text-lg ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              GitHub {/* Replace with <FaGithub /> icon if desired */}
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className={`text-lg ${theme === 'dark' ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-800'} transition-colors`}>
              Instagram {/* Replace with <FaTwitter /> icon if desired */}
            </a>
            {/* Add more social links as needed */}
          </div>
        </section>

      </main>
    </div>
  )
}

export default About
