"use client"

import { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/magicui/theme-provider";
import Loader from "@/components/ui/loader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide horizontal scrollbar during loading
    if (isLoading) {
      document.body.style.overflowX = 'hidden'
    } else {
      document.body.style.overflowX = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflowX = ''
    }
  }, [isLoading])

  useEffect(() => {
    // Show loader for at least 3 seconds on first visit
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </ThemeProvider>
  )
}