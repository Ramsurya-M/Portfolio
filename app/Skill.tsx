'use client'; // Add 'use client' directive for hooks

import React from 'react';
import { useTheme } from 'next-themes'; // Import useTheme

const SkillsPage = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    // Apply conditional background and text colors to the main container
    <div className={`min-h-screen p-8 flex flex-col items-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>
      {/* Apply conditional text color to the main heading */}
      <h1 className={`text-5xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Skills</h1>
      
      <div className="space-y-8 w-full max-w-2xl">
        <section className="text-center">
          {/* Apply conditional text color to section headings */}
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Programming Languages</h2>
          <p>JavaScript • TypeScript • CSS • HTML</p>
        </section>

        <section className="text-center">
          {/* Apply conditional text color to section headings */}
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Frameworks & Libraries</h2>
          <p>React.js • TailwindCSS</p>
        </section>

        <section className="text-center">
          {/* Apply conditional text color to section headings */}
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Tools & Technologies</h2>
          <p>Git • GitHub • VS Code • Sublime • npm</p>
        </section>

        <section className="text-center">
          {/* Apply conditional text color to section headings */}
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Additional Resources</h2>
          <ul className="list-none space-y-2">
            <li>
              {/* Apply conditional text color to links */}
              <a 
                href="https://github.com/Ramsurya-M" 
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </li>
            <li>
              {/* Apply conditional text color to links */}
              <a 
                href="https://www.linkedin.com/in/ramsurya2614/" 
                className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default SkillsPage;
