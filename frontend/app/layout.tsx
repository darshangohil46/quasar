import type React from "react"
import "./globals.css"
import { Toaster } from "sonner";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" richColors />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "Quasar - AI Chatbot",
  description: "Quasar is your intelligent AI chatbot assistant, here to help you with all your queries.",
};
