"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Camera, FileImage, Upload, Globe, ChevronRight } from "lucide-react";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <Header>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-12">
            What can I help you build?
          </h1>

          {/* Input Section */}
          <div className="relative mb-8">
            <div className="relative">
              <Input
                placeholder="Ask v0 to build..."
                className="w-full h-16 px-6 text-lg bg-gray-900 border-gray-700 rounded-xl focus:border-gray-600 focus:ring-0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="text-xs">+</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3"
                >
                  Agent
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Clone a Screenshot
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <FileImage className="w-4 h-4 mr-2" />
              Import from Figma
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload a Project
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Landing Page
            </Button>
          </div>
        </div>
      </main>

      {/* Community Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">From the Community</h2>
              <p className="text-gray-400">
                Explore what the community is building with v0.
              </p>
            </div>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Browse All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Project Cards */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs opacity-75 mb-1">
                    ENERGY CONSUMPTION
                  </div>
                  <div className="text-sm font-medium">Dashboard Design</div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 relative flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-lg font-bold mb-2">
                    Unleash the Power of AI Agents
                  </h3>
                  <div className="text-xs opacity-75">
                    Popular • Dashboard • Pricing • Implementation
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 px-2 py-1 rounded text-xs text-white">
                    SAAS
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="bg-black/50 px-3 py-2 rounded-lg">
                    <div className="text-xs font-medium">AcMem</div>
                    <div className="text-xs opacity-75">
                      Help your LLM remember the right stuff
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Header>
  );
}
