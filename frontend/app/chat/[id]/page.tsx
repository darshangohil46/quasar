"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import Header from "@/components/Header";
import axios from "axios";
import { useParams } from "next/navigation";
import { ROLE } from "@/lib/utils";
import Loading from "@/app/Loading";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Message {
  id: string;
  content: string;
  role: any;
  timestamp: Date;
}

// {
//   id: "1",
//   content: "Hello! I'm your AI assistant. How can I help you today?",
//   role: "assistant" | "user"
//   timestamp: new Date(),
// },

export default function ChatBot() {
  const params = useParams();
  const { id } = params; // chat id from URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchChat = async () => {
      try {
        const res = await axios.post(`/api/chat/${id}`);
        setMessages(res.data.data || []);
      } catch (error) {
        console.error("Error loading chat:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [id]);

  const handleSendToBackend = async (newMessage: Message) => {
    try {
      const res = await axios.post(`/api/chat/add-message/`, {
        message: newMessage,
        chat_id: id,
      });
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: ROLE.USER,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Send to backend and persist
    const data = await handleSendToBackend(userMessage);

    if (data?.success) {
      setMessages((prev) => [...prev, data.data]);
    }
    setIsTyping(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Header>
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10 pt-[125px]">
        <div className="space-y-6 mb-32">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md shadow-purple-500/40 animate-glow">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-700 via-blue-700 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                    : "!max-w-[100%] w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-100 border border-purple-500/20 shadow-md backdrop-blur-sm"
                }`}
              >
                {message.role === "assistant" ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
                <p className="text-xs mt-2 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md shadow-purple-500/40 animate-glow">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md shadow-purple-500/40">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-100 border border-purple-500/20 shadow-md backdrop-blur-sm px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/70 backdrop-blur-md border-t border-purple-500/30 shadow-xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Card className="p-2 bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-gray-800/90 border border-purple-500/30 shadow-lg shadow-purple-600/30 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/30 focus:outline-none border-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-700 via-blue-700 to-blue-600 text-white rounded-xl px-4 py-2 shadow-md shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Header>
  );
}
