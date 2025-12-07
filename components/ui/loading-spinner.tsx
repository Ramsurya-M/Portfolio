"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        />
        <p className="text-foreground font-mono text-sm" aria-hidden="true">
          Loading...
        </p>
        <span className="sr-only">Loading content, please wait.</span>
      </motion.div>
    </div>
  )
}