"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import "./Navbar.css";
import { AvatarDemo } from "@/components/ui/AvatarDemo";
import Link from "next/link";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed w-full border-b border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-gray-950/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            </div>
            
            {/* Navigation Links */}
            <div> 
            <div className="hidden md:flex space-x-10">
              <Link 
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Home
              </Link>
              <Link 
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                About
              </Link>
              <Link 
                href="/projects"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Projects
              </Link>
              <Link 
                href="/certificates"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Certificates
              </Link>
              <Link 
                href="/resume"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Resume
              </Link>
              <Link 
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <AvatarDemo/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;