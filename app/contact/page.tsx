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
