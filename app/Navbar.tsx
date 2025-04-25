"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react"; // Import Menu and X icons
import "./Navbar.css";
import { AvatarDemo } from "@/components/ui/AvatarDemo";
import Link from "next/link";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to close mobile menu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!mounted) {
    return null;
  }

  // Navigation links data
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/certificates", label: "Certificates" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed w-full border-b border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-gray-950/50 backdrop-blur-xl z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Add the theme toggle button here */}
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
            
          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8"> {/* Adjusted spacing */}
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right side: Avatar and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <AvatarDemo/>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-950/95 backdrop-blur-lg shadow-md" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu} // Close menu on link click
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;