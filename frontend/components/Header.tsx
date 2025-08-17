"use client";
import { useState } from "react";
import type React from "react";

import { Menu, Bot, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { CHATBOT_NAME } from "@/lib/utils";

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
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-4">
          <div
            className="group relative p-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 cursor-pointer hover:from-purple-800/50 hover:to-blue-800/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 
                        rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40"
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full 
                        border-2 border-gray-900 animate-ping"
                  ></div>
                  <div
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full 
                        border-2 border-gray-900"
                  ></div>
                </div>

                <div className="flex flex-col">
                  <h1
                    className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                       bg-clip-text text-transparent tracking-wide"
                  >
                    {CHATBOT_NAME}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-blue-500/40 animate-glow-blue" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {children}
    </div>
  );
}
