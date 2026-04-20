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
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.03]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="container relative mx-auto px-6 sm:px-10 lg:px-16 py-24 md:py-32 z-20 max-w-7xl">
        <div className="space-y-4 mb-16">
          <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
            Gallery
          </h2>
          <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            My <br />
            <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Selected Projects</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group flex flex-col h-full rounded-3xl shadow-2xl transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'bg-neutral-900/40 border border-white/5 hover:border-purple-500/40' : 'bg-white border border-neutral-200 hover:border-amber-500/40'} backdrop-blur-xl p-8 sm:p-10`}
            >
              <h2 className={`text-3xl font-extrabold mb-4 ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'} group-hover:text-purple-500 transition-colors`}>
                {project.title}
              </h2>
              <p className={`text-base leading-relaxed mb-6 flex-grow ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span key={tech} className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'bg-gray-800 text-purple-400' : 'bg-amber-100 text-amber-900'}`}>
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm font-bold ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-all hover:translate-x-1`}
              >
                View Project <span className="ml-2">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
