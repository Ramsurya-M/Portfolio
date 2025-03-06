import React from 'react';

const SkillsPage = () => {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-center">My Skills</h1>
      
      <div className="space-y-8 w-full max-w-2xl">
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Programming Languages</h2>
          <p>JavaScript • TypeScript • CSS • HTML</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Frameworks & Libraries</h2>
          <p>React.js • TailwindCSS</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Tools & Technologies</h2>
          <p>Git • GitHub • VS Code • Sublime • npm</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
          <ul className="list-none space-y-2">
            <li>
              <a 
                href="https://github.com/Ramsurya-M" 
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </li>
            <li>
              <a 
                href="https://www.linkedin.com/in/ramsurya2614/" 
                className="text-blue-600 hover:underline"
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
