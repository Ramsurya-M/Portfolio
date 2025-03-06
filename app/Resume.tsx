'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const Resume = () => {
  return (
    <section className="min-h-screen w-full py-10 px-4 sm:px-8 md:px-16 dark:bg-black-900 transition-colors duration-200">
      <div className="w-full mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 dark:text-white">Resume</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Photo */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-square"
            >
<a href="/Resume.jpg" target="_blank" rel="noopener noreferrer">
  <Image
    src="/Resume.jpg"
    alt="Resume Photo"
    fill
    className="object-contain"
    priority
  />
</a>
            </motion.div>
          </div>

          {/* Resume Content */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Experience Section */}
              {/* <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white">Experience</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                    <h4 className="text-lg sm:text-xl font-medium dark:text-white">Senior Developer</h4>
                    <p className="text-gray-600 dark:text-gray-400">Company Name • 2020 - Present</p>
                    <p className="mt-2 dark:text-gray-300">Led development of multiple web applications using React and TypeScript.</p>
                  </div>
                </div>
              </div> */}

              {/* Education Section */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white">Education</h3>
                <div className="border-l-4 border-yellow-300 dark:border-yellow-300 pl-4">
                  <h4 className="text-lg sm:text-xl font-medium dark:text-white">SSLC - 12th</h4>
                  <p className="text-gray-600 dark:text-gray-400">Tagore Vidyalayam • 2020 - 2021</p>
                </div>
              </div>
              <div>
                <div className="border-l-4 border-red-600 dark:border-red-600 pl-4">
                  <h4 className="text-lg sm:text-xl font-medium dark:text-white">Bachelor of Computer Science</h4>
                  <p className="text-gray-600 dark:text-gray-400">Madurai Kamarajar University • 2021 - 2024</p>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Html', 'Css', 'JavaScript', 'React', 'Bootstrap', 'TypeScript', 'Node.js', 'Next.js', 'TailwindCSS', 'Git', 'GitHub'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-200 dark:bg-orange-400 rounded-full text-sm transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-orange-500 dark:text-black"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 dark:text-white">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Tamil'].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-200 dark:bg-orange-400 rounded-full text-sm transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-orange-500 dark:text-black"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume
