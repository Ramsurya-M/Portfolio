import React from 'react'
import Image from 'next/image'

const Carousal = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-black">
      <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent dark:from-gray-950"></div>
      <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent dark:from-gray-950"></div>
      
      <div className="flex w-full">
        <div className="flex animate-scroll">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
            <li>
              <Image src="/logo/html.svg" alt="Brand 1" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/css.svg" alt="Brand 2" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/javascript.svg" alt="Brand 3" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/Bootstrap.svg" alt="Brand 4" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/react.svg" alt="Brand 5" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/npm.svg" alt="Brand 6" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/git.svg" alt="Brand 7" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/vscode.svg" alt="Brand 8" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/traeai.svg" alt="Brand 9" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/vite.svg" alt="Brand 9" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/sublime.svg" alt="Brand 10" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/github.svg" alt="Brand 11" width={48} height={48} className="h-12 dark:invert" />
            </li>
            <li>
              <Image src="/logo/next.svg" alt="Brand 12" width={48} height={48} className="h-12 dark:invert" />
            </li>
            <li>
              <Image src="/logo/tailwindcss.svg" alt="Brand 13" width={48} height={48} className="h-12" />
            </li>
          </ul>
          {/* Duplicate for seamless scrolling */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
            <li>
              <Image src="/logo/html.svg" alt="Brand 1" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/css.svg" alt="Brand 2" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/javascript.svg" alt="Brand 3" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/Bootstrap.svg" alt="Brand 4" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/react.svg" alt="Brand 5" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/npm.svg" alt="Brand 6" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/git.svg" alt="Brand 7" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/vscode.svg" alt="Brand 8" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/vite.svg" alt="Brand 9" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/sublime.svg" alt="Brand 10" width={48} height={48} className="h-12" />
            </li>
            <li>
              <Image src="/logo/github.svg" alt="Brand 11" width={48} height={48} className="h-12 dark:invert" />
            </li>
            <li>
              <Image src="/logo/next.svg" alt="Brand 12" width={48} height={48} className="h-12 dark:invert" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Carousal