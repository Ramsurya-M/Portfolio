"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import "./Navbar.css";
import { AvatarDemo } from "@/components/ui/AvatarDemo";
import { usePathname } from 'next/navigation';

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
          {/* Logo/Brand */}
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
          <div className="flex-shrink-0">
            <AvatarDemo/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;