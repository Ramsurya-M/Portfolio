'use client'

import React from 'react';

const IdCard = () => {
  return (
    <div className="relative w-64 h-96 bg-orange-500 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between p-4 text-white">
      {/* Lanyard Clip Simulation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-8 h-4 bg-gray-700 rounded-t-md"></div>
        <div className="w-4 h-6 bg-gray-600 mx-auto"></div>
        <div className="w-6 h-6 bg-gray-700 rounded-full mx-auto -mt-1 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
      </div>
      {/* Hole Punch */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full z-0"></div>

      {/* Card Content */}
      <div className="flex justify-between items-start mt-6">
        <span className="font-semibold text-sm">NFN Labs</span>
        <span className="text-xs font-mono">#788456</span>
      </div>

      {/* Faded Background Elements (Placeholder) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        {/* Add faded background elements here if needed, e.g., SVG or text */}
        <span className="text-9xl font-bold text-white select-none">?</span>
      </div>

      <div className="relative z-10 mt-auto">
        <h2 className="text-3xl font-bold mb-1">JOIN US</h2>
        <p className="text-xs mb-4">Let's get it done</p>
        <p className="text-xs font-light">Careers</p>
      </div>
    </div>
  );
};

export default IdCard;