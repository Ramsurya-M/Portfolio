import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import "./BackgroundLines.css";

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-6 py-40 md:py-60">
      <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-6xl md:text-8xl lg:text-[11rem] font-sans relative z-20 font-black tracking-tighter leading-[0.85] mb-8">
        Hi, I am <br/> Ramsurya <br/> 
        <span className="clr text-3xl md:text-5xl lg:text-6xl tracking-widest uppercase mt-4 block">
          Front-End Developer
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-base md:text-xl text-neutral-600 dark:text-neutral-400 text-center font-medium opacity-80 italic">
      “If You Think Math is Hard Try Web Design.”
      </p>
    </BackgroundLines> 
  );
}