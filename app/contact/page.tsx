'use client' // Keep this as we use hooks

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ContactForm from '../Contact'; // Assuming Contact.tsx holds the form logic now
import DoodleSvg from '@/public/Doodle.svg'; // Import the SVG

// Rename component to standard convention
export default function ContactPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="container relative mx-auto px-6 py-32 md:py-32 z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
                Connection
              </h2>
              <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                Let&apos;s talk <br />
                <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>About work.</span>
              </h1>
            </div>

            <p className={`text-xl leading-relaxed max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Have a question, project idea, or just want to connect? I&apos;d love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="group">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Email Me</p>
                <a href="mailto:ramsurya2614@gmail.com" className={`text-2xl font-bold transition-colors ${theme === 'dark' ? 'text-white hover:text-purple-400' : 'text-neutral-900 hover:text-amber-600'}`}>
                  ramsurya2614@gmail.com
                </a>
              </div>

              <div className="flex gap-4">
                {[
                  { name: 'Github', url: 'https://github.com/Ramsurya-M' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ramsurya2614/' },
                  { name: 'Twitter', url: 'https://x.com/M_Ramsurya' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all ${
                      theme === 'dark' 
                        ? 'border-white/10 text-white hover:bg-white/5 hover:border-purple-500/50' 
                        : 'border-neutral-200 text-neutral-900 shadow-sm hover:bg-neutral-50 hover:border-amber-500/50'
                    }`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-10 rounded-[2.5rem] border backdrop-blur-xl ${
            theme === 'dark' ? 'bg-neutral-900/40 border-white/5 shadow-2xl' : 'bg-white border-neutral-200 shadow-xl'
          }`}>
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
