"use client";

import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = sidebarRef.current;
      if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/history", {
          username: user.username,
        });
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-72 h-full flex flex-col bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-purple-950/95 text-white shadow-2xl z-50 backdrop-blur-xl border-r border-purple-500/30 transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-700/50 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
            Chat History
          </h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto h-scre">
          <div className="space-y-3">
            {historyData.length > 0 ? (
              <div className="space-y-2">
                {historyData.map((item: any, index: number) => (
                  <Link href={`/chat/${item.id}`}>
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-blue-900/50 rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-purple-500/30"
                    >
                      <h3 className="text-sm font-medium truncate">
                        {item.title}
                      </h3>
                    </Button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    {!loading && historyData.length > 0
                      ? "No History Available"
                      : "Loading history..."}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Start a conversation to see your chat history
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
