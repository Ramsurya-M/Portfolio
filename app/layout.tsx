import { Source_Code_Pro } from 'next/font/google'
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/magicui/theme-provider";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: "Portfolio",
  description: "My Portfolio Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sourceCodePro.variable}`}>
      <body className="font-mono">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
