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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-[#fff9f0] to-[#fef3e0]'}`}>
      <Navbar />
      {/* Optional: Background grid */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} style={{ zIndex: -1 }} />

      {/* Main container */}
      <main className="container relative mx-auto px-4 py-20 md:py-24 z-10 flex-grow flex flex-col items-center">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-orange-400' : 'text-amber-800'}`}>
          My Resume
        </h1>

        {/* Download Button */}
        <a
          href={resumePdfPath}
          download="Ramsurya_Resume.pdf" // Specifies the filename for download
          className={`mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <Download size={18} />
          Download Resume
        </a>

        {/* Embedded PDF Viewer */}
        <div className={`w-full max-w-4xl h-[75vh] rounded-lg shadow-lg overflow-hidden border ${theme === 'dark' ? 'border-purple-500/30' : 'border-amber-300/50'}`}>
          <iframe
            src={`${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=0`} // Basic embed, hides default PDF controls
            title="Ramsurya Resume"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
          {/* Fallback for browsers that don't support iframe embedding well */}
          {/* Consider adding a message here if needed */}
        </div>

        {/* Optional: Add a message if iframe fails or for mobile users */}
        <p className={`mt-8 text-sm text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          If you have trouble viewing the resume above, please use the download button.
        </p>

      </main>

      <Footer />
    </div>
  );
}
