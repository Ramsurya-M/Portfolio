'use client'

import Image from 'next/image'

const About = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">About Me</h1>
          <p className="text-base sm:text-lg mb-3 sm:mb-4 px-4 md:px-0">
            Hello! I&apos;m a passionate developer with a keen interest in building innovative web solutions. 
            I specialize in modern web technologies and love creating seamless user experiences.
          </p>
          <p className="text-base sm:text-lg mb-3 sm:mb-4 px-4 md:px-0">
            With several years of experience in web development, I've worked on various projects 
            ranging from small business websites to large-scale applications.
          </p>
          <p className="text-base sm:text-lg px-4 md:px-0">
            When I&apos;m not coding, you can find me exploring new technologies, contributing to 
            open-source projects, or sharing knowledge with the developer community.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden">
            <Image
              src="/Avatar.png"
              alt="Profile Picture"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 640px) 12rem, (max-width: 768px) 16rem, 20rem"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
