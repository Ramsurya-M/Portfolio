'use client'; // Add 'use client' directive for hooks

import React from 'react';
import { useTheme } from 'next-themes'; // Import useTheme

const SkillsPage = () => {
  // No need to use theme for styling
  // const { theme } = useTheme();

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-white text-gray-700 dark:bg-black dark:text-white">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-900 dark:text-white">My Skills</h1>
      <div className="space-y-8 w-full max-w-2xl">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Programming Languages</h2>
          <p>JavaScript • TypeScript • CSS • HTML</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Frameworks & Libraries</h2>
          <p>React.js • TailwindCSS</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Tools & Technologies</h2>
          <p>Git • GitHub • VS Code • Sublime • npm</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Additional Resources</h2>
          <ul className="list-none space-y-2">
            <li>
              <a 
                href="https://github.com/Ramsurya-M" 
                className="text-black hover:text-blue-800 dark:text-blue-400 dark:hover:text-white hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </li>
            <li>
              <a 
                href="https://www.linkedin.com/in/ramsurya2614/" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
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
