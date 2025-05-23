'use client' // Keep this as we use hooks

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Navbar from '../Navbar';
import { SparklesText } from '@/components/magicui/sparkles-text';
import ContactForm from '../Contact'; // Assuming Contact.tsx holds the form logic now
import DoodleSvg from '@/public/Doodle.svg'; // Import the SVG

// Rename component to standard convention
export default function ContactPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-[#fff9f0] to-[#fef3e0]'}`}>
      <Navbar />
      {/* Optional: Background grid */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} style={{ zIndex: -1 }} />

      {/* Main container */}
      <main className="container relative mx-auto px-4 py-20 md:py-28 z-10 flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl w-full">

          {/* Left Side: Text and Doodle */}
          <div className="relative order-2 md:order-1 text-center md:text-left">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-amber-800'}`}>
              Get In Touch
            </h1>
            <p className={`text-lg mb-8 max-w-md mx-auto md:mx-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Have a question, project idea, or just want to connect? I&apos;d love to hear from you! Fill out the form, and I&apos;ll get back to you soon.
            </p>

            {/* Social Links */}
            <div className="flex space-x-6 mb-8 justify-center md:justify-start">
              <a href="https://instagram.com/surya_26012k" target="_blank" rel="noopener noreferrer" className="p-2 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-8 h-8 text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://x.com/M_Ramsurya" target="_blank" rel="noopener noreferrer" className="p-2 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-8 h-8 text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/in/ramsurya2614/" target="_blank" rel="noopener noreferrer" className="p-2 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-8 h-8 text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://ramsurya.notion.site/Front-End-Developer-Portfolio-1acb511155fb8093a2beca7c403867bd?pvs=4" target="_blank" rel="noopener noreferrer" className="p-2 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-8 h-8 text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
                </svg>
              </a>
              <a href="https://github.com/Ramsurya-M" target="_blank" rel="noopener noreferrer" className="p-2 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-8 h-8 text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Doodle SVG - positioned absolutely */}
            <div className={`absolute -bottom-20 -left-20 md:-bottom-32 md:-left-32 w-64 h-64 md:w-96 md:h-96 opacity-20 ${theme === 'dark' ? 'opacity-10' : 'opacity-20'} pointer-events-none -z-10`}>
              <Image
                src={DoodleSvg}
                alt="Decorative doodle"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="order-1 md:order-2 w-full">
            {/* Reuse the Contact component which now contains the form */}
            <ContactForm />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="py-10 text-center relative z-10">
        <SparklesText className='spark' text=" Made with ❤️ by Ramsurya" />
      </footer>
    </div>
  );
}
