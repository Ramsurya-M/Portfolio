'use client'

import React from 'react';

const IdCard = () => {
  return (
    <div className="relative pt-20"> {/* Increased top padding for longer lanyard appearance */}
      {/* Lanyard Strap - Enhanced */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-20 w-7 bg-gradient-to-b from-orange-600 to-orange-500 shadow-inner flex items-center justify-center z-0 rounded-b-sm"> {/* Increased height, width, added gradient and shadow */}
        <span className="text-white text-[10px] font-bold tracking-wider transform -rotate-90 whitespace-nowrap"> {/* Made text bold and wider */}
          NFN LABS
        </span>
      </div>

      {/* Lanyard Clip Simulation - Refined */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"> {/* Adjusted top position */}
        {/* Clip Top Part - Metallic look */}
        <div className="w-6 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-sm mx-auto border-b border-gray-500"></div> {/* Wider, gradient, border */}
        {/* Clip Middle Part */}
        <div className="w-4 h-4 bg-gray-700 mx-auto"></div> {/* Slightly wider */}
         {/* Clip Bottom Hook - More defined */}
         <div className="w-6 h-5 bg-gradient-to-t from-gray-800 to-gray-600 rounded-b-md mx-auto flex justify-center items-end p-0.5 shadow-md"> {/* Wider, gradient, shadow */}
           <div className="w-4 h-2 bg-gray-500 rounded-sm border border-gray-600"></div> {/* Defined inner part */}
         </div>
      </div>

      {/* Main ID Card */}
      <div className="relative w-64 h-96 bg-orange-500 rounded-lg shadow-xl overflow-hidden flex flex-col justify-between p-4 text-white z-10"> {/* Increased shadow */}
        {/* Hole Punch - Adjusted position */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-radial from-gray-200 to-white rounded-full z-0 shadow-inner"></div> {/* Added gradient and shadow */}

        {/* Card Content */}
        <div className="flex justify-between items-start mt-6 z-10">
          <span className="font-semibold text-sm">2004</span>
          <span className="text-xs font-mono">#2601</span>
        </div>

        {/* Faded Background Elements - Placeholder updated */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
          <span className="text-8xl font-bold text-white select-none transform rotate-[-15deg] scale-150">
            &lt;/&gt; {/* Example symbols, adjust as needed */}
          </span>
        </div>

        {/* Bottom Content - Updated to match image */}
        <div className="relative z-10 mt-auto">
          <h2 className="text-3xl font-bold mb-1">Ramsurya</h2>
          <p className="text-xs mb-4">Let&apos;s get it done</p>
          <p className="text-xs font-light">Developer</p>
        </div>
      </div>
    </div>
  );
};

export default IdCard;