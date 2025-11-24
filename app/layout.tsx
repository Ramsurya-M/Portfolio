import { Source_Code_Pro } from 'next/font/google'
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  weight: ['400', '700']
})

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
