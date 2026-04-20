import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import "./BackgroundLines.css";

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-7xl lg:text-9xl font-sans py-2 md:py-10 relative z-20 font-black tracking-tighter">
        Hi, I am Ramsurya <br/> <span className="clr">Front-End Developer</span>
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
      “If You Think Math is Hard Try Web Design.”
      </p>
    </BackgroundLines> 
  );
}