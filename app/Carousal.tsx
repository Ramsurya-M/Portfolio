import React from 'react'

const Carousal = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-gray-950">
      {/* Add blur effects on both sides */}
      <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent dark:from-gray-950"></div>
      <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent dark:from-gray-950"></div>
      
      <div className="flex w-full">
        <div className="flex animate-scroll">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
            <li>
              <img src="/logo/html.svg" alt="Brand 1" className="h-12" />
            </li>
            <li>
              <img src="/logo/css.svg" alt="Brand 2" className="h-12" />
            </li>
            <li>
              <img src="/logo/javascript.svg" alt="Brand 3" className="h-12" />
            </li>
            <li>
              <img src="/logo/bootstrap.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/react.svg" alt="Brand 2" className="h-12" />
            </li>
            <li>
              <img src="/logo/npm.svg" alt="Brand 3" className="h-12" />
            </li>
            <li>
              <img src="/logo/git.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/vscode.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/vite.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/sublime.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/github.svg" alt="Brand 4" className="h-12 dark:invert" />
            </li>
            <li>
              <img src="/logo/next.svg" alt="Brand 4" className="h-12 dark:invert" />
            </li>
            <li>
              <img src="/logo/tailwindcss.svg" alt="Brand 4" className="h-12" />
            </li>
          </ul>
          {/* Duplicate for seamless scrolling */}
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
            <li>
              <img src="/logo/html.svg" alt="Brand 1" className="h-12" />
            </li>
            <li>
              <img src="/logo/css.svg" alt="Brand 2" className="h-12" />
            </li>
            <li>
              <img src="/logo/javascript.svg" alt="Brand 3" className="h-12" />
            </li>
            <li>
              <img src="/logo/bootstrap.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/react.svg" alt="Brand 2" className="h-12" />
            </li>
            <li>
              <img src="/logo/npm.svg" alt="Brand 3" className="h-12" />
            </li>
            <li>
              <img src="/logo/git.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/vscode.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/vite.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/sublime.svg" alt="Brand 4" className="h-12" />
            </li>
            <li>
              <img src="/logo/github.svg" alt="Brand 4" className="h-12 dark:invert" />
            </li>
            <li>
              <img src="/logo/next.svg" alt="Brand 4" className="h-12 dark:invert" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Carousal