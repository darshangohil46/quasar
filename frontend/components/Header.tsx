"use client";
import { useState } from "react";
import type React from "react";

import { Menu, Bot, LogOut } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ALLROUTER, CHATBOT_NAME } from "@/lib/utils";
import Link from "next/link";

export default function Header({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-transparent animate-pulse" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-4">
          <div
            className="group relative p-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 cursor-pointer hover:from-purple-800/50 hover:to-blue-800/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <Link href={ALLROUTER.HOME}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 animate-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping" />
              </div>

              <div className="px-4 py-2 bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                <span className="text-white font-bold text-lg bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  {CHATBOT_NAME}
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              window.location.reload();
            }}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {children}
    </div>
  );
}
