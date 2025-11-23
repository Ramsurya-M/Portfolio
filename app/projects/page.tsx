'use client' // Add this directive for using hooks

import React from 'react';
import Navbar from '../Navbar'; // Import Navbar
import Footer from '../Footer';
import { useTheme } from 'next-themes'; // Import useTheme
// import Image from 'next/image'; // Removed unused Image import

// Sample project data (replace with your actual projects)
const projects = [
  {
    id: 1,
    title: "GoDaddy",
    description: "A GoDaddy website replication project showcasing responsive design and modern web development practices.contact forms built with HTML and CSS.",
    // imageUrl: "/Godaddy.png", // Removed unused property
    projectUrl: "https://github.com/Ramsurya-M/GoDaddy", // Replace with actual project link
    techStack: ["Html"]
  },
  {
    id: 2,
    title: "OX Game",
    description: "A simple OX game built with HTML, CSS, and JavaScript. It's a classic two-player game where players take turns marking Xs and Os on a grid. The game ends when one player forms a line of three of their marks horizontally, vertically, or diagonally.",
    // imageUrl: "/images/project-placeholder.png", // Removed unused property
    projectUrl: "#", // Replace with actual project link
    techStack: ["HTML5", "CSS3", "JavaScript"]
  },
  {
    id: 3,
    title: "Bootstrap",
    description: "A Bootstrap website replication project showcasing responsive design and modern web development practices. It includes a contact form built with HTML and CSS.",
    // imageUrl: "/images/project-placeholder.png", // Removed unused property
    projectUrl: "#", // Replace with actual project link
    techStack: ["HTML5", "CSS3", "Bootstrap"]
  },
  // Add more projects as needed
];

export default function ProjectsPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-[#fff9f0] to-[#fef3e0]'}`}>
      <Navbar />
      {/* Optional: Add background grid similar to About page */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} style={{ zIndex: -1 }} />

      {/* Main container */}
      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${theme === 'dark' ? 'text-orange-400' : 'text-amber-800'}`}>
          My Projects
        </h1>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {projects.map((project) => (
            <div 
              key={project.id} 
              // Removed overflow-hidden as image is gone, adjusted padding/styling if needed
              className={`rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gray-800/70 border border-purple-500/30' : 'bg-white/80 border border-amber-300/50'} backdrop-blur-sm p-6`} // Added padding directly here
            >
              {/* Project Image Section - REMOVED */}
              {/* 
              <div className="relative w-full h-48 md:h-56"> 
                <Image 
                  src={project.imageUrl} 
                  alt={`${project.title} screenshot`} 
                  layout="fill" 
                  objectFit="cover" 
                  className="transition-opacity duration-300" 
                />
              </div> 
              */}
              
              {/* Project Content - Now the main content of the card */}
              {/* <div className="p-6"> */} {/* Removed inner padding div */}
                <h2 className={`text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                  {project.title}
                </h2>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-amber-100 text-amber-800'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Project Link */}
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`inline-block text-sm font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                >
                  View Project &rarr;
                </a>
              {/* </div> */} {/* Removed inner padding div */}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
