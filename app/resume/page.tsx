'use client' // Needed for useTheme hook

import React from 'react';
import Navbar from '../Navbar'; // Import Navbar
import Footer from '../Footer';
import { useTheme } from 'next-themes'; // Import useTheme for dark/light mode
import { Download } from 'lucide-react'; // Import Download icon

export default function ResumePage() {
  const { theme } = useTheme();
  const resumePdfPath = '/Resume.pdf'; // Path to your resume in the public folder

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="container relative mx-auto px-6 py-32 md:py-32 z-10 max-w-7xl flex flex-col items-center">
        <div className="w-full space-y-4 mb-16 text-center md:text-left">
          <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
            Professional Profile
          </h2>
          <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            Curriculum <br />
            <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Vitae</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-12 gap-6">
          <p className={`text-lg max-w-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Looking for a more detailed breakdown? Download the full PDF or view it below.
          </p>
          <a
            href={resumePdfPath}
            download="Ramsurya_Resume.pdf"
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                : 'bg-neutral-900 hover:bg-black text-white shadow-xl'
            }`}
          >
            <Download size={20} />
            Download PDF
          </a>
        </div>

        <div className={`w-full h-[80vh] rounded-[2.5rem] overflow-hidden border shadow-2xl ${
          theme === 'dark' ? 'border-white/10 bg-neutral-900/40' : 'border-neutral-200 bg-white'
        } backdrop-blur-xl transition-all duration-500`}>
          <iframe
            src={`${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
            title="Ramsurya Resume"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>

        <p className={`mt-8 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Version 2025 • Ramsurya M
        </p>
      </main>
      <Footer />
    </div>
  );
}
