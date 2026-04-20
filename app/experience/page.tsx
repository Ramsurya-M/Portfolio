"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { motion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

const data: TimelineEntry[] = [
  {
    title: "2025 – Present",
    content: (
      <div>
        <Image 
          src="/logo/Solartis.png" 
          alt="Solartis Logo" 
          width={240}
          height={80}
          className="h-12 w-32 md:h-20 md:w-60 mb-4 ml-0" 
        />
        <h4 className="text-2xl font-bold mb-2">Operations Associate – Solartis LLC</h4>
        <p className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">About the Role:</strong> As an Operations Associate at Solartis LLC, you are a vital part of the team that ensures the smooth execution of insurance-related processes and back-office support tasks. You help maintain accuracy, efficiency, and timeliness in handling insurance data, policy documentation, and customer deliverables.
        </p>
        <div className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">Key Responsibilities:</strong>
          <ul className="list-disc ml-6 mt-1">
            <li>📄 Policy Administration: Process insurance policy data, including new business, renewals, endorsements, and cancellations.</li>
            <li>🔍 Data Entry & Validation: Enter and verify critical data into the system, ensuring high accuracy and compliance with client standards.</li>
            <li>📊 Quality Assurance: Conduct quality checks on completed tasks to ensure output meets defined service levels.</li>
            <li>⏱️ Workflow Management: Manage daily work queues and meet turnaround times for tasks assigned.</li>
            <li>🤝 Client & Team Collaboration: Coordinate with internal teams and support client requests or queries as needed.</li>
            <li>🛠️ Tool Usage: Use internal platforms and client systems to execute tasks efficiently.</li>
          </ul>
        </div>
        <div className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">Skills & Competencies:</strong>
          <ul className="list-disc ml-6 mt-1">
            <li>Strong attention to detail and accuracy</li>
            <li>Good written and verbal communication</li>
            <li>Basic understanding of insurance processes (property & casualty preferred)</li>
            <li>Ability to work with data in spreadsheets and back-office systems</li>
            <li>Time management and task prioritization skills</li>
            <li>Willingness to learn and grow within the insurance operations domain</li>
          </ul>
        </div>
        <div className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">Tools & Platforms You May Use:</strong>
          <ul className="list-disc ml-6 mt-1">
            <li>Solartis Admin Tools</li>
            <li>Excel/Google Sheets</li>
            <li>Policy admin systems (as per client project)</li>
            <li>QA dashboards and ticketing systems</li>
          </ul>
        </div>
        <div className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">Career Growth:</strong> The Operations Associate role is an entry point to deeper involvement in insurance processing, business analysis, client support, or automation testing roles within Solartis. High performers often move into senior associate or team lead positions.
        </div>
      </div>
    ),
  },
  {
    title: "2021 – 2024",
    content: (
      <div>
        <Image
          src="/logo/college.png"
          alt="College Logo"
          width={384}
          height={192}
          className="h-24 w-auto md:h-32 lg:h-48 max-w-full object-contain rounded-lg"
          style={{ maxWidth: "400px" }}
        />
        <h4 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
          Graduate Student – Yadava College of Arts and Science (Autonomous)
        </h4>
        <p className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          I completed my Bachelor of Science in Computer Science at Yadava College of Arts and Science (Autonomous), where I gained a strong foundation in programming, algorithms, and software development. The college provided a vibrant academic environment with experienced faculty, modern labs, and opportunities for hands-on learning through projects and seminars. My time at Yadava College not only enhanced my technical skills but also encouraged teamwork, problem-solving, and continuous learning, preparing me for a successful career in the IT industry.
        </p>
        <div className="mb-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
          <strong className="text-lg font-bold">Core BSc Computer Science Skills & Experience:</strong>
          <ul className="list-disc ml-6 mt-1">
            <li>Programming in C, C++, Java, and Python</li>
            <li>Data Structures and Algorithms</li>
            <li>Database Management Systems (SQL, MySQL)</li>
            <li>Web Development (HTML, CSS, JavaScript)</li>
            <li>Software Engineering Principles</li>
            <li>Operating Systems and Computer Networks</li>
            <li>Project-based learning and academic seminars</li>
            <li>Teamwork, problem-solving, and analytical thinking</li>
          </ul>
        </div>
      </div>
    ),
  }
];

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-purple-500/30 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#fffcf8]'}`}>
      <Navbar />
      
      {/* Background Grid */}
      <div className={`fixed inset-0 pointer-events-none ${theme === 'dark' ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'}`} style={{ zIndex: 0 }} />

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto py-32 px-6 sm:px-10 lg:px-16">
          <div className="space-y-4 mb-16">
            <h2 className={`text-sm font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-purple-500' : 'text-amber-600'}`}>
              The Journey
            </h2>
            <h1 className={`text-5xl md:text-7xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>
              Experience <br />
              <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>& Education</span>
            </h1>
          </div>
          
          <div ref={ref} className="relative mt-20">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex justify-start pt-10 md:pt-40 md:gap-10"
              >
                <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                  <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-xl">
                    <div className="h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  </div>
                  <h3 className="hidden md:block text-2xl md:pl-20 md:text-5xl font-black text-neutral-300 dark:text-neutral-700">
                    {item.title}
                  </h3>
                </div>

                <div className="relative pl-20 pr-4 md:pl-4 w-full">
                  <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-400">
                    {item.title}
                  </h3>
                  <div className={`p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                    theme === 'dark' 
                      ? 'bg-neutral-900/40 border-white/5 hover:border-purple-500/30' 
                      : 'bg-white/60 border-neutral-200 hover:border-amber-500/30 shadow-sm'
                  }`}>
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Timeline Line */}
            <div
              style={{
                height: height + "px",
              }}
              className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
            >
              <motion.div
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
                className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[20%] rounded-full"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ExperiencePage = () => {
  return (
    <>
      <Navbar />
      <Timeline data={data} />
      <Footer />
    </>
  );
};

export default ExperiencePage;