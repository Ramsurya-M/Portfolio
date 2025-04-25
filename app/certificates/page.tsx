'use client' // Needed for useTheme hook

import React from 'react';
import Navbar from '../Navbar'; // Import Navbar
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-[#fff9f0] to-[#fef3e0]'}`}>
      <Navbar />
      {/* Optional: Background grid */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-grid-purple-900/[0.05]' : 'bg-grid-amber-900/[0.03]'}`} style={{ zIndex: -1 }} />

      {/* Main container */}
      <main className="container relative mx-auto px-4 py-24 md:py-32 z-10">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${theme === 'dark' ? 'text-orange-400' : 'text-amber-800'}`}>
          My Certificates
        </h1>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {certificates.map((cert) => (
            <div 
              key={cert.id} 
              className={`rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gray-800/70 border border-purple-500/30' : 'bg-white/80 border border-amber-300/50'} backdrop-blur-sm flex flex-col`} // Added flex flex-col
            >
              {/* Certificate Image */}
              <div className="relative w-full aspect-video"> {/* Use aspect-video for common ratio */}
                <Image 
                  src={cert.imageUrl} 
                  alt={`${cert.title} certificate`} 
                  layout="fill" 
                  objectFit="contain" // Use contain to show the whole certificate
                  className="p-2" // Add padding around image if needed
                />
              </div>
              
              {/* Certificate Content */}
              <div className="p-6 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>
                  {cert.title}
                </h2>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Issued by: {cert.issuer}
                </p>
                <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {cert.date}
                </p>
                {/* Verification Link */}
                <div className="mt-auto"> {/* Pushes link to bottom */}
                  <a 
                    href={cert.verifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-block text-sm font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                  >
                    Verify Certificate &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}