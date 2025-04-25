'use client'
import React from 'react';
import { useTheme } from 'next-themes'; // Import useTheme
import IdCard from '@/components/ui/IdCard';

const About = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    // Apply conditional background color based on theme
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 flex items-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          {/* Apply conditional text color for heading */}
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>About Me</h1>
          {/* Paragraphs will inherit text color from the main div */}
          <p className="text-base sm:text-lg mb-3 sm:mb-4 px-4 md:px-0">
            Hello! I&apos;m a passionate developer with a keen interest in building innovative web solutions.
            I specialize in modern web technologies and love creating seamless user experiences.
          </p>
          <p className="text-base sm:text-lg mb-3 sm:mb-4 px-4 md:px-0">
            With several years of experience in web development, I&apos;ve worked on various projects
            ranging from small business websites to large-scale applications.
          </p>
          <p className="text-base sm:text-lg px-4 md:px-0">
            When I&apos;m not coding, you can find me exploring new technologies, contributing to
            open-source projects, or sharing knowledge with the developer community.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
          <IdCard />
        </div>
      </div>
    </div>
  )
}

export default About
