'use client'

import React from 'react';
import { Button } from '@/components/ui/button';

const Certificate = () => {
  // Sample certificate data - replace with actual data source
  const certificates = [
    {
      id: 1,
      studentName: "Ramsurya",
      courseName: "HTML & CSS",
      completionDate: "2024",
      certificateId: "7a86174JnB11KF7w37",
      instructorName: "GUVI",
      link: "https://www.guvi.in/share-certificate/7a86174JnB11KF7w37",
    },
    {
      id: 2,
      studentName: "Ramsurya",
      courseName: "JavaScript Zero to Hero",
      completionDate: "2024",
      certificateId: "t8c86r1a8pQ9G1917B",
      instructorName: "GUVI",
      link: "https://www.guvi.in/share-certificate/t8c86r1a8pQ9G1917B",
    },
    {
      id: 3,
      studentName: "Ramsurya",
      courseName: "Bootstrap",
      completionDate: "2024",
      certificateId: "7J1v2t345j347U1D99",
      instructorName: "GUVI",
      link: "https://www.guvi.in/share-certificate/7J1v2t345j347U1D99",
    },
    {
      id: 4,
      studentName: "Ramsurya",
      courseName: "React",
      completionDate: "2024",
      certificateId: "287r366B11nJg514xP",
      instructorName: "GUVI",
      link: "https://www.guvi.in/share-certificate/287r366B11nJg514xP",
    },
    {
      id: 5,
      studentName: "Ramsurya",
      courseName: "Git & Github",
      completionDate: "2025",
      certificateId: "z17O24957Iv0CJq17M",
      instructorName: "GUVI",
      link: "https://www.guvi.in/share-certificate/z17O24957Iv0CJq17M",
    },
    {
      id: 6,
      studentName: "Ramsurya",
      courseName: "Front-End Developer",
      completionDate: "2025",
      certificateId: "NA",
      instructorName: "Edex Tech",
      link: "https://drive.google.com/file/d/1CZRwWxw51DbqQyNUOQTYCQ97qtzABBqd/view?usp=sharing",
    }
  ];

  return (
    <div className="min-h-screen bg-white-100 dark:bg-black py-8 px-4 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-9">My Certificates</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            // Certificate Card`

            <div key={cert.id} className="bg-gray-100 dark:bg-gray-900 shadow rounded-lg overflow-hidden w-full transition-shadow duration-300">
              {/* Certificate Header */}
              <div className="text-center py-4 bg-orange-400 dark:bg-orange-400">
                <h2 className="text-xl font-bold text-white">Certificate of Completion</h2>
              </div>

              {/* Certificate Content */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">This is to certify that</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{cert.studentName}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    has successfully completed the course
                  </p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{cert.courseName}</h4>
                </div>

                {/* Certificate Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Date of Completion</p>
                      <p className="font-semibold text-sm dark:text-gray-300">{cert.completionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Certificate ID</p>
                      <p className="font-semibold text-sm dark:text-gray-300">{cert.certificateId}</p>
                    </div>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="mt-4 flex justify-center">
                  <div className="text-center">
                    <div className="border-b-2 border-gray-400 dark:border-gray-600 w-40">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{cert.instructorName}</p>
                    </div>
<Button 
  onClick={() => window.open(cert.link, '_blank')} 
  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded mt-4">View Certificate</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
