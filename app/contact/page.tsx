'use client' // Keep this as we use hooks

import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { useTheme } from 'next-themes'; // Import useTheme
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
