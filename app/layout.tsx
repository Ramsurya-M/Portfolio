import { Source_Code_Pro } from 'next/font/google'
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  weight: ['400', '700']
})

export const metadata = {
  title: "Ramsurya | Front-End Developer",
  description: "Portfolio of Ramsurya - Building premium web experiences with React, Next.js, and 3D interactions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sourceCodePro.variable}>
      <body className="font-mono">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
