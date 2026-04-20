'use client' // Needed for useTheme hook

import React from 'react';
import Navbar from '../Navbar'; // Import Navbar
import Footer from '../Footer';
import { useTheme } from 'next-themes'; // Import useTheme for dark/light mode
import Image from 'next/image'; // Import Image for certificate visuals
// import { verify } from 'crypto'; // Removed unused import

// Sample certificate data (replace with your actual certificates)
const certificates = [
  {
    id: 1,
    title: "Html and Css",
    issuer: "GUVI",
    date: "Issued 2024",
    imageUrl: "/certificates/HtmlCss.png", // Replace with actual image path (e.g., in public/certificates/)
    verifyUrl: "https://www.guvi.in/share-certificate/7a86174JnB11KF7w37" // Replace with actual verification link
  },
  {
    id: 2,
    title: "Javascript",
    issuer: "GUVI",
    date: "Issued 2024",
    imageUrl: "/certificates/Javascript.png", // Replace with actual image path
    verifyUrl: "https://www.guvi.in/share-certificate/t8c86r1a8pQ9G1917B" // Replace with actual verification link
  },
  {
    id: 3,
    title: "Bootstrap",
    issuer: "GUVI",
    date: "Issued  2024",
    imageUrl: "/certificates/Bootstrap.png", // Replace with actual image path
    verifyUrl: "https://www.guvi.in/share-certificate/7J1v2t345j347U1D99" // Replace with actual verification link
  },
  {
    id: 4,
    title: "React",
    issuer: "GUVI",
    date: "Issued 2024",
    imageUrl: "/certificates/React.png", // Replace with actual image path
    verifyUrl: "https://www.guvi.in/share-certificate/287r366B11nJg514xP" // Replace with actual verification link
  },
  {
    id: 5,
    title: "Gti & Github",
    issuer: "GUVI",
    date: "Issued 2025",
    imageUrl: "/certificates/Git.png", // Replace with actual image path
    verifyUrl: "https://www.guvi.in/share-certificate/z17O24957Iv0CJq17M"
  },
  {
    id: 6,
    title: "FrontEnd",
    issuer: "GUVI",
    date: "Issued 2025",
    imageUrl: "/certificates/FrontEnd.jpeg", // Replace with actual image path
    verifyUrl: "https://drive.google.com/file/d/1CZRwWxw51DbqQyNUOQTYCQ97qtzABBqd/view?usp=sharing"
  }
  // Add more certificates as needed
];

export default function CertificatesPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      {/* Main container */}
      <main className="container relative mx-auto px-6 py-32 md:py-32 z-10 max-w-7xl">
        <div className="space-y-4 mb-16">
          <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
            Validation
          </h2>
          <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
            My <br />
            <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>Certifications</span>
          </h1>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className={`rounded-3xl overflow-hidden transition-all duration-500 group border ${
                theme === 'dark' 
                  ? 'bg-neutral-900/40 border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                  : 'bg-white/60 border-neutral-200 hover:border-amber-500/30 hover:shadow-xl shadow-sm'
              } backdrop-blur-sm flex flex-col`}
            >
              {/* Certificate Image */}
              <div className="relative w-full aspect-[4/3] bg-neutral-100 dark:bg-neutral-800/50">
                <Image 
                  src={cert.imageUrl} 
                  alt={`${cert.title} certificate`} 
                  layout="fill" 
                  objectFit="contain"
                  className="p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Certificate Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
                  {cert.title}
                </h2>
                <div className="space-y-1 mb-6">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Issued by: {cert.issuer}
                  </p>
                  <p className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {cert.date}
                  </p>
                </div>
                
                {/* Verification Link */}
                <div className="mt-auto">
                  <a 
                    href={cert.verifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-flex items-center text-sm font-bold tracking-tight ${
                      theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-amber-600 hover:text-amber-700'
                    } transition-colors group/link`}
                  >
                    <span>Verify Credential</span>
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}